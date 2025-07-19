import jwt, { SignOptions, JwtPayload } from "jsonwebtoken";

const { JWT_SECRET = "" } = process.env;

if (!JWT_SECRET) {
  throw new Error("Missing JWT_SECRET in environment");
}

// Use a generic payload type with a default fallback
export function signJwt<T extends object>(
  payload: T,
  options?: SignOptions
): string {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: "2h",
    ...(options ?? {}),
  });
}

// T extends JwtPayload ensures it conforms to expected shape
export function verifyJwt<T extends JwtPayload = JwtPayload>(token: string): T {
  return jwt.verify(token, JWT_SECRET) as T;
}
