# Elevate Web Design — Sales & Revenue Dashboard

[Open the live dashboard](https://aidenwilliams888-123.github.io/elevate-sales-dashboard/)

A browser dashboard for Elevate Web Design, with an owner-reported business snapshot, care-plan calculations, and a local project ledger. It works without Power BI Desktop. **This is not a native Power BI report or a `.pbix` file.**

## Deep analytics demo

[Open deep analytics](https://aidenwilliams888-123.github.io/elevate-sales-dashboard/analytics.html)

This separate mode contains **1,200 entirely synthetic prospects**, 17 invented wins and $26,750 in illustrative won project value. It never changes the owner-reported snapshot or local project ledger. The funnel, dates, prices, quote values, care flags, loss reasons and follow-up dates are invented. They do not establish actual Elevate results.

- Performance: 8 KPIs, close-month won value, creation-cohort conversion, pricing and sales-cycle distributions, monthly cohort scorecard.
- Funnel and channels: ever-reached milestones, progression and non-progression rates, cold-call/referral comparisons, loss reasons and a +5 percentage point close-rate scenario.
- Pipeline: current stage counts, open qualified value, illustrative probability weights, paginated overdue follow-ups, searchable/paginated prospect records.
- Planning: outreach, conversion, pricing, costs, delivery capacity, care uptake and time assumptions. Includes capacity caps, contribution per modeled hour and conversion/price sensitivity. Inputs are hypothetical and independent from filters. No churn, taxes, care delivery costs or owner pay are modeled.

Global filters select **lead creation cohorts**. All outcomes are observed through October 22, 2026. Won-value charts group close dates for the selected cohorts; they are not cash-collection charts. Funnel milestone counts are nested, while current stage counts are mutually exclusive. Non-progression does not mean rejection. Channel ROI is not inferred without actual channel cost data.

The browser creates its deterministic records in `demo-domain.mjs`. `demo-opportunities.csv` contains the same records; the export button downloads the currently selected subset. `tests-demo.mjs` reconciles the funnel and scenario calculations. These demo records must never be imported into the actual business ledger as real projects.

Run `node tests-demo.mjs` to check demo analytics.

## Business context

The owner reported the following on October 22, 2026:

| Item | Reported value | Evidence |
|---|---|---|
| Websites sold, paid and completed | 17 | Owner recollection |
| Total cash collected | $26,000+ | Owner-reported lower bound; exact total and care inclusion not reconciled |
| Website prices | $1,200–$2,000 | Owner-reported range; not a mean |
| Companies cold-called | Roughly more than 1,000 | Estimate; not a verified unique-prospect ledger |
| Client acquisition mix | About 80% cold calls, remainder referrals | Owner estimate, not precise client counts |
| Current care plans | 5 customers at $50/month | Owner report |
| Care-plan tenure | 2 customers × 5 months, 2 × 4 months, 1 × 3 months | Approximate durations; calendar starts unknown |

The care plan calculations are $250 monthly recurring revenue, $3,000 annualized run rate, and $1,050 in scheduled charges under the assumption that each stated month is a billed period at $50. **Scheduled charges are not confirmed receipts.** Do not add them to the $26,000+ total: that total may already include care.

The owner recalled no clients in the first two months, reaching two clients in a later month, subsequent growth, and a slowdown in the latest two months. There are no exact dates or monthly counts, so this appears as qualitative context, not fabricated historical data.

## Using the dashboard

1. **Overview** shows business totals and clearly labels estimates. Missing historical charts and exact conversion remain unavailable.
2. **Project ledger** lets you enter actual, anonymous paid website records. Each record requires a unique ID, label, amount, final collection date, and acquisition source. You can edit/remove entries and filter by year/source. Currency calculations use cents to avoid floating-point addition drift.
3. **Care revenue** separates subscription run rates from scheduled historical charges and actual cash receipts.
4. **Data & definitions** explains provenance, supports local snapshot edits, and imports JSON backups.

Project entries and changes save in **this browser’s local storage** only. They do not update GitHub, other devices, or interviewer copies. Clearing browser data can erase them. **Export backup** downloads a complete JSON file for restoring/importing on another device. **Export CSV** downloads the currently filtered project records for Excel, SQL or Power BI. CSV import is not implemented; use the form or a validated JSON backup.

### Trends and average value

Only entered records feed ledger totals, average project value and monthly charts. Overview business totals never silently combine with incomplete detailed records. Record coverage compares all entered rows with the reported 17 projects. It does not prove the records are correct or reconciled.

One record carries a fully paid website total on its final collection date. This convention is useful for reconstructing paid-project history. **If a project was paid in installments across months, its full total on the final payment date is not exact monthly cash flow.** Extend the model with a payment ledger before claiming cash flow by payment month. The chart groups these entered project collections, not completed dates or recognized accounting revenue. Missing months mean no entered rows, not proven zero revenue.

Exact conversion is intentionally unavailable. Seventeen clients divided by a rough cold-call volume mixes channels and uncertain denominators. Reconstruct a unique all-channel prospect population and outcomes over the same period before calculating won opportunities / all opportunities.

## Publish updated records

The approved public baseline contains **no client-level records**. The deployed dashboard fetches `data/business.json`. To publish changes:

1. Export a JSON backup from your local dashboard.
2. Review it carefully. Retain only records you want public and use anonymous labels. The project source and amount become public if committed. Do not include bank details, customer contact information, receipts or invoices.
3. In GitHub, edit `data/business.json` to the reviewed JSON. Preserve `schemaVersion: 1`, update `asOf`, and use valid dates and unique IDs. Commit to `main`.
4. GitHub Pages republishes from `main` at the repository root. A visitor with local edits will continue seeing their local version until choosing Reset this browser in Data & definitions. Other visitors see the updated baseline.

Changing the JSON business name does not automatically replace the branded static site copy. Update HTML labels if reusing this for another business.

## Project structure

- `index.html`, `styles.css`, `app.js`: responsive, buildless dashboard.
- `domain.mjs`: validated records, care calculations, filtering, monthly aggregation and CSV export.
- `data/business.json`: approved aggregate snapshot with an empty project ledger.
- `data/projects_template.csv`: headers for the exact exported record format.
- `powerbi/`: empty detailed-data schema, reported totals, care cohorts, DAX and setup guidance for a future native report.
- `reconcile.sql`: SQL checks for reconstructed project records.
- `tests.mjs`: business-rule tests for calculations, import validation, filtering, and CSV formula protection.

Serve this folder through any static web server to run locally. Direct `file://` opening cannot fetch the JSON. No build step or application dependencies are required. Font styling uses Google Fonts, with system fallbacks. No analytics, tracking, remote database or embedded credentials are included.

For developers: `node tests.mjs` runs the calculation/validation checks. Native Power BI execution is not part of these tests.

## Interview demonstration

Present this as a **new browser dashboard using owner-reported totals and calculated subscription metrics**. Show how empty states protect against false precision. Enter a real anonymous project, demonstrate filtering and average value, then explain how you would reconcile it to records. Avoid showing a temporary test record as real data.

This implementation does not establish that a Power BI project was previously completed or used to generate revenue. The exact resume bullets were not provided. The Power BI files here are a model guide and measures, not evidence of native report authoring. Only claim hands-on use of tools and work you have actually performed.

## Native Power BI later

Use Windows Power BI Desktop and follow `powerbi/SETUP.md`. Power Query cleans and types data, model relationships define filtering, and DAX calculates measures. Charts are one part of that workflow. This website is the usable browser alternative for the owner's current Mac-only setup.
