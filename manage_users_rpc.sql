-- 1. Run this updated SQL query in your Supabase SQL Editor to recreate the function.
-- This updated version deletes any auth user who is NOT a registered admin in public.profiles.
-- This handles "orphan" accounts created during previous partial resets.

CREATE OR REPLACE FUNCTION clear_non_admin_auth_users()
RETURNS void AS $$
BEGIN
  DELETE FROM auth.users
  WHERE id NOT IN (
    SELECT id 
    FROM public.profiles 
    WHERE role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- 2. Execute the function ONCE immediately in the SQL Editor to clean up current orphan users:
SELECT clear_non_admin_auth_users();
