# RedQuest — Hackathon Plan

**Duration:** 4 days  
**Goal:** Working mobile app demo with core quest loop functional  
**Demo target:** Post request → match donor → accept quest → mock rider dispatch → XP awarded

> ⚠️ **4-day mode: ruthless prioritization.** Every task below is load-bearing for the demo. Anything not on this list is cut. No scope creep — if it's not in the Definition of Done, it doesn't get built this week.

---

## Team Roles

| Role | Responsibilities |
|---|---|
| **Mobile Dev** | React Native app, donor & requester screens, push notifications |
| **Backend Dev** | REST API, geo-matching, database, rider dispatch mock |
| **UI/UX Designer** | Wireframes, design system, component specs |
| **PM / Pitcher** | Documentation, pitch deck, demo script, coordination |

> If your team is smaller, Backend Dev also covers Designer; Mobile Dev covers PM.

---

## What's Cut from the 7-Day Plan

To hit a 4-day deadline, the following are **deferred to post-hackathon**:

- Leaderboard screen (show seeded data as screenshot in pitch instead)
- Badge unlock modal (award XP only; badges are a "coming soon" slide)
- Donation history list
- Expanding-ring geo fallback (fixed 10 km radius for demo)
- Hospital QR check-in (simulate completion via a button in demo mode)
- App icon and custom splash screen
- Offline / no-network error handling
- WebSocket real-time updates (use 5-second polling instead)

---

## Day-by-Day Schedule

### Day 1 — Foundation + Auth (Full day)
**Theme:** Everything is set up and users can register by end of day

**All team — Morning (first 2 hours)**
- [x] Finalize tech stack (confirm React Native + Expo, Node.js, PostgreSQL + PostGIS, Firebase FCM)
- [x] Create GitHub repo, set up `main` and `dev` branches
- [ ] Create shared Figma file with color system: primary `#E24B4A`, neutrals, typography

**Backend Dev**
- [x] Initialize Node.js + Express project, create `.env.example`
- [x] Set up PostgreSQL + PostGIS locally and on Railway (deploy early — don't wait)
- [x] Run migrations: `users`, `blood_requests`, `quests`, `hospitals` tables (use `DATABASE_SCHEMA.md`)
- [x] Seed mock data: 3 hospitals, 15 donor accounts with varied blood types and coordinates
- [x] POST `/auth/register` and POST `/auth/login` with JWT
- [x] GET `/users/me` — profile endpoint
- [x] Blood type compatibility matrix utility function

**Mobile Dev**
- [x] Initialize React Native + Expo project
- [x] Install and configure React Navigation (stack + bottom tabs)
- [x] Create skeleton screens: Login, Register, Donor Home, Requester Home
- [x] Register screen: name, email, password, role selector, blood type selector (donors only)
- [x] Login screen with JWT stored in SecureStore
- [ ] Wire auth screens to backend — registration and login working end-to-end by EOD

**Designer**
- [ ] Wireframes: full donor flow (Home → Quest Alert → Accept → Rider En Route → Complete)
- [ ] Wireframes: requester flow (Home → Post Request → Status Tracking)
- [ ] High-fidelity: Login and Register screens (hand off to Mobile Dev by midday)
- [ ] High-fidelity: Quest alert card (the most important component — prioritize this)

**End of Day 1 checkpoint:** A new user can register and log in on a real device. ✓

---

### Day 2 — Quest Loop Backend + Requester UI (Full day)
**Theme:** The matching engine works; requesters can post and track

**Backend Dev**
- [ ] POST `/requests` — create blood request (blood type, hospital_id, units, urgency)
- [ ] GET `/requests/:id` — fetch status with nested quest and rider info
- [ ] Geo-matching query using PostGIS `ST_DWithin` (fixed 10 km radius, sorted by distance)
- [ ] Quest creation: on new request, find top 5 compatible donors, create quest records
- [ ] Push notification trigger: call Firebase Admin SDK with quest payload for each matched donor
- [ ] 5-minute quest expiry: use `setTimeout` on acceptance — expire and move to next donor
- [ ] POST `/quests/:id/accept` — lock donor to quest, create mock rider record (name, plate, ETA)
- [ ] POST `/quests/:id/decline` — mark declined, ping next donor in queue
- [ ] GET `/requests/:id` polling: returns current status including rider ETA

**Mobile Dev**
- [ ] Requester home screen with "Post a Blood Request" CTA
- [ ] Post request form: blood type selector, units, hospital dropdown (from seeded list), urgency radio
- [ ] Request status tracking screen: status steps (Searching → Matched → Dispatched), polls every 5s
- [ ] "Donor matched" state: shows rider name, plate, ETA
- [ ] Donor home screen: availability toggle, blood type display, basic profile info

**Designer**
- [ ] High-fidelity: Post request form
- [ ] High-fidelity: Request status tracking screen (both Searching and Matched states)
- [ ] High-fidelity: Donor home screen
- [ ] Hand off all remaining screens to Mobile Dev — designer shifts to pitch deck from Day 3

**End of Day 2 checkpoint:** Posting a request triggers a push notification to a matched donor device. ✓

---

### Day 3 — Quest Loop Mobile + Gamification (Full day)
**Theme:** The donor-side loop is complete; XP is awarded; demo path is end-to-end

**Backend Dev**
- [ ] GET `/quests/active` — donor's current active quest with all details
- [ ] POST `/checkin/simulate` — demo-mode endpoint that manually completes a quest (skips QR)
- [ ] XP award logic on completion: +200 base, +50 urgent, +100 critical; update `users.xp` and `users.level`
- [ ] Level threshold logic (Recruit → Hero → Legend)
- [ ] GET `/users/me` returns updated XP, level, donation_count after completion
- [ ] Deploy latest backend to Railway and smoke-test all endpoints

**Mobile Dev**
- [ ] Quest alert screen: opens from push notification, shows blood type, hospital, distance, countdown timer
- [ ] Accept and Decline buttons wired to API
- [ ] Accepted state → rider en route screen: rider name, plate, ETA countdown
- [ ] "Complete quest" button (calls `/checkin/simulate` for demo — replaces QR flow)
- [ ] Quest complete screen: "Quest Complete!" heading, XP counter animation, level display
- [ ] Wire all screens together — full flow navigable without dead ends

**All team — Evening**
- [ ] Run the full demo flow end-to-end together (all 3 runs)
- [ ] Log every bug found — triage into blocking vs non-blocking
- [ ] Assign all blocking bugs to be fixed first thing Day 4

**End of Day 3 checkpoint:** The complete loop — post request → push notification → accept → complete → XP — works on a real device without any manual intervention. ✓

---

### Day 4 — Polish, Deploy & Present (Final day)
**Theme:** Fix blocking bugs only, make the demo path bulletproof, present

**Morning (first 4 hours) — Blocking bugs only**
- [ ] Fix every bug that breaks the demo path (identified end of Day 3)
- [ ] Add loading spinners to all screens that call the API
- [ ] Add basic error message if API call fails ("Something went wrong. Try again.")
- [ ] Test push notifications on a physical Android and iOS device if possible
- [ ] Final backend deploy to Railway — confirm all endpoints respond

**Backend Dev**
- [ ] Confirm demo seed data is in production DB: 3 hospitals, seeded donor accounts, clean state
- [ ] Set up a "demo reset" endpoint: `POST /demo/reset` — clears active requests so demo can be run multiple times cleanly
- [ ] Confirm Railway deployment is stable and not sleeping (upgrade to paid if needed — it's worth ₱200)

**Mobile Dev**
- [ ] Smooth the quest alert entrance animation (slide up from bottom)
- [ ] Ensure XP counter animates correctly on complete screen
- [ ] Test full demo flow 3 more times on the actual presentation device
- [ ] Prepare the demo phone: demo accounts pre-logged in, correct screen ready, brightness up, DND on

**Designer / PM**
- [ ] Finalize pitch deck (8 slides max — see `PITCH_SCRIPT.md`)
- [ ] Record a screen-capture backup video of the full demo flow
- [ ] Upload backup video to Google Drive and phone camera roll
- [ ] Rehearse the 3-minute pitch at least 3 times
- [ ] Prepare Q&A answers (see `PITCH_SCRIPT.md`)

**Before going on stage**
- [ ] Phone charged above 80%
- [ ] Wi-Fi or mobile data working at venue — test it
- [ ] Backend is live and responding (hit `/health` endpoint)
- [ ] Demo accounts are logged in and on the right starting screen
- [ ] Screen recording loaded as backup on a second device
- [ ] Submit project on hackathon platform

---

## Demo Script Summary (Live Flow)

1. Open requester screen → post a blood type O+ request at St. Luke's, URGENT
2. Switch to donor phone → quest notification arrives within 30 seconds
3. Show quest card with 5-min countdown → tap "Accept quest"
4. Show rider dispatched screen (mock ETA 4 minutes)
5. Show requester screen updating to "Donor matched — rider en route"
6. Tap "Complete quest" on donor phone (demo mode — simulates QR check-in)
7. Show quest completion screen → XP counter animation → level display
8. Show updated donor profile with new XP total

---

## Definition of Done (4-Day MVP)

- [ ] A requester can register, log in, and post a blood request
- [ ] A matched donor receives a push notification within 30 seconds
- [ ] The donor sees the quest card with blood type, hospital, distance, and countdown
- [ ] A donor can accept or decline the quest
- [ ] Accepting shows a mock rider dispatch screen with name, plate, and ETA
- [ ] Requester screen updates to "Donor matched" state
- [ ] Donor can tap "Complete quest" and receives XP on the completion screen
- [ ] The full loop runs on a real device without crashing

---

## Risk Register

| Risk | Likelihood | Mitigation |
|---|---|---|
| Push notifications fail on demo device | Medium | Test on physical device by end of Day 2; screen recording as backup |
| Backend Railway free tier sleeps between requests | Medium | Upgrade to paid tier (₱200) on Day 3 — deploy early |
| Geo-matching too slow | Low | Add PostGIS GIST index on Day 1 migration |
| Team member unavailable | Medium | Backend Dev is backup for any API endpoint; Mobile Dev owns all screens |
| No internet at venue | Medium | Record backup video Day 4 morning; pre-load demo on device |
| Scope creep kills the timeline | High | Refer to the "What's Cut" section — if it's not in the DoD, it does not get built |
