import express from 'express';
import { resolveMaterials, getMaterials } from "../controllers/materialController.js";

const router = express.Router();

router.post("/resolve", resolveMaterials);
router.get("/items", getMaterials);

export default router;