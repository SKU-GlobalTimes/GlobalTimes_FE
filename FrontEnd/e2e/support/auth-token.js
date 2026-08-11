import { createHmac } from "node:crypto";

export const E2E_USER = {
  id: 990_098,
  email: "authenticated-e2e@example.com",
  nickname: "Authenticated E2E User",
};

const encode = (value) =>
  Buffer.from(JSON.stringify(value)).toString("base64url");

export function createE2eJwt() {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET is required for the authenticated E2E flow.");
  }

  const now = Math.floor(Date.now() / 1_000);
  const header = encode({ alg: "HS256", typ: "JWT" });
  const payload = encode({
    sub: String(E2E_USER.id),
    email: E2E_USER.email,
    iat: now,
    exp: now + 10 * 60,
  });
  const unsignedToken = `${header}.${payload}`;
  const signature = createHmac("sha256", secret)
    .update(unsignedToken)
    .digest("base64url");

  return `${unsignedToken}.${signature}`;
}
