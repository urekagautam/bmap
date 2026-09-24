import express from "express"
import { User } from "../models/user.model.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { ApiError } from "../utils/ApiError.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { uploadImage } from "../config/multer.js"
import {
  loginOrganization,
  registerOrganization,
  setupOrganization,
  editOrganizationInfo,
  getOrganizationProfile,
  getOrganizationProfileForEdit,
  getOrganizationDetails,
  uploadOrgImage,
  deleteOrgImage,
  updateOrganizationLocation,
} from "../controllers/organization.controller.js"
import { verifyOrgJWT } from "../middlewares/verifyOrgJWT.middleware.js"

const router = express.Router()

router.route("/auth/signup").post(registerOrganization)
router.route("/auth/login").post(loginOrganization)
router.route("/setup").put(verifyOrgJWT, setupOrganization)
router.put("/editOrganizationInfo/:id", editOrganizationInfo)
router.route("/getOrganizationDetails/:id").get(getOrganizationDetails)
router.route("/getOrganizationDetailsForEdit/:id").get(getOrganizationProfileForEdit)

// Getting follower count for an organization (public route)
router.get(
  "/:orgId/followers",
  asyncHandler(async (req, res, next) => {
    const { orgId } = req.params

    if (!orgId) {
      return next(new ApiError(400, "Organization ID is required"))
    }

    try {
      const followerCount = await User.countDocuments({ followed: orgId })

      return res.status(200).json(
        new ApiResponse(
          200,
          {
            organizationId: orgId,
            followerCount,
          },
          "Follower count retrieved successfully",
        ),
      )
    } catch (error) {
      console.error("Get follower count error:", error)
      return next(new ApiError(500, "Failed to get follower count"))
    }
  }),
)

// Organization profile routes
router.route("/organization/profile/:id").get(verifyOrgJWT, getOrganizationProfile)
router.route("/organization/details/:id").get(getOrganizationDetails)
router.route("/organization/edit/:id").get(verifyOrgJWT, getOrganizationProfileForEdit)

// Organization image routes
router.post("/upload-image/:id", verifyOrgJWT, uploadImage.single("image"), uploadOrgImage)
router.delete("/delete-image/:id", verifyOrgJWT, deleteOrgImage)

// Legacy routes (for backward compatibility)
router.route("/profile/:id").get(verifyOrgJWT, getOrganizationProfile)
router.route("/getOrganizationDetails/:id").get(getOrganizationDetails)
router.route("/getOrganizationDetailsForEdit/:id").get(getOrganizationProfileForEdit)
router.patch("/updateLocation/:id", updateOrganizationLocation)

export default router
