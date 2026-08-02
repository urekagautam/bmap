import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { Organization } from "../models/organization.model.js"

//generating access and refresh tokens
const generateAccessAndRefreshTokens = async (orgId) => {
  try {
    const organization = await Organization.findById(orgId)
    if (!organization) {
      throw new ApiError(404, "Organization not found")
    }

    const accessToken = organization.generateAccessToken()
    const refreshToken = organization.generateRefreshToken()

    organization.refreshToken = refreshToken
    await organization.save({ validateBeforeSave: false })

    return { accessToken, refreshToken }
  } catch (error) {
    console.error("Token generation error:", error)
    throw new ApiError(500, "Something went wrong while generating tokens")
  }
}

// REGISTER ORGANIZATION
/* export const registerOrganization = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body

  const newOrg = await Organization.create({
    email,
    password,
  })

   if (await Organization.findOne({ email })) {
      return next(new ApiError(400, "Email is already used"))
    }

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
}) */

  // REGISTER ORGANIZATION - FIXED VERSION
export const registerOrganization = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body

  console.log("Registration attempt for email:", email)

  // Validate required fields
  if (!email || !password) {
    console.log("Missing required fields")
    return res.status(400).json({
      statusCode: 400,
      success: false,
      message: "Email and password are required",
    })
  }

  try {
    // Check if organization with this email already exists BEFORE creating
    const existingOrg = await Organization.findOne({ email })
    console.log("Existing organization check:", existingOrg ? "Found" : "Not found")

    if (existingOrg) {
      console.log("Email already exists:", email)
      return res.status(400).json({
        statusCode: 400,
        success: false,
        message: "Email is already used",
      })
    }

    // Create new organization
    const newOrg = await Organization.create({
      email,
      password,
    })

    console.log("New organization created:", newOrg._id)

    // Generate tokens
    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(newOrg._id)

    // Get organization without sensitive data
    const createdOrganization = await Organization.findById(newOrg._id).select("-password -refreshToken")

    // Cookie options
    const options = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    }

    // Send response with cookies
    return res
      .status(201)
      .cookie("orgAccessToken", accessToken, options)
      .cookie("orgRefreshToken", refreshToken, options)
      .json({
        statusCode: 201,
        success: true,
        message: "Organization registered successfully",
        data: {
          accessToken,
          refreshToken,
          organization: createdOrganization,
        },
      })
  } catch (error) {
    console.error("Organization registration error:", error)

    // Handle duplicate key error (in case of race condition)
    if (error.code === 11000 && error.keyPattern?.email) {
      console.log("Duplicate key error for email:", email)
      return res.status(400).json({
        statusCode: 400,
        success: false,
        message: "Email is already used",
      })
    }

    return res.status(500).json({
      statusCode: 500,
      success: false,
      message: error.message || "Something went wrong while registering organization",
    })
  }
})

// Login Organization
export const loginOrganization = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body

  console.log("Organization login attempt for:", email)
  console.log("Password provided:", password ? "Yes" : "No")

  if (!email || !password) {
    return next(new ApiError(400, "Email and password are required"))
  }

  try {
    const organization = await Organization.findOne({ email }).select("+password")
    console.log("Organization found:", organization ? "Yes" : "No")

    if (!organization) {
      return next(new ApiError(400, "Invalid email or password"))
    }

    console.log("Stored password hash exists:", organization.password ? "Yes" : "No")
    console.log("Password hash length:", organization.password ? organization.password.length : 0)

    if (!organization.password) {
      console.error("No password hash found for organization:", email)
      return next(new ApiError(500, "Organization password not found. Please contact support."))
    }

    if (!password || typeof password !== "string") {
      console.error("Invalid password format provided")
      return next(new ApiError(400, "Invalid password format"))
    }

    if (!organization.password || typeof organization.password !== "string") {
      console.error("Invalid password hash in database")
      return next(new ApiError(500, "Invalid organization data. Please contact support."))
    }

    const isPasswordCorrect = await organization.isPasswordCorrect(password)
    console.log("Password correct:", isPasswordCorrect)

    if (!isPasswordCorrect) {
      return next(new ApiError(401, "Invalid email or password"))
    }

    // Generating tokens
    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(organization._id)

    // Getting organization without sensitive data
    const loggedInOrganization = await Organization.findById(organization._id).select("-password -refreshToken")

    // Cookie options
    const options = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    }

    // Prepare the response data
    const responseData = {
      statusCode: 200,
      success: true,
      message: "Organization logged in successfully",
      data: {
        organization: loggedInOrganization,
        accessToken,
        refreshToken,
      }
    };

    // Log the response data for debugging
    console.log('Login response data:', JSON.stringify(responseData, null, 2));

    // Send the response with cookies
    return res
      .status(200)
      .cookie("orgAccessToken", accessToken, options)
      .cookie("orgRefreshToken", refreshToken, options)
      .json(responseData)
  } catch (error) {
    console.error("Organization login error:", error)
    return next(new ApiError(500, error.message || "Internal server error during login"))
  }
})

// SETUP ORGANIZATION
export const setupOrganization = asyncHandler(async (req, res, next) => {
  const org = req.org

  if (!org) {
    return res.status(401).json({ message: "Unauthorized: Organization not found in request context." });
  }

  const { ownersName, orgName, phoneNo, district, address } = req.body

  if (!ownersName || !orgName || !phoneNo || !district || !address) {
    return res.status(400).json({ message: "All fields are required" });
  }

  org.ownersName = ownersName
  org.orgName = orgName
  org.phoneNo = phoneNo
  org.district = district
  org.address = address

  try {
    await org.save()
  } catch (err) {
    console.error("Error saving organization during setup:", err);
    return res.status(500).json({ message: "Failed to save organization setup. Please try again later." });
  }

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
// Update Organization Location (same pattern as user location)
export const updateOrganizationLocation = asyncHandler(async (req, res, next) => {
  try {
    const orgId = req.params.id
    const { location } = req.body

    console.log("Updating organization location for orgId:", orgId, "with location:", location)

    // Validate location data
    if (!location || typeof location.lat !== "number" || typeof location.lng !== "number") {
      return next(new ApiError(400, "Invalid location data. Latitude and longitude are required."))
    }

    // Validate latitude and longitude ranges
    if (location.lat < -90 || location.lat > 90 || location.lng < -180 || location.lng > 180) {
      return next(
        new ApiError(400, "Invalid coordinates. Latitude must be between -90 and 90, longitude between -180 and 180."),
      )
    }

    // Update organization location in database (using GeoJSON format like your schema)
    const updatedOrganization = await Organization.findByIdAndUpdate(
      orgId,
      {
        location: {
          type: "Point",
          coordinates: [location.lng, location.lat], // GeoJSON format: [longitude, latitude]
        },
      },
      { new: true, runValidators: true },
    ).select("_id orgName email location updatedAt")

    if (!updatedOrganization) {
      return next(new ApiError(404, "Organization not found"))
    }

    const responseData = {
      _id: updatedOrganization._id,
      orgName: updatedOrganization.orgName,
      email: updatedOrganization.email,
      location: {
        lat: updatedOrganization.location.coordinates[1], // Convert back to lat/lng for frontend
        lng: updatedOrganization.location.coordinates[0],
      },
      updatedAt: updatedOrganization.updatedAt,
    }

    console.log("Organization location update response:", responseData)

    return res.status(200).json(new ApiResponse(200, responseData, "Organization location updated successfully"))
  } catch (error) {
    console.error("Error updating organization location:", error)
    return next(new ApiError(500, "Something went wrong while updating organization location"))
  }
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
      industry,
      latitude,
      longitude,
      companyLogo,
      companyCover
    } = req.body;

    if (orgName !== undefined) org.orgName = orgName;
    if (district !== undefined) org.district = district;
    if (address !== undefined) org.address = address;
    if (phoneNo !== undefined) org.phoneNo = phoneNo;
    if (email !== undefined) org.email = email;
    if (industry !== undefined) org.industry = industry;
    if (foundedYear !== undefined) org.foundedYear = foundedYear;
    if (ownersName !== undefined) org.ownersName = ownersName;
    if (specialities !== undefined) org.specialities = specialities; 
    if (companySize !== undefined) org.companySize = companySize;
    if (minEmployees !== undefined) org.minEmployees = minEmployees;
    if (maxEmployees !== undefined) org.maxEmployees = maxEmployees;
    if (description !== undefined) org.description = description;
    if (benefits !== undefined) org.benefits = benefits; 

    if (latitude !== undefined && longitude !== undefined) {
      org.location = {
        type: "Point",
        coordinates: [longitude, latitude], // GeoJSON format [lng, lat]
      };
    }

    if (socialProfile) {
      if (!org.socialProfile) {
        org.socialProfile = {};
      }
      if (socialProfile.insta !== undefined) org.socialProfile.insta = socialProfile.insta;
      if (socialProfile.fb !== undefined) org.socialProfile.fb = socialProfile.fb;
      if (socialProfile.x !== undefined) org.socialProfile.x = socialProfile.x;
    }

    // Handle company logo and cover photo updates
    if (companyLogo !== undefined) {
      org.companyLogo = companyLogo.url ? companyLogo : null;
    }
    if (companyCover !== undefined) {
      org.companyCover = companyCover.url ? companyCover : null;
    }

    await org.save();

    const updatedOrg = await Organization.findById(orgId).select(
      "orgName district address phoneNo email industry foundedYear ownersName specialities companySize minEmployees maxEmployees description benefits socialProfile.insta socialProfile.x socialProfile.fb companyLogo companyCover location",
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
export const getOrganizationProfileForEdit = asyncHandler(async (req, res, next) => {
  try {
    const orgId = req.params.id;
    console.log('Fetching organization profile for edit, ID:', orgId);

    const organization = await Organization.findById(orgId)
      .select("-password -refreshToken -__v");

    if (!organization) {
      console.error('Organization not found with ID:', orgId);
      return next(new ApiError(404, "Organization not found"));
    }

    // Return the organization data with formatted image URLs
    const responseData = {
      ...organization.toObject(),
      companyLogo: {
        url: organization.companyLogo?.url || "",
        publicId: organization.companyLogo?.publicId || "",
        uploadedAt: organization.companyLogo?.uploadedAt || null
      },
      companyCover: {
        url: organization.companyCover?.url || "",
        publicId: organization.companyCover?.publicId || "",
        uploadedAt: organization.companyCover?.uploadedAt || null
      }
    };

    console.log('Organization profile for edit retrieved successfully');
    return res.status(200).json(
      new ApiResponse(200, responseData, "Organization profile retrieved successfully")
    );
  } catch (error) {
    console.error("Error getting organization profile for edit:", error);
    return next(new ApiError(500, "Failed to retrieve organization profile"));
  }
});

/**
 * Get organization profile by ID
 * @route GET /org/api/v1/profile/:id
 * @access Private
 */
export const getOrganizationProfile = asyncHandler(async (req, res, next) => {
  try {
    const orgId = req.params.id;
    console.log('Fetching organization profile for ID:', orgId);
    // Validate orgId is a valid ObjectId
    if (!orgId || !orgId.match(/^[0-9a-fA-F]{24}$/)) {
      console.error('Invalid organization ID format:', orgId);
      return next(new ApiError(400, 'Invalid organization ID format'));
    }
    const organization = await Organization.findById(orgId)
      .select("-password -refreshToken -__v");

    if (!organization) {
      console.error('Organization not found with ID:', orgId);
      return next(new ApiError(404, "Organization not found"));
    }

    // Format the response with image URLs
    const responseData = {
      ...organization.toObject(),
      companyLogo: {
        url: organization.companyLogo?.url || "",
        publicId: organization.companyLogo?.publicId || "",
        uploadedAt: organization.companyLogo?.uploadedAt || null
      },
      companyCover: {
        url: organization.companyCover?.url || "",
        publicId: organization.companyCover?.publicId || "",
        uploadedAt: organization.companyCover?.uploadedAt || null
      }
    };

    console.log('Organization profile retrieved successfully');
    return res.status(200).json(
      new ApiResponse(200, responseData, "Organization profile retrieved successfully")
    );
  } catch (error) {
    // Improved error handling: return 404 if not found, else 500 with details
    if (error instanceof ApiError) {
      // Already handled (e.g. 404 from above)
      return next(error);
    }
    console.error("Error fetching organization profile:", error?.message || error);
    return next(new ApiError(500, error?.message || "Failed to retrieve organization profile"));
  }
});

/**
 * Get organization details by ID
 * @route GET /org/api/v1/details/:id
 * @access Public
 */
export const getOrganizationDetails = asyncHandler(async (req, res, next) => {
  try {
    const orgId = req.params.id;
    console.log('Fetching organization details for ID:', orgId);
    
    const organization = await Organization.findById(orgId)
      .select("-password -refreshToken -__v");

    if (!organization) {
      console.error('Organization not found with ID:', orgId);
      return next(new ApiError(404, "Organization not found"));
    }

    // Format the response with image URLs
    const responseData = {
      ...organization.toObject(),
      companyLogo: {
        url: organization.companyLogo?.url || "",
        publicId: organization.companyLogo?.publicId || "",
        uploadedAt: organization.companyLogo?.uploadedAt || null
      },
      companyCover: {
        url: organization.companyCover?.url || "",
        publicId: organization.companyCover?.publicId || "",
        uploadedAt: organization.companyCover?.uploadedAt || null
      }
    };

    console.log('Organization details retrieved successfully');
    return res.status(200).json(
      new ApiResponse(200, responseData, "Organization details retrieved successfully")
    );
  } catch (error) {
    console.error("Error fetching organization details:", error);
    return next(new ApiError(500, "Failed to retrieve organization details"));
  }
});

/**
 * Upload an image for an organization (logo, cover, etc.)
 * @route POST /org/api/v1/upload-image/:id
 * @access Private
 */
export const uploadOrgImage = asyncHandler(async (req, res, next) => {
  console.log('=== UPLOAD_ORG_IMAGE ===');
  console.log('[uploadOrgImage] Organization ID:', req.params.id);
  console.log('[uploadOrgImage] Query:', req.query);
  console.log('[uploadOrgImage] Body:', req.body);
  console.log('[uploadOrgImage] File:', req.file);
  console.log('[uploadOrgImage] File received:', req.file ? 'Yes' : 'No');
  
  try {
    const orgId = req.params.id;
    const file = req.file;
    const type = req.query.type; // companyLogo, companyCover
    
    // Validate inputs
    if (!file) {
      console.error('No file provided in request');
      return next(new ApiError(400, "No image file provided"));
    }
    
    if (!type) {
      console.error('No image type specified');
      return next(new ApiError(400, "Image type (companyLogo or companyCover) is required"));
    }
    
    // Validate image type
    const validTypes = ['companyLogo', 'companyCover'];
    if (!validTypes.includes(type)) {
      console.error('Invalid image type:', type);
      return next(new ApiError(400, "Invalid image type. Must be one of: " + validTypes.join(', ')));
    }
    
    console.log('Uploading to Cloudinary...');
    // Upload to Cloudinary
    const { v2: cloudinary } = await import("cloudinary");
    const result = await cloudinary.uploader.upload(file.path, {
      folder: `bmap/org-${type}`,
      resource_type: "image",
    });
    
    console.log('Cloudinary upload successful:', {
      url: result.secure_url,
      public_id: result.public_id
    });
    
    // Find the organization
    const organization = await Organization.findById(orgId);
    if (!organization) {
      console.error('Organization not found with ID:', orgId);
      // Clean up the uploaded file if organization not found
      await cloudinary.uploader.destroy(result.public_id);
      return next(new ApiError(404, "Organization not found"));
    }
    
    // Delete old image from Cloudinary if exists
    if (organization[type]?.publicId) {
      try {
        console.log('Deleting old image from Cloudinary:', organization[type].publicId);
        await cloudinary.uploader.destroy(organization[type].publicId);
      } catch (error) {
        console.error('Error deleting old image from Cloudinary:', error);
        // Continue with the update even if deletion fails
      }
    }
    
    // Update organization with new image data
    const imageData = {
      [type]: {
        url: result.secure_url,
        publicId: result.public_id,
        uploadedAt: new Date()
      }
    };
    
    console.log('[uploadOrgImage] type:', type);
    console.log('[uploadOrgImage] imageData:', imageData);
    
    // Extra fallback: if field is missing in DB, initialize it
    let updatedOrg = await Organization.findByIdAndUpdate(
      orgId,
      { $set: imageData },
      { new: true, runValidators: true }
    ).select("-password -refreshToken -__v");
    
    if (!updatedOrg[type]) {
      // Field missing, manually initialize
      updatedOrg[type] = imageData[type];
      await updatedOrg.save();
      console.warn(`[uploadOrgImage] Field ${type} was missing and initialized manually.`);
    }

    if (!updatedOrg) {
      // Clean up the uploaded file if update fails
      await cloudinary.uploader.destroy(result.public_id);
      return next(new ApiError(500, "Failed to update organization with new image"));
    }
    
    console.log('[uploadOrgImage] Organization updated successfully:', updatedOrg);
    
    // Return the updated image data in the expected format
    const responseData = {
      statusCode: 200,
      success: true,
      message: `${type} uploaded successfully`,
      data: {
        url: updatedOrg[type]?.url || '',
        publicId: updatedOrg[type]?.publicId || ''
      }
    };
    
    console.log('[uploadOrgImage] Sending upload response:', responseData);
    return res.status(200).json(responseData);
    
  } catch (error) {
    console.error('Error in uploadOrgImage:', error);
    return next(new ApiError(500, "Failed to upload image: " + error.message));
  }
});

/**
 * Delete an organization's image (logo, cover, etc.)
 * @route DELETE /org/api/v1/delete-image/:id
 * @access Private
 */
export const deleteOrgImage = asyncHandler(async (req, res, next) => {
  try {
    const orgId = req.params.id;
    const type = req.query.type; // companyLogo, companyCover, etc.
    
    // Validate inputs
    if (!type) {
      return next(new ApiError(400, "Image type is required"));
    }
    
    // Validate image type
    const validTypes = ['companyLogo', 'companyCover'];
    if (!validTypes.includes(type)) {
      return next(new ApiError(400, "Invalid image type. Must be one of: " + validTypes.join(', ')));
    }
    
    // Find the organization
    const organization = await Organization.findById(orgId);
    if (!organization) {
      return next(new ApiError(404, "Organization not found"));
    }
    
    // Check if image exists
    if (!organization[type]?.publicId) {
      return next(new ApiError(404, `No ${type} found to delete`));
    }
    
    const publicId = organization[type].publicId;
    
    // Delete from Cloudinary
    const { v2: cloudinary } = await import("cloudinary");
    await cloudinary.uploader.destroy(publicId);
    
    // Remove image reference from organization
    organization[type] = undefined;
    await organization.save();
    
    return res.status(200).json(
      new ApiResponse(200, {}, `${type} deleted successfully`)
    );
    
  } catch (error) {
    console.error('Error in deleteOrgImage:', error);
    return next(new ApiError(500, "Failed to delete image: " + error.message));
  }
});
