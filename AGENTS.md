<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Poydevor — Agent guide

## Project intent

Poydevor is a single-product hackathon MVP teaching Uzbek native-language grammar through a "Ko'lmakdan Okeangacha" (Pond → Ocean) journey. The app **only teaches Uzbek**. Foreign-language hints live in small `💡 Eslatma` cards inside lessons — they are non-interactive footnotes, never their own lesson.

Two modes:
- **Junior** — gamified (hearts, XP, streak, confetti, badges, sounds-on)
- **Senior** — minimal, professional (no hearts, no XP shown, sounds-off)

Both share the same curriculum content, color-coded grammar (EGA=blue, KESIM=red, etc.), and river map.

## Stack

- **Next.js 16.2** App Router — pure client SPA, no server data.
- **React 19**.
- **Tailwind CSS v4** via `@tailwindcss/postcss`. Design tokens live in `src/app/globals.css` under `:root` + `@theme inline`. **Do NOT use `@apply`** — Tailwind v4 deprecates it. Use inline utility classes or the tokens.
- **Zustand** with `persist` middleware → localStorage. The single store is `src/store/usePoydevor.ts`.
- **Framer Motion** for screen transitions, ripples, badge reveals.
- **lucide-react** for icons. Stick to it — don't pull in another icon set.
- **Google Fonts** loaded in `src/app/layout.tsx`: `Plus Jakarta Sans` (display) + `Inter` (body).

## Critical Next.js 16 notes

- `'use client'` must be the first line on any file using hooks, browser APIs, or event handlers. The `(app)` layout, `TopBar`, every screen page is client.
- `params` and `searchParams` in dynamic route pages are **Promises** in Next 16. We use `useParams()` from `next/navigation` in client pages — that's still synchronous.
- Root `layout.tsx` stays a Server Component (no `'use client'`) so font loading works.

## File layout

```
src/
  app/
    layout.tsx                root (server) — fonts + html shell
    globals.css               theme tokens, animations, phase backgrounds
    page.tsx                  smart redirect: onboarding | bosh
    onboarding/page.tsx       3-slide intro + mode + name
    diagnostika/page.tsx      3 interactive questions → score → start
    (app)/                    app shell with TopBar + DeviceShell
      layout.tsx
      bosh/page.tsx           dashboard
      xarita/page.tsx         river map (16 stones, 5 phases)
      dars/[id]/page.tsx      lesson card flow
      mashq/[id]/page.tsx     quiz (5 question types)
      yutuqlar/page.tsx       badges + certificate
      tahlil/page.tsx         analytics
      profil/page.tsx         profile + mode toggle
  components/
    shell/   TopBar, DeviceShell, Sidebar, BottomNav, PhaseBackdrop
    cards/   reusable lesson + quiz UI
    grammar/ color chips, drag chips, sentence builder
    fx/      Confetti, XPFloat, RippleSuccess
  data/
    curriculum.ts             16 stones (all lesson + quiz content)
    badges.ts                 7 badge defs
    maqollar.ts               daily proverbs
    diagnostika.ts            3 onboarding questions
  store/
    usePoydevor.ts            Zustand store + persist
  lib/
    sound.ts                  Web Audio API click/correct/wrong/etc.
    progress.ts               phase + level helpers
```

## Conventions

- **No `any`**. Strong types everywhere — see `src/data/curriculum.ts` for the shape contract.
- **No new files in `src/app/`** unless they're routes. Reusable React lives in `src/components/`.
- **Grammar colors are tokens**, not magic strings. Always reference `var(--g-ega)` / `text-[var(--g-ega)]` etc., never raw hex in components. The single source of truth is `globals.css`.
- **Mock-only**. Every interaction must complete locally without a network call. The store fully drives unlocks, XP, streak, badges.
- **Sounds**: gated by `useSound: false` in Senior mode. Always call `playSound('click')` etc. — never `new Audio()` inline.
- **Top bar** has a centered Mobile / Desktop toggle. Selecting Mobile clamps the `(app)` content to a 390px phone frame; Desktop expands it. This is the only place that controls device mode.

## Running

```bash
npm run dev      # localhost:3000
npm run build    # production build
npm run lint     # eslint
```
