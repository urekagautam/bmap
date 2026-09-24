import { Router } from "express"
import {
  loginUser,
  logoutUser,
  registerUser,
  getUserProfileData,
  updateUserProfile,
  getUserProfile,
  updateUserProfileForApplication,
  uploadProfileImage,
  uploadResume,
  deleteResume,
  updateUserLocation,
  getNearbyVacancies,
  getNearbyOrganizations,
  getJobRecommendations,
} from "../controllers/user.controller.js"
import { verifyJWT } from "../middlewares/auth.middleware.js"
import { uploadImage, uploadResume as uploadResumeMulter } from "../config/multer.js";

const router = Router()

router.route("/auth/signup").post(registerUser)
router.route("/auth/login").post(loginUser)

router.route("/logout").post(verifyJWT, logoutUser)
router.route("/profile-data/:id").get(getUserProfileData)
router.put("/profile-data/:id", updateUserProfileForApplication) 
router.put("/userprofile/:id", updateUserProfile) 
router.route("/userprofile/:id").get(getUserProfile) 

// New route for profile image upload
router.post("/upload-profile-image/:id", verifyJWT, uploadImage.single("image"), uploadProfileImage)
// New routes for resume upload and delete
router.post("/upload-resume/:id", verifyJWT, uploadResumeMulter.single("resume"), uploadResume)
router.delete("/delete-resume/:id", verifyJWT, deleteResume)

router.route("/location/:id").patch(updateUserLocation) 
router.route("/nearby-vacancies/:id").get(getNearbyVacancies)
router.route("/nearby-organizations/:id").get(getNearbyOrganizations)
router.route("/recommendations/:id").get(getJobRecommendations)
// router.route("/organizationByLocation/:id").get(getOrganizationsByDistrict)

export default router
