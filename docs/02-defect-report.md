# Step 2: Complete Defect Report

| Field | Information |
| --- | --- |
| Defect ID | DEF-01 |
| Title | Booking accepts more than 12 guests without an error |
| Date reported | November 20, 2026 |
| Reporter / role | Ching (`ching202`), student tester, with AI assistance |
| Reporting context | Learning Practice 08 coursework; individual defect-management report. |
| Application / feature | North Vacation Booking / Add Booking / guest validation |
| Test environment | Windows; Node.js 24.22.3; npm 11.6.2; React 18.3.1; React Router 6.30.6; Vite 5.4.21. Executed with Jest 30.5.2, jest-environment-jsdom 30.5.2, React Testing Library 16.3.3, and user-event 14.6.13. |
| Source under test | Original `StarterLP08.zip` application source and `db.json`; no product fixes applied. |
| Testing phase / technique | Development testing of the integrated React booking flow; boundary-value and invalid-input testing, supported by source review. |
| Preconditions | Rentals have loaded from the supplied data by first visiting Home. Start with a fresh app instance and no saved bookings. The Beachfront Condo rental is available in the dropdown. |
| Related requirements | R1: 1-12 guests. R6: invalid information must produce an error. |
| Related test / finding | TC-LP08-01 / F1; automated evidence OBS-05. OBS-06 captures a related empty-guest variant. |
| Severity | **High**: a core reservation rule is not enforced, allowing invalid guest counts to be stored. |
| Priority | **High**: fix before the next release. There is no evidence of a live outage that would justify Urgent. |
| Initial status | **New** when first recorded. |
| Current status | **Open / reproduced** after the same result occurred on a repeat run. No correction has been applied. |

## Detailed steps to reproduce

1. Start the supplied API with `npm run api` and the app with `npm run dev`, as described in the repository README.
2. Open **Home** and wait for the rental cards to load. Starting here avoids the separate direct-route issue DEF-06.
3. Click **Add Booking**.
4. Explicitly select **Beachfront Condo**. This avoids the separate blank-default-selection issue DEF-05.
5. Enter **December 10, 2026** (`2026-12-10`) in Date.
6. Replace Number of Guests with **13**.
7. Click **Confirm Booking**.
8. Click **Bookings** in the navigation.

The same sequence was executed against the real routed React components in jsdom. The rental fetch was supplied from the original `db.json`; booking submission and state were not mocked. These browser instructions are reproducible steps, not a claim that a separate real-browser session was recorded.

## Expected result

The app rejects 13 guests, shows an error explaining that the allowed range is 1-12, and does not create the invalid booking. The exact wording of the message is not prescribed by the requirement.

## Actual result

The input reports itself as valid, no error is displayed by the form, and the Bookings page contains:

```text
Rental: Beachfront Condo Date: 2026-12-10 Guests: 13
```

Clearing the guest value also saves a booking whose Guests value is blank. By comparison, 0 guests is correctly blocked by the existing native minimum constraint.

## Supporting evidence attached

- [Initial observations](evidence/observations-initial.json): OBS-05 includes `guests: 13`, `valid: true`, `maximum: null`, the unchanged form text, and the saved booking row.
- [Repeated observations](evidence/observations-repeat.json): OBS-05 reproduces the same result. OBS-06 records the blank-value variant.
- [Evidence-capture code](../airbnb-clone-ts/tests/findings.test.tsx): OBS-05/06 use submit-button clicks, so native validation is not bypassed with a direct form-submit event.
- [Original AddBooking source](../airbnb-clone-ts/src/pages/AddBooking.tsx): lines 59-65 have `min="1"` but no `max` or `required`; lines 26-28 submit the value without a business-rule check.
- [Original booking state code](../airbnb-clone-ts/src/context/BookingContext.tsx): lines 16-17 append the booking without validating it.

## Proposed correction and confirmation test

Add a required guest value with a maximum of 12 and validate a whole-number guest count of 1-12 before saving. A shared validation function should enforce the rule rather than relying only on HTML attributes. Return an error and keep the invalid reservation out of the booking list.

After a developer implements the correction, rerun the reproduction above and check 0, 1, 12, 13, and blank guest values. Only 1 and 12 should be accepted in those boundary checks. Also rerun normal booking and date-validation checks. Mark this defect Closed only after those corrected outcomes are observed. This is a proposed retest, not a completed fix.
