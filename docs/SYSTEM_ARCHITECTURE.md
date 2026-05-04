# RedQuest — System Architecture

**Version:** 1.0 (Hackathon MVP)

---

## 1. Architecture Overview

RedQuest follows a **mobile-first client-server architecture** with a REST API backend, a PostgreSQL + PostGIS database for geo-matching, Firebase for push notifications, and a real-time layer via WebSockets for status updates.

```
┌─────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                         │
│                                                             │
│   Donor App           Requester App         Rider App       │
│   (React Native)      (React Native)        (React Native)  │
└──────────┬────────────────┬──────────────────┬─────────────┘
           │                │                  │
           │         HTTPS + WebSocket         │
           │                │                  │
┌──────────▼────────────────▼──────────────────▼─────────────┐
│                      API GATEWAY                            │
│              Node.js + Express (REST API)                   │
│         Auth middleware (JWT) · Rate limiting               │
└──────────┬──────────────────────────────────────────────────┘
           │
     ┌─────┴──────────────────────────────┐
     │                                    │
┌────▼──────────────┐          ┌──────────▼────────────┐
│  Business Logic   │          │   Real-time Layer      │
│  - Geo-matching   │          │   Socket.io server     │
│  - Quest lifecycle│          │   Quest status events  │
│  - XP + badges    │          │   Rider location push  │
│  - Notifications  │          └───────────────────────┘
└────┬──────────────┘
     │
┌────▼──────────────┐    ┌─────────────────────────┐
│  PostgreSQL        │    │  Firebase Cloud          │
│  + PostGIS        │    │  Messaging (FCM)         │
│  - Donor index    │    │  - Quest push alerts     │
│  - Geo queries    │    │  - Status notifications  │
└───────────────────┘    └─────────────────────────┘
```

---

## 2. Component Breakdown

### 2.1 Mobile Apps (React Native + Expo)

Three distinct app experiences sharing a common codebase with role-based routing:

**Donor App**
- Registration / profile management
- Incoming quest notification handling
- Quest accept / decline flow
- Rider tracking screen
- QR code display for hospital check-in
- Donation history, XP, badges, leaderboard

**Requester App**
- Post blood request form
- Real-time request status tracking
- Rider and donor ETA display
- Payment screen (Phase 1)

**Rider App (MVP: minimal)**
- Accept dispatch
- Navigate to donor pickup
- Confirm donor pickup and drop-off
- (For hackathon: can be simulated by a tester running the rider screen manually)

### 2.2 Backend API (Node.js + Express)

Stateless REST API. All state is in PostgreSQL. WebSocket server runs alongside for real-time updates.

Key modules:
- `auth/` — Registration, login, JWT issuance
- `users/` — Profile, blood type, location update
- `requests/` — Create, fetch, cancel blood requests
- `quests/` — Match, assign, accept, decline, complete
- `riders/` — Dispatch, ETA, status
- `gamification/` — XP calculation, badge award, leaderboard
- `notifications/` — FCM push trigger wrappers

### 2.3 Database (PostgreSQL + PostGIS)

PostgreSQL is the primary data store. The **PostGIS** extension enables efficient geospatial queries for donor matching.

Key geospatial operations:
- `ST_DWithin` — find donors within radius of a request
- `ST_Distance` — compute exact distance for ranking
- `ST_SetSRID(ST_MakePoint(lng, lat), 4326)` — store and query coordinates

All donor locations are indexed with a `GIST` spatial index for fast range queries.

### 2.4 Push Notifications (Firebase FCM)

- Backend uses Firebase Admin SDK to send targeted push notifications to specific device tokens
- Notification payloads include: quest ID, blood type, urgency, distance, hospital name
- Quest alert notifications are high-priority FCM messages to bypass Doze mode on Android

### 2.5 Real-time Updates (Socket.io)

WebSocket connections maintain real-time state for:
- Requester watching quest status (Searching → Matched → Dispatched → Complete)
- Rider location updates to requester screen (Phase 1)
- Quest expiry countdown synchronization

For hackathon MVP, polling (every 5 seconds) is an acceptable fallback if WebSockets are unstable.

---

## 3. Geo-Matching Algorithm

### Step 1 — Blood Type Filter
```sql
SELECT donor_id FROM donors
WHERE blood_type = ANY(compatible_types(:requested_type))
  AND cooldown_until < NOW()
  AND is_available = true
```

### Step 2 — Radius Search (PostGIS)
```sql
SELECT donor_id,
       ST_Distance(
         location::geography,
         ST_SetSRID(ST_MakePoint(:req_lng, :req_lat), 4326)::geography
       ) AS distance_meters
FROM donors
WHERE ST_DWithin(
  location::geography,
  ST_SetSRID(ST_MakePoint(:req_lng, :req_lat), 4326)::geography,
  :radius_meters
)
ORDER BY distance_meters ASC
LIMIT 10;
```

### Step 3 — Expanding Ring
If no donors are found within the initial radius, the system retries with a larger radius:

| Attempt | Radius | Delay |
|---|---|---|
| 1 | 5 km | Immediate |
| 2 | 10 km | After 3 min (no accepts) |
| 3 | 20 km | After 6 min |
| 4 | City-wide | After 10 min — escalate to hospital |

### Step 4 — Batch Notification
For standard urgency: ping donors one at a time (top 3 by distance, sequentially).  
For urgent/critical: ping top 5 simultaneously.

---

## 4. Quest State Machine

```
POSTED
  │
  ▼
MATCHING ──(no donors found in all rings)──► ESCALATED
  │
  ▼
NOTIFIED ──(5 min timeout, no accept)──► MATCHING (retry next donor)
  │
  ▼
ACCEPTED
  │
  ▼
RIDER_DISPATCHED
  │
  ▼
DONOR_EN_ROUTE
  │
  ▼
DONOR_ARRIVED (QR check-in)
  │
  ▼
COMPLETE
  │
  (or at any point before COMPLETE)
  ▼
CANCELLED
```

---

## 5. Tech Stack Summary

| Layer | Technology | Reason |
|---|---|---|
| Mobile | React Native + Expo | Cross-platform, fast iteration, Expo push works well |
| Navigation | React Navigation v6 | Standard, well-documented |
| API client | Axios | Interceptors for JWT refresh |
| Backend | Node.js + Express | Team familiarity, fast setup |
| Database | PostgreSQL 15 + PostGIS | Geo-queries, relational, free |
| Real-time | Socket.io | Easy WebSocket management |
| Push | Firebase FCM | Free, reliable, works on both platforms |
| Auth | JWT (access + refresh tokens) | Stateless, scalable |
| Storage | AWS S3 / Cloudflare R2 | Profile photos (Phase 1) |
| Hosting | Railway (backend) + Expo Go (mobile demo) | Free tier, instant deploy |
| Payments | GCash / Maya API | Philippines-native payment (Phase 1) |
| CI/CD | GitHub Actions | Auto-deploy on push to main |

---

## 6. Security Considerations

| Concern | Approach |
|---|---|
| Donor location privacy | Store approximate location (barangay-level), not exact coordinates, on profile. Exact location shared only during active quest acceptance. |
| Donor identity to requester | Requester only sees blood type confirmed and ETA — no personal data until both parties consent (Phase 1) |
| JWT security | Short-lived access tokens (15 min) + refresh tokens (7 days), stored in SecureStore |
| API rate limiting | 60 requests/minute per IP via express-rate-limit |
| Data encryption | TLS in transit, AES-256 at rest for sensitive fields |
| Blood type self-declaration | Flagged as unverified until hospital confirms at first donation |

---

## 7. Infrastructure (Hackathon Scale)

```
Expo Go (dev build on device)
       │
       └──► Railway (Node.js API, free tier)
                 │
                 └──► Railway PostgreSQL (free tier, 500 MB)
                 │
                 └──► Firebase (FCM push, free Spark plan)
```

For production scale (Phase 1+), migrate to:
- AWS EC2 + RDS PostgreSQL (Multi-AZ)
- ElastiCache Redis for geo-index caching
- CloudFront CDN
- Auto-scaling groups for API servers

## Deferred for 7-Day Hackathon

To stay focused on a shippable demo, the following architecture features are deferred for the short hackathon timeline:

- Full WebSocket-based real-time layer (use 5s polling for status updates in the demo)
- Live rider GPS tracking map (show static/mock ETA data instead)
- Expanding-ring retry workflow (use a fixed 10 km radius for matching in the demo)
- Robust offline sync / background location handling
- Production-grade CDN, autoscaling and Redis caching (not required for demo scale)

