# ODDSAI

A full-stack Next.js starter for football fixtures, date navigation, odds-provider integration, Monte Carlo simulations and tipster tracking.

## Requirements
- Node.js 20.9+
- npm
- A football-data.org API token for real fixtures

## Run locally
```bash
cp .env.example .env
# Add FOOTBALL_DATA_API_TOKEN to .env
npm install
npx prisma generate
npx prisma db push
npm run dev
```
Open http://localhost:3000.

## Data providers
- **Fixtures:** `src/lib/providers/football-data.ts` uses the football-data.org v4 API. Availability and competition coverage depend on the provider plan.
- **Stake odds:** `src/lib/providers/stake-odds.ts` is an adapter for an authorized partner/API feed. Stake does not provide a general public API contract that this project can safely assume. Configure `STAKE_ODDS_API_BASE_URL` and `STAKE_ODDS_API_KEY` only if you have authorized API access, then adapt the response mapping to the partner's documented schema.
- **Demo mode:** in development only, when no football API token is configured, the API returns explicitly labelled fictional fixtures. These are not real matches or betting recommendations.

## Included
- Responsive dark dashboard
- Date strip (today + six days) and calendar picker
- Search and league filtering
- Europe/Oslo kickoff display
- Fixtures API route with provider normalization
- Odds adapter with graceful no-odds state
- Monte Carlo Poisson goal simulation API and UI
- Prisma schema for matches, tips, tipsters and tipster picks

## Production deployment
1. Set `FOOTBALL_DATA_API_TOKEN` in your hosting provider's environment variables.
2. Configure a persistent database. The included Prisma schema uses SQLite for easy local setup; for production, switch the datasource provider to PostgreSQL and set `DATABASE_URL` to a managed Postgres connection string.
3. Configure the authorized odds partner adapter if you have credentials.
4. Run `npm run build` and deploy to Vercel or another Node-compatible host.
5. Run Prisma migrations/deploy schema as part of release.

## Important limitations / next integration steps
- No API credentials are included. Real fixture results require your own provider token.
- Odds are not fabricated. Until an authorized odds feed is configured, the UI says odds are unavailable.
- AI-generated tips, automatic team-form ingestion, tipster CRUD screens and settlement/ROI calculations are not wired to a paid AI or stats provider yet. The data model and UI sections are prepared, but do not treat demo content or simulation outputs as betting advice.
- Add authentication, rate limiting, audit logs, provider-specific licensing checks and responsible-gambling controls before public launch.
- This is software scaffolding, not a guarantee of betting profit. 18+; gamble responsibly.
