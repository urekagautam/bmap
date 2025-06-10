import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Application } from "../models/application.model.js";
import { User } from "../models/user.model.js";

const submitJobApplication = asyncHandler(async (req, res, next) => {
  try {
    const { userId, jobId, jobDescription, salaryExpectations } = req.body;

    if (!userId || !jobId || !jobDescription) {
      return next(new ApiError(400, "All fields are required"));
    }

    // Checking if user exists
    const user = await User.findById(userId);
    if (!user) {
      return next(new ApiError(404, "User not found"));
    }

    // Checking if user has already applied for this job
    const existingApplication = await Application.findOne({
      user_id: userId,
      vacancy_id: jobId
    });

    if (existingApplication) {
      return next(new ApiError(400, "You have already applied for this position"));
    }

    // Creating new application
    const newApplication = await Application.create({
      user_id: userId,
      vacancy_id: jobId,
      documents: "Resume link will be added later",
      description: jobDescription,
      salaryExpectations: salaryExpectations.toString(),
      status: 0 // Applied
    });

    return res.status(201).json(
      new ApiResponse(
        201,
        {
          applicationId: newApplication._id,
          userId: newApplication.user_id,
          jobId: newApplication.vacancy_id,
          description: newApplication.description,
          salaryExpectations: newApplication.salaryExpectations,
          status: newApplication.status
        },
        "Job application submitted successfully"
      )
    );

  } catch (error) {
    console.error("Error submitting job application:", error);
    return next(new ApiError(500, "Something went wrong while submitting application"));
  }
});

export { submitJobApplication };