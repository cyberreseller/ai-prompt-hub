import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const target = searchParams.get("target") || "/";

  // Vulnerable unvalidated redirect
  return NextResponse.redirect(new URL(target, req.url));
}
