import axios from "axios"

// Post a new job vacancy
export const apiPostVacancy = async (vacancyData) => {


  try {
    console.log("Sending vacancy data:", vacancyData)
    const response = await axios.post("http://localhost:5000/api/v1/vacancy", vacancyData, {
      headers: {
       
        "Content-Type": "application/json",
      },
    })

    return response.data
  } catch (error) {
    console.error("API Error Details:", error.response?.data || error.message)
    if (error.response) {
      throw error
    } else {
      throw new Error("Network error or server is down")
    }
  }
}

// Get all vacancies for an organization
export const apiGetOrgVacancies = async (orgId) => {
  try {
    const response = await axios.get(`http://localhost:5000/api/v1/getAllvacancies/${orgId}`, {
      headers: {
        "Content-Type": "application/json",
      },
    })
    return response.data
  } catch (error) {
    if (error.response) {
      console.error("Error response from backend:", error.response)
      throw error
    } else {
      throw new Error("Network error or server is down")
    }
  }
}

//get vacancy for a particular id
export const apiGetVacancyDetails = async (vacancyId) => {
  try {
    console.log("Fetching vacancy details for ID:", vacancyId)
    const response = await axios.get(`http://localhost:5000/api/v1/getvacancy/${vacancyId}`, {
      headers: {
        "Content-Type": "application/json",
      },
    })

    return response.data
  } catch (error) {
    console.error("API Error Details:", error.response?.data || error.message)
    if (error.response) {
      throw error
    } else {
      throw new Error("Network error or server is down")
    }
  }
}

//update vacancy for an id
// Update an existing job vacancy - NEW FUNCTION
export const apiUpdateVacancy = async (vacancyId, vacancyData) => {
  try {
    console.log("Updating vacancy with ID:", vacancyId)
    console.log("Sending update data:", vacancyData)
    const response = await axios.put(`http://localhost:5000/api/v1/vacancy/${vacancyId}`, vacancyData, {
      headers: {
        "Content-Type": "application/json",
      },
    })

    return response.data
  } catch (error) {
    console.error("API Error Details:", error.response?.data || error.message)
    if (error.response) {
      throw error
    } else {
      throw new Error("Network error or server is down")
    }
  }
}

// Get a specific vacancy by ID
/* export const apiGetVacancyById = async (vacancyId) => {
   const token = localStorage.getItem("orgAccessToken")

   if (!token) {
    throw new Error("No access token found. Please log in first.")
  } 

  try {
    const response = await axios.get(`http://localhost:5000/api/v1/vacancy/${vacancyId}`, {
      headers: {
        Authorization: `Bearer ${token}`, 
        "Content-Type": "application/json",
      },
    })

    return response.data
  } catch (error) {
    if (error.response) {
      console.error("Error response from backend:", error.response)
      throw error
    } else {
      throw new Error("Network error or server is down")
    }
  }
} */

// Get vacancy details by ID
/* export const apiGetVacancyDetails = async (vacancyId) => {
  // const token = localStorage.getItem("orgAccessToken")

 if (!token) {
    throw new Error("No access token found. Please log in first.")
  } 

  try {
    const response = await axios.get(`http://localhost:5000/api/v1/getvacancy/${vacancyId}`, {
      headers: {
        /* Authorization: `Bearer ${token}`, 
        "Content-Type": "application/json",
      },
    })

    return response.data
  } catch (error) {
    if (error.response) {
      console.error("Error response from backend:", error.response)
      throw error
    } else {
      throw new Error("Network error or server is down")
    }
  }
} */

// Fetching Job details in posting job application page
export const apiGetJobDetailsForApplication = async (jobId) => {
  try {
    const response = await axios.get(`http://localhost:5000/api/v1/job-details/${jobId}`, {
      headers: {
        "Content-Type": "application/json",
      },
    })

    return response.data
  } catch (error) {
    if (error.response) {
      console.error("Error response from backend:", error.response)
      throw error
    } else {
      throw new Error("Network error or server is down")
    }
  }
}

// Get all jobs for an organization (alias for apiGetOrgVacancies)
export const apiGetJobsByOrgId = async (orgId) => {
  return apiGetOrgVacancies(orgId);
};

// Get all available vacancies (for search functionality)
export const apiGetAllVacancies = async () => {
  try {
    console.log("Fetching all vacancies...");
    
    const response = await axios.get("http://localhost:5000/api/v1/vacancy", {
      headers: { "Content-Type": "application/json" },
      validateStatus: status => status < 500
    });
    
    console.log("Vacancies API response:", response);
    
    // Handle the response structure from the backend
    let vacancies = [];
    if (response.data?.data?.vacancies) {
      // Response from getFilteredVacancies
      vacancies = Array.isArray(response.data.data.vacancies) ? response.data.data.vacancies : [];
    } else if (Array.isArray(response.data?.data)) {
      // Direct array response
      vacancies = response.data.data;
    } else if (Array.isArray(response.data)) {
      // Direct array response (alternative)
      vacancies = response.data;
    }
    
    // Map the response to match the expected format in the frontend
    const formattedVacancies = vacancies.map(vacancy => ({
      ...vacancy,
      organization: vacancy.orgId ? {
        _id: vacancy.orgId._id,
        name: vacancy.orgId.name,
        location: vacancy.orgId.location,
        orgName: vacancy.orgId.name // For backward compatibility
      } : {
        _id: 'unknown',
        name: 'Unknown Organization',
        location: 'Unknown Location',
        orgName: 'Unknown Organization'
      }
    }));
    
    console.log("Formatted vacancies:", formattedVacancies);
    return { data: formattedVacancies };
    
  } catch (error) {
    console.error("Error fetching all vacancies:", {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });
    
    return { data: [] }; // Return empty array to prevent crashes
  }
};
