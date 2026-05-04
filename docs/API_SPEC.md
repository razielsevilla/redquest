# RedQuest — API Specification

**Base URL:** `https://api.redquest.app/v1`  
**Auth:** Bearer JWT token in `Authorization` header  
**Format:** All requests and responses are `application/json`  
**Version:** 1.0 (Hackathon MVP)

---

## Authentication

### POST `/auth/register`
Register a new user.

**Request body:**
```json
{
  "name": "Juan dela Cruz",
  "email": "juan@email.com",
  "phone": "09171234567",
  "password": "securepassword",
  "role": "donor",
  "blood_type": "O+",
  "latitude": 14.5995,
  "longitude": 120.9842
}
```

**Response `201`:**
```json
{
  "user": {
    "id": "uuid",
    "name": "Juan dela Cruz",
    "email": "juan@email.com",
    "role": "donor",
    "blood_type": "O+",
    "xp": 0,
    "level": 1
  },
  "access_token": "eyJ...",
  "refresh_token": "eyJ..."
}
```

**Errors:**
- `400` — Validation error (missing fields, invalid blood type)
- `409` — Email already registered

---

### POST `/auth/login`

**Request body:**
```json
{
  "email": "juan@email.com",
  "password": "securepassword"
}
```

**Response `200`:**
```json
{
  "user": { "id": "uuid", "name": "...", "role": "donor", ... },
  "access_token": "eyJ...",
  "refresh_token": "eyJ..."
}
```

---

### POST `/auth/refresh`
Exchange refresh token for new access token.

**Request body:**
```json
{ "refresh_token": "eyJ..." }
```

---

## Users

### GET `/users/me`
Get the authenticated user's profile.

**Response `200`:**
```json
{
  "id": "uuid",
  "name": "Juan dela Cruz",
  "email": "juan@email.com",
  "phone": "09171234567",
  "role": "donor",
  "blood_type": "O+",
  "xp": 1240,
  "level": 4,
  "donation_count": 7,
  "on_cooldown": false,
  "cooldown_until": null,
  "badges": [
    { "slug": "first_blood", "name": "First Blood", "awarded_at": "2026-04-01T10:00:00Z" }
  ],
  "is_available": true
}
```

---

### PATCH `/users/me`
Update profile fields. Donors should update location frequently.

**Request body (all optional):**
```json
{
  "name": "Juan dela Cruz",
  "latitude": 14.6020,
  "longitude": 120.9860,
  "is_available": true,
  "device_token": "fcm_token_here"
}
```

**Response `200`:** Updated user object.

---

## Blood Requests

### POST `/requests`
Post a new blood request. Requester or hospital staff only.

**Request body:**
```json
{
  "hospital_id": "uuid",
  "blood_type": "O+",
  "units_needed": 2,
  "urgency": "urgent",
  "notes": "Post-surgery, needed within 2 hours"
}
```

**Response `201`:**
```json
{
  "id": "uuid",
  "blood_type": "O+",
  "units_needed": 2,
  "urgency": "urgent",
  "status": "matching",
  "hospital": {
    "id": "uuid",
    "name": "St. Luke's Medical Center BGC",
    "address": "5th Ave, Taguig"
  },
  "created_at": "2026-05-04T08:00:00Z"
}
```

**Errors:**
- `400` — Invalid blood type or urgency level
- `404` — Hospital not found
- `429` — Requester has an active request already open

---

### GET `/requests/:id`
Get full status of a blood request. Polls this for real-time updates.

**Response `200`:**
```json
{
  "id": "uuid",
  "blood_type": "O+",
  "urgency": "urgent",
  "status": "rider_dispatched",
  "hospital": { "name": "St. Luke's Medical Center BGC" },
  "active_quest": {
    "id": "uuid",
    "donor_blood_type": "O+",
    "rider": {
      "name": "Ramon Santos",
      "plate_number": "ABC 1234",
      "eta_minutes": 6,
      "status": "en_route_donor"
    }
  },
  "created_at": "2026-05-04T08:00:00Z"
}
```

---

### PATCH `/requests/:id/cancel`
Cancel an open blood request.

**Response `200`:**
```json
{ "status": "cancelled", "cancelled_at": "2026-05-04T08:15:00Z" }
```

**Errors:**
- `400` — Request already complete or cancelled
- `403` — Not the requester's own request

---

### GET `/requests`
List requests for the authenticated user (requester) or hospital (staff).

**Query params:** `status`, `limit`, `offset`

**Response `200`:**
```json
{
  "requests": [ { ... }, { ... } ],
  "total": 12
}
```

---

## Quests

### GET `/quests/active`
Get the donor's currently active quest (if any). Poll this after accepting.

**Response `200`:**
```json
{
  "id": "uuid",
  "status": "accepted",
  "blood_type": "O+",
  "urgency": "urgent",
  "hospital": { "name": "St. Luke's Medical Center BGC", "address": "..." },
  "distance_meters": 1320,
  "expires_at": "2026-05-04T08:05:00Z",
  "rider": {
    "name": "Ramon Santos",
    "plate_number": "ABC 1234",
    "eta_minutes": 4
  },
  "xp_reward": 250
}
```

---

### POST `/quests/:id/accept`
Donor accepts a quest.

**Response `200`:**
```json
{
  "quest_id": "uuid",
  "status": "accepted",
  "rider": {
    "name": "Ramon Santos",
    "plate_number": "ABC 1234",
    "eta_minutes": 4
  },
  "message": "A rider is on their way to you. Please be ready."
}
```

**Errors:**
- `400` — Quest has expired or already been accepted by another donor
- `403` — Donor is on cooldown

---

### POST `/quests/:id/decline`
Donor declines a quest. Anonymous — no data stored linking donor to declination.

**Response `200`:**
```json
{ "status": "declined" }
```

---

### GET `/quests/history`
Donor's past quests (donation history).

**Query params:** `limit`, `offset`

**Response `200`:**
```json
{
  "quests": [
    {
      "id": "uuid",
      "blood_type": "O+",
      "hospital_name": "St. Luke's Medical Center BGC",
      "completed_at": "2026-04-01T11:30:00Z",
      "xp_awarded": 250,
      "status": "complete"
    }
  ],
  "total": 7
}
```

---

## Hospital Check-in

### POST `/checkin`
Hospital staff scans donor QR code to confirm arrival. Triggers XP award.

**Request body:**
```json
{
  "quest_id": "uuid",
  "donor_id": "uuid"
}
```

**Response `200`:**
```json
{
  "status": "complete",
  "xp_awarded": 250,
  "new_total_xp": 1490,
  "level_up": false,
  "badges_awarded": []
}
```

**Errors:**
- `404` — Quest not found or already completed
- `403` — Not authorized (must be hospital_staff role)

---

### GET `/checkin/qr/:quest_id`
Generate QR payload for donor to display at hospital.

**Response `200`:**
```json
{
  "qr_data": "redquest://checkin?quest=uuid&donor=uuid&ts=1746345600",
  "expires_in_hours": 4
}
```

---

## Gamification

### GET `/leaderboard`
Top donors by XP.

**Query params:** `city` (optional), `limit` (default 20)

**Response `200`:**
```json
{
  "leaderboard": [
    {
      "rank": 1,
      "name": "Maria Santos",
      "blood_type": "O-",
      "xp": 6200,
      "level": 6,
      "donation_count": 18
    }
  ],
  "your_rank": 14,
  "your_xp": 1240
}
```

---

### GET `/badges`
List all available badges.

**Response `200`:**
```json
{
  "badges": [
    {
      "slug": "first_blood",
      "name": "First Blood",
      "description": "Complete your first donation",
      "xp_bonus": 100,
      "earned": true,
      "earned_at": "2026-04-01T11:30:00Z"
    }
  ]
}
```

## Deferred Endpoints (7-Day Hackathon)

The following API endpoints are considered out-of-scope for the short hackathon demo and should be implemented after the event if time permits:

- `POST /checkin` and `GET /checkin/qr/:quest_id` — hospital QR check-in can be simulated with a `/checkin/simulate` demo endpoint
- `GET /leaderboard` — leaderboard can be shown as a static screenshot or generated from a simple XP query post-hackathon
- `GET /badges` (full badge-award flow) — badge awarding may be mocked in the demo
- `GET /quests/history` — donation history screens may be omitted or simplified for the demo

For the hackathon MVP, prioritize: `POST /requests`, `GET /requests/:id`, `GET /quests/active`, `POST /quests/:id/accept`, and the notification hooks.

---

## Hospitals

### GET `/hospitals`
Search for partner hospitals.

**Query params:** `city`, `search` (name search), `limit`

**Response `200`:**
```json
{
  "hospitals": [
    {
      "id": "uuid",
      "name": "St. Luke's Medical Center BGC",
      "address": "5th Ave, Taguig",
      "city": "Taguig",
      "latitude": 14.5485,
      "longitude": 121.0467,
      "is_partner": true
    }
  ]
}
```

---

## WebSocket Events

Connect to: `wss://api.redquest.app/v1/socket`  
Authenticate by sending `{ "type": "auth", "token": "eyJ..." }` immediately after connection.

### Server → Client events

| Event | Payload | Description |
|---|---|---|
| `quest:new` | `{ quest_id, blood_type, urgency, hospital_name, distance_meters, expires_at }` | New quest alert for donor |
| `quest:expired` | `{ quest_id }` | Quest expired before donor responded |
| `request:status` | `{ request_id, status, rider? }` | Status update for requester |
| `rider:update` | `{ quest_id, eta_minutes, status }` | Rider ETA update |
| `xp:awarded` | `{ xp_gained, new_total, level_up, new_level?, badges? }` | XP awarded after check-in |

### Client → Server events

| Event | Payload | Description |
|---|---|---|
| `location:update` | `{ latitude, longitude }` | Donor updates their location |
| `subscribe:request` | `{ request_id }` | Requester subscribes to request updates |

---

## Error Response Format

All error responses follow this format:

```json
{
  "error": {
    "code": "QUEST_EXPIRED",
    "message": "This quest has already expired. Please wait for the next one.",
    "status": 400
  }
}
```

### Common error codes

| Code | HTTP | Meaning |
|---|---|---|
| `INVALID_BLOOD_TYPE` | 400 | Blood type not in accepted list |
| `DONOR_ON_COOLDOWN` | 400 | Donor must wait before donating again |
| `QUEST_EXPIRED` | 400 | Quest acceptance window closed |
| `QUEST_TAKEN` | 409 | Another donor already accepted this quest |
| `UNAUTHORIZED` | 401 | Missing or invalid JWT |
| `FORBIDDEN` | 403 | Authenticated but wrong role |
| `NOT_FOUND` | 404 | Resource does not exist |
| `DUPLICATE_REQUEST` | 429 | Requester already has an open request |
