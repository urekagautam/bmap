import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { Application } from "../models/application.model.js"
import { User } from "../models/user.model.js"
import { Vacancy } from "../models/vacancy.model.js"

// Helper function to check and update vacancy status
const checkAndUpdateVacancyStatus = async (vacancyId, forceRecheck = false) => {
  try {
    // Get vacancy details
    const vacancy = await Vacancy.findById(vacancyId).select("requiredEmployees deadline isVacancyOpen");
    if (!vacancy) {
      console.log("❌ Vacancy not found for status update");
      return;
    }

    // Count hired employees for this vacancy
    const hiredCount = await Application.countDocuments({
      vacancy_id: vacancyId,
      status: 4 // HIRED status
    });

    console.log(`📊 Vacancy ${vacancyId}: Required: ${vacancy.requiredEmployees}, Hired: ${hiredCount}`);

    let shouldBeOpen = vacancy.isVacancyOpen; // Start with current status

    // Check if we have enough hired candidates
    if (hiredCount >= vacancy.requiredEmployees) {
      // Close the vacancy if we have enough hired candidates
      shouldBeOpen = false;
      console.log(`✅ Vacancy ${vacancyId} CLOSED - Reason: Required employees (${hiredCount}/${vacancy.requiredEmployees}) hired`);
    } else {
      // If we don't have enough hired candidates, make sure the vacancy is open
      shouldBeOpen = true;
      console.log(`✅ Vacancy ${vacancyId} REOPENED - Reason: Not enough hired employees (${hiredCount}/${vacancy.requiredEmployees})`);
    }

    // Update vacancy status if it has changed or if we're forcing a recheck
    if (vacancy.isVacancyOpen !== shouldBeOpen || forceRecheck) {
      await Vacancy.findByIdAndUpdate(vacancyId, { isVacancyOpen: shouldBeOpen });
      console.log(`🔄 Updated vacancy ${vacancyId} status to: ${shouldBeOpen ? 'OPEN' : 'CLOSED'}`);
      
      // Return the updated status
      return {
        hiredCount,
        requiredEmployees: vacancy.requiredEmployees,
        isVacancyOpen: shouldBeOpen,
        deadlinePassed: false
      };
    }

    return {
      hiredCount,
      requiredEmployees: vacancy.requiredEmployees,
      isVacancyOpen: shouldBeOpen,
      deadlinePassed
    };

  } catch (error) {
    console.error("❌ Error updating vacancy status:", error);
  }
};

// Updated updateApplicationStatus function
export const updateApplicationStatus = asyncHandler(async (req, res, next) => {
  const { applicationId } = req.params;
  const { status } = req.body;

  if (!applicationId || !applicationId.match(/^[0-9a-fA-F]{24}$/)) {
    return next(new ApiError(400, "A valid application ID is required."));
  }

  if (status === undefined || status === null) {
    return next(new ApiError(400, "Status is required."));
  }

  const numericStatus = convertStatusToNumber(status);
  if (!Object.values(APPLICATION_STATUS).includes(numericStatus)) {
    return next(new ApiError(400, "Invalid status value provided."));
  }

  // First, get the current application to check if we're changing from HIRED status
  const currentApplication = await Application.findById(applicationId);
  if (!currentApplication) {
    return next(new ApiError(404, "Application not found."));
  }

  const wasHired = currentApplication.status === 4; // 4 = HIRED
  const isChangingFromHired = wasHired && numericStatus !== 4;

  // Update the application status
  const application = await Application.findByIdAndUpdate(
    applicationId,
    { status: numericStatus },
    { new: true, runValidators: true }
  );

  // Force a recheck of vacancy status if changing from HIRED to another status
  // or if the new status is HIRED
  const forceRecheck = isChangingFromHired || numericStatus === 4;
  
  // Check and update vacancy status after application status change
  const vacancyStatusInfo = await checkAndUpdateVacancyStatus(application.vacancy_id, forceRecheck);

  console.log(`✅ Application ${applicationId} status updated to ${getStatusLabel(numericStatus)}`);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        applicationId: application._id,
        status: application.status,
        statusLabel: getStatusLabel(application.status),
        vacancyStatus: vacancyStatusInfo ? {
          isVacancyOpen: vacancyStatusInfo.isVacancyOpen,
          hiredCount: vacancyStatusInfo.hiredCount,
          requiredEmployees: vacancyStatusInfo.requiredEmployees,
          deadlinePassed: vacancyStatusInfo.deadlinePassed
        } : null
      },
      "Application status updated successfully."
    )
  );
});
// Check if user has applied for a specific job
export const checkUserApplicationStatus = asyncHandler(async (req, res, next) => {
  try {
    const { userId, jobId } = req.params;
    
    console.log("🔍 Checking application status for userId:", userId, "jobId:", jobId);
    
    // Validate required parameters
    if (!userId || !jobId) {
      return next(new ApiError(400, "User ID and Job ID are required"));
    }
    
    // Validate ObjectId format
    if (!userId.match(/^[0-9a-fA-F]{24}$/) || !jobId.match(/^[0-9a-fA-F]{24}$/)) {
      return next(new ApiError(400, "Invalid user ID or job ID format"));
    }
    
    // Check if application exists
    const existingApplication = await Application.findOne({
      user_id: userId,
      vacancy_id: jobId,
    }).select("_id status createdAt");
    
    const hasApplied = !!existingApplication;
    
    console.log("📊 Application status check result:", {
      userId,
      jobId,
      hasApplied,
      applicationId: existingApplication?._id,
      status: existingApplication?.status,
      appliedAt: existingApplication?.createdAt
    });
    
    return res.status(200).json(
      new ApiResponse(
        200,
        {
          hasApplied,
          applicationId: existingApplication?._id || null,
          status: existingApplication?.status || null,
          statusLabel: existingApplication ? getStatusLabel(existingApplication.status) : null,
          appliedAt: existingApplication?.createdAt || null,
        },
        hasApplied ? "User has already applied for this job" : "User has not applied for this job"
      )
    );
  } catch (error) {
    console.error("❌ Error checking application status:", error);
    return next(new ApiError(500, "Something went wrong while checking application status"));
  }
});

// Status constants for better maintainability
const APPLICATION_STATUS = {
  APPLIED: 0,
  SHORTLISTED: 1,
  INTERVIEW: 2,
  REJECTED: 3,
  HIRED: 4,
  UNDER_REVIEW: 5
}

// Helper function for status labels
const getStatusLabel = (status) => {
  switch (status) {
    case 0:
      return "Applied"
    case 1:
      return "Shortlisted"
    case 2:
      return "Interview"
    case 3:
      return "Rejected"
    case 4:
      return "Hired"
    case 5:
      return "Under Review"
    default:
      return "Applied"
  }
}

// Convert string status to number (for backward compatibility)
const convertStatusToNumber = (status) => {
  if (typeof status === "number") return status

  const statusMap = {
    APPLIED: 0,
    SHORTLISTED: 1,
    SHORT_LISTED: 1, // Handle both formats
    INTERVIEW_SCHEDULED: 2,
    INTERVIEW: 2,
    REJECTED: 3,
    HIRED: 4,
    UNDER_REVIEW: 5,
  }
  return statusMap[status] !== undefined ? statusMap[status] : Number.parseInt(status) || 0
}

export const submitJobApplication = asyncHandler(async (req, res, next) => {
  try {
    console.log("📝 Submitting job application with data:", req.body)

    const { userId, jobId, jobDescription, salaryExpectations } = req.body

    // Validate required fields
    if (!userId || !jobId || !jobDescription) {
      console.log("❌ Missing required fields:", { userId, jobId, jobDescription })
      return next(new ApiError(400, "All fields are required"))
    }

    // Validate ObjectId format
    if (!userId.match(/^[0-9a-fA-F]{24}$/) || !jobId.match(/^[0-9a-fA-F]{24}$/)) {
      return next(new ApiError(400, "Invalid user ID or job ID format"))
    }

    // Check if user exists
    const user = await User.findById(userId)
    if (!user) {
      console.log("❌ User not found:", userId)
      return next(new ApiError(404, "User not found"))
    }

    // Check if vacancy exists
    const vacancy = await Vacancy.findById(jobId)
    if (!vacancy) {
      console.log("❌ Vacancy not found:", jobId)
      return next(new ApiError(404, "Job vacancy not found"))
    }

    // Check if user has already applied for this job
    const existingApplication = await Application.findOne({
      user_id: userId,
      vacancy_id: jobId,
    })

    if (existingApplication) {
      console.log("❌ User already applied:", { userId, jobId })
      return next(new ApiError(400, "You have already applied for this position"))
    }

    // Create new application
    const newApplication = await Application.create({
      user_id: userId,
      vacancy_id: jobId,
      documents: "Resume link will be added later", // You can update this later
      description: jobDescription,
      salaryExpectations: salaryExpectations ? salaryExpectations.toString() : "",
      status: APPLICATION_STATUS.APPLIED, // Use the constant instead of undefined variable
    })

    console.log("✅ Application created successfully:", newApplication._id)

    return res.status(201).json(
      new ApiResponse(
        201,
        {
          applicationId: newApplication._id,
          userId: newApplication.user_id,
          jobId: newApplication.vacancy_id,
          description: newApplication.description,
          salaryExpectations: newApplication.salaryExpectations,
          status: newApplication.status,
          statusLabel: getStatusLabel(newApplication.status),
        },
        "Job application submitted successfully",
      ),
    )
  } catch (error) {
    console.error("❌ Error submitting job application:", error)
    console.error("Error stack:", error.stack)

    // Handle specific MongoDB errors
    if (error.code === 11000) {
      return next(new ApiError(400, "You have already applied for this position"))
    }

    if (error.name === "ValidationError") {
      return next(new ApiError(400, `Validation error: ${error.message}`))
    }

    return next(new ApiError(500, "Something went wrong while submitting application"))
  }
})

// NEW: Update application status (for organizations)


// Update application status when user views (changes from Applied to Under Review)
export const updateApplicationStatusOnView = asyncHandler(async (req, res, next) => {
  try {
    const { applicationId } = req.params

    if (!applicationId) {
      return next(new ApiError(400, "Application ID is required"))
    }

    // Find the application
    const application = await Application.findById(applicationId)

    if (!application) {
      return next(new ApiError(404, "Application not found"))
    }

    // Only change status from "Applied" (0) to "Under Review" (5) if it's currently "Applied"
    if (application.status === APPLICATION_STATUS.APPLIED) {
      application.status = APPLICATION_STATUS.UNDER_REVIEW
      await application.save()
    }

    return res.status(200).json(
      new ApiResponse(
        200,
        {
          applicationId: application._id,
          status: application.status,
          statusLabel: getStatusLabel(application.status),
          message: "Application status updated to Under Review",
        },
        "Application status updated successfully",
      ),
    )
  } catch (error) {
    console.error("Error updating application status:", error)
    return next(new ApiError(500, "Something went wrong while updating application status"))
  }
})

// Get applications for a specific vacancy
/* export const getVacancyApplications = async (req, res) => {
  try {
    const { vacancyId } = req.params

    console.log("🔍 Fetching applications for vacancy ID:", vacancyId)

    // Validate vacancy ID format
    if (!vacancyId || !vacancyId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: "Invalid vacancy ID format",
      })
    }

    // Check if vacancy exists and get title
    const vacancy = await Vacancy.findById(vacancyId).select("title")
    if (!vacancy) {
      return res.status(404).json({
        success: false,
        message: "Vacancy not found",
      })
    }

    // Fetch applications with only required user fields
    const applications = await Application.find({ vacancy_id: vacancyId })
      .populate({
        path: "user_id",
        select: "name image",
      })
      .select("status createdAt")
      .sort({ createdAt: -1 })
      .lean()

    console.log(`📊 Found ${applications.length} applications`)

    // Format the response data with only required fields
    const formattedApplications = applications.map((application) => ({
      id: application._id,
      user: {
        name: application.user_id?.name || "Unknown User",
        image: application.user_id?.image || "/RandomImage.png",
      },
      status: application.status || 0,
      statusLabel: getStatusLabel(application.status || 0),
      createdAt: application.createdAt,
    }))

    return res.status(200).json({
      success: true,
      message: "Applications fetched successfully",
      data: {
        vacancy: {
          id: vacancy._id,
          title: vacancy.title,
        },
        applications: formattedApplications,
        totalApplications: formattedApplications.length,
      },
    })
  } catch (error) {
    console.error("❌ Error fetching vacancy applications:", error)
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    })
  }
} */
// Get applications for a specific vacancy
export const getVacancyApplications = async (req, res) => {
  try {
    const { vacancyId } = req.params
    console.log("🔍 Fetching applications for vacancy ID:", vacancyId)

    // Validate vacancy ID format
    if (!vacancyId || !vacancyId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: "Invalid vacancy ID format",
      })
    }

    // Check if vacancy exists and get details including status
    const vacancy = await Vacancy.findById(vacancyId).select("title requiredEmployees isVacancyOpen deadline")
    if (!vacancy) {
      return res.status(404).json({
        success: false,
        message: "Vacancy not found",
      })
    }

    // Fetch applications with only required user fields
    const applications = await Application.find({ vacancy_id: vacancyId })
      .populate({
        path: "user_id",
        select: "name image",
      })
      .select("status createdAt")
      .sort({ createdAt: -1 })
      .lean()

    // Count hired employees
    const hiredCount = applications.filter(app => app.status === 4).length;

    console.log(`📊 Found ${applications.length} applications, ${hiredCount} hired`)

    // Format the response data with only required fields
    const formattedApplications = applications.map((application) => ({
      id: application._id,
      user: {
        name: application.user_id?.name || "Unknown User",
        image: application.user_id?.image || "/RandomImage.png",
      },
      status: application.status || 0,
      statusLabel: getStatusLabel(application.status || 0),
      createdAt: application.createdAt,
    }))

    // Check if deadline has passed
    const now = new Date();
    const deadlinePassed = vacancy.deadline && new Date(vacancy.deadline) <= now;

    return res.status(200).json({
      success: true,
      message: "Applications fetched successfully",
      data: {
        vacancy: {
          id: vacancy._id,
          title: vacancy.title,
          requiredEmployees: vacancy.requiredEmployees,
          isVacancyOpen: vacancy.isVacancyOpen,
          deadline: vacancy.deadline,
          deadlinePassed: deadlinePassed
        },
        applications: formattedApplications,
        totalApplications: formattedApplications.length,
        hiredCount: hiredCount,
        remainingPositions: Math.max(0, vacancy.requiredEmployees - hiredCount)
      },
    })
  } catch (error) {
    console.error("❌ Error fetching vacancy applications:", error)
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    })
  }
}
// Get application details
export const getApplicationDetails = asyncHandler(async (req, res, next) => {
  try {
    const { applicationId } = req.params

    if (!applicationId) {
      return next(new ApiError(400, "Application ID is required"))
    }

    const application = await Application.findById(applicationId)
      .populate({
        path: "user_id",
        select: "name email phone gender image socialProfile resume", // Added resume field
      })
      .populate({
        path: "vacancy_id",
        select:
          "title department jobByTime jobByLocation jobLevel salary salaryPeriod deadline experienceCriteria experience",
      })

    if (!application) {
      return next(new ApiError(404, "Application not found"))
    }

    const responseData = {
      id: application._id,
      user: {
        name: application.user_id?.name || "N/A",
        email: application.user_id?.email || "N/A",
        phone: application.user_id?.phone || "N/A",
        gender: application.user_id?.gender || "N/A",
        image: application.user_id?.image || "/placeholder.svg",
        resume: application.user_id?.resume || null, // Include resume data
        socialProfile: {
          linkedin: application.user_id?.socialProfile?.linkedin || "N/A",
          github: application.user_id?.socialProfile?.github || "N/A",
          portfolio: application.user_id?.socialProfile?.portfolio || "N/A",
        },
      },
      vacancy: {
        title: application.vacancy_id?.title || "N/A",
        department: application.vacancy_id?.department || "N/A",
        jobByTime: application.vacancy_id?.jobByTime || "N/A",
        jobByLocation: application.vacancy_id?.jobByLocation || "N/A",
        jobLevel: application.vacancy_id?.jobLevel || "N/A",
        salary: application.vacancy_id?.salary || { type: "fixed", min: 0, max: 0 },
        salaryPeriod: application.vacancy_id?.salaryPeriod || "Monthly",
        deadline: application.vacancy_id?.deadline || new Date(),
        experienceCriteria: application.vacancy_id?.experienceCriteria || "N/A",
        experience: application.vacancy_id?.experience || "N/A",
      },
      documents: application.documents || "N/A",
      description: application.description || "N/A",
      salaryExpectations: application.salaryExpectations || "N/A",
      status: application.status || 0,
      statusLabel: getStatusLabel(application.status || 0),
      createdAt: application.createdAt,
    }

    return res.status(200).json(new ApiResponse(200, responseData, "Application details retrieved successfully"))
  } catch (error) {
    console.error("Error fetching application details:", error)
    return next(new ApiError(500, "Something went wrong while fetching application details"))
  }
})

// Get all applications for a user (newest first)
export const getUserApplications = asyncHandler(async (req, res, next) => {
  try {
    const userId = req.params.userId

    console.log("🔍 Fetching applications for user ID:", userId)

    if (!userId) {
      return next(new ApiError(400, "User ID is required"))
    }

    // Validate user ID format
    if (!userId.match(/^[0-9a-fA-F]{24}$/)) {
      return next(new ApiError(400, "Invalid user ID format"))
    }

    // Fetch applications with proper sorting (newest first) and populate vacancy and organization details
    const applications = await Application.find({ user_id: userId })
      .populate({
        path: "vacancy_id",
        select: "title department orgId createdAt deadline",
        populate: {
          path: "orgId",
          select: "orgName",
        },
      })
      .sort({ createdAt: -1 }) // NEWEST FIRST
      .lean()

    console.log(`📊 Found ${applications.length} applications for user`)

    // Add status labels to applications and format the response
    const applicationsWithLabels = applications.map((app) => {
      // Calculate time ago for better UX
      const now = new Date()
      const appliedDate = new Date(app.createdAt)
      const diffInMinutes = Math.floor((now - appliedDate) / (1000 * 60))

      let timeAgo
      if (diffInMinutes < 60) {
        timeAgo = `${diffInMinutes}min ago`
      } else if (diffInMinutes < 1440) {
        timeAgo = `${Math.floor(diffInMinutes / 60)}hr ago`
      } else if (diffInMinutes < 10080) {
        const days = Math.floor(diffInMinutes / 1440)
        timeAgo = `${days}d ago`
      } else {
        const weeks = Math.floor(diffInMinutes / 10080)
        timeAgo = `${weeks}w ago`
      }

      return {
        _id: app._id,
        user_id: app.user_id,
        vacancy_id: app.vacancy_id,
        documents: app.documents,
        description: app.description,
        salaryExpectations: app.salaryExpectations,
        status: app.status || 0,
        statusLabel: getStatusLabel(app.status || 0),
        createdAt: app.createdAt,
        updatedAt: app.updatedAt,
        timeAgo: timeAgo, // Add time ago for frontend use
      }
    })

    return res.status(200).json(new ApiResponse(200, applicationsWithLabels, "User applications fetched successfully"))
  } catch (error) {
    console.error("❌ Error fetching user applications:", error)
    return next(new ApiError(500, "Something went wrong while fetching applications"))
  }
})

// Get the most recent applications for an organization
export const getRecentOrgApplications = asyncHandler(async (req, res, next) => {
  try {
    const { orgId } = req.params;

    if (!orgId) {
      return next(new ApiError(400, "Organization ID is required"));
    }

    // Find all vacancies for the organization to get their IDs
    const orgVacancies = await Vacancy.find({ orgId }).select("_id");
    const orgVacancyIds = orgVacancies.map((v) => v._id);

    if (orgVacancyIds.length === 0) {
      return res.status(200).json(new ApiResponse(200, [], "No vacancies found for this organization"));
    }

    // Find the 5 most recent applications for those vacancies
    const recentApplications = await Application.find({ vacancy_id: { $in: orgVacancyIds } })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate({
        path: "user_id",
        select: "name email", // Select fields from User
        model: "User"
      })
      .populate({
        path: "vacancy_id",
        select: "title", // Select fields from Vacancy
        model: "Vacancy"
      });

    if (!recentApplications || recentApplications.length === 0) {
      return res.status(200).json(new ApiResponse(200, [], "No recent applications found"));
    }

    return res.status(200).json(new ApiResponse(200, recentApplications, "Recent applications fetched successfully"));

  } catch (error) {
    console.error("Error fetching recent applications for organization:", error);
    return next(new ApiError(500, "Failed to fetch recent applications"));
  }
});

// Get organization vacancies with application counts
/* export const getOrganizationVacancies = asyncHandler(async (req, res, next) => {
  try {
    const orgId = req.params.orgId
    console.log("Fetching vacancies WITH APPLICATIONS for orgId:", orgId)

    if (!orgId) {
      return next(new ApiError(400, "Organization ID is required"))
    }

    const orgVacancies = await Vacancy.find({ orgId }).select("_id")
    const orgVacancyIds = orgVacancies.map((v) => v._id)
    console.log("Organization has", orgVacancyIds.length, "total vacancies")

    if (!orgVacancyIds.length) {
      return res.status(200).json(new ApiResponse(200, [], "No vacancies found for this organization"))
    }

    const vacanciesWithApplications = await Application.aggregate([
      {
        $match: {
          vacancy_id: { $in: orgVacancyIds },
        },
      },
      {
        $group: {
          _id: "$vacancy_id",
          applicantCount: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: "vacancies",
          localField: "_id",
          foreignField: "_id",
          as: "vacancy",
        },
      },
      { $unwind: "$vacancy" },
      {
        $project: {
          vacancyId: "$_id",
          title: "$vacancy.title",
          createdAt: "$vacancy.createdAt",
          deadline: "$vacancy.deadline",
          applicantCount: 1,
        },
      },
      { $sort: { createdAt: -1 } }, // Newest vacancies first
    ])

    console.log("Found", vacanciesWithApplications.length, "vacancies WITH applications")

    if (!vacanciesWithApplications.length) {
      return res.status(200).json(new ApiResponse(200, [], "No vacancies with applications found"))
    }

    const formattedVacancies = vacanciesWithApplications.map((item) => {
      const now = new Date()
      const postedDate = new Date(item.createdAt)
      const diffInMinutes = Math.floor((now - postedDate) / (1000 * 60))

      let timeAgo
      if (diffInMinutes < 60) {
        timeAgo = `${diffInMinutes}min ago`
      } else if (diffInMinutes < 1440) {
        timeAgo = `${Math.floor(diffInMinutes / 60)}hr ago`
      } else if (diffInMinutes < 10080) {
        const days = Math.floor(diffInMinutes / 1440)
        timeAgo = `${days}d ago`
      } else {
        const weeks = Math.floor(diffInMinutes / 10080)
        timeAgo = `${weeks}w ago`
      }

      const isActive = item.deadline ? new Date(item.deadline) > now : true

      console.log(`Vacancy: ${item.title} (ID: ${item.vacancyId}) has ${item.applicantCount} applicants`)

      return {
        vacancyId: item.vacancyId,
        title: item.title,
        applicantCount: item.applicantCount,
        timeAgo: timeAgo,
        status: isActive ? "OPEN" : "CLOSED",
        createdAt: item.createdAt,
      }
    })

    console.log("Final result:", formattedVacancies)

    return res
      .status(200)
      .json(new ApiResponse(200, formattedVacancies, `Found ${formattedVacancies.length} vacancies with applications`))
  } catch (error) {
    console.error("Error fetching organization vacancies with applications:", error)
    return next(new ApiError(500, "Something went wrong while fetching vacancies with applications"))
  }
}) */

// Get organization vacancies with application counts
export const getOrganizationVacancies = asyncHandler(async (req, res, next) => {
  try {
    const orgId = req.params.orgId
    console.log("Fetching vacancies WITH APPLICATIONS for orgId:", orgId)

    if (!orgId) {
      return next(new ApiError(400, "Organization ID is required"))
    }

    const orgVacancies = await Vacancy.find({ orgId }).select("_id")
    const orgVacancyIds = orgVacancies.map((v) => v._id)

    console.log("Organization has", orgVacancyIds.length, "total vacancies")

    if (!orgVacancyIds.length) {
      return res.status(200).json(new ApiResponse(200, [], "No vacancies found for this organization"))
    }

    const vacanciesWithApplications = await Application.aggregate([
      {
        $match: {
          vacancy_id: { $in: orgVacancyIds },
        },
      },
      {
        $group: {
          _id: "$vacancy_id",
          applicantCount: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: "vacancies",
          localField: "_id",
          foreignField: "_id",
          as: "vacancy",
        },
      },
      { $unwind: "$vacancy" },
      {
        $project: {
          vacancyId: "$_id",
          title: "$vacancy.title",
          createdAt: "$vacancy.createdAt",
          deadline: "$vacancy.deadline",
          requiredEmployees: "$vacancy.requiredEmployees",
          isVacancyOpen: "$vacancy.isVacancyOpen", // ADD THIS LINE
          applicantCount: 1,
        },
      },
      { $sort: { createdAt: -1 } }, // Newest vacancies first
    ])

    console.log("Found", vacanciesWithApplications.length, "vacancies WITH applications")

    if (!vacanciesWithApplications.length) {
      return res.status(200).json(new ApiResponse(200, [], "No vacancies with applications found"))
    }

    const formattedVacancies = vacanciesWithApplications.map((item) => {
      const now = new Date()
      const postedDate = new Date(item.createdAt)
      const diffInMinutes = Math.floor((now - postedDate) / (1000 * 60))
      let timeAgo
      if (diffInMinutes < 60) {
        timeAgo = `${diffInMinutes}min ago`
      } else if (diffInMinutes < 1440) {
        timeAgo = `${Math.floor(diffInMinutes / 60)}hr ago`
      } else if (diffInMinutes < 10080) {
        const days = Math.floor(diffInMinutes / 1440)
        timeAgo = `${days}d ago`
      } else {
        const weeks = Math.floor(diffInMinutes / 10080)
        timeAgo = `${weeks}w ago`
      }

      // UPDATED STATUS LOGIC - Check both isVacancyOpen AND deadline
      const deadlinePassed = item.deadline ? new Date(item.deadline) <= now : false
      
      // Vacancy is CLOSED if:
      // 1. isVacancyOpen is false (positions filled or manually closed), OR
      // 2. Deadline has passed
      const isActive = item.isVacancyOpen && !deadlinePassed

      console.log(`Vacancy: ${item.title} (ID: ${item.vacancyId}) - isVacancyOpen: ${item.isVacancyOpen}, deadlinePassed: ${deadlinePassed}, final status: ${isActive ? 'OPEN' : 'CLOSED'}`)

      return {
        vacancyId: item.vacancyId,
        title: item.title,
        applicantCount: item.applicantCount,
        timeAgo: timeAgo,
        status: isActive ? "OPEN" : "CLOSED",
        createdAt: item.createdAt,
        deadline: item.deadline,
        requiredEmployees: item.requiredEmployees,
        isVacancyOpen: item.isVacancyOpen, // Include for frontend use
        deadlinePassed: deadlinePassed, // Include for frontend use
      }
    })

    console.log("Final result:", formattedVacancies)
    return res
      .status(200)
      .json(new ApiResponse(200, formattedVacancies, `Found ${formattedVacancies.length} vacancies with applications`))
  } catch (error) {
    console.error("Error fetching organization vacancies with applications:", error)
    return next(new ApiError(500, "Something went wrong while fetching vacancies with applications"))
  }
})

  export const getDashboardStats = asyncHandler(async (req, res, next) => {
  const { orgId } = req.params;
  // 1. Count active jobs (all jobs for this org)
  const activeJobs = await Vacancy.countDocuments({ orgId });
  // 2. Get all vacancies for this org
  const vacancies = await Vacancy.find({ orgId }).select("_id");
  const vacancyIds = vacancies.map(v => v._id);
  // 3. Count total applications
  const totalApplications = await Application.countDocuments({ vacancy_id: { $in: vacancyIds } });
  // 4. Count hired
  const hired = await Application.countDocuments({ vacancy_id: { $in: vacancyIds }, status: 4 });
  // 5. Count shortlisted
  const shortlisted = await Application.countDocuments({ vacancy_id: { $in: vacancyIds }, status: 1 });
  res.json({
    success: true,
    data: {
      activeJobs,
      totalApplications,
      hired,
      shortlisted
    }
  });
});
