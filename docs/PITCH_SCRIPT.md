# RedQuest — Hackathon Pitch Script

**Time limit:** 3 minutes  
**Format:** 1 min pitch → 1.5 min live demo → 0.5 min close  
**Presenter(s):** TBD

---

## Setup Checklist (Before You Go On Stage)

- [ ] Phone is fully charged (above 80%)
- [ ] Wi-Fi or mobile data connected and tested at venue
- [ ] Demo account pre-loaded: blood request already set up and ready to trigger
- [ ] Second phone or tablet available as the "donor device"
- [ ] Screen recording ready as a backup (stored on phone and in cloud)
- [ ] Slides advanced to opening slide
- [ ] FCM push notifications tested on both devices in the venue network

**Note (Hackathon MVP):** For the live demo, the hospital QR check-in and full badge/leaderboard flows may be simulated. If QR scanning is not available on stage, use the recorded demo or the `/checkin/simulate` endpoint; show badges/leaderboard as screenshots if needed.

---

## The Script

---

### Part 1 — The Problem (30 seconds)

> "Every 2 seconds, someone in the Philippines needs blood.  
> But when your father is bleeding out in the ICU — blood type O+, 2 units needed — you're not thinking about blood drives.  
> You're frantically calling relatives, posting on Facebook, begging strangers.  
> The blood exists. The donors exist. The problem is **connection** — and time."

*[Beat. Let it land.]*

---

### Part 2 — The Solution (30 seconds)

> "RedQuest is a mobile platform that turns blood donation into an emergency quest.  
>
> A family member posts a blood request — blood type, hospital, urgency.  
> Within seconds, we geo-match nearby compatible donors and send them a push notification.  
> If a donor accepts, a motorcycle rider — paid for by the requester — is dispatched immediately to pick them up and bring them to the hospital.  
>
> Donors don't need to figure out transport. They just tap **Accept**."

---

### Part 3 — Live Demo (90 seconds)

*[Switch to phone. Talk through what you're doing.]*

> "Let me show you how it works."

**Step 1 — Post the request**
> "Maria, whose father just had emergency surgery, opens the requester app. She selects O+, 2 units, St. Luke's BGC, urgency: Urgent. She taps Post."

*[Tap Post Request. Show the 'Searching...' screen.]*

**Step 2 — Quest alert arrives**
> "Three kilometers away, Kuya Jun — an O+ donor — feels his phone buzz."

*[Switch to donor phone. Show the push notification and quest card with the countdown timer.]*

> "He has 5 minutes. He sees the blood type, the hospital, the distance. He doesn't have to drive himself there. He just taps..."

*[Tap Accept Quest.]*

**Step 3 — Rider dispatched**
> "A rider is dispatched. Kuya Jun can see the ETA. Maria's screen updates — donor matched, rider en route."

*[Show both screens side by side if possible, or switch between them quickly.]*

**Step 4 — QR check-in**
> "When Kuya Jun arrives at the blood bank, he shows his QR code. The nurse scans it."

*[Show QR screen. Simulate scan.]*

**Step 5 — Quest complete**
> "Quest complete. Kuya Jun earns 250 XP, a Speed Hero badge — and someone's father gets the blood he needs."

*[Show completion screen with XP animation.]*

---

### Part 4 — Why This Works (15 seconds)

> "The 'quest' framing isn't decoration. It's the product. Donors who feel like heroes donate again.  
> Our gamification loop — XP, badges, leaderboard — turns a one-time act into a lifestyle."

---

### Part 5 — The Close (15 seconds)

> "RedQuest. The blood exists. The donors exist. We just connect them — and get them there.  
> Thank you."

*[Smile. Hold for applause.]*

---

## Slide Outline (8 slides — if required)

| Slide | Title | Key visual |
|---|---|---|
| 1 | RedQuest | Logo + tagline: "Every quest saves a life" |
| 2 | The problem | 2 seconds / someone needs blood. Stats from DOH. |
| 3 | The solution | 3-panel flow: Post → Match → Ride |
| 4 | How it works | Quest flow diagram (from SYSTEM_ARCHITECTURE.md) |
| 5 | The gamification loop | XP bar + badge grid |
| 6 | Tech stack | Simple icons: React Native · Node · PostGIS · FCM |
| 7 | Roadmap | 4-phase table (from HACKATHON_PLAN.md) |
| 8 | Ask / close | "RedQuest. Every quest saves a life." |

---

## Q&A Prep — Tough Judge Questions

### "How do you verify that a donor's declared blood type is correct?"
> "Blood type is self-declared at registration — which mirrors how most existing donor programs work. The hospital blood bank does a crossmatch test before every transfusion regardless of declared type. This is standard medical protocol. Our platform doesn't bypass that — we just get the donor to the hospital faster. In Phase 2, we plan to mark blood types as 'lab-verified' after a donor's first confirmed donation."

---

### "What if no donors are nearby?"
> "The system uses an expanding-ring fallback. If no donors accept within 5 km, it expands to 10 km, then 20 km, then city-wide. For critical urgency, we skip straight to a wider radius. We also plan to add an SMS fallback for donors without smartphones in Phase 2 — low-cost SIM broadcast to registered numbers."

---

### "What stops someone from posting a fake blood request to trigger a donor?"
> "Requesters must register with a verified phone number and link to a real hospital from our verified partner list. In Phase 1, hospital staff can also post directly from a staff account, bypassing the family entirely. Repeat false requests would result in account suspension. We log all requests and can detect patterns."

---

### "How do you compete with Facebook groups that already do this?"
> "Facebook groups broadcast to thousands and get ignored. RedQuest is a precision geo-match to 3–5 compatible people within walking distance. The rider dispatch is what no Facebook group can offer — it removes the single biggest barrier to donation, which is transport. That's the moat."

---

### "Is this legal? Are you paying donors?"
> "No. Donors are never paid. The only payment is the rider transport fee, paid by the requester, which covers motorcycle pickup only — not the donation itself. This is consistent with Republic Act 7719, which mandates voluntary, non-remunerated blood donation. Riders are paid as logistics workers, not as agents of donation."

---

### "What's your revenue model?"
> "Three streams: (1) Rider dispatch fee markup — we take a small margin on each transport booking. (2) Hospital B2B subscriptions — hospitals pay a monthly fee for priority dispatch, staff accounts, and analytics. (3) City government partnerships — LGUs pay to subsidize free transport for low-income requesters. The core donor experience is always free."

---

### "Why a motorcycle? What if it rains or it's dangerous?"
> "In Philippine cities, motorcycles are the fastest urban transport, especially in traffic. We partner with existing courier platforms like Lalamove and Grab Express, whose riders are already insured and GPS-tracked. Weather is a real risk — in Phase 2, we'll add a rider decline option with automatic re-dispatch."

---

## Backup Demo Scenario (If Live Demo Fails)

1. Open the screen recording stored on device
2. Narrate over the recording as if it's live: "So here we see Juan receiving the quest..."
3. Have screenshots of each screen loaded in a separate photo app as a last resort
4. Never apologize excessively — technical issues happen at hackathons. Keep moving.

---

## Timing Practice Guide

| Segment | Target | Hard Max |
|---|---|---|
| Problem | 30 sec | 40 sec |
| Solution | 30 sec | 35 sec |
| Demo | 90 sec | 100 sec |
| Why it works | 15 sec | 20 sec |
| Close | 15 sec | 15 sec |
| **Total** | **3:00** | **3:30** |

Practice the demo 10+ times before the event. The timer on the quest card ticking down is the most visually compelling moment — make sure it's clearly visible and you pause on it for 2–3 seconds.
