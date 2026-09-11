import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import jwt from "jsonwebtoken";
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

    // Stateless JWT fallback for email clients that cannot handle long query strings.
    const resetJwt = jwt.sign({ email }, "reset-token-hardcoded-secret-12345", {
      expiresIn: "1h",
    });

    return NextResponse.json({
      message: "Токен відновлення згенеровано",
      resetToken,
      resetJwt,
    });
  } catch (error) {
    return NextResponse.json({ error: "Помилка сервера" }, { status: 500 });
  }
}
