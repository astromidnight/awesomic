# Sous-Chef 🍳

A mobile-first recipe PWA whose signature feature is **Sous-Chef Mode**: hands-free,
voice-guided cooking with **live, pantry-adaptive ingredient substitution**. Say
*"I don't have butter"* mid-recipe and the app swaps the ingredient, recalculates
quantity, cook time and calories, updates the step text on screen, and keeps
narrating — no tap, no confirm step.

Built pixel-faithful to the Figma designs (page *UI — High fidelity*, 390×844),
with the token layer generated 1:1 from the *Design Tokens* collection.

## Run it

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # production build + PWA service worker
npm run preview    # serve the production build
```

Open on a phone (or a 390×844 viewport). Voice needs Chrome (desktop/Android) or
iOS Safari and mic permission; without it, Cook Mode degrades to a fully usable
tap-driven experience with the same layout.

## Run it on your phone

The mic only works in a secure context, so use the HTTPS phone mode:

```bash
npm run dev:phone        # HTTPS dev server on your LAN
```

1. Phone and Mac must be on the same Wi-Fi.
2. The terminal prints a `Network:` URL like `https://192.168.1.74:5173` —
   open it in Safari (iPhone) or Chrome (Android).
3. The certificate is self-signed, so the browser warns once: tap
   **Advanced → Continue/Proceed** (iOS: "Show Details → visit this website").
4. When Cook Mode asks for the microphone, tap **Allow**.
5. Optional, for the real PWA feel: Share → **Add to Home Screen** (iOS) or
   ⋮ → **Install app** (Android), then launch from the icon — full screen,
   no browser chrome.

iPhone note: speech recognition uses Siri dictation — if commands do nothing,
enable *Settings → Siri (or General → Keyboard) → Enable Dictation*.

To demo the production build instead: `npm run build && npm run preview:phone`
(same URL flow on port 4173).

## Architecture

```
src/
  data/          typed mock data layer behind a repository interface
    types.ts         Recipe, Ingredient, PantryItem, Substitution, …
    recipes.ts       32 seed recipes (24 match the "garlic pasta" query)
    substitutions.ts from → to, ratio, deltaKcal, deltaTimeMinutes
    nutrition.ts     kcal per ingredient-unit, for recomputing after swaps
    repository.ts    RecipeRepository interface + mock impl (API drops in later)
  stores/        Zustand
    pantryStore      persisted; the single source for every "% in pantry"
    filtersStore     diet/intolerance/equipment/skill/max-time + live counts
    cookSessionStore step, swap-adjusted ingredients, kcal/time, timers
    savedStore       bookmarks + cooked history (persisted)
  lib/
    pantryMatch.ts   pantryMatch(recipe) → owned/total/% — drives every badge
    substitute.ts    the no-confirm swap engine
    voice/           SousChefVoice service, command grammar, useCookSession
  components/    the Figma component library, one code component per variant set
  screens/       Onboarding (Flow 0), Home, Search, Filter Sheet, Recipe Detail,
                 Cook Mode, Completion, Pantry, Cookbook, Profile, /gallery
```

**Tokens.** `src/index.css` holds the entire design language as Tailwind v4
`@theme` tokens — emerald + ink ramps, semantic aliases, radius, the Lexend type
ramp and the soft shadow set. Components never use raw hex values.

**Nothing is faked.** Pantry percentages, the pantry banner, ingredient row
states (in pantry / swap / add), the "24 recipes" count, filter results and the
Apply button's live count are all computed from the stores. Edit the pantry and
watch every screen react.

## How the voice mode works

`SousChefVoice` wraps both halves of the Web Speech API:

- **Narration** (`SpeechSynthesis`) — speaks on entering Cook Mode and on every
  step change at a calm rate (0.95). The on-screen step text and the spoken text
  are the same string, including post-swap rewrites.
- **Recognition** (`SpeechRecognition`) — continuous, auto-restarting (Chrome
  kills idle sessions; the service quietly restarts them), and **suspended while
  the app is speaking** so it never hears itself. A WebAudio analyser feeds the
  live waveform under the mic indicator.

Transcripts go through a small intent grammar (`lib/voice/commands.ts`):
`next / previous / repeat / pause / resume / start timer / stop timer /
what's next / how much <ingredient>` — and the money feature:
**"I don't have X" / "replace X" / "swap the X" / "out of X"**.

A swap resolves in one pass with no confirmation:

1. Fuzzy-match the spoken name against the recipe's ingredients.
2. Look up candidates in the substitution table, **preferring one already in
   your pantry**.
3. Apply the ratio to the quantity, add the kcal/time deltas to the live
   session, and rewrite the ingredient list *and the step text*.
4. Surface the Voice Swap Card ("→ Swapped to olive oil · 3 tbsp · same cook
   time · −40 kcal"), speak the same summary, and resume narrating.

If no substitute exists, the assistant asks one clarifying question by voice
("say *skip it* or *keep it*") — both answers return to the flow with zero
touches. Undo/Keep affordances exist on the card for the rare glance at the
screen; the default path needs none.

**Resilience.** Permission denied or unsupported browser → the mic indicator
says so, a demo button appears, and every voice command has a tap equivalent.
A mic failure can never break cooking. (In dev, `window.sousChefSay("I don't
have butter")` feeds the exact recognition path — handy for demos.)

## Accessibility

- Touch targets ≥ 48px (visually-small controls get expanded hit areas)
- Body text ≥ 4.5:1 on its backgrounds; Cook Mode runs high-contrast ink-on-light
- Visible emerald focus rings; every control keyboard-operable (incl. the slider)
- `prefers-reduced-motion` swaps movement for fades everywhere (Framer Motion
  `useReducedMotion` + a CSS kill-switch)
- Live regions for step changes, timer, and result counts

## Design fidelity notes

- Figma wins on values: colours, type sizes, radii, shadows, paddings and copy
  were extracted from the file via the Figma MCP, not approximated.
- Where the design shows static values that the brief demands be computed
  (pantry %, result counts), the computed value is displayed — seeded so the
  default pantry reproduces the designed numbers (e.g. Creamy Garlic Pasta is
  genuinely 8/10 = 80%).
- Warmth (amber/peach) appears only in onboarding, empty states and the
  completion screen, per the visual direction.
