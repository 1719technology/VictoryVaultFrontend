// lib/user.ts
import bcrypt from "bcrypt"
import prisma from "@/lib/prisma"

/** Look up a user record by email */
export async function getUserByEmail(email: string) {
  return prisma.user.findUnique({ where: { email } })
}

/** Compare a plaintext password against its bcrypt hash */
export async function verifyPassword(plain: string, hash: string) {
  return bcrypt.compare(plain, hash)
}

/** Build Google’s OAuth2 consent-screen URL */
export function generateGoogleOAuthUrl({
  clientId,
  redirectUri,
  scope,
}: {
  clientId: string
  redirectUri: string
  scope: string
}) {
  const rootUrl = "https://accounts.google.com/o/oauth2/v2/auth"
  const params = new URLSearchParams({
    client_id:    clientId,
    redirect_uri: redirectUri,
    response_type:"code",
    access_type:  "offline",
    prompt:       "consent",
    scope,
  })
  return `${rootUrl}?${params.toString()}`
}
