import jwt, { SignOptions, VerifyOptions } from "jsonwebtoken";

/**
 * IMPORTANT:
 * JWT requires Node runtime.
 * Do NOT use in Edge functions.
 */
export const runtime = "nodejs";

export type JwtClaims = {
  session_id: string;
  refresh_id?: string;
  name?: string;
};

export type JwtResult = {
  payload: JwtClaims | null;
  expired: boolean;
};

const ACCESS_SECRET = process.env.ACCESS_TOKEN_SECRET!;
const REFRESH_SECRET = process.env.REFRESH_TOKEN_SECRET!;

if (!ACCESS_SECRET || !REFRESH_SECRET) {
  throw new Error("JWT secrets are not defined in environment variables");
}

/* ----------------------------- SIGN ----------------------------- */

export function signJWT(
  claims: JwtClaims,
  type: "access" | "refresh",
  options?: SignOptions
): string | null {
  try {
    const secret =
      type === "access" ? ACCESS_SECRET : REFRESH_SECRET;

    return jwt.sign(claims, secret, options);
  } catch (err) {
    console.error("JWT sign error:", err);
    return null;
  }
}

/* ---------------------------- VERIFY ---------------------------- */

export function verifyJWT(
  token: string,
  type: "access" | "refresh",
  options?: VerifyOptions
): JwtResult {
  try {
    const secret =
      type === "access" ? ACCESS_SECRET : REFRESH_SECRET;

    const payload = jwt.verify(token, secret, options) as JwtClaims;

    return { payload, expired: false };
  } catch (err: unknown) {
    return {
      payload: null,
      expired: err instanceof Error && err.name === "TokenExpiredError",
    };
  }
}
