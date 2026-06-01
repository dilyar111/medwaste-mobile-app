-- Add failed_incident task status and optional incident reason.

BEGIN;

DO $$
DECLARE
  enum_type name;
BEGIN
  SELECT t.typname
  INTO enum_type
  FROM pg_attribute a
  JOIN pg_class c ON c.oid = a.attrelid
  JOIN pg_type t ON t.oid = a.atttypid
  WHERE c.relname = 'tasks'
    AND a.attname = 'status'
    AND t.typtype = 'e'
  LIMIT 1;

  IF enum_type IS NOT NULL AND NOT EXISTS (
    SELECT 1
    FROM pg_enum e
    JOIN pg_type t ON e.enumtypid = t.oid
    WHERE t.typname = enum_type
      AND e.enumlabel = 'failed_incident'
  ) THEN
    EXECUTE format(
      'ALTER TYPE %I ADD VALUE ''failed_incident''',
      enum_type
    );
  END IF;
END $$;

ALTER TABLE tasks ADD COLUMN IF NOT EXISTS "incidentReason" VARCHAR(100);

COMMIT;
