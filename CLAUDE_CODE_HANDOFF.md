# Warrior Intelligence Project — Claude Code Handoff
## Next.js Build + Asset Integration + Vercel Deploy
**Date:** May 29, 2026  
**Handoff from:** Claude (Sonnet 4.6, Chat session)  
**Handoff to:** Claude Code

---

## WHAT EXISTS NOW

A production single-page HTML site is **live at https://wip-site.vercel.app** — deployed to Vercel under `jayaces-projects/wip-site`.

The current `index.html` in `C:\Users\JMoor\code_projects\wip-site\` is the **warmed design spec** — it is the reference document for everything Code builds. Do not deviate from it.

---

## YOUR THREE JOBS

### Job 1 — Convert to Next.js
Convert `index.html` to a Next.js app (App Router, TypeScript optional). Keep it as a **single-page marketing site** — no dynamic routing needed yet. The carousel JavaScript in the HTML must become a proper React component.

**Stack:**
- Next.js (latest stable)
- No UI framework — the design system is already built in CSS; preserve it exactly
- Tailwind is NOT needed — hand-rolled CSS is already spec'd
- No database, no API routes at this stage

**File structure:**
```
wip-site-next/
  app/
    layout.tsx        ← nav + footer wrapper
    page.tsx          ← all 9 sections
    globals.css       ← design tokens + all CSS from index.html
  components/
    Nav.tsx
    Hero.tsx
    Wayfinding.tsx
    Warriors.tsx
    Carousel.tsx      ← the testimonial carousel (React, not vanilla JS)
    StoryBlock.tsx    ← menstrual cycle story block
    Caregivers.tsx
    Researchers.tsx
    Clinicians.tsx
    Partners.tsx
    Governance.tsx
    FAQ.tsx
    Footer.tsx
  public/
    logo-horizontal.png   ← already exists in wip-site/
    logo-icon.png         ← already exists in wip-site/
    assets/
      photos/             ← placeholder directory for photos (see below)
      illustrations/      ← placeholder directory for portraits (see below)
```

### Job 2 — Swap Placeholders for Real Assets

The HTML contains labeled placeholder comments. When real assets arrive, slot them in. For now, keep the gold-initial fallback states — they are intentional design choices, not errors.

**Photo placeholders (comments in HTML):**
| Placeholder label | Location in HTML | File to use when available |
|---|---|---|
| `[PHOTO: cold_car]` | Hero background | `/assets/photos/cold_car.jpg` |
| `[PHOTO: hands_heating_pad]` | Warriors How It Works Step 1 | `/assets/photos/hands_heating_pad.jpg` |
| `[PHOTO: steam_mug]` | Caregivers section bg texture | `/assets/photos/steam_mug.jpg` |
| `[PHOTO: protocol_sheet]` | Clinicians section bg | `/assets/photos/protocol_sheet.jpg` |
| `[PHOTO: waiting_room]` | Warriors How It Works Step 2 | `/assets/photos/waiting_room.jpg` |

**Portrait placeholders:**
| Placeholder | Shape | Use | File naming convention |
|---|---|---|---|
| Circle 80px | `.portrait--circle` | Inside quote cards | `WIP_Portrait_[ID]_Navy.svg` |
| Portrait 3:4 (240×320) | `.portrait--portrait` | Researchers section hero | `WIP_Portrait_02_Navy.svg` |
| Square 120px | `.portrait--square` | Governance council grid (×5) | `WIP_Portrait_[01-05]_Navy.svg` |

**When photos arrive:** Add as `<Image>` (Next.js) with `loading="lazy"` and the dark overlay per spec.

**Hero photo overlay spec:**
```css
.hero { background-image: url('/assets/photos/cold_car.jpg'); background-size: cover; background-position: center; }
.hero::before { content: ''; position: absolute; inset: 0; background: rgba(13,27,42,0.82); }
```

### Job 3 — Deploy to Vercel

- Team: `jayaces-projects`
- Project name: keep as `wip-site` or rename to `warrior-intelligence-project`
- Deploy token is in the project — use `VERCEL_TOKEN` environment variable
- Deploy as production (`--prod`)
- After deploy, return the live URL

---

## CAROUSEL SPEC (React Component)

The testimonial carousel is in the HTML with full vanilla JS. Convert it to a React component:

```
Behavior:
- Fade transition, 400ms ease-in-out (NOT slide)
- Auto-advance: 6 seconds
- Pause on hover (mouseenter/mouseleave), resume on mouse-leave
- Touch swipe: left = next, right = prev (threshold: 40px delta)
- Dot navigation below carousel track
- prefers-reduced-motion: disable autoplay entirely
- 5 quotes total (rotation order: Q1 → Q4 → Q5 → Q3 → Q6 per spec)
- useRef for timer, cleanup on unmount
```

---

## DESIGN SYSTEM — DO NOT DEVIATE

```css
--gold:        #C1A004   /* Warmth, dignity, Warrior moments */
--navy:        #0D1B2A   /* Authority, institutional surfaces */
--crimson:     #990000   /* Urgency, CTAs, data callouts */
--onyx:        #0F0F0F   /* Body text, headlines on light */
--white-smoke: #F5F5F5   /* Breath, calm, Caregiver backgrounds */
--mist:        #F2F1EE   /* Clinical variant */
--white:       #FFFFFF   /* Cards */
--gray-mid:    #7A7870   /* Attribution on light cards */

Fonts: DM Serif Display (headings/quotes) + DM Sans (body)
Grid: 8px base
Container: max-width 1160px, padding 40px (24px mobile)
```

---

## NAMING RULE — CRITICAL

**Do not use "WIP" as a standalone abbreviation anywhere in user-facing copy.**  
The community flagged "WIP" as sounding like "whip" — this is a predominantly Black American community. It's been retired from all public-facing text.

- Use **"Warrior Intelligence Project"** (full name) where needed
- Developer code, file names, and internal comments are fine — those are not user-facing

---

## LIVE LINKS ALREADY WIRED

These are live and must be preserved:

| CTA | URL |
|---|---|
| Log Your Crisis | `https://tally.so/r/b59467` |
| Dashboard | `https://warrior-intelligence-dashboard.vercel.app/` |
| Phone | `1-866-346-2858` |
| Email | `info@kindredcompassholdings.com` |
| Partner contact | `/partners/contact` (placeholder — routes to Tally or mailto for now) |
| Hii white paper | `/partners/hii` (placeholder — gated form, not live yet) |

---

## LOGOS

Two PNG files already exist in `wip-site/`:
- `logo-horizontal.png` — 2048×1364px transparent canvas (large padding in PNG)
- `logo-icon.png` — 1536×1024px transparent canvas

**Logo sizing fix already applied:** Use `object-fit: contain` with `object-position: left center` and a fixed width/height to compensate for the transparent canvas padding.

```css
/* Nav logo */
width: 180px; height: 52px; object-fit: contain; object-position: left center;

/* Footer logo */
width: 200px; height: 60px; object-fit: contain; object-position: left center;
```

---

## WHAT NOT TO BUILD (V2 — DO NOT BUILD NOW)

- Live Supabase data counters
- Governance vote log
- Log number quote attributions
- Any authenticated routes
- Hii white paper gated form (just a placeholder link for now)

---

## INTEGRITY RULE

Every stat on the site is audit-verified against the CSV tracker export (Python/pandas). Do not change, round differently, or editorialize any percentage. The numbers are locked:

```
93 Warriors · 111 crisis logs · 6 countries
65% cold weather · 54% high stress · 22% menstrual cycle · 36% sleep
56% sought ER · 43% admitted · 39% T&R · 44% managed at home
64% protocol followed · 38% protocol ignored
```

---

*Handoff prepared May 29, 2026. Source design: WIP_Warmed_Handoff.html. Live reference: https://wip-site.vercel.app*  
*Our Pain. Our Data. Our Power.*
