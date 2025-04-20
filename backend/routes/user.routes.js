import {Router} from "express";
import { loginUser, logoutUser, registerUser } from "../controllers/user.controller.js";

const router = Router();

//Authenticate User
router.route("/auth/signup").post(registerUser);
router.route("/auth/login").post(loginUser);

//secured routes
// router.route("/logout").post(verifyJWT, logoutUser)

export default router;