import { Router } from "express";
import { deleteAccount } from "../controllers/userController";
import { verifyToken } from "../middleware/verifyToken";

const router = Router();

router.delete("/delete", verifyToken, deleteAccount);

export default router;
