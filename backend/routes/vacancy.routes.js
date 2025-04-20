import {Router} from "express";
import { createVacancy, getAllVacancies } from "../controllers/vacancy.controller.js";

const router = Router();

router.route("/createVacancy").post(createVacancy);
router.route("/getAllVacancies").get(getAllVacancies);

export default router;