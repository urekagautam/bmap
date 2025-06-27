import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";

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

  const { name, email, password, confirmpassword } = req.body;

  if (!name || !email || !password || !confirmpassword) {
    return next(new ApiError(400, "All fields are required"));
  }

  if (await User.findOne({ email })) {
    return next(new ApiError(400, "Email is already used"));
  }

  const newUser = await User.create({ name, email, password });

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
          email: newUser.email
        },
      },
      "User registered successfully",
    ),
  )
});

const loginUser = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new ApiError(400, "All fields are required"));
  }

  const user = await User.findOne({ email }); 
  if (!user) {
    return next(new ApiError(400, "User doesn't exist"));
  }
  
  const isPasswordCorrect = await user.isPasswordCorrect(password);
  if (!isPasswordCorrect) {
    return next(new ApiError(401, "Incorrect Password"));
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id);
  
  const loggedInUser = await User.findById(user._id)
    .select("-password -refreshToken")

  const options = {
    httpOnly: true,
    secure: true
  }

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(200,
        {
          user: loggedInUser, 
          accessToken, 
          refreshToken
        },
        "User Logged In Successfully!"
      )
    )
});

//GET USER PROFILE FOR JOB APPLICATION

const getUserProfileData = asyncHandler(async (req, res, next) => {
  try {
    // const userId = req.user._id; 
    const userId = req.params.id;
    
    const userData = await User.findById(userId).select(
      'name email phone socialProfile.linkedin socialProfile.github socialProfile.portfolio'
    );
    
    if (!userData) {
      return next(new ApiError(404, "User not found"));
    }
    
    const responseData = {
      name: userData.name,
      email: userData.email,
      phoneNo: userData.phone || "",
      socialProfile: {
        linkedin: userData.socialProfile?.linkedin || "",
        github: userData.socialProfile?.github || "",
        portfolio: userData.socialProfile?.portfolio || "",
      }
    };
    
    return res.status(200).json(
      new ApiResponse(
        200,
        responseData,
        "User profile data retrieved successfully"
      )
    );
    
  } catch (error) {
    console.error("Error fetching user data:", error);
    return next(new ApiError(500, "Something went wrong while fetching user data"));
  }
});

//GET USER DETAILS FOR PROFILE
const getUserProfile = asyncHandler(async (req, res, next) => {
  try {
    const userId = req.params.id;

    const user = await User.findById(userId).select(
      "name email address phone experience_level job_preference socialProfile"
    );

    if (!user) {
      return next(new ApiError(404, "User not found"));
    }

    return res.status(200).json(
      new ApiResponse(200, user, "User profile fetched successfully")
    );
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return next(new ApiError(500, "Something went wrong while fetching user profile"));
  }
});

//UPDATE USER PFORILE FROM PROFILE
export const updateUserProfile = asyncHandler(async (req, res, next) => {
  try {
    const userId = req.params.id;

    const {
      name,
      email,
      address,
      phone,
      image,
      experience_level,
      location,
      job_preference,
      socialProfile
    } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        name: name,
        email: email,
        address: address,
        phone: phone,
        image: image,
        experience_level: experience_level,
        location: {
          lat: location?.lat || null,
          lng: location?.lng || null,
        },
        job_preference: {
          title: job_preference?.title || "",
          skills: job_preference?.skills || [],
        },
        socialProfile: {
          insta: socialProfile?.insta || "",
          x: socialProfile?.x || "",
          fb: socialProfile?.fb || "",
          github: socialProfile?.github || "",
          linkedin: socialProfile?.linkedin || "",
          portfolio: socialProfile?.portfolio || "",
        }
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedUser) {
      return next(new ApiError(404, "User not found"));
    }

    return res.status(200).json(
      new ApiResponse(
        200,
        updatedUser,
        "User profile updated successfully"
      )
    );

  } catch (error) {
    console.error("Error updating user profile:", error);
    return next(new ApiError(500, "Something went wrong while updating user profile"));
  }
});

//UPDATE USER PROFILE FROM APPLICATION

const updateUserProfileForApplication = asyncHandler(async (req, res, next) => {
  try {
    const userId = req.params.id;
    const { firstName, lastName, email, phoneNo, linkedin, github, portfolio } = req.body;

    // Combining first and last name
    const fullName = `${firstName} ${lastName}`.trim();

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
        }
      },
      { 
        new: true, 
        runValidators: true 
      }
    ).select('name email phone socialProfile.linkedin socialProfile.github socialProfile.portfolio');

    if (!updatedUser) {
      return next(new ApiError(404, "User not found"));
    }

    const responseData = {
      name: updatedUser.name,
      email: updatedUser.email,
      phoneNo: updatedUser.phone || "",
      socialProfile: {
        linkedin: updatedUser.socialProfile?.linkedin || "",
        github: updatedUser.socialProfile?.github || "",
        portfolio: updatedUser.socialProfile?.portfolio || "",
      }
    };

    return res.status(200).json(
      new ApiResponse(
        200,
        responseData,
        "User profile updated successfully"
      )
    );

  } catch (error) {
    console.error("Error updating user profile:", error);
    return next(new ApiError(500, "Something went wrong while updating user profile"));
  }
});

//Logout user
const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        refreshToken: undefined
      }
    },
    {
      new: true
    },
  )

  const options = {
    httpOnly: true,
    secure: true
  }

  return res.status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged out successfully"))
})

export { registerUser, loginUser,  getUserProfileData, updateUserProfileForApplication, getUserProfile, logoutUser };