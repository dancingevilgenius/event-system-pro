-- Row-level security on public.user (apply after frontend sends JWT Bearer tokens).
-- Run: psql -U postgres -d event_system_pro -f database/migrations/020_auth_rls.sql

\connect event_system_pro

ALTER TABLE public."user" ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS user_select_authenticated_self ON public."user";
CREATE POLICY user_select_authenticated_self ON public."user"
  FOR SELECT
  TO authenticated
  USING (user_id = api.current_user_id());

DROP POLICY IF EXISTS user_select_authenticated_admin ON public."user";
CREATE POLICY user_select_authenticated_admin ON public."user"
  FOR SELECT
  TO authenticated
  USING (api.has_app_role('admin'));

DROP POLICY IF EXISTS user_select_anon_none ON public."user";
CREATE POLICY user_select_anon_none ON public."user"
  FOR SELECT
  TO anon
  USING (false);

DROP POLICY IF EXISTS user_write_authenticated_admin ON public."user";
CREATE POLICY user_write_authenticated_admin ON public."user"
  FOR ALL
  TO authenticated
  USING (api.has_app_role('admin'))
  WITH CHECK (api.has_app_role('admin'));

NOTIFY pgrst, 'reload schema';
