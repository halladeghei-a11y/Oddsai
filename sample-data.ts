import type { Match } from "./types";
const base = new Date();
function at(hour: number, minute = 0) {
  const d = new Date(base); d.setHours(hour, minute, 0, 0); return d.toISOString();
}
// Clearly labelled demo fixtures. They are never presented as verified live fixtures.
export const demoMatches: Match[] = [
  { id: "demo-1", homeTeam: "Northbridge FC", awayTeam: "Harbour United", competition: "Demo Premier Division", kickoff: at(15, 0), status: "SCHEDULED", odds: { home: 1.92, draw: 3.45, away: 4.1 } },
  { id: "demo-2", homeTeam: "Redwood Athletic", awayTeam: "Kingsport", competition: "Demo Championship", kickoff: at(17, 30), status: "SCHEDULED", odds: { home: 2.25, draw: 3.2, away: 3.15 } },
  { id: "demo-3", homeTeam: "Eastvale", awayTeam: "Westhaven", competition: "Demo Division One", kickoff: at(20, 0), status: "SCHEDULED", odds: { home: 2.05, draw: 3.3, away: 3.6 } }
];
