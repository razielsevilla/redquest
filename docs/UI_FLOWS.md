# RedQuest — UI Flows

**Version:** 1.0 (Hackathon MVP)  
**Platform:** React Native (iOS + Android)  
**Design language:** Deep red primary `#E24B4A`, clean white surfaces, bold sans-serif type

---

## Screen Index

| Screen | Role | Priority |
|---|---|---|
| S01 — Splash | All | P0 |
| S02 — Onboarding | All | P0 |
| S03 — Register | All | P0 |
| S04 — Login | All | P0 |
| S05 — Donor Home | Donor | P0 |
| S06 — Quest Alert | Donor | P0 |
| S07 — Quest Accepted | Donor | P0 |
| S08 — Rider En Route | Donor | P0 |
| S09 — QR Check-in | Donor | P0 |
| S10 — Quest Complete | Donor | P0 |
| S11 — Donor Profile | Donor | P1 |
| S12 — Donation History | Donor | P1 |
| S13 — Leaderboard | Donor | P1 |
| S14 — Requester Home | Requester | P0 |
| S15 — Post Request | Requester | P0 |
| S16 — Request Status | Requester | P0 |
| S17 — Hospital Dashboard | Hospital Staff | P1 |

---

## Deferred for 7-Day Hackathon

The following screens / flows are deferred for the short hackathon timeline and can be mocked or removed from the demo sequence:

- S09 — QR Check-in (display only; actual scan flow simulated)
- S11 — Donor Profile (full profile with badges)
- S12 — Donation History (detailed history view)
- S13 — Leaderboard (show as static screenshot or omit)
- S17 — Hospital Dashboard (limited or simulated)

Keep core screens (Onboarding, Register, Donor Home, Quest Alert, Quest Accepted, Rider En Route, Post Request, Request Status) as the primary demo path.

## Flow 1 — Onboarding & Registration

```
App Launch
    │
    ▼
S01: Splash Screen (2s)
    RedQuest logo + tagline
    "Turn blood donation into a quest"
    │
    ▼
S02: Onboarding (3 swipeable cards)
    Card 1: "Be a hero when it matters"
    Card 2: "A rider picks you up — no hassle"
    Card 3: "Earn XP and save lives"
    [Get Started] button
    │
    ├──── "I already have an account" ──► S04 Login
    │
    ▼
S03: Register
    ┌─────────────────────────────┐
    │  Full name                  │
    │  Mobile number              │
    │  Email address              │
    │  Password                   │
    │                             │
    │  I am a: [Donor] [Family]   │
    │          [Hospital Staff]   │
    │                             │
    │  (If Donor selected):       │
    │  Blood type: [selector]     │
    │  A+  A-  B+  B-             │
    │  O+  O-  AB+ AB-            │
    │                             │
    │  [Allow location access]    │
    │  (system prompt follows)    │
    │                             │
    │  [Create Account]           │
    └─────────────────────────────┘
    │
    ▼
    S05 / S14 / S17 (by role)
```

**Key decisions:**
- Blood type selector only appears if role = Donor
- Location permission is requested inline with explanation ("So we can find you for quests")
- Requester flow skips blood type

---

## Flow 2 — Donor Home & Availability

```
S05: Donor Home
    ┌─────────────────────────────┐
    │  👋 Good morning, Juan!     │
    │                             │
    │  [toggle] Available for     │
    │           quests: ON        │
    │                             │
    │  Blood type: O+             │
    │  Level 4 Hero               │
    │  ████████░░ 1,240 / 2,000   │
    │                             │
    │  ┌──────┐  ┌──────────────┐ │
    │  │  7   │  │  56 days     │ │
    │  │dons  │  │  until next  │ │
    │  └──────┘  └──────────────┘ │
    │                             │
    │  Recent quests (2)          │
    │  Apr 30 · O+ · St. Luke's   │
    │  Apr 12 · O+ · PGH          │
    │                             │
    │  [View full history]        │
    └─────────────────────────────┘
    │
    Bottom nav: Home · Quests · Badges · Profile
```

**States:**
- If on cooldown: toggle is disabled, cooldown timer shown in red
- If level up available: banner animates in at top

---

## Flow 3 — Quest Alert & Acceptance (CRITICAL PATH)

This is the most important flow. Every interaction should feel fast and urgent.

```
[Push notification arrives on locked screen]
    "🩸 URGENT QUEST — O+ needed · St. Luke's · 1.3 km"
    │
    [Donor taps notification]
    │
    ▼
S06: Quest Alert (full-screen modal over home)
    ┌─────────────────────────────┐
    │  ⏱ 04:32  [red countdown]  │
    │                             │
    │  ┌── URGENT QUEST ─────────┐│
    │  │                         ││
    │  │  Blood type needed:     ││
    │  │  🩸 O+                  ││
    │  │                         ││
    │  │  2 units                ││
    │  │  St. Luke's BGC         ││
    │  │  1.3 km from you        ││
    │  │                         ││
    │  │  A rider will pick      ││
    │  │  you up. Transport      ││
    │  │  is covered.            ││
    │  └─────────────────────────┘│
    │                             │
    │  [ ✓ Accept Quest ]         │
    │  [   Decline       ]        │
    └─────────────────────────────┘

    If countdown reaches 0:
    → Modal closes, "Quest expired" toast shown
    → Returns to S05 Donor Home
```

**Behavior:**
- Quest countdown visible and ticking in real time
- Accept is a large, full-width red button — highest affordance
- Decline is a smaller, secondary style button
- Haptic feedback on Accept tap
- Background shows a subtle pulsing red animation to convey urgency

---

```
[Donor taps Accept Quest]
    │
    ▼
S07: Quest Accepted (confirmation + rider incoming)
    ┌─────────────────────────────┐
    │  Quest accepted!            │
    │                             │
    │  ✓ A rider has been         │
    │    dispatched to you.       │
    │                             │
    │  ┌─────────────────────────┐│
    │  │ 🏍️  Ramon Santos        ││
    │  │     ABC 1234            ││
    │  │     ETA: 4 minutes      ││
    │  └─────────────────────────┘│
    │                             │
    │  Your destination:          │
    │  St. Luke's Medical Center  │
    │  BGC Blood Bank, Floor 2    │
    │                             │
    │  Please be ready outside    │
    │  your location.             │
    │                             │
    │  [Can't make it? Cancel]    │
    └─────────────────────────────┘
```

---

```
[Rider arrives and picks up donor]
    │
    ▼
S08: Rider En Route (in the motorcycle)
    ┌─────────────────────────────┐
    │  En route to hospital       │
    │                             │
    │  🏥 St. Luke's BGC          │
    │  Estimated: 12 minutes      │
    │                             │
    │  Blood type: O+             │
    │  Units needed: 2            │
    │  Floor 2, Blood Bank        │
    │                             │
    │  Show your QR at the        │
    │  blood bank counter.        │
    │                             │
    │  [Show my QR code]  →  S09  │
    └─────────────────────────────┘
```

---

```
S09: QR Code Display
    ┌─────────────────────────────┐
    │  Show this at the           │
    │  blood bank counter         │
    │                             │
    │  ┌─────────────────────────┐│
    │  │                         ││
    │  │   [QR CODE IMAGE]       ││
    │  │                         ││
    │  └─────────────────────────┘│
    │                             │
    │  Quest #RQ-2026-0047        │
    │  Juan dela Cruz · O+        │
    │                             │
    │  Valid for 4 hours          │
    └─────────────────────────────┘
```

---

```
[Hospital staff scans QR → API confirms]
    │
    ▼
S10: Quest Complete 🎉
    ┌─────────────────────────────┐
    │                             │
    │  ⭐ Quest Complete!         │
    │                             │
    │  Thank you, Juan.           │
    │  You may have saved a life. │
    │                             │
    │  +250 XP earned             │
    │  [animated XP counter]      │
    │                             │
    │  ████████░░ 1,490 / 2,000   │
    │                             │
    │  🏅 New badge unlocked!     │
    │  Speed Hero                 │
    │  "Accepted a quest in       │
    │   under 60 seconds"         │
    │                             │
    │  [Share your story]         │
    │  [Back to home]             │
    └─────────────────────────────┘
```

**Animations:**
- XP number counts up from previous total to new total
- Badge slides up from bottom with a pulse effect
- Confetti particle effect (subtle, tasteful)

---

## Flow 4 — Requester: Post a Request

```
S14: Requester Home
    ┌─────────────────────────────┐
    │  RedQuest                   │
    │                             │
    │  [+ Post a Blood Request]   │  ← primary CTA
    │                             │
    │  Your recent requests (1)   │
    │  ┌─────────────────────────┐│
    │  │ O+ · Urgent · May 4     ││
    │  │ St. Luke's BGC          ││
    │  │ ● Donor matched         ││
    │  └─────────────────────────┘│
    └─────────────────────────────┘
    │
    [+ Post a Blood Request]
    │
    ▼
S15: Post Request
    ┌─────────────────────────────┐
    │  Blood type needed          │
    │  [A+][A-][B+][B-]           │
    │  [O+][O-][AB+][AB-]         │
    │                             │
    │  Units needed: [1] [2] [3+] │
    │                             │
    │  Hospital                   │
    │  [Search or select]         │
    │   St. Luke's BGC ✓          │
    │                             │
    │  Urgency                    │
    │  ○ Standard (within 1 hr)   │
    │  ● Urgent (within 20 min)   │
    │  ○ Critical (within 10 min) │
    │                             │
    │  Notes (optional)           │
    │  [Post-surgery, ICU bed 3]  │
    │                             │
    │  Transport fee: ₱150        │
    │  (Rider cost, paid by you)  │
    │                             │
    │  [Post Request]             │
    └─────────────────────────────┘
    │
    ▼
S16: Request Status (live tracking)
    ┌─────────────────────────────┐
    │  Blood request posted       │
    │  O+ · Urgent · St. Luke's   │
    │                             │
    │  ●──────○──────○──────○     │
    │  Matching Matched Dispatched Done
    │                             │
    │  Searching for nearby       │
    │  compatible donors...       │
    │                             │
    │  [spinner animation]        │
    │                             │
    │  ──── updates in real time  │
    │                             │
    │  [Cancel request]           │
    └─────────────────────────────┘

    → When donor matched:
    ┌─────────────────────────────┐
    │  ✓ Donor found!             │
    │  Blood type O+              │
    │  A rider is picking them up │
    │                             │
    │  Rider ETA to donor: 4 min  │
    │  Estimated arrival at       │
    │  hospital: ~25 minutes      │
    │                             │
    │  Please inform the blood    │
    │  bank to prepare.           │
    └─────────────────────────────┘
```

---

## Flow 5 — Donor Profile & Badges

```
S11: Donor Profile
    ┌─────────────────────────────┐
    │  [avatar]  Juan dela Cruz   │
    │            Blood type: O+   │
    │            Level 4 Hero     │
    │                             │
    │  XP Progress                │
    │  ████████░░ 1,240 / 2,000   │
    │  760 XP to Level 5          │
    │                             │
    │  ┌──────┬──────┬──────────┐ │
    │  │  7   │  7   │  56 days │ │
    │  │dons  │lives │  cooldown│ │
    │  └──────┴──────┴──────────┘ │
    │                             │
    │  My Badges (3/7)            │
    │  🏅 First Blood             │
    │  ⚡ Speed Hero              │
    │  🌙 Night Owl               │
    │  🔒 Triple Threat           │
    │  🔒 Rare Find               │
    │  ...                        │
    │                             │
    │  [Edit profile]             │
    │  [Donation history]  → S12  │
    │  [Leaderboard]       → S13  │
    └─────────────────────────────┘
```

---

## Navigation Structure

```
Bottom Tab Bar (Donor App)
├── Home (S05)
├── History (S12)
├── Leaderboard (S13)
└── Profile (S11)

Bottom Tab Bar (Requester App)
├── Home (S14)
└── My Requests (list of S16s)

Modal Overlays
├── Quest Alert (S06) — triggered by push notification
├── Quest Complete (S10) — triggered by check-in confirmation
└── Badge Unlocked — triggered within S10
```

---

## Component Library (Key Components)

### QuestCard
Used in quest alert and history list.
- Props: `bloodType`, `urgency`, `hospitalName`, `distanceMeters`, `expiresAt`
- Urgency colors: standard = gray, urgent = amber, critical = red
- Shows live countdown if `expiresAt` is in the future

### XPBar
- Props: `currentXP`, `targetXP`, `level`
- Animates from previous value on mount

### BloodTypeBadge
- Props: `type` (e.g. "O+")
- Large, bold pill with red background
- Used on quest cards and donor profile

### UrgencyBadge
- Props: `level` ("standard" | "urgent" | "critical")
- standard: gray, urgent: amber, critical: red

### StatusTimeline
- Props: `steps`, `currentStep`
- Horizontal row of dots with labels, fills left-to-right as status advances
- Used on requester tracking screen (S16)

### RiderCard
- Props: `name`, `plate`, `etaMinutes`, `status`
- Shows motorcycle icon, rider name, plate, and live ETA countdown
