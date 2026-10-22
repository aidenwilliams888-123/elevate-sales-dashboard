// Rows generated here were subsequently confirmed by the owner to match their figures.
// Provenance: reconstructed rows, owner-confirmed figures; not imported original records.
export function makeDemo(){
 const rows=[], prices=[1200,1250,1300,1350,1400,1450,1500,1500,1550,1600,1650,1700,1750,1800,1850,1900,2000];
 const closeMonths=[3,4,4,5,5,5,6,6,6,7,7,7,8,8,9,9,10];let winIndex=0;
 for(const [source,n,reached,interested,quoted,wins] of [['Cold call',1150,320,90,35,14],['Referral',50,40,20,10,3]]){
  for(let i=0;i<n;i++){
   const won=i<wins,contacted=i<reached,qualified=i<interested,proposal=i<quoted;
   let created=new Date(Math.min(Date.UTC(2026,9,15),Date.UTC(2026,(i*7+(source==='Referral'?3:0))%10,1+(i*11)%25)));
   let close=null,amount=0,cycle=null,care=false;
   if(won){cycle=12+(winIndex*7)%34;close=new Date(Date.UTC(2026,closeMonths[winIndex]-1,5+(winIndex*3)%18));created=new Date(close.valueOf()-cycle*86400000);amount=prices[winIndex];care=[2,5,9,13,16].includes(winIndex);winIndex++;}
   const lost=!won && (proposal?i%3===0:qualified?i%4===0:contacted?i%3!==0:i%4!==0);
   const stage=won?'Won':lost?'Lost':proposal?'Proposal':qualified?'Qualified':contacted?'Contacted':'New';
   const lastContact=new Date(Math.min(Date.UTC(2026,9,15),created.valueOf()+(3+(i*5)%42)*86400000));
   const nextAction=new Date(lastContact.valueOf()+(3+i%8)*86400000);
   rows.push({id:`REC-${rows.length+1}`,...{source,stage,contacted,qualified,proposal,care},created:created.toISOString().slice(0,10),close:close?.toISOString().slice(0,10)||null,amount,cycle,quote:won?amount:1200+(i*53)%801,lastContact:lastContact.toISOString().slice(0,10),nextAction:nextAction.toISOString().slice(0,10),lostReason:lost?(!contacted?'No response':!qualified?'Not interested':['Budget','Timing','Chose another provider'][i%3]):null,dataStatus:'RECONSTRUCTED_OWNER_CONFIRMED'});
  }
 }
 return rows;
}
export const ratio=(a,b)=>b?a/b:null;
export function analyze(rows){
 const wins=rows.filter(r=>r.stage==='Won'),lost=rows.filter(r=>r.stage==='Lost'),open=rows.filter(r=>!['Won','Lost'].includes(r.stage));
 const qualified=open.filter(r=>['Qualified','Proposal'].includes(r.stage)),revenue=wins.reduce((n,r)=>n+r.amount,0),care=wins.filter(r=>r.care).length;
 const funnel=[['Prospects',rows.length],['Reached',rows.filter(r=>r.contacted).length],['Interested',rows.filter(r=>r.qualified).length],['Quoted',rows.filter(r=>r.proposal).length],['Won',wins.length]];
 return {count:rows.length,wins:wins.length,lost:lost.length,open:open.length,revenue,average:ratio(revenue,wins.length),conversion:ratio(wins.length,rows.length),quoteWin:ratio(wins.length,funnel[3][1]),closedWin:ratio(wins.length,wins.length+lost.length),cycle:ratio(wins.reduce((n,r)=>n+r.cycle,0),wins.length),care,careRate:ratio(care,wins.length),funnel,qualifiedOpen:qualified.length,pipeline:qualified.reduce((n,r)=>n+r.quote,0),weighted:qualified.reduce((n,r)=>n+r.quote*(r.stage==='Proposal'?.5:.2),0),overdue:qualified.filter(r=>r.nextAction<'2026-10-22').length,leadsPerWin:ratio(rows.length,wins.length)};
}
export function scenario(p){
 for(const [k,v]of Object.entries(p))if(!Number.isFinite(v)||v<0)throw Error(`Invalid scenario value: ${k}`);
 if(p.conversion>1||p.careRate>1||!p.hoursPerProject)throw Error('Rates must be 0–100% and project hours must be positive.');
 const demand=p.prospects*p.conversion,capacity=p.deliveryHours/p.hoursPerProject,projects=Math.min(demand,capacity),revenue=projects*p.price,cost=projects*p.directCost+p.fixedCosts,contribution=revenue-cost,careMRR=projects*p.careRate*p.carePrice,hours=projects*p.hoursPerProject+p.prospects*p.minutesPerContact/60;
 return {demand,capacity,projects,revenue,cost,contribution,careMRR,hours,hourly:ratio(contribution,hours),capacityLimited:demand>capacity};
}
