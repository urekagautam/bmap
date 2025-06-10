import {Router} from "express";
import { loginUser, logoutUser, registerUser, getUserProfileData, updateUserProfile, getUserProfile, updateUserProfileForApplication } from "../controllers/user.controller.js";
// import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

//Authenticate User
router.route("/auth/signup").post(registerUser);
router.route("/auth/login").post(loginUser);
router.route("/profile-data/:id").get(getUserProfileData);
router.put("/profile-data/:id", updateUserProfileForApplication);
router.put("/userprofile/:id", updateUserProfile);
router.route("/userprofile/:id").get(getUserProfile);

// router.route("/logout").post(verifyJWT, logoutUser)

export default router;