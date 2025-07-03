import { NextResponse } from "next/server"
import { generateGoogleOAuthUrl } from "@/lib/user"

export async function GET() {
  const url = generateGoogleOAuthUrl({
    clientId: process.env.GOOGLE_CLIENT_ID!,
    redirectUri: `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/google`,
    scope: ["openid", "email", "profile"].join(" "),
  })
  return NextResponse.json({ url })
}
