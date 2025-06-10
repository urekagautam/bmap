import { Router } from "express";
import { submitJobApplication } from "../controllers/application.controller.js";

const router = Router();

// Submit job application
router.post("/submit", submitJobApplication);

export default router;