import mongoose from "mongoose";

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
    phonenum: {
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
  },
  { timestamps: true }
);

export const Organization = mongoose.model("Organization", organizationSchema);