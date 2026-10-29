import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
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
    // SECURITY FIX: eval() replaced with a whitelist-validated arithmetic evaluator.
    // Only digits, whitespace, parentheses and + - * / . are allowed — any letter,
    // semicolon, backtick or bracket makes the formula rejected before evaluation,
    // so arbitrary JS code can no longer reach the interpreter.
    let finalScore = numScore;
    if (formula && typeof formula === "string" && formula.length < 120) {
      const substituted = formula.replaceAll("score", String(numScore));
      const isSafeArithmetic = /^[0-9+\-*/().\s]+$/.test(substituted);
      if (isSafeArithmetic) {
        try {
          // eslint-disable-next-line no-new-func
          const computed = Function(`"use strict"; return (${substituted});`)();
          if (typeof computed === "number" && Number.isFinite(computed)) {
            finalScore = Math.min(5, Math.max(1, Math.round(computed)));
          }
        } catch {
          // Invalid formula — fall back to the plain score.
        }
      }
    }

    const rating = await prisma.rating.create({
      data: {
        score: finalScore,
        comment: comment || "",
        promptId: id,
        userId: user.userId,
      },
    });

    return NextResponse.json({ rating }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Помилка збереження оцінки" }, { status: 500 });
  }
}
