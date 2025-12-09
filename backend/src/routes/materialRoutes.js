import express from 'express';
import { resolveMaterials } from "../controllers/materialController.js";

const router = express.Router();

router.post("/resolve", resolveMaterials);

export default router;