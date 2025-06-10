import mongoose from "mongoose";
import JWT from "jsonwebtoken";
import bcrypt from "bcrypt";
import { config } from "../config/config.js";

// Define schema
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
      required: true
    },
    phoneNo: {
      type: String,
      unique: true,
      sparse: true,
    },
     image: {
      type: [String],
    }, 
/*   || LS || ownersPhoto: { type: String },
    citizenshipFront: { type: String },
    citizenshipBack: { type: String },
    panCard: { type: String },
    vatCard: { type: String }, */
    location: {
    type: {
      type: String,
      enum: ['Point'],
    },
    coordinates: {
      type: [Number],  
    }
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
      type: String
    },
  },
  { timestamps: true }
);

//
// ➤ MIDDLEWARE - Password Hashing Before Save
//
organizationSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

//
// ➤ METHOD - Compare Password
//
organizationSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

//
// ➤ METHOD - Generate Access Token
//

organizationSchema.methods.generateAccessToken = function () {
  return JWT.sign(
    {
      _id: this._id,
      role: "organization",
    },
    config.accessTokenKey,
    { expiresIn: config.accessTokenExpiry || "7d" }
  );
};

//
// ➤ METHOD - Generate Refresh Token
//
organizationSchema.methods.generateRefreshToken = function () {
  return JWT.sign(
    {
      _id: this._id,
      role: "organization",
    },
    config.refreshTokenKey,
    { expiresIn: config.refreshTokenExpiry || "7d" }
  );
};

//
// ➤ Export the Model
//
export const Organization = mongoose.model("Organization", organizationSchema);
