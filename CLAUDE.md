# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Janssen & Veronica Wedding Website** — A modern, animated wedding invitation and RSVP website for a wedding on 26 September 2026 in Batam, Indonesia. The site features elegant design with smooth scroll animations, event details, couple information, and an RSVP form.

## Tech Stack

- **Frontend**: React 19 with TypeScript
- **Build Tool**: Vite 8
- **Styling**: Tailwind CSS 4 with PostCSS
- **Animations**: Framer Motion 12
- **Icons**: Lucide React
- **Language**: Indonesian (Bahasa Indonesia)
- **Backend**: Google Apps Script (handles RSVP submissions)

## Development Commands

All commands run from `frontend/` directory.

```bash
npm run dev        # Start local dev server with hot reload (http://localhost:5173)
npm run build      # TypeScript check + Vite production build
npm run lint       # Run ESLint on codebase
npm run preview    # Preview production build locally
```

## Project Structure

```
frontend/
├── src/
│   ├── App.tsx              # Main app component (all sections, RSVP form)
│   ├── ConfirmedRSVP.tsx    # Success modal after RSVP submission
│   ├── index.css            # Global styles + custom utilities
│   ├── main.tsx             # Entry point
│   ├── assets/              # Images (hero backgrounds)
│   └── App.css              # Component-specific styles (if needed)
├── public/
│   └── favicon.svg          # Wedding monogram (J & V)
├── vite.config.ts           # Vite configuration
├── tsconfig.json            # TypeScript root config
├── tsconfig.app.json        # App-specific TS config
├── tsconfig.node.json       # Build tool TS config
├── eslint.config.js         # ESLint configuration
├── postcss.config.js        # PostCSS + Tailwind config
└── package.json             # Dependencies and scripts
```

## Architecture

### Single-Page Scroll Experience

The entire site is one page with smooth scroll sections, each triggered by navigation or scroll position:

1. **Hero Section** (`#hero`) — Full-screen with parallax background, couple names, save-the-date
2. **Quote Section** (`#quote`) — Centered inspirational quote with glow effect
3. **Invitation Text** (`#invitation`) — Formal invitation header
4. **Couple Section** (`#couple`) — Mempelai Pria (groom) and Mempelai Wanita (bride) profiles with photos
5. **Details Grid** (`#details`) — Event schedule with times, locations, Google Maps embeds
6. **RSVP Section** (`#rsvp`) — Form with name, phone, and optional message; posts to Google Apps Script
7. **Footer** — Copyright info

### State Management

All state lives in `App.tsx`:
- `rsvpData` — Current form input (name, phone, message)
- `isSubmitted` — Show/hide success modal
- `nameError`, `phoneError` — Validation errors
- `isSubmitting` — Disable submit button during API call
- `isLoaded` — Trigger initial animations

### Styling Approach

- **Tailwind CSS** for all component styling (no CSS modules)
- **Custom utilities** in `index.css` (`.gold-shimmer`, `.noise`)
- **Framer Motion** for scroll-triggered animations and entrance effects
- **Color scheme**: Dark theme (`#0a0a0a` background), gold accents (`#ffd700`), white/zinc text
- **Responsive**: Mobile-first, breakpoints at `md` (768px)

### Forms & API Integration

**RSVP Form** posts to Google Apps Script URL (constant `APPS_SCRIPT_URL` near the top of App.tsx):
```
https://script.google.com/macros/s/AKfycbwp9mIWcmcS5CcW5jOt9yv1zyXAkXiuUwM-2POA6RT9cpox3CB5A2DyuDte_5ufuG-p/exec
```

Submission payload:
```json
{
  "name": "string",
  "phone": "string",
  "message": "string (optional)"
}
```

Expected response:
```json
{
  "status": "success"
}
```

## Planned Features

### Feature 1: Personalized Invitations with Unique URLs

**Goal**: Each guest receives a unique invitation link with their name pre-filled in the website.

**How it works**:
- Generate unique tokens/IDs for each guest (e.g., `/rsvp?guest=abc123def`)
- Store guest data in Google Sheet: Name | Email | Unique Token
- On page load, parse guest ID from URL and fetch guest name from backend
- Display: "Welcome, [Guest Name]" on the invitation page
- Name field auto-populates with guest name (optional edit allowed)

**Implementation notes**:
- Add URL parameter parsing to App.tsx
- Create Apps Script endpoint: `GET /getGuestInfo?token=abc123` → returns `{name, maxGuests}`
- Modify RSVP form to accept token in submission
- Update success modal to show personalized message

### Feature 2: Per-Person RSVP Guest Limits

**Goal**: Each guest has a different maximum number of attendees they can bring.

**How it works**:
- Store in Google Sheet: Name | Token | Max Guests Allowed (e.g., 3, 5, etc.)
- Fetch guest's max limit when their page loads
- Add field to RSVP form: "Number of guests attending" with validation
- Block submission if guest tries to exceed their limit
- Show validation message: "You can bring up to {max} people"
- Apps Script validates limit server-side before recording RSVP

**Implementation notes**:
- Guest data endpoint returns `{ name, maxGuests }`
- Add number input field to RSVP form with min=1, max={fetched value}
- Add client-side + server-side validation
- Update RSVP payload to include `guestCount`
- Track "confirmed attendees" in spreadsheet for headcount

## Backend (Google Apps Script)

The Apps Script endpoint currently:
1. Receives POST with name, phone, message
2. Appends to spreadsheet
3. Returns `{status: "success"}`

**To support new features**, update Apps Script to:
1. Add endpoint to query guest by token → return `{name, maxGuests}`
2. Validate RSVP submission: guest count ≤ maxGuests
3. Store `guestCount` in spreadsheet alongside RSVP data

**Apps Script URL**: [Update URL in App.tsx line 40 if re-deployed](frontend/src/App.tsx#L40)

## Notes

- **Language**: All user-facing text is in Indonesian (Bahasa Indonesia). Keep translations consistent.
- **Styling**: Custom colors use Tailwind's arbitrary values (e.g., `bg-[#0a0a0a]`). Ensure contrast for accessibility.
- **Animations**: Framer Motion `whileInView` triggers animations once as user scrolls. `viewport={{ once: false }}` keeps animations repeating (useful for ambient effects).
- **Maps**: Google Maps embeds are inverted for dark theme using CSS filter.
- **Deployment**: Run `npm run build` to generate production bundle in `dist/`. Deploy as static site.
