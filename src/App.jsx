import React, { useMemo, useState } from "react";

const RESOURCE_KEYS = ["capital", "workforce", "time", "influence"];
const RESOURCE_LABELS = { capital: "Capital", workforce: "Workforce", time: "Time", influence: "Influence" };
const OUTCOME_KEYS = ["patient", "workforce", "operations", "financial", "adaptability", "design"];
const OUTCOME_LABELS = { patient: "Patient + Experience", workforce: "Workforce", operations: "Operations", financial: "Financial", adaptability: "Adaptability", design: "Design + Place" };
const OUTCOME_TARGETS = { patient: 5, workforce: 5, operations: 6, financial: 3, adaptability: 6, design: 5 };

const PERSONAS = {
  rural: {
    name: "Distributed Rural Health Network",
    mission: "Extend reliable access while strengthening the network as one connected care system.",
    tension: "Improve access now without creating a fragile or disconnected operating model.",
    condition: "Multiple small sites, long travel distances, uneven digital maturity, and limited specialist coverage.",
    design: "The network must work across different buildings, communities, and infrastructure conditions.",
    resources: { capital: 4, workforce: 3, time: 2, influence: 3 },
    priorities: { patient: 3, operations: 3, adaptability: 2, workforce: 2, financial: 1, design: 1 },
    labels: { patient: "Access + Experience", operations: "Network Coordination", adaptability: "Scalability", workforce: "Workforce Reach", financial: "Financial Sustainability", design: "Place + Infrastructure" },
  },
  academic: {
    name: "Aging Academic Medical Center",
    mission: "Modernize complex tertiary care, teaching, and research without disrupting critical operations.",
    tension: "Visible innovation competes with foundational renewal and limited change capacity.",
    condition: "High-acuity services operate within aging infrastructure and complex governance.",
    design: "Legacy buildings and systems constrain sequencing and future flexibility.",
    resources: { capital: 4, workforce: 3, time: 2, influence: 3 },
    priorities: { operations: 3, adaptability: 3, workforce: 2, design: 2, patient: 1, financial: 1 },
    labels: { patient: "Patient Experience", operations: "Complex Operations", adaptability: "Future Flexibility", workforce: "Workforce Readiness", financial: "Financial Sustainability", design: "Legacy Renewal" },
  },
  community: {
    name: "Capital-Constrained Community Hospital",
    mission: "Make a small number of investments deliver visible clinical and operating value.",
    tension: "Every choice must work harder because funding and implementation capacity are limited.",
    condition: "A trusted local hospital with tight margins and selective renewal needs.",
    design: "An enabling investment may matter more than a highly visible technology purchase.",
    resources: { capital: 2, workforce: 3, time: 3, influence: 2 },
    priorities: { financial: 3, operations: 3, workforce: 2, patient: 2, adaptability: 1, design: 1 },
    labels: { patient: "Visible Patient Value", operations: "Operational Value", adaptability: "Future Flexibility", workforce: "Workforce Stability", financial: "Financial Value", design: "Selective Renewal" },
  },
  greenfield: {
    name: "Greenfield Innovation Campus",
    mission: "Translate ambition into an integrated care model rather than a collection of products.",
    tension: "Move boldly without overbuilding technology or overlooking operating-model readiness.",
    condition: "A new-build opportunity with executive ambition and fewer legacy constraints.",
    design: "Early decisions can embed adaptability, infrastructure, and new workflows from the start.",
    resources: { capital: 5, workforce: 2, time: 2, influence: 3 },
    priorities: { adaptability: 3, patient: 2, operations: 2, design: 2, workforce: 1, financial: 1 },
    labels: { patient: "Connected Experience", operations: "Integrated Operations", adaptability: "Future Adaptability", workforce: "Workforce Enablement", financial: "Financial Sustainability", design: "Campus + Place" },
  },
};

const INVESTMENTS = [
  { id: "ai-doc", category: "Technology + Data", name: "AI Clinical Documentation", description: "Reduce documentation burden through AI-assisted notes.", cost: { capital: 1, workforce: 1 }, impact: { workforce: 2, operations: 1 }, supports: ["training", "governance"], requiredSupports: 1, debt: 1 },
  { id: "virtual-nursing", category: "Care Model + Access", name: "Virtual Nursing", description: "Extend nursing capacity through a coordinated remote-care model.", cost: { capital: 1, workforce: 1, time: 1 }, impact: { patient: 1, workforce: 2, operations: 1 }, supports: ["smart-rooms", "infrastructure", "workflow", "training"], requiredSupports: 2, debt: 2 },
  { id: "smart-rooms", category: "Environment + Place", name: "Smart Patient Rooms", description: "Create responsive rooms supporting patients, staff, and virtual care.", cost: { capital: 2, time: 1 }, impact: { patient: 2, workforce: 1, adaptability: 1, design: 2 }, supports: ["infrastructure", "workflow"], requiredSupports: 2, debt: 2 },
  { id: "command", category: "Operations + Analytics", name: "Enterprise Command Center", description: "Coordinate capacity, flow, and network-level decisions.", cost: { capital: 1, time: 1, influence: 1 }, impact: { operations: 3, financial: 1, adaptability: 1 }, supports: ["workflow", "governance", "infrastructure"], requiredSupports: 2, debt: 2 },
  { id: "infrastructure", category: "Foundation", name: "Digital Infrastructure", description: "Strengthen wireless, integration, power, and cybersecurity foundations.", cost: { capital: 2 }, impact: { operations: 1, adaptability: 2, design: 1 } },
  { id: "training", category: "Foundation", name: "Workforce Training + Adoption", description: "Build the capability to adopt new workflows and technologies.", cost: { workforce: 1, time: 1 }, impact: { workforce: 2, operations: 1, adaptability: 1 } },
  { id: "workflow", category: "Foundation", name: "Workflow Redesign", description: "Redesign work before layering on new tools and spaces.", cost: { workforce: 1, time: 1 }, impact: { patient: 1, workforce: 1, operations: 2, design: 1 } },
  { id: "governance", category: "Foundation", name: "Data + AI Governance", description: "Create responsible guardrails, decision rights, and data stewardship.", cost: { time: 1, influence: 1 }, impact: { patient: 1, adaptability: 1 } },
  { id: "remote", category: "Care Model + Access", name: "Remote Monitoring", description: "Shift appropriate monitoring beyond conventional care settings.", cost: { capital: 1, influence: 1 }, impact: { patient: 2, operations: 1, financial: 1, adaptability: 1 }, supports: ["infrastructure", "workflow"], requiredSupports: 1, debt: 1 },
  { id: "flex", category: "Environment + Place", name: "Flexible Care Environments", description: "Create adaptable spaces that respond to changing care models.", cost: { capital: 2, time: 1 }, impact: { patient: 1, operations: 1, adaptability: 3, design: 3 }, supports: ["workflow"], requiredSupports: 1, debt: 1 },
  { id: "collaboration", category: "Workforce + Culture", name: "Staff Collaboration + Restoration", description: "Support team connection, restoration, and resilient daily work.", cost: { capital: 1, workforce: 1 }, impact: { workforce: 3, design: 1 } },
  { id: "virtual-care", category: "Care Model + Ecosystem", name: "Virtual Care Ecosystem", description: "Connect sites, homes, and specialists through a network care model.", cost: { capital: 1, workforce: 1, influence: 1 }, impact: { patient: 3, workforce: 1, operations: 1, financial: 1, adaptability: 2 }, supports: ["infrastructure", "workflow", "governance"], requiredSupports: 2, debt: 2 },
];
const INVESTMENT_BY_ID = Object.fromEntries(INVESTMENTS.map((item) => [item.id, item]));
const FOUNDATION_IDS = ["infrastructure", "training", "workflow", "governance"];
const TRANSFORMER_IDS = ["virtual-nursing", "smart-rooms", "command", "virtual-care"];
const CRISES = {
  workforce: { name: "The Workforce Cliff", description: "Vacancies rise while demand remains high.", helpful: ["virtual-nursing", "training", "workflow", "ai-doc", "collaboration"] },
  digital: { name: "Digital System Disruption", description: "A major outage disrupts visibility and coordination.", helpful: ["infrastructure", "governance", "command"] },
  surge: { name: "Regional Demand Surge", description: "Demand increases unevenly across the network.", helpful: ["command", "virtual-nursing", "remote", "flex", "workflow", "infrastructure"] },
};

function makeTeam(id, name, persona) {
  return { id, name, persona, round: 1, selected: [], round1: null, round2: null, locked: false, crisisKey: "", sponsorDecisionPending: false, sponsorUsed: false, sponsorChoice: "", sponsorSkipped: false };
}
function calculateSpent(selected) {
  return Object.fromEntries(RESOURCE_KEYS.map((key) => [key, selected.reduce((sum, id) => sum + (INVESTMENT_BY_ID[id].cost[key] || 0), 0)]));
}
function getSupportStatus(item, selectedSet) {
  if (!item.requiredSupports) return null;
  const selected = item.supports.filter((id) => selectedSet.has(id));
  const missing = item.supports.filter((id) => !selectedSet.has(id));
  return { selected, missing, satisfied: selected.length >= item.requiredSupports };
}
function getEffectiveResources(team) {
  const resources = { ...PERSONAS[team.persona].resources };
  if (team.sponsorUsed && RESOURCE_KEYS.includes(team.sponsorChoice)) resources[team.sponsorChoice] += 1;
  return resources;
}
function calculatePortfolio(selected, crisisKey = "", debtCredit = 0) {
  const selectedSet = new Set(selected);
  const outcomes = Object.fromEntries(OUTCOME_KEYS.map((key) => [key, 0]));
  const gaps = [];
  let rawDebt = 0;
  selected.forEach((id) => {
    const item = INVESTMENT_BY_ID[id];
    Object.entries(item.impact).forEach(([key, value]) => { outcomes[key] += value; });
    const status = getSupportStatus(item, selectedSet);
    if (status && !status.satisfied) {
      rawDebt += item.debt;
      gaps.push({ name: item.name, required: item.requiredSupports, selectedCount: status.selected.length, missingNames: status.missing.map((supportId) => INVESTMENT_BY_ID[supportId].name), debt: item.debt });
    }
  });
  const foundations = FOUNDATION_IDS.filter((id) => selectedSet.has(id)).length;
  if (TRANSFORMER_IDS.filter((id) => selectedSet.has(id)).length >= 2 && foundations === 0) {
    rawDebt += 2;
    gaps.push({ name: "Portfolio foundation", required: 1, selectedCount: 0, missingNames: FOUNDATION_IDS.map((id) => INVESTMENT_BY_ID[id].name), debt: 2 });
  }
  const futureDebt = Math.max(0, rawDebt - debtCredit);
  const resilience = crisisKey ? selected.filter((id) => CRISES[crisisKey].helpful.includes(id)).length * 2 + Math.min(foundations, 2) : 0;
  return { outcomes, gaps, rawDebt, debtCredit: Math.min(rawDebt, debtCredit), futureDebt, resilience, total: Object.values(outcomes).reduce((sum, value) => sum + value, 0) + resilience - futureDebt };
}
function coverageStatus(coverage) { return coverage >= 0.8 ? "Strong" : coverage >= 0.5 ? "Developing" : "Exposed"; }
function buildAssessment(personaKey, portfolio, remaining) {
  const persona = PERSONAS[personaKey];
  let weighted = 0;
  let totalWeight = 0;
  const dimensions = Object.entries(persona.priorities).map(([key, weight]) => {
    const coverage = Math.min(1, (portfolio.outcomes[key] || 0) / OUTCOME_TARGETS[key]);
    weighted += coverage * weight;
    totalWeight += weight;
    return { key, label: persona.labels[key], weight, coverage, status: coverageStatus(coverage) };
  });
  const fit = Math.round((weighted / totalWeight) * 100);
  const important = dimensions.filter((item) => item.weight >= 2);
  const strong = important.filter((item) => item.coverage >= 0.8).sort((a, b) => b.weight - a.weight || b.coverage - a.coverage).slice(0, 2);
  const strengths = strong.length ? strong : [[...important].sort((a, b) => b.coverage - a.coverage)[0]].filter(Boolean);
  const vulnerabilities = important.filter((item) => (item.weight === 3 && item.coverage < 0.5) || (item.weight >= 2 && item.coverage < 0.35)).sort((a, b) => b.weight - a.weight || a.coverage - b.coverage).slice(0, 2);
  const exhausted = RESOURCE_KEYS.filter((key) => remaining[key] === 0);
  const available = RESOURCE_KEYS.filter((key) => remaining[key] > 0);
  const tradeoff = strengths[0] && vulnerabilities[0] ? `The portfolio prioritizes ${strengths[0].label}, but accepts greater exposure in ${vulnerabilities[0].label}.` : strengths[0] ? `The portfolio establishes its clearest advantage in ${strengths[0].label}.` : "The portfolio remains broadly distributed without a clear strategic advantage.";
  const considerations = [];
  if (portfolio.futureDebt > 0) considerations.push("Resolve a support gap, accept the Future Debt, or replace an unsupported investment.");
  if (vulnerabilities[0]) considerations.push(`${vulnerabilities[0].label} is a persona priority but remains exposed.`);
  if (exhausted.length) considerations.push(`${exhausted.map((key) => RESOURCE_LABELS[key]).join(" and ")} ${exhausted.length > 1 ? "are" : "is"} fully committed; a new priority may require replacement.`);
  if (considerations.length < 3 && available.length) considerations.push(`Remaining ${available.map((key) => RESOURCE_LABELS[key]).join(", ")} capacity preserves flexibility.`);
  return { fit, label: fit >= 75 ? "Strong Persona Fit" : fit >= 55 ? "Partial Persona Fit" : "Weak Persona Fit", dimensions, strengths, vulnerabilities, tradeoff, considerations: considerations.slice(0, 3) };
}
function createSnapshot(team) {
  const resources = getEffectiveResources(team);
  const used = calculateSpent(team.selected);
  const remaining = Object.fromEntries(RESOURCE_KEYS.map((key) => [key, resources[key] - used[key]]));
  const debtCredit = team.sponsorUsed && team.sponsorChoice === "debt" ? 1 : 0;
  const portfolio = calculatePortfolio(team.selected, "", debtCredit);
  return { selected: [...team.selected], resources, used, remaining, ...portfolio, assessment: buildAssessment(team.persona, portfolio, remaining), sponsorChoice: team.sponsorChoice };
}
function compareRounds(round1, round2) {
  if (!round1 || !round2) return null;
  return { total: round2.total - round1.total, debt: round2.futureDebt - round1.futureDebt, fit: round2.assessment.fit - round1.assessment.fit, outcomes: Object.fromEntries(OUTCOME_KEYS.map((key) => [key, round2.outcomes[key] - round1.outcomes[key]])) };
}

export default function App() {
  const [teams, setTeams] = useState([makeTeam(1, "Team 1", "rural"), makeTeam(2, "Team 2", "academic"), makeTeam(3, "Team 3", "community"), makeTeam(4, "Team 4", "greenfield")]);
  const [activeTeamId, setActiveTeamId] = useState(1);
  const [view, setView] = useState("board");
  const [sponsorSelection, setSponsorSelection] = useState("time");
  const team = teams.find((item) => item.id === activeTeamId);
  const persona = PERSONAS[team.persona];
  const resources = getEffectiveResources(team);
  const used = calculateSpent(team.selected);
  const remaining = Object.fromEntries(RESOURCE_KEYS.map((key) => [key, resources[key] - used[key]]));
  const overLimit = RESOURCE_KEYS.some((key) => remaining[key] < 0);
  const debtCredit = team.sponsorUsed && team.sponsorChoice === "debt" ? 1 : 0;
  const portfolio = calculatePortfolio(team.selected, team.crisisKey, debtCredit);
  const selectedSet = new Set(team.selected);
  const neededSupportIds = new Set(team.selected.flatMap((id) => { const status = getSupportStatus(INVESTMENT_BY_ID[id], selectedSet); return status && !status.satisfied ? status.missing : []; }));
  const updateTeam = (patch) => setTeams((current) => current.map((item) => item.id === activeTeamId ? { ...item, ...patch } : item));
  const toggleInvestment = (id) => {
    if (team.locked || team.sponsorDecisionPending) return;
    updateTeam({ selected: team.selected.includes(id) ? team.selected.filter((item) => item !== id) : [...team.selected, id] });
  };
  const lockRound = () => {
    if (overLimit || team.selected.length === 0 || team.locked || team.sponsorDecisionPending) return;
    const snapshot = createSnapshot(team);
    if (team.round === 1) updateTeam({ round1: snapshot, round: 2, sponsorDecisionPending: true });
    else updateTeam({ round2: snapshot, locked: true });
  };
  const redeemSponsor = () => updateTeam({ sponsorUsed: true, sponsorChoice: sponsorSelection, sponsorDecisionPending: false });
  const skipSponsor = () => updateTeam({ sponsorSkipped: true, sponsorDecisionPending: false });
  const resetTeam = () => setTeams((current) => current.map((item) => item.id === activeTeamId ? makeTeam(item.id, item.name, item.persona) : item));
  const leaderboard = useMemo(() => teams.map((item) => ({ ...item, result: calculatePortfolio(item.selected, item.crisisKey, item.sponsorUsed && item.sponsorChoice === "debt" ? 1 : 0) })).sort((a, b) => b.result.total - a.result.total), [teams]);
  const roundChange = compareRounds(team.round1, team.round2);

  return <><style>{styles}</style><div className="app">
    <header className="header"><div><div className="brand">AIMedX</div><h1>Future-Ready Hospital Challenge</h1><p>Build the system. Expose the trade-offs.</p></div><div className="headerControls"><select value={activeTeamId} onChange={(event) => setActiveTeamId(Number(event.target.value))}>{teams.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select><span>Round {team.round}</span><button onClick={() => setView(view === "board" ? "leaderboard" : "board")}>{view === "board" ? "Leaderboard" : "Team Board"}</button></div></header>
    {view === "leaderboard" ? <main className="leaderboardPage"><h2>Leaderboard</h2>{leaderboard.map((item, index) => <article className="leaderRow" key={item.id}><strong>#{index + 1}</strong><div><b>{item.name}</b><small>{PERSONAS[item.persona].name}</small></div><Metric label="Total" value={item.result.total}/><Metric label="Future Debt" value={item.result.futureDebt}/><Metric label="Resilience" value={item.result.resilience}/></article>)}</main> : <main>
      <section className="topGrid"><article className="panel"><label>Persona</label><select value={team.persona} onChange={(event) => updateTeam({ persona: event.target.value, selected: [], round: 1, round1: null, round2: null, locked: false, crisisKey: "", sponsorDecisionPending: false, sponsorUsed: false, sponsorChoice: "", sponsorSkipped: false })}>{Object.entries(PERSONAS).map(([key, item]) => <option key={key} value={key}>{item.name}</option>)}</select><h2>{persona.name}</h2><h3>Mission</h3><p>{persona.mission}</p><h3>Strategic Tension</h3><p>{persona.tension}</p><details><summary>More details</summary><p><b>Starting condition:</b> {persona.condition}</p><p><b>Design reality:</b> {persona.design}</p></details></article>
      <article className="panel"><label>Available Capacity</label><h2>Resource Reservoir</h2>{RESOURCE_KEYS.map((key) => <div className="resource" key={key}><span>{RESOURCE_LABELS[key]}{team.sponsorUsed && team.sponsorChoice === key ? " + Sponsor" : ""}</span><b className={remaining[key] < 0 ? "danger" : ""}>{remaining[key]} / {resources[key]}</b><i><em style={{ width: `${Math.min(100, used[key] / resources[key] * 100)}%` }}/></i></div>)}{overLimit && <div className="warning">Resource limit exceeded. Remove an investment before locking the round.</div>}</article>
      <article className="panel"><label>Round {team.round}</label><h2>Live Tally</h2><div className="metrics">{OUTCOME_KEYS.map((key) => <Metric key={key} label={OUTCOME_LABELS[key]} value={portfolio.outcomes[key]}/>)}</div><div className="metrics"><Metric label="Resilience" value={portfolio.resilience}/><Metric label="Future Debt" value={portfolio.futureDebt}/><Metric label="Total" value={portfolio.total}/></div>{team.sponsorUsed && <div className="sponsorStatus">Sponsor Advantage: {team.sponsorChoice === "debt" ? "Future Debt -1" : `+1 ${RESOURCE_LABELS[team.sponsorChoice]}`}</div>}<div className={portfolio.gaps.length ? "warning gaps" : "success"}>{portfolio.gaps.length ? portfolio.gaps.map((gap, index) => <div key={index}><b>{gap.name}</b><span>{gap.selectedCount}/{gap.required} supports selected. Choose {gap.required - gap.selectedCount} from: {gap.missingNames.join(", ")}.</span></div>) : "No current strategy gaps."}</div></article></section>
      {team.round1 && <Assessment title="Round 1 Portfolio Assessment" snapshot={team.round1}/>} 
      {team.sponsorDecisionPending && <section className="sponsorPanel"><div><label>Stantec Sponsor Advantage</label><h2>Redeem before Round 2 decisions</h2><p>Present the physical Sponsor Advantage card, then choose one benefit. This decision is final and may be used only once.</p></div><div className="sponsorOptions">{[...RESOURCE_KEYS, "debt"].map((choice) => <label className={sponsorSelection === choice ? "selectedOption" : ""} key={choice}><input type="radio" name="sponsor" value={choice} checked={sponsorSelection === choice} onChange={(event) => setSponsorSelection(event.target.value)}/><span>{choice === "debt" ? "Reduce Future Debt by 1" : `+1 ${RESOURCE_LABELS[choice]}`}</span></label>)}</div><div className="sponsorButtons"><button className="primary" onClick={redeemSponsor}>Redeem Sponsor Advantage</button><button onClick={skipSponsor}>Continue Without Sponsor Card</button></div></section>}
      {team.round2 && <Assessment title="Round 2 Portfolio Assessment" snapshot={team.round2} change={roundChange}/>} 
      <section className="controls"><div><label>Build the Portfolio</label><h2>Investment Marketplace</h2></div><div><button onClick={resetTeam}>Reset Team</button><button className="primary" disabled={overLimit || team.selected.length === 0 || team.locked || team.sponsorDecisionPending} onClick={lockRound}>{team.round === 1 ? "Lock Round 1 + Continue" : "Lock Round 2"}</button></div></section>
      <section className={`investmentGrid ${team.sponsorDecisionPending ? "paused" : ""}`}>{INVESTMENTS.map((item) => { const selected = team.selected.includes(item.id); const status = getSupportStatus(item, selectedSet); const tokenCost = Object.values(item.cost).reduce((sum, value) => sum + value, 0); return <article className={`investment ${selected ? "selected" : ""} ${neededSupportIds.has(item.id) ? "needed" : ""}`} key={item.id}><div className="investmentTop"><label>{item.category}</label><b>{tokenCost} tokens</b></div><h3>{item.name}</h3><p>{item.description}</p>{status && <div className={`dependency ${status.satisfied ? "enabled" : ""}`}><b>{status.satisfied ? "Support enabled" : `Requires ${item.requiredSupports} of ${item.supports.length}`}</b><span>{item.supports.map((id) => `${selectedSet.has(id) ? "✓" : "○"} ${INVESTMENT_BY_ID[id].name}`).join(" · ")}</span>{selected && <small>{status.selected.length}/{item.requiredSupports} selected{status.satisfied ? "" : " · unmet support adds Future Debt"}</small>}</div>}{neededSupportIds.has(item.id) && <small className="neededTag">Supports a selected investment</small>}<small>{Object.entries(item.cost).map(([key, value]) => `${RESOURCE_LABELS[key]} ${value}`).join(" | ")}</small><button disabled={team.sponsorDecisionPending} onClick={() => toggleInvestment(item.id)}>{selected ? "Selected" : "Select"}</button></article>; })}</section>
      {team.locked && <section className="panel crisisPanel"><div><label>Stress Test</label><h2>{team.crisisKey ? CRISES[team.crisisKey].name : "Reveal a Crisis"}</h2>{team.crisisKey && <p>{CRISES[team.crisisKey].description}</p>}</div>{!team.crisisKey ? <div>{Object.entries(CRISES).map(([key, item]) => <button key={key} onClick={() => updateTeam({ crisisKey: key })}>{item.name}</button>)}</div> : <Metric label="Resilience" value={portfolio.resilience}/>}</section>}
    </main>}
  </div></>;
}

function Metric({ label, value }) { return <div className="metric"><small>{label}</small><b>{value}</b></div>; }
function Assessment({ title, snapshot, change }) {
  const assessment = snapshot.assessment;
  return <section className="assessment"><div className="assessmentHeader"><div><label>{title}</label><h2>{assessment.label}</h2></div><div className="fit"><small>Persona Fit</small><b>{assessment.fit}</b>{change && <span>{change.fit >= 0 ? "+" : ""}{change.fit}</span>}</div></div>{change && <div className="delta"><span>Total {change.total >= 0 ? "+" : ""}{change.total}</span><span>Future Debt {change.debt >= 0 ? "+" : ""}{change.debt}</span>{OUTCOME_KEYS.filter((key) => change.outcomes[key]).map((key) => <span key={key}>{OUTCOME_LABELS[key]} {change.outcomes[key] > 0 ? "+" : ""}{change.outcomes[key]}</span>)}</div>}<p className="tradeoff">{assessment.tradeoff}</p><div className="assessmentGrid"><div><h3>Persona Priorities</h3>{assessment.dimensions.filter((item) => item.weight >= 2).map((item) => <div className="priorityBar" key={item.key}><span>{item.label}</span><i><em style={{ width: `${item.coverage * 100}%` }}/></i><b className={item.status.toLowerCase()}>{item.status}</b></div>)}</div><div><h3>Strengths</h3>{assessment.strengths.map((item) => <p key={item.key}>✓ {item.label}</p>)}<h3>Vulnerabilities</h3>{assessment.vulnerabilities.length ? assessment.vulnerabilities.map((item) => <p key={item.key}>⚠ {item.label}</p>) : <p>No critical persona exposures.</p>}</div><div><h3>{change ? "Final Considerations" : "Before Round 2"}</h3>{assessment.considerations.map((item, index) => <p key={index}>• {item}</p>)}</div></div></section>;
}

const styles = `
*{box-sizing:border-box}body{margin:0;font-family:Inter,Segoe UI,Arial,sans-serif;background:#edf4f7;color:#12304a}.app{min-height:100vh}.header{display:flex;justify-content:space-between;align-items:center;padding:14px 24px;background:linear-gradient(100deg,#071f3b,#0e4768);color:white;border-bottom:4px solid #42c9ed}.brand{color:#54d5f2;font-size:28px;font-weight:900}.header h1{margin:2px 0;font-size:24px}.header p{margin:0;color:#c8dbe5}.headerControls{display:flex;gap:8px;align-items:center}.headerControls select,.headerControls button,.headerControls span,button,select{padding:9px 11px;border:1px solid #aac0cc;border-radius:7px;font:inherit}.headerControls select,.headerControls button,.headerControls span{background:#0b2e4d;color:white}.topGrid{display:grid;grid-template-columns:1.1fr .9fr 1.2fr;gap:10px;padding:10px}.panel{background:white;border:1px solid #cfdee6;border-radius:10px;padding:14px;box-shadow:0 3px 10px #10304612}.panel label,.controls label,.investment label,.assessment label,.sponsorPanel label:first-child{color:#1680ad;font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:1px}.panel h2,.controls h2{margin:5px 0 10px}.panel h3{font-size:13px;margin:9px 0 2px}.panel p{font-size:13px;color:#4d6678}.panel>select{width:100%;margin:6px 0}.resource{display:grid;grid-template-columns:1fr auto;gap:5px;margin:12px 0}.resource i{grid-column:1/-1;height:8px;border-radius:9px;background:#e4edf1;overflow:hidden}.resource em{display:block;height:100%;background:#2e9bd2}.danger{color:#c22}.metrics{display:grid;grid-template-columns:repeat(3,1fr);gap:6px;margin-bottom:6px}.metric{background:#edf5f8;border:1px solid #d4e2e8;border-radius:7px;text-align:center;padding:7px}.metric small{display:block;color:#5e7486}.metric b{font-size:18px}.warning,.success,.sponsorStatus{padding:8px;border-radius:7px;margin-top:7px}.warning{background:#fff0d8;color:#8f5707}.success{background:#e5f6ea;color:#19743c}.sponsorStatus{background:#e7f1fb;color:#174f83;font-size:12px;font-weight:800}.gaps div{display:grid;gap:2px;margin-bottom:5px}.controls{display:flex;justify-content:space-between;align-items:center;background:#0a3152;color:white;padding:9px 24px}.controls>div:last-child{display:flex;gap:8px}.primary{background:#43c9eb;color:#082942;font-weight:800}.primary:disabled{opacity:.45}.investmentGrid{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;padding:12px 24px}.investmentGrid.paused{opacity:.55;pointer-events:none}.investment{background:white;border:1px solid #d0dfe6;border-left:4px solid #248fc1;border-radius:9px;padding:12px;min-height:235px;display:flex;flex-direction:column}.investment.selected{border:2px solid #17b6d0;background:#f2fcfe}.investment.needed{box-shadow:0 0 0 3px #ee9d2255}.investmentTop{display:flex;justify-content:space-between}.investment h3{margin:10px 0 5px}.investment>p{font-size:12px;color:#4d6678}.investment>small{margin-top:auto}.investment button{margin-top:10px}.dependency{display:grid;gap:4px;padding:8px;border-radius:7px;background:#fff5e6;border:1px solid #f0cf9a;color:#80510c;font-size:10px;margin:3px 0 8px}.dependency.enabled{background:#e8f7ed;border-color:#b5dfc2;color:#176b38}.neededTag{color:#9a5b00;font-weight:800;text-transform:uppercase}.assessment{margin:0 10px 10px;background:white;border:1px solid #bcd4df;border-top:5px solid #27a8ce;border-radius:10px;padding:14px 18px}.assessmentHeader{display:flex;justify-content:space-between;align-items:center}.assessmentHeader h2{margin:3px 0}.fit{display:grid;text-align:center;background:#e8f7fc;border-radius:8px;padding:7px 14px}.fit b{font-size:26px}.fit span{color:#178044;font-weight:800}.tradeoff{background:#0b3152;color:white;padding:10px 12px;border-radius:7px;font-weight:700}.assessmentGrid{display:grid;grid-template-columns:1.2fr .8fr 1fr;gap:18px}.assessmentGrid h3{font-size:13px;margin:7px 0}.assessmentGrid p{margin:5px 0;font-size:12px}.priorityBar{display:grid;grid-template-columns:145px 1fr 75px;gap:8px;align-items:center;font-size:11px;margin:7px 0}.priorityBar i{height:8px;background:#e5edf1;border-radius:9px;overflow:hidden}.priorityBar em{height:100%;display:block;background:#2a9bce}.priorityBar>b{text-align:right}.strong{color:#168146}.developing{color:#a16708}.exposed{color:#be3030}.delta{display:flex;gap:7px;flex-wrap:wrap}.delta span{font-size:11px;background:#edf5f8;padding:5px 8px;border-radius:99px}.sponsorPanel{margin:0 10px 10px;background:linear-gradient(110deg,#fff9e9,#f1f8fb);border:2px solid #d6a83c;border-radius:10px;padding:16px 18px}.sponsorPanel h2{margin:3px 0 5px}.sponsorPanel p{font-size:13px;color:#4d6678}.sponsorOptions{display:grid;grid-template-columns:repeat(5,1fr);gap:8px;margin:12px 0}.sponsorOptions label{display:flex;align-items:center;gap:7px;background:white;border:1px solid #d8c58f;border-radius:8px;padding:10px;font-size:12px;font-weight:700}.sponsorOptions label.selectedOption{background:#fff0b8;border-color:#b88300;box-shadow:0 0 0 2px #d6a83c55}.sponsorOptions input{accent-color:#147da9}.sponsorButtons{display:flex;gap:8px}.crisisPanel{margin:0 24px 18px;display:flex;justify-content:space-between;align-items:center}.crisisPanel>div:last-child{display:flex;gap:7px}.leaderboardPage{padding:24px}.leaderRow{display:grid;grid-template-columns:50px 1fr repeat(3,110px);gap:10px;align-items:center;background:white;padding:13px;border:1px solid #d0dfe6;border-radius:9px;margin:9px 0}.leaderRow>div:nth-child(2){display:grid}.leaderRow small{color:#60788a}@media(max-width:1100px){.topGrid{grid-template-columns:1fr 1fr}.topGrid .panel:last-child{grid-column:1/-1}.investmentGrid{grid-template-columns:repeat(3,1fr)}.assessmentGrid{grid-template-columns:1fr 1fr}.assessmentGrid>div:last-child{grid-column:1/-1}.sponsorOptions{grid-template-columns:repeat(3,1fr)}}@media(max-width:760px){.header,.controls,.crisisPanel{align-items:flex-start;flex-direction:column;gap:10px}.topGrid{grid-template-columns:1fr}.topGrid .panel:last-child{grid-column:auto}.investmentGrid{grid-template-columns:repeat(2,1fr)}.assessmentGrid{grid-template-columns:1fr}.assessmentGrid>div:last-child{grid-column:auto}.sponsorOptions{grid-template-columns:1fr 1fr}}@media(max-width:500px){.investmentGrid{grid-template-columns:1fr}.headerControls{flex-wrap:wrap}.priorityBar{grid-template-columns:110px 1fr 65px}.leaderRow{grid-template-columns:40px 1fr}.leaderRow .metric{display:none}.sponsorOptions{grid-template-columns:1fr}.sponsorButtons{flex-direction:column}}
`;
