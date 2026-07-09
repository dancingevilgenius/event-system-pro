-- Widen event_type_code to fit longer codes (e.g. SWORD_LIGHT_SABER)
ALTER TABLE event_type_lu
  ALTER COLUMN event_type_code TYPE varchar(32);
