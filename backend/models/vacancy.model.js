import mongoose from "mongoose";

const vacancySchema = new mongoose.Schema(
  {
    title: String,
    description: String,
    deadline: Date,
    department: String,
    additionalInfo: String,
    skillsRequired: [String],
    isSkillsRequired: { type: Boolean, default: true },
    jobByTime: {
      type: String,
      enum: ["fulltime", "parttime", "contract", "internship", "freelance"],
      default: "fulltime",
    },
    jobByLocation: {
      type: String,
      enum: ["on_site", "remote", "hybrid", "none"],
      default: "on_site",
    },
    jobLevel: {
      type: String,
      enum: ["senior", "mid-level", "intern"],
      default: "mid-level",
    },
    salary: {
      type: {
        type: String,
        enum: ["fixed", "range"],
        default: "fixed",
      },
      min: Number,
      max: Number,
    },
    salaryPeriod: {
      type: String,
      enum: ["hourly", "daily", "weekly", "monthly", "yearly"],
      default: "monthly",
    },
    hideSalary: { type: Boolean, default: false },
    experienceCriteria: {
      type: String,
      enum: [
        "more_than",
        "less_than",
        "more_than_or_equal_to",
        "less_than_or_equal_to",
        "equal_to",
      ],
    },
    experience: {
      type: String,
      enum: ["1year", "2years", "3years", "4years", "5+years"],
    },
    isExperienceRequired: { type: Boolean, default: false },
    requiredEmployees: Number,
    orgId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
    },
  },
  { timestamps: true }
);

export const Vacancy = mongoose.model("Vacancy", vacancySchema);
