# Requirement Checklist and Transcript References

## All six product requirements reviewed

| Requirement | Finding / evidence | Review outcome |
| --- | --- | --- |
| R1: 1-12 guests | DEF-01; OBS-01, 02, 03, 05, 06 | Boundaries 1 and 12 accepted; 0 blocked; 13 and blank incorrectly accepted. |
| R2: 1-31 nights | DEF-02; OBS-08; booking model | Not implemented. No checkout/night count exists, so 0/1/31/32-night acceptance cases are proposed retests, not claimed executions. |
| R3: Check-in before checkout | DEF-02; OBS-08; booking model | Not implemented. Only one date is available; equal/reversed date ranges cannot be entered and validated. |
| R4: All nights available | DEF-03; OBS-09; booking state code | No availability check or inventory model exists. Duplicate records were observed; real occupied-night acceptance testing is blocked by missing date-range/calendar data. |
| R5: One-time $50 fee | DEF-04; OBS-10; booking model/display | No fee/total calculation or representation exists. No actual payment or incorrect charge is claimed. |
| R6: Invalid input produces an error | DEF-01 and DEF-05; OBS-03 through 07 | Some native constraints work, but 13 guests, blank guests, and a blank stored rental are accepted without an error. |

## Assignment deliverables

| Instruction | Where completed |
| --- | --- |
| Classify findings and explain decisions | `01-findings.md`: five core and four additional findings, with product/test/investigation distinctions and an explanation of change requests. |
| Choose one product defect and write a complete report | `02-defect-report.md`: DEF-01, including unique ID, title, date, reporter, feature, environment, preconditions, numbered steps, expected/actual results, severity, priority, initial/current status, requirement/test links, and attached evidence. |
| Assign severity and priority to each product defect | `03-severity-priority.md`: all seven product defects, using the assignment's level names and separate explanations of impact and urgency. |
| Track status and consider causes (summary/objectives) | `04-tracking-root-causes.md`: actual open/reproduced states, observed causes, explicitly hypothetical process gaps, proposed retests, closure/reopen conditions. |
| Provide source and reproducible evidence | Original application source/data, runnable capture checks, initial/repeat observations, build evidence, and source hashes. |
| GitHub submission | Submit the public repository URL in Canvas. The npm package's `private` flag does not control GitHub visibility. |

## Week 8 transcript points applied

| Approximate time | Instructor guidance | Application here |
| --- | --- | --- |
| 1:09-1:12 | Use versions and IDs to connect tests, results, and reports. | Requirement IDs R1-R6, findings F1-F9, defect IDs, observation IDs, original source hashes, and a dependency lockfile. |
| 1:13-1:14 | A defect report explains a difference between expected and actual results and supports reproduction. | The full report states exactly which invalid input is accepted and the actual stored row. |
| 1:15-1:17 | Include ID, author, environment, steps, expected/actual results, severity, priority, status, and references. | All fields are present in DEF-01, with actual supporting files. |
| 1:16-1:17 | Severity and priority are different. | Every product defect has an impact rating and a separate fix-timing rating; DEF-07 is High severity / Medium priority. |
| 1:22-1:25 | More/Save/favorite/share should act; related controls can be grouped when they share the issue. | Supplemental DEF-07 groups the unimplemented card actions. DEF-02 similarly groups the two date-range rules while preserving both requirement links. |
| 1:31:57-1:32:32 | Planned starter tests may be absent; most homework findings can be product defects. | No invented supplied tests or forced change-request category. New verification checks are clearly labeled as added work. |
| 1:33-1:34 | Detailed reproduction steps make the report useful. | DEF-01 identifies the route, rental, date, guest value, submit action, and resulting booking view. |
| 1:34-1:36 | Track discovery, investigation, fixing, retesting, and closure. | Defects stay open after reproduction. The report defines evidence needed for future closure and distinguishes a repeat failure from confirmation of a fix. |

The partner project, its two-defect minimum, AI-prompt section, presentation, and partner contribution requirements belong to the final project. They are not added to this learning practice, whose README requests one complete defect report. The general late-work/resubmission reminders do not change these deliverables.
