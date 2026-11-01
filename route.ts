import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { simulateMatch } from "./simulation";
const schema = z.object({
  homeLambda: z.number().min(0).max(8),
  awayLambda: z.number().min(0).max(8),
  iterations: z.number().int().min(100).max(100000).default(20000)
});
export async function POST(request: NextRequest) {
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Ugyldige parametere" }, { status: 400 });
  return NextResponse.json(simulateMatch(parsed.data));
}
