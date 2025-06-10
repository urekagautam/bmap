import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { Organization } from "../models/organization.model.js"

// REGISTER ORGANIZATION
export const registerOrganization = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body

  const newOrg = await Organization.create({
    email,
    password,
  })

  const accessToken = newOrg.generateAccessToken()
  const refreshToken = newOrg.generateRefreshToken()

  newOrg.refreshToken = refreshToken
  await newOrg.save({ validateBeforeSave: false })

  res.status(201).json(
    new ApiResponse(
      201,
      {
        accessToken,
        refreshToken,
        organization: {
          _id: newOrg._id,
        },
      },
      "Organization registered successfully",
    ),
  )
})

// SETUP ORGANIZATION
export const setupOrganization = asyncHandler(async (req, res, next) => {
  const org = req.org

  const { ownersName, orgName, phoneNo, district, address } = req.body

  if (!ownersName || !orgName || !phoneNo || !district || !address) {
    throw new ApiError(400, "All fields are required")
  }

  org.ownersName = ownersName
  org.orgName = orgName
  org.phoneNo = phoneNo
  org.district = district
  org.address = address

  await org.save()

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
          email: org.email,
        },
      },
      "Organization setup completed successfully",
    ),
  )
})

export const editOrganizationInfo = asyncHandler(async (req, res, next) => {
  try {
    const orgId = req.params.id;
    const org = await Organization.findById(orgId);

    if (!org) {
      throw new ApiError(404, "Organization not found");
    }

    const {
      orgName,
      district,
      address,
      phoneNo,
      email,
      foundedYear,
      ownersName,
      specialities,
      companySize,
      minEmployees,
      maxEmployees,
      description,
      benefits,
      socialProfile,
    } = req.body;

    if (orgName !== undefined) org.orgName = orgName;
    if (district !== undefined) org.district = district;
    if (address !== undefined) org.address = address;
    if (phoneNo !== undefined) org.phoneNo = phoneNo;
    if (email !== undefined) org.email = email;
    if (foundedYear !== undefined) org.foundedYear = foundedYear;
    if (ownersName !== undefined) org.ownersName = ownersName;
    if (specialities !== undefined) org.specialities = specialities; 
    if (companySize !== undefined) org.companySize = companySize;
    if (minEmployees !== undefined) org.minEmployees = minEmployees;
    if (maxEmployees !== undefined) org.maxEmployees = maxEmployees;
    if (description !== undefined) org.description = description;
    if (benefits !== undefined) org.benefits = benefits; 

    if (socialProfile) {
      if (!org.socialProfile) {
        org.socialProfile = {};
      }
      if (socialProfile.insta !== undefined) org.socialProfile.insta = socialProfile.insta;
      if (socialProfile.fb !== undefined) org.socialProfile.fb = socialProfile.fb;
      if (socialProfile.x !== undefined) org.socialProfile.x = socialProfile.x;
    }

    await org.save();

    const updatedOrg = await Organization.findById(orgId).select(
      "orgName district address phoneNo email foundedYear ownersName specialities companySize minEmployees maxEmployees description benefits socialProfile.insta socialProfile.x socialProfile.fb",
    );

    res.status(200).json(
      new ApiResponse(
        200,
        {
          organization: updatedOrg,
        },
        "Organization information updated successfully",
      ),
    );
  } catch (error) {
    console.error("Error updating organization info:", error);
    throw new ApiError(500, "Failed to update organization information");
  }
});


// GET ORGANIZATION INFO FOR EDIT PROFILE
export const getOrganizationProfileForEdit = async (req, res) => {
  try {
    const orgId = req.params.id

    const org = await Organization.findById(orgId).select(
      "orgName district address phoneNo email benefits foundedYear ownersName specialities companySize minEmployees maxEmployees description benefits socialProfile.insta socialProfile.x socialProfile.fb",
    )

    if (!org) {
      return res.status(404).json({ message: "Organization not found" })
    }

    res.status(200).json(org)
  } catch (error) {
    console.error("Error fetching organization profile:", error)
    res.status(500).json({ message: "Server error" })
  }
}

// GET ORGANIZATION PROFILE
export const getOrganizationProfile = async (req, res) => {
  try {
    const orgId = req.query.id
    console.log(orgId)

    const org = await Organization.findById(orgId).select(
      "ownersName orgName phoneNo address district email companySize",
    )

    if (!org) {
      return res.status(404).json({ message: "Organization not found" })
    }

    res.status(200).json(org)
  } catch (error) {
    console.error("Error fetching organization profile:", error)
    res.status(500).json({ message: "Server error" })
  }
}

// GET ORGANIZATION DETAILS
export const getOrganizationDetails = async (req, res) => {
  try {
    const orgId = req.params.id
    const org = await Organization.findById(orgId)

    if (!org) {
      return res.status(404).json({ message: "Organization not found" })
    }

    res.status(200).json(org)
  } catch (error) {
    console.error("Error fetching organization profile:", error)
    res.status(500).json({ message: "Server error" })
  }
}
