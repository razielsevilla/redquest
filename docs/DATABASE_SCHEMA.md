# RedQuest — Database Schema

## Overview

RedQuest uses **PostgreSQL + PostGIS** on Railway. The system operates on two user roles: **Donor** and **Requester**. Hospitals are location reference entities (not a user role).

---

## Tables

### `hospitals`
Location reference entities. Requesters select a hospital as the blood delivery destination.

| Column | Type | Notes |
|---|---|---|
| `id` | UUID PK | `uuid_generate_v4()` |
| `name` | VARCHAR(200) | Hospital name |
| `address` | TEXT | Street address |
| `city` | VARCHAR(100) | City |
| `location` | GEOGRAPHY(POINT, 4326) | GPS coordinates (PostGIS) |
| `phone` | VARCHAR(20) | Optional |
| `is_partner` | BOOLEAN | Default false |
| `created_at` | TIMESTAMPTZ | |

---

### `users`
Two roles only: `donor` | `requester`.

| Column | Type | Notes |
|---|---|---|
| `id` | UUID PK | |
| `name` | VARCHAR(100) | |
| `email` | VARCHAR(255) UNIQUE | |
| `phone` | VARCHAR(20) | |
| `password_hash` | TEXT | bcrypt |
| `role` | VARCHAR(20) | CHECK IN ('donor', 'requester') |
| `blood_type` | VARCHAR(5) | CHECK IN ('A+','A-','B+','B-','O+','O-','AB+','AB-') |
| `location` | GEOGRAPHY(POINT, 4326) | Donor GPS for proximity matching |
| `is_available` | BOOLEAN | Default true — donor can be matched |
| `cooldown_until` | TIMESTAMPTZ | When donor becomes available again |
| `device_token` | TEXT | Expo push token |
| `xp` | INTEGER | Default 0 |
| `level` | INTEGER | Default 1 |
| `donation_count` | INTEGER | Default 0 |
| `created_at` | TIMESTAMPTZ | |
| `updated_at` | TIMESTAMPTZ | |

---

### `blood_requests`
A Requester posts a blood need at a specific hospital.

| Column | Type | Notes |
|---|---|---|
| `id` | UUID PK | |
| `requester_id` | UUID FK → users | |
| `hospital_id` | UUID FK → hospitals | Blood delivery destination |
| `blood_type` | VARCHAR(5) | Blood type needed |
| `units_needed` | INTEGER | 1–10 |
| `urgency` | VARCHAR(20) | `standard` \| `urgent` \| `critical` |
| `status` | VARCHAR(30) | See statuses below |
| `notes` | TEXT | Optional |
| `search_radius_m` | INTEGER | Default 10000 (10 km, fixed) |
| `created_at` | TIMESTAMPTZ | |
| `updated_at` | TIMESTAMPTZ | |
| `completed_at` | TIMESTAMPTZ | |
| `cancelled_at` | TIMESTAMPTZ | |

**Blood Request Statuses:**

| Status | Meaning |
|---|---|
| `matching` | Finding eligible donors nearby |
| `notified` | A donor has been notified (quest sent) |
| `accepted` | A donor accepted the quest |
| `complete` | Donor checked in — fulfilled |
| `cancelled` | Cancelled by requester |

---

### `quests`
A quest is a donation task assigned to a specific donor for a specific blood request.

| Column | Type | Notes |
|---|---|---|
| `id` | UUID PK | |
| `request_id` | UUID FK → blood_requests | |
| `donor_id` | UUID FK → users | |
| `status` | VARCHAR(20) | See statuses below |
| `notified_at` | TIMESTAMPTZ | When donor was first notified |
| `responded_at` | TIMESTAMPTZ | When donor accepted/declined |
| `expires_at` | TIMESTAMPTZ | Default NOW() + 5 min |
| `distance_meters` | NUMERIC(10,2) | Donor → hospital distance |
| `xp_awarded` | INTEGER | Default 0 |
| `created_at` | TIMESTAMPTZ | |

**Quest Statuses:**

| Status | Meaning |
|---|---|
| `pending` | Awaiting donor response |
| `accepted` | Donor accepted — in progress |
| `declined` | Donor declined — next donor activated |
| `expired` | 5-min timer expired — next donor activated |
| `completed` | Donor checked in successfully |
| `cancelled` | Quest cancelled |

---

### `notifications`
Push notification log.

| Column | Type | Notes |
|---|---|---|
| `id` | UUID PK | |
| `user_id` | UUID FK → users | |
| `type` | VARCHAR(50) | e.g. `quest_alert` |
| `title` | TEXT | |
| `body` | TEXT | |
| `data` | JSONB | Extra payload |
| `sent_at` | TIMESTAMPTZ | |
| `read_at` | TIMESTAMPTZ | |

---

## Quest Flow

```
Requester posts blood_request
  → System finds up to 5 compatible nearby donors (within 10 km)
  → Creates a quest per donor (status: pending, notified_at: NULL)
  → Activates quest for closest donor (sets notified_at, sends push)
  → Donor accepts → quest: accepted, blood_request: accepted
  → Donor checks in → quest: completed, blood_request: complete, XP awarded
  → If donor declines/expires → next closest donor activated
```

---

## Blood Type Compatibility

Donors can donate to recipients needing their type or compatible types (defined in `utils.js`).
