# RedQuest — UI Flows

## Screen Map

```
Onboarding ──► Login ──► Register
                  │
          ┌───────┴────────┐
          │                │
       Donor            Requester
       Tabs              Tabs
    ┌────────────┐    ┌───────────────┐
    │ Home       │    │ Home          │
    │ Quests     │    │ History       │
    │ Badges     │    │ Profile       │
    │ Profile    │    └───────────────┘
    └────────────┘
         │
    QuestAlert ──► QuestAccepted ──► QuestComplete
                                        (Donor tabs)
    PostRequest ──► RequestStatus
```

---

## Onboarding Flow

**Screen: Onboarding**
- Landing page with RedQuest logo, tagline, and "Get Started" button
- Swipeable 3-slide intro (Help Instantly / Connect Directly / Save Lives)
- "I already have an account" link → Login
- Final slide → Register

---

## Auth Flows

**Screen: Register**
- Step 1: Role selection — **Donor** or **Requester** (2 cards only)
- Step 2: Account details (name, email, password)
- Step 3: Contact info (phone number)
- Step 4: Blood type selection (A/B/O/AB + Rh factor)
- Submit → Login screen

**Screen: Login**
- Logo display with "Sign In" and "Create Account" buttons
- Tap Sign In → email + password form slides in
- On success: routes to `DonorTabs` or `RequesterTabs` based on role

---

## Donor Flows

### Home (DonorTabs > Home)
- Greeting with first name
- Verified donor badge
- Availability toggle (is_available)
- Blood type + XP bar + level
- Stats: total donations | days until next eligible
- Rewards & Points card → Badges screen
- Recent quests → Quests screen
- Live quest CTA (if active quest exists):
  - Status pending → "New Quest Available — Tap to view" → QuestAlert
  - Status accepted → "Quest in progress — Tap to track" → QuestAccepted

### Quest Alert (modal)
- Notification that blood is needed nearby
- Shows: hospital name, blood type, urgency badge, distance, units
- Map placeholder showing nearby pins
- **Accept** button → QuestAccepted
- **Decline** button → back to Home (next donor auto-notified)

### Quest Accepted
- Confirmation screen: "Quest Accepted!"
- Status card: "Quest Active — Make your way to the hospital"
- Destination card: hospital name + address + distance from donor
- Quest details: blood type, units, priority
- **"I am On My Way"** button → Donor Home
- "Can't make it? Cancel" link → Donor Home

### Quest Complete
- XP awarded display
- Level up celebration (if applicable)
- Back to Home

### Quests Tab
- History of all quests (completed, declined, expired)

### Badges Tab
- Achievement badges tied to donation milestones

---

## Requester Flows

### Home (RequesterTabs > Home)
- Header: "Requester Portal"
- Stats row: Active | Completed | Pending requests
- **"Post New Blood Request"** button → PostRequest
- Recent requests list (each tappable → RequestStatus)
- Info tip card

### Post Request
- Blood type selector (8-type grid)
- Units needed (1 / 2 / 3+)
- Hospital picker (dropdown, loads from API)
- Urgency level radio (Standard / Urgent / Critical)
- Notes (optional text input)
- **"Post Request"** → RequestStatus

### Request Status
- Real-time polling (5s) of request status
- Shows current status: Matching → Notified → Accepted → Complete
- Donor info when accepted
- Status timeline

### History Tab
- All past requests with status badges

---

## Shared

### Profile Tab
- User avatar (initials)
- Name + role pill (DONOR or REQUESTER)
- Account details: email, phone, blood type
- Preferences menu (Notifications, Privacy, Help)
- **Log Out** button
