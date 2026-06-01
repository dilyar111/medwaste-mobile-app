#!/usr/bin/env node
/**
 * Applies SQL migrations from backend/migrations in lexical order.
 * Tracks applied files in schema_migrations.
 */
const fs = require('fs');
const path = require('path');

const backendDir = path.join(__dirname, '..');
const rootDir = path.join(backendDir, '..');
require('dotenv').config({ path: path.join(backendDir, '.env') });
require('dotenv').config({ path: path.join(rootDir, '.env') });

const { sequelize } = require('../config/db');

function postgresConfigHint() {
  const envPath = path.join(backendDir, '.env');
  return [
    'PostgreSQL is not configured.',
    'Set POSTGRES_URI or DATABASE_URL in backend/.env (see .env.example).',
    `Expected file: ${envPath}`,
    'Example: POSTGRES_URI=postgresql://user:pass@localhost:5432/medwaste',
  ].join('\n');
}

function exitIfNotConfigured() {
  if (sequelize) return;
  console.error(`Migration failed: ${postgresConfigHint()}`);
  process.exit(1);
}

const MIGRATIONS_DIR = path.join(__dirname, '..', 'migrations');

async function ensureMigrationsTable() {
  await sequelize.query(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      name VARCHAR(255) PRIMARY KEY,
      applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);
}

async function getApplied() {
  const [rows] = await sequelize.query('SELECT name FROM schema_migrations ORDER BY name');
  return new Set(rows.map((r) => r.name));
}

async function runMigrations({ close = false } = {}) {
  if (!sequelize) {
    throw new Error(postgresConfigHint());
  }

  await ensureMigrationsTable();

  const applied = await getApplied();
  const files = fs
    .readdirSync(MIGRATIONS_DIR)
    .filter((f) => f.endsWith('.sql'))
    .sort();

  let ran = 0;
  for (const file of files) {
    if (applied.has(file)) {
      console.log(`skip ${file} (already applied)`);
      continue;
    }

    const sql = fs.readFileSync(path.join(MIGRATIONS_DIR, file), 'utf8');
    console.log(`apply ${file}...`);
    await sequelize.query(sql);
    await sequelize.query('INSERT INTO schema_migrations (name) VALUES (:name)', {
      replacements: { name: file },
    });
    ran += 1;
    console.log(`ok ${file}`);
  }

  if (ran === 0) {
    console.log('No pending migrations.');
  } else {
    console.log(`Applied ${ran} migration(s).`);
  }

  if (close) await sequelize.close();
}

module.exports = { runMigrations };

if (require.main === module) {
  exitIfNotConfigured();
  (async () => {
    await sequelize.authenticate();
    console.log('PostgreSQL connection OK');
    await runMigrations({ close: true });
  })().catch((err) => {
    console.error('Migration failed:', err.message);
    process.exit(1);
  });
}
