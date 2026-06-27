-- Remove Åland Islands row with HTML-entity long_name (&Aring;land Islands).
-- Run: psql -U postgres -d event_system_pro -f database/migrations/017_remove_aland_country.sql

\connect event_system_pro

DELETE FROM public.country_lu
WHERE iso2 = 'AX'
   OR long_name = '&Aring;land Islands';
