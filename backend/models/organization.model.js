import mongoose from "mongoose";
import JWT from "jsonwebtoken";
import bcrypt from "bcrypt";

const organizationSchema = new mongoose.Schema(
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
    },
    image: {
      type: String,
    },
    address: {
      type: String,
    },
    location: {
      lat: {
        type: Number,
        required: true,
        select: false,
      },
      lng: {
        type: Number,
        required: true,
        select: false,
      },
    },
    refreshToken: {
      type: String,
      select: false,
    },
  },
  { timestamps: true }
);

// Password encryption before saving
organizationSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Compare passwords
organizationSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

// Access Token
organizationSchema.methods.generateAccessToken = function () {
  return JWT.sign(
    {
      _id: this._id,
      role: "organization",
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "1h" }
  );
};

// Refresh Token
organizationSchema.methods.generateRefreshToken = function () {
  return JWT.sign(
    {
      _id: this._id,
      role: "organization",
    },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "7d" }
  );
};

export const Organization = mongoose.model("Organization", organizationSchema);
