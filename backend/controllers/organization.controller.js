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

// SETUP ORGANIZATION
export const setupOrganization = asyncHandler(async (req, res, next) => {
  const org = req.org; 

  const { ownersName, orgName, phoneNo, district, address } = req.body;

  if (!ownersName || !orgName || !phoneNo || !district || !address) {
    throw new ApiError(400, "All fields are required");
  }

  org.ownersName = ownersName;
  org.orgName = orgName;
  org.phoneNo = phoneNo;
  org.district = district;
  org.address = address;

  await org.save();

  res.status(200).json(
    new ApiResponse(
      200,
      {
        organization: {
          _id: org._id,
          ownersName: org.ownersName,
          orgName: org.orgName,
          phoneNo: org.phoneNo,
          district: org.district,
          address: org.address,
          email: org.email
        }
      },
      "Organization setup completed successfully"
    )
  );
});

//GET ORGANIZATION PROFILE
export const getOrganizationProfile = async (req, res) => {
  try {
   const orgId = req.query.id;
   console.log(orgId);

   const org = await Organization.findById(orgId).select(
      'ownersName orgName phoneNo address district email companySize'
    );

    if (!org) {
      return res.status(404).json({ message: "Organization not found" });
    }

    res.status(200).json(org);
  } catch (error) {
    console.error("Error fetching organization profile:", error);
    res.status(500).json({ message: "Server error" });
  }
};


