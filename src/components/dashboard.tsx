"use client";
import { useEffect, useMemo, useState } from "react";
import { Activity, BrainCircuit, CalendarDays, ChartNoAxesCombined, ChevronDown, CircleHelp, Crosshair, Menu, RefreshCw, Search, ShieldCheck, Sparkles, Trophy } from "lucide-react";
import type { Match } from "@/lib/types";
import { formatKickoff } from "@/lib/date";

type Tab = "matches" | "value" | "tips" | "simulator" | "tipsters";
const nav: { id: Tab; label: string; icon: typeof Trophy }[] = [
  { id: "matches", label: "Kamper", icon: Trophy },
  { id: "value", label: "Value bets", icon: Crosshair },
  { id: "tips", label: "AI-analyse", icon: BrainCircuit },
  { id: "simulator", label: "Simulator", icon: ChartNoAxesCombined },
  { id: "tipsters", label: "Tipstere", icon: Activity }
];
function localDate(d: Date) {
  const parts = new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Oslo", year: "numeric", month: "2-digit", day: "2-digit" }).formatToParts(d);
  const get = (t: string) => parts.find(p => p.type === t)?.value ?? "";
  return `${get("year")}-${get("month")}-${get("day")}`;
}
function addDays(key: string, n: number) { const d = new Date(`${key}T12:00:00+01:00`); d.setDate(d.getDate() + n); return localDate(d); }
function prettyDate(key: string) { return new Intl.DateTimeFormat("nb-NO", { weekday: "short", day: "numeric", month: "short", timeZone: "Europe/Oslo" }).format(new Date(`${key}T12:00:00+01:00`)); }

export default function Dashboard() {
  const today = localDate(new Date());
  const [day, setDay] = useState(today);
  const [matches, setMatches] = useState<Match[]>([]);
  const [source, setSource] = useState<"live" | "demo" | "error">("demo");
  const [loading, setLoading] = useState(true);
  const [league, setLeague] = useState("Alle ligaer");
  const [query, setQuery] = useState("");
  const [tab, setTab] = useState<Tab>("matches");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [homeLambda, setHomeLambda] = useState(1.65);
  const [awayLambda, setAwayLambda] = useState(1.1);
  const [simulation, setSimulation] = useState<{home:number;draw:number;away:number;iterations:number}|null>(null);

  async function loadMatches(date: string) {
    setLoading(true);
    try {
      const response = await fetch(`/api/matches?date=${date}`, { cache: "no-store" });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "Could not load fixtures");
      setMatches(data.matches ?? []); setSource(data.source ?? "demo");
    } catch {
      setMatches([]); setSource("error");
    } finally { setLoading(false); }
  }
  useEffect(() => { void loadMatches(day); }, [day]);

  const filtered = useMemo(() => matches.filter(m =>
    (league === "Alle ligaer" || m.competition === league) &&
    `${m.homeTeam} ${m.awayTeam} ${m.competition}`.toLowerCase().includes(query.toLowerCase())
  ), [matches, league, query]);
  const leagues = ["Alle ligaer", ...Array.from(new Set(matches.map(m => m.competition))).sort()];
  const days = Array.from({length: 7}, (_, i) => addDays(today, i));
  const stats = [
    { label: "Kamper valgt dato", value: String(matches.length), icon: Trophy },
    { label: "Ligaer", value: String(new Set(matches.map(m => m.competition)).size), icon: Activity },
    { label: "Value bets", value: "—", icon: Crosshair },
    { label: "Datakilde", value: source === "live" ? "Live API" : source === "demo" ? "Demo" : "Utilgjengelig", icon: ShieldCheck }
  ];

  return <main className="app-shell">
    <aside className={`sidebar ${mobileOpen ? "open" : ""}`}>
      <div className="brand"><div className="brand-mark"><BrainCircuit size={22}/></div><span>ODDS<span className="green">AI</span></span><button className="mobile-close" onClick={() => setMobileOpen(false)}>×</button></div>
      <div className="side-label">ARBEIDSOMRÅDE</div>
      <nav>{nav.map(item => <button key={item.id} onClick={() => {setTab(item.id);setMobileOpen(false)}} className={`nav-item ${tab === item.id ? "active" : ""}`}><item.icon size={18}/>{item.label}{item.id === "value" && <span className="nav-tag">AI</span>}</button>)}</nav>
      <div className="sidebar-bottom"><div className="status-dot"/><span>ODDSAI-system klar</span><div className="version">v1.0</div></div>
    </aside>
    {mobileOpen && <button aria-label="Lukk meny" className="scrim" onClick={() => setMobileOpen(false)}/>}
    <section className="main-area">
      <header className="topbar"><button className="menu-button" onClick={() => setMobileOpen(true)}><Menu/></button><div className="breadcrumb">Oversikt <span>/</span> {nav.find(n=>n.id===tab)?.label}</div><div className="top-actions"><span className="timezone">Europe / Oslo</span><div className="avatar">O</div></div></header>
      <div className="content">
        <div className="page-heading"><div><div className="eyebrow"><span className="pulse"/> FOOTBALL INTELLIGENCE PLATFORM</div><h1>{tab === "matches" ? "Kampoversikt" : nav.find(n=>n.id===tab)?.label}</h1><p>Data, sannsynligheter og analyse — samlet på ett sted.</p></div><button className="refresh-button" onClick={() => loadMatches(day)} disabled={loading}><RefreshCw size={15} className={loading ? "spin" : ""}/> Oppdater</button></div>
        <div className="stats-grid">{stats.map(s=><div className="stat-card" key={s.label}><div className="stat-top"><span>{s.label}</span><s.icon size={17}/></div><strong>{s.value}</strong></div>)}</div>

        {tab === "matches" && <>
          <section className="panel date-panel"><div className="section-title"><div><h2>Velg kampdag</h2><p>Vis faktiske oppføringer for valgt dato</p></div><label className="calendar-input"><CalendarDays size={16}/><input type="date" value={day} onChange={e=>setDay(e.target.value)}/></label></div>
            <div className="date-strip">{days.map((d,i)=><button key={d} onClick={()=>setDay(d)} className={`date-button ${day===d?"selected":""}`}><span>{i===0?"I dag":i===1?"I morgen":prettyDate(d).split(" ")[0]}</span><strong>{new Date(`${d}T12:00:00+01:00`).toLocaleDateString("nb-NO",{day:"2-digit",timeZone:"Europe/Oslo"})}</strong><small>{new Date(`${d}T12:00:00+01:00`).toLocaleDateString("nb-NO",{month:"short",timeZone:"Europe/Oslo"})}</small></button>)}</div>
          </section>
          <section className="panel fixtures-panel"><div className="section-title"><div><h2>{prettyDate(day)}</h2><p>{filtered.length} kamper funnet · sortert etter avspark</p></div><div className="filters"><div className="search-box"><Search size={15}/><input placeholder="Søk lag eller liga..." value={query} onChange={e=>setQuery(e.target.value)}/></div><label className="select-wrap"><select value={league} onChange={e=>setLeague(e.target.value)}>{leagues.map(l=><option key={l}>{l}</option>)}</select><ChevronDown size={14}/></label></div></div>
            {source === "demo" && <div className="notice"><CircleHelp size={16}/><span>Demodata vises fordi ingen kamp-API-nøkkel er konfigurert. Disse kampene er eksempler, ikke virkelige kamper eller odds.</span></div>}
            {source === "error" && <div className="notice warning">Kunne ikke hente kampdata. Kontroller API-nøkkelen og prøv igjen.</div>}
            {loading ? <div className="empty-state"><RefreshCw className="spin"/> Henter kamper …</div> : filtered.length === 0 ? <div className="empty-state"><Trophy size={28}/><strong>Ingen kamper funnet</strong><span>Prøv en annen dato eller fjern filtrene.</span></div> :
              <div className="match-list">{filtered.map(m=><article className="match-row" key={m.id}><div className="match-time"><strong>{formatKickoff(m.kickoff)}</strong><span className={m.status==="LIVE"?"live-label":""}>{m.status==="LIVE"?"LIVE":m.status==="FINISHED"?"FERDIG":m.status==="POSTPONED"?"UTSATT":"KAMPSTART"}</span></div><div className="match-teams"><span className="competition">{m.competition}</span><strong>{m.homeTeam} <i>vs</i> {m.awayTeam}</strong></div><div className="match-score">{m.status==="FINISHED" || m.status==="LIVE" ? `${m.homeGoals ?? "–"} : ${m.awayGoals ?? "–"}` : "—"}</div><div className="odds-group">{m.odds ? [["1",m.odds.home],["X",m.odds.draw],["2",m.odds.away]].map(([k,v])=><div className="odd" key={String(k)}><small>{k}</small><b>{Number(v).toFixed(2)}</b></div>) : <span className="no-odds">Odds ikke tilgjengelig</span>}</div></article>)}</div>}
          </section>
        </>}
        {tab === "value" && <section className="panel feature-panel"><div className="feature-icon"><Crosshair/></div><h2>Value bet-analyse</h2><p>En value bet krever både en estimert sannsynlighet og tilgjengelige odds. Når kamp- og oddsleverandører er konfigurert, beregner ODDSAI forventet verdi og rangerer mulighetene.</p><div className="formula">Forventet verdi = (sannsynlighet × odds) − 1</div><div className="notice"><CircleHelp size={16}/> Ingen live-odds er tilkoblet ennå. Ikke bruk demodata som grunnlag for spill.</div></section>}
        {tab === "tips" && <section className="panel feature-panel"><div className="feature-icon"><Sparkles/></div><h2>AI-kampanalyse</h2><p>Analysemodulen er klargjort for lagform, innbyrdes oppgjør, målstatistikk, skader og markedsodds. En reell AI-modell og datakilder må kobles til før automatiske tips kan publiseres.</p><div className="notice">ODDSAI skal aldri presentere oppdiktede analyser som verifiserte tips.</div></section>}
        {tab === "simulator" && <section className="panel feature-panel simulator"><div className="feature-icon"><ChartNoAxesCombined/></div><h2>Monte Carlo-simulator</h2><p>Test en enkel målmodell. Tallene er modellforutsetninger, ikke en prognose for en bestemt kamp.</p><div className="range-row"><label>Hjemmelag · forventede mål <b>{homeLambda.toFixed(2)}</b></label><input type="range" min="0.1" max="4" step="0.05" value={homeLambda} onChange={e=>setHomeLambda(Number(e.target.value))}/></div><div className="range-row"><label>Bortelag · forventede mål <b>{awayLambda.toFixed(2)}</b></label><input type="range" min="0.1" max="4" step="0.05" value={awayLambda} onChange={e=>setAwayLambda(Number(e.target.value))}/></div><button className="primary-button" onClick={async()=>{const r=await fetch("/api/simulate",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({homeLambda,awayLambda,iterations:20000})});setSimulation(await r.json())}}>Kjør 20 000 simuleringer</button>{simulation && <div className="simulation-results">{[["Hjemmeseier",simulation.home],["Uavgjort",simulation.draw],["Borteseier",simulation.away]].map(([label,val])=><div key={String(label)}><span>{label}</span><strong>{(Number(val)*100).toFixed(1)}%</strong><div className="bar"><i style={{width:`${Number(val)*100}%`}}/></div></div>)}</div>}</section>}
        {tab === "tipsters" && <section className="panel feature-panel"><div className="feature-icon"><Trophy/></div><h2>Tipster-oversikt</h2><p>Registrer tipstere og spor historiske spill, odds og resultater. Resultater må komme fra dokumenterte oppgjør — ikke selvrapporterte påstander.</p><div className="empty-state compact">Ingen tipstere registrert ennå.</div></section>}
        <footer>ODDSAI · Analyseverktøy for fotball · Spill ansvarlig. 18+</footer>
      </div>
    </section>
  </main>;
}
