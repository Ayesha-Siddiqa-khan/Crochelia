# Crochelia — Product & Engineering Specification

> **Create. Crochet. Share.**
> The digital home for crocheters — discover, plan, calculate, make, track, share, and sell.

**Document status:** Authoritative build specification. Supersedes `Crochelia_PRD.docx` as the working brief; the PRD remains the record of original product intent, and nothing in it has been dropped here.

**Audience:** The engineering team and the AI coding agent implementing Crochelia.

---

## Table of Contents

1. [Product Vision](#1-product-vision)
2. [Design Philosophy & Visual Identity](#2-design-philosophy--visual-identity)
3. [Hero & Landing Experience](#3-hero--landing-experience)
4. [AI-First Experience](#4-ai-first-experience)
5. [Motion & Animation System](#5-motion--animation-system)
6. [3D, Depth & Interactivity](#6-3d-depth--interactivity)
7. [Component System](#7-component-system)
8. [Mobile Experience](#8-mobile-experience)
9. [Feature Specification](#9-feature-specification)
10. [Technical Architecture](#10-technical-architecture)
11. [Database Design](#11-database-design)
12. [Development Rules](#12-development-rules)
13. [Testing Requirements](#13-testing-requirements)
14. [Final Quality Checklist](#14-final-quality-checklist)

---

## 1. Product Vision

### 1.1 What Crochelia Is

Crochelia is a premium digital home for crocheters. A user should be able to open Crochelia and manage nearly everything about their crochet life in one place — from the first spark of an idea to a finished piece sold to a customer.

Most tools in this space are a spreadsheet, a Pinterest board, a Ravelry tab, a calculator on someone's blog, and a notes app. Crochelia replaces that scattered stack with one connected, beautiful product.

### 1.2 The Core Journey

Every screen in Crochelia must be locatable on this spine. If a feature cannot be placed on it, question whether it belongs.

```
Discover  →  Plan  →  Calculate  →  Make  →  Track  →  Share  →  Sell
```

| Stage | The user's question | Where it lives |
|---|---|---|
| **Discover** | "What should I make?" | Discover feed, Pattern Library, AI recommendations |
| **Plan** | "What will this take?" | Project Planner, Outfit Designer |
| **Calculate** | "How many, how much?" | Crochet Calculator, Yarn Calculator, Stash coverage |
| **Make** | "What's my next step?" | Project workspace, pattern reader, row counter |
| **Track** | "How far am I?" | Progress tracking, photo timeline, time log |
| **Share** | "Look what I made" | Community, profile portfolio, collections |
| **Sell** | "Can I make money from this?" | Products, Orders, Customers, Pricing, Seller dashboard |

### 1.3 The Canonical Scenario

This walkthrough is the acceptance test for the whole product. When it works end to end, beautifully, Crochelia is real.

> **Ayesha says: "I want to make a medium granny-square cardigan in blush and cream."**
>
> 1. **Discover** — Crochelia surfaces granny-square cardigans matched to her skill level and the yarn already in her stash.
> 2. **Plan** — Her sentence becomes a structured draft project: type `cardigan`, construction `granny-square`, size `M`, palette `blush + cream`. She adjusts what the system got wrong.
> 3. **Calculate** — The calculator derives the panel dimensions for size M, then the square count: front, back, sleeves, total. Every number is shown with the arithmetic behind it.
> 4. **Estimate** — The yarn calculator returns an estimated yardage and skein count per colour, clearly labelled as an estimate with a stated confidence and a recommended buffer.
> 5. **Stash check** — "You already have about 72% of the blush you'll need. You're roughly 180g short of cream." With a one-tap shopping list for the gap.
> 6. **Make** — The project is created with its piece checklist. The pattern reader keeps her place; the row counter is one thumb-tap.
> 7. **Track** — She ticks off squares. `32 / 40`. Progress animates. She adds a photo to the timeline.
> 8. **Share** — She posts the finished cardigan to the community, tagged with the pattern and the yarn she used.
> 9. **Sell** — Someone asks to buy one. Pricing calculator gives a costed suggestion. It becomes a product, then an order, then revenue.

### 1.4 Users & Roles

**Audiences:** beginner crocheters · hobbyists · experienced makers · pattern designers · content creators · crochet sellers · small handmade businesses.

**Roles:**

| Role | Capabilities |
|---|---|
| `user` | Full personal use: projects, stash, calculators, patterns, community, profile |
| `designer` | Everything in `user`, plus authoring, versioning and publishing patterns |
| `seller` | Everything in `user`, plus the Business workspace: products, inventory, customers, orders, expenses |
| `admin` | Moderation, content review, user management, feature flags. Never granted through the UI. |

Roles are **additive capability flags**, not a hierarchy — one account can be a designer *and* a seller. Model them as a set, not a single enum column.

### 1.5 Product Principles

1. **Show the maths.** Any number Crochelia produces can be expanded to reveal how it was derived. Trust is the product.
2. **Estimates are labelled as estimates.** Never present an estimate with the confidence of a calculation. This applies to yarn, time, cost, and price.
3. **The stash is context, everywhere.** What a user already owns should shape what the product suggests.
4. **Beautiful by default, useful under pressure.** It should look like a lifestyle magazine and still work with one hand, mid-row, in bad light.
5. **The user's work is sacred.** Progress, photos, notes and drafts are never lost, never silently overwritten, always exportable.

---

## 2. Design Philosophy & Visual Identity

### 2.1 What Crochelia Is Not

This section exists because the default gravity of any web app is toward generic. Resist it deliberately.

| Not this | Because |
|---|---|
| A SaaS admin dashboard | No dense grey data tables, no sidebar-of-everything, no chart wall |
| A template site | No stock hero + 3-feature-cards + testimonial + pricing skeleton |
| A basic CRUD app | Forms are experiences here, not database editors with labels |
| A generic AI wrapper | No bolted-on chat bubble in the corner as the entire "AI strategy" |
| Childish or twee | Crochet is not a children's craft. No comic fonts, no bouncing emoji, no pastel overload |
| A wall of pink | Pink is the accent, not the surface. White dominates |

### 2.2 The Feeling

Crochelia should read as: **elegant · soft · creative · premium · modern · warm · clean · image-forward.**

Reference the visual language of premium lifestyle publishing, high-end fashion e-commerce, and modern creative marketplaces — generous whitespace, confident typography, photography given room to breathe, restraint in ornament.

### 2.3 Colour Tokens

White is the dominant surface. Pink is the brand. Charcoal is the voice. Everything else is quiet.

```css
:root {
  /* Surfaces — white dominant */
  --surface-base:        #FFFFFF;  /* Primary page background */
  --surface-raised:      #FFFFFF;  /* Cards, sheets — separated by border + shadow, not fill */
  --surface-sunken:      #FCFAFA;  /* Section bands, inset wells */
  --surface-blush:       #FFF6F8;  /* Warm tint for emphasis regions */
  --surface-blush-deep:  #FDEBF0;  /* Selected rows, active nav pill */
  --surface-overlay:     rgba(28, 25, 26, 0.40);  /* Modal scrim */

  /* Brand — pink ramp */
  --pink-50:   #FFF5F8;
  --pink-100:  #FFE4EC;
  --pink-200:  #FFC9DA;
  --pink-300:  #FBA5C0;
  --pink-400:  #F27CA3;
  --pink-500:  #E85D8A;   /* Brand primary — CTAs, active states */
  --pink-600:  #D14574;   /* Hover */
  --pink-700:  #AE3159;   /* Pressed, and text-on-white when AA is required */
  --pink-800:  #862544;
  --pink-900:  #5E1A30;

  /* Text — charcoal, not black */
  --text-primary:    #1C191A;
  --text-secondary:  #57504F;
  --text-tertiary:   #857C7B;
  --text-disabled:   #B4ADAC;
  --text-on-brand:   #FFFFFF;
  --text-brand:      var(--pink-700);   /* Brand-coloured text on white: 5.4:1 */

  /* Borders — light, warm-neutral */
  --border-subtle:   #F2EEEE;
  --border-default:  #E7E1E1;
  --border-strong:   #D6CECE;
  --border-brand:    var(--pink-300);
  --border-focus:    var(--pink-500);

  /* Semantic */
  --success-fg: #1F7A54;  --success-bg: #E9F7F0;
  --warning-fg: #8A5A00;  --warning-bg: #FFF6E3;
  --danger-fg:  #B3261E;  --danger-bg:  #FDECEA;
  --info-fg:    #2A5D9F;  --info-bg:    #EDF3FC;

  /* Craft accents — used only for yarn/fibre/colourway chips and data viz.
     Never for UI chrome. */
  --accent-cream:   #F5EBDC;
  --accent-sand:    #E4D4BE;
  --accent-clay:    #C98E76;
  --accent-sage:    #9FB3A0;
  --accent-slate:   #8E9AAB;
  --accent-plum:    #9C7BA3;
}
```

**Colour rules**

- Pink is reserved for: primary actions, active navigation, progress fill, selected state, focus rings, key badges, and links. Nothing else.
- Never use `--pink-500` for body text on white — it fails AA. Use `--text-brand` (`--pink-700`).
- No pink-on-pink gradients as page backgrounds. A gradient may appear in the hero and in at most one section band.
- Craft accent colours are for representing *yarn*, never for representing *state*.
- Dark mode is **out of scope for v1**. Do not half-build it. Design tokens are already indirected, so it can be added later without a rewrite.

### 2.4 Typography

Two families. No more.

```css
--font-display: 'Fraunces', 'Playfair Display', Georgia, serif;  /* Warm, high-contrast serif */
--font-body:    'Inter', system-ui, -apple-system, 'Segoe UI', sans-serif;
--font-mono:    'JetBrains Mono', ui-monospace, monospace;       /* Stitch counts, abbreviations */
```

- **Display serif** — hero, page titles, section headings, editorial numbers. It carries the personality.
- **Body sans** — everything else. It carries the readability. Never set body copy in the display face.
- **Mono** — pattern instructions, stitch abbreviations, and any place column alignment aids comprehension.

```css
--text-display-xl: clamp(3rem, 7vw, 5.5rem);   line-height: 0.98; letter-spacing: -0.03em;
--text-display-l:  clamp(2.25rem, 4.5vw, 3.5rem); line-height: 1.05; letter-spacing: -0.02em;
--text-h1:  2rem;     line-height: 1.15;  letter-spacing: -0.015em;
--text-h2:  1.5rem;   line-height: 1.25;  letter-spacing: -0.01em;
--text-h3:  1.25rem;  line-height: 1.35;
--text-body-l: 1.125rem; line-height: 1.6;
--text-body:   1rem;     line-height: 1.6;
--text-sm:     0.875rem; line-height: 1.5;
--text-xs:     0.75rem;  line-height: 1.4;  letter-spacing: 0.02em;
```

Body copy never goes below `0.875rem`. Measure caps at ~68 characters for prose, ~78 for pattern instructions.

### 2.5 Space, Radius, Elevation

```css
/* 4px base scale */
--space-1: 4px;   --space-2: 8px;   --space-3: 12px;  --space-4: 16px;
--space-5: 24px;  --space-6: 32px;  --space-7: 48px;  --space-8: 64px;
--space-9: 96px;  --space-10: 128px;

/* Radius — generously rounded, never pill-everything */
--radius-sm:   8px;    /* chips, badges, small inputs */
--radius-md:   12px;   /* buttons, inputs */
--radius-lg:   20px;   /* cards */
--radius-xl:   28px;   /* modals, sheets, feature panels */
--radius-full: 9999px; /* avatars, toggles, nav pills only */

/* Elevation — soft, warm-tinted, never harsh */
--shadow-xs: 0 1px 2px rgba(28,25,26,0.04);
--shadow-sm: 0 2px 8px rgba(28,25,26,0.05);
--shadow-md: 0 8px 24px rgba(28,25,26,0.07);
--shadow-lg: 0 16px 48px rgba(28,25,26,0.10);
--shadow-brand: 0 8px 24px rgba(232,93,138,0.18);  /* Primary CTA only */
```

**Elevation rules:** a card gets `--border-subtle` **and** `--shadow-sm`, never a heavy shadow alone. Elevation never exceeds `--shadow-lg`. No stacked shadows. Vertical section rhythm on desktop is `--space-9` or `--space-10`; anything tighter reads as cramped and kills the premium feel.

### 2.6 Imagery

Photography is the primary decoration. Get it right and ornament becomes unnecessary.

- Natural light, warm neutral surroundings, shallow depth of field, hands-in-frame where it tells a story.
- Every image is served responsively with an explicit aspect ratio to prevent layout shift, a blur or dominant-colour placeholder, and real `alt` text describing the piece.
- Product, project and pattern imagery uses consistent aspect ratios per surface (`4:5` for garment cards, `1:1` for yarn and squares, `16:9` for editorial banners).
- **No stock-photo clichés.** No smiling model pointing at a laptop.
- Ship with genuinely empty galleries rather than placeholder photos dressed up as user content.

### 2.7 Iconography

One system: **Lucide**. No mixing. `1.5px` stroke, `20px` default, `24px` in touch targets. Icons never appear without a label or an `aria-label`. No emoji in UI chrome — emoji is permitted only in user-authored content and in a small number of intentionally warm empty states.

---

## 3. Hero & Landing Experience

The landing page is a product launch page, not a marketing template. It has one job: in five seconds, a crocheter should think *"this was made for me."*

### 3.1 Hero Composition

Full-viewport (`100svh`, not `100vh` — mobile browser chrome). Three depth planes:

| Plane | Content | Behaviour |
|---|---|---|
| **Back** | Soft blush gradient mesh, very slow drift | Parallax factor `0.15` |
| **Mid** | The 3D yarn-and-stitch scene (§6), or its fallback | Parallax factor `0.4`, subtle pointer-tracking |
| **Front** | Headline, subhead, CTAs, floating live preview card | Parallax factor `1.0` (static), CTAs never move |

**Copy:**

```
Create. Crochet. Share.                      ← display-xl, serif, "Crochet." in --text-brand

Plan your projects, discover beautiful patterns,
manage your yarn, track your progress,
and share your crochet journey.               ← body-l, --text-secondary, max 52ch

[ Start creating → ]   [ Explore patterns ]   ← primary (pink) + secondary (white/pink border)
```

**Entrance choreography** (total ≤ 900ms, then done — no looping distraction):

| Order | Element | Delay | Motion |
|---|---|---|---|
| 1 | Headline, per-word | 0ms, stagger 60ms | Fade + rise 16px |
| 2 | Subhead | 320ms | Fade + rise 12px |
| 3 | CTA row | 460ms | Fade + rise 8px |
| 4 | 3D scene | 200ms | Opacity fade-in as it finishes loading |
| 5 | Live preview card | 620ms | Fade + rise 24px + scale `0.96 → 1` |

Under `prefers-reduced-motion`, all of the above collapse to a single 200ms opacity fade of the whole hero. Nothing translates. Nothing staggers.

### 3.2 The Live Preview Card

This is the hero's differentiator and it is **non-negotiable that it be real**. Floating over the hero, a working instance of the granny-square calculator:

```
┌───────────────────────────────────┐
│  Granny square calculator         │
│                                   │
│  Width   [ 50 ] cm                │
│  Length  [ 60 ] cm                │
│  Square  [ 10 ] cm                │
│  ───────────────────────────────  │
│      5 across  ×  6 down          │
│                                   │
│         30 squares                │  ← animated count-up on change
│                                   │
│  ▦ ▦ ▦ ▦ ▦   ← live square grid   │
│  ▦ ▦ ▦ ▦ ▦      redraws on input  │
│  ▦ ▦ ▦ ▦ ▦                        │
└───────────────────────────────────┘
```

It uses the **same calculator module** as the authenticated app (§9.2). Not a mock, not a video, not a screenshot. A visitor can change the numbers and watch the grid redraw before they have an account. That single interaction sells the product.

### 3.3 Scroll Narrative

Below the hero, the page walks the core journey. One idea per section, each with a real interface fragment rather than an illustration of one.

| # | Section | Shows |
|---|---|---|
| 1 | **Discover** | Horizontally drifting pattern card rail; cards lift on hover |
| 2 | **Plan** | Typed-sentence → structured project fields, animating into place |
| 3 | **Calculate** | Dimensions → piece breakdown, with the arithmetic visible |
| 4 | **Make & Track** | Progress bar filling `0 → 80%`, `32 / 40 squares`, photo timeline |
| 5 | **Share** | Community grid in a soft masonry layout |
| 6 | **Sell** | Pricing breakdown resolving to a suggested range |
| 7 | **Close** | Repeat primary CTA on a blush band |

Scroll reveals are subtle: fade + 20px rise, triggered at 15% viewport entry, `once: true`. No scroll-jacking. No pinned sections that trap the scrollbar. No horizontal scroll hijack on desktop.

### 3.4 Performance Budget for the Landing Page

Non-negotiable. A slow premium page is not premium.

| Metric | Budget |
|---|---|
| LCP (mobile, throttled 4G) | ≤ 2.5s |
| CLS | ≤ 0.05 |
| INP | ≤ 200ms |
| Initial JS (excluding the lazy 3D chunk) | ≤ 180KB gzipped |
| 3D chunk | Lazy, never blocks first paint, never loads on save-data or low-power |

---

## 4. AI-First Experience

### 4.1 The Boundary Rule

This is the single most important engineering rule in this document.

> ### AI proposes. Deterministic code computes. The user decides.

**A language model never produces a number that the user relies on.**

Every stitch count, square count, panel dimension, yardage estimate, cost, and suggested price comes from a pure, unit-tested TypeScript function in `lib/calculators/`. AI may *call* those functions and *explain* their output. It may never substitute for them.

| AI does | AI never does |
|---|---|
| Parse "medium granny cardigan in blush" into structured fields | Decide how many squares that needs |
| Draft pattern instruction text and structure | Compute the stitch counts in those instructions |
| Rank and explain recommendations | Compute yarn requirements |
| Interpret a vague search into filters + semantic query | Compute a suggested price |
| Summarise a user's progress in prose | Compute a progress percentage |

Where AI drafts something structural (a pattern), the draft is **validated against deterministic invariants before it is ever shown** — round-over-round stitch counts must be internally consistent, materials must resolve to known yarn weights, hook size must be plausible for that weight. Failed validation triggers a repair pass, then a visible failure. It never silently ships a broken pattern.

### 4.2 Not a Chatbot in the Corner

AI in Crochelia is ambient and contextual. There is no floating bubble that opens a generic chat window.

#### Surface 1 — The Ambient Assistant

Invoked by `⌘K` / `Ctrl+K` on desktop and a centre FAB on mobile. It is a single input that understands the page it was opened from.

- Opened on a project → knows that project's type, size, yarn, and progress.
- Opened on the stash → knows what yarn is available.
- Opened anywhere → can navigate, search, create, or calculate.

It renders **rich results, not paragraphs**: a project draft card with editable fields, a calculator result with the maths shown, a row of pattern cards, a stash-coverage bar. Prose is the wrapper around a component, never the payload.

Every action it proposes is **confirmed before it commits**. It shows the diff — "I'll create *Blush Granny Cardigan*, size M, 40 squares, using 3 yarns from your stash" — with `[Create]` and `[Edit first]`. It never writes to the database on its own initiative.

#### Surface 2 — Intent to Structure

Anywhere a user could face an empty form, they can instead describe what they want in a sentence. The system returns a **pre-filled draft with every field editable and its provenance marked** — a small `AI` chip on fields the model inferred, cleared the moment the user touches the field.

Applies to: new project, new pattern, new product, new order, new outfit.

#### Surface 3 — Contextual Suggestions

Inline, quiet, dismissible. Never modal, never more than one per view.

- On a project: *"You're 8 squares from done. At your recent pace, about 3 evenings."*
- On the stash: *"Your cream is down to 40g — below what your active projects need."*
- On a pattern: *"You have 3 of the 4 yarns this calls for."*
- On the seller dashboard: *"Your last 5 orders averaged 22% below your suggested price."*

Suggestions are generated in the background (§10.6), stored, and rendered from storage. They are never generated during a page render. A dismissed suggestion does not come back.

#### Surface 4 — Intelligent Search

One search field, three layers behind it (§9.16): lexical, semantic (`pgvector`), and structured-filter extraction. Typing *"beginner-friendly summer top in cotton"* produces `type=top`, `difficulty=beginner`, `fibre=cotton`, `season=summer` **as visible, removable filter chips**, plus semantic ranking across the remainder. The user always sees and controls what the AI decided.

#### Surface 5 — Generation

Pattern generation (§9.6) and outfit concepts (§9.7). Always streamed, always labelled, always editable, never presented as tested.

### 4.3 AI States

Every AI interaction has four visible states. There is no fifth.

| State | Presentation |
|---|---|
| **Thinking** | Shimmer on the target region + a specific status line ("Reading your stash…", "Drafting round 3…"). Never a bare spinner, never "Loading…" |
| **Streaming** | Content builds progressively; structured fields land one at a time; the layout does not jump |
| **Ready** | Result with an `AI-generated` badge, provenance, and `[Accept] [Edit] [Discard]` |
| **Failed** | Plain-language cause, what the user can do, `[Try again]`. Never a raw model or API error. Partial output is preserved, never discarded |

### 4.4 Honesty Requirements

These are product requirements, not disclaimers to be minimised.

1. Every AI-generated pattern carries a persistent, non-dismissible **`AI-generated`** badge in the UI and an `origin` column in the database. It survives editing, sharing, saving, and export.
2. Generated patterns display: *"This pattern was generated and has not been tested. Work a small sample before committing yarn."* Prominent on first view, retained in a collapsed state after.
3. Yarn requirements are always labelled **Estimate**, with the inputs and assumptions expandable, and a confidence level (§9.3).
4. Suggested prices are always labelled **Estimate** and presented as a range with the cost breakdown visible (§9.12).
5. Crochelia never claims an estimate is exact, and never claims a generated pattern is guaranteed to work.

### 4.5 AI Implementation Contract

- **Provider:** Anthropic Claude API via `@anthropic-ai/sdk`. All calls server-side only. The API key never reaches the client.
- **Structured output:** every generation that produces data uses tool-use with a JSON Schema derived from the same Zod schema that validates the result. Define the Zod schema once; derive both the tool definition and the runtime parser from it.
- **Validation:** parse with Zod → run domain invariants → on failure, one repair attempt with the validation errors fed back → on second failure, surface the failure state. Never persist unvalidated model output.
- **Model selection:** a fast model for classification, filter extraction and short suggestions; a stronger model for pattern generation and multi-step reasoning. Centralise the mapping in one config module so it can be changed in one place.
- **Streaming:** all user-facing generation streams. Use the SDK's streaming interface, not polling.
- **Cost & abuse control:** per-user rate limits on generation endpoints, a monthly generation quota per plan, token accounting logged per request, and cached embeddings.
- **Prompt hygiene:** user content is data, never instruction. Wrap user-supplied text in clearly delimited blocks, and never let community or pattern content alter system behaviour.
- **Determinism boundary in code:** `lib/ai/` may import from `lib/calculators/`. `lib/calculators/` must **never** import from `lib/ai/`. Enforce this with an ESLint `no-restricted-imports` rule so it cannot regress.

---

## 5. Motion & Animation System

### 5.1 Motion Principles

1. **Purposeful** — motion explains a relationship (where a thing came from, what changed, what is loading). Decorative motion is deleted.
2. **Fast** — the user is never waiting on an animation. Most are 150–300ms.
3. **Interruptible** — a new interaction cancels the current animation. Nothing queues behind a transition.
4. **Defeatable** — `prefers-reduced-motion: reduce` disables all transform and scroll-driven motion. Opacity fades ≤ 200ms may remain. Nothing becomes unusable or invisible.

### 5.2 Motion Tokens

```css
--duration-instant: 100ms;  /* Colour, opacity on hover */
--duration-fast:    180ms;  /* Buttons, chips, small state */
--duration-base:    260ms;  /* Cards, dropdowns, tabs */
--duration-slow:    400ms;  /* Modals, sheets, page transitions */
--duration-story:   700ms;  /* Hero and scroll narrative only */

--ease-out:    cubic-bezier(0.16, 1, 0.30, 1);    /* Default — entering */
--ease-in-out: cubic-bezier(0.65, 0, 0.35, 1);    /* Moving between positions */
--ease-in:     cubic-bezier(0.55, 0, 1, 0.45);    /* Exiting */
--ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1); /* Playful — likes, saves, progress only */
```

Animate `transform` and `opacity`. Animating `width`, `height`, `top`, `left`, or `box-shadow` requires a written justification in the PR. Use `filter` sparingly and never on scroll.

### 5.3 Micro-interaction Catalogue

| Interaction | Motion |
|---|---|
| Button hover | Background shift `--duration-instant`; primary lifts `translateY(-1px)` and gains `--shadow-brand` |
| Button press | `scale(0.98)`, `--duration-instant` |
| Button loading | Label crossfades to an inline spinner; **width is locked** so nothing reflows |
| Card hover | `translateY(-4px)`, shadow `sm → md`, image `scale(1.03)`, `--duration-base` |
| Like | Heart fills, `scale 1 → 1.25 → 1` on `--ease-spring`, six particles radiate and fade over 400ms. Once. |
| Save / bookmark | Icon fills, small pull-toward-the-collection-icon motion, toast confirms |
| Progress update | Bar fills with `--ease-out` over `--duration-slow`; the number counts up in step; at 100% a single restrained confetti burst |
| Row / square counter | Number flips upward, `--duration-fast`; haptic tap on mobile |
| Toast | Slides in from bottom-right (desktop) / top (mobile), `--duration-base`, auto-dismiss 4s, pauses on hover |
| Modal | Scrim fades; panel `scale(0.96) → 1` with fade, `--duration-slow`, `--ease-out` |
| Sheet (mobile) | Slides from bottom, rubber-banded, drag-to-dismiss with velocity |
| Tab switch | Active pill slides between tabs (shared layout animation); panel crossfades |
| Accordion | Height auto-animated via a measured wrapper; content fades at 60% of the duration |
| Skeleton → content | Skeleton fades out and content fades in over the same 200ms window — never a hard swap |
| Pattern generation | Rounds appear one at a time as they stream, each a fade + 8px rise; the stitch-count column lands last |

### 5.4 Page Transitions

Route changes use a shared-element approach where a visual continuity exists (a project card expanding into the project page, a pattern thumbnail into the pattern hero). Where none exists, a 180ms crossfade. Route transitions never delay interactivity — the incoming page is interactive as soon as it paints, transition or not.

### 5.5 Loading Choreography

**Never a blank screen. Never a bare centred spinner on a full page.**

- Skeletons mirror the exact layout that will replace them — same dimensions, same radii, same grid. A skeleton that does not match its content is a bug.
- Skeleton shimmer: a subtle gradient sweep, 1.4s loop, `--surface-sunken` to `--border-subtle`.
- Images: dominant-colour or blur placeholder, then crossfade on decode.
- Optimistic UI on all likes, saves, follows, progress ticks, and counter increments — with a real rollback path and a toast on failure.
- Any operation over 500ms gets a named progress state, not a generic one.

### 5.6 Restraint Rules

Explicitly forbidden:

- Looping ambient animation anywhere except the hero background drift.
- More than two elements animating simultaneously in the same viewport region.
- Animation that delays a user's ability to act.
- Parallax on any content the user needs to read.
- Scroll-jacking, pinned-scroll sections, or cursor-following anything.
- Entrance animations on elements the user has already seen this session.

---

## 6. 3D, Depth & Interactivity

### 6.1 Where 3D Is Earned

WebGL appears in exactly **two** places. Everywhere else, depth comes from layering, shadow, parallax and gradient — which is cheaper, more accessible, and usually more elegant.

#### 6.1.1 Hero Scene

A slowly rotating arrangement of yarn forms — two or three soft-shaded balls in blush and cream with a loose strand curving between them, over a warm gradient. Gentle continuous rotation (≈ one revolution per 40s), light pointer-parallax on desktop, no user control, no orbit, no click targets. It is a moving photograph, not a toy.

#### 6.1.2 Outfit Designer Preview

A simplified garment form on which the user's chosen colours and stitch textures are applied, orbitable by drag on desktop and swipe on mobile. This one is genuinely interactive because rotating a garment to see it is a real user need.

### 6.2 Hard Rules

1. **Lazy always.** `next/dynamic` with `ssr: false`. The 3D chunk is never in the initial bundle and never blocks first paint.
2. **Fallback first.** A high-quality static image or CSS/SVG composition renders immediately and is replaced only once the scene is ready. If WebGL is unavailable, the fallback is the final state and looks intentional — not like a broken feature.
3. **Never load 3D when:** `prefers-reduced-motion: reduce`, `navigator.connection.saveData`, a device-memory hint below 4GB, no WebGL2 context, or the element is off-screen.
4. **Budgets.** 3D chunk ≤ 250KB gzipped; scene assets ≤ 800KB total; ≤ 30k triangles; capped at 30fps for ambient scenes; `frameloop="demand"` for the outfit preview so it renders only on interaction; pause entirely when off-screen or when the tab is hidden.
5. **Never load-bearing.** No information exists only in 3D. The outfit designer's colour and piece choices are fully readable and editable in DOM alongside the canvas.
6. **Accessible.** The canvas has a descriptive `aria-label`; all controls it offers exist as real focusable DOM controls beside it.

### 6.3 Depth Without WebGL

The default toolkit for everything else:

- **Layering** — overlapping cards with deliberate z-order and soft shadows.
- **Gradient mesh** — blurred radial blush gradients as section backgrounds, CSS-only.
- **Floating elements** — small decorative shapes (a stitch motif, a soft blob) at low opacity, drifting on scroll at parallax factor `0.2–0.4`.
- **Card tilt** — a maximum `4°` pointer-driven tilt on feature cards, desktop and fine-pointer only. Off on touch.
- **Sticky reveals** — an image column holding position while text scrolls beside it. Never trapping the scroll.

---

## 7. Component System

### 7.1 Structure

```
components/
  primitives/   Button, Input, Select, Textarea, Checkbox, Radio, Switch, Slider,
                Badge, Chip, Avatar, Tooltip, Skeleton, Spinner, Progress, Separator
  surfaces/     Card, Panel, Sheet, Modal, Drawer, Popover, Dropdown, Tabs, Accordion
  feedback/     Toast, Alert, EmptyState, ErrorState, LoadingState, ConfirmDialog
  data/         DataGrid, StatTile, Sparkline, DonutMeter, Timeline, Gallery, Rail
  ai/           AssistantLauncher, AssistantPanel, SuggestionCard, GenerationStream,
                AIBadge, ProvenanceChip
  domain/       ProjectCard, YarnCard, PatternCard, PostCard, ProductCard, OrderRow,
                StitchDiagram, SquareGrid, ProgressRing, StashCoverageBar, ColorwayChip
```

**Rule:** a domain component is composed from primitives and surfaces. It never re-implements a primitive, and it never defines its own colours, spacing or radii outside the tokens.

Build on **shadcn/ui + Radix** for behaviour and accessibility, restyled to these tokens. Do not hand-roll focus management, dismissal, or ARIA for menus, dialogs, tooltips and comboboxes.

### 7.2 Buttons

| Variant | Rest | Hover | Active | Disabled |
|---|---|---|---|---|
| **Primary** | `--pink-500` bg, white text, `--shadow-brand` | `--pink-600`, `translateY(-1px)` | `--pink-700`, `scale(0.98)` | `--pink-200` bg, white text, no shadow |
| **Secondary** | White bg, `--border-brand`, `--text-brand` | `--pink-50` bg | `--pink-100` bg | `--border-subtle`, `--text-disabled` |
| **Ghost** | Transparent, `--text-secondary` | `--pink-50` bg, `--text-brand` | `--pink-100` bg | `--text-disabled` |
| **Danger** | `--danger-fg` bg, white text | 8% darker | `scale(0.98)` | 40% opacity |

Every variant ships `default | hover | active | focus-visible | disabled | loading` states. Sizes `sm (32px) / md (40px) / lg (48px)`; minimum `44px` touch target on mobile regardless of visual size. Focus ring: `2px` `--border-focus` with `2px` offset, always visible, never removed.

### 7.3 Cards

Base: `--surface-raised`, `--border-subtle`, `--radius-lg`, `--shadow-sm`, `--space-5` padding. Hover (interactive cards only): lift 4px, shadow to `md`, image scale `1.03`.

Media cards use a fixed aspect ratio and `object-fit: cover`. Text truncates with `line-clamp`, never mid-layout overflow. Every interactive card is a single focusable element with one clear primary action — no nested-interactive-inside-a-link.

### 7.4 Glassmorphism — Constrained

Permitted in exactly four places, and nowhere else:

1. The sticky top navigation on scroll — `backdrop-filter: blur(16px) saturate(1.2)`, `rgba(255,255,255,0.72)`, `--border-subtle` bottom edge.
2. The mobile bottom navigation bar.
3. The floating preview card over the hero.
4. The assistant panel overlay.

Always over imagery or gradient — never over flat white, where it does nothing but cost GPU. Always with an opaque fallback for browsers without `backdrop-filter`. Text over glass must still meet 4.5:1 against the *worst-case* background behind it.

### 7.5 Empty States

Every list, grid, and collection has a designed empty state. **"No data found" is banned.**

Structure: a soft illustrative mark or muted icon → a warm headline → one line explaining the value → one primary action → optionally, one secondary path (import, browse, generate).

```
                     🧶

        Your crochet story starts here

   Create your first project and start tracking
   every square, row, and finished piece.

           [ Create project ]
        or  explore patterns for ideas
```

| Surface | Headline | Primary action |
|---|---|---|
| Projects | Your crochet story starts here | Create project |
| Stash | Your yarn shelf is waiting | Add yarn |
| Patterns saved | Nothing saved yet | Browse patterns |
| Community feed | Follow makers to fill this space | Discover creators |
| Orders | No orders yet | Add your first order |
| Search (no results) | Nothing matched *"{query}"* | Clear filters / try a broader search |

Empty states differ from **zero-state-after-filtering**, which must always offer to relax the filters and show what was filtered out.

### 7.6 Error States

Three tiers, never a raw stack trace or error code alone:

- **Inline** — field-level validation, red text below the field, `aria-describedby` wired, focus moved to the first invalid field on submit.
- **Regional** — a section fails to load; that card shows a compact retry. The rest of the page stays alive.
- **Page** — an error boundary with a plain-language explanation, a retry, a route home, and a support reference ID.

### 7.7 Notable Components

- **StashCoverageBar** — a segmented bar showing owned vs. needed per colour, with the shortfall stated in grams and the arithmetic expandable.
- **SquareGrid** — the live granny-square visualiser; renders the calculated grid, supports per-square completion tap-to-toggle, and scales to hundreds of squares without lag (canvas or virtualised).
- **ProgressRing** — animated circular progress for project cards, with the fraction (`32/40`) as the accessible label, not just the percentage.
- **GenerationStream** — renders streaming AI structure into typed blocks as it arrives, with a stable layout that does not jump.
- **StitchDiagram** — SVG chart notation for a pattern round, with a text equivalent always available.

---

## 8. Mobile Experience

Mobile is designed, not derived. Assume a significant share of usage is one-handed, mid-project, with yarn in the other hand.

### 8.1 Navigation

**Bottom bar**, five items, glass surface, safe-area padded:

```
   Home      Discover      ✦ Create      Community      Stash
    ⌂           ◎             (FAB)          ❀            ☰
```

- The centre FAB is the primary create action *and* the assistant entry point — press for a create sheet, long-press for the assistant.
- Active state: pink icon + pink label + a 3px pink indicator above the item. No heavy fill.
- The bar hides on downward scroll, returns on upward scroll, and is always present at the top of a page.
- Business and Profile live behind the profile avatar in the top bar, not in the bottom five.

### 8.2 Gestures

| Gesture | Behaviour |
|---|---|
| Swipe down on a sheet | Dismiss, velocity-aware, rubber-banded |
| Swipe left/right on a project photo timeline | Move between photos |
| Swipe on a stash card | Reveal quick actions (use, edit, delete) |
| Pull to refresh | Feeds and lists, with a pink stitch-loop indicator |
| Long-press a card | Quick-actions context sheet |
| Double-tap a post image | Like, with the heart burst |
| Pinch on a pattern chart | Zoom |

Every gesture has a visible, non-gesture equivalent. No functionality is gesture-only.

### 8.3 Touch & Layout

- Minimum touch target `44×44px`; primary actions `48px`.
- Primary actions sit in the lower 40% of the screen — the thumb zone. Destructive actions never sit adjacent to primary ones.
- Modals become **bottom sheets**. Full-screen dialogs are reserved for genuinely full-screen tasks (pattern reader, photo viewer).
- Multi-step forms become steppers with visible progress and a persistent back path; never a long scroll of 20 fields.
- Calculators use large numeric steppers and `inputmode="decimal"`, with results pinned in a sticky footer as inputs change.
- Horizontal rails (patterns, colourways, photos) get momentum scroll, snap points, and no visible scrollbar.
- The row/square counter is a full-width, high-contrast tap target with a haptic response, usable without looking.

### 8.4 Breakpoints

```
sm  640px   Large phone
md  768px   Tablet portrait — 2-col grids, bottom nav persists
lg  1024px  Tablet landscape / small laptop — sidebar appears, bottom nav retires
xl  1280px  Desktop — full layout
2xl 1536px  Wide — content max-width caps at 1440px; never full-bleed text
```

All three of desktop, tablet and mobile must be checked for every screen before it is called done.

---

## 9. Feature Specification

Every feature below carries forward from the PRD. Each specifies its data, its states, and its edge cases.

### 9.1 Project Planner

**Types:** cardigan · sweater · blanket · bag · scarf · top · skirt · accessory · amigurumi · granny-square project · custom.

**Fields:** name · type · description · size (preset or custom) · dimensions · difficulty · linked pattern · yarn requirements · colours · stitch types · hook size · estimated time · estimated cost · notes · images · progress · status.

**Statuses:** `planning → in_progress → paused → completed → archived`. Transitions are explicit user actions. Completing a project prompts for a finished photo and offers to share it.

**The project workspace** is the product's most-used screen. It must feel like a studio bench:

- Hero photo, name, status chip, progress ring.
- **Next action** stated plainly — *"Next: 8 more squares, then join."*
- Piece checklist (squares, sleeves, panels) with tap-to-complete.
- Materials panel with live stash coverage.
- Photo timeline in date order.
- Notes with autosave, offline-tolerant.
- Time log with a start/stop session timer.
- The linked pattern, readable in-place, remembering the user's position.

**Edge cases:** deleting a project soft-deletes for 30 days and is restorable; a project may exist with no pattern; yarn may be reserved from the stash and released when the project is cancelled.

### 9.2 Crochet Calculator

**Deterministic. Pure functions. Fully unit-tested. This is the trust core of the product.**

Supports: granny squares · cardigans · sweaters · blankets · bags · scarves · tops · custom.

Granny-square worked example:

```
Input:   Width 50cm · Length 60cm · Square 10cm · Seam allowance 0cm

Derived: across = floor(50 / 10) = 5
         down   = floor(60 / 10) = 6
         total  = 5 × 6 = 30 squares

Coverage: 50 × 60 = 3000cm² of 3000cm² target (100%)
```

Requirements:

- Every input is adjustable, with live recalculation and an animated result.
- **The derivation is always expandable.** The user can see `floor(50 / 10) = 5`.
- Partial squares are handled explicitly — the user chooses `round down` (default), `round up`, or `allow partial`, and the choice is explained.
- Garment calculators break results down per piece (front, back, sleeves, collar, bands) and total them.
- Gauge-aware: given a user's swatch gauge, convert dimensions to stitch and row counts.
- Metric and imperial, converted at the boundary and computed in one canonical unit internally.
- Calculated values are labelled **Calculated**. Anything derived from an assumption is labelled **Estimate**.
- Results are savable directly onto a project.

**Implementation:** `lib/calculators/*.ts` — pure, no I/O, no dates, no randomness, no framework imports. Every function has a fixture-table test.

### 9.3 Yarn Calculator

Estimates yarn requirements from: project type · dimensions · yarn weight · fibre · hook size · stitch type · gauge · piece count.

Output:

```
Estimated yarn required        ~ 1,240 m  (≈ 620 g)
Skeins (100g / 200m)           ~ 7
Recommended with buffer        8 skeins   (+15% for joins, edging, dye-lot safety)

Confidence: Medium
Based on: your gauge swatch · double crochet · worsted / #4 · 5.0mm hook
Not based on: your exact tension over long runs, blocking, or edging choices
```

Requirements:

- **Always labelled Estimate.** Never presented as exact. The word "guaranteed" appears nowhere near it.
- Confidence is stated (`High` with a user gauge swatch, `Medium` with standard gauge for the weight, `Low` with incomplete inputs) and the reason given.
- The buffer percentage is visible and adjustable, defaulting to 15%.
- Per-colour breakdown for multi-colour projects.
- Feeds directly into stash coverage (§9.4) and the shopping list.
- Consumption coefficients live in a documented, versioned table with cited sourcing — not magic numbers inline.

### 9.4 Yarn Stash

**Per yarn:** name · brand · colour · colour code · dye lot · weight class · fibre content · total quantity · remaining quantity · unit (g / oz / m / yd) · purchase date · cost · image · notes.

**Presented as cards, not a table.** Each card leads with the colour — a real swatch from the photo, or the colourway chip — with the remaining quantity as a subtle fill level on the card itself. The stash should be a pleasure to look at.

**Features:** add · edit · delete · search · filter (weight, fibre, colour family, brand) · sort (recent, remaining, colour) · usage history · low-stock flag · bulk add · reserve to project.

**Stash coverage** appears wherever a project's requirements are known:

```
Blush   ████████████████░░░░  72%   need 180g more
Cream   ████████████████████ 100%   ✓ covered
                                    [ Add the gap to shopping list ]
```

Coverage is a deterministic calculation over `required − reserved − remaining`, never an AI output.

**Edge cases:** remaining quantity can never go below zero; deleting yarn that is reserved by an active project requires confirmation and releases the reservation; dye lot is tracked because it genuinely matters to crocheters.

### 9.5 Pattern Library

Browse · search · filter · save · favourite · collect.

**Filters:** project type · difficulty · technique · yarn weight · hook size · fibre · creator · language · free/paid · AI-generated (with a toggle to exclude).

**Pattern detail page:** hero imagery gallery · name · creator with profile link · difficulty · materials list · yarn requirements · hook size · gauge · abbreviations glossary · full instructions · stitch diagrams · construction notes · finishing · comments · saves · "made it" gallery from the community.

The **pattern reader** is a distinct reading mode: large type, a persistent row counter, current-round highlighting, position memory across sessions and devices, keep-screen-awake, and an offline-capable cached copy of a saved pattern.

**Ownership and permissions are enforced, not assumed:** a designer owns their patterns; visibility is `private | unlisted | public`; only the owner can edit or delete; only patterns marked shareable can be reshared; attribution is always displayed and preserved. Users may not upload patterns they do not have the rights to — the upload flow requires an explicit rights confirmation, and reported content routes to admin review.

### 9.6 Pattern Generator

A user describes what they want; Crochelia produces a structured pattern.

**Output structure:** name · difficulty · finished dimensions · materials · yarn (weight, fibre, quantity per colour) · hook size · gauge · abbreviations · round/row-by-round instructions with stitch counts · colour-change points · construction notes · finishing · care.

**Pipeline:**

1. Parse the request into structured parameters.
2. If parameters are insufficient, **ask** — do not guess. ("What size, roughly? And is this in worsted?")
3. Generate structure via schema-constrained tool use.
4. **Validate deterministically** — stitch counts consistent round to round; increases and decreases arithmetically sound; materials resolve to known yarn weights; hook plausible for the weight; dimensions consistent with gauge.
5. On validation failure: one repair pass with errors fed back. On second failure: show the failure state honestly.
6. Stream the validated result round by round.
7. User may edit any field, save, delete, or share.

**Mandatory labelling** per §4.4. The `AI-generated` origin is a database column, not a UI flag — it survives every edit and export.

Generated patterns are private by default. Publishing one to the library requires the user to acknowledge that it is untested and to keep the generated badge visible.

### 9.7 Outfit Designer

Combine tops · cardigans · sweaters · skirts · bags · accessories into a coherent look.

- Visual canvas with the pieces arranged as a lookbook.
- Customise per piece: colour (from the palette or from the user's stash), stitch texture, style variant.
- Optional 3D garment preview (§6.1.2).
- Palette harmony suggestions from the user's actual stash — *"You have enough sage and cream for this whole look."*
- Save concepts; convert any piece into a real project in one action; aggregate materials across the outfit.

**No fake image generation.** If a real image-generation capability is configured, integrate it properly, label output as generated, and store provenance. If it is not configured, the outfit designer works with composed real imagery, colour swatches and the 3D preview — and does not pretend otherwise.

### 9.8 Progress Tracking

Track: percentage · rows · rounds · squares · pieces · time · photos · notes · full history.

```
Pink Granny Cardigan

████████████████░░░░   80%
32 / 40 squares

[ − ]   32   [ + ]        [ Log session ]  [ Add photo ]
```

- Progress is **derived from unit counts** where they exist (`32/40 = 80%`), and only manually set where no countable unit does. Never both at once.
- Every change writes a `project_progress` history row — the timeline is the point, not just the current number.
- The counter is one-tap, optimistic, offline-tolerant, and syncs on reconnect.
- The photo timeline is chronological and is the emotional payoff of the whole feature. Treat it as a first-class gallery.
- Session timer with start/stop, contributing to a real "time spent" figure and a pace estimate.

### 9.9 Community

Visual-first. Closer to a creative platform than a forum.

**Posts contain:** images (1–10) · description · linked project · linked pattern · yarn used · project type · difficulty · progress state · hashtags.

**Interactions:** like · comment (threaded one level) · save to collection · follow · share · report.

**Feeds:** *Following* · *Discover* (ranked, explained — "because you saved 3 granny-square patterns") · *Trending* · by tag.

Layout is a soft masonry grid on desktop, a single column with generous imagery on mobile. Images lead; text supports.

**Safety:** report and block on every post and profile; a moderation queue for admins; rate limits on posting and commenting; server-side image moderation hooks; no public exposure of a user's stash, business data, or customers.

### 9.10 Profiles

A profile is a **crochet portfolio**, not an account settings page.

Shows: avatar · cover · username · display name · bio · location (optional, city-level) · skill level · years crocheting · completed project gallery · posts · public collections · published patterns · followers · following.

Creator and designer profiles get an elevated layout: a large portfolio grid leading, a published-patterns rail, and a short maker statement.

**Privacy defaults:** projects private, stash private, business data private and never public under any setting. Public sharing is always an explicit per-item action.

### 9.11 Business Workspace

Available to accounts with the `seller` capability. Same white-and-pink identity — **it does not become a blue-grey business dashboard.**

**Products:** name · description · images · linked project or pattern · materials with cost · production time · cost price · selling price · quantity available · availability status · variants (size, colour) · notes.

**Inventory:** finished-goods stock, materials stock (drawn from the stash), low-stock thresholds and alerts.

**Seller dashboard shows:** active orders · pending orders · completed orders · revenue · expenses · estimated profit · best-selling products · low-stock materials · recent orders. Every figure is computed from real records — **there are no sample numbers and no demo data**. A new seller sees a designed empty state, not fabricated charts.

### 9.12 Pricing Calculator

```
Material cost                       Rs. 1,200
Labour        (12h × Rs. 125/h)     Rs. 1,500
Packaging                           Rs.   200
Delivery                            Rs.   150
Platform / payment fees   (5%)      Rs.   152
─────────────────────────────────────────────
Estimated cost                      Rs. 3,202

Suggested price       Rs. 4,000 – 4,500   ← Estimate
Estimated profit      Rs.   798 – 1,298
Margin                     20% – 29%
```

- Material cost pulls real per-gram costs from the stash where the yarn is known.
- Labour rate is a user setting; hours can come from the project's logged time.
- Fees are configurable per sales channel.
- **The suggested price is always labelled an estimate and always a range**, with the multiplier and the reasoning shown.
- Currency is user-configured. **All money is stored as integer minor units with an ISO currency code.** Floats for money are a defect.

### 9.13 Orders

**Fields:** customer · product(s) · quantity · unit price · total · status · payment status · delivery status · notes · order date · expected completion · completed date.

**Statuses:** `new → confirmed → in_progress → ready → shipped → completed`, with `cancelled` reachable from any pre-completion state. Invalid transitions are rejected server-side, not merely hidden in the UI.

Payment status (`unpaid | partial | paid | refunded`) and delivery status (`pending | preparing | shipped | delivered`) are tracked independently of order status, because in reality they move independently.

A custom order can spawn a linked project so the maker tracks production against the order. Status history is recorded with timestamps.

### 9.14 Customers

Name · contact (email, phone, social handle) · address (optional) · order history · preferences · notes · important dates.

**Customer data is protected:**

- Visible only to the owning seller. Enforced by row-level security, not by a UI check.
- Never surfaced in search, community, or any public route.
- Deletable and exportable on request.
- Contact fields are never logged.
- Where a customer is a platform user, link by ID; never duplicate their personal data into the seller's records without consent.

### 9.15 Notifications

**Types:** project reminders · low yarn stock · order status changes · likes · comments · new followers · pattern updates from followed designers · business reminders.

**Anti-spam is a hard requirement:**

- Digest and coalesce — *"12 people liked your cardigan"*, not twelve notifications.
- A quiet window per user, respecting their timezone.
- Per-category preferences with in-app, email, and push controlled separately.
- Rate limits per type per user per day.
- Never notify a user about their own action.

Delivery is asynchronous via the job pipeline (§10.6). A notification is written to the database first and delivered from there, so the in-app centre and any external channel never diverge.

### 9.16 Global Search

Searches patterns · projects · yarn · users · posts · products, scoped by permission — a user only ever sees what they are entitled to see.

Three layers, combined:

1. **Lexical** — Postgres full-text search with weighted `tsvector` columns and trigram fuzzy matching for typos.
2. **Semantic** — `pgvector` embeddings over patterns, projects and posts for "something like this" queries.
3. **Structured extraction** — natural-language filters surfaced as visible, removable chips.

Requirements: `<300ms` p95 for lexical; debounced type-ahead with recent and suggested queries; keyboard-navigable results grouped by entity; facet counts; cursor pagination (never `OFFSET` on large sets); a designed no-results state that offers to broaden.

---

## 10. Technical Architecture

### 10.1 Stack

| Layer | Choice | Why |
|---|---|---|
| Framework | **Next.js (App Router)**, TypeScript strict | Server Components keep the client bundle small; Server Actions remove a hand-written API layer for mutations |
| UI | React, Tailwind CSS, shadcn/ui + Radix | Token-driven styling; accessible primitives without hand-rolling |
| Motion | Framer Motion | Layout and shared-element animation, reduced-motion aware |
| 3D | react-three-fiber + drei, lazy | Only for the two earned surfaces (§6) |
| Database | **Supabase Postgres** | Relational fit for the entity graph, plus RLS as a real authorization boundary |
| Auth | **Supabase Auth** via `@supabase/ssr` | Cookie-based SSR sessions, JWT claims usable in RLS policies |
| Storage | **Supabase Storage** | Signed URLs, per-bucket policies, image transformation |
| Vectors | `pgvector` | Semantic search in the same database — no extra service |
| Jobs | `pgmq` + `pg_cron` + `pg_net` → Edge Functions | Transactional enqueue, no separate worker fleet to operate |
| AI | Anthropic Claude API, server-side only | Structured tool-use generation (§4.5) |
| Validation | Zod | One schema per boundary, shared by forms, actions, and AI tool definitions |
| Testing | Vitest, Testing Library, Playwright | Unit, component, end-to-end |
| Hosting | Vercel (primary); container-portable | Standalone output keeps a Docker path open |

### 10.2 Application Structure

```
app/
  (marketing)/            Landing, about, pricing — public, statically rendered
  (auth)/                 Sign in, sign up, callback, reset
  (app)/                  Authenticated shell
    dashboard/  projects/  patterns/  yarn/  discover/
    community/  outfits/   search/     profile/[username]/
    business/   ( products/ orders/ customers/ expenses/ pricing/ )
    settings/
  api/
    health/               Liveness + readiness
    ai/                   Streaming AI routes
    webhooks/
components/               §7.1
lib/
  calculators/            PURE. No I/O. No AI imports. Fully tested.
  ai/                     Claude client, prompts, schemas, validators
  db/                     Typed queries, generated Supabase types
  supabase/               server.ts · client.ts · middleware.ts
  validation/             Zod schemas — shared by forms, actions, AI tools
  auth/                   Session, capability checks
  utils/
supabase/
  migrations/             Timestamped, forward-only SQL
  functions/              Edge Functions (jobs)
  seed.sql                Reference data ONLY (yarn weights, stitch types)
tests/
  unit/  integration/  e2e/  fixtures/
```

### 10.3 Rendering & Data

- **Server Components by default.** `"use client"` is opted into for interactivity and must be justified — it is not the default posture.
- **Server Actions for mutations.** Every action: authenticate → authorize → validate with Zod → execute → revalidate the affected paths/tags → return a typed result. No unvalidated input reaches the database.
- Client state only for genuinely client concerns (open/closed, form draft, optimistic overlays). No global store for server data.
- Cache with `revalidateTag` on entity families (`project:{id}`, `stash:{userId}`) so invalidation is precise rather than nuking whole routes.
- Cursor-based pagination for every feed and list. No `OFFSET` on tables that will grow.
- No N+1: fetch related data in single queries or explicit batches. Add a query-count assertion to integration tests for the heaviest routes.

### 10.4 Authentication & Authorization

**Two layers, both required.** RLS is the boundary that actually enforces access; application checks exist for good UX and defence in depth.

```ts
// lib/supabase/server.ts — Server Components, Route Handlers, Server Actions
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
  const cookieStore = await cookies()
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (cookiesToSet) => {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options))
          } catch {
            // Called from a Server Component; middleware refreshes the session.
          }
        },
      },
    }
  )
}
```

Middleware refreshes the session on every matched request and guards protected routes. Use **`getClaims()`** for route protection — it verifies the JWT signature locally without a round trip to the auth server. Reserve **`getUser()`** for the cases that need the canonical server-validated user record.

**Rules:**

- **RLS is enabled on every table. No exceptions.** A table shipped without policies is a release blocker.
- The service-role key is used only inside Edge Functions and never in any code path reachable from a browser. It is never imported into `app/` or `components/`.
- Capability checks (`seller`, `designer`, `admin`) are enforced in policies, not only in the UI. Hiding a button is not authorization.
- Admin routes require a claim that cannot be self-assigned, and every admin action is written to an audit log.
- Sessions are cookie-based, `httpOnly`, `secure`, `sameSite=lax`.

### 10.5 File Storage

Buckets: `avatars` (public read) · `projects` · `patterns` · `products` · `posts` · `outfits` (all private, served via signed URLs).

**Upload pipeline:** client requests a signed upload URL → server authorizes and issues it → client uploads directly → server records the row and enqueues a derivatives job.

**Validation is server-side and mandatory:**

- Allow-list MIME types (`image/jpeg`, `image/png`, `image/webp`, `image/avif`) — verified by **magic bytes**, never by the client-supplied extension or content-type header.
- Size limits per bucket (10MB images, 25MB pattern PDFs).
- Strip EXIF, including GPS, on ingest.
- Re-encode images server-side; never serve a user-supplied file back verbatim.
- Reject SVG uploads entirely (script vector).
- Per-user upload rate limits and total quota.
- Storage policies scope every object to its owner; access is via short-lived signed URLs.

### 10.6 Background Processing

Transactional enqueue with `pgmq`, scheduled draining with `pg_cron`, dispatch to Edge Functions with `pg_net`. Jobs enqueue inside the same transaction as the data change, so an enqueued job can never reference a row that was rolled back.

| Queue | Work |
|---|---|
| `notifications` | Coalesce, render and deliver notifications |
| `embeddings` | Generate and store `pgvector` embeddings on content change |
| `images` | Derivatives, blur placeholders, EXIF strip, moderation hooks |
| `digests` | Scheduled summaries and reminders |
| `maintenance` | Low-stock scans, stale-project nudges, soft-delete purges |

Use `pgmq.read()` with a visibility timeout — not `pop()` — so a failed job becomes visible again and is retried rather than lost. Jobs are idempotent, keyed so a replay is harmless, with capped retries and a dead-letter path. Failures are logged with the job ID and payload key, never the payload contents.

### 10.7 Caching

Only where justified:

1. Next.js data cache with tag invalidation — the default and usually sufficient.
2. Static generation for marketing and public pattern pages, revalidated on publish.
3. Postgres materialised views for seller dashboard aggregates, refreshed on a schedule.
4. Cached embeddings — never re-embed unchanged content.
5. HTTP caching with immutable asset hashes.

No Redis in v1. If a measured need appears (rate limiting at scale, hot leaderboards), add it then, with the measurement in the PR description.

### 10.8 Security

- Zod validation at every boundary: form, Server Action, Route Handler, AI output, webhook.
- Parameterised queries only. String-concatenated SQL is a defect.
- Rate limiting on auth, AI generation, uploads, posting and commenting.
- CSRF protection on mutations (Server Actions provide this; custom routes must implement it).
- A strict Content-Security-Policy; no `unsafe-inline` scripts.
- Security headers: HSTS, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`.
- Secrets from environment only, never committed, never in `NEXT_PUBLIC_*` unless genuinely public.
- User-generated content sanitised on render; no `dangerouslySetInnerHTML` on user input.
- Prompt-injection defence: user content is delimited data; the model cannot alter system instructions or trigger writes without user confirmation.
- Dependency audit in CI; no unmaintained or unnecessary packages.

### 10.9 Observability & Operations

- **Structured JSON logging** with a request ID, user ID (never PII), route, duration and outcome. No customer contact details, no tokens, no image contents in logs.
- `/api/health` — liveness (process up) and readiness (database reachable, migrations applied).
- Error tracking with source maps, release tagging, and user-facing reference IDs that correlate to a logged error.
- Web Vitals reported from the client to a metrics endpoint.
- Counters for AI generation volume, token spend, job queue depth, job failure rate, and search latency.
- Graceful shutdown: stop accepting new work, drain in-flight requests, close connections, exit cleanly.
- Environment configuration validated at boot with Zod — the app **refuses to start** on missing or malformed configuration rather than failing mysteriously at request time.

### 10.10 Deployment & CI/CD

**Explicitly out of scope: Terraform, IaC, and cloud resource provisioning.** A separate infrastructure application owns all of that. This repository contains the application layer only, and must not include infrastructure provisioning of any kind.

What this repository does provide:

- `output: 'standalone'` build so a container image is possible without restructuring.
- A minimal multi-stage `Dockerfile` and `.dockerignore` — application packaging only.
- Forward-only, timestamped SQL migrations runnable in CI.
- `.env.example` documenting every variable with no real values.
- A CI pipeline that runs: install → lint → typecheck → unit tests → integration tests → build → migration check. All must pass before merge.
- No environment-specific values compiled into the build.

**Environment variables:**

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
SUPABASE_SECRET_KEY=              # server / Edge Functions only — never client
ANTHROPIC_API_KEY=                # server only
NEXT_PUBLIC_SITE_URL=
DATABASE_URL=                     # migrations only
```

---

## 11. Database Design

### 11.1 Conventions

- `snake_case` names, plural tables.
- `uuid` primary keys, `gen_random_uuid()` default.
- `created_at` / `updated_at` `timestamptz` on every table; `updated_at` maintained by trigger.
- Soft delete via `deleted_at` on user-authored content; hard delete on join tables.
- **Money as `bigint` minor units plus an ISO-4217 `currency` column.** Never `float`, never `numeric` without an accompanying currency.
- Measurements stored in one canonical unit (millimetres, grams, metres) with a `display_unit` preference on the user.
- Enums as Postgres enum types where the set is genuinely closed; otherwise a lookup table.
- **RLS enabled on every table.**

### 11.2 Entities

**Identity**
`users` (Supabase auth) · `profiles` (display name, username, bio, avatar, cover, skill level, location, preferences) · `user_capabilities` (user × capability — additive roles)

**Making**
`projects` · `project_progress` (history — every increment, timestamped) · `project_materials` (project × yarn, required and reserved quantities) · `project_images` · `project_time_logs` · `project_pieces` (per-piece checklist)

**Patterns**
`patterns` (with `origin: human | ai_generated`, `visibility`) · `pattern_versions` (immutable snapshots) · `pattern_sections` · `pattern_images` · `pattern_saves`

**Yarn**
`yarn_brands` · `yarn_products` (reference catalogue) · `yarn_stash` (the user's inventory: quantity, remaining, dye lot, cost, image) · `yarn_usage` (stash × project consumption events)

**Community**
`posts` · `post_images` · `comments` · `likes` (polymorphic target with a checked type) · `follows` · `collections` · `collection_items` · `reports`

**Creative**
`outfits` · `outfit_items`

**Business**
`products` · `product_variants` · `product_images` · `customers` · `orders` · `order_items` · `order_status_history` · `expenses`

**System**
`notifications` · `notification_preferences` · `ai_generations` (prompt hash, model, tokens, outcome — for cost accounting and abuse detection) · `embeddings` (`vector`, entity type, entity id) · `audit_log`

### 11.3 Key Relationships

```
profiles 1─── * projects  1─── * project_progress
                          1─── * project_materials  *───1 yarn_stash
                          1─── * project_images
                          *───1 patterns

profiles 1─── * yarn_stash
profiles 1─── * patterns  1─── * pattern_versions
profiles 1─── * posts     1─── * comments
profiles *─── * profiles  (follows)
profiles 1─── * collections 1─── * collection_items  (polymorphic)

profiles 1─── * products  1─── * product_variants
profiles 1─── * customers 1─── * orders  1─── * order_items  *───1 products
profiles 1─── * expenses
```

### 11.4 Indexes

Every foreign key is indexed. Beyond that:

| Index | Purpose |
|---|---|
| `projects (user_id, status, updated_at DESC)` | Dashboard and project list |
| `project_progress (project_id, created_at DESC)` | Progress timeline |
| `yarn_stash (user_id, weight_class)`, partial `WHERE remaining > 0` | Stash filtering and coverage |
| `patterns (visibility, project_type, difficulty)` partial `WHERE visibility = 'public'` | Library browse |
| `posts (created_at DESC)` and `posts (user_id, created_at DESC)` | Feeds |
| `follows (follower_id)`, `follows (following_id)` | Following feed both directions |
| `orders (user_id, status, created_at DESC)` | Seller dashboard |
| `notifications (user_id, read_at, created_at DESC)` partial `WHERE read_at IS NULL` | Unread badge |
| GIN on `tsvector` columns | Full-text search |
| GIN `pg_trgm` on names and titles | Fuzzy matching |
| HNSW on `embeddings.vector` | Semantic search |

**RLS performance:** wrap `auth.uid()` in a scalar subselect (`(select auth.uid())`) inside policies so the planner caches it per statement instead of evaluating per row, and ensure every column a policy filters on is indexed.

### 11.5 Migrations

Forward-only, timestamped, reviewed. Each migration includes its RLS policies in the same file as the table it creates — a table and its policies ship together or not at all. Destructive changes are two-phase (add, backfill, switch, then drop in a later migration). `seed.sql` contains **reference data only** — yarn weight classes, stitch types, hook sizes, unit conversions. **No fake users, no sample projects, no demo orders, no fabricated statistics.**

---

## 12. Development Rules

### 12.1 Start With Reconnaissance

**Before writing any code**, inspect the repository:

1. Read every existing file, including the source PRD.
2. Identify what already exists: framework, database, ORM, auth, component system, styling conventions, API conventions, tests, build config.
3. Catalogue reusable components and utilities.

Then:

- **If the repository already contains an application** — conform to it. This document is direction, not decree. Extend existing patterns, reuse existing components, and do not replace a working architecture because a different one is specified here. Preserve all current functionality.
- **If the repository is still greenfield** — implement the architecture in §10 as specified.

Either way: never break working functionality, and always extend rather than rebuild where an existing implementation is adequate.

### 12.2 Engineering Rules

1. **No fake anything.** No hardcoded statistics, no seeded fake users, no placeholder activity, no demo orders, no lorem ipsum in shipped UI. An empty product shows designed empty states.
2. **No feature reported complete unless implemented and verified.** A stub is not a feature. Say what is done and what is not.
3. **Primitives before screens.** Build the design system first. Any screen that introduces a one-off colour, spacing value or radius has a bug.
4. **Reuse before writing.** Search for an existing utility or component before adding one. Duplicated logic is a defect.
5. **Every dependency justified.** No package added to look sophisticated. Prefer the platform, then the existing stack, then a new dependency.
6. **Calculators stay pure.** No I/O, no dates, no randomness, no framework imports in `lib/calculators/`. Enforced by lint rule.
7. **Types are strict.** TypeScript `strict` on. No `any` without an inline justification comment. Database types are generated, not hand-written.
8. **Validate at every boundary.** Zod schemas shared between form, Server Action, and AI tool definition.
9. **Accessibility is not a phase.** Semantic HTML, labels, focus management and contrast are written as the component is written, not retrofitted.
10. **Small, coherent commits.** One concern per commit. A PR that touches the design system and a business feature should be two PRs.

### 12.3 Delivery Phases

Ship complete, polished features rather than many half-built ones. Each phase ends working, tested, and deployable.

| Phase | Contents |
|---|---|
| **1 — Foundation** | Design tokens · component primitives · motion system · auth · profiles · landing page + hero · dashboard · projects · crochet calculator · yarn stash |
| **2 — Creation** | Pattern library · pattern generator · yarn calculator · progress tracking · search · collections |
| **3 — Community** | Posts · likes · comments · following · creator profiles · project sharing |
| **4 — Creative** | Outfit designer · 3D preview · advanced planning · advanced yarn calculations |
| **5 — Business** | Products · inventory · customers · orders · pricing calculator · expenses · seller dashboard |
| **6 — Hardening** | Full test coverage · performance budgets met · error handling · logging · monitoring · background jobs · caching · security review · deployment verification |

The design system and motion primitives are pulled forward into Phase 1 deliberately — retrofitting a visual identity onto built screens produces exactly the generic result this document exists to prevent.

---

## 13. Testing Requirements

### 13.1 The Calculator Gate

**Calculator correctness is a merge gate.** No calculator ships without a fixture-table test covering:

| Category | Cases |
|---|---|
| Granny squares | Exact fits · non-divisible dimensions · rounding modes · seam allowance · very large counts · zero and negative rejection |
| Garments | Every supported size × type · per-piece totals summing to the whole · gauge variation |
| Yarn estimation | Each weight class · each stitch type · multi-colour splits · buffer application · unit conversion round-trips |
| Pricing | Zero-cost inputs · fee percentages · currency minor-unit rounding · margin arithmetic |
| Units | mm ↔ cm ↔ in and g ↔ oz round-trip within tolerance |

Property-based tests where invariants exist (a square count is never negative; per-piece totals always sum to the total; converting units twice returns the original within epsilon).

### 13.2 Authorization Tests

For every table, an integration test asserting that **user B cannot read, update, or delete user A's row** — through the real client, against real policies. Plus:

- Capability gates: a `user` cannot reach business routes or mutate business data.
- Customer data is inaccessible to anyone but the owning seller.
- Private projects, private stash, and unlisted patterns are not reachable by direct ID.
- Admin routes reject non-admin claims.

### 13.3 Coverage

| Layer | Tool | Scope |
|---|---|---|
| Unit | Vitest | Calculators (100% of exported functions), validators, formatters, AI output validators |
| Component | Testing Library | Primitives across every state; domain components with real props; empty/loading/error rendering |
| Integration | Vitest + test database | Server Actions, RLS policies, job handlers, search |
| E2E | Playwright | The canonical scenario (§1.3) end to end; auth flows; project lifecycle; upload; order lifecycle |
| Accessibility | axe in Playwright | Zero critical violations on every route; keyboard-only traversal of primary flows |
| Visual | Playwright screenshots | Desktop / tablet / mobile on key screens |

### 13.4 Flows That Must Be Verified

**Auth** — register · verify · login · logout · password reset · session refresh · capability enforcement.
**Projects** — create · edit · delete · restore · progress update · piece completion · photo upload · calculator linkage.
**Calculators** — granny squares · garment dimensions · yarn estimation · pricing · unit conversion.
**Yarn** — add · edit · delete · remaining-quantity tracking · reservation to a project · release on cancellation · coverage calculation.
**Patterns** — create · generate · validate · save · edit · delete · version · share · permission enforcement.
**Community** — post · upload images · like · comment · follow · save to collection · report.
**Business** — product CRUD · customer CRUD · order lifecycle including invalid-transition rejection · expenses · pricing · profit computation.
**Files** — upload · MIME and magic-byte validation · size limits · authorization · signed URL expiry · EXIF strip.
**UI** — desktop, tablet and mobile layouts · loading states · empty states · error states · reduced-motion · keyboard navigation.
**AI** — schema validation · repair on invalid output · graceful failure · rate limiting · generated-content labelling persisting through edit and export.

### 13.5 CI Gates

Every one must pass before merge:

```
lint · typecheck · unit · integration · build · migration check · a11y · bundle budget
```

---

## 14. Final Quality Checklist

Walk this before reporting any part of Crochelia complete. Do not tick an item you have not actually verified.

### Design
- [ ] White dominates; pink is accent only; no wall of pink anywhere
- [ ] All colour, spacing, radius, shadow and type values come from tokens — zero one-off values
- [ ] Two font families, one icon system, no exceptions
- [ ] Every screen checked at desktop, tablet and mobile
- [ ] No screen looks like a generic SaaS dashboard, template, or CRUD form
- [ ] Photography is real and art-directed; no stock clichés; no placeholder images shipped as content

### Hero & Landing
- [ ] Hero communicates the product within five seconds
- [ ] The live calculator preview is real and uses the production calculator module
- [ ] Entrance choreography completes in ≤ 900ms and does not loop
- [ ] LCP ≤ 2.5s, CLS ≤ 0.05, INP ≤ 200ms on throttled mobile
- [ ] Full graceful degradation: WebGL → CSS/SVG → static, each looking intentional

### AI
- [ ] No number a user relies on is produced by a model
- [ ] `lib/calculators/` contains no import from `lib/ai/`, enforced by lint
- [ ] Every AI output is Zod-validated and domain-validated before display or persistence
- [ ] Generated patterns carry a persistent `AI-generated` badge and an `origin` database column that survives edit, share and export
- [ ] Untested-pattern warning is present and honest
- [ ] Yarn and price outputs are labelled Estimate, with confidence and derivation visible
- [ ] AI never writes to the database without explicit user confirmation showing the diff
- [ ] Generation is rate-limited and token-accounted
- [ ] All four AI states (thinking / streaming / ready / failed) are implemented with real copy

### Motion
- [ ] `prefers-reduced-motion` disables all transform and scroll motion; nothing becomes unusable
- [ ] Animations use only `transform` and `opacity`, or carry a written justification
- [ ] No animation delays a user's ability to act
- [ ] No scroll-jacking, no pinned scroll, no looping ambient motion outside the hero
- [ ] Skeletons match the exact layout of the content they replace

### 3D
- [ ] WebGL appears only in the hero and the outfit preview
- [ ] 3D is lazy-loaded, never blocks first paint, and is skipped on reduced-motion, save-data, or low-power devices
- [ ] A static fallback always renders first and looks deliberate
- [ ] No information exists only inside a canvas
- [ ] 3D chunk within budget; scenes pause off-screen and when the tab is hidden

### Mobile
- [ ] Bottom navigation with a working create/assistant FAB
- [ ] Every gesture has a non-gesture equivalent
- [ ] Touch targets ≥ 44px; primary actions in the thumb zone
- [ ] Modals are bottom sheets; multi-step forms are steppers
- [ ] Counters are usable one-handed, with haptics

### Accessibility
- [ ] WCAG 2.1 AA contrast on every text and control, including over glass
- [ ] Full keyboard operation of every flow; visible focus everywhere; no focus traps
- [ ] Semantic HTML; correct ARIA only where semantics fall short
- [ ] All images have meaningful alt text; decorative images are hidden from assistive tech
- [ ] Form errors are announced and associated; focus moves to the first error
- [ ] Zero critical axe violations on every route

### Security
- [ ] RLS enabled with tested policies on **every** table
- [ ] Cross-user access denial proven by test, not assumed
- [ ] Service-role key unreachable from any client code path
- [ ] Uploads validated by magic bytes, size-limited, EXIF-stripped, re-encoded; SVG rejected
- [ ] Rate limiting on auth, AI, uploads, posts and comments
- [ ] Customer and business data never exposed publicly under any setting
- [ ] No secrets in the repository or in `NEXT_PUBLIC_*`
- [ ] User content cannot influence model instructions

### Data & Correctness
- [ ] Money stored as integer minor units with a currency code — no floats
- [ ] Measurements canonical in storage, converted only at display
- [ ] Every foreign key indexed; feed and dashboard queries verified against `EXPLAIN`
- [ ] No N+1 queries on primary routes
- [ ] Cursor pagination on every growing list
- [ ] Calculator fixture tests pass, including edge and rounding cases

### Production
- [ ] `lint`, `typecheck`, unit, integration, e2e, and production build all pass
- [ ] Migrations apply cleanly from an empty database
- [ ] `/api/health` reports liveness and readiness correctly
- [ ] Structured logs contain no PII, tokens, or customer contact details
- [ ] Environment config validated at boot; the app refuses to start when misconfigured
- [ ] Background jobs are idempotent, retried via visibility timeout, and dead-lettered on repeated failure
- [ ] Graceful shutdown drains in-flight work
- [ ] `.env.example` documents every variable
- [ ] **No Terraform, no IaC, no cloud provisioning anywhere in the repository**

### Honesty
- [ ] No fake data, fake statistics, fake users, or fake activity anywhere
- [ ] No placeholder presented as a finished feature
- [ ] Anything intentionally incomplete is stated plainly in the delivery report
- [ ] No claim of production readiness for functionality that has not been implemented and verified

---

## Delivery Report Requirements

On completion, report:

1. **What was built** — feature by feature, with what is genuinely complete and what is not.
2. **Architecture** — frontend, backend, database, auth, storage, background processing, caching, AI layer.
3. **Database** — entities, relationships, migrations, notable indexes, RLS coverage.
4. **DevOps readiness** — Docker compatibility, health checks, logging, monitoring hooks, environment configuration, CI/CD. **Terraform and infrastructure provisioning are excluded by design** and owned by a separate infrastructure application.
5. **Local setup** — environment variables, install commands, database setup and migration, dev command, test command, production build command.
6. **Verification** — tests executed and their results, build result, flows verified, issues found and fixed.
7. **Remaining work** — everything intentionally incomplete, stated plainly.

Report what is true. A feature that was not built is not a feature.
