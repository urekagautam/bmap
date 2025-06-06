import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Vacancy } from "../models/vacancy.model.js";
import { Organization } from "../models/organization.model.js";

// SET VACANCY DETAILS
export const postVacancyDetails = asyncHandler(async (req, res, next) => {
  const org = { _id: "68301911226a795e1fc43b63" };

  const {
    title,
    description,
    deadline,
    department,
    additionalInfo,
    skillsRequired,
    isSkillsRequired,
    jobByTime,
    jobByLocation,
    jobLevel,
    salary,
    salaryPeriod,
    hideSalary,
    experienceCriteria,
    experience,
    isExperienceRequired,
    requiredEmployees,
    orgId,
  } = req.body;

  console.log("Received data:", req.body);

  if (!title || !description || !deadline || !department) {
    throw new ApiError(
      400,
      "Required fields: title, description, deadline, department"
    );
  }

  const vacancyData = {
    title,
    description,
    deadline: new Date(deadline),
    department,
    additionalInfo: additionalInfo || "",
    skillsRequired: skillsRequired || [],
    isSkillsRequired: isSkillsRequired !== false,
    jobByTime: jobByTime || "fulltime",
    jobByLocation: jobByLocation || "on_site",
    jobLevel: jobLevel || "mid-level",
    salary: {
      type: salary?.type || "fixed",
      min: salary?.min || undefined,
      max: salary?.max || undefined,
    },
    salaryPeriod: salaryPeriod || "monthly",
    hideSalary: hideSalary || false,
    experienceCriteria: isExperienceRequired ? experienceCriteria : undefined,
    experience: isExperienceRequired ? experience : undefined,
    isExperienceRequired: isExperienceRequired || false,
    requiredEmployees: requiredEmployees || 1,
    orgId: orgId || org._id,
  };

  console.log("Creating vacancy with data:", vacancyData);

  const vacancy = await Vacancy.create(vacancyData);

  res.status(201).json(
    new ApiResponse(
      201,
      {
        vacancy: {
          ...vacancy.toObject(),
          deadline: vacancy.deadline.toISOString(),
        },
      },
      "Vacancy posted successfully"
    )
  );
});

// GET ALL VACANCY DETAILS
export const getVacancyDetails = asyncHandler(async (req, res, next) => {
  const vacancyId = req.params.id;

  const vacancy = await Vacancy.findById(vacancyId);

  if (!vacancy) {
    throw new ApiError(404, "Vacancy not found");
  }

  res.status(200).json(
    new ApiResponse(
      200,
      { vacancy },
      "Vacancy details fetched successfullyyyy"
    )
  );
});

//GET SPECIFIC VACANCY DETAILS ONLY 
export const getAllVacancies = async (req, res) => {
  try {
    const orgId = req.params.id;

    const vacancies = await Vacancy.find({ orgId })
      .sort({ createdAt: -1 }) // newest first
      .select('title salary jobLevel jobByTime jobByLocation deadline createdAt'); 

    res.status(200).json({
      success: true,
      count: vacancies.length,
      data: vacancies,
    });
  } catch (error) {
    console.error("Error fetching organization's vacancies:", error);
    res.status(500).json({ message: "Server error" });
  }
};


// Haversine formula to calculate distance in km between two lat/lng points
function getDistance(lat1, lng1, lat2, lng2) {
  const toRad = (value) => (value * Math.PI) / 180;

  const R = 6371; 
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export const getNearbyVacancies = asyncHandler(async (req, res, next) => {
  const { lat, lng, radius } = req.query;

  if (!lat || !lng) {
    return res.status(400).json({
      success: false,
      message: "Latitude and longitude are required in query params.",
    });
  }

  const userLat = parseFloat(lat);
  const userLng = parseFloat(lng);
  const distance = parseFloat(radius) || 10; 

  console.log("User coords:", userLat, userLng, "Radius:", distance);

  // Fetch all organizations
  const organizations = await Organization.find();
  console.log("Organizations fetched:", organizations.length);

  const nearbyOrgIds = [];

  for (let org of organizations) {
    // Check if location exists and has GeoJSON Point with coordinates array
    if (
      org.location &&
      org.location.type === "Point" &&
      Array.isArray(org.location.coordinates) &&
      org.location.coordinates.length === 2
    ) {
      const [orgLng, orgLat] = org.location.coordinates; // yesma GeoJSON stores as [lng, lat]
      const d = getDistance(userLat, userLng, orgLat, orgLng);

      console.log(`Distance to org ${org._id}: ${d.toFixed(2)} km`);

      if (d <= distance) {
        nearbyOrgIds.push(org._id);
      }
    } else {
      console.log(`Organization ${org._id} missing or invalid location data`);
    }
  }

  console.log("Nearby Org IDs:", nearbyOrgIds);

  const jobs = await Vacancy.find({ orgId: { $in: nearbyOrgIds } });

  console.log("Jobs found:", jobs.length);

  res.status(200).json(
    new ApiResponse(200, { jobs }, "Nearby vacancies fetched successfully")
  );
});
