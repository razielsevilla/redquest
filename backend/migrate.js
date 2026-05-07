const { pool } = require('./db');

const runMigrations = async () => {
  try {
    console.log('Running migrations...');

    // Enable PostGIS & UUID
    await pool.query(`CREATE EXTENSION IF NOT EXISTS postgis;`);
    await pool.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`);

    // ── Hospitals ──────────────────────────────────────────────────────────────
    // Hospitals are location reference entities — not a user role.
    // Requesters pick a hospital as the blood delivery destination.
    await pool.query(`
      CREATE TABLE IF NOT EXISTS hospitals (
        id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        name        VARCHAR(200) NOT NULL,
        address     TEXT NOT NULL,
        city        VARCHAR(100) NOT NULL,
        location    GEOGRAPHY(POINT, 4326) NOT NULL,
        phone       VARCHAR(20),
        is_partner  BOOLEAN DEFAULT false,
        created_at  TIMESTAMPTZ DEFAULT NOW()
      );
    `);

    // ── Users ──────────────────────────────────────────────────────────────────
    // Two roles only: donor | requester
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        name            VARCHAR(100) NOT NULL,
        email           VARCHAR(255) UNIQUE NOT NULL,
        phone           VARCHAR(20) NOT NULL,
        password_hash   TEXT NOT NULL,
        role            VARCHAR(20) NOT NULL CHECK (role IN ('donor', 'requester')),
        blood_type      VARCHAR(5) CHECK (blood_type IN ('A+','A-','B+','B-','O+','O-','AB+','AB-')),
        location        GEOGRAPHY(POINT, 4326),
        is_available    BOOLEAN DEFAULT true,
        cooldown_until  TIMESTAMPTZ,
        device_token    TEXT,
        xp              INTEGER DEFAULT 0,
        level           INTEGER DEFAULT 1,
        donation_count  INTEGER DEFAULT 0,
        created_at      TIMESTAMPTZ DEFAULT NOW(),
        updated_at      TIMESTAMPTZ DEFAULT NOW()
      );
    `);

    // ── Blood Requests ─────────────────────────────────────────────────────────
    // A Requester posts a request specifying which hospital needs blood.
    // The hospital's GPS location is used as the donor search origin.
    await pool.query(`
      CREATE TABLE IF NOT EXISTS blood_requests (
        id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        requester_id    UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        hospital_id     UUID NOT NULL REFERENCES hospitals(id),
        blood_type      VARCHAR(5) NOT NULL CHECK (blood_type IN ('A+','A-','B+','B-','O+','O-','AB+','AB-')),
        units_needed    INTEGER NOT NULL DEFAULT 1 CHECK (units_needed BETWEEN 1 AND 10),
        urgency         VARCHAR(20) NOT NULL DEFAULT 'standard' CHECK (urgency IN ('standard','urgent','critical')),
        status          VARCHAR(30) NOT NULL DEFAULT 'matching'
                        CHECK (status IN ('matching','notified','accepted','complete','cancelled')),
        notes           TEXT,
        search_radius_m INTEGER DEFAULT 10000,
        created_at      TIMESTAMPTZ DEFAULT NOW(),
        updated_at      TIMESTAMPTZ DEFAULT NOW(),
        completed_at    TIMESTAMPTZ,
        cancelled_at    TIMESTAMPTZ
      );
    `);

    // ── Quests ─────────────────────────────────────────────────────────────────
    // A quest is a donation task assigned to a specific donor for a specific request.
    await pool.query(`
      CREATE TABLE IF NOT EXISTS quests (
        id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        request_id      UUID NOT NULL REFERENCES blood_requests(id) ON DELETE CASCADE,
        donor_id        UUID NOT NULL REFERENCES users(id),
        status          VARCHAR(20) NOT NULL DEFAULT 'pending'
                        CHECK (status IN ('pending','accepted','declined','expired','completed','cancelled')),
        notified_at     TIMESTAMPTZ DEFAULT NOW(),
        responded_at    TIMESTAMPTZ,
        expires_at      TIMESTAMPTZ DEFAULT NOW() + INTERVAL '5 minutes',
        distance_meters NUMERIC(10,2),
        xp_awarded      INTEGER DEFAULT 0,
        created_at      TIMESTAMPTZ DEFAULT NOW()
      );
    `);

    // ── Notifications ──────────────────────────────────────────────────────────
    await pool.query(`
      CREATE TABLE IF NOT EXISTS notifications (
        id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        user_id     UUID NOT NULL REFERENCES users(id),
        type        VARCHAR(50) NOT NULL,
        title       TEXT NOT NULL,
        body        TEXT NOT NULL,
        data        JSONB,
        sent_at     TIMESTAMPTZ DEFAULT NOW(),
        read_at     TIMESTAMPTZ
      );
    `);

    console.log('Migrations completed successfully.');
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    pool.end();
  }
};

runMigrations();
