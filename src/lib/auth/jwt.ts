import { SignJWT, jwtVerify } from "jose";
import { ACCESS_TOKEN_EXPIRY } from "./constants";

export type AccessTokenPayload = {
  sub: string;
  email: string;
  role: string;
  jti: string;
};

const ISS = "qtodev";
const AUD = "qtodev-admin";

function getSecret(): Uint8Array {
  const secret = process.env.JWT_ACCESS_SECRET;
  if (!secret) {
    throw new Error(
      "JWT_ACCESS_SECRET is not set. Generate one with: openssl rand -hex 64"
    );
  }
  return new TextEncoder().encode(secret);
}

export async function signAccessToken(
  payload: Omit<AccessTokenPayload, "jti">
): Promise<string> {
  const jti = crypto.randomUUID();
  return new SignJWT({ email: payload.email, role: payload.role })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(payload.sub)
    .setJti(jti)
    .setIssuer(ISS)
    .setAudience(AUD)
    .setExpirationTime(`${ACCESS_TOKEN_EXPIRY}s`)
    .setIssuedAt()
    .sign(getSecret());
}

export async function verifyAccessToken(
  token: string
): Promise<AccessTokenPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getSecret(), {
      issuer: ISS,
      audience: AUD,
    });
    return {
      sub: payload.sub as string,
      email: payload["email"] as string,
      role: payload["role"] as string,
      jti: payload.jti as string,
    };
  } catch {
    return null;
  }
}
