import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

export interface IAuthenticatedRequest extends Request {
  userId?: string; // Ensure userId is always a string
}

export function jwtMiddleware(
  req: IAuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  const token = req.cookies?.jwt;
  
  if (!token) {
    res.status(403).json({ error: "Unauthorized request" });
    return;
  }

  if (!process.env.JWT_SECRET) {
    res.status(500).json({ error: "Missing JWT secret" });
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET) as string | JwtPayload;

    if (typeof decoded === "string") {
      req.userId = decoded; // If token contains a simple string (not common)
    } else if (decoded && typeof decoded === "object" && "userId" in decoded) {
      req.userId = String(decoded.userId); // Extract userId safely
    } else {
      res.status(403).json({ error: "Unauthorized request. Invalid token detected." });
      return;
    }

    next();
  } catch (err) {
    res.status(403).json({ error: "Invalid or expired token" });
    return;
  }
}
