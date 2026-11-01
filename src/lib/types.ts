export type MatchStatus = "SCHEDULED" | "LIVE" | "FINISHED" | "POSTPONED";

export type Match = {
  id: string;
  homeTeam: string;
  awayTeam: string;
  competition: string;
  kickoff: string;
  status: MatchStatus;
  homeGoals?: number | null;
  awayGoals?: number | null;
  odds?: {
    home: number;
    draw: number;
    away: number;
  } | null;
};

export type MatchDay = "today" | "tomorrow" | string;
