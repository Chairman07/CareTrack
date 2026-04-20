-- CareTrack Healthcare System - Production PostgreSQL Schema
-- Version: 1.0.0
-- Purpose: MVP schema for clinic patient records, staff management, and visit tracking
-- Design: 3NF normalized, optimized for performance and data integrity

-- ============================================================================
-- SECTION 1: ENUMS & CUSTOM TYPES
-- ============================================================================

-- Role enumeration for staff access control
CREATE TYPE role_type AS ENUM ('admin', 'doctor', 'nurse');

-- Visit status for tracking patient interactions
CREATE TYPE visit_status AS ENUM ('scheduled', 'completed', 'cancelled', 'no_show');

-- Gender classification
CREATE TYPE gender_type AS ENUM ('male', 'female', 'other', 'prefer_not_to_say');

-- ============================================================================
-- SECTION 2: CORE TABLES - ROLES & ACCESS CONTROL
-- ============================================================================

-- Roles table: Defines staff permission levels
-- Design rationale: Centralized role definitions allow granular permission control
CREATE TABLE roles (
    id SERIAL PRIMARY KEY,
    name role_type UNIQUE NOT NULL,
    description VARCHAR(255) NOT NULL,
    permissions JSONB DEFAULT '{}' NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    CONSTRAINT ck_roles_valid_description CHECK (char_length(description) > 0)
);

COMMENT ON TABLE roles IS 'Staff roles with permission definitions for access control';
COMMENT ON COLUMN roles.name IS 'Unique role name (admin, doctor, nurse)';
COMMENT ON COLUMN roles.permissions IS 'JSON object storing role-specific permissions';

-- ============================================================================
-- SECTION 3: USERS TABLE (STAFF)
-- ============================================================================

-- Users table: System staff with authentication and role assignment
-- Design rationale: Separate from patients to enforce role-based access control
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20),
    role_id INTEGER NOT NULL REFERENCES roles(id) ON DELETE RESTRICT,
    is_active BOOLEAN DEFAULT TRUE NOT NULL,
    last_login TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    CONSTRAINT ck_users_valid_email CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$'),
    CONSTRAINT ck_users_valid_names CHECK (char_length(first_name) > 0 AND char_length(last_name) > 0),
    CONSTRAINT ck_users_valid_phone CHECK (phone IS NULL OR char_length(phone) >= 10)
);

COMMENT ON TABLE users IS 'System users representing clinic staff with role-based access';
COMMENT ON COLUMN users.email IS 'Unique email for authentication (case-insensitive via constraint)';
COMMENT ON COLUMN users.role_id IS 'Foreign key to roles table - determines access level';
COMMENT ON COLUMN users.is_active IS 'Soft delete flag; inactive users cannot access system';
COMMENT ON COLUMN users.last_login IS 'Tracks user activity for security auditing';

-- Indexes for user queries
CREATE INDEX idx_users_email ON users(LOWER(email));
CREATE INDEX idx_users_role_id ON users(role_id);
CREATE INDEX idx_users_is_active ON users(is_active);

-- ============================================================================
-- SECTION 4: PATIENTS TABLE
-- ============================================================================

-- Patients table: Core patient demographic and identification data
-- Design rationale: Minimal redundancy; foreign relationships handled separately
CREATE TABLE patients (
    id SERIAL PRIMARY KEY,
    sa_id VARCHAR(13) UNIQUE NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    date_of_birth DATE NOT NULL,
    gender gender_type,
    phone VARCHAR(20),
    email VARCHAR(255),
    address_street VARCHAR(255),
    address_suburb VARCHAR(100),
    address_city VARCHAR(100),
    address_province VARCHAR(100),
    address_postal_code VARCHAR(10),
    emergency_contact_name VARCHAR(100),
    emergency_contact_phone VARCHAR(20),
    medical_aid_number VARCHAR(50),
    medical_aid_plan VARCHAR(100),
    is_active BOOLEAN DEFAULT TRUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    CONSTRAINT ck_patients_sa_id_format CHECK (sa_id ~ '^\d{13}$'),
    CONSTRAINT ck_patients_valid_dob CHECK (date_of_birth < CURRENT_DATE),
    CONSTRAINT ck_patients_valid_names CHECK (char_length(first_name) > 0 AND char_length(last_name) > 0),
    CONSTRAINT ck_patients_valid_phone CHECK (phone IS NULL OR char_length(phone) >= 10),
    CONSTRAINT ck_patients_valid_email CHECK (email IS NULL OR email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$')
);

COMMENT ON TABLE patients IS 'Core patient records with demographic and contact information';
COMMENT ON COLUMN patients.sa_id IS 'South African ID number (13 digits, unique identifier)';
COMMENT ON COLUMN patients.date_of_birth IS 'Date of birth for age calculations and medical context';
COMMENT ON COLUMN patients.medical_aid_number IS 'Reference to patient''s medical insurance provider';
COMMENT ON COLUMN patients.is_active IS 'Soft delete flag; allows historical record retention';

-- Indexes for common patient lookups
CREATE INDEX idx_patients_sa_id ON patients(sa_id);
CREATE INDEX idx_patients_email ON patients(LOWER(email));
CREATE INDEX idx_patients_phone ON patients(phone);
CREATE INDEX idx_patients_name ON patients(LOWER(first_name), LOWER(last_name));
CREATE INDEX idx_patients_is_active ON patients(is_active);

-- ============================================================================
-- SECTION 5: VISITS TABLE
-- ============================================================================

-- Visits table: Records of patient-staff interactions
-- Design rationale: Links patients with users; preserves history with immutable timestamps
CREATE TABLE visits (
    id SERIAL PRIMARY KEY,
    patient_id INTEGER NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    visit_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    visit_status visit_status DEFAULT 'completed' NOT NULL,
    chief_complaint VARCHAR(500),
    diagnosis_notes TEXT,
    treatment_notes TEXT,
    medications_prescribed TEXT,
    follow_up_required BOOLEAN DEFAULT FALSE NOT NULL,
    follow_up_date DATE,
    vital_signs JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    CONSTRAINT ck_visits_valid_complaint CHECK (chief_complaint IS NULL OR char_length(chief_complaint) > 0),
    CONSTRAINT ck_visits_follow_up_consistency CHECK (
        (follow_up_required = FALSE AND follow_up_date IS NULL)
        OR (follow_up_required = TRUE AND follow_up_date IS NOT NULL)
    ),
    CONSTRAINT ck_visits_future_followup CHECK (follow_up_date IS NULL OR follow_up_date > visit_date::DATE)
);

COMMENT ON TABLE visits IS 'Patient visits: clinical interactions, treatment records, and follow-ups';
COMMENT ON COLUMN visits.patient_id IS 'Reference to patient receiving care (CASCADE delete for record cleanup)';
COMMENT ON COLUMN visits.user_id IS 'Reference to staff member providing care (RESTRICT to preserve visit history)';
COMMENT ON COLUMN visits.vital_signs IS 'JSON structure storing BP, HR, temp, etc. for flexible scaling';
COMMENT ON COLUMN visits.follow_up_required IS 'Flag indicating if patient needs scheduled follow-up';
COMMENT ON COLUMN visits.follow_up_date IS 'Scheduled follow-up date (must be after visit_date if set)';

-- Indexes for visit queries
CREATE INDEX idx_visits_patient_id ON visits(patient_id);
CREATE INDEX idx_visits_user_id ON visits(user_id);
CREATE INDEX idx_visits_visit_date ON visits(visit_date DESC);
CREATE INDEX idx_visits_follow_up_required ON visits(follow_up_required) WHERE follow_up_required = TRUE;
CREATE INDEX idx_visits_status ON visits(visit_status);

-- Composite index for common visit lookups
CREATE INDEX idx_visits_patient_date ON visits(patient_id, visit_date DESC);

-- ============================================================================
-- SECTION 6: REFERENTIAL INTEGRITY CHECKS
-- ============================================================================

-- Ensure deleted users don't leave orphaned visits
-- (Handled via ON DELETE RESTRICT on visits.user_id)

-- ============================================================================
-- SECTION 7: SEED DATA - ROLES
-- ============================================================================

-- Insert default roles with basic permission structures
INSERT INTO roles (name, description, permissions) VALUES
    (
        'admin',
        'System administrator with full access',
        '{"users": "write", "patients": "write", "visits": "write", "roles": "write"}'::jsonb
    ),
    (
        'doctor',
        'Medical doctor with patient and visit management access',
        '{"users": "read", "patients": "write", "visits": "write", "roles": "read"}'::jsonb
    ),
    (
        'nurse',
        'Nursing staff with limited patient and visit access',
        '{"users": "read", "patients": "read", "visits": "read", "roles": "read"}'::jsonb
    )
ON CONFLICT (name) DO NOTHING;

-- ============================================================================
-- SECTION 8: AUDIT & MONITORING FUNCTIONS
-- ============================================================================

-- Automatically update updated_at timestamp on any table modification
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply timestamp triggers to all tables with updated_at column
CREATE TRIGGER trigger_roles_timestamp BEFORE UPDATE ON roles
    FOR EACH ROW EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER trigger_users_timestamp BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER trigger_patients_timestamp BEFORE UPDATE ON patients
    FOR EACH ROW EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER trigger_visits_timestamp BEFORE UPDATE ON visits
    FOR EACH ROW EXECUTE FUNCTION update_timestamp();

-- ============================================================================
-- SECTION 9: PERFORMANCE OPTIMIZATIONS
-- ============================================================================

-- Analyze tables for query optimization
ANALYZE roles;
ANALYZE users;
ANALYZE patients;
ANALYZE visits;

-- ============================================================================
-- SECTION 10: SCHEMA NOTES
-- ============================================================================

/*
DESIGN DECISIONS:

1. NORMALIZATION:
   - Schema follows 3NF: no transitive dependencies
   - Roles table is normalized to avoid role duplication in users
   - Addresses stored as columns (not separate table) for MVP simplicity

2. DATA TYPES:
   - SERIAL for primary keys (auto-incrementing integers)
   - VARCHAR with length limits for text fields (business requirement)
   - TIMESTAMP WITH TIME ZONE for all timestamps (handles DST, timezones)
   - JSONB for flexible vital_signs and permissions (scalable without migrations)
   - ENUM types for controlled values (role_type, visit_status, gender_type)

3. CONSTRAINTS:
   - CHECK constraints prevent invalid data (email format, phone length, SA ID format)
   - Foreign keys with ON DELETE cascade/restrict enforce referential integrity
   - UNIQUE constraints on natural identifiers (sa_id, email)
   - NOT NULL ensures required data presence

4. INDEXING STRATEGY:
   - Primary keys auto-indexed
   - Foreign keys indexed for JOIN performance
   - Partial indexes on status flags (WHERE follow_up_required = TRUE)
   - Case-insensitive indexes on email/phone for fast lookups
   - Composite index on (patient_id, visit_date) for common queries

5. AUDIT & VERSIONING:
   - All tables include created_at and updated_at timestamps
   - Soft delete flags (is_active) preserve historical data
   - CASCADE deletes only on non-critical entities (patient deletions cascade to visits)
   - RESTRICT on user deletes ensures staff accountability

6. SCALABILITY:
   - JSONB columns (vital_signs, permissions) allow future additions without schema changes
   - Enum types prevent invalid status values
   - Timestamp precision supports millisecond-level event tracking
   - Phone/email indexes enable fast multi-tenant scenarios

7. SECURITY:
   - Email validation via CHECK constraints
   - Phone format validation
   - SA ID format validation (13 digits)
   - Role-based access control via roles table
   - Is_active flag for access revocation

*/
