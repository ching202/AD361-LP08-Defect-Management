# Learning Practice 08: Defect Management

This submission investigates the North Vacation Booking starter application against the six requirements in the [assignment README](docs/assignment-readme.md).

## Required work

1. [Step 1: Classify the findings](docs/01-findings.md)
2. [Step 2: Complete defect report](docs/02-defect-report.md)
3. [Step 3: Severity and priority](docs/03-severity-priority.md)

## Supporting work

- [Defect tracking, possible causes, and retest plan](docs/04-tracking-root-causes.md)
- [Executed checks and supporting evidence](docs/05-verification.md)
- [Requirement checklist and Week 8 transcript references](docs/06-completeness-check.md)

The review found **five product defects tied to the written requirements**, plus **two additional product defects**, **one finding needing requirement clarification**, and **one resolved issue in the added evidence-capture setup**. The additional findings are clearly labeled so they do not get confused with the six written requirements.

The assignment asks for defect management, not repairs to the application. The original application source and data are unchanged. Product defects remain **Open / reproduced**. Retesting and closure steps are proposed; no unperformed fixes or successful confirmation tests are claimed.

## Run the app

Tested with Node.js 24.22.3 and npm 11.6.2. From this repository:

```sh
cd airbnb-clone-ts
npm ci
npm run api
```

In a second terminal, from `airbnb-clone-ts`:

```sh
npm run dev
```

Open Vite's displayed address. Visit **Home** first and wait for the rentals, then use **Add Booking**. Starting directly on the booking route exposes a separate defect, DEF-06.

## Repeat the evidence checks

From `airbnb-clone-ts`:

```sh
npm run evidence
npm run build
```

The 13 evidence-capture checks reproduce the starter's observed behavior. **Passing these checks means the findings were reproduced; it does not mean the application's requirements pass.** The captured observations are saved under `docs/evidence/` for the initial and repeat runs. The tests render the real application in jsdom and replace only the rentals fetch with the supplied `db.json` data.

The npm package's `private: true` setting is unrelated to GitHub repository visibility.

AI assistance was used to inspect the starter, run checks, and prepare this documentation. Findings are based on the supplied requirements, original source, executed observations, and the Week 8 transcript.
