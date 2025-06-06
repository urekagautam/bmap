import jwt from "jsonwebtoken";
import { Organization } from "../models/organization.model.js";
import { ApiError } from "../utils/ApiError.js";
import {asyncHandler} from "../utils/asyncHandler.js"; 

export const verifyOrgJWT = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    console.log("No Authorization header or invalid format");
    throw new ApiError(401, "Unauthorized - No token provided");
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_KEY);
    console.log("Decoded JWT YO:", decoded);

    const organization = await Organization.findById(decoded?._id).select(
      "-password -refreshToken"
    );

    if (!organization) {
      console.log("Organization not found with ID:", decoded?._id);
      throw new ApiError(401, "Organization not found");
    }

    req.org = organization;
    next();
  } catch (err) {
    console.log("JWT verification error:", err.message);
    throw new ApiError(401, "Invalid or expired token");
  }
});
