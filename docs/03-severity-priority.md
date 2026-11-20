# Step 3: Severity and Priority

Severity describes the effect on the product. Priority describes how soon the issue should be fixed. Ratings below use the assignment's exact level names.

| Defect | Severity | Priority | Explanation |
| --- | --- | --- | --- |
| DEF-01: Invalid guest counts are accepted | High | High | The main booking feature stores values outside the permitted guest range or with no guest count. Fix before the next release because normal form input can trigger it. |
| DEF-02: Checkout and stay-length rules are missing | High | High | The app cannot represent or validate the required stay length and check-in/checkout order. This prevents compliant reservations and also blocks proper availability testing. |
| DEF-03: No availability validation | High | High | The booking path cannot ensure all requested nights are available. Implement and test the check before release; actual occupied-night behavior still needs calendar fixtures and a completed date-range model. |
| DEF-04: Required cleaning fee is missing | High | High | Required reservation pricing is not implemented, so the one-time $50 fee cannot be verified or represented in a completed booking. Fix before release. No real incorrect charge was observed. |
| DEF-05: Untouched rental selection saves blank | High | High | A normal-looking default selection creates a booking with no rental, making the reservation unreliable. Explicitly changing the dropdown is a workaround, but users should not need to know this. |
| DEF-06: Direct booking route has no rentals | Medium | Medium | The route cannot populate its selector on a fresh load, but visiting Home first restores the list. Fix after the higher-priority booking-rule defects. |
| DEF-07: Card actions do nothing | High | Medium | The details/save/favorite/share features do not perform their stated actions. The core booking-rule defects take priority, so fix these after that work. This illustrates that severity and priority do not have to be the same. |

No issue is rated Critical because the reviewed app still renders and allows basic records to be created and viewed. No issue is rated Urgent because this is a starter application review, with no verified live incident requiring an immediate response. These ratings can change if the release context or impact changes.

INV-01 is awaiting a persistence requirement, so it has no confirmed product-defect severity or priority. TEST-01 was a resolved verification setup issue, so it is not assigned a product-defect severity or priority either.
