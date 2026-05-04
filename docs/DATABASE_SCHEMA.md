# RedQuest — Database Schema

**Database:** PostgreSQL 15 + PostGIS extension  
**Version:** 1.0 (Hackathon MVP)

---

## Enable PostGIS

```sql
CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
```

---

## Tables

### `users`
All platform users (donors, requesters, hospital staff). Role determines app flow.

```sql
CREATE TABLE users (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name            VARCHAR(100) NOT NULL,
  email           VARCHAR(255) UNIQUE NOT NULL,
  phone           VARCHAR(20) NOT NULL,
  password_hash   TEXT NOT NULL,
  role            VARCHAR(20) NOT NULL CHECK (role IN ('donor', 'requester', 'hospital_staff', 'rider')),
  blood_type      VARCHAR(5) CHECK (blood_type IN ('A+','A-','B+','B-','O+','O-','AB+','AB-')),
  location        GEOGRAPHY(POINT, 4326),  -- current coordinates (donors only)
  is_available    BOOLEAN DEFAULT true,    -- donor availability toggle
  cooldown_until  TIMESTAMPTZ,             -- donor cannot accept quests until this time
  device_token    TEXT,                    -- FCM push token
  xp              INTEGER DEFAULT 0,
  level           INTEGER DEFAULT 1,
  donation_count  INTEGER DEFAULT 0,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_blood_type ON users(blood_type);
CREATE INDEX idx_users_location ON users USING GIST(location);
CREATE INDEX idx_users_available ON users(is_available) WHERE is_available = true;
```

---

### `hospitals`
Verified hospital registry. Used to validate request locations.

```sql
CREATE TABLE hospitals (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name        VARCHAR(200) NOT NULL,
  address     TEXT NOT NULL,
  city        VARCHAR(100) NOT NULL,
  location    GEOGRAPHY(POINT, 4326) NOT NULL,
  phone       VARCHAR(20),
  is_partner  BOOLEAN DEFAULT false,  -- partner hospitals get priority features
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_hospitals_city ON hospitals(city);
CREATE INDEX idx_hospitals_location ON hospitals USING GIST(location);

-- Seed data (Manila area)
INSERT INTO hospitals (name, address, city, location) VALUES
  ('St. Luke''s Medical Center BGC', '5th Ave, Taguig', 'Taguig', ST_SetSRID(ST_MakePoint(121.0467, 14.5485), 4326)),
  ('Philippine General Hospital', 'Taft Ave, Manila', 'Manila', ST_SetSRID(ST_MakePoint(120.9840, 14.5650), 4326)),
  ('Makati Medical Center', '2 Amorsolo St, Makati', 'Makati', ST_SetSRID(ST_MakePoint(121.0194, 14.5587), 4326));
```

---

### `blood_requests`
A posted request for blood.

```sql
CREATE TABLE blood_requests (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  requester_id    UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  hospital_id     UUID NOT NULL REFERENCES hospitals(id),
  blood_type      VARCHAR(5) NOT NULL CHECK (blood_type IN ('A+','A-','B+','B-','O+','O-','AB+','AB-')),
  units_needed    INTEGER NOT NULL DEFAULT 1 CHECK (units_needed BETWEEN 1 AND 10),
  urgency         VARCHAR(20) NOT NULL DEFAULT 'standard' CHECK (urgency IN ('standard','urgent','critical')),
  status          VARCHAR(30) NOT NULL DEFAULT 'matching'
                  CHECK (status IN ('matching','notified','accepted','rider_dispatched','donor_en_route','donor_arrived','complete','cancelled','escalated')),
  notes           TEXT,
  search_radius_m INTEGER DEFAULT 5000,   -- current search radius in meters
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW(),
  completed_at    TIMESTAMPTZ,
  cancelled_at    TIMESTAMPTZ
);

CREATE INDEX idx_requests_status ON blood_requests(status);
CREATE INDEX idx_requests_blood_type ON blood_requests(blood_type);
CREATE INDEX idx_requests_requester ON blood_requests(requester_id);
CREATE INDEX idx_requests_hospital ON blood_requests(hospital_id);
```

---

### `quests`
Represents a specific assignment between a blood request and a donor.

```sql
CREATE TABLE quests (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  request_id      UUID NOT NULL REFERENCES blood_requests(id) ON DELETE CASCADE,
  donor_id        UUID NOT NULL REFERENCES users(id),
  status          VARCHAR(20) NOT NULL DEFAULT 'pending'
                  CHECK (status IN ('pending','accepted','declined','expired','complete','cancelled')),
  notified_at     TIMESTAMPTZ DEFAULT NOW(),
  responded_at    TIMESTAMPTZ,
  expires_at      TIMESTAMPTZ DEFAULT NOW() + INTERVAL '5 minutes',
  distance_meters NUMERIC(10,2),    -- distance from donor to hospital at time of match
  xp_awarded      INTEGER DEFAULT 0,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_quests_request ON quests(request_id);
CREATE INDEX idx_quests_donor ON quests(donor_id);
CREATE INDEX idx_quests_status ON quests(status);
CREATE INDEX idx_quests_expires ON quests(expires_at) WHERE status = 'pending';
```

---

### `riders`
Dispatch records for motorcycle couriers.

```sql
CREATE TABLE riders (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  quest_id        UUID NOT NULL REFERENCES quests(id),
  rider_user_id   UUID REFERENCES users(id),    -- null if using partner API (Lalamove, Grab)
  partner         VARCHAR(50),                  -- 'lalamove', 'grab', 'internal', 'mock'
  partner_job_id  TEXT,                         -- external job reference from partner API
  status          VARCHAR(20) DEFAULT 'dispatched'
                  CHECK (status IN ('dispatched','en_route_donor','arrived_donor','en_route_hospital','arrived_hospital','complete')),
  rider_name      VARCHAR(100),
  plate_number    VARCHAR(20),
  eta_minutes     INTEGER,
  dispatched_at   TIMESTAMPTZ DEFAULT NOW(),
  donor_picked_up_at    TIMESTAMPTZ,
  donor_dropped_off_at  TIMESTAMPTZ
);

CREATE INDEX idx_riders_quest ON riders(quest_id);
CREATE INDEX idx_riders_status ON riders(status);
```

---

### `donations`
Confirmed donation records. Created when hospital QR check-in is scanned.

```sql
CREATE TABLE donations (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  quest_id        UUID NOT NULL REFERENCES quests(id),
  donor_id        UUID NOT NULL REFERENCES users(id),
  hospital_id     UUID NOT NULL REFERENCES hospitals(id),
  blood_type      VARCHAR(5) NOT NULL,
  units_donated   INTEGER NOT NULL DEFAULT 1,
  confirmed_by    UUID REFERENCES users(id),   -- hospital staff who scanned QR
  confirmed_at    TIMESTAMPTZ DEFAULT NOW(),
  next_eligible   TIMESTAMPTZ                  -- confirmed_at + 56 days
    GENERATED ALWAYS AS (confirmed_at + INTERVAL '56 days') STORED,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_donations_donor ON donations(donor_id);
CREATE INDEX idx_donations_confirmed ON donations(confirmed_at DESC);
```

---

### `badges`
Badge definitions.

```sql
CREATE TABLE badges (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug        VARCHAR(50) UNIQUE NOT NULL,
  name        VARCHAR(100) NOT NULL,
  description TEXT NOT NULL,
  icon_url    TEXT,
  xp_bonus    INTEGER DEFAULT 0
);

INSERT INTO badges (slug, name, description, xp_bonus) VALUES
  ('first_blood',    'First Blood',     'Complete your first donation', 100),
  ('speed_hero',     'Speed Hero',      'Accept a quest within 60 seconds', 50),
  ('night_owl',      'Night Owl',       'Accept a quest between 10 PM and 5 AM', 75),
  ('triple_threat',  'Triple Threat',   'Complete 3 donations in one month', 150),
  ('rare_find',      'Rare Find',       'Donate as AB- or O-', 200),
  ('city_savior',    'City Savior',     'Complete 10 donations', 300),
  ('the_legend',     'The Legend',      'Complete 25 donations', 1000);
```

---

### `user_badges`
Junction table for awarded badges.

```sql
CREATE TABLE user_badges (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  badge_id    UUID NOT NULL REFERENCES badges(id),
  awarded_at  TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, badge_id)
);

CREATE INDEX idx_user_badges_user ON user_badges(user_id);
```

---

### `notifications`
Notification log (for deduplication and debugging).

```sql
CREATE TABLE notifications (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID NOT NULL REFERENCES users(id),
  type        VARCHAR(50) NOT NULL,   -- 'quest_alert', 'status_update', 'xp_awarded', etc.
  title       TEXT NOT NULL,
  body        TEXT NOT NULL,
  data        JSONB,                  -- extra payload (quest_id, etc.)
  sent_at     TIMESTAMPTZ DEFAULT NOW(),
  read_at     TIMESTAMPTZ
);

CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_type ON notifications(type);
```

---

## Key Queries

### Find compatible donors near a request
```sql
SELECT
  u.id,
  u.name,
  u.blood_type,
  u.device_token,
  ROUND(ST_Distance(
    u.location::geography,
    h.location::geography
  )::numeric) AS distance_meters
FROM users u
JOIN hospitals h ON h.id = :hospital_id
WHERE u.role = 'donor'
  AND u.is_available = true
  AND u.blood_type = ANY(:compatible_types)
  AND (u.cooldown_until IS NULL OR u.cooldown_until < NOW())
  AND ST_DWithin(
    u.location::geography,
    h.location::geography,
    :radius_meters
  )
ORDER BY distance_meters ASC
LIMIT 10;
```

### Get leaderboard for a city
```sql
SELECT
  u.id,
  u.name,
  u.xp,
  u.level,
  u.donation_count,
  RANK() OVER (ORDER BY u.xp DESC) AS rank
FROM users u
WHERE u.role = 'donor'
  AND u.donation_count > 0
ORDER BY u.xp DESC
LIMIT 20;
```

### Check if donor is on cooldown
```sql
SELECT
  cooldown_until,
  (cooldown_until > NOW()) AS on_cooldown,
  GREATEST(0, EXTRACT(DAY FROM (cooldown_until - NOW()))) AS days_remaining
FROM users
WHERE id = :donor_id;
```

### Expire pending quests (run as cron every minute)
```sql
UPDATE quests
SET status = 'expired'
WHERE status = 'pending'
  AND expires_at < NOW()
RETURNING id, request_id, donor_id;
```

---

## Indexes Summary

| Table | Index | Type | Purpose |
|---|---|---|---|
| users | location | GIST | Geo-matching radius queries |
| users | blood_type | BTREE | Blood type filter |
| users | is_available | BTREE (partial) | Donor availability filter |
| hospitals | location | GIST | Hospital proximity |
| quests | expires_at | BTREE (partial) | Expired quest cleanup |
| blood_requests | status | BTREE | Active request lookup |
| donations | donor_id | BTREE | Donor history lookup |

## Deferred / Optional Schema Items (7-Day Hackathon)

The following schema elements are relevant to the full product but may be simplified, mocked, or omitted for the hackathon MVP:

- `badges` and `user_badges` — badge award flows can be mocked or surfaced as static UI for the demo
- `donations` table: hospital QR check-in flow can be simulated by a demo endpoint (`/checkin/simulate`) instead of full QR-based confirmation
- Leaderboard-related denormalized tables or caches — leaderboard can be generated from simple XP queries without additional schema optimizations

Keep these items in the repo for future work, but prioritize the core `users`, `blood_requests`, `quests`, and `riders` tables for the demo.
