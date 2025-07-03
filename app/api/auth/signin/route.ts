import { NextRequest, NextResponse } from "next/server"
import { getUserByEmail, verifyPassword } from "@/lib/user"
import { signJwt } from "@/lib/jwt"
import { serialize } from "cookie"

export async function POST(req: NextRequest) {
  const { email, password, rememberMe } = await req.json() as {
    email: string
    password: string
    rememberMe: boolean
  }

  const user = await getUserByEmail(email)
  if (!user || !(await verifyPassword(password, user.passwordHash))) {
    return NextResponse.json({ message: "Invalid credentials" }, { status: 401 })
  }

  const token = signJwt({ sub: user.id, email: user.email })
  const cookie = serialize("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    sameSite: "lax",
    maxAge: rememberMe ? 60 * 60 * 24 * 30 : 60 * 60 * 2,
  })

  const res = NextResponse.json({ user: { id: user.id, email: user.email } })
  res.headers.set("Set-Cookie", cookie)
  return res
}
