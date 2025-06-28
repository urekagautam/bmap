import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { User } from "../models/user.model.js"

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
      "name email phone socialProfile.linkedin socialProfile.github socialProfile.portfolio",
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
      "name email address district gender phone about field_of_interest experience_level job_preference socialProfile image createdAt updatedAt",
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

export { registerUser, loginUser, getUserProfileData, updateUserProfileForApplication, getUserProfile, logoutUser }
