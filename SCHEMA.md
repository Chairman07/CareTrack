# CareTrack Database Schema Documentation

**Version:** 1.0.0  
**Database:** PostgreSQL 14.5 (Supabase)  
**Status:** Production-Ready  
**Last Updated:** April 21, 2026

---

## 📋 Schema Overview

CareTrack uses a normalized 3NF PostgreSQL schema designed for healthcare clinic operations. The schema supports patient management, staff role-based access control, and visit tracking.

### Key Features
- ✅ **3NF Normalization** - No data redundancy
- ✅ **ACID Compliance** - Full referential integrity
- ✅ **Performance Optimized** - Strategic indexing for common queries
- ✅ **South African Context** - SA ID validation and support
- ✅ **Audit Trail** - Timestamps and soft deletes
- ✅ **Role-Based Access** - Permission-driven design

---

## 🏗️ Table Structures

### 1. **ROLES Table**
Defines system roles and permission levels for staff.

```sql
CREATE TABLE roles (
    id SERIAL PRIMARY KEY,
    name role_type UNIQUE NOT NULL,          -- admin, doctor, nurse
    description VARCHAR(255) NOT NULL,
    permissions JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE
);
```

**Columns:**
- `id`: Auto-incrementing role identifier
- `name`: Unique role name (ENUM: admin, doctor, nurse)
- `description`: Human-readable role description
- `permissions`: JSON object storing role capabilities

**Seed Data:**
```sql
admin   | System administrator with full access
doctor  | Medical doctor with patient and visit management access
nurse   | Nursing staff with limited patient and visit access
```

**Constraints:**
- Primary Key: `id`
- Unique: `name`
- Check: `description` length > 0

---

### 2. **USERS Table**
System staff with authentication and role assignment.

```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20),
    role_id INTEGER NOT NULL REFERENCES roles(id),
    is_active BOOLEAN DEFAULT TRUE,
    last_login TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE
);
```

**Columns:**
- `id`: Auto-incrementing user identifier
- `first_name`, `last_name`: Staff member name (non-empty)
- `email`: Unique email with regex validation
- `phone`: Optional contact number (minimum 10 digits)
- `role_id`: Foreign key to roles table (RESTRICT delete)
- `is_active`: Soft delete flag for access control
- `last_login`: Tracks user activity

**Constraints:**
- Primary Key: `id`
- Unique: `email`
- Foreign Key: `role_id` → `roles(id)` ON DELETE RESTRICT
- Check: Valid email format (regex)
- Check: Valid name length
- Check: Valid phone format

**Indexes:**
- `idx_users_email` - Case-insensitive email lookup
- `idx_users_role_id` - Foreign key performance
- `idx_users_is_active` - Active staff filtering

---

### 3. **PATIENTS Table**
Core patient records with demographic and contact information.

```sql
CREATE TABLE patients (
    id SERIAL PRIMARY KEY,
    sa_id VARCHAR(13) UNIQUE NOT NULL,      -- South African ID
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    date_of_birth DATE NOT NULL,
    gender gender_type,                      -- ENUM
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
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE
);
```

**Columns:**
- `id`: Auto-incrementing patient identifier
- `sa_id`: **Unique** 13-digit South African ID (validated via regex: `^\d{13}$`)
- `first_name`, `last_name`: Patient name (non-empty)
- `date_of_birth`: Must be in the past
- `gender`: ENUM (male, female, other, prefer_not_to_say)
- `phone`, `email`: Contact information (validated)
- `address_*`: Complete address breakdown for flexibility
- `emergency_contact_*`: Emergency contact details
- `medical_aid_*`: Insurance provider information
- `is_active`: Soft delete flag for record retention

**Constraints:**
- Primary Key: `id`
- Unique: `sa_id`
- Check: SA ID format (13 digits)
- Check: Date of birth in past
- Check: Valid email format
- Check: Valid phone format

**Indexes:**
- `idx_patients_sa_id` - Fast lookup by ID number
- `idx_patients_email` - Case-insensitive email search
- `idx_patients_phone` - Phone-based lookup
- `idx_patients_name` - Case-insensitive name search
- `idx_patients_is_active` - Active patient filtering

---

### 4. **VISITS Table**
Records of patient-staff clinical interactions.

```sql
CREATE TABLE visits (
    id SERIAL PRIMARY KEY,
    patient_id INTEGER NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    visit_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    visit_status visit_status DEFAULT 'completed',  -- ENUM
    chief_complaint VARCHAR(500),
    diagnosis_notes TEXT,
    treatment_notes TEXT,
    medications_prescribed TEXT,
    follow_up_required BOOLEAN DEFAULT FALSE,
    follow_up_date DATE,
    vital_signs JSONB,
    created_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE
);
```

**Columns:**
- `id`: Auto-incrementing visit identifier
- `patient_id`: Foreign key to patients (CASCADE delete)
- `user_id`: Foreign key to users (RESTRICT delete for audit trail)
- `visit_date`: Timestamp of visit (default: NOW)
- `visit_status`: ENUM (scheduled, completed, cancelled, no_show)
- `chief_complaint`: Reason for visit (up to 500 chars)
- `diagnosis_notes`, `treatment_notes`: Clinical documentation
- `medications_prescribed`: Medication details
- `follow_up_required`: Boolean flag
- `follow_up_date`: Scheduled follow-up (must be after visit_date)
- `vital_signs`: JSON object for BP, HR, temp, etc.

**Constraints:**
- Primary Key: `id`
- Foreign Key: `patient_id` → `patients(id)` ON DELETE CASCADE
- Foreign Key: `user_id` → `users(id)` ON DELETE RESTRICT
- Check: Valid chief complaint (if provided)
- Check: Follow-up consistency (date only if required)
- Check: Follow-up date > visit date

**Indexes:**
- `idx_visits_patient_id` - All visits for a patient
- `idx_visits_user_id` - All visits by a staff member
- `idx_visits_visit_date` - Recent visits first
- `idx_visits_follow_up_required` - Partial index for pending follow-ups
- `idx_visits_status` - Status filtering
- `idx_visits_patient_date` - Composite for patient visit history

---

## 📊 Relationships

```
┌──────────────┐
│    ROLES     │
├──────────────┤
│ id (PK)      │
│ name (ENUM)  │
│ description  │
│ permissions  │
└──────────────┘
       ▲
       │ (1:N)
       │
┌──────────────────┐
│     USERS        │
├──────────────────┤
│ id (PK)          │
│ role_id (FK)     │──┐
│ email            │  │
│ is_active        │  │
│ last_login       │  │
└──────────────────┘  │
       │ (1:N)        │
       │              │
       │ VISITS       │
       │ (user_id)    │
       │              │
┌──────────────────────────────┐
│      VISITS                  │
├──────────────────────────────┤
│ id (PK)                      │
│ patient_id (FK) ─────┐       │
│ user_id (FK) ────────┼───────┤
│ visit_date           │       │
│ chief_complaint      │       │
│ diagnosis_notes      │       │
│ vital_signs (JSON)   │       │
│ follow_up_date       │       │
└──────────────────────────────┘
       │ (N:1)
       │
┌──────────────────┐
│    PATIENTS      │
├──────────────────┤
│ id (PK)          │
│ sa_id (UNIQUE)   │
│ first_name       │
│ date_of_birth    │
│ phone            │
│ medical_aid_*    │
│ is_active        │
└──────────────────┘
```

---

## 🎯 Design Decisions

### 1. **Normalization (3NF)**
- **Roles table** centralized to avoid duplication
- **Users** separated from patients (different domains)
- **Addresses** denormalized into patients table (MVP simplicity)
- **Visits** normalized: links patients + users + clinical data

### 2. **Data Integrity**
- **Referential Integrity**: Foreign keys with appropriate ON DELETE behavior
  - CASCADE on patient delete → clean up visits
  - RESTRICT on user delete → preserve accountability
- **Constraints**: Email, phone, SA ID format validation
- **UNIQUE Constraints**: SA ID, email prevent duplicates

### 3. **Performance**
- **Indexes on Foreign Keys**: Fast JOINs on visits.patient_id, visits.user_id
- **Indexes on Search Fields**: Email, SA ID, name (case-insensitive)
- **Partial Index**: Follow-ups only (WHERE follow_up_required = TRUE)
- **Composite Index**: (patient_id, visit_date DESC) for visit history

### 4. **Audit & Soft Deletes**
- **Timestamps**: created_at, updated_at preserve history
- **is_active flags**: Allow data retention without true deletion
- **Triggers**: Auto-update updated_at on row modification
- **Last login**: Track staff activity

### 5. **South African Context**
- **SA ID as UNIQUE**: 13-digit national ID (primary patient identifier)
- **Format Validation**: Regex check: `^\d{13}$`
- **Address Structure**: Suburb + city + province (typical SA address format)

### 6. **Scalability**
- **JSONB for vital_signs**: Extensible without schema changes
- **JSONB for permissions**: Add new permissions without altering roles
- **ENUMs**: Prevent invalid status values while allowing future additions
- **Phone/Email Indexes**: Support multi-tenant scenarios

---

## 🔒 Security Considerations

1. **Email Validation**: Regex pattern prevents injection
2. **SA ID Validation**: Only accepts 13 digits
3. **Role-Based Access**: Permissions model in roles table
4. **Soft Deletes**: is_active flag revokes access without data loss
5. **RESTRICT Deletes**: Preserve staff accountability for visits
6. **Timestamps**: Audit trail of all modifications

---

## 📝 Usage Examples

### Insert Patient
```typescript
const patient = await supabase
  .from('patients')
  .insert({
    sa_id: '8801015800184',
    first_name: 'John',
    last_name: 'Doe',
    date_of_birth: '1988-01-01',
    gender: 'male',
    phone: '+27821234567',
    email: 'john@example.com'
  });
```

### Create Visit
```typescript
const visit = await supabase
  .from('visits')
  .insert({
    patient_id: 1,
    user_id: 2,
    chief_complaint: 'Headache',
    diagnosis_notes: 'Mild tension headache',
    treatment_notes: 'Prescribed rest and fluids',
    vital_signs: JSON.stringify({
      temperature: 37.2,
      blood_pressure: '120/80',
      heart_rate: 78
    })
  });
```

### Query Patient Visits
```typescript
const visits = await supabase
  .from('visits')
  .select('*, users(first_name, last_name)')
  .eq('patient_id', 1)
  .order('visit_date', { ascending: false });
```

---

## 🔄 Migration Strategy

**Current Version:** 1.0.0

### Future Considerations
- Diagnosis/ICD-10 codes table (linked to visits)
- Medication database (linked to visits)
- Appointment scheduling
- Patient payment/billing
- Document storage references
- Audit log table (full history)

---

## 📞 Support

For schema modifications or questions:
1. Review this documentation
2. Check Supabase logs for errors
3. Test changes in development first
4. Run advisors before production deployment

---

**Schema Last Deployed:** April 21, 2026  
**Next Review Date:** May 21, 2026
