# UUID Migration Guide - CareTrack

## Problem
The original schema used **INTEGER** primary keys for `users.id`, but Supabase Auth uses **UUID**. This causes RLS policy errors like:
```
operator does not exist: uuid = integer
```

## Solution: Use UUIDs

### Step 1: Run the Migration SQL

In Supabase SQL Editor:

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select **CareTrack** project
3. Click **SQL Editor** → **+ New query**
4. Copy the entire contents of `MIGRATION_FIX_UUID.sql`
5. Click **Run**

This migration will:
- Drop the `visits` table (temporarily)
- Convert `users.id` from SERIAL (INTEGER) to UUID
- Recreate `visits` table with `user_id` as UUID
- Restore all indexes and triggers
- Verify the changes

**⚠️ Warning**: This migration will delete all existing visits data. If you have production data, back it up first.

### Step 2: Deploy RLS Policies

Now that the schema uses UUIDs, run the RLS policies:

1. Create a new SQL query in Supabase SQL Editor
2. Copy the entire contents of `RLS_POLICIES.sql`
3. Click **Run**

The RLS policies now correctly match UUID types:
- `auth.uid()` returns UUID ✅
- `users.id` is now UUID ✅
- `visits.user_id` is now UUID ✅
- All comparisons work correctly ✅

### Step 3: Set Up Test Users

After deploying RLS, assign roles to your test users:

```sql
-- For each Supabase Auth user, set their role:

UPDATE auth.users 
SET raw_user_meta_data = jsonb_set(
    COALESCE(raw_user_meta_data, '{}'::jsonb), 
    '{role}', 
    '"admin"'
)
WHERE email = 'admin@caretrack.local';

UPDATE auth.users 
SET raw_user_meta_data = jsonb_set(
    COALESCE(raw_user_meta_data, '{}'::jsonb), 
    '{role}', 
    '"doctor"'
)
WHERE email = 'doctor@caretrack.local';

UPDATE auth.users 
SET raw_user_meta_data = jsonb_set(
    COALESCE(raw_user_meta_data, '{}'::jsonb), 
    '{role}', 
    '"nurse"'
)
WHERE email = 'nurse@caretrack.local';
```

### Step 4: Create Test Staff Records

After assigning roles in auth.users, create corresponding records in public.users (the staff table):

```sql
-- Insert staff records matching auth.users IDs
INSERT INTO public.users (id, first_name, last_name, email, phone, role_id, is_active)
SELECT 
    id,
    'Admin',
    'Staff',
    email,
    '+27123456789',
    (SELECT id FROM roles WHERE name = 'admin'),
    true
FROM auth.users
WHERE raw_user_meta_data->>'role' = 'admin'
AND id NOT IN (SELECT id FROM public.users);

-- Repeat for doctor
INSERT INTO public.users (id, first_name, last_name, email, phone, role_id, is_active)
SELECT 
    id,
    'Doctor',
    'Staff',
    email,
    '+27123456790',
    (SELECT id FROM roles WHERE name = 'doctor'),
    true
FROM auth.users
WHERE raw_user_meta_data->>'role' = 'doctor'
AND id NOT IN (SELECT id FROM public.users);

-- Repeat for nurse
INSERT INTO public.users (id, first_name, last_name, email, phone, role_id, is_active)
SELECT 
    id,
    'Nurse',
    'Staff',
    email,
    '+27123456791',
    (SELECT id FROM roles WHERE name = 'nurse'),
    true
FROM auth.users
WHERE raw_user_meta_data->>'role' = 'nurse'
AND id NOT IN (SELECT id FROM public.users);
```

### Step 5: Verify Everything Works

```sql
-- Check users table structure
SELECT 
    column_name, 
    data_type 
FROM information_schema.columns
WHERE table_name = 'users'
AND column_name IN ('id', 'email', 'role_id')
ORDER BY column_name;

-- Should show:
-- id | uuid
-- email | character varying
-- role_id | integer

-- Check visits table structure
SELECT 
    column_name, 
    data_type 
FROM information_schema.columns
WHERE table_name = 'visits'
AND column_name IN ('id', 'user_id', 'patient_id')
ORDER BY column_name;

-- Should show:
-- id | integer
-- user_id | uuid
-- patient_id | integer

-- Check RLS policies are active (using correct system catalog)
SELECT
  tablename,
  COUNT(*) as policy_count
FROM pg_policies
WHERE schemaname = 'public'
AND tablename IN ('users', 'visits', 'patients', 'roles')
GROUP BY tablename
ORDER BY tablename;

-- Check if RLS is enabled on tables
SELECT 
  c.relname as table_name,
  c.relrowsecurity as rls_enabled
FROM pg_class c
JOIN pg_namespace n ON n.oid = c.relnamespace
WHERE n.nspname = 'public'
AND c.relname IN ('roles', 'users', 'patients', 'visits')
ORDER BY c.relname;

-- Check auth/public.users relationship
SELECT 
    au.id,
    au.email,
    au.raw_user_meta_data->>'role' as auth_role,
    pu.id as staff_id,
    pu.first_name,
    r.name as staff_role
FROM auth.users au
LEFT JOIN public.users pu ON pu.id = au.id
LEFT JOIN roles r ON pu.role_id = r.id
ORDER BY au.email;
```

## How It Works Now

### Authentication Flow
1. User signs in → Supabase Auth creates/retrieves `auth.users` record (UUID id)
2. `auth.uid()` returns the user's UUID
3. This UUID is stored in `public.users.id` (matching FK)
4. Visits reference this UUID via `public.visits.user_id`

### RLS Policy Execution
When a user tries to view visits:
1. `auth.uid()` returns e.g. `a1b2c3d4-e5f6-7890-abcd-ef1234567890` (UUID)
2. RLS policy checks: `user_id = auth.uid()` 
3. Compares: `UUID = UUID` ✅ (type match)
4. Query succeeds if user owns the visit record

## Troubleshooting

**Problem**: "foreign key violation" after migration

**Solution**: Ensure you run Step 4 to create public.users records for each auth.users

---

**Solution**: Ensure all test users are created in Supabase Auth BEFORE running the migration

**Problem**: "id does not exist" when inserting into public.users

**Solution**: Run auth.users role assignment (Step 3) before inserting into public.users

---

## Summary

| Component | Old | New | 
|-----------|-----|-----|
| `users.id` | SERIAL (INTEGER) | UUID |
| `visits.user_id` | INTEGER FK | UUID FK |
| Type matching | ❌ UUID vs INTEGER | ✅ UUID vs UUID |
| RLS policies | ❌ Type errors | ✅ Working |

**Current Status**: ✅ Schema fixed | ✅ RLS policies ready | ⏳ Test users to be created
