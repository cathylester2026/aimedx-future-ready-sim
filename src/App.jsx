import React, { useMemo, useState } from "react";

const RESOURCES = ["capital", "workforce", "time", "influence"];
const LABELS = { capital: "Capital", workforce: "Workforce", time: "Time", influence: "Influence" };
const OUTCOMES = ["patient", "workforce", "operations", "financial", "adaptability", "design"];

const PERSONAS = {
  rural: { name: "Distributed Rural Health Network", mission: "Extend reliable access while strengthening the network as one connected care system.", tension: "Improve access now without creating a fragile or disconnected operating model.", resources: { capital: 4, workforce: 3, time: 1, influence: 3 } },
  academic: { name: "Aging Academic Medical Center", mission: "Modernize complex tertiary care, teaching, and research without disrupting critical operations.", tension: "Visible innovation competes with foundational renewal and limited change capacity.", resources: { capital: 4, workforce: 3, time: 1, influence: 3 } },
  community: { name: "Capital-Constrained Community Hospital", mission: "Make a small number of investments deliver visible clinical and operating value.", tension: "Every choice must work harder because funding and implementation capacity are limited.", resources: { capital: 2, workforce: 3, time: 3, influence: 2 } },
  greenfield: { name: "Greenfield Innovation Campus", mission: "Translate ambition into an integrated care model rather than a collection of products.", tension: "Move boldly without overbuilding technology or overlooking operating-model readiness.", resources: { capital: 5, workforce: 2, time: 2, influence: 3 } }
};

const INVESTMENTS = [
  { id:"ai-doc", name:"AI Clinical Documentation", category:"Technology + Data", description:"Reduce documentation burden through AI-assisted notes.", cost:{capital:1,workforce:1}, impact:{workforce:2,operations:1}, supports:["training","governance"], need:1, debt:1 },
  { id:"virtual-nursing", name:"Virtual Nursing", category:"Care Model + Access", description:"Extend nursing capacity through a coordinated remote-care model.", cost:{capital:1,workforce:1,time:1}, impact:{patient:1,workforce:2,operations:1}, supports:["smart-rooms","infrastructure","workflow","training"], need:2, debt:2 },
  { id:"smart-rooms", name:"Smart Patient Rooms", category:"Environment + Place", description:"Create responsive rooms supporting patients, staff, and virtual care.", cost:{capital:2,time:1}, impact:{patient:2,workforce:1,adaptability:1,design:2}, supports:["infrastructure","workflow"], need:2, debt:2 },
  { id:"command", name:"Enterprise Command Center", category:"Operations + Analytics", description:"Coordinate capacity, flow, and network-level decisions.", cost:{capital:1,time:1,influence:1}, impact:{operations:3,financial:1,adaptability:1}, supports:["workflow","governance","infrastructure"], need:2, debt:2 },
  { id:"infrastructure", name:"Digital Infrastructure", category:"Foundation", description:"Strengthen wireless, integration, power, and cybersecurity foundations.", cost:{capital:2}, impact:{operations:1,adaptability:2,design:1} },
  { id:"training", name:"Workforce Training + Adoption", category:"Foundation", description:"Build the capability to adopt new workflows and technologies.", cost:{workforce:1,time:1}, impact:{workforce:2,operations:1,adaptability:1} },
  { id:"workflow", name:"Workflow Redesign", category:"Foundation", description:"Redesign work before layering on new tools and spaces.", cost:{workforce:1,time:1}, impact:{patient:1,workforce:1,operations:2,design:1} },
  { id:"governance", name:"Data + AI Governance", category:"Foundation", description:"Create responsible guardrails, decision rights, and data stewardship.", cost:{time:1,influence:1}, impact:{patient:1,adaptability:1} },
  { id:"remote", name:"Remote Monitoring", category:"Care Model + Access", description:"Shift appropriate monitoring beyond conventional care settings.", cost:{capital:1,influence:1}, impact:{patient:2,operations:1,financial:1,adaptability:1}, supports:["infrastructure","workflow"], need:1, debt:1 },
  { id:"flex", name:"Flexible Care Environments", category:"Environment + Place", description:"Create adaptable spaces that respond to changing care models.", cost:{capital:2,time:1}, impact:{patient:1,operations:1,adaptability:3,design:3}, supports:["workflow"], need:1, debt:1 },
  { id:"collaboration", name:"Staff Collaboration + Restoration", category:"Workforce + Culture", description:"Support team connection, restoration, and resilient daily work.", cost:{capital:1,workforce:1}, impact:{workforce:3,design:1} },
  { id:"virtual-care", name:"Virtual Care Ecosystem", category:"Care Model + Ecosystem", description:"Connect sites, homes, and specialists through a network care model.", cost:{capital:1,workforce:1,influence:1}, impact:{patient:3,workforce:1,operations:1,financial:1,adaptability:2}, supports:["infrastructure","workflow","governance"], need:2, debt:2 }
];

const CRISES = {
  workforce:{name:"The Workforce Cliff", text:"Vacancies rise while demand remains high.", helpful:["virtual-nursing","training","workflow","ai-doc","collaboration"]},
  digital:{name:"Digital System Disruption", text:"A major outage disrupts visibility and coordination.", helpful:["infrastructure","governance","command"]},
  surge:{name:"Regional Demand Surge", text:"Demand increases unevenly across the network.", helpful:["command","virtual-nursing","remote","flex","workflow","infrastructure"]}
};

const makeTeam = (id,name,persona) => ({id,name,persona,round:1,selected:[],round1:null,round2:null,locked:false,crisis:""});

function spent(selected){
  const x={capital:0,workforce:0,time:0,influence:0};
  INVESTMENTS.filter(i=>selected.includes(i.id)).forEach(i=>RESOURCES.forEach(k=>x[k]+=i.cost[k]||0));
  return x;
}

function score(selected, crisis=""){
  const set=new Set(selected), values=Object.fromEntries(OUTCOMES.map(k=>[k,0])), gaps=[];
  let debt=0;
  INVESTMENTS.filter(i=>set.has(i.id)).forEach(i=>{
    Object.entries(i.impact).forEach(([k,v])=>values[k]+=v);
    if(i.need){
      const enabled=i.supports.filter(id=>set.has(id)).length;
      if(enabled<i.need){ debt+=i.debt; gaps.push(`${i.name} needs ${i.need} supporting investment${i.need>1?"s":""}.`); }
    }
  });
  const foundations=["infrastructure","training","workflow","governance"].filter(id=>set.has(id)).length;
  const transformers=["virtual-nursing","smart-rooms","command","virtual-care"].filter(id=>set.has(id)).length;
  if(transformers>=2&&foundations===0){debt+=2;gaps.push("Multiple transformative investments have no enabling foundation.");}
  const resilience=crisis?selected.filter(id=>CRISES[crisis].helpful.includes(id)).length*2+Math.min(foundations,2):0;
  return {values,debt,resilience,total:Object.values(values).reduce((a,b)=>a+b,0)+resilience-debt,gaps};
}

export default function App(){
  const [teams,setTeams]=useState([makeTeam(1,"Team 1","rural"),makeTeam(2,"Team 2","academic"),makeTeam(3,"Team 3","community"),makeTeam(4,"Team 4","greenfield")]);
  const [activeId,setActiveId]=useState(1),[view,setView]=useState("board");
  const team=teams.find(t=>t.id===activeId), persona=PERSONAS[team.persona], used=spent(team.selected);
  const remaining=Object.fromEntries(RESOURCES.map(k=>[k,persona.resources[k]-used[k]]));
  const over=RESOURCES.some(k=>remaining[k]<0), result=score(team.selected,team.crisis);
  const update=patch=>setTeams(ts=>ts.map(t=>t.id===activeId?{...t,...patch}:t));
  const toggle=id=>{if(!team.locked)update({selected:team.selected.includes(id)?team.selected.filter(x=>x!==id):[...team.selected,id]});};
  const lock=()=>{if(over||!team.selected.length||team.locked)return;const snap={selected:[...team.selected],...score(team.selected)};team.round===1?update({round1:snap,round:2}):update({round2:snap,locked:true});};
  const reset=()=>setTeams(ts=>ts.map(t=>t.id===activeId?makeTeam(t.id,t.name,t.persona):t));
  const leaders=useMemo(()=>teams.map(t=>({...t,result:score(t.selected,t.crisis)})).sort((a,b)=>b.result.total-a.result.total),[teams]);

  return <><style>{css}</style><div className="app">
    <header><div><b>AIMedX</b><h1>Future-Ready Hospital Challenge</h1><p>Build the system. Expose the trade-offs.</p></div><div className="headerActions"><select value={activeId} onChange={e=>setActiveId(Number(e.target.value))}>{teams.map(t=><option key={t.id} value={t.id}>{t.name}</option>)}</select><span>Round {team.round}</span><button onClick={()=>setView(view==="board"?"leaders":"board")}>{view==="board"?"Leaderboard":"Team Board"}</button></div></header>
    {view==="leaders"?<main className="leaders"><h2>Leaderboard</h2>{leaders.map((t,i)=><article key={t.id}><strong>#{i+1}</strong><div><b>{t.name}</b><small>{PERSONAS[t.persona].name}</small></div><Metric label="Total" value={t.result.total}/><Metric label="Debt" value={t.result.debt}/><Metric label="Resilience" value={t.result.resilience}/></article>)}</main>:<main>
      <section className="top">
        <div className="panel"><label>Persona</label><select value={team.persona} onChange={e=>update({persona:e.target.value,selected:[],round:1,round1:null,round2:null,locked:false,crisis:""})}>{Object.entries(PERSONAS).map(([k,p])=><option key={k} value={k}>{p.name}</option>)}</select><h2>{persona.name}</h2><h3>Mission</h3><p>{persona.mission}</p><h3>Strategic Tension</h3><p>{persona.tension}</p></div>
        <div className="panel"><label>Available Capacity</label><h2>Resource Reservoir</h2>{RESOURCES.map(k=><div className="resource" key={k}><span>{LABELS[k]}</span><strong className={remaining[k]<0?"bad":""}>{remaining[k]} / {persona.resources[k]}</strong><i><em style={{width:`${Math.min(100,used[k]/persona.resources[k]*100)}%`}}/></i></div>)}{over&&<p className="warning">Resource limit exceeded.</p>}</div>
        <div className="panel"><label>Round {team.round}</label><h2>Live Tally</h2><div className="metrics">{OUTCOMES.map(k=><Metric key={k} label={k} value={result.values[k]}/>)}</div><div className="metrics summary"><Metric label="Resilience" value={result.resilience}/><Metric label="Future Debt" value={result.debt}/><Metric label="Total" value={result.total}/></div><p className={result.gaps.length?"warning":"success"}>{result.gaps[0]||"No current strategy gaps."}</p></div>
      </section>
      <section className="controls"><div><label>Build the Portfolio</label><h2>Investment Marketplace</h2></div><div><button onClick={reset}>Reset Team</button><button className="primary" disabled={over||!team.selected.length||team.locked} onClick={lock}>{team.round===1?"Lock Round 1 + Continue":"Lock Round 2"}</button></div></section>
      <section className="grid">{INVESTMENTS.map(i=>{const selected=team.selected.includes(i.id),cost=Object.values(i.cost).reduce((a,b)=>a+b,0);return <article className={selected?"card selected":"card"} key={i.id}><div><label>{i.category}</label><b>{cost} tokens</b></div><h3>{i.name}</h3><p>{i.description}</p><small>{Object.entries(i.cost).map(([k,v])=>`${LABELS[k]} ${v}`).join(" | ")}</small><button onClick={()=>toggle(i.id)}>{selected?"Selected":"Select"}</button></article>})}</section>
      {team.locked&&<section className="crisis panel"><div><label>Stress Test</label><h2>{team.crisis?CRISES[team.crisis].name:"Reveal a Crisis"}</h2>{team.crisis&&<p>{CRISES[team.crisis].text}</p>}</div>{!team.crisis?<div>{Object.entries(CRISES).map(([k,c])=><button key={k} onClick={()=>update({crisis:k})}>{c.name}</button>)}</div>:<Metric label="Resilience" value={result.resilience}/>}</section>}
    </main>}
  </div></>;
}

function Metric({label,value}){return <div className="metric"><small>{label}</small><strong>{value}</strong></div>;}

const css=`
*{box-sizing:border-box}body{margin:0;font-family:Inter,Segoe UI,Arial,sans-serif;background:#edf4f7;color:#12304a}.app{min-height:100vh}header{display:flex;justify-content:space-between;align-items:center;padding:14px 24px;background:linear-gradient(100deg,#071f3b,#0e4768);color:white;border-bottom:4px solid #42c9ed}header b{color:#54d5f2;font-size:26px}header h1{margin:2px 0;font-size:24px}header p{margin:0;color:#c8dbe5}.headerActions{display:flex;gap:8px;align-items:center}.headerActions select,.headerActions button,.headerActions span,button,select{padding:9px 11px;border:1px solid #aac0cc;border-radius:7px;font:inherit}.headerActions select,.headerActions button,.headerActions span{background:#0b2e4d;color:white}.top{display:grid;grid-template-columns:1.1fr .9fr 1.2fr;gap:10px;padding:10px}.panel{background:white;border:1px solid #cfdee6;border-radius:10px;padding:14px;box-shadow:0 3px 10px #10304612}.panel label,.controls label,.card label{color:#1680ad;font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:1px}.panel h2,.controls h2{margin:5px 0 10px}.panel h3{font-size:13px;margin:9px 0 2px}.panel p{font-size:13px;color:#4d6678}.panel>select{width:100%;margin:6px 0}.resource{display:grid;grid-template-columns:1fr auto;gap:5px;margin:12px 0}.resource i{grid-column:1/-1;height:8px;border-radius:9px;background:#e4edf1;overflow:hidden}.resource em{display:block;height:100%;background:#2e9bd2}.bad{color:#c22}.metrics{display:grid;grid-template-columns:repeat(3,1fr);gap:6px}.summary{margin-top:6px}.metric{background:#edf5f8;border:1px solid #d4e2e8;border-radius:7px;text-align:center;padding:7px;text-transform:capitalize}.metric small{display:block;color:#5e7486}.metric strong{font-size:18px}.warning,.success{padding:8px;border-radius:7px}.warning{background:#fff0d8;color:#8f5707}.success{background:#e5f6ea;color:#19743c}.controls{display:flex;justify-content:space-between;align-items:center;background:#0a3152;color:white;padding:9px 24px}.controls>div:last-child{display:flex;gap:8px}.primary{background:#43c9eb;color:#082942;font-weight:800}.primary:disabled{opacity:.45}.grid{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;padding:12px 24px}.card{background:white;border:1px solid #d0dfe6;border-left:4px solid #248fc1;border-radius:9px;padding:12px;min-height:180px;display:flex;flex-direction:column}.card.selected{border:2px solid #17b6d0;background:#f2fcfe}.card>div{display:flex;justify-content:space-between}.card h3{margin:10px 0 5px}.card p{font-size:12px;color:#4d6678}.card small{margin-top:auto}.card button{margin-top:10px}.crisis{margin:0 24px 18px;display:flex;justify-content:space-between;align-items:center}.crisis>div:last-child{display:flex;gap:7px}.leaders{padding:24px}.leaders article{display:grid;grid-template-columns:50px 1fr repeat(3,110px);gap:10px;align-items:center;background:white;padding:13px;border:1px solid #d0dfe6;border-radius:9px;margin:9px 0}.leaders article>div:nth-child(2){display:grid}.leaders small{color:#60788a}@media(max-width:1100px){.top{grid-template-columns:1fr 1fr}.top .panel:last-child{grid-column:1/-1}.grid{grid-template-columns:repeat(3,1fr)}}@media(max-width:760px){header,.controls,.crisis{align-items:flex-start;flex-direction:column;gap:10px}.top{grid-template-columns:1fr}.top .panel:last-child{grid-column:auto}.grid{grid-template-columns:repeat(2,1fr)}}@media(max-width:500px){.grid{grid-template-columns:1fr}.headerActions{flex-wrap:wrap}.leaders article{grid-template-columns:40px 1fr}.leaders .metric{display:none}}
`;
