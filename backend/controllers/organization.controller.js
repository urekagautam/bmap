import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Organization } from "../models/organization.model.js";

// REGISTER ORGANIZATION

export const registerOrganization = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  const newOrg = await Organization.create({
    email,
    password,
  });
  
  const accessToken = newOrg.generateAccessToken();
  const refreshToken = newOrg.generateRefreshToken();

  newOrg.refreshToken = refreshToken;
  await newOrg.save({ validateBeforeSave: false });

  res.status(201).json(
    new ApiResponse(
      201,
      { 
        accessToken, 
        refreshToken,
        organization: {
          _id: newOrg._id
        }
      },
      "Organization registered successfully"
    )
  );
});
