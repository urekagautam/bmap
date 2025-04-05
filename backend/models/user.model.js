import mongoose from "mongoose";

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
    phonenum: {
      type: String,
      select: false,
      unique: true,
    },
    image: {
      type: String,
      default: "", //laterr
    },
    experience_level: {
      type: String,
      required: true,
      enum: ["Entry-Level","Junior","Senior"] //to modify later after UI
    },
    location: {
      lat: {
        type: Number,
        required: true,
        select: false
      },
      lng:{
        type: Number,
        required: true,
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
    followed: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Organization",
      },
    ],
  },
  { timestamps: true }
);

export const User = mongoose.model("User", userSchema);