import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const prompt = await prisma.prompt.update({
      where: { id: params.id },
      data: { copies: { increment: 1 } },
    });
    return NextResponse.json({ copies: prompt.copies });
  } catch (error) {
    return NextResponse.json({ error: "Помилка оновлення лічильника" }, { status: 500 });
  }
}
