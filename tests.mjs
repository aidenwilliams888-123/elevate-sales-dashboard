import assert from 'node:assert/strict';
import fs from 'node:fs';
import {validate,careMetrics,projectMetrics,monthlyTotals,filterProjects,csvText,validDate} from './domain.mjs';
const baseline=JSON.parse(fs.readFileSync(new URL('./data/business.json',import.meta.url),'utf8'));
validate(baseline);
assert.equal(baseline.projects.length,0,'No fabricated projects in published data');
assert.deepEqual(careMetrics(baseline.reported),{customers:5,mrr:250,annualRunRate:3000,scheduled:1050});
assert.deepEqual(projectMetrics([]),{count:0,total:0,average:null});
// Disposable test fixtures only. They are never shipped in the business JSON.
const fixture=[{id:'TEST-1',label:'Test only',amount:1200.1,date:'2026-01-31',source:'Cold call'},{id:'TEST-2',label:'Test only',amount:1999.9,date:'2026-03-01',source:'Referral'}];
assert.deepEqual(projectMetrics(fixture),{count:2,total:3200,average:1600});
assert.deepEqual(monthlyTotals(fixture),[{month:'2026-01',total:1200.1},{month:'2026-02',total:0},{month:'2026-03',total:1999.9}]);
assert.equal(filterProjects(fixture,'Referral','2026').length,1);
assert.equal(filterProjects(fixture,'All','2025').length,0);
for(const invalid of [null,'2026-02-30','2026-13-01','hello'])assert.equal(validDate(invalid),false);
for(const transform of [d=>d.projects.push({...fixture[0],amount:-1}),d=>d.projects.push(fixture[0],fixture[0]),d=>d.projects.push({...fixture[0],date:'2027-01-01'}),d=>d.projects.push({...fixture[0],source:'Unmapped'}),d=>d.reported.careCohorts[0].customers=-1]){
  const d=structuredClone(baseline);transform(d);assert.throws(()=>validate(d));
}
assert.match(csvText([{...fixture[0],label:'=HYPERLINK("bad")'}]),/"'=HYPERLINK/);
console.log('PASS: baseline, care math, empty ledger, currency precision, monthly boundaries, filters, invalid imports, duplicate keys, and CSV formula protection.');
