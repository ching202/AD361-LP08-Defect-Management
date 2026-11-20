# Step 1: Classify the Findings

**Date:** November 20, 2026

**Application:** North Vacation Booking, StarterLP08.zip

The ZIP has no separate findings list or supplied tests. Its README asks us to find problems in the application. In the Week 8 recording, about **1:31:57-1:32:32**, the instructor explains that planned tests may not have made it into the starter and that most findings can be product defects. The four empty rows in the template are not treated as a four-finding limit.

## Written requirements

| ID | Requirement |
| --- | --- |
| R1 | A reservation may include 1-12 guests. |
| R2 | A reservation may last 1-31 nights. |
| R3 | Check-in must occur before checkout. |
| R4 | All requested nights must be available. |
| R5 | A valid reservation includes a one-time $50 cleaning fee. |
| R6 | Invalid information must produce an error. |

## Classification table

| Finding / ID | Observation and evidence | Classification | Explanation |
| --- | --- | --- | --- |
| F1 / DEF-01 | 13 guests and an empty guest field are both saved without an error. OBS-05 and OBS-06. | Product defect | These values violate R1 and R6. The input has a minimum but no maximum or required setting, and submission does not validate the value. |
| F2 / DEF-02 | The form has only one Date field. There is no checkout or nights field, and neither is represented in the booking model. OBS-08. | Product defect | The app cannot describe or validate a 1-31-night stay or compare check-in with checkout, as R2 and R3 require. These are one grouped finding because both gaps come from the missing date-range implementation. No claim is made that a 32-night stay was actually entered. |
| F3 / DEF-03 | Submission appends a booking without checking availability. Two identical rental/date entries are accepted. OBS-09 and source review. | Product defect | R4 is not implemented: no availability data or availability check exists. The duplicate experiment supports the finding, but is not a complete test of occupied nights because checkout and calendar fixtures are absent. |
| F4 / DEF-04 | The saved booking shows only rental, date, and guests. The model and submission path contain no cleaning fee or total calculation. OBS-10 and source review. | Product defect | The required one-time $50 fee in R5 is not implemented. This is missing pricing behavior, not evidence that a real customer was charged the wrong amount. |
| F5 / DEF-05 | The dropdown visually shows Cozy Cabin, but leaving it untouched saves a blank rental name. OBS-07. | Product defect | The displayed selection and stored booking disagree. A reservation with no rental should not be silently saved; this also violates R6. |

## Additional findings

These go beyond the six listed booking rules but are included so relevant observations are not lost.

| Finding / ID | Observation and evidence | Classification | Explanation |
| --- | --- | --- | --- |
| F6 / DEF-06 | Opening `/bookings/add` in a fresh app instance produces an empty rental dropdown. No rentals request occurs. OBS-11. | Product defect | Rental data is fetched only by Home. The Add Booking route depends on having visited another page first, even though it is a standalone application route. Visiting Home first is a workaround. |
| F7 / DEF-07 | More and Save do not change the page, and the card's More, Save, favorite, and share controls have no action handlers. OBS-12 and source review. | Product defect against the lecture's stated behavior | The instructor explicitly says these controls should show details, save, like, and share at about 1:22:15-1:25:54. This is one grouped report, following the class example. The six written rules do not mention these controls. |
| F8 / INV-01 | Booking records disappear when the app is unmounted and remounted. OBS-13. | Requires more investigation | Booking state is in memory only. The supplied requirements do not say whether reservations must survive a reload, so persistence expectations need clarification before calling this a confirmed requirement violation. |
| F9 / TEST-01 | The newly added Jest evidence harness initially tried to parse `nav.css` as JavaScript. | Problem with the test setup | The app's build succeeded; the test's alias mapping matched CSS before its style mock did. Putting the CSS mapping first resolved the harness error without changing application code. This was an issue in our added verification setup, not a supplied starter test or a product defect. |

No observed finding is classified as a requested change. Missing behavior already required by R1-R6 is a defect, not a new feature request. A request for a new feature outside these requirements, such as promotional discount codes, would be a change request; that is only a category example, not an observed finding.

## Source references

- [AddBooking.tsx](../airbnb-clone-ts/src/pages/AddBooking.tsx): lines 7-10 initialize a blank rental; lines 26-28 submit without validation; lines 37-43 render the selection; lines 48-65 define the date and guest inputs.
- [BookingContext.tsx](../airbnb-clone-ts/src/context/BookingContext.tsx): lines 14-17 hold bookings in memory and append every submission.
- [Booking types](../airbnb-clone-ts/src/types/index.ts): lines 9-18 contain only rental, date, and guests.
- [Bookings.tsx](../airbnb-clone-ts/src/pages/Bookings.tsx): lines 8-10 display only those three fields.
- [Home.tsx](../airbnb-clone-ts/src/pages/Home.tsx): lines 29-38 fetch rentals when Home mounts.
- [RentalCard.tsx](../airbnb-clone-ts/src/components/RentalCard.tsx): lines 37-43 render controls without action handlers.

The unused reusable `BookingForm.tsx` has similar input gaps, but the routed page is `pages/AddBooking.tsx`. The duplicate form is not counted as an extra user-facing defect.

## What worked

The submitted checks accepted guest counts of 1 and 12. Zero guests was blocked by native minimum validation, and an empty date was blocked by the required date input. These observations prevent incorrectly reporting that all validation is missing. They check individual fields, not compliance of a complete stay with all six requirements.
