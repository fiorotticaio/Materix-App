import express from "express";
import { requestPasswordReset, validateResetToken, resetPassword } from "../controllers/passwordResetController.js";

const router = express.Router();

router.post("/request", requestPasswordReset);        // Envia o e-mail
router.get("/validate/:token", validateResetToken);   // Checa token
router.post("/reset/:token", resetPassword);          // Troca senha

export default router;