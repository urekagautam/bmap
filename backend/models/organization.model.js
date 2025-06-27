import mongoose from "mongoose"
import JWT from "jsonwebtoken"
import bcrypt from "bcrypt"
import { config } from "../config/config.js"

const organizationSchema = new mongoose.Schema(
  {
    ownersName: {
      type: String,
      trim: true,
    },
    orgName: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      select: false, 
    },
    phoneNo: {
      type: String,
      unique: true,
      sparse: true,
    },
    image: {
      type: [String],
    },
    location: {
      type: {
        type: String,
        enum: ["Point"],
      },
      coordinates: {
        type: [Number],
      },
    },
    address: {
      type: String,
    },
    district: {
      type: String,
    },
    industry: {
      type: String,
    },
    specialities: [String],
    benefits: [String],
    department: {
      type: String,
    },
    companySize: {
      type: String,
      enum: ["fixed", "range"],
      default: "fixed",
    },
    minEmployees: {
      type: Number,
    },
    maxEmployees: {
      type: Number,
    },
    foundedYear: {
      type: Number,
    },
    description: {
      type: String,
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
    },
    refreshToken: {
      type: String,
    },
    passwordChangedAt: Date,
  },
  { timestamps: true },
)

// Hashing password before saving
organizationSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next()

  try {
    console.log("Hashing password for organization:", this.email)
    this.password = await bcrypt.hash(this.password, 12)
    this.passwordChangedAt = new Date(Date.now() - 1000)
    console.log("Password hashed successfully")
    next()
  } catch (error) {
    console.error("Password hashing error:", error)
    next(error)
  }
})

// Comparing password 
organizationSchema.methods.isPasswordCorrect = async function (candidatePassword) {
  try {
    console.log("Comparing organization passwords...")
    console.log("Input password exists:", !!candidatePassword)
    console.log("Input password type:", typeof candidatePassword)
    console.log("Stored hash exists:", !!this.password)
    console.log("Stored hash type:", typeof this.password)

    // Validate inputs
    if (!candidatePassword || typeof candidatePassword !== "string") {
      console.error("Invalid candidate password:", candidatePassword)
      return false
    }

    if (!this.password || typeof this.password !== "string") {
      console.error("Invalid stored password hash:", this.password)
      return false
    }

    // Ensuring password is a string and not empty
    const passwordString = String(candidatePassword).trim()
    const hashString = String(this.password).trim()

    if (!passwordString || !hashString) {
      console.error("Empty password or hash after conversion")
      return false
    }

    console.log("Password length:", passwordString.length)
    console.log("Hash length:", hashString.length)
    console.log("Hash starts with $2b$:", hashString.startsWith("$2b$"))

    const result = await bcrypt.compare(passwordString, hashString)
    console.log("Organization password comparison result:", result)
    return result
  } catch (error) {
    console.error("Organization password comparison error:", error)
    return false
  }
}

// Generating access token
organizationSchema.methods.generateAccessToken = function () {
  return JWT.sign(
    {
      _id: this._id,
      role: "organization",
    },
    config.accessTokenKey,
    { expiresIn: config.accessTokenExpiry || "7d" },
  )
}

// Generating refresh token
organizationSchema.methods.generateRefreshToken = function () {
  return JWT.sign(
    {
      _id: this._id,
      role: "organization",
    },
    config.refreshTokenKey,
    { expiresIn: config.refreshTokenExpiry || "7d" },
  )
}

export const Organization = mongoose.model("Organization", organizationSchema)
