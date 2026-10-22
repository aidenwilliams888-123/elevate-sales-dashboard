# Optional native Power BI build

These files are a model guide, not a .pbix or .pbit. They have not been executed in Power BI Desktop. The browser dashboard is the completed usable application.

1. On Windows, open Power BI Desktop. Import the website's exported project CSV as **Projects**, `Reported.csv` as **Reported**, and `CareCohorts.csv` as **CareCohorts**. The template in `../data/projects_template.csv` has headers but no fabricated rows.
2. Use Power Query to set ProjectID, AnonymousLabel, LeadSource and Cohort to Text; CollectionDate and SnapshotDate to Date; CollectedUSD, MonthlyPriceUSD and revenue/price fields to Fixed decimal; counts and months to Whole number; EstimatedColdCallClientShare to Decimal. Check unique ProjectID and valid amounts/dates. The reported CSV contains a lower bound, not an exact receipt total.
3. Create measures individually from `Measures.dax`. Create Date as a calculated table, mark Date[Date] as the date column and sort YearMonth by YearMonthSort. Create the single-direction one-to-many relationship Date[Date] → Projects[CollectionDate]. Leave Reported and CareCohorts disconnected; they are aggregate snapshot/reference tables, not detailed project facts.
4. Build a Business snapshot page using Reported Completed Projects, Reported Collections Lower Bound USD (title **Reported collected revenue: at least**), Care MRR USD and Care Customers. Add the owner-estimated source mix from Reported only as an explicitly labeled estimate. With one summary row, MAX selects that row. If keeping multiple snapshots later, require a single snapshot selection rather than silently taking the largest historical value.
5. Build a separate Entered project records page: cards for Entered Projects, Entered Website Collections USD, Average Entered Project USD; column chart Date[YearMonth] vs Entered Website Collections USD; source bars Projects[LeadSource] vs entered collections; source/year slicers and detailed records table. Missing months must not be labeled confirmed zero business revenue. Empty ledger: leave average blank and show **Add actual project records**.
6. Format currency in USD and counts as integers. Keep estimates, lower bounds and detailed records visually distinct. Care Scheduled Charges USD is $1,050 under the reported tenure assumption; it is not cash collected. Care Annualized Run Rate USD is $3,000, not historical annual revenue.
7. Save as a native .pbix after validation in Desktop. Check empty-data behavior, $250 MRR and $1,050 scheduled charges. Reconcile entered projects with real receipts using `../reconcile.sql`. Nothing in these files verifies the reported $26,000+ total or establishes exact conversion. For payment-month cash flow, extend to one row per payment rather than assigning the entire project total to its final collection date.

Microsoft references:

- [Power BI Desktop](https://learn.microsoft.com/en-us/power-bi/fundamentals/desktop-get-the-desktop)
- [Date tables](https://learn.microsoft.com/en-us/power-bi/transform-model/desktop-date-tables)
- [DIVIDE](https://learn.microsoft.com/en-us/dax/divide-function-dax)
