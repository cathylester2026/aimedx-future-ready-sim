
import React, { useMemo, useState } from "react";

const resources = ["capital", "workforce", "time", "influence"];
const resourceLabels = {
  capital: "Capital",
  workforce: "Workforce",
  time: "Time",
  influence: "Influence",
};

const outcomes = [
  ["patient", "Patient + Experience", "♥"],
  ["workforce", "Workforce", "♟"],
  ["operations", "Operations", "⚙"],
  ["financial", "Financial", "▥"],
  ["adaptability", "Adaptability", "●"],
  ["design", "Design + Place", "▦"],
];

const personas = {
  rural: {
    name: "Distributed Rural Network",
    mission:
      "Extend reliable, high-quality care across a diverse rural network while strengthening the system as one.",
    tension:
      "Invest now to improve access and capability without creating long-term fragility or unsustainable costs.",
    condition:
      "Multiple small sites, long travel distances, uneven digital maturity, and limited specialist coverage.",
    design:
      "The network must work across different buildings, communities, and levels of infrastructure readiness.",
    resources: { capital: 4, workforce: 3, time: 1, influence: 3 },
  },
  academic: {
    name: "Aging Academic Medical Center",
    mission:
      "Modernize complex tertiary care, teaching, and research without disrupting critical daily operations.",
    tension:
      "Visible innovation competes with foundational renewal, workforce readiness, and limited change capacity.",
    condition:
      "High-acuity services operate within aging infrastructure and complex governance.",
    design:
      "Legacy buildings and systems constrain implementation sequencing and future flexibility.",
    resources: { capital: 4, workforce: 3, time: 1, influence: 3 },
  },
  community: {
    name: "Capital-Constrained Community Hospital",
    mission:
      "Make a small number of investments deliver visible clinical, workforce, and operating value.",
    tension:
      "Every investment must work harder because funding and implementation capacity are limited.",
    condition:
      "A trusted local hospital with tight margins, selective renewal needs, and limited specialist depth.",
    design:
      "The right enabling decision may matter more than a highly visible technology purchase.",
    resources: { capital: 2, workforce: 3, time: 3, influence: 2 },
  },
  greenfield: {
    name: "Greenfield Innovation Campus",
    mission:
      "Translate ambition into an integrated care model rather than a collection of advanced products.",
    tension:
      "Move boldly without overbuilding technology or overlooking operating-model readiness.",
    condition:
      "A new-build opportunity with executive ambition, partner interest, and fewer legacy constraints.",
    design:
      "Early decisions can embed adaptability, infrastructure, and new workflows from the beginning.",
    resources: { capital: 5, workforce: 2, time: 2, influence: 3 },
  },
};

const investments = [
  {
    id: "ai-doc",
    domain: "Technology + Data",
    title: "AI Clinical Documentation",
    description: "Reduce clinician documentation burden with AI-assisted notes.",
    icon: "▣",
    color: "blue",
    cost: { capital: 1, workforce: 1 },
    impact: { workforce: 2, operations: 1 },
    supports: ["training", "governance"],
    supportRule: 1,
    debt: 1,
  },
  {
    id: "virtual-nursing",
    domain: "Care Model + Access",
    title: "Virtual Nursing",
    description: "Extend nursing coverage and monitoring across the network.",
    icon: "▤",
    color: "green",
    cost: { capital: 1, workforce: 1, time: 1 },
    impact: { patient: 1, workforce: 2, operations: 1 },
    supports: ["smart-rooms", "infrastructure", "workflow", "training"],
    supportRule: 2,
    debt: 2,
  },
  {
    id: "smart-rooms",
    domain: "Environment + Place",
    title: "Smart Patient Rooms",
    description: "Flexible, technology-enabled rooms supporting hybrid care.",
    icon: "▰",
    color: "cyan",
    cost: { capital: 2, time: 1 },
    impact: { patient: 2, workforce: 1, adaptability: 1, design: 2 },
    supports: ["infrastructure", "workflow"],
    supportRule: 2,
    debt: 2,
  },
  {
    id: "command",
    domain: "Operations + Analytics",
    title: "Enterprise Command Center",
    description: "Network-wide visibility for capacity, flow, and coordination.",
    icon: "⌘",
    color: "purple",
    cost: { capital: 1, time: 1, influence: 1 },
    impact: { operations: 3, financial: 1, adaptability: 1 },
    supports: ["workflow", "governance", "infrastructure"],
    supportRule: 2,
    debt: 2,
  },
  {
    id: "infrastructure",
    domain: "Infrastructure + Foundation",
    title: "Digital Infrastructure",
    description: "Modernize network, wireless, cybersecurity, and integrations.",
    icon: "▤",
    color: "blue",
    cost: { capital: 2 },
    impact: { operations: 1, adaptability: 2, design: 1 },
  },
  {
    id: "training",
    domain: "People + Capability",
    title: "Workforce Training + Adoption",
    description: "Build digital skills and change readiness across the organization.",
    icon: "♟",
    color: "magenta",
    cost: { workforce: 1, time: 1 },
    impact: { workforce: 2, operations: 1, adaptability: 1 },
  },
  {
    id: "workflow",
    domain: "Operations + Workflow",
    title: "Workflow Redesign",
    description: "Redesign care and operational workflows before scaling technology.",
    icon: "⇄",
    color: "orange",
    cost: { workforce: 1, time: 1 },
    impact: { patient: 1, workforce: 1, operations: 2, design: 1 },
  },
  {
    id: "governance",
    domain: "Governance + Data",
    title: "Data + AI Governance",
    description: "Establish policy, stewardship, and responsible AI use.",
    icon: "♦",
    color: "green",
    cost: { time: 1, influence: 1 },
    impact: { patient: 1, adaptability: 1 },
  },
  {
    id: "remote",
    domain: "Care Model + Access",
    title: "Remote Monitoring",
    description: "Monitor patients beyond traditional care settings.",
    icon: "⌂",
    color: "magenta",
    cost: { capital: 1, influence: 1 },
    impact: { patient: 2, operations: 1, financial: 1, adaptability: 1 },
    supports: ["infrastructure", "workflow"],
    supportRule: 1,
    debt: 1,
  },
  {
    id: "flex",
    domain: "Environment + Place",
    title: "Flexible Care Environments",
    description: "Adaptable spaces supporting evolving models of care.",
    icon: "▦",
    color: "green",
    cost: { capital: 2, time: 1 },
    impact: { patient: 1, operations: 1, adaptability: 3, design: 3 },
    supports: ["workflow"],
    supportRule: 1,
    debt: 1,
  },
  {
    id: "collab",
    domain: "People + Wellbeing",
    title: "Staff Collaboration + Restoration",
    description: "Reduce burnout and strengthen team resilience.",
    icon: "♡",
    color: "orange",
    cost: { capital: 1, workforce: 1 },
    impact: { workforce: 3, design: 1 },
  },
  {
    id: "virtual-care",
    domain: "Care Model + Ecosystem",
    title: "Virtual Care Ecosystem",
    description: "Connect clinics, homes, and hospitals into one integrated system.",
    icon: "●",
    color: "blue",
    cost: { capital: 1, workforce: 1, influence: 1 },
    impact: { patient: 3, workforce: 1, operations: 1, financial: 1, adaptability: 2 },
    supports: ["infrastructure", "workflow", "governance"],
    supportRule: 2,
    debt: 2,
  },
];

const crises = {
  workforce: {
    title: "The Workforce Cliff",
    text: "Vacancies rise while demand remains high. Test whether the portfolio reduces burden and supports adoption.",
    helps: ["virtual-nursing", "training", "workflow", "ai-doc", "collab"],
  },
  digital: {
    title: "Digital System Disruption",
    text: "A major outage disrupts visibility and coordination. Test the strength of infrastructure and governance.",
    helps: ["infrastructure", "governance", "command"],
  },
  surge: {
    title: "Regional Demand Surge",
    text: "Demand increases unevenly across the network. Test capacity, flexibility, and coordination.",
    helps: ["command", "virtual-nursing", "remote", "flex", "workflow", "infrastructure"],
  },
};

const makeTeam = (id, name, persona) => ({
  id,
  name,
  persona,
  round: 1,
  selected: [],
  round1: null,
  round2: null,
  locked: false,
  crisisKey: null,
});

function calculateSpent(selected) {
  const spent = { capital: 0, workforce: 0, time: 0, influence: 0 };
  investments
    .filter((item) => selected.includes(item.id))
    .forEach((item) => {
      resources.forEach((key) => {
        spent[key] += item.cost[key] || 0;
      });
    });
  return spent;
}

function calculateScore(selected, crisisKey = null) {
  const selectedSet = new Set(selected);
  const score = {
    patient: 0,
    workforce: 0,
    operations: 0,
    financial: 0,
    adaptability: 0,
    design: 0,
  };
  const gaps = [];
  let debt = 0;

  investments
    .filter((item) => selectedSet.has(item.id))
    .forEach((item) => {
      Object.entries(item.impact).forEach(([key, value]) => {
        score[key] += value;
      });
      if (item.supportRule) {
        const enabled = item.supports.filter((id) => selectedSet.has(id));
        if (enabled.length < item.supportRule) {
          debt += item.debt || 0;
          const missing = item.supports
            .filter((id) => !selectedSet.has(id))
            .map((id) => investments.find((item) => item.id === id)?.title)
            .filter(Boolean);
          gaps.push(`${item.title} needs ${item.supportRule} supporting investments. Options: ${missing.join(", ")}.`);
        }
      }
    });

  const foundationCount = ["infrastructure", "training", "workflow", "governance"].filter((id) => selectedSet.has(id)).length;
  const transformerCount = ["virtual-nursing", "smart-rooms", "command", "virtual-care"].filter((id) => selectedSet.has(id)).length;
  if (transformerCount >= 2 && foundationCount === 0) {
    debt += 2;
    gaps.push("The portfolio has multiple transformative investments but no enabling foundation.");
  }

  const resilience = crisisKey
    ? selected.filter((id) => crises[crisisKey].helps.includes(id)).length * 2 + Math.min(foundationCount, 2)
    : 0;
  const total = Object.values(score).reduce((sum, value) => sum + value, 0) + resilience - debt;

  return { score, debt, resilience, total, gaps };
}

export default function App() {
  const [teams, setTeams] = useState([
    makeTeam(1, "Team 1", "rural"),
    makeTeam(2, "Team 2", "academic"),
    makeTeam(3, "Team 3", "community"),
    makeTeam(4, "Team 4", "greenfield"),
  ]);
  const [activeId, setActiveId] = useState(1);
  const [filter, setFilter] = useState("All Investments");
  const [view, setView] = useState("board");

  const team = teams.find((item) => item.id === activeId);
  const persona = personas[team.persona];
  const spent = calculateSpent(team.selected);
  const remaining = Object.fromEntries(
    resources.map((key) => [key, persona.resources[key] - spent[key]])
  );
  const overLimit = resources.some((key) => remaining[key] < 0);
  const result = calculateScore(team.selected, team.crisisKey);

  const updateTeam = (patch) => {
    setTeams((current) =>
      current.map((item) => (item.id === activeId ? { ...item, ...patch } : item))
    );
  };

  const toggleInvestment = (id) => {
    if (team.locked) return;
    const selected = team.selected.includes(id)
      ? team.selected.filter((item) => item !== id)
      : [...team.selected, id];
    updateTeam({ selected });
  };

  const lockRound = () => {
    if (overLimit || team.selected.length === 0 || team.locked) return;
    const snapshot = { selected: [...team.selected], ...calculateScore(team.selected) };
    if (team.round === 1) updateTeam({ round1: snapshot, round: 2 });
    else updateTeam({ round2: snapshot, locked: true });
  };

  const resetTeam = () => {
    setTeams((current) =>
      current.map((item) =>
        item.id === activeId ? makeTeam(item.id, item.name, item.persona) : item
      )
    );
  };

  const domains = ["All Investments", ...new Set(investments.map((item) => item.domain))];
  const shownInvestments = filter === "All Investments"
    ? investments
    : investments.filter((item) => item.domain === filter);

  const leaderboard = useMemo(
    () =>
      teams
        .map((item) => ({ ...item, result: calculateScore(item.selected, item.crisisKey) }))
        .sort((a, b) => b.result.total - a.result.total),
    [teams]
  );

  return (
    <>
      <style>{styles}</style>
      <div className="app-shell">
        <header className="hero-header">
          <div className="brand">AI<span>MedX</span></div>
          <div className="title-block">
            <h1>Future-Ready Hospital Challenge</h1>
            <p>Build the system. Expose the trade-offs. Create a more resilient tomorrow.</p>
          </div>
          <div className="header-controls">
            <select value={activeId} onChange={(event) => setActiveId(Number(event.target.value))}>
              {teams.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
            </select>
            <span className="round-chip">Round {team.round}</span>
            <button onClick={() => setView(view === "board" ? "leaderboard" : "board")}>{view === "board" ? "Leaderboard" : "Team Board"}</button>
          </div>
        </header>

        {view === "leaderboard" ? (
          <main className="leaderboard-page">
            <div className="page-heading"><div><span className="kicker">Live Session</span><h2>Team Leaderboard</h2></div><button className="primary" onClick={() => setView("board")}>Return to Team Board</button></div>
            <div className="leader-list">
              {leaderboard.map((item, index) => (
                <div className="leader-row" key={item.id}>
                  <strong>#{index + 1}</strong>
                  <div><h3>{item.name}</h3><p>{personas[item.persona].name}</p></div>
                  <Metric label="Total" value={item.result.total}/>
                  <Metric label="Future Debt" value={item.result.debt}/>
                  <Metric label="Resilience" value={item.result.resilience}/>
                  <Metric label="Investments" value={item.selected.length}/>
                </div>
              ))}
            </div>
          </main>
        ) : (
          <main>
            <section className="dashboard-row">
              <article className="dashboard-card persona-card">
                <h2>Your Persona</h2>
                <select
                  value={team.persona}
                  onChange={(event) => updateTeam({
                    persona: event.target.value,
                    selected: [],
                    round: 1,
                    round1: null,
                    round2: null,
                    locked: false,
                    crisisKey: null,
                  })}
                >
                  {Object.entries(personas).map(([key, item]) => <option value={key} key={key}>{item.name}</option>)}
                </select>
                <div className="persona-content">
                  <div className="persona-visual">⌘</div>
                  <div>
                    <h3>{persona.name}</h3>
                    <h4>Mission</h4><p>{persona.mission}</p>
                    <h4>Strategic Tension</h4><p>{persona.tension}</p>
                  </div>
                </div>
                <details><summary>More Details</summary><p><strong>Starting condition:</strong> {persona.condition}</p><p><strong>Design reality:</strong> {persona.design}</p></details>
              </article>

              <article className="dashboard-card resource-card">
                <h2>Resource Reservoir</h2>
                <p className="subhead">Your available organizational capacity</p>
                <div className="resource-list">
                  {resources.map((key) => (
                    <div className="resource-row" key={key}>
                      <span className={`resource-icon ${key}`}>{key === "capital" ? "$" : key === "workforce" ? "♟" : key === "time" ? "◷" : "⌂"}</span>
                      <span className="resource-name">{resourceLabels[key]}</span>
                      <div className="resource-dots">
                        {Array.from({ length: persona.resources[key] }, (_, index) => <i key={index} className={index < remaining[key] ? key : "spent"}/>) }
                      </div>
                      <strong className={remaining[key] < 0 ? "over" : ""}>{remaining[key]} / {persona.resources[key]}</strong>
                    </div>
                  ))}
                </div>
                {overLimit && <div className="alert">Resource limit exceeded. Remove an investment before locking the round.</div>}
              </article>

              <article className="dashboard-card tally-card">
                <h2>Live Tally</h2>
                <p className="subhead">Real-time impact of your portfolio</p>
                <div className="tally-layout">
                  <div className="outcome-list">
                    {outcomes.map(([key, label, icon]) => <div key={key}><span>{icon}</span><label>{label}</label><strong>{result.score[key]}</strong></div>)}
                  </div>
                  <div className="score-stack">
                    <div className="score-pair"><span>Resilience</span><strong>{result.resilience}</strong></div>
                    <div className="score-pair debt"><span>Future Debt</span><strong>{result.debt}</strong></div>
                    <div className="total-score"><span>Total Score</span><strong>{result.total}</strong></div>
                    <div className={result.gaps.length ? "gap-message warning" : "gap-message success"}>
                      <strong>{result.gaps.length ? `${result.gaps.length} strategy gap${result.gaps.length > 1 ? "s" : ""}` : "No current strategy gaps"}</strong>
                      <span>{result.gaps[0] || "All selected investments are properly enabled."}</span>
                    </div>
                  </div>
                </div>
              </article>
            </section>

            <nav className="game-steps">
              {["Choose Investments", "Review Impact", "Adjust (Round 2)", "Crisis Event", "Final Score"].map((label, index) => (
                <div className={index + 1 === (team.crisisKey ? 4 : team.locked ? 4 : team.round === 2 ? 3 : 1) ? "active" : ""} key={label}><span>{index + 1}</span>{label}</div>
              ))}
              <button onClick={resetTeam}>↻ Reset Team</button>
              <button className="primary" disabled={overLimit || team.selected.length === 0 || team.locked} onClick={lockRound}>▣ {team.round === 1 ? "Lock Round 1" : "Lock Round 2"}</button>
            </nav>

            <section className="marketplace">
              <div className="marketplace-header">
                <div><h2>Investment Marketplace</h2><p>Select investments to build your strategy. Each investment has costs, benefits, and dependencies.</p></div>
                <div className="filter-control"><label>Filter by Domain:</label><select value={filter} onChange={(event) => setFilter(event.target.value)}>{domains.map((item) => <option key={item}>{item}</option>)}</select><span>{shownInvestments.length} investments</span></div>
              </div>

              <div className="investment-grid">
                {shownInvestments.map((item) => {
                  const selected = team.selected.includes(item.id);
                  const tokenCost = Object.values(item.cost).reduce((sum, value) => sum + value, 0);
                  return (
                    <article className={`investment-card ${item.color} ${selected ? "selected" : ""}`} key={item.id}>
                      <div className="card-top">
                        <span className="investment-icon">{item.icon}</span>
                        <div className="investment-title"><small>{item.domain}</small><h3>{item.title}</h3></div>
                        <span className="token-chip">{tokenCost} Tokens</span>
                      </div>
                      <p>{item.description}</p>
                      <div className="card-bottom">
                        <div className="cost-chips">{Object.entries(item.cost).map(([key, value]) => <span key={key} className={key}>{resourceLabels[key]} {value}</span>)}</div>
                        <button onClick={() => toggleInvestment(item.id)}>{selected ? "✓ Selected" : "Select"}</button>
                      </div>
                    </article>
                  );
                })}
              </div>
            </section>

            {team.locked && (
              <section className="crisis-panel">
                <div><span className="kicker">Stress Test</span><h2>{team.crisisKey ? crises[team.crisisKey].title : "Reveal a Crisis Event"}</h2></div>
                {!team.crisisKey ? <div className="crisis-actions">{Object.entries(crises).map(([key, item]) => <button key={key} onClick={() => updateTeam({ crisisKey: key })}>{item.title}</button>)}</div> : <div><p>{crises[team.crisisKey].text}</p><strong>Resilience score: {result.resilience}</strong></div>}
              </section>
            )}
          </main>
        )}

        <footer><div className="brand small">AI<span>MedX</span></div><span>Strategy · People · Technology · Place · A Healthier Future</span><q>The future is not determined by what we purchase, but by how well we connect what we build.</q></footer>
      </div>
    </>
  );
}

function Metric({ label, value }) {
  return <div className="leader-metric"><span>{label}</span><strong>{value}</strong></div>;
}

const styles = `
:root{font-family:Inter,Segoe UI,Arial,sans-serif;color:#102846;background:#eef5f8;font-synthesis:none}*{box-sizing:border-box}body{margin:0;min-width:320px;background:#eef5f8;color:#102846}button,select{font:inherit}.app-shell{min-height:100vh}.hero-header{min-height:76px;background:linear-gradient(100deg,#071f3b 0%,#0c3658 62%,#1b5570 100%);color:white;display:grid;grid-template-columns:auto 1fr auto;align-items:center;gap:24px;padding:11px 28px;border-bottom:4px solid #3ecbf0}.brand{font-size:42px;font-weight:900;letter-spacing:-2px;border-right:1px solid #6d91a8;padding-right:24px}.brand span{color:#4bc9ef}.title-block h1{margin:0;font-size:25px}.title-block p{margin:3px 0 0;color:#d2e3ec;font-size:13px}.header-controls{display:flex;align-items:center;gap:10px}.header-controls select,.header-controls button,.round-chip{background:#0b2949;color:white;border:1px solid #3f6b88;border-radius:10px;padding:10px 14px;font-weight:700}.dashboard-row{display:grid;grid-template-columns:1.08fr .86fr 1.12fr;gap:8px;padding:8px 10px;background:#dbeaf0}.dashboard-card{background:rgba(255,255,255,.95);border:1px solid #c8dce6;border-radius:7px;padding:12px 16px;min-height:245px;box-shadow:0 2px 8px rgba(13,48,75,.08)}.dashboard-card h2{font-size:18px;text-transform:uppercase;margin:0 0 3px;letter-spacing:.3px}.dashboard-card .subhead{margin:0 0 8px;color:#597083;font-size:13px}.persona-card select{width:100%;margin:3px 0 8px;border:1px solid #c5d7e1;padding:6px 8px;border-radius:6px;color:#163651}.persona-content{display:grid;grid-template-columns:74px 1fr;gap:14px}.persona-visual{height:166px;background:linear-gradient(165deg,#d2ecf7,#b7deed 46%,#65a97f 47%,#27604d);display:grid;place-items:center;font-size:38px;color:#0c4f80;border-radius:4px}.persona-content h3{margin:0 0 7px;font-size:18px}.persona-content h4{margin:7px 0 2px;font-size:14px}.persona-content p,.persona-card details p{margin:0;color:#344f67;font-size:13px;line-height:1.3}.persona-card details{margin-top:7px;font-size:12px;color:#1c69a3}.resource-list{display:grid;gap:5px}.resource-row{display:grid;grid-template-columns:38px 92px 1fr 44px;align-items:center;gap:8px;border:1px solid #d4e3e9;border-radius:7px;padding:8px;background:#fbfdfe}.resource-icon{width:30px;height:30px;border-radius:50%;display:grid;place-items:center;color:white;font-weight:900}.resource-icon.capital{background:#13b668}.resource-icon.workforce{background:#268fd8}.resource-icon.time{background:#f49a12}.resource-icon.influence{background:#8c4bb7}.resource-name{font-size:14px}.resource-dots{display:flex;gap:5px}.resource-dots i{width:29px;height:25px;border-radius:4px}.resource-dots i.capital{background:#29c386}.resource-dots i.workforce{background:#339be2}.resource-dots i.time{background:#f3a51c}.resource-dots i.influence{background:#9a54b8}.resource-dots i.spent{background:#e5edf1}.resource-row strong{font-size:14px;text-align:right}.resource-row strong.over{color:#c33131}.alert{margin-top:8px;padding:7px 9px;border-radius:6px;background:#fff2df;color:#9a5a00;font-size:12px}.tally-layout{display:grid;grid-template-columns:1fr .9fr;gap:14px}.outcome-list{display:grid;gap:5px}.outcome-list>div{display:grid;grid-template-columns:26px 1fr 20px;align-items:center;font-size:13px}.outcome-list>div span{font-size:20px;color:#258fca}.outcome-list>div:first-child span{color:#d83eb1}.outcome-list strong{text-align:right}.score-stack{display:grid;gap:6px}.score-pair,.total-score{display:flex;justify-content:space-between;align-items:center;padding:8px 11px;border:1px solid #bad8e7;border-radius:6px;background:#edf8fc}.score-pair.debt strong{color:#ce2929}.total-score{text-transform:uppercase;font-weight:800}.total-score strong{font-size:24px}.gap-message{display:grid;gap:2px;padding:8px 10px;border-radius:6px;font-size:11px}.gap-message.success{background:#e5f7ea;color:#15793e}.gap-message.warning{background:#fff0dc;color:#965a06}.game-steps{display:grid;grid-template-columns:1.15fr 1fr 1fr 1fr 1fr auto auto;align-items:center;background:linear-gradient(90deg,#073458,#061e37);color:white;padding:10px 22px;gap:0}.game-steps>div{padding:9px 16px;border-right:1px solid #31506b;color:#aabfd0;font-size:13px}.game-steps>div span{display:inline-grid;place-items:center;width:28px;height:28px;border-radius:50%;background:#426079;color:white;margin-right:10px}.game-steps>div.active{background:#0780bd;color:white;border-radius:7px}.game-steps>div.active span{background:#63d6f4;color:#12334d}.game-steps button{margin-left:10px;padding:10px 18px;border-radius:7px;border:1px solid #5daccf;background:transparent;color:white;font-weight:700}.game-steps button.primary{background:#4cd4f4;color:#0a2a42;border:0}.game-steps button:disabled{opacity:.45}.marketplace{padding:12px 28px 16px;background:#f7fbfd}.marketplace-header{display:flex;justify-content:space-between;align-items:end;margin-bottom:10px}.marketplace-header h2{margin:0;text-transform:uppercase;font-size:18px;letter-spacing:.5px}.marketplace-header p{margin:2px 0 0;color:#547086;font-size:12px}.filter-control{display:flex;gap:8px;align-items:center;font-size:12px}.filter-control select{padding:7px 28px 7px 9px;border:1px solid #c1d1db;border-radius:5px;background:white}.investment-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:9px 12px}.investment-card{position:relative;background:white;border:1px solid #d4e2e9;border-left:4px solid #269bd2;border-radius:8px;padding:11px 12px;min-height:126px;box-shadow:0 2px 6px rgba(16,51,76,.08);display:grid;grid-template-rows:auto 1fr auto}.investment-card.green{border-left-color:#29a758}.investment-card.cyan{border-left-color:#1ebbc8}.investment-card.purple{border-left-color:#853aaa}.investment-card.magenta{border-left-color:#ca39a2}.investment-card.orange{border-left-color:#e76f24}.investment-card.selected{border:2px solid #13b8d4;box-shadow:0 0 0 2px rgba(19,184,212,.15)}.card-top{display:grid;grid-template-columns:48px 1fr auto;gap:9px;align-items:start}.investment-icon{width:48px;height:48px;border-radius:7px;background:#e6f3f9;display:grid;place-items:center;font-size:25px;color:#127cb8}.green .investment-icon{color:#249b50;background:#e6f6eb}.purple .investment-icon{color:#783291;background:#f2e8f6}.magenta .investment-icon{color:#ba2d95;background:#fae8f4}.orange .investment-icon{color:#dc5d1d;background:#fff0e4}.investment-title small{display:block;text-transform:uppercase;font-size:8px;font-weight:900;color:#1478a7}.green .investment-title small{color:#278b49}.purple .investment-title small{color:#703286}.magenta .investment-title small{color:#ae2b8c}.orange .investment-title small{color:#cb571c}.investment-title h3{margin:3px 0 0;font-size:14px;line-height:1.15}.token-chip{background:#edf3f6;border-radius:18px;padding:5px 9px;font-size:11px;font-weight:800;white-space:nowrap}.investment-card>p{margin:4px 0 8px 57px;color:#456076;font-size:11px;line-height:1.25}.card-bottom{display:flex;justify-content:space-between;align-items:end;gap:7px}.cost-chips{display:flex;gap:4px;flex-wrap:wrap}.cost-chips span{font-size:9px;padding:4px 7px;border-radius:4px;background:#e7f1f7}.cost-chips span.time{background:#fff0d9}.cost-chips span.influence{background:#efe3f5}.investment-card button{min-width:75px;padding:7px 10px;border-radius:5px;border:1px solid #b7ccd8;background:white;color:#176892;font-weight:800;font-size:11px}.investment-card.selected button{background:#078bc4;color:white;border-color:#078bc4}.crisis-panel{margin:0 28px 16px;padding:14px 18px;background:white;border:1px solid #d4e2e9;border-radius:8px;display:flex;justify-content:space-between;gap:20px;align-items:center}.kicker{text-transform:uppercase;color:#147da9;font-size:10px;font-weight:900;letter-spacing:1px}.crisis-panel h2{margin:2px 0}.crisis-actions{display:flex;gap:8px}.crisis-actions button{padding:9px 12px;border:0;border-radius:6px;background:#9b233e;color:white;font-weight:700}footer{background:#082746;color:white;display:flex;align-items:center;gap:26px;padding:10px 30px;font-size:11px}.brand.small{font-size:28px;border-right:1px solid #648096}.brand.small span{color:#4bc9ef}footer q{margin-left:auto;max-width:450px;color:#c3d5df;font-style:italic}.leaderboard-page{padding:28px;background:#eef5f8;min-height:calc(100vh - 130px)}.page-heading{display:flex;justify-content:space-between;align-items:center}.page-heading h2{margin:3px 0}.page-heading button{padding:10px 14px;border:0;border-radius:7px;background:#078bc4;color:white}.leader-list{display:grid;gap:10px;margin-top:18px}.leader-row{display:grid;grid-template-columns:60px 1fr repeat(4,120px);align-items:center;gap:12px;padding:14px;background:white;border:1px solid #d4e2e9;border-radius:8px}.leader-row>strong{font-size:24px;color:#1588bc}.leader-row h3,.leader-row p{margin:0}.leader-row p{color:#60798d;font-size:12px}.leader-metric{text-align:center;padding:8px;background:#edf6fa;border-radius:6px}.leader-metric span{display:block;font-size:10px;color:#5a7183}.leader-metric strong{font-size:20px}@media(max-width:1200px){.dashboard-row{grid-template-columns:1fr 1fr}.tally-card{grid-column:1/-1}.investment-grid{grid-template-columns:repeat(3,1fr)}.game-steps{grid-template-columns:repeat(5,1fr);row-gap:8px}.game-steps button{margin-left:0}}@media(max-width:850px){.hero-header{grid-template-columns:1fr}.brand{border:0}.dashboard-row{grid-template-columns:1fr}.investment-grid{grid-template-columns:repeat(2,1fr)}.marketplace-header{align-items:flex-start;flex-direction:column;gap:8px}.leader-row{grid-template-columns:50px 1fr repeat(2,90px)}.leader-row .leader-metric:nth-last-child(-n+2){display:none}}@media(max-width:560px){.investment-grid{grid-template-columns:1fr}.game-steps{grid-template-columns:1fr 1fr}.tally-layout{grid-template-columns:1fr}.filter-control{align-items:flex-start;flex-direction:column}footer{align-items:flex-start;flex-direction:column}.leader-row{grid-template-columns:40px 1fr}.leader-metric{display:none}}
`;
