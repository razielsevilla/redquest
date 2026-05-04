# RedQuest — Product Specification

**Version:** 1.0 (Hackathon MVP)  
**Last updated:** 2026  
**Scope:** Phase 0 — Core quest loop for demo

---

## 1. Product Vision

RedQuest is an emergency blood donation coordination platform. It reduces the time between a blood need and a confirmed donor by combining geo-matching, push notifications, and on-demand motorcycle transport.

**North star metric:** Time from request posted to donor confirmed (target: under 10 minutes)

---

## 2. User Personas

### Persona A — The Requester
**Name:** Maria, 38, Quezon City  
**Situation:** Her father is in the ICU at St. Luke's needing 2 units of O+ blood after emergency surgery. The hospital blood bank is low. Maria is panicking and has already called 6 relatives with no luck.  
**Goal:** Find a compatible blood donor as fast as possible.  
**Pain point:** She doesn't know who near the hospital has the right blood type, and she has no way to reach them.

### Persona B — The Donor
**Name:** Kuya Jun, 27, Mandaluyong  
**Situation:** He donated blood once before at a mall drive and found it meaningful. He registered on RedQuest "just to try." He's at home on a Saturday afternoon.  
**Goal:** Help someone if it's not too inconvenient — he just doesn't want to have to figure out transportation.  
**Pain point:** He'd donate more if someone just came to pick him up.

### Persona C — The Hospital Staff
**Name:** Nurse Lyn, 34, Blood Bank Coordinator  
**Situation:** She manages blood inventory and frequently needs to scramble for rare types.  
**Goal:** Post requests quickly, confirm donor arrivals efficiently, track outcomes.  
**Pain point:** Current process is phone calls and Facebook posts — slow and unreliable.

---

## 3. User Stories

### Requester Stories

**RQ-01** As a requester, I can post a blood request so that I can reach nearby donors quickly.
- Fields: blood type, units needed, hospital name, urgency (standard / urgent / critical), my contact number
- System auto-fills hospital coordinates from a verified hospital list
- Urgency affects notification priority and ping order

**RQ-02** As a requester, I can track the status of my request in real time so that I know whether help is coming.
- Statuses: Searching → Donor matched → Rider dispatched → Donor en route → Donor arrived → Complete
- I receive a push notification on each status change

**RQ-03** As a requester, I can pay for the rider fee through the app so that the donor doesn't have to worry about transport.
- Payment via GCash, Maya, or card (Phase 1)
- Hackathon MVP: payment is acknowledged but not charged

**RQ-04** As a requester, I can see the donor's ETA so that I can inform the hospital to prepare.
- ETA shown as minutes remaining once rider is dispatched
- Hospital ward / blood bank is listed in the status screen

**RQ-05** As a requester, I can cancel a request if it's no longer needed.
- Cancelling notifies any matched donor immediately
- No charge if cancelled before rider is dispatched

---

### Donor Stories

**DN-01** As a donor, I can register with my blood type so that I can be matched to requests.
- Required: name, blood type, phone number, current location permission
- Optional: preferred donation radius, availability schedule

**DN-02** As a donor, I can receive a quest notification when a compatible request is nearby so that I can choose to help.
- Notification includes: blood type, urgency, hospital name, distance from me
- Quest expires in 5 minutes if I don't respond
- If I decline, I am not pinged again for the same request

**DN-03** As a donor, I can accept or decline a quest so that I remain in control of my participation.
- Accept: triggers rider dispatch, locks me to this quest
- Decline: anonymous, no penalty, next donor is pinged

**DN-04** As a donor, I can see the rider coming to pick me up so that I know when to be ready.
- Shows rider name, motorcycle plate, ETA in minutes
- Tap to call rider option (Phase 1)

**DN-05** As a donor, I can show a QR code at the hospital blood bank to confirm my arrival.
- QR encodes: donor ID, request ID, timestamp
- Hospital staff scans to mark "Donor arrived"

**DN-06** As a donor, I can earn XP and badges after completing a donation so that my contribution is recognized.
- XP awarded on hospital confirmation
- Badge unlocked conditions (see Gamification section)
- Shareable "I saved a life today" card generated

**DN-07** As a donor, I am blocked from receiving quests during my cooldown period so that I donate safely.
- 56-day cooldown after each confirmed donation
- Cooldown visible on my profile with days remaining

---

### Hospital / Staff Stories

**HS-01** As hospital staff, I can post requests on behalf of patients so that the family doesn't have to manage the app under stress.

**HS-02** As hospital staff, I can scan a donor's QR code on arrival to confirm their presence.

**HS-03** As hospital staff, I can view all active and completed requests for my hospital.

---

## 4. Feature Scope

### In Scope (MVP / Hackathon)

| Feature | Priority |
|---|---|
| Donor registration with blood type | P0 |
| Requester post blood request | P0 |
| Geo-matching (PostGIS) within radius | P0 |
| Push notification to matched donors | P0 |
| Quest accept / decline | P0 |
| Mock rider dispatch with ETA | P0 |
| Real-time status updates (requester) | P0 |
| XP award on quest completion | P0 |
| Donor profile with history | P1 |
| Badge system | P1 |
| Hospital QR check-in | P1 |
| Leaderboard | P1 |
| Expanding-ring geo fallback | P1 |

### Out of Scope (MVP)

- Real payment processing
- Live rider GPS tracking map
- SMS fallback for donors without data
- Multi-language support (Filipino / English toggle)
- Admin dashboard
- Blood inventory sync with hospitals
- Predictive shortage alerts

---

## 5. Blood Type Compatibility Matrix

| Requested type | Compatible donor types |
|---|---|
| A+ | A+, A-, O+, O- |
| A- | A-, O- |
| B+ | B+, B-, O+, O- |
| B- | B-, O- |
| O+ | O+, O- |
| O- | O- |
| AB+ | All types |
| AB- | A-, B-, O-, AB- |

> O- is the universal donor. AB+ is the universal recipient.  
> The matching engine uses this matrix before applying geo filters.

---

## 6. Urgency Levels

| Level | Response time target | Notification priority | Radius |
|---|---|---|---|
| Standard | 60 minutes | Normal | 5 km |
| Urgent | 20 minutes | High | 10 km (starts immediately at wider radius) |
| Critical | 10 minutes | Maximum | 15 km, all available donors pinged simultaneously |

---

## 7. Gamification Design

### XP System

| Action | XP Earned |
|---|---|
| Complete a standard quest | +200 XP |
| Complete an urgent quest | +250 XP |
| Complete a critical quest | +350 XP |
| First donation ever | +100 XP bonus |
| 5th donation milestone | +200 XP bonus |
| Referred a donor who donates | +50 XP |

### Donor Levels

| Level | Title | XP Required |
|---|---|---|
| 1 | Recruit | 0 |
| 2 | Responder | 300 |
| 3 | Guardian | 700 |
| 4 | Hero | 1,500 |
| 5 | Champion | 3,000 |
| 6 | Legend | 6,000 |
| 7 | RedQuest Elite | 12,000 |

### Badges

| Badge | Condition |
|---|---|
| First Blood | Complete your first donation |
| Speed Hero | Accept a quest within 60 seconds |
| Night Owl | Accept a quest between 10 PM and 5 AM |
| Triple Threat | Complete 3 donations in one month |
| Rare Find | Donate as AB- or O- |
| City Savior | Complete 10 donations |
| The Legend | Complete 25 donations |

---

## 8. Non-Functional Requirements

| Requirement | Target |
|---|---|
| Quest match time | < 10 seconds from request posted |
| Push notification delivery | < 30 seconds |
| API response time (p95) | < 500 ms |
| App crash rate | < 1% of sessions |
| Donor data encryption | AES-256 at rest, TLS in transit |
| Cooldown accuracy | ±1 hour acceptable |
| Concurrent active requests | Support 50+ simultaneous (hackathon scale) |

---

## 9. Compliance Notes (Philippines)

- Blood donation rules governed by **Republic Act 7719** (National Blood Services Act of 1994)
- Donor blood type must be self-declared at registration; verification occurs at hospital during collection
- Personal data handling governed by **Republic Act 10173** (Data Privacy Act of 2012)
- Riders must hold a valid PH motorcycle license; platform is responsible for rider partner vetting (Phase 1)
- No payment to donors — donors give voluntarily; platform only covers transport cost
