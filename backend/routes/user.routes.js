import {Router} from "express";
import { loginUser, logoutUser, registerUser } from "../controllers/user.controller.js";

const router = Router();

router.route("/api/v1/auth/signup").post(registerUser);
router.route("/login").post(loginUser);

//secured routes
// router.route("/logout").post(verifyJWT, logoutUser)

export default router;