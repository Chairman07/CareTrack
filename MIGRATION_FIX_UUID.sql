-- CareTrack Schema Fix Migration
-- Convert INTEGER primary keys to UUID to match Supabase Auth
-- This fixes the RLS policy type mismatch errors

-- ============================================================================
-- STEP 1: Drop the visits table (it has FK to users)
-- ============================================================================
DROP TABLE IF EXISTS public.visits CASCADE;

-- ============================================================================
-- STEP 2: Modify users table - change id from SERIAL to UUID
-- ============================================================================

-- Back up the old users data (if any exists)
CREATE TABLE users_backup AS SELECT * FROM public.users;

-- Drop the old users table
DROP TABLE public.users CASCADE;

-- Recreate users table with UUID primary key
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT auth.uid(),
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
COMMENT ON COLUMN users.id IS 'UUID matching Supabase Auth user ID - enables seamless authentication';
COMMENT ON COLUMN users.email IS 'Unique email for authentication (case-insensitive via constraint)';
COMMENT ON COLUMN users.role_id IS 'Foreign key to roles table - determines access level';
COMMENT ON COLUMN users.is_active IS 'Soft delete flag; inactive users cannot access system';
COMMENT ON COLUMN users.last_login IS 'Tracks user activity for security auditing';

-- Restore data if it existed (optional - comment out if migrating empty database)
-- INSERT INTO users (id, first_name, last_name, email, phone, role_id, is_active, last_login, created_at, updated_at)
-- SELECT id::uuid, first_name, last_name, email, phone, role_id, is_active, last_login, created_at, updated_at FROM users_backup;

-- Create indexes
CREATE INDEX idx_users_email ON users(LOWER(email));
CREATE INDEX idx_users_role_id ON users(role_id);
CREATE INDEX idx_users_is_active ON users(is_active);

-- ============================================================================
-- STEP 3: Recreate visits table with UUID foreign key
-- ============================================================================

CREATE TABLE visits (
    id SERIAL PRIMARY KEY,
    patient_id INTEGER NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
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
COMMENT ON COLUMN visits.user_id IS 'Reference to staff member providing care - UUID matches auth.users (RESTRICT to preserve visit history)';

-- Create indexes
CREATE INDEX idx_visits_patient_id ON visits(patient_id);
CREATE INDEX idx_visits_user_id ON visits(user_id);
CREATE INDEX idx_visits_visit_date ON visits(visit_date);
CREATE INDEX idx_visits_follow_up ON visits(follow_up_required);
CREATE INDEX idx_visits_status ON visits(visit_status);
CREATE INDEX idx_visits_composite_patient_date ON visits(patient_id, visit_date DESC);

-- ============================================================================
-- STEP 4: Recreate auto-update triggers
-- ============================================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for users table
DROP TRIGGER IF EXISTS trigger_users_updated_at ON users;
CREATE TRIGGER trigger_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Trigger for visits table
DROP TRIGGER IF EXISTS trigger_visits_updated_at ON visits;
CREATE TRIGGER trigger_visits_updated_at
    BEFORE UPDATE ON visits
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Trigger for patients table
DROP TRIGGER IF EXISTS trigger_patients_updated_at ON patients;
CREATE TRIGGER trigger_patients_updated_at
    BEFORE UPDATE ON patients
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Trigger for roles table
DROP TRIGGER IF EXISTS trigger_roles_updated_at ON roles;
CREATE TRIGGER trigger_roles_updated_at
    BEFORE UPDATE ON roles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- STEP 5: Clean up backup table
-- ============================================================================

DROP TABLE IF EXISTS users_backup;

-- ============================================================================
-- VERIFICATION
-- ============================================================================

-- Check column types
SELECT 
    table_name, 
    column_name, 
    data_type 
FROM information_schema.columns
WHERE table_name IN ('users', 'visits')
AND column_name IN ('id', 'user_id')
ORDER BY table_name, column_name;

-- List all indexes
SELECT indexname, indexdef FROM pg_indexes
WHERE tablename IN ('users', 'visits', 'patients', 'roles')
ORDER BY tablename, indexname;
