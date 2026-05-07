# RedQuest

A mobile blood donation platform connecting **Donors** and **Requesters** in real-time. Requesters post blood needs at hospitals; nearby compatible donors receive quest notifications and respond. Built with React Native (Expo) + Node.js + PostgreSQL/PostGIS on Railway.

---

## Roles

| Role | Description |
|---|---|
| **Donor** | Registered blood donor. Receives quest alerts when their blood type is needed nearby. Earns XP and levels up with each donation. |
| **Requester** | Person requesting blood on behalf of a patient. Posts blood requests at a hospital. Tracks request status in real-time. |

> Hospitals are **location reference entities** ΓÇö not user roles. Requesters select a hospital as the blood delivery destination when posting a request.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Mobile | React Native (Expo) |
| Backend | Node.js + Express |
| Database | PostgreSQL + PostGIS |
| Infrastructure | Railway |
| Auth | JWT (24h expiry) |
| Push | Expo Push Notifications |

---

## Project Structure

```
redquest/
Γö£ΓöÇΓöÇ backend/
Γöé   Γö£ΓöÇΓöÇ index.js       # Express API server
Γöé   Γö£ΓöÇΓöÇ migrate.js     # Run schema migrations
Γöé   Γö£ΓöÇΓöÇ seed.js        # Seed test data
Γöé   Γö£ΓöÇΓöÇ reset.js       # Drop all tables (Railway reset)
Γöé   Γö£ΓöÇΓöÇ db.js          # PostgreSQL pool
Γöé   Γö£ΓöÇΓöÇ utils.js       # Blood type compatibility
Γöé   Γö£ΓöÇΓöÇ push.js        # Expo push notifications
Γöé   ΓööΓöÇΓöÇ .env           # Environment variables
Γö£ΓöÇΓöÇ mobile/
Γöé   Γö£ΓöÇΓöÇ App.js         # Root navigator
Γöé   ΓööΓöÇΓöÇ src/
Γöé       Γö£ΓöÇΓöÇ screens/   # All app screens
Γöé       Γö£ΓöÇΓöÇ components/# Shared components
Γöé       ΓööΓöÇΓöÇ lib/       # API, storage, theme
ΓööΓöÇΓöÇ docs/              # Architecture & API docs
```

---

## Local Development

### Backend

```bash
cd backend
npm install
cp .env.example .env  # Fill in DATABASE_URL and JWT_SECRET
node migrate.js       # Create tables
node seed.js          # Seed test data
node index.js         # Start server on port 3000
```

### Mobile

```bash
cd mobile
npm install
npx expo start
```

Set `EXPO_PUBLIC_API_BASE_URL` in `mobile/.env` to your local or Railway backend URL.

---

## Test Credentials

After running `seed.js`:

| Role | Email | Password |
|---|---|---|
| Donor | `donor1@test.com` | `password123` |
| Requester | `requester1@test.com` | `password123` |

---

## Railway Database Reset Guide

Use this when you need to wipe all data and start fresh (e.g., after a schema change).

### Option A ΓÇö Using `reset.js` (Recommended)

```bash
# 1. Make sure your .env has the Railway DATABASE_URL
cd backend

# 2. Drop all tables
node reset.js

# 3. Recreate schema
node migrate.js

# 4. Seed fresh test data
node seed.js
```

### Option B ΓÇö Railway Dashboard Query Runner

1. Open **Railway** ΓåÆ your **Postgres service** ΓåÆ **Query** tab
2. Run this to wipe everything:
   ```sql
   DROP SCHEMA public CASCADE;
   CREATE SCHEMA public;
   GRANT ALL ON SCHEMA public TO postgres;
   GRANT ALL ON SCHEMA public TO public;
   ```
3. Then run locally:
   ```bash
   node migrate.js
   node seed.js
   ```

### Option C ΓÇö Direct SQL Drop

```sql
DROP TABLE IF EXISTS notifications  CASCADE;
DROP TABLE IF EXISTS quests         CASCADE;
DROP TABLE IF EXISTS blood_requests CASCADE;
DROP TABLE IF EXISTS users          CASCADE;
DROP TABLE IF EXISTS hospitals      CASCADE;
```

---

## Environment Variables

### `backend/.env`

```env
PORT=3000
DATABASE_URL=postgresql://user:password@host:port/railway
JWT_SECRET=your_secret_key
```

### `mobile/.env`

```env
EXPO_PUBLIC_API_BASE_URL=https://your-railway-url.up.railway.app
```

---

## Core Quest Flow

```
1. Requester posts blood request (hospital + blood type + urgency)
2. System queries donors within 10 km with compatible blood type
3. Creates a quest per donor, notifies the closest one via push
4. Donor receives alert ΓåÆ accepts or declines
   ΓåÆ Accept: quest marked accepted, request marked accepted
   ΓåÆ Decline/Expire (5 min): next donor notified automatically
5. Donor travels to hospital, checks in via app
6. Quest marked completed, XP awarded to donor
7. Blood request marked complete
```

---

## XP & Level System (Donors)

| Level | Name | XP Required |
|---|---|---|
| 1 | Recruit | 0 |
| 2 | Responder | 300 |
| 3 | Guardian | 700 |
| 4 | Hero | 1,500 |
| 5 | Champion | 3,000 |
| 6 | Legend | 6,000 |
| 7 | Elite | 12,000 |

XP per quest: **200** base + **50** (urgent) or **100** (critical).

---

## API Endpoints

See [`docs/API_SPEC.md`](docs/API_SPEC.md) for full documentation.

| Method | Route | Description |
|---|---|---|
| POST | `/auth/register` | Register donor or requester |
| POST | `/auth/login` | Login |
| GET | `/users/me` | Current user profile |
| GET | `/hospitals` | List hospitals (for dropdown) |
| POST | `/requests` | Post blood request |
| GET | `/requests/me` | Requester's own requests |
| GET | `/requests/:id` | Request detail with quests |
| GET | `/quests/active` | Donor's active quest |
| GET | `/quests/history` | Donor's quest history |
| POST | `/quests/:id/accept` | Accept a quest |
| POST | `/quests/:id/decline` | Decline a quest |
| POST | `/checkin/simulate` | Complete a quest (check-in) |
