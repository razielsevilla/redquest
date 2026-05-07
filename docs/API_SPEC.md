# RedQuest — API Specification

**Base URL:** `https://your-railway-url.up.railway.app`  
**Auth:** Bearer JWT token in `Authorization` header (all routes except register/login)

---

## Authentication

### `POST /auth/register`
Register a new user.

**Body:**
```json
{
  "name": "Maria Santos",
  "email": "maria@email.com",
  "phone": "09171234567",
  "password": "password123",
  "role": "requester",
  "blood_type": "O+",
  "lat": 14.5995,
  "lng": 120.9842
}
```

- `role`: `"donor"` | `"requester"` only
- `blood_type`: required for both roles

**Response `201`:**
```json
{ "user": { "id": "uuid", "name": "Maria Santos", "email": "...", "role": "requester" } }
```

---

### `POST /auth/login`
**Body:** `{ "email": "...", "password": "..." }`

**Response `200`:**
```json
{ "token": "jwt_token", "user": { "id": "uuid", "name": "...", "role": "requester", "email": "..." } }
```

---

## Users

### `GET /users/me`
Get current user profile.

**Response `200`:**
```json
{
  "user": {
    "id": "uuid", "name": "...", "email": "...", "phone": "...",
    "role": "donor", "blood_type": "O+",
    "location": { "type": "Point", "coordinates": [120.98, 14.56] },
    "is_available": true, "xp": 450, "level": 2, "donation_count": 3
  }
}
```

---

## Hospitals

### `GET /hospitals`
Get all hospitals (for PostRequest dropdown).

**Response `200`:**
```json
{ "hospitals": [{ "id": "uuid", "name": "St. Luke's Medical Center BGC", "address": "5th Ave, Taguig", "city": "Taguig" }] }
```

---

## Blood Requests

### `POST /requests`
Requester posts a blood request. System automatically finds donors within 10 km.

**Body:**
```json
{
  "hospital_id": "uuid",
  "blood_type": "O+",
  "units_needed": 2,
  "urgency": "urgent",
  "notes": "Post-surgery, ICU bed 3"
}
```

- `urgency`: `"standard"` | `"urgent"` | `"critical"`

**Response `201`:**
```json
{
  "request": { "id": "uuid", "status": "matching", ... },
  "donors": [...],
  "quests": [...]
}
```

---

### `GET /requests/me`
Get all requests posted by the current Requester.

**Response `200`:**
```json
{ "requests": [{ "id": "uuid", "blood_type": "O+", "status": "notified", "hospital_name": "PGH", ... }] }
```

---

### `GET /requests/:id`
Get full details of a blood request including quests and donors.

**Response `200`:**
```json
{
  "request": { "id": "uuid", "status": "accepted", "hospital_name": "...", "requester": { ... } },
  "quests": [{ "id": "uuid", "status": "accepted", "donor": { ... } }]
}
```

---

## Quests

### `GET /quests/active`
Get current donor's active quest (pending or accepted).

**Response `200`:**
```json
{
  "quest": {
    "id": "uuid", "status": "pending",
    "request_blood_type": "O+", "urgency": "urgent", "units_needed": 2,
    "hospital_name": "St. Luke's BGC", "hospital_address": "5th Ave, Taguig",
    "distance_meters": 1420
  }
}
```

---

### `POST /quests/:id/accept`
Donor accepts a quest.

**Response `200`:** `{ "questId": "uuid" }`

---

### `POST /quests/:id/decline`
Donor declines a quest. Next eligible donor is notified automatically.

**Response `200`:** `{ "message": "Quest declined" }`

---

### `GET /quests/history`
Get donor's completed/declined/expired quest history.

**Response `200`:**
```json
{ "quests": [{ "id": "uuid", "status": "completed", "hospital_name": "...", ... }] }
```

---

## Check-in

### `POST /checkin/simulate`
Donor marks quest as completed (simulates hospital arrival).

**Body:** `{ "quest_id": "uuid" }`

**Response `200`:**
```json
{
  "message": "Quest completed successfully",
  "xp_gained": 250,
  "new_xp": 700,
  "leveled_up": true,
  "new_level": 3
}
```

---

## Error Responses

| Status | Meaning |
|---|---|
| 400 | Bad request / validation error |
| 401 | Missing or invalid token |
| 403 | Forbidden (wrong user) |
| 404 | Resource not found |
| 500 | Server error |
