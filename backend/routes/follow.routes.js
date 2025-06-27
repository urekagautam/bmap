import express from "express"
import {
  followOrganization,
  unfollowOrganization,
  checkFollowStatus,
  getFollowedOrganizations,
  toggleFollowOrganization,
} from "../controllers/follow.controller.js"
import { verifyJWT } from "../middlewares/auth.middleware.js"

const router = express.Router()

router.use(verifyJWT)

router.post("/follow/:orgId", followOrganization)
router.delete("/follow/:orgId", unfollowOrganization)

router.get("/follow/status/:orgId", checkFollowStatus)
router.get("/follow/following", getFollowedOrganizations)
router.patch("/follow/toggle/:orgId", toggleFollowOrganization)

export default router
