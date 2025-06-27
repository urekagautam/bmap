import { Router } from "express";
import { 
  postVacancyDetails,
  getVacancyDetails,
  updateVacancyDetails,
  getNearbyVacancies,
  getAllVacancies,
  getJobDetailsForApplication
} from "../controllers/vacancy.controller.js";
import { verifyOrgJWT } from "../middlewares/verifyOrgJWT.middleware.js";

const router = Router();

// Post a new vacancy
router.route("/vacancy").post(postVacancyDetails);

// Get all details of a vacancy
router.route("/getvacancy/:id").get(getVacancyDetails);

// Get specific details of all vacancies by an organization
router.route("/getAllvacancies/:id").get(getAllVacancies);
router.route("/vacancy/:id").put(updateVacancyDetails)

// Get nearby vacancies (uses query parameters)
router.route("/nearbyVacancies").get(getNearbyVacancies);
router.get("/job-details/:id", getJobDetailsForApplication)

export default router;
