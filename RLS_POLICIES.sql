-- CareTrack Row-Level Security (RLS) Policies - SIMPLIFIED VERSION
-- These policies enforce role-based access control at the database level
-- Execute these statements in Supabase SQL Editor after auth infrastructure is ready

-- ============================================================================
-- ROLES TABLE - Admin only can view and modify
-- ============================================================================

-- Enable RLS on roles table
ALTER TABLE public.roles ENABLE ROW LEVEL SECURITY;

-- Admin can view all roles
CREATE POLICY "Admin can view all roles"
ON public.roles FOR SELECT
USING (
  (SELECT raw_user_meta_data->>'role' FROM auth.users WHERE id = auth.uid()) = 'admin'
);

-- Admin can update roles
CREATE POLICY "Admin can update roles"
ON public.roles FOR UPDATE
USING (
  (SELECT raw_user_meta_data->>'role' FROM auth.users WHERE id = auth.uid()) = 'admin'
)
WITH CHECK (
  (SELECT raw_user_meta_data->>'role' FROM auth.users WHERE id = auth.uid()) = 'admin'
);

-- ============================================================================
-- USERS TABLE - Self-read + admin management
-- ============================================================================

-- Enable RLS on users table
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Users can view their own profile
CREATE POLICY "Users can view their own profile"
ON public.users FOR SELECT
USING (
  auth.uid() = id
);

-- Admin can view all users
CREATE POLICY "Admin can view all users"
ON public.users FOR SELECT
USING (
  (SELECT raw_user_meta_data->>'role' FROM auth.users WHERE id = auth.uid()) = 'admin'
);

-- Users can update their own profile
CREATE POLICY "Users can update their own profile"
ON public.users FOR UPDATE
USING (
  auth.uid() = id
)
WITH CHECK (
  auth.uid() = id
);

-- Admin can update any user (e.g., change role)
CREATE POLICY "Admin can update any user"
ON public.users FOR UPDATE
USING (
  (SELECT raw_user_meta_data->>'role' FROM auth.users WHERE id = auth.uid()) = 'admin'
)
WITH CHECK (
  (SELECT raw_user_meta_data->>'role' FROM auth.users WHERE id = auth.uid()) = 'admin'
);

-- Admin can insert new users
CREATE POLICY "Admin can insert users"
ON public.users FOR INSERT
WITH CHECK (
  (SELECT raw_user_meta_data->>'role' FROM auth.users WHERE id = auth.uid()) = 'admin'
);

-- ============================================================================
-- PATIENTS TABLE - Staff read, Doctor/Admin write
-- ============================================================================

-- Enable RLS on patients table
ALTER TABLE public.patients ENABLE ROW LEVEL SECURITY;

-- Staff can view all active patients
CREATE POLICY "Staff can view all active patients"
ON public.patients FOR SELECT
USING (
  is_active
  AND (
    SELECT raw_user_meta_data->>'role' FROM auth.users WHERE id = auth.uid()
  ) IN ('admin', 'doctor', 'nurse')
);

-- Doctors and admins can insert patient records
CREATE POLICY "Doctor can insert patients"
ON public.patients FOR INSERT
WITH CHECK (
  (
    SELECT raw_user_meta_data->>'role' FROM auth.users WHERE id = auth.uid()
  ) IN ('admin', 'doctor')
);

-- Doctors and admins can update patient records
CREATE POLICY "Doctor can update patient records"
ON public.patients FOR UPDATE
USING (
  (
    SELECT raw_user_meta_data->>'role' FROM auth.users WHERE id = auth.uid()
  ) IN ('admin', 'doctor')
)
WITH CHECK (
  (
    SELECT raw_user_meta_data->>'role' FROM auth.users WHERE id = auth.uid()
  ) IN ('admin', 'doctor')
);

-- Admin can delete patients (soft delete via is_active)
CREATE POLICY "Admin can delete patients"
ON public.patients FOR DELETE
USING (
  (SELECT raw_user_meta_data->>'role' FROM auth.users WHERE id = auth.uid()) = 'admin'
);

-- ============================================================================
-- VISITS TABLE - Staff read, Doctor write
-- ============================================================================

-- Enable RLS on visits table
ALTER TABLE public.visits ENABLE ROW LEVEL SECURITY;

-- Staff can view all visits
CREATE POLICY "Staff can view visits"
ON public.visits FOR SELECT
USING (
  (
    SELECT raw_user_meta_data->>'role' FROM auth.users WHERE id = auth.uid()
  ) IN ('admin', 'doctor', 'nurse')
);

-- Doctors can create visits (must be the creator)
CREATE POLICY "Doctor can create visits"
ON public.visits FOR INSERT
WITH CHECK (
  user_id = auth.uid()
  AND (
    SELECT raw_user_meta_data->>'role' FROM auth.users WHERE id = auth.uid()
  ) IN ('admin', 'doctor')
);

-- Doctors can update their own visits
CREATE POLICY "Doctor can update their visits"
ON public.visits FOR UPDATE
USING (
  user_id = auth.uid()
  AND (
    SELECT raw_user_meta_data->>'role' FROM auth.users WHERE id = auth.uid()
  ) IN ('admin', 'doctor')
)
WITH CHECK (
  user_id = auth.uid()
  AND (
    SELECT raw_user_meta_data->>'role' FROM auth.users WHERE id = auth.uid()
  ) IN ('admin', 'doctor')
);

-- ============================================================================
-- VERIFICATION QUERIES
-- ============================================================================

-- Run these to verify RLS policies are active

-- Check which tables have RLS enabled
SELECT table_name, row_security_enabled
FROM information_schema.tables
WHERE table_schema = 'public'
AND table_name IN ('roles', 'users', 'patients', 'visits');

-- Count active policies per table
SELECT
  tablename,
  COUNT(*) as policy_count
FROM pg_policies
WHERE schemaname = 'public'
AND tablename IN ('roles', 'users', 'patients', 'visits')
GROUP BY tablename
ORDER BY tablename;

-- List all policies with details
SELECT * FROM pg_policies
WHERE schemaname = 'public'
AND tablename IN ('roles', 'users', 'patients', 'visits')
ORDER BY tablename, policyname;

-- ============================================================================
-- SETUP: Set user roles in auth.users metadata
-- ============================================================================

-- Run this AFTER creating test users in Supabase Auth to assign roles:
-- UPDATE auth.users 
-- SET raw_user_meta_data = jsonb_set(raw_user_meta_data, '{role}', '"admin"')
-- WHERE email = 'admin@caretrack.local';
