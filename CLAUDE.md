# mocktailsbyify Landing Page

## Project Overview
Single-page landing page for **mocktailsbyify** — a home-based mocktails catering business serving birthdays, weddings, parties, dinners, and private events.

## Tech Stack
- **Plain HTML + CSS + Vanilla JS** — zero dependencies, zero build step
- Google Fonts via CDN (`<link>` tags)
- No package.json, no framework, no build tools

## How to Run
- Open `index.html` in a browser — that's it
- For live reload: VS Code Live Server extension or `npx serve .`

## Design System: "Tropical Fresh"
- **Display font**: Fraunces (Google Fonts) — expressive serif
- **Body font**: Nunito Sans (Google Fonts) — rounded humanist sans
- **Primary accent**: `--palm` (#1B6B4A) — deep tropical green
- **Secondary accent**: `--citrus` (#F28C38) — warm orange
- **Tertiary accent**: `--coral` (#E8636A) — vibrant coral
- **Base**: `--cream` (#FFF9F0) warm off-white background
- **Text**: `--bark` (#2C1810) rich dark brown

## Folder Structure
```
index.html              # All page sections
css/
  variables.css         # CSS custom properties (colors, fonts, spacing)
  reset.css             # Minimal CSS reset
  base.css              # Typography, body styles
  layout.css            # Containers, grids, responsive utilities
  components.css        # Buttons, cards, form fields
  sections.css          # Section-specific styles
  animations.css        # @keyframes + scroll-reveal utilities
js/
  main.js               # IntersectionObserver, nav, carousel, form
assets/svg/             # Decorative SVG illustrations
```

## Key Conventions
- All CSS colors/fonts/spacing via CSS custom properties in `variables.css`
- Scroll animations use `.reveal` class + `IntersectionObserver` (no animation libraries)
- Mobile-first responsive: < 640px (mobile), 640-1024px (tablet), > 1024px (desktop)
- Form uses `data-webhook-url` attribute for configurable submission endpoint
- `prefers-reduced-motion` disables all animations

## Content
- All content is placeholder — swap with real business copy, images, and testimonials
- Drink cards use gradient backgrounds as image placeholders
- Gallery items use colored gradients simulating photos
