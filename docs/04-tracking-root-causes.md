# Defect Tracking, Possible Causes, and Retesting

## Current defect register

All findings were recorded on November 20, 2026. The initial and repeat runs used the same unmodified application source.

| ID | Initial status | Current status | What happened / next action |
| --- | --- | --- | --- |
| DEF-01 | New | Open / reproduced | Both runs saved 13 guests and a blank guest value. Implement guest validation and an error response. |
| DEF-02 | New | Open / reproduced | Both runs showed only one date input. Add checkout/stay-length modeling and validation. |
| DEF-03 | New | Open / reproduced | Both runs accepted repeated identical records. Source confirms no availability check. Add an availability model and test fixtures. |
| DEF-04 | New | Open / reproduced | Both runs showed bookings without pricing. Source confirms the fee/total model is missing. Implement the required fee. |
| DEF-05 | New | Open / reproduced | Both runs saved an empty rental when the displayed default was not changed. Correct selection state and validate it. |
| DEF-06 | New | Open / reproduced | Both fresh direct-route runs had no rental options and made no rental request. Load needed data independently of Home. |
| DEF-07 | New | Open / reproduced | Both runs found no content change for More/Save; source has no handlers for all four actions. Implement the lecture's stated behavior. |
| INV-01 | New | Investigating requirement | Both runs lost bookings after remount. Clarify whether reservations must persist across reloads. |
| TEST-01 | New | Resolved | Corrected CSS mapping order in the added Jest configuration; 13 evidence checks then executed successfully. Product source was not changed. |

The second run reproduced the existing product defects. It was **not confirmation of a fix**, so those defects were not closed.

## Observed causes and possible process improvements

| Defect | Cause supported by source | Possible process gap and improvement |
| --- | --- | --- |
| DEF-01 | Guest input lacks `max` and `required`; submission and booking state do not validate it. | Boundary checks may have been omitted. Add cases for 0, 1, 12, 13, and blank; validate values in a shared business-rule function. |
| DEF-02 | Booking types and form only contain one date. | Requirement-to-model review may have been incomplete. Map each rule to fields and validation before implementing the form. |
| DEF-03 | `addBooking` always appends; no calendar/availability model exists. | Availability may not have been included in acceptance planning. Add deterministic available/unavailable-night fixtures and conflict tests. |
| DEF-04 | No fee or total is calculated or stored. | Pricing rules may not have been included in design or review. Put the one-time fee in one pricing function and test different stay lengths. |
| DEF-05 | State starts with `rental: ""`, but the select displays the first option. Only changing it updates state. | Default-state behavior may not have been tested. Use a real placeholder or initialize a valid selection, and validate before saving. |
| DEF-06 | Only Home fetches rental data; a fresh provider starts with an empty list. | Direct navigation may not have been considered. Test each route on a fresh load and make data loading available where it is needed. |
| DEF-07 | More/Save and the two icons have no action handlers. | Visual controls may have been added before their behaviors. Review each visible action against its acceptance criteria. |

The code causes above are observed. The process gaps are hypotheses, not claims about what the original developer did. The Week 8 lecture's root-cause approach can be used to ask why the requirement, implementation, or test gap occurred before deciding how to prevent it.

## Retest plan after future corrections

| Defect | Cases to run | Required result before closure |
| --- | --- | --- |
| DEF-01 | Guest values 0, 1, 12, 13, and blank, with an explicit rental and valid dates. | Reject 0, 13, and blank with an error and no saved record; accept 1 and 12. |
| DEF-02 | 0, 1, 31, and 32 nights; equal dates; checkout before check-in. | Accept 1 and 31 nights with check-in before checkout; reject invalid ranges and show an error. |
| DEF-03 | All nights available; one middle night unavailable; overlap with an existing reservation. | Accept only fully available stays and reject conflicts. Define availability fixtures before testing. Check simultaneous submissions once a shared reservation service exists. |
| DEF-04 | Beachfront Condo at $200/night for 1 and 2 nights, all other fields valid. | Totals are $250 and $450 respectively, with one $50 fee per reservation. The fee must not be applied once per night. |
| DEF-05 | Leave the initial selection untouched, explicitly select a rental, and attempt a blank rental. | The saved rental matches the visible selection, or the placeholder is rejected with an error. Never silently save a blank rental. |
| DEF-06 | Open `/bookings/add` directly, reload it, then reach it through Home. | Rentals load in each supported entry path; invalid empty selections cannot be submitted. |
| DEF-07 | Activate More, Save, favorite, and share. | Each performs the agreed action from the lecture; check the resulting details view, favorites state, liked state, and share behavior. |

For every correction: **Open -> Fixed (developer change available) -> Ready for retest -> Closed only after expected results are verified**. Reopen the defect if the original problem still occurs. Record the tested version, result, and evidence, then rerun related working cases to check for regressions. The evidence-capture checks deliberately describe the old behavior; replace those expectations with acceptance checks when fixes are implemented.
