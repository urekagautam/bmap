import { Router } from "express";
import { 
  /* loginOrganization, */ 
  registerOrganization, 
  setupOrganization,
  getOrganizationProfile,
  getOrganizationDetails
} from "../controllers/organization.controller.js";
import { verifyOrgJWT } from "../middlewares/verifyOrgJWT.middleware.js";
const router = Router();

// Authenticate User
router.route("/auth/signup").post(registerOrganization);
router.route("/setup").put(verifyOrgJWT, setupOrganization);
router.route("/getOrganizationDetails/:id").get(getOrganizationDetails);

// router.route("/fetchNearbyOrganizations").get(fetchNearbyOrganizations);
// router.route("/auth/login").post(loginOrganization);

router.route("/profile/:id").get(verifyOrgJWT, getOrganizationProfile);

export default router;