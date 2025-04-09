import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import {ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";

const genarateAccessAndRefreshTokens = async (userId) =>{
try{
const user = await User.findById(userId)
const accessToken = user.genarateAccessToken
const refreshToken = user.genarateRefreshToken

user.refreshToken = refreshToken
await user.save({ validateBeforeSave: false})

return {accessToken, refreshToken}

}catch(error){
  return next(new ApiError(500, "Something went wrong while genarating refresh and access tokens"));
}
}

const registerUser = asyncHandler(async (req, res, next) => {
  //get user details front frontend
  const { firstname, lastname, email, password, confirmPassword } = req.body;

  if (!firstname || !lastname || !email || !password || !confirmPassword) {
    return next(new ApiError(400, "All fields are required"));
  }

  if (await User.findOne({ email })) {
    return next(new ApiError(400, "Email is already used"));
  }

  const user = await User.create({firstname, lastname, email, password});

  const createdUser = await User.findById(user._id).select("-password -refreshToken")
  if(!createdUser){
  return next(new ApiError(500, "Something went wrong while regsitering the user!"));
  }

  return res
  .status(201)
  .json(
    new ApiResponse(
      200, 
      createdUser, 
      "User Registered Successfully")
  )
});

const loginUser = asyncHandler(async (req, res, next) => {
  const {email, password} = req.body;

  if(!email || !password){
    return next(new ApiError(400, "All fields are required"));
  }

  const user = User.findOne({email});
  if(!user){
    return next(new ApiError(400, "User doesnt exist"));
  }
  
  const isPasswordCorrect = await user.isPasswordCorrect(password);
  if(!isPasswordCorrect){
    return next(new ApiError(401, "Incorrect Password"));
  }

  const{accessToken, refreshToken} = await genarateAccessAndRefreshTokens(user._id);
  
  //get logged in user
  const loggedInUser = await User.findById(user._id)
  .select("-password -refreshToken")

  //sending cookies
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
        user : loggedInUser, accessToken,refreshToken
      },
      "User Logged In Successfully !"
    )
  )
});

const logoutUser = asyncHandler(async(req, res)=>{
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

export { registerUser, loginUser, logoutUser };
