import mongoose from "mongoose";

const vacancySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    isVacancyOver: {
      type: Boolean,
      default: false,
    },
    valid_date: {
      type: Date,
    },
    org_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
    },
    skills_required: [
      {
        type: String,
        trim: true,
      },
    ],
    //+ experience required (laterr)
  },
  { timestamps: true }
);

export const Vacancy = mongoose.model("Vacancy", vacancySchema);