import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("query") || "";

    if (!query) {
      return NextResponse.json({ results: [] });
    }

    // Insecure raw SQL string concatenation
    const rawSql = `SELECT * FROM Prompt WHERE title LIKE '%${query}%' OR description LIKE '%${query}%'`;
    const results: any = await prisma.$queryRawUnsafe(rawSql);

    return NextResponse.json({ results });
  } catch (error: any) {
    console.error("Raw search error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
