-- B2B multi-tenancy: Company entity, companyId on core tables, single role per user.
-- Run after backup. Idempotent where possible.

BEGIN;

-- ── Enum types ─────────────────────────────────────────────────────────────
DO $$
BEGIN
  CREATE TYPE subscription_plan_enum AS ENUM ('free', 'premium');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
  CREATE TYPE enum_users_role AS ENUM ('admin', 'personnel', 'driver', 'utilizer');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- ── Companies ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  "subscriptionPlan" subscription_plan_enum NOT NULL DEFAULT 'free',
  "paymentStatus" VARCHAR(50) NOT NULL DEFAULT 'active',
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Cast via column type (works with Sequelize enum_companies_* or subscription_plan_enum)
INSERT INTO companies (id, name, "subscriptionPlan", "paymentStatus")
SELECT
  '00000000-0000-4000-8000-000000000001'::uuid,
  'Default Organization',
  'free',
  'active'
WHERE NOT EXISTS (SELECT 1 FROM companies LIMIT 1);

-- ── Utilizers: stable station UUID for user.stationId FK ───────────────────
ALTER TABLE utilizers ADD COLUMN IF NOT EXISTS "stationId" UUID;

UPDATE utilizers
SET "stationId" = gen_random_uuid()
WHERE "stationId" IS NULL;

ALTER TABLE utilizers ALTER COLUMN "stationId" SET NOT NULL;
ALTER TABLE utilizers ALTER COLUMN "stationId" SET DEFAULT gen_random_uuid();

CREATE UNIQUE INDEX IF NOT EXISTS utilizers_station_id_unique
  ON utilizers ("stationId");

-- ── Users.role: array / text → single ENUM ─────────────────────────────────
DO $$
DECLARE
  role_data_type text;
  role_udt_name text;
BEGIN
  SELECT c.data_type, c.udt_name
  INTO role_data_type, role_udt_name
  FROM information_schema.columns c
  WHERE c.table_schema = 'public'
    AND c.table_name = 'users'
    AND c.column_name = 'role';

  IF role_data_type IS NULL THEN
    RETURN;
  END IF;

  IF role_data_type = 'ARRAY' THEN
    ALTER TABLE users ADD COLUMN IF NOT EXISTS role_single enum_users_role;

    UPDATE users
    SET role_single = (
      CASE lower(trim(coalesce(role[1]::text, 'personnel')))
        WHEN 'admin' THEN 'admin'::enum_users_role
        WHEN 'personnel' THEN 'personnel'::enum_users_role
        WHEN 'driver' THEN 'driver'::enum_users_role
        WHEN 'utilizer' THEN 'utilizer'::enum_users_role
        ELSE 'personnel'::enum_users_role
      END
    );

    ALTER TABLE users DROP COLUMN role;
    ALTER TABLE users RENAME COLUMN role_single TO role;
    ALTER TABLE users ALTER COLUMN role SET NOT NULL;
    ALTER TABLE users ALTER COLUMN role SET DEFAULT 'personnel'::enum_users_role;

  ELSIF role_data_type = 'USER-DEFINED' AND role_udt_name <> 'enum_users_role' THEN
    ALTER TABLE users
      ALTER COLUMN role TYPE enum_users_role
      USING (
        CASE lower(trim(role::text))
          WHEN 'admin' THEN 'admin'::enum_users_role
          WHEN 'personnel' THEN 'personnel'::enum_users_role
          WHEN 'driver' THEN 'driver'::enum_users_role
          WHEN 'utilizer' THEN 'utilizer'::enum_users_role
          ELSE 'personnel'::enum_users_role
        END
      );
    ALTER TABLE users ALTER COLUMN role SET NOT NULL;
    ALTER TABLE users ALTER COLUMN role SET DEFAULT 'personnel'::enum_users_role;

  ELSIF role_data_type IN ('character varying', 'text') THEN
    ALTER TABLE users
      ALTER COLUMN role TYPE enum_users_role
      USING (
        CASE lower(trim(role::text))
          WHEN 'admin' THEN 'admin'::enum_users_role
          WHEN 'personnel' THEN 'personnel'::enum_users_role
          WHEN 'driver' THEN 'driver'::enum_users_role
          WHEN 'utilizer' THEN 'utilizer'::enum_users_role
          ELSE 'personnel'::enum_users_role
        END
      );
    ALTER TABLE users ALTER COLUMN role SET NOT NULL;
    ALTER TABLE users ALTER COLUMN role SET DEFAULT 'personnel'::enum_users_role;
  END IF;
END $$;

-- ── Users: tenant + station FKs ────────────────────────────────────────────
ALTER TABLE users ADD COLUMN IF NOT EXISTS "companyId" UUID;

UPDATE users
SET "companyId" = (
  SELECT id FROM companies ORDER BY "createdAt" ASC LIMIT 1
)
WHERE "companyId" IS NULL;

ALTER TABLE users ALTER COLUMN "companyId" SET NOT NULL;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'users_companyId_fkey'
  ) THEN
    ALTER TABLE users
      ADD CONSTRAINT users_companyId_fkey
      FOREIGN KEY ("companyId") REFERENCES companies (id)
      ON UPDATE CASCADE ON DELETE RESTRICT;
  END IF;
END $$;

ALTER TABLE users ADD COLUMN IF NOT EXISTS "stationId" UUID;

UPDATE users u
SET "stationId" = z."stationId"
FROM utilizers z
WHERE z."userId" = u.id
  AND u.role::text = 'utilizer'
  AND u."stationId" IS NULL;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'users_stationId_fkey'
  ) THEN
    ALTER TABLE users
      ADD CONSTRAINT users_stationId_fkey
      FOREIGN KEY ("stationId") REFERENCES utilizers ("stationId")
      ON UPDATE CASCADE ON DELETE SET NULL;
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS users_company_id_idx ON users ("companyId");
CREATE INDEX IF NOT EXISTS users_station_id_idx ON users ("stationId") WHERE "stationId" IS NOT NULL;

-- ── Containers & tasks: companyId ──────────────────────────────────────────
ALTER TABLE containers ADD COLUMN IF NOT EXISTS "companyId" UUID;

UPDATE containers
SET "companyId" = (
  SELECT id FROM companies ORDER BY "createdAt" ASC LIMIT 1
)
WHERE "companyId" IS NULL;

ALTER TABLE containers ALTER COLUMN "companyId" SET NOT NULL;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'containers_companyId_fkey'
  ) THEN
    ALTER TABLE containers
      ADD CONSTRAINT containers_companyId_fkey
      FOREIGN KEY ("companyId") REFERENCES companies (id)
      ON UPDATE CASCADE ON DELETE RESTRICT;
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS containers_company_id_idx ON containers ("companyId");

ALTER TABLE tasks ADD COLUMN IF NOT EXISTS "companyId" UUID;

UPDATE tasks
SET "companyId" = (
  SELECT id FROM companies ORDER BY "createdAt" ASC LIMIT 1
)
WHERE "companyId" IS NULL;

ALTER TABLE tasks ALTER COLUMN "companyId" SET NOT NULL;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'tasks_companyId_fkey'
  ) THEN
    ALTER TABLE tasks
      ADD CONSTRAINT tasks_companyId_fkey
      FOREIGN KEY ("companyId") REFERENCES companies (id)
      ON UPDATE CASCADE ON DELETE RESTRICT;
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS tasks_company_id_idx ON tasks ("companyId");

COMMIT;
