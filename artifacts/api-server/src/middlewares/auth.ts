import { getAuth } from "@clerk/express";
import type { NextFunction, Request, Response } from "express";

export type AuthenticatedRequest = Request & { userId?: string };

export function requireAuth(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): void {
  const auth = getAuth(req);
  const userId = String(auth?.sessionClaims?.userId || auth?.userId || "");
  if (!userId) {
    res.status(401).json({ error: "Authentication required" });
    return;
  }
  req.userId = userId;
  next();
}

export function requireAdmin(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): void {
  const auth = getAuth(req);
  const userId = String(auth?.sessionClaims?.userId || auth?.userId || "");
  const claims = auth?.sessionClaims as
    | { metadata?: { role?: string }; publicMetadata?: { role?: string } }
    | undefined;
  const role = claims?.metadata?.role ?? claims?.publicMetadata?.role;
  if (!userId) {
    res.status(401).json({ error: "Authentication required" });
    return;
  }
  if (role !== "admin") {
    res.status(403).json({ error: "Administrator access required" });
    return;
  }
  req.userId = userId;
  next();
}