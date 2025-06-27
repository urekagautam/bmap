import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { Organization } from "../models/organization.model.js"
import { User } from "../models/user.model.js"

// Helper function to get follower count for an organization
const getFollowerCount = async (orgId) => {
  try {
    const followerCount = await User.countDocuments({ followed: orgId })
    return followerCount
  } catch (error) {
    console.error("Error getting follower count:", error)
    return 0
  }
}

const followOrganization = asyncHandler(async (req, res, next) => {
  const { orgId } = req.params
  const userId = req.user._id

  console.log("Follow request - User:", userId, "Organization:", orgId)

  if (!orgId) {
    return next(new ApiError(400, "Organization ID is required"))
  }

  try {
    const organization = await Organization.findById(orgId)
    if (!organization) {
      return next(new ApiError(404, "Organization not found"))
    }

    const user = await User.findById(userId)
    if (!user) {
      return next(new ApiError(404, "User not found"))
    }

    const isAlreadyFollowing = user.followed.includes(orgId)
    if (isAlreadyFollowing) {
      return next(new ApiError(400, "Already following this organization"))
    }

    user.followed.push(orgId)
    await user.save()

    // Getting updated follower count
    const followerCount = await getFollowerCount(orgId)

    console.log("Successfully followed organization:", orgId)

    return res.status(200).json(
      new ApiResponse(
        200,
        {
          organizationId: orgId,
          organizationName: organization.orgName,
          isFollowing: true,
          totalFollowing: user.followed.length,
          followerCount,
        },
        "Organization followed successfully",
      ),
    )
  } catch (error) {
    console.error("Follow organization error:", error)
    return next(new ApiError(500, error.message || "Failed to follow organization"))
  }
})

// Unfollowing an organization
const unfollowOrganization = asyncHandler(async (req, res, next) => {
  const { orgId } = req.params
  const userId = req.user._id

  console.log("Unfollow request - User:", userId, "Organization:", orgId)

  if (!orgId) {
    return next(new ApiError(400, "Organization ID is required"))
  }

  try {
    const user = await User.findById(userId)
    if (!user) {
      return next(new ApiError(404, "User not found"))
    }

    const isFollowing = user.followed.includes(orgId)
    if (!isFollowing) {
      return next(new ApiError(400, "Not following this organization"))
    }

    user.followed = user.followed.filter((id) => id.toString() !== orgId.toString())
    await user.save()

    // Getting updated follower count
    const followerCount = await getFollowerCount(orgId)

    console.log("Successfully unfollowed organization:", orgId)

    return res.status(200).json(
      new ApiResponse(
        200,
        {
          organizationId: orgId,
          isFollowing: false,
          totalFollowing: user.followed.length,
          followerCount, 
        },
        "Organization unfollowed successfully",
      ),
    )
  } catch (error) {
    console.error("Unfollow organization error:", error)
    return next(new ApiError(500, error.message || "Failed to unfollow organization"))
  }
})

// Checking follow status for a specific organization
const checkFollowStatus = asyncHandler(async (req, res, next) => {
  const { orgId } = req.params
  const userId = req.user._id

  console.log("Check follow status - User:", userId, "Organization:", orgId)

  if (!orgId) {
    return next(new ApiError(400, "Organization ID is required"))
  }

  try {
    const organization = await Organization.findById(orgId)
    if (!organization) {
      return next(new ApiError(404, "Organization not found"))
    }

    const user = await User.findById(userId)
    if (!user) {
      return next(new ApiError(404, "User not found"))
    }

    const isFollowing = user.followed.includes(orgId)
    const followerCount = await getFollowerCount(orgId)

    return res.status(200).json(
      new ApiResponse(
        200,
        {
          organizationId: orgId,
          organizationName: organization.orgName,
          isFollowing,
          totalFollowing: user.followed.length,
          followerCount, // Add this
        },
        "Follow status retrieved successfully",
      ),
    )
  } catch (error) {
    console.error("Check follow status error:", error)
    return next(new ApiError(500, error.message || "Failed to check follow status"))
  }
})

// Getting all followed organizations for the current user
const getFollowedOrganizations = asyncHandler(async (req, res, next) => {
  const userId = req.user._id

  console.log("Get followed organizations for user:", userId)

  try {
    const user = await User.findById(userId).populate({
      path: "followed",
      select: "orgName email industry address district foundedYear companySize minEmployees maxEmployees image",
    })

    if (!user) {
      return next(new ApiError(404, "User not found"))
    }

    // Adding follower count to each organization
    const followedWithCounts = await Promise.all(
      user.followed.map(async (org) => {
        const followerCount = await getFollowerCount(org._id)
        return {
          ...org.toObject(),
          followerCount,
        }
      }),
    )

    return res.status(200).json(
      new ApiResponse(
        200,
        {
          followedOrganizations: followedWithCounts,
          totalFollowing: user.followed.length,
        },
        "Followed organizations retrieved successfully",
      ),
    )
  } catch (error) {
    console.error("Get followed organizations error:", error)
    return next(new ApiError(500, error.message || "Failed to get followed organizations"))
  }
})

// Toggling follow status
const toggleFollowOrganization = asyncHandler(async (req, res, next) => {
  const { orgId } = req.params
  const userId = req.user._id

  console.log("Toggle follow - User:", userId, "Organization:", orgId)

  if (!orgId) {
    return next(new ApiError(400, "Organization ID is required"))
  }

  try {
    const organization = await Organization.findById(orgId)
    if (!organization) {
      return next(new ApiError(404, "Organization not found"))
    }

    const user = await User.findById(userId)
    if (!user) {
      return next(new ApiError(404, "User not found"))
    }

    const isCurrentlyFollowing = user.followed.includes(orgId)

    if (isCurrentlyFollowing) {
      user.followed = user.followed.filter((id) => id.toString() !== orgId.toString())
    } else {
      user.followed.push(orgId)
    }

    await user.save()

    const newFollowStatus = !isCurrentlyFollowing
    const followerCount = await getFollowerCount(orgId)

    console.log(`Successfully ${newFollowStatus ? "followed" : "unfollowed"} organization:`, orgId)

    return res.status(200).json(
      new ApiResponse(
        200,
        {
          organizationId: orgId,
          organizationName: organization.orgName,
          isFollowing: newFollowStatus,
          totalFollowing: user.followed.length,
          followerCount, 
          action: newFollowStatus ? "followed" : "unfollowed",
        },
        `Organization ${newFollowStatus ? "followed" : "unfollowed"} successfully`,
      ),
    )
  } catch (error) {
    console.error("Toggle follow organization error:", error)
    return next(new ApiError(500, error.message || "Failed to toggle follow status"))
  }
})

export {
  followOrganization,
  unfollowOrganization,
  checkFollowStatus,
  getFollowedOrganizations,
  toggleFollowOrganization,
}
