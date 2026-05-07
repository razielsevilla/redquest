# RedQuest — Hackathon Plan

**Duration:** 4 days  
**Goal:** Working mobile app demo with core quest loop functional  
**Demo target:** Post request → match donor → accept quest → QR check-in → XP awarded

> ✅ **Hackathon complete.** All milestones have been delivered and verified. The system was subsequently upgraded with a full architectural overhaul (Donor/Requester two-role system) and production APK deployed.

---

## Team Roles

| Role | Responsibilities |
|---|---|
| **Mobile Dev** | React Native app, donor & requester screens, push notifications |
| **Backend Dev** | REST API, geo-matching, database |
| **UI/UX Designer** | Wireframes, design system, component specs |
| **PM / Pitcher** | Documentation, pitch deck, demo script, coordination |

---

## What Was Cut from the 7-Day Plan

*(These were deferred to post-hackathon — most have since been implemented)*

- ~~Leaderboard screen~~ — seeded data shown in pitch
- ~~Badge unlock modal~~ — XP awarded only
- ~~Expanding-ring geo fallback~~ — ✅ implemented as fixed 10 km, then removed distance gate entirely
- ~~Hospital QR check-in~~ — ✅ implemented (QR visual + simulate check-in)
- ~~App icon and custom splash screen~~ — ✅ RedQuest logo set as APK icon
- ~~Offline / no-network error handling~~ — deferred
- ~~WebSocket real-time updates~~ — 5-second polling used instead

---

## Day-by-Day Schedule

### Day 1 — Foundation + Auth
**Theme:** Everything is set up and users can register by end of day

**All team — Morning**
- [x] Finalize tech stack (React Native + Expo, Node.js, PostgreSQL + PostGIS)
- [x] Create GitHub repo, set up `main` and `dev` branches

**Backend Dev**
- [x] Initialize Node.js + Express project, create `.env.example`
- [x] Set up PostgreSQL + PostGIS locally and on Railway
- [x] Run migrations: `users`, `blood_requests`, `quests`, `hospitals` tables
- [x] Seed mock data: hospitals, 15 donor accounts with varied blood types and coordinates
- [x] `POST /auth/register` and `POST /auth/login` with JWT
- [x] `GET /users/me` — profile endpoint
- [x] Blood type compatibility matrix utility function

**Mobile Dev**
- [x] Initialize React Native + Expo project
- [x] Install and configure React Navigation (stack + bottom tabs)
- [x] Create skeleton screens: Login, Register, Donor Home, Requester Home
- [x] Register screen: name, email, password, role selector, blood type selector
- [x] Login screen with JWT stored in SecureStore
- [x] Wire auth screens to backend — registration and login working end-to-end

**Designer**
- [x] Wireframes: full donor flow
- [x] Wireframes: requester flow
- [x] High-fidelity: Login and Register screens
- [x] High-fidelity: Quest alert card

**End of Day 1 checkpoint:** A new user can register and log in on a real device. ✓

---

### Day 2 — Quest Loop Backend + Requester UI
**Theme:** The matching engine works; requesters can post and track

**Backend Dev**
- [x] `POST /requests` — create blood request
- [x] `GET /requests/:id` — fetch status with nested quest info
- [x] Geo-matching query using PostGIS `ST_DWithin`
- [x] Quest creation: find top 5 compatible donors, create quest records
- [x] Push notification trigger via Expo Push API
- [x] 5-minute quest expiry: `setTimeout` expires and moves to next donor
- [x] `POST /quests/:id/accept` — lock donor to quest
- [x] `POST /quests/:id/decline` — mark declined, ping next donor in queue
- [x] `GET /requests/:id` polling: returns current status

**Mobile Dev**
- [x] Requester home screen with "Post a Blood Request" CTA
- [x] Post request form: blood type, units, hospital dropdown, urgency radio
- [x] Request status tracking screen: polls every 5s
- [x] Donor home screen: availability toggle, blood type display, stats

**Designer**
- [x] High-fidelity: Post request form
- [x] High-fidelity: Request status tracking screen
- [x] High-fidelity: Donor home screen

**End of Day 2 checkpoint:** Posting a request triggers a push notification to a matched donor device. ✓

---

### Day 3 — Quest Loop Mobile + Gamification
**Theme:** The donor-side loop is complete; XP is awarded; demo path is end-to-end

**Backend Dev**
- [x] `GET /quests/active` — donor's current active quest with all details
- [x] `POST /checkin/simulate` — completes a quest and awards XP
- [x] XP award logic: +200 base, +50 urgent, +100 critical; update `users.xp` and `users.level`
- [x] Level threshold logic (Recruit → Hero → Legend — 7 levels)
- [x] `GET /users/me` returns updated XP, level, donation_count after completion
- [x] Deploy latest backend to Railway — all endpoints verified

**Mobile Dev**
- [x] Quest alert screen: blood type, hospital, distance, urgency
- [x] Accept and Decline buttons wired to API
- [x] Quest Accepted screen: animated mission map, ETA countdown, QR check-in code, XP breakdown
- [x] "Simulate QR Check-in" button calls `/checkin/simulate`
- [x] Quest Complete screen: real donor name, hospital, XP counter, level display
- [x] Wire all screens together — full flow navigable without dead ends

**All team — Evening**
- [x] Run the full demo flow end-to-end
- [x] Log and triage all bugs
- [x] Assign blocking bugs to Day 4

**End of Day 3 checkpoint:** The complete loop — post request → push notification → accept → complete → XP — works on a real device. ✓

---

### Day 4 — Polish, Deploy & Present
**Theme:** Fix blocking bugs, make demo path bulletproof, present

**Morning — Bug fixes & polish**
- [x] Fix all bugs that break the demo path
- [x] Web TextInput fix: `KeyboardAvoidingView` disabled on web, decorative views get `pointerEvents="none"`
- [x] Loading states on all API-calling screens
- [x] Final backend deploy to Railway — all endpoints responding

**Backend Dev**
- [x] Production DB seeded: 5 hospitals, 15 donor accounts, 3 requester accounts
- [x] `reset.js` script — clears and re-seeds DB cleanly for multiple demo runs
- [x] Railway deployment stable and live
- [x] Fixed `acceptQuest` to be idempotent (no false "Quest is no longer available" errors)
- [x] Removed `ST_DWithin` distance gate — all compatible donors matched regardless of GPS

**Mobile Dev**
- [x] Quest Accepted: animated motorcycle map, ETA countdown, QR code display, XP preview
- [x] Quest Complete: uses real donor name, blood type, hospital, date — no hardcoded placeholders
- [x] RedQuest logo set as APK icon and adaptive icon
- [x] Splash screen updated to RedQuest red (`#C0001A`)
- [x] `eas.json` created with `preview` (APK) and `production` (AAB) build profiles
- [x] `api.js` fixed: URL sourced from `Constants.expoConfig.extra.apiBaseUrl` — no localhost fallback in builds
- [x] `app.json` updated: proper package name (`com.redquest.mobile`), `apiBaseUrl` in `extra`
- [x] APK exported via `eas build -p android --profile preview`

**Designer / PM**
- [x] All docs updated: `README`, `DATABASE_SCHEMA`, `API_SPEC`, `SYSTEM_ARCHITECTURE`, `PRODUCT_SPEC`, `UI_FLOWS`
- [x] Architecture overhauled: Hospital role removed, Family renamed to Requester
- [x] Two-role system (Donor / Requester) fully implemented across backend, mobile, and docs

**Before going on stage**
- [x] Phone charged above 80%
- [x] Backend live and responding
- [x] Demo accounts logged in
- [x] APK installed and tested on physical device

---

## Definition of Done — Final Status

- [x] A requester can register, log in, and post a blood request (with hospital dropdown)
- [x] A matched donor receives a push notification within 30 seconds
- [x] The donor sees the quest card with blood type, hospital, distance, and urgency
- [x] A donor can accept or decline the quest
- [x] Accepting shows an animated mission map, ETA countdown, and QR check-in code
- [x] Donor taps "Simulate QR Check-in" → XP awarded on Quest Complete screen
- [x] Quest Complete shows real data: donor name, blood type, hospital, donation count
- [x] The full loop runs on a real Android device (APK) without crashing
- [x] API URL is correctly baked into the APK via `Constants.expoConfig.extra.apiBaseUrl`

---

## Post-Hackathon Architectural Overhaul (Completed)

After the hackathon, the following major changes were made to professionalize the codebase:

| Change | Status |
|---|---|
| Removed Hospital user role entirely | ✅ Done |
| Renamed Family role to Requester | ✅ Done |
| Removed `riders` table and all rider dispatch logic | ✅ Done |
| Rewrote `migrate.js` with clean two-role schema | ✅ Done |
| Added `reset.js` for Railway database wipe | ✅ Done |
| Added 3 Requester test accounts to `seed.js` | ✅ Done |
| Deleted 6 Hospital/Rider mobile screens | ✅ Done |
| Fixed all emoji strings with Ionicons | ✅ Done |
| Fixed web TextInput issues (KAV, pointerEvents, overflow) | ✅ Done |
| Fixed APK API URL (Constants.extra — no localhost fallback) | ✅ Done |

---

## Risk Register

| Risk | Likelihood | Resolution |
|---|---|---|
| Push notifications fail on demo device | Medium | Expo Push tested; screen recording available as backup |
| Backend Railway free tier sleeps | Medium | Railway deployment live and stable |
| Geo-matching too slow | Low | PostGIS GIST index; distance gate removed for reliability |
| Network request failed in APK | Was blocking | Fixed — API URL baked in via `Constants.expoConfig.extra` |
| Scope creep | High | Resolved — two-role system is clean and focused |
