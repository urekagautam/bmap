import { Router } from "express";
import {registerOrganization, loginOrganization, logoutOrganization} from "../controllers/organization.contoller.js"

const router = Router();

router.route("/auth/signup").post(registerOrganization);
router.route("/auth/login").post(loginOrganization);

export default router;