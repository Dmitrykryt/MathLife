# MathLife — Enterprise Mathematical Platform

MathLife is a modern enterprise-grade web platform with 50+ mathematical calculators, rich visualizations, interactive 3D modules, theming, and localization.

## Tech Stack

- **Next.js 15** (App Router)
- **React 18** + **TypeScript (strict)**
- **Tailwind CSS** + CSS modules
- **Framer Motion**
- **Three.js** (`@react-three/fiber`, `@react-three/drei`)
- **Recharts / chart scaffolds**
- **Zustand** (global state)
- **Jest** + React Testing Library

## Key Features

- 50+ calculators grouped by categories
- 5+ visual themes via CSS variables
- 15 configurable fonts
- Smart search for calculators
- Interactive 3D hero object reacting to last result
- Mini-games section
- Calculation history (last 20), favorites, export helpers
- RU/EN localization with dynamic UI
- 404 / Error handling pages
- API route and sitemap endpoint
- PWA support with manifest
- SEO-optimized pages with dynamic metadata

## Project Structure

```text
src/
  app/
    calculator/[slug]/page.tsx
    categories/[category]/page.tsx
    api/exchange-rate/route.ts
    sitemap.xml/route.ts
    robots.ts
    layout.tsx
    page.tsx
  components/
    calculators/
      <category>/<calculator>/
        index.tsx
        types.ts
        utils.ts
        styles.module.css
        utils.test.ts
    charts/
    three/
    layout/
    pages/
    ui/
  constants/
  hooks/
  lib/
  store/
  styles/
  types/
tests/
public/
  manifest.json
  icons/
  locales/
```

## Calculator Categories

1. Basic — arithmetic, percentage, exponent, fractions, GCD/LCM
2. Scientific — trigonometry, logarithm, complex numbers, factorial, expressions
3. Algebra — linear/quadratic/cubic equations, systems, polynomials, inequalities, progressions
4. Geometry — triangle, circle, rectangle, polygon, sphere, cylinder, cone, pyramid, coordinates, vectors
5. Matrices — operations, determinant, inverse, transpose, rank, eigenvalues
6. Statistics — basic stats, probability, distributions, correlation, hypothesis testing, combinations
7. Finance — loan, deposit, investment, VAT, currency converter, inflation
8. Converters — length, weight, temperature, area, volume, speed, time, data, angle
9. Engineering — physics, electrical, thermodynamics, fluid mechanics
10. Specialized — graphing calculator, derivative, integral, limits, Fourier transform, number theory, date, BMI

## Implemented Calculators

- **Arithmetic Calculator** — full operations (+, −, ×, ÷) with error handling
- **Percentage Calculator** — 5 modes (X% of Y, what percent, change, increase, decrease)
- **Loan Calculator** — annuity payments with amortization graph
- **Graphing Calculator** — 2D plot + 3D surface preview

## Run Locally

```bash
npm install
npm run dev
```

Open: `http://localhost:3000`

## Scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
npm test
npm run test:watch
npm run test:e2e
npm run test:e2e:ui
```

## Testing

### Unit Tests (Jest)

All calculator utility tests are configured and passing.

- 69 test suites
- 70 tests
- Jest + ts-jest

### E2E Tests (Playwright)

End-to-end tests cover critical user flows:

```bash
npm run test:e2e        # Run all E2E tests
npm run test:e2e:ui     # Interactive UI mode
npm run test:e2e:debug  # Debug mode
```

Test coverage:
- Homepage loading and navigation
- Calculator functionality (arithmetic, percentage)
- Language switching
- Theme switching
- Games page
- 404 handling

## CI/CD

GitHub Actions workflows:

- **CI** (`ci.yml`): Runs on push/PR to main
  - Linting
  - Type checking
  - Unit tests
  - Build verification
  - Matrix: Node 18.x, 20.x

- **Deploy** (`deploy.yml`): Runs on push to main
  - Tests
  - Build
  - Deploy to Vercel

Required secrets for Vercel deployment:
- `VERCEL_TOKEN`
- `VERCEL_ORG_ID`
- `VERCEL_PROJECT_ID`

## Environment Variables

Create `.env.local` from `.env.example`:

```env
NEXT_PUBLIC_SITE_URL=https://mathlife.app
NEXT_PUBLIC_EXCHANGE_RATE_API_KEY=your_key_here
NEXT_PUBLIC_GA_ID=your_ga_id
```

## SEO Features

- Dynamic `generateMetadata` for calculator pages
- Automatic sitemap with all calculators and categories
- robots.txt with proper rules
- OpenGraph and Twitter cards
- PWA manifest with icons

## How to Add a New Calculator

1. Create folder: `src/components/calculators/<category>/<slug>/`
2. Add files:
   - `index.tsx` — main component
   - `types.ts` — TypeScript interfaces
   - `utils.ts` — calculation logic
   - `styles.module.css` — optional styles
   - `utils.test.ts` — unit tests
3. Register metadata in `src/constants/calculators.ts`
4. Add entry to `src/components/calculators/shared/calculatorRegistry.tsx`
5. (Optional) add chart/3D blocks

## How to Add a New Theme

1. Add colors in `src/constants/themes.ts`
2. Add CSS variables in `src/styles/globals.css`
3. Theme is applied globally through CSS variables in `AppProviders`

## How to Add a New Font

1. Add font config in `src/constants/fonts.ts`
2. Select via `FontSwitcher`
3. The selected font is persisted in Zustand settings store

## How to Add a Chart

1. Create component in `src/components/charts/`
2. Reuse in calculator page/component
3. For domain charts, place in nested subfolders (`finance`, `statistics`, `3d`)

## Notes

- Node.js `20.9+` is recommended for latest ESLint ecosystem compatibility.
- Current project works on Node `20.0.0` with engine warnings.
- For PWA icons, use `pwa-asset-generator` or online tools.

## License

MIT


