import { createRemoteJWKSet, jwtVerify, JWTPayload } from "jose";
import type { Request, Response, NextFunction } from "express";

const issuer = process.env.OKTA_ISSUER || process.env.AUTH0_ISSUER;
const audience = process.env.OKTA_AUDIENCE || process.env.AUTH0_AUDIENCE;

const jwks = issuer ? createRemoteJWKSet(new URL(`${issuer}/v1/keys`)) : undefined;

export interface AuthUser {
  sub: string;
  email?: string;
  roles?: string[];
}

export function requireAuth(roles?: string[]) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const auth = req.headers.authorization || "";
      const [, token] = auth.split(" ");
      if (!token || !jwks) return res.status(401).json({ error: "unauthorized" });
      const { payload } = await jwtVerify(token, jwks, {
        issuer,
        audience
      });
      const user: AuthUser = {
        sub: String(payload.sub || ""),
        email: String((payload as JWTPayload)["email"] || ""),
        roles: ((payload as JWTPayload)["roles"] as string[]) || []
      };
      (req as any).user = user;
      if (roles && roles.length) {
        const ok = user.roles?.some((r) => roles.includes(r));
        if (!ok) return res.status(403).json({ error: "forbidden" });
      }
      next();
    } catch (e) {
      return res.status(401).json({ error: "invalid_token" });
    }
  };
}
