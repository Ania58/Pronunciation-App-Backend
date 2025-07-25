import { Request, Response, NextFunction } from "express";
import admin from "../utils/firebaseAdmin";

export interface AuthenticatedRequest extends Request {
  user?: {
    uid: string;
    email?: string;
  };
}

export const verifyToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) : Promise<void> => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ message: "No token provided" });
    return;
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = await admin.auth().verifyIdToken(token);

    (req as AuthenticatedRequest).user = {
      uid: decoded.uid,
      email: decoded.email,
    };

    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid or expired token" });
    return;
  }
};
