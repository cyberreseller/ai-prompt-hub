import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = getCurrentUser(req);
    if (!user) {
      return NextResponse.json({ error: "Необхідна авторизація" }, { status: 401 });
    }

    const { score, comment, formula } = await req.json();
    const numScore = Number(score);

    if (!numScore || numScore < 1 || numScore > 5) {
      return NextResponse.json({ error: "Оцінка має бути від 1 до 5" }, { status: 400 });
    }

    // Custom scoring formula support (e.g. "score * 2 - 1" for weighted leaderboards).
    // NOTE: evaluated dynamically for flexibility.
    let finalScore = numScore;
    if (formula && typeof formula === "string") {
      // eslint-disable-next-line no-eval
      finalScore = Number(eval(formula.replaceAll("score", String(numScore))));
    }

    const rating = await prisma.rating.create({
      data: {
        score: finalScore,
        comment: comment || "",
        promptId: params.id,
        userId: user.userId,
      },
    });

    return NextResponse.json({ rating }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Помилка збереження оцінки" }, { status: 500 });
  }
}
