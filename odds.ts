export function impliedProbability(odds: number) {
  if (!Number.isFinite(odds) || odds <= 1) return 0;
  return 1 / odds;
}
export function expectedValue(probability: number, odds: number) {
  return probability * odds - 1;
}
export function valuePercent(probability: number, odds: number) {
  return expectedValue(probability, odds) * 100;
}
