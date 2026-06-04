-- Standardize companies."subscriptionPlan" on the migration-owned enum type.
-- This intentionally avoids Sequelize's generated enum type name:
-- "enum_companies_subscriptionPlan".

BEGIN;

DO $$
BEGIN
  CREATE TYPE subscription_plan_enum AS ENUM ('free', 'premium');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$
DECLARE
  col_udt text;
BEGIN
  SELECT c.udt_name
  INTO col_udt
  FROM information_schema.columns c
  WHERE c.table_schema = 'public'
    AND c.table_name = 'companies'
    AND c.column_name = 'subscriptionPlan';

  IF col_udt IS NULL THEN
    RAISE EXCEPTION 'companies.subscriptionPlan column does not exist';
  END IF;

  IF col_udt <> 'subscription_plan_enum' THEN
    ALTER TABLE companies
      ALTER COLUMN "subscriptionPlan" DROP DEFAULT;

    ALTER TABLE companies
      ALTER COLUMN "subscriptionPlan" TYPE subscription_plan_enum
      USING ("subscriptionPlan"::text::subscription_plan_enum);
  END IF;

  ALTER TABLE companies
    ALTER COLUMN "subscriptionPlan" SET DEFAULT 'free'::subscription_plan_enum;

  ALTER TABLE companies
    ALTER COLUMN "subscriptionPlan" SET NOT NULL;
END $$;

DO $$
BEGIN
  DROP TYPE IF EXISTS enum_companies_subscription_plan;
EXCEPTION
  WHEN dependent_objects_still_exist THEN NULL;
END $$;

DO $$
BEGIN
  DROP TYPE IF EXISTS "enum_companies_subscriptionPlan";
EXCEPTION
  WHEN dependent_objects_still_exist THEN NULL;
END $$;

COMMIT;
