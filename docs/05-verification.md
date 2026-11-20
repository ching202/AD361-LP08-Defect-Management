# Executed Checks and Evidence

## Method

The real `App.tsx`, routed pages, contexts, and components were rendered with React Testing Library, MemoryRouter, and jsdom. Only the rentals fetch was replaced with the exact rental data in the supplied `db.json`. Booking state and submission handlers were exercised without mocking them. Form submission used user-event clicks, preserving native required/minimum checks.

This is simulated-DOM execution plus source review. It does not claim a recorded real-browser session, a live payment, a production booking, or an end-to-end availability test. Missing checkout and availability data prevent those date-range tests from being completed in this starter.

## Results

| Evidence ID | Check | Actual observation |
| --- | --- | --- |
| OBS-01 | 1 guest | Saved a row containing Guests: 1. |
| OBS-02 | 12 guests | Saved a row containing Guests: 12. |
| OBS-03 | 0 guests | Native validity was false, rangeUnderflow was true, and no booking was saved. |
| OBS-04 | Blank date | Native validity was false, valueMissing was true, and no booking was saved. |
| OBS-05 | 13 guests | Native validity was true, no maximum existed, no error was added, and Guests: 13 was saved. |
| OBS-06 | Blank guests | Native validity was true, required was false, and an empty Guests value was saved. |
| OBS-07 | Untouched rental selection | The selector showed Cozy Cabin, but the saved Rental value was blank. |
| OBS-08 | Date-range controls | Only rental, date, and guests controls existed. No checkout or nights control was available. |
| OBS-09 | Repeated identical submission | Two identical Beachfront Condo / 2026-12-10 records were saved. This is not a full unavailable-night test. |
| OBS-10 | Fee/pricing view | The saved view contained rental, date, and guests only. No fee or total appeared. Source review found no pricing implementation. |
| OBS-11 | Fresh direct booking route | The rental list was empty, and no rental fetch occurred. |
| OBS-12 | More/Save actions | Page text was unchanged after each click. Source review also found no favorite/share handlers. |
| OBS-13 | App remount | One booking existed before unmount; none existed after remount. Persistence expectations need clarification. |

The initial and repeat runs each executed **13/13 evidence-capture checks successfully**. The observations matched across runs. These checks intentionally capture the original behavior, including defects; their passing status is not a requirement pass rate. All seven product defects remain open.

The production build passed. Build success does not establish functional correctness.

## Attached files

- [Initial observations](evidence/observations-initial.json)
- [Repeated observations](evidence/observations-repeat.json)
- [Run summaries](evidence/run-summary.json)
- [Build output](evidence/build-output.txt)
- [Source preservation check](evidence/source-preservation.json)
- [Test setup issue](evidence/test-setup-note.txt)
- [Runnable capture checks](../airbnb-clone-ts/tests/findings.test.tsx)

Source preservation compares every original source file, excluding the downloaded-file Zone.Identifier metadata, plus `db.json`, against the submitted copy. No product changes were made. Added files configure the evidence checks and document the results; package changes add verification dependencies and convenient run commands.

## Environment

Windows; Node.js 24.22.3; npm 11.6.2; React/React DOM 18.3.1; React Router 6.30.6; Material UI 6.5.0; Vite 5.4.21; TypeScript 5.9.3; Jest and jest-environment-jsdom 30.5.2; React Testing Library 16.3.3; user-event 14.6.13. Exact versions are in `airbnb-clone-ts/package-lock.json`.

The new harness initially failed before executing tests because its alias mapping took precedence over CSS mocking. Correcting that test configuration resolved the error; the application did not need a code change. This is why TEST-01 is classified separately from product defects.
