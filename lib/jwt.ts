// lib/jwt.ts
import jwt from "jsonwebtoken"

const { JWT_SECRET = "" } = process.env
if (!JWT_SECRET) {
  throw new Error("Missing JWT_SECRET in environment")
}

export function signJwt(
  payload: Record<string, any>,
  options?: jwt.SignOptions
): string {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: "2h",
    ...(options ?? {}),
  })
}

export function verifyJwt<T = any>(token: string): T {
  return jwt.verify(token, JWT_SECRET) as T
}
