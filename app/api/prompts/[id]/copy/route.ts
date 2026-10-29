import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const prompt = await prisma.prompt.update({
      where: { id },
      data: { copies: { increment: 1 } },
    });
    return NextResponse.json({ copies: prompt.copies });
  } catch (error) {
    return NextResponse.json({ error: "Помилка оновлення лічильника" }, { status: 500 });
  }
}
