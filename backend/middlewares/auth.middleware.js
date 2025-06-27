import jwt from "jsonwebtoken"
import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { User } from "../models/user.model.js"
import { config } from "../config/config.js"

export const verifyJWT = asyncHandler(async (req, res, next) => {
  try {
    // getting token from Authorization header first, then from cookies
    let token = req.header("Authorization")?.replace("Bearer ", "")

    if (!token) {
      token = req.cookies?.accessToken
    }

    console.log("🔍 Auth Debug:")
    console.log("- Authorization header:", req.header("Authorization") ? "Present" : "Missing")
    console.log("- Cookie accessToken:", req.cookies?.accessToken ? "Present" : "Missing")
    console.log("- Final token:", token ? "FOUND" : "MISSING")
    console.log(
      "- Token source:",
      req.header("Authorization") ? "Header" : req.cookies?.accessToken ? "Cookie" : "None",
    )
    console.log("- Token preview:", token ? `${token.substring(0, 30)}...` : "N/A")

    if (!token) {
      throw new ApiError(401, "Unauthorized - No access token provided")
    }

    if (!config.accessTokenKey) {
      console.error(" JWT SECRET MISSING!")
      throw new ApiError(500, "Server configuration error")
    }

    // Verifying token
    const decodedToken = jwt.verify(token, config.accessTokenKey)
    console.log("Token decoded successfully:", { userId: decodedToken._id })

    const user = await User.findById(decodedToken._id).select("-password -refreshToken")

    if (!user) {
      throw new ApiError(401, "Invalid access token - User not found")
    }

    req.user = user
    console.log("User authenticated:", user.email)
    next()
  } catch (error) {
    console.error(" Auth middleware error:", error.message)

    if (error.name === "JsonWebTokenError") {
      throw new ApiError(401, "Invalid access token format")
    } else if (error.name === "TokenExpiredError") {
      throw new ApiError(401, "Access token has expired - Please login again")
    } else if (error instanceof ApiError) {
      throw error
    } else {
      throw new ApiError(401, "Authentication failed")
    }
  }
})
