import { Router } from "express";
import { submitJobApplication, getUserApplications, updateApplicationStatusOnView, getVacancyApplications, getOrganizationVacancies, getApplicationDetails, getRecentOrgApplications, updateApplicationStatus, getDashboardStats, checkUserApplicationStatus } from "../controllers/application.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { verifyOrgJWT } from "../middlewares/verifyOrgJWT.middleware.js";
const router = Router();

// Submit job application
router.post("/submit", submitJobApplication);
// Get all applications for a user
router.get("/user/:userId", getUserApplications);
// Update application status when user views
router.put("/view/:applicationId", updateApplicationStatusOnView);
router.put("/status/:applicationId", verifyOrgJWT, updateApplicationStatus);

router.route("/applications/recent/:orgId").get(getRecentOrgApplications);
router.route("/applications/:orgId").get(getOrganizationVacancies);
router.route("/vacancyApplications/:vacancyId").get(getVacancyApplications)
router.route("/applicationDetails/:applicationId").get(getApplicationDetails)
router.get("/dashboard-stats/:orgId", verifyOrgJWT, getDashboardStats);
router.get("/check-status/:userId/:jobId", checkUserApplicationStatus);

export default router;