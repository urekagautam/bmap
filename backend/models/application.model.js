import mongoose from "mongoose"

const applicationSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    vacancy_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vacancy",
      required: true,
    },
    documents: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      trim: true,
    },
    salaryExpectations: {
      type: String,
      trim: true,
    },
    status: {
      type: Number,
      enum: [0, 1, 2, 3, 4, 5], // 0: Applied, 1: Shortlisted, 2: Interview, 3: Rejected, 4: Hired, 5: Under Review
      default: 0, // Applied / Pending
    }, 
  },
  { timestamps: true },
)

// Create a compound index to prevent duplicate applications
applicationSchema.index({ user_id: 1, vacancy_id: 1 }, { unique: true })

export const Application = mongoose.model("Application", applicationSchema)
