-- Create the event_system_pro database (run as PostgreSQL superuser)
--   psql -U postgres -f create_database.sql

SELECT 'CREATE DATABASE event_system_pro WITH ENCODING ''UTF8'' TEMPLATE template0;'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'event_system_pro')\gexec
