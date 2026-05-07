# RedQuest — System Architecture

## Overview

RedQuest is a two-role blood donation matching platform. The architecture is a straightforward mobile-backend-database stack, intentionally kept simple and professional.

```
┌─────────────────────────────────────────┐
│           React Native (Expo)           │
│  ┌──────────────┐  ┌──────────────────┐ │
│  │  Donor UI    │  │  Requester UI    │ │
│  │  - Home      │  │  - Home          │ │
│  │  - Quests    │  │  - Post Request  │ │
│  │  - Badges    │  │  - History       │ │
│  │  - Profile   │  │  - Profile       │ │
│  └──────────────┘  └──────────────────┘ │
└──────────────────┬──────────────────────┘
                   │ HTTPS / REST
┌──────────────────▼──────────────────────┐
│         Node.js + Express (Railway)     │
│                                         │
│  Auth │ Requests │ Quests │ Checkin     │
└──────────────────┬──────────────────────┘
                   │ pg pool
┌──────────────────▼──────────────────────┐
│       PostgreSQL + PostGIS (Railway)    │
│                                         │
│  hospitals │ users │ blood_requests     │
│  quests    │ notifications              │
└─────────────────────────────────────────┘
```

---

## Roles

### Donor
- Registers with blood type and GPS location
- Receives push notifications when a compatible request is posted nearby (within 10 km)
- Accepts or declines quests within a 5-minute window
- Earns XP and levels up for each completed donation

### Requester
- Posts blood requests, selecting a hospital and blood type needed
- Tracks request status in real-time
- No blood type required for matching (the request specifies the type needed)

---

## Matching Algorithm

1. Requester posts a request with `hospital_id` + `blood_type`
2. Backend uses PostGIS `ST_DWithin` to find donors within **10 km** of the hospital
3. Filters by: `role = 'donor'`, `is_available = true`, `blood_type` compatible
4. Creates a quest record per eligible donor (up to 5)
5. Notifies the **closest** donor via Expo push notification
6. Sets a **5-minute expiry timer** on that quest
7. If the donor declines or the timer expires, the next closest donor is notified

```
Hospital GPS ──► ST_DWithin(10km) ──► Compatible donors
                                             │
                          Sort by distance_meters ASC
                                             │
                          Notify donor[0] ──► 5-min timer
                                             │
                    Decline/Expire ──► Notify donor[1] ...
```

---

## Data Flow: Post a Request

```
POST /requests
  → createRequestWithQuests()
    → findCompatibleDonors(hospitalId, bloodType)
      → PostGIS query: donors within 10km, matching blood type
    → INSERT INTO quests (one per donor)
    → activateNextQuest(requestId)
      → UPDATE quests SET notified_at = NOW() (closest)
      → UPDATE blood_requests SET status = 'notified'
      → sendQuestPushNotification(donor.device_token)
      → setTimeout(handleQuestExpiry, 5min)
```

---

## Data Flow: Accept a Quest

```
POST /quests/:id/accept
  → acceptQuest(questId, donorId)
    → Validate quest.donor_id === req.user.id
    → Validate quest.status === 'pending'
    → clearQuestTimer(questId)
    → UPDATE quests SET status = 'accepted'
    → UPDATE blood_requests SET status = 'accepted'
    → Return { questId }
```

---

## Data Flow: Complete a Quest

```
POST /checkin/simulate
  → UPDATE quests SET status = 'completed'
  → UPDATE blood_requests SET status = 'complete'
  → Calculate XP (200 base + urgency bonus)
  → UPDATE users SET xp, level, donation_count
  → Return { xp_gained, new_xp, leveled_up, new_level }
```

---

## Infrastructure

| Service | Platform | Notes |
|---|---|---|
| API | Railway | Node.js, auto-deploys from main branch |
| Database | Railway | PostgreSQL + PostGIS extension |
| Mobile | Expo | EAS Build for Android/iOS |
| Push | Expo Push | expo-notifications |
