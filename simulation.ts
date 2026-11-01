export type SimulationInput = { homeLambda: number; awayLambda: number; iterations?: number; seed?: number };
export type SimulationResult = { home: number; draw: number; away: number; iterations: number };
function poisson(lambda: number, random: () => number) {
  const limit = Math.exp(-lambda); let k = 0; let p = 1;
  do { k++; p *= random(); } while (p > limit);
  return k - 1;
}
export function simulateMatch({ homeLambda, awayLambda, iterations = 20_000, seed = 42 }: SimulationInput): SimulationResult {
  if (homeLambda < 0 || awayLambda < 0 || iterations < 100) throw new Error("Invalid simulation parameters");
  let state = seed >>> 0;
  const random = () => { state = (1664525 * state + 1013904223) >>> 0; return state / 4294967296; };
  let home = 0, draw = 0, away = 0;
  for (let i = 0; i < iterations; i++) {
    const h = poisson(homeLambda, random), a = poisson(awayLambda, random);
    if (h > a) home++; else if (h === a) draw++; else away++;
  }
  return { home: home / iterations, draw: draw / iterations, away: away / iterations, iterations };
}
