import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { simulateMatch } from "../../../lib/simulation";

const schema = z.object({
  homeLambda: z.number().min(0).max(8),
  awayLambda: z.number().min(0).max(8),
  iterations: z.number().int().min(100).max(100000),
});

export async function POST(request: NextRequest) {
  const parsed = schema.safeParse(await request.json());

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input" },
      { status: 400 }
    );
  }

  return NextResponse.json(simulateMatch(parsed.data));
}
