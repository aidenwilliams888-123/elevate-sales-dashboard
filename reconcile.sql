-- Import the actual exported CSV as Projects with numeric CollectedUSD,
-- date/text CollectionDate, and text ProjectID, AnonymousLabel, LeadSource.
-- The initial project ledger is empty. No records or results are invented.
-- These SELECT statements work in SQLite and SQL Server after table import.

SELECT COUNT(*) AS EnteredProjects,
       SUM(CollectedUSD) AS EnteredWebsiteCollectionsUSD,
       AVG(CollectedUSD) AS AverageEnteredProjectUSD
FROM Projects;

SELECT LeadSource, COUNT(*) AS EnteredProjects,
       SUM(CollectedUSD) AS WebsiteCollectionsUSD,
       AVG(CollectedUSD) AS AverageEnteredProjectUSD
FROM Projects GROUP BY LeadSource;

-- Should return no rows.
SELECT ProjectID, COUNT(*) AS RecordCount FROM Projects
GROUP BY ProjectID HAVING COUNT(*) > 1;

SELECT * FROM Projects
WHERE ProjectID IS NULL OR ProjectID = '' OR CollectedUSD IS NULL
   OR CollectedUSD < 0 OR CollectionDate IS NULL OR CollectionDate = ''
   OR LeadSource IS NULL OR LeadSource NOT IN ('Cold call','Referral','Other','Unknown');

-- The owner-reported revenue lower bound ($26,000+) may include care.
-- Never force website-only records to match that mixed revenue total.
-- Reconcile project cash amounts and dates to actual payment records.
