import type { Match } from "./types";

const API = "https://api.football-data.org/v4";

type ProviderMatch = {
  id: number; utcDate: string; status: string;
  homeTeam?: { name?: string }; awayTeam?: { name?: string };
  competition?: { name?: string };
  score?: { fullTime?: { home?: number | null; away?: number | null } };
};
function normalizeStatus(status: string): Match["status"] {
  if (["IN_PLAY", "PAUSED", "LIVE"].includes(status)) return "LIVE";
  if (["FINISHED", "AWARDED"].includes(status)) return "FINISHED";
  if (status === "POSTPONED") return "POSTPONED";
  return "SCHEDULED";
}
export async function getFootballDataMatches(day: string): Promise<Match[]> {
  const token = process.env.FOOTBALL_DATA_API_TOKEN;
  if (!token) throw new Error("FOOTBALL_DATA_API_TOKEN is not configured");
  const response = await fetch(`${API}/matches?dateFrom=${day}&dateTo=${day}`, {
    headers: { "X-Auth-Token": token }, next: { revalidate: 60 }
  });
  if (!response.ok) throw new Error(`Football-data provider returned ${response.status}`);
  const payload = await response.json() as { matches?: ProviderMatch[] };
  return (payload.matches ?? []).map(m => ({
    id: String(m.id), homeTeam: m.homeTeam?.name ?? "Home team",
    awayTeam: m.awayTeam?.name ?? "Away team", competition: m.competition?.name ?? "Football",
    kickoff: m.utcDate, status: normalizeStatus(m.status),
    homeGoals: m.score?.fullTime?.home, awayGoals: m.score?.fullTime?.away
  })).sort((a, b) => new Date(a.kickoff).getTime() - new Date(b.kickoff).getTime());
}
