export const SOURCES = ['Cold call', 'Referral', 'Other', 'Unknown'];
export function validate(data) {
  if (!data || data.schemaVersion !== 1 || !data.reported || !Array.isArray(data.projects)) throw Error('Use an Elevate backup with schemaVersion 1, reported, and projects.');
  if(typeof data.businessName !== 'string' || !data.businessName.trim() || data.businessName.length>100) throw Error('Business name must contain 1–100 characters.');
  if (!validDate(data.asOf)) throw Error('Snapshot date must be a valid YYYY-MM-DD date.');
  const r = data.reported;
  for(const key of ['completedProjects','collectedRevenueLowerBound','projectPriceMin','projectPriceMax','coldCalledCompaniesLowerBound','careMonthlyPrice']) {
    if(typeof r[key] !== 'number' || !Number.isFinite(r[key]) || r[key]<0 || r[key]>1e12) throw Error(`Invalid business value: ${key}.`);
  }
  if(!Number.isInteger(r.completedProjects)||!Number.isInteger(r.coldCalledCompaniesLowerBound)||r.projectPriceMin>r.projectPriceMax) throw Error('Check project counts, contacted companies, and price range.');
  if(typeof r.coldCallShareEstimate!=='number'||!Number.isFinite(r.coldCallShareEstimate)||r.coldCallShareEstimate<0||r.coldCallShareEstimate>1) throw Error('Estimated source share must be between 0 and 1.');
  if(!Array.isArray(r.careCohorts)||r.careCohorts.length>100||r.careCohorts.some(c=>!Number.isInteger(c.customers)||c.customers<0||c.customers>10000||!Number.isInteger(c.reportedMonths)||c.reportedMonths<0||c.reportedMonths>1200)) throw Error('Care cohorts need nonnegative whole customer and month counts.');
  if(data.projects.length>10000) throw Error('Maximum 10,000 project records.');
  const seen=new Set();
  for(const p of data.projects) {
    if(typeof p.id!=='string'||!p.id.trim()||p.id.length>80||seen.has(p.id)) throw Error('Each project needs a unique ID of 1–80 characters.');
    seen.add(p.id);
    if(typeof p.label!=='string'||!p.label.trim()||p.label.length>100) throw Error('Each project needs a label of 1–100 characters.');
    if(typeof p.amount!=='number'||!Number.isFinite(p.amount)||p.amount<0||p.amount>1e9||Math.abs(p.amount*100-Math.round(p.amount*100))>0.0001) throw Error('Collected amounts must be valid nonnegative USD amounts, to cents.');
    if(!validDate(p.date)||p.date>data.asOf) throw Error('Collection dates must be valid and on or before the snapshot.');
    if(!SOURCES.includes(p.source)) throw Error('Project source must be Cold call, Referral, Other, or Unknown.');
  }
  return data;
}
export function validDate(s) {
  return typeof s==='string' && /^\d{4}-\d{2}-\d{2}$/.test(s) && Number.isFinite(Date.parse(s)) && new Date(s+'T00:00:00Z').toISOString().slice(0,10)===s;
}
export function careMetrics(r) {
  const customers=r.careCohorts.reduce((n,c)=>n+c.customers,0);
  return {customers, mrr:customers*r.careMonthlyPrice, annualRunRate:customers*r.careMonthlyPrice*12,
    scheduled:r.careCohorts.reduce((n,c)=>n+c.customers*c.reportedMonths*r.careMonthlyPrice,0)};
}
export function projectMetrics(projects) {
  const totalCents=projects.reduce((n,p)=>n+Math.round(p.amount*100),0);
  return {count:projects.length,total:totalCents/100,average:projects.length?totalCents/100/projects.length:null};
}
export function monthlyTotals(projects) {
  const map=new Map();
  for(const p of projects) map.set(p.date.slice(0,7),(map.get(p.date.slice(0,7))||0)+Math.round(p.amount*100));
  if(!map.size)return [];
  const keys=[...map.keys()].sort(); const cursor=new Date(keys[0]+'-01T00:00:00Z'),end=keys.at(-1);
  const result=[];
  while(cursor.toISOString().slice(0,7)<=end){const month=cursor.toISOString().slice(0,7);result.push({month,total:(map.get(month)||0)/100});cursor.setUTCMonth(cursor.getUTCMonth()+1);}
  return result;
}
export function filterProjects(projects,source,year){return projects.filter(p=>(source==='All'||p.source===source)&&(year==='All'||p.date.startsWith(year)));}
export function csvText(projects){
  const quote=v=>'"'+String(v).replaceAll('"','""')+'"';
  // Prevent spreadsheet formula execution for user-entered text labels.
  const safe=v=>/^[=+@\-\t\r]/.test(String(v))?"'"+v:v;
  return 'ProjectID,AnonymousLabel,CollectedUSD,CollectionDate,LeadSource\r\n'+projects.map(p=>[safe(p.id),safe(p.label),p.amount.toFixed(2),p.date,p.source].map(quote).join(',')).join('\r\n');
}
