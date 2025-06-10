import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { config } from "../config/config.js";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    phone: {
      type: String,
      select: false,
      unique: true,
      sparse:true
    },
    image: {
      type: String,
      default: "", //laterr
    },
    experience_level: {
      type: String,
      enum: ["Entry-Level","Junior","Senior"] //to modify later after UI
    },
    location: {
      lat: {
        type: Number,
        select: false
      },
      lng:{
        type: Number,
        select: false
      },
    },
    job_preference: {
      title: {
        type: String,
        trim: true,
      },
      skills: [
        {
          type: String,
          trim: true,
        },
      ],
    },
      socialProfile: {
      insta: {
        type: String,
      },
      x: {
        type: String,
      },
      fb: {
        type: String,
      },
      github: {
        type: String,
      },
      linkedin: {
        type: String,
      },
      portfolio: {
        type: String,
      },
    },
    followed: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Organization",
      },
    ],
    refreshToken: String,
    passwordChangedAt: Date,
  },
  { timestamps: true }
);

// everytime the password field is changed, this function will run to hash the password
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 11);
  this.passwordChangedAt = new Date(Date.now() - 1000);
  next();
});

//compare candidate password with actual password
userSchema.methods.isPasswordCorrect= async function(password){
 return await bcrypt.compare(password, this.password);
}

//returns the access token created
userSchema.methods.generateAccessToken = function () {
 return jwt.sign({_id: this._id},config.accessTokenKey,{
    expiresIn: config.accessTokenExpiry,
  });
};

//returns the refresh token created
userSchema.methods.generateRefreshToken = function () {
  return jwt.sign({_id: this._id},config.refreshTokenKey,{
    expiresIn: config.refreshTokenExpiry,
  });
};

export const User = mongoose.model("User", userSchema);