import type { Express, Request, Response, NextFunction } from "express";
import crypto from "crypto";

const ADMIN_USERNAME = process.env.ADMIN_USERNAME || "webmaster";
const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH || "";

const activeSessions = new Map<string, { username: string; expiresAt: Date }>();

function hashPassword(password: string): string {
  return crypto.createHash("sha256").update(password).digest("hex");
}

function generateSessionToken(): string {
  return crypto.randomBytes(32).toString("hex");
}

export function registerAdminAuthRoutes(app: Express): void {
  app.post("/api/admin/login", (req: Request, res: Response) => {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: "Username and password required" });
    }

    const passwordHash = hashPassword(password);

    if (username === ADMIN_USERNAME && passwordHash === ADMIN_PASSWORD_HASH) {
      const token = generateSessionToken();
      const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

      activeSessions.set(token, { username, expiresAt });

      res.json({ token, expiresAt: expiresAt.toISOString() });
    } else {
      res.status(401).json({ error: "Invalid credentials" });
    }
  });

  app.post("/api/admin/logout", (req: Request, res: Response) => {
    const token = req.headers.authorization?.replace("Bearer ", "");
    if (token) {
      activeSessions.delete(token);
    }
    res.json({ success: true });
  });

  app.get("/api/admin/verify", (req: Request, res: Response) => {
    const token = req.headers.authorization?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({ authenticated: false });
    }

    const session = activeSessions.get(token);

    if (!session || session.expiresAt < new Date()) {
      activeSessions.delete(token || "");
      return res.status(401).json({ authenticated: false });
    }

    res.json({ authenticated: true, username: session.username });
  });
}

export function requireAdminAuth(req: Request, res: Response, next: NextFunction): void {
  const token = req.headers.authorization?.replace("Bearer ", "");

  if (!token) {
    res.status(401).json({ error: "Authentication required" });
    return;
  }

  const session = activeSessions.get(token);

  if (!session || session.expiresAt < new Date()) {
    activeSessions.delete(token);
    res.status(401).json({ error: "Session expired" });
    return;
  }

  next();
}
