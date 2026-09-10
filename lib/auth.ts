import { NextRequest } from "next/server";
import { verifyToken, TokenPayload } from "./jwt";

export function getCurrentUser(req: NextRequest): TokenPayload | null {
  // Check Authorization header or cookies
  const authHeader = req.headers.get("authorization");
  let token: string | null = null;

  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.substring(7);
  } else {
    const cookie = req.cookies.get("token");
    if (cookie) {
      token = cookie.value;
    }
  }

  if (!token) return null;
  return verifyToken(token);
}
