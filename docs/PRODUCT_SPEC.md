# RedQuest — Product Specification

## Vision

RedQuest turns blood donation into a **quest** — a simple, fast, and dignified act of heroism. Donors are matched to urgent needs nearby and rewarded for their contributions. Requesters get rapid, transparent access to life-saving help.

---

## User Roles

### Donor
A registered blood donor who:
- Has a verified blood type on file
- Receives real-time push notifications when blood is needed nearby
- Accepts or declines individual quests
- Earns XP, badges, and levels for each completed donation
- Can toggle availability on/off

### Requester
A person requesting blood on behalf of a patient who:
- Posts a blood request specifying hospital, blood type, urgency, and units needed
- Tracks request status in real-time (matching → notified → accepted → complete)
- Can view history of all past requests

---

## Core Features

### For Donors
| Feature | Description |
|---|---|
| Quest Alerts | Push notification when a compatible request is posted within 10 km |
| Quest Accept/Decline | 5-minute window to respond; next donor auto-notified on decline |
| XP & Levels | 200 XP per donation, bonus for urgent/critical; 7 levels total |
| Badges | Achievement system tied to donation milestones |
| Availability Toggle | Donors can mark themselves unavailable (cooldown) |
| Quest History | Full history of accepted, declined, and expired quests |

### For Requesters
| Feature | Description |
|---|---|
| Post Blood Request | Select hospital, blood type, urgency, and units |
| Real-time Status | Track from "matching" through "complete" |
| Request History | Full history of all posted requests |

---

## Blood Type Matching

The system uses the universal compatibility chart. A donor's blood type must be compatible with the requested type (not just identical). Compatibility logic lives in `backend/utils.js`.

---

## Quest Lifecycle

```
Requester posts ──► System matches ──► Donor notified (5-min window)
                                              │
                         ┌────────────────────┤
                         │                    │
                      Accept               Decline / Expire
                         │                    │
                    Quest: accepted      Next donor notified
                    Request: accepted
                         │
                    Donor arrives
                    Checks in via app
                         │
                    Quest: completed
                    Request: complete
                    XP awarded
```

---

## XP & Level System

| Level | Name | XP Threshold |
|---|---|---|
| 1 | Recruit | 0 |
| 2 | Responder | 300 |
| 3 | Guardian | 700 |
| 4 | Hero | 1,500 |
| 5 | Champion | 3,000 |
| 6 | Legend | 6,000 |
| 7 | Elite | 12,000 |

**XP per quest:**
- Base: 200 XP
- Urgent bonus: +50 XP
- Critical bonus: +100 XP

---

## Non-Goals (Explicitly Excluded)

- Hospital staff user role (removed)
- Rider dispatch and tracking (removed)
- Admin dashboard
- Payment processing
- In-app messaging
