import { Response } from "express";
import jwt from "jsonwebtoken";

export const generateJWT = async (userId: unknown, res: Response) => {
  if (!process.env.JWT_SECRET) throw new Error("Missing JWT Secret");
  const token = await jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  res.cookie("jwt", token, {
    maxAge: 7 * 1000 * 60 * 60 * 24,
    httpOnly: true,
    sameSite: "strict",
    secure: process.env?.NODE_ENV != "development",
  });

  return token;
};

export function basicErrorHandling(
  e: unknown,
  res: Response,
  message?: string,
  statusCode: number = 400
) {
  console.log("Error:", e);
  if (message) {
    res.status(statusCode).json({ message: message });
    return;
  }
  if (e instanceof Error) {
    res.status(statusCode).json({
      message: e.message,
    });
  } else {
    res.status(statusCode).json({
      message: "Unknown Error",
    });
  }
}
