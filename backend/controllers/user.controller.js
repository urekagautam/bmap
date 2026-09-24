import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { User } from "../models/user.model.js"
import { Vacancy } from "../models/vacancy.model.js"
import { Organization } from "../models/organization.model.js"
import { v2 as cloudinary } from "cloudinary";

const generateAccessAndRefreshTokens = async (userId) => {
  try {
    const user = await User.findById(userId)
    const accessToken = user.generateAccessToken()
    const refreshToken = user.generateRefreshToken()

    user.refreshToken = refreshToken
    await user.save({ validateBeforeSave: false })

    return { accessToken, refreshToken }
  } catch (error) {
    throw new ApiError(500, "Something went wrong while generating refresh and access tokens")
  }
}

const registerUser = asyncHandler(async (req, res, next) => {
  const { name, email, password, fieldOfInterest, confirmpassword } = req.body

  if (!name || !email || !password || !confirmpassword || !fieldOfInterest) {
    return next(new ApiError(400, "All fields are required"))
  }

  if (password !== confirmpassword) {
    return next(new ApiError(400, "Passwords do not match"))
  }

  if (await User.findOne({ email })) {
    return next(new ApiError(400, "Email is already used"))
  }

  const newUser = await User.create({
    name,
    email,
    password,
    field_of_interest: fieldOfInterest, 
  })

  const accessToken = newUser.generateAccessToken()
  const refreshToken = newUser.generateRefreshToken()

  newUser.refreshToken = refreshToken
  await newUser.save({ validateBeforeSave: false })

  res.status(201).json(
    new ApiResponse(
      201,
      {
        accessToken,
        refreshToken,
        user: {
          _id: newUser._id,
          name: newUser.name,
          email: newUser.email,
          fieldOfInterest: newUser.field_of_interest,
        },
      },
      "User registered successfully",
    ),
  )
})

const loginUser = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body

  console.log("Login attempt for:", email)
  console.log("Password provided:", password ? "Yes" : "No")

  if (!email || !password) {
    return next(new ApiError(400, "Email and password are required"))
  }

  try {
    const user = await User.findOne({ email }).select("+password")

    console.log("User found:", user ? "Yes" : "No")

    if (!user) {
      return next(new ApiError(400, "Invalid email or password"))
    }

    console.log("Stored password hash exists:", user.password ? "Yes" : "No")
    console.log("Password hash length:", user.password ? user.password.length : 0)

    if (!user.password) {
      console.error("No password hash found for user:", email)
      return next(new ApiError(500, "User password not found. Please contact support."))
    }

    if (!password || typeof password !== "string") {
      console.error("Invalid password format provided")
      return next(new ApiError(400, "Invalid password format"))
    }

    if (!user.password || typeof user.password !== "string") {
      console.error("Invalid password hash in database")
      return next(new ApiError(500, "Invalid user data. Please contact support."))
    }

    const isPasswordCorrect = await user.isPasswordCorrect(password)

    console.log("Password correct:", isPasswordCorrect)

    if (!isPasswordCorrect) {
      return next(new ApiError(401, "Invalid email or password"))
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id)

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

    const options = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    }

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json(
        new ApiResponse(
          200,
          {
            user: loggedInUser,
            accessToken,
            refreshToken,
          },
          "User logged in successfully!",
        ),
      )
  } catch (error) {
    console.error("Login error:", error)
    return next(new ApiError(500, error.message || "Internal server error during login"))
  }
})

//GET USER PROFILE FOR JOB APPLICATION
const getUserProfileData = asyncHandler(async (req, res, next) => {
  try {
    const userId = req.params.id

    const userData = await User.findById(userId).select(
      "name email phone socialProfile.linkedin socialProfile.github socialProfile.portfolio resume",
    )

    if (!userData) {
      return next(new ApiError(404, "User not found"))
    }

    const responseData = {
      name: userData.name,
      email: userData.email,
      phoneNo: userData.phone || "",
      socialProfile: {
        linkedin: userData.socialProfile?.linkedin || "",
        github: userData.socialProfile?.github || "",
        portfolio: userData.socialProfile?.portfolio || "",
      },
      resume: userData.resume,
    }

    return res.status(200).json(new ApiResponse(200, responseData, "User profile data retrieved successfully"))
  } catch (error) {
    console.error("Error fetching user data:", error)
    return next(new ApiError(500, "Something went wrong while fetching user data"))
  }
})

//GET USER DETAILS FOR PROFILE 
const getUserProfile = asyncHandler(async (req, res, next) => {
  try {
    const userId = req.params.id

    const user = await User.findById(userId).select(
      "name email address district gender phone about field_of_interest experience_level job_preference socialProfile image createdAt updatedAt resume"
    )

    if (!user) {
      return next(new ApiError(404, "User not found"))
    }

    const responseData = {
      _id: user._id,
      name: user.name,
      email: user.email,
      address: user.address,
      district: user.district,
      gender: user.gender,
      phone: user.phone,
      about: user.about,
      field_of_interest: user.field_of_interest,
      experience_level: user.experience_level,
      job_preference: user.job_preference,
      socialProfile: user.socialProfile,
      image: user.image,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      resume: user.resume,
    }

    return res.status(200).json(new ApiResponse(200, responseData, "User profile fetched successfully"))
  } catch (error) {
    console.error("Error fetching user profile:", error)
    return next(new ApiError(500, "Something went wrong while fetching user profile"))
  }
})

//UPDATE USER PROFILE FROM PROFILE 
export const updateUserProfile = asyncHandler(async (req, res, next) => {
  try {
    const userId = req.params.id
    const {
      name,
      email,
      address,
      district,
      gender,
      phone,
      about,
      field_of_interest,
      image,
      experience_level,
      location,
      job_preference,
      socialProfile,
    } = req.body

    const updateData = {}

    if (name !== undefined) updateData.name = name
    if (email !== undefined) updateData.email = email
    if (address !== undefined) updateData.address = address
    if (district !== undefined) updateData.district = district
    if (gender !== undefined) updateData.gender = gender
    if (phone !== undefined) updateData.phone = phone
    if (about !== undefined) updateData.about = about
    if (field_of_interest !== undefined) updateData.field_of_interest = field_of_interest
    if (image !== undefined) updateData.image = image
    if (experience_level !== undefined) updateData.experience_level = experience_level

    if (location !== undefined) {
      updateData.location = {
        lat: location?.lat || null,
        lng: location?.lng || null,
      }
    }

    if (job_preference !== undefined) {
      updateData.job_preference = {
        title: job_preference?.title || "",
        job_by_time: job_preference?.job_by_time || "fulltime",
        job_by_location: job_preference?.job_by_location || "on_site",
        job_level: job_preference?.job_level || "mid-level",
        skills: job_preference?.skills || [],
      }
    }

    if (socialProfile !== undefined) {
      updateData.socialProfile = {
        insta: socialProfile?.insta || "",
        x: socialProfile?.x || "",
        fb: socialProfile?.fb || "",
        github: socialProfile?.github || "",
        linkedin: socialProfile?.linkedin || "",
        portfolio: socialProfile?.portfolio || "",
      }
    }

    const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
      runValidators: true,
    })

    if (!updatedUser) {
      return next(new ApiError(404, "User not found"))
    }

    const responseData = {
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      address: updatedUser.address,
      district: updatedUser.district,
      gender: updatedUser.gender,
      phone: updatedUser.phone,
      about: updatedUser.about,
      field_of_interest: updatedUser.field_of_interest,
      experience_level: updatedUser.experience_level,
      job_preference: updatedUser.job_preference,
      socialProfile: updatedUser.socialProfile,
      image: updatedUser.image,
      updatedAt: updatedUser.updatedAt,
    }

    return res.status(200).json(new ApiResponse(200, responseData, "User profile updated successfully"))
  } catch (error) {
    console.error("Error updating user profile:", error)
    return next(new ApiError(500, "Something went wrong while updating user profile"))
  }
})

//UPDATE USER PROFILE FROM APPLICATION 
const updateUserProfileForApplication = asyncHandler(async (req, res, next) => {
  try {
    const userId = req.params.id
    const { firstName, lastName, email, phoneNo, linkedin, github, portfolio } = req.body

    const fullName = `${firstName} ${lastName}`.trim()

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        name: fullName,
        email: email,
        phone: phoneNo,
        socialProfile: {
          linkedin: linkedin || "",
          github: github || "",
          portfolio: portfolio || "",
        },
      },
      {
        new: true,
        runValidators: true,
      },
    ).select("name email phone socialProfile.linkedin socialProfile.github socialProfile.portfolio")

    if (!updatedUser) {
      return next(new ApiError(404, "User not found"))
    }

    const responseData = {
      name: updatedUser.name,
      email: updatedUser.email,
      phoneNo: updatedUser.phone || "",
      socialProfile: {
        linkedin: updatedUser.socialProfile?.linkedin || "",
        github: updatedUser.socialProfile?.github || "",
        portfolio: updatedUser.socialProfile?.portfolio || "",
      },
    }

    return res.status(200).json(new ApiResponse(200, responseData, "User profile updated successfully"))
  } catch (error) {
    console.error("Error updating user profile:", error)
    return next(new ApiError(500, "Something went wrong while updating user profile"))
  }
})

const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        refreshToken: undefined,
      },
    },
    {
      new: true,
    },
  )

  const options = {
    httpOnly: true,
    secure: true,
  }

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged out successfully"))
})

// UPLOAD PROFILE IMAGE
export const uploadProfileImage = asyncHandler(async (req, res, next) => {
  try {
    const userId = req.params.id
    const file = req.file

    if (!file) {
      return next(new ApiError(400, "No image file provided"))
    }

    // Check if user exists
    const user = await User.findById(userId)
    if (!user) {
      return next(new ApiError(404, "User not found"))
    }

    // Upload to cloudinary
    const result = await cloudinary.uploader.upload(file.path, {
      folder: "bmap/user-profiles",
      width: 300,
      height: 300,
      crop: "fill",
      quality: "auto",
    })

    // Update user's image field with cloudinary URL
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { image: result.secure_url },
      { new: true }
    ).select("name email image")

    if (!updatedUser) {
      return next(new ApiError(500, "Failed to update user profile"))
    }

    return res.status(200).json(
      new ApiResponse(
        200,
        {
          user: {
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            image: updatedUser.image,
          },
        },
        "Profile image uploaded successfully"
      )
    )
  } catch (error) {
    console.error("Error uploading profile image:", error)
    return next(new ApiError(500, "Something went wrong while uploading profile image"))
  }
})

// UPLOAD RESUME PDF
export const uploadResume = asyncHandler(async (req, res, next) => {
  try {
    const userId = req.params.id;
    const file = req.file;
    if (!file) {
      return next(new ApiError(400, "No resume file provided"));
    }
    if (file.mimetype !== "application/pdf") {
      return next(new ApiError(400, "Only PDF files are allowed"));
    }
    const { v2: cloudinary } = await import("cloudinary");
    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(file.path, {
      folder: "bmap/user-resumes",
      resource_type: "raw",
      format: "pdf",
    });
    // Update user resume field
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        resume: {
          url: result.secure_url,
          filename: file.originalname,
          size: file.size,
          uploadedAt: new Date(),
          publicId: result.public_id,
        },
      },
      { new: true }
    ).select("resume");
    if (!updatedUser) {
      return next(new ApiError(404, "User not found"));
    }
    return res.status(200).json(new ApiResponse(200, updatedUser.resume, "Resume uploaded successfully"));
  } catch (error) {
    console.error("Error uploading resume:", error);
    return next(new ApiError(500, "Something went wrong while uploading resume"));
  }
});

// DELETE RESUME PDF
export const deleteResume = asyncHandler(async (req, res, next) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId);
    if (!user) {
      return next(new ApiError(404, "User not found"));
    }
    if (!user.resume || !user.resume.publicId) {
      return next(new ApiError(400, "No resume to delete"));
    }
    const { v2: cloudinary } = await import("cloudinary");
    // Delete from Cloudinary
    await cloudinary.uploader.destroy(user.resume.publicId, { resource_type: "raw" });
    // Remove resume field from user
    user.resume = undefined;
    await user.save();
    return res.status(200).json(new ApiResponse(200, {}, "Resume deleted successfully"));
  } catch (error) {
    console.error("Error deleting resume:", error);
    return next(new ApiError(500, "Something went wrong while deleting resume"));
  }
});


//Update User Location
const updateUserLocation = asyncHandler(async (req, res, next) => {
  try {
    const userId = req.params.id
    const { location } = req.body

    // Validate location data
    if (!location || typeof location.lat !== "number" || typeof location.lng !== "number") {
      return next(new ApiError(400, "Invalid location data. Latitude and longitude are required."))
    }

    // Validate latitude and longitude ranges
    if (location.lat < -90 || location.lat > 90 || location.lng < -180 || location.lng > 180) {
      return next(new ApiError(400, "Invalid coordinates. Latitude must be between -90 and 90, longitude between -180 and 180."))
    }

    // Update user location in database
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        location: {
          lat: location.lat,
          lng: location.lng,
        },
      },
      { new: true, runValidators: true }
    ).select("_id name email location updatedAt")

    if (!updatedUser) {
      return next(new ApiError(404, "User not found"))
    }

    const responseData = {
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      location: updatedUser.location,
      updatedAt: updatedUser.updatedAt,
    }

    return res.status(200).json(
      new ApiResponse(200, responseData, "User location updated successfully")
    )
  } catch (error) {
    console.error("Error updating user location:", error)
    return next(new ApiError(500, "Something went wrong while updating user location"))
  }
})

// Haversine algorithm 

const calculateDistance = (lat1, lng1, lat2, lng2) => {
  const toRad = (val) => (val * Math.PI) / 180
  const R = 6371 

  const dLat = toRad(lat2 - lat1)
  const dLon = toRad(lng2 - lng1)

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2)

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

  return R * c 
}

const getNearbyVacancies = asyncHandler(async (req, res, next) => {
  try {
    const userId = req.params.id
    const { radius = 10 } = req.query

    const user = await User.findById(userId).select("location name email")
    if (!user) {
      return next(new ApiError(404, "User not found"))
    }

    if (!user.location || !user.location.lat || !user.location.lng) {
      return next(new ApiError(400, "User location not found. Please enable location first."))
    }

    const organizations = await Organization.find({
      $or: [
        {
          'location.type': 'Point',
          'location.coordinates': { $exists: true, $size: 2 }
        },
        {
          'location.lat': { $exists: true, $ne: null },
          'location.lng': { $exists: true, $ne: null }
        }
      ]
    }).select("_id email location orgName address district")

    console.log("Found organizations:", organizations.length)

    if (!organizations.length) {
      return res.status(200).json(
        new ApiResponse(200, [], "No organizations with location data found")
      )
    }

    const nearbyOrganizations = organizations
      .map(org => {
        let orgLat, orgLng

        if (org.location.type === 'Point' && org.location.coordinates) {
          orgLng = org.location.coordinates[0] 
          orgLat = org.location.coordinates[1] 
        }
  
        else if (org.location.lat && org.location.lng) {
          orgLat = org.location.lat
          orgLng = org.location.lng
        }
        else {
          return null 
        }

        const distance = calculateDistance(
          user.location.lat,
          user.location.lng,
          orgLat,
          orgLng
        )

        return {
          ...org.toObject(),
          distance: Math.round(distance * 100) / 100,
          coordinates: { lat: orgLat, lng: orgLng } 
        }
      })
      .filter(org => org !== null && org.distance <= radius) 
      .sort((a, b) => a.distance - b.distance) 
      .slice(0, 10) 

    console.log("Nearby organizations found:", nearbyOrganizations.length)

    if (!nearbyOrganizations.length) {
      return res.status(200).json(
        new ApiResponse(200, [], `No organizations found within ${radius}km radius`)
      )
    }

    const orgIds = nearbyOrganizations.map(org => org._id)

    const vacancies = await Vacancy.find({
      orgId: { $in: orgIds }
    }).populate('orgId', 'email location orgName address district')

    console.log("Vacancies found:", vacancies.length)

    const vacanciesWithDistance = vacancies.map(vacancy => {
      const org = nearbyOrganizations.find(o => o._id.toString() === vacancy.orgId._id.toString())
      return {
        ...vacancy.toObject(),
        distance: org ? org.distance : null,
        organizationLocation: org ? org.coordinates : null,
        organizationName: vacancy.orgId.orgName || 'Unknown Organization'
      }
    }).sort((a, b) => a.distance - b.distance) 

    const responseData = {
      userLocation: {
        lat: user.location.lat,
        lng: user.location.lng
      },
      searchRadius: radius,
      totalNearbyOrganizations: nearbyOrganizations.length,
      totalVacancies: vacanciesWithDistance.length,
      nearbyOrganizations: nearbyOrganizations,
      vacancies: vacanciesWithDistance
    }

    return res.status(200).json(
      new ApiResponse(200, responseData, `Found ${vacanciesWithDistance.length} vacancies from ${nearbyOrganizations.length} nearby organizations`)
    )

  } catch (error) {
    console.error("Error finding nearby vacancies:", error)
    return next(new ApiError(500, "Something went wrong while finding nearby vacancies"))
  }
})

//fetch nearby organizations 

const getNearbyOrganizations = asyncHandler(async (req, res, next) => {
  try {
    const userId = req.params.id
    const { radius = 10 } = req.query

    const user = await User.findById(userId).select("location")
    if (!user) {
      return next(new ApiError(404, "User not found"))
    }

    if (!user.location?.lat || !user.location?.lng) {
      return next(new ApiError(400, "User location not found. Please enable location first."))
    }

    const organizations = await Organization.find({
      $or: [
        {
          'location.type': 'Point',
          'location.coordinates': { $exists: true, $size: 2 }
        },
        {
          'location.lat': { $exists: true, $ne: null },
          'location.lng': { $exists: true, $ne: null }
        }
      ]
    }).select("_id orgName email location image")

    if (!organizations.length) {
      return res.status(200).json(new ApiResponse(200, [], "No organizations found"))
    }

    const nearbyOrgs = organizations
      .map(org => {
        let orgLat, orgLng

        if (org.location.type === 'Point' && org.location.coordinates) {
          orgLng = org.location.coordinates[0]
          orgLat = org.location.coordinates[1]
        } else {
          orgLat = org.location.lat
          orgLng = org.location.lng
        }

        const distance = calculateDistance(
          user.location.lat,
          user.location.lng,
          orgLat,
          orgLng
        )

        return {
          _id: org._id,
          orgName: org.orgName,
          distance: Math.round(distance * 100) / 100,
          logo: org.image?.[0]?.url || null, 
          coordinates: { lat: orgLat, lng: orgLng }
        }
      })
      .filter(org => org.distance <= radius)
      .sort((a, b) => a.distance - b.distance)

    return res.status(200).json(
      new ApiResponse(200, nearbyOrgs, `Found ${nearbyOrgs.length} nearby organizations`)
    )

  } catch (error) {
    console.error("Error fetching nearby organizations:", error)
    return next(new ApiError(500, "Something went wrong while fetching nearby organizations"))
  }
})


// Jaccard Similarity Algorithm
const calculateJaccardSimilarity = (setA, setB) => {
  if (!setA || !setB || setA.length === 0 || setB.length === 0) {
    return 0;
  }
  
  const intersection = setA.filter(item => setB.includes(item));
  const union = [...new Set([...setA, ...setB])];
  
  return intersection.length / union.length;
};

// Getting job recommendations using Jaccard Similarity
const getJobRecommendations = asyncHandler(async (req, res, next) => {
  try {
    const userId = req.params.id;
    const { limit = 9 } = req.query;

    // Getting user profile with field of interest and skills
    const user = await User.findById(userId).select("field_of_interest job_preference name email");
    
    if (!user) {
      return next(new ApiError(404, "User not found"));
    }

    if (!user.field_of_interest) {
      return next(new ApiError(400, "User field of interest not found. Please complete your profile."));
    }

    // Getting all vacancies
    const vacancies = await Vacancy.find({})
      .populate('orgId', 'orgName email address district')
      .select("title description department skillsRequired jobByTime jobByLocation jobLevel salary deadline orgId createdAt");

    if (!vacancies.length) {
      return res.status(200).json(
        new ApiResponse(200, [], "No vacancies found")
      );
    }

    // Calculating similarity for each vacancy
    const vacanciesWithSimilarity = vacancies.map(vacancy => {
      let totalSimilarity = 0;

      // Field of Interest Match 
      const fieldMatch = user.field_of_interest === vacancy.department;
      if (fieldMatch) {
        totalSimilarity += 0.7;
      }

      // Skills Similarity 
      const userSkills = user.job_preference?.skills || [];
      const vacancySkills = vacancy.skillsRequired || [];
      
      if (userSkills.length > 0 && vacancySkills.length > 0) {
        const skillsSimilarity = calculateJaccardSimilarity(userSkills, vacancySkills);
        totalSimilarity += skillsSimilarity * 0.3;
      }

      return {
        ...vacancy.toObject(),
        similarityScore: Math.round(totalSimilarity * 1000) / 1000,
        organizationName: vacancy.orgId?.orgName || 'Unknown Organization'
      };
    });

    // Sorting by similarity score 
    const sortedVacancies = vacanciesWithSimilarity
      .sort((a, b) => b.similarityScore - a.similarityScore)
      .slice(0, parseInt(limit));

    return res.status(200).json(
      new ApiResponse(
        200, 
        sortedVacancies, 
        `Found ${sortedVacancies.length} job recommendations sorted by similarity`
      )
    );

  } catch (error) {
    console.error("Error getting job recommendations:", error);
    return next(new ApiError(500, "Something went wrong while getting job recommendations"));
  }
});

// Getting random organizations in user's district
const getOrganizationsByDistrict = asyncHandler(async (req, res, next) => {
  try {
    const userId = req.params.id;
    const { limit = 10 } = req.query;

    // Getting  user profile with district
    const user = await User.findById(userId).select("district name email");
    
    if (!user) {
      return next(new ApiError(404, "User not found"));
    }

    if (!user.district) {
      return next(new ApiError(400, "User district not found. Please complete your profile."));
    }

    console.log(`Looking for organizations in district: ${user.district}`);

    // Finding organizations in the same district
    const organizations = await Organization.find({ 
      district: user.district 
    }).select("_id orgName email address district image profileImage logo"); 

    if (!organizations.length) {
      return res.status(200).json(
        new ApiResponse(200, [], `No organizations found in ${user.district} district`)
      );
    }

    console.log(`Found ${organizations.length} organizations in ${user.district}`);

 
    const shuffledOrganizations = organizations.sort(() => Math.random() - 0.5);
    const randomOrganizations = shuffledOrganizations.slice(0, parseInt(limit));

    const organizationsData = randomOrganizations.map(org => ({
      id: org._id,
      name: org.orgName,
      email: org.email,
      address: org.address,
      district: org.district,
      image: org.image || org.profileImage || org.logo || null
    }));

    const responseData = {
      userDistrict: user.district,
      totalOrganizations: organizations.length,
      displayedOrganizations: organizationsData.length,
      organizations: organizationsData
    };

    return res.status(200).json(
      new ApiResponse(
        200, 
        responseData, 
        `Found ${organizationsData.length} organizations in ${user.district} district`
      )
    );

  } catch (error) {
    console.error("Error getting organizations by district:", error);
    return next(new ApiError(500, "Something went wrong while getting organizations by district"));
  }
});

export { 
  registerUser, 
  loginUser, 
  getUserProfileData, 
  updateUserProfileForApplication, 
  getUserProfile, 
  logoutUser,
  updateUserLocation,
  getNearbyVacancies,
  getNearbyOrganizations,
  getJobRecommendations,
  // getOrganizationsByDistrict
}

