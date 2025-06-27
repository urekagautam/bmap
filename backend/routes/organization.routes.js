import { Router } from "express";
import { 
  loginOrganization, 
  registerOrganization, 
  setupOrganization,
 editOrganizationInfo, 
  getOrganizationProfile,
  getOrganizationProfileForEdit,
  getOrganizationDetails
} from "../controllers/organization.controller.js";
import { verifyOrgJWT } from "../middlewares/verifyOrgJWT.middleware.js";
const router = Router();

// Authenticate User
router.route("/auth/signup").post(registerOrganization);
router.route("/auth/login").post(loginOrganization);
router.route("/setup").put(verifyOrgJWT, setupOrganization);
router.put('/editOrganizationInfo/:id', editOrganizationInfo);
router.route("/getOrganizationDetails/:id").get(getOrganizationDetails);
router.route("/getOrganizationDetailsForEdit/:id").get(getOrganizationProfileForEdit);

// router.route("/fetchNearbyOrganizations").get(fetchNearbyOrganizations);
// router.route("/auth/login").post(loginOrganization);

router.route("/profile/:id").get(verifyOrgJWT, getOrganizationProfile);

export default router;