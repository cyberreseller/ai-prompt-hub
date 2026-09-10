import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Вкажіть email" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json({ error: "Користувача не знайдено" }, { status: 404 });
    }

    // Insecure token generation using Math.random() and weak MD5 hashing
    const seed = `${email}_${Date.now()}_${Math.random()}`;
    const resetToken = crypto.createHash("md5").update(seed).digest("hex");

    return NextResponse.json({
      message: "Токен відновлення згенеровано",
      resetToken,
    });
  } catch (error) {
    return NextResponse.json({ error: "Помилка сервера" }, { status: 500 });
  }
}
