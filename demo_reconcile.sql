-- SYNTHETIC DEMO ONLY. Import demo-opportunities.csv as DemoOpportunities.
-- Numeric: amount, quote, cycle. Text: source, stage, contacted, qualified,
-- proposal, care, dataStatus. Boolean CSV fields contain true / false text.
-- Expected totals: 1200 prospects, 360 reached, 110 interested, 45 quoted,
-- 17 wins, $26750 won project value. No actual business results are asserted.
SELECT COUNT(*) AS Prospects,
    SUM(CASE WHEN contacted='true' THEN 1 ELSE 0 END) AS Reached,
    SUM(CASE WHEN qualified='true' THEN 1 ELSE 0 END) AS Interested,
    SUM(CASE WHEN proposal='true' THEN 1 ELSE 0 END) AS Quoted,
    SUM(CASE WHEN stage='Won' THEN 1 ELSE 0 END) AS Wins,
    SUM(CASE WHEN stage='Won' THEN amount ELSE 0 END) AS WonValueUSD,
    1.0 * SUM(CASE WHEN stage='Won' THEN 1 ELSE 0 END) / NULLIF(COUNT(*),0) AS ProspectConversion,
    1.0 * SUM(CASE WHEN stage='Won' THEN 1 ELSE 0 END) /
        NULLIF(SUM(CASE WHEN proposal='true' THEN 1 ELSE 0 END),0) AS QuoteToWin
FROM DemoOpportunities;

SELECT source, COUNT(*) AS Prospects,
    SUM(CASE WHEN stage='Won' THEN 1 ELSE 0 END) AS Wins,
    1.0 * SUM(CASE WHEN stage='Won' THEN 1 ELSE 0 END) / NULLIF(COUNT(*),0) AS ProspectConversion,
    SUM(CASE WHEN stage='Won' THEN amount ELSE 0 END) AS WonValueUSD
FROM DemoOpportunities GROUP BY source;

-- No rows expected.
SELECT id,COUNT(*) FROM DemoOpportunities GROUP BY id HAVING COUNT(*)>1;
SELECT * FROM DemoOpportunities WHERE dataStatus<>'SYNTHETIC'
    OR (proposal='true' AND qualified<>'true')
    OR (qualified='true' AND contacted<>'true')
    OR (stage='Won' AND proposal<>'true');
