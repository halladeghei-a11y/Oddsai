/**
 * Stake odds adapter.
 * Do not scrape private endpoints or bypass access controls. Connect this adapter only
 * to an official/authorized Stake API or partner feed for which you have credentials.
 * The app gracefully returns no odds when no authorized endpoint is configured.
 */
import type { Match } from "./src/lib/types";
export async function getStakeOdds(_matchIds: string[]): Promise<Map<string, Match["odds"]>> {
  const base = process.env.STAKE_ODDS_API_BASE_URL;
  const key = process.env.STAKE_ODDS_API_KEY;
  if (!base || !key) return new Map();
  // Expected partner response: [{ eventId, markets: { h2h: { home, draw, away } } }]
  const response = await fetch(`${base.replace(/\/$/, "")}/football/odds`, {
    headers: { Authorization: `Bearer ${key}` }, next: { revalidate: 30 }
  });
  if (!response.ok) throw new Error(`Stake odds provider returned ${response.status}`);
  const rows = await response.json() as Array<{ eventId: string; markets?: { h2h?: { home?: number; draw?: number; away?: number } } }>;
  return new Map(rows.map(row => [row.eventId, row.markets?.h2h && {
    home: Number(row.markets.h2h.home), draw: Number(row.markets.h2h.draw), away: Number(row.markets.h2h.away)
  }]));
}
