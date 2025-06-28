import mongoose from "mongoose"
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import { config } from "../config/config.js"

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
    address: {
      type: String,
    },
    district: {
      type: String,
    },
    gender: {
      type: String,
      enum: ["M", "F", "Other"],
    },
    about: {
      type: String,
    },
    phone: {
      type: String,
      select: false,
      unique: true,
      sparse: true,
    },
    image: {
      type: String,
      default: "",
    },
    experience_level: {
      type: String,
      enum: ["Entry-Level", "Junior", "Senior"],
    },
    field_of_interest: {
      type: String,
      trim: true,
    },
    location: {
      lat: {
        type: Number,
        select: false,
      },
      lng: {
        type: Number,
        select: false,
      },
    },
    job_preference: {
      title: {
        type: String,
        trim: true,
      },
      job_by_time: {
        type: String,
        enum: ["fulltime", "parttime", "contract"],
        default: "fulltime",
      },
      job_by_location: {
        type: String,
        enum: ["on_site", "remote", "hybrid"],
        default: "on_site",
      },
      job_level: {
        type: String,
        enum: ["intern", "entry-level", "mid-level", "senior-level", "executive"],
        default: "mid-level",
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
  { timestamps: true },
)

// Hashing password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next()

  try {
    console.log("Hashing password for user:", this.email)
    this.password = await bcrypt.hash(this.password, 12)
    this.passwordChangedAt = new Date(Date.now() - 1000)
    console.log("Password hashed successfully")
    next()
  } catch (error) {
    console.error("Password hashing error:", error)
    next(error)
  }
})

// Comparing passwords
userSchema.methods.isPasswordCorrect = async function (candidatePassword) {
  try {
    console.log("Comparing passwords...")
    console.log("Input password exists:", !!candidatePassword)
    console.log("Input password type:", typeof candidatePassword)
    console.log("Stored hash exists:", !!this.password)
    console.log("Stored hash type:", typeof this.password)

    // Validating inputs
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
    console.log("Password comparison result:", result)
    return result
  } catch (error) {
    console.error("Password comparison error:", error)
    return false
  }
}

// Generating access token
userSchema.methods.generateAccessToken = function () {
  return jwt.sign({ _id: this._id }, config.accessTokenKey, {
    expiresIn: config.accessTokenExpiry,
  })
}

// Generating refresh token
userSchema.methods.generateRefreshToken = function () {
  return jwt.sign({ _id: this._id }, config.refreshTokenKey, {
    expiresIn: config.refreshTokenExpiry,
  })
}

export const User = mongoose.model("User", userSchema)
