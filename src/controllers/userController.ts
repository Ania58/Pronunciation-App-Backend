import { Request, Response } from "express";
import admin from "../utils/firebaseAdmin";
import { AuthenticatedRequest } from "../middleware/verifyToken";
import { PronunciationAttemptModel } from "../models/PronunciationAttempt";
import { WordStatus } from "../models/WordStatus";
import { v2 as cloudinary } from "cloudinary";

export const deleteAccount = async (req: Request, res: Response): Promise<void> => {
  const user = (req as AuthenticatedRequest).user;

  if (!user || !user.uid) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  try {
    const attempts = await PronunciationAttemptModel.find({ userId: user.uid });

    for (const attempt of attempts) {
      const url = attempt.audioUrl;
      const fileNameWithExt = url?.split("/").pop();
      const fileName = fileNameWithExt?.split(".")[0];
      const publicId = `audios/${fileName}`;

      try {
        await cloudinary.uploader.destroy(publicId, { resource_type: "video" });
        console.log(`[CLOUDINARY] Deleted ${publicId}`);
      } catch (err) {
        console.warn(`[CLOUDINARY] Failed to delete ${publicId}:`, err);
      }
    }

    await PronunciationAttemptModel.deleteMany({ userId: user.uid });
    await WordStatus.deleteMany({ userId: user.uid });

    await admin.auth().deleteUser(user.uid);

    res.status(200).json({ message: "Account and all associated data deleted" });
  } catch (error: any) {
    console.error("Error deleting account:", error);
    res.status(500).json({ message: "Failed to delete account", error: error.message });
  }
};
