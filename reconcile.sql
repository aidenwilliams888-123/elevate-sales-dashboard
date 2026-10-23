-- Import the actual exported CSV as Projects with numeric RecordedValueUSD,
-- date/text RecordDate, and text ProjectID, AnonymousLabel, LeadSource.
-- The published ledger contains 17 reconstructed, owner-confirmed project values. Recorded dates are win-date proxies for these rows.
-- These SELECT statements work in SQLite and SQL Server after table import.

SELECT COUNT(*) AS EnteredProjects,
       SUM(RecordedValueUSD) AS EnteredWebsiteValueUSD,
       AVG(RecordedValueUSD) AS AverageEnteredProjectUSD
FROM Projects;

SELECT LeadSource, COUNT(*) AS EnteredProjects,
       SUM(RecordedValueUSD) AS WebsiteValueUSD,
       AVG(RecordedValueUSD) AS AverageEnteredProjectUSD
FROM Projects GROUP BY LeadSource;

-- Should return no rows.
SELECT ProjectID, COUNT(*) AS RecordCount FROM Projects
GROUP BY ProjectID HAVING COUNT(*) > 1;

SELECT * FROM Projects
WHERE ProjectID IS NULL OR ProjectID = '' OR RecordedValueUSD IS NULL
   OR RecordedValueUSD < 0 OR RecordDate IS NULL OR RecordDate = ''
   OR LeadSource IS NULL OR LeadSource NOT IN ('Cold call','Referral','Other','Unknown');

-- The owner-reported revenue lower bound ($26,000+) may include care.
-- Never force website-only records to match that mixed revenue total.
-- Reconcile project cash amounts and dates to actual payment records.
