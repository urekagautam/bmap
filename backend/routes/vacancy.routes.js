import { Router } from "express";
import { 
  postVacancyDetails,
  getVacancyDetails,
  getNearbyVacancies,
  getAllVacancies
} from "../controllers/vacancy.controller.js";
import { verifyOrgJWT } from "../middlewares/verifyOrgJWT.middleware.js";

const router = Router();

// Post a new vacancy
router.route("/vacancy").post(postVacancyDetails);

// Get all details of a vacancy
router.route("/getvacancy/:id").get(getVacancyDetails);

// Get specific details of all vacancies by an organization
router.route("/getAllvacancies/:id").get(getAllVacancies);

// Get nearby vacancies (uses query parameters)
router.route("/nearbyVacancies").get(getNearbyVacancies);

export default router;
