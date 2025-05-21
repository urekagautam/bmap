import {Router} from "express";
import { /* loginOrganization, */ registerOrganization } from "../controllers/organization.controller.js";

const router = Router();

//Authenticate User
router.route("/auth/signup").post(registerOrganization);
// router.route("/auth/login").post(loginOrganization);


export default router;