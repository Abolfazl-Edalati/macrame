# Stack, RTL & Persian setup

Type: grilling
Status: resolved

## Answer

Stack + Persian-first setup locked (self-hosted, so no serverless constraints):

- **Framework**: Next.js (App Router, latest), React (latest), TypeScript. Self-hosted via a long-running Node server (`next start`), NOT `next build` serverless output.
- **UI**: shadcn/ui on Tailwind + Radix. Theme tokens from ticket 01 (warm earthy neutrals, amber-700 accent, cream bg).
- **Styling/setup**: Tailwind v4 with RTL supported out of the box; `dir="rtl"` + `<html lang="fa">`.
- **Font**: **IRAN Sans** (user supplies the file/package — see hand-off), via `next/font/local` or the user's chosen delivery. Vazirmatn was only the prototype stand-in. First-class: font-weight axis, fallback stack.
- **Locale/formatting**: `fa` locale. Persian digits (۱۲۳٬۴۵۶٬۷۸۹) and full-toman currency ("۱٬۲۵۰٬۰۰۰ تومان"), using a shared format util (e.g. `Intl.NumberFormat('fa-IR')`), placeholder-image/dates consistent.
- **Dates**: display Persian dates (`Intl.DateTimeFormat('fa-IR')`).
- **Library additions**: the shadcn/ui base (radix primitives, tailwind-merge, clsx, cva); an icon set (e.g. lucide-react, default with shadcn).

Hand-off for execution: user supplies the IRAN Sans font file (woff2/ttf) to be bundled via `next/font/local`.


## Question

Lock the concrete stack and the Persian-first setup for execution: Next.js App Router version, shadcn/ui component set, Tailwind + Radix theming, IRAN Sans font loading (user supplies the font file), full RTL direction and `fa` locale, Persian digit + toman currency formatting (full toman, ۱٬۲۵۰٬۰۰۰ style). Confirm the chosen Next/React/Tailwind majors and any package additions the project needs.

## Notes

- User declined serverless/Vercel → long-running domestic server; Next route handlers still used for order webhook + admin guard.
- Persian-only MVP (Q26); IRAN Sans over Vazirmatn (Q21) — user hands over the font file.
- SQLite (Q14) with Postgres swap later — ORM choice surfaces here and must not tangle the swap.
- This ticket depends on / pairs with the visual-direction prototype (01) for theming specifics.
