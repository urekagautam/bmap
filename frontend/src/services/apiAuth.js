import axios from "axios"

const api = axios.create({
  baseURL: "http://localhost:5000",
  withCredentials: true,
})

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("userAccessToken")
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

export const apiSignup = async (userData) => {
  try {
    const response = await api.post("/users/api/v1/auth/signup", userData)
    return response.data
  } catch (error) {
    console.error("Signup error:", error)
    if (error.response) {
      console.error("Error response from backend:", error.response)
      throw error
    } else {
      throw new Error("Network error or server is down")
    }
  }
}

export const apiGetUserProfile = async (userId) => {
  try {
    console.log("Fetching profile for userId:", userId)
    const token = localStorage.getItem("userAccessToken")
    console.log("Using token:", token ? "Token exists" : "No token found")

    const response = await api.get(`/users/api/v1/userprofile/${userId}`)
    console.log("Profile response:", response.data)
    return response.data
  } catch (error) {
    console.error("Error fetching user profile:", error)
    if (error.response) {
      // Global logout on 401/404
      if (error.response.status === 401 || error.response.status === 404) {
        localStorage.removeItem("userAccessToken");
        localStorage.removeItem("userId");
        localStorage.removeItem("userName");
        localStorage.removeItem("userEmail");
        window.location.href = "/login";
      }
      console.error("Error response from backend:", error.response.data)
      console.error("Status:", error.response.status)
      throw error
    } else {
      throw new Error("Network error or server is down")
    }
  }
}

// Login user and store token
export const apiLogin = async ({ email, password }) => {
  try {
    const response = await api.post("/users/api/v1/auth/login", {
      email,
      password,
    })

    console.log("Login response structure:", response.data)

    if (response.data?.data?.accessToken) {
      localStorage.setItem("userAccessToken", response.data.data.accessToken)
      localStorage.setItem("userRefreshToken", response.data.data.refreshToken)

      if (response.data?.data?.user) {
        localStorage.setItem("userId", response.data.data.user._id)
        localStorage.setItem("userName", response.data.data.user.name)
        localStorage.setItem("userEmail", response.data.data.user.email)
      }

      console.log("Tokens stored in localStorage")
      console.log("🔑 Access token preview:", response.data.data.accessToken.substring(0, 50) + "...")
    } else {
      console.error("No access token in response")
      console.error("Response data:", response.data)
    }

    return response.data
  } catch (error) {
    console.error("Login error:", error)
    if (error.response) {
      console.error("Error response from backend:", error.response.data)
      throw error
    } else {
      throw new Error("Network error or server is down")
    }
  }
}

// Getting current token
export const getCurrentToken = () => {
  return localStorage.getItem("userAccessToken")
}

// Checking if authenticated
export const isAuthenticated = () => {
  return !!localStorage.getItem("userAccessToken")
}

export const apiGetUserDataForApplication = async (userId) => {
  try {
    const response = await api.get(`/users/api/v1/profile-data/${userId}`)
    return response.data
  } catch (error) {
    console.error("Error fetching user data for application:", error)
    throw error
  }
}

export const apiUpdateUserProfile = async (userId, userData) => {
  try {
    const response = await api.put(`/users/api/v1/userprofile/${userId}`, userData, {
      headers: {
        "Content-Type": "application/json",
      },
    })
    return response.data
  } catch (error) {
    console.error("Error updating user profile:", error)
    throw error
  }
}

export const apiUpdateUserProfileForApplication = async (userId, userData) => {
  try {
    const response = await api.put(`/users/api/v1/profile-data/${userId}`, userData, {
      headers: {
        "Content-Type": "application/json",
      },
    })
    return response.data
  } catch (error) {
    console.error("Error updating user profile:", error)
    throw error
  }
}

export const apiSubmitJobApplication = async (applicationData) => {
  try {
    const response = await api.post(`/applications/api/v1/submit`, applicationData, {
      headers: {
        "Content-Type": "application/json",
      },
    })
    return response.data
  } catch (error) {
    console.error("Error submitting job application:", error)
    throw error
  }
}

// Upload profile image
export const apiUploadProfileImage = async (userId, imageFile) => {
  try {
    const formData = new FormData()
    formData.append("image", imageFile)

    const response = await api.post(`/users/api/v1/upload-profile-image/${userId}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    return response.data
  } catch (error) {
    console.error("Error uploading profile image:", error)
    throw error
  }
}

// Upload resume PDF
export const apiUploadResume = async (userId, resumeFile) => {
  try {
    const formData = new FormData();
    formData.append("resume", resumeFile);
    const response = await api.post(`/users/api/v1/upload-resume/${userId}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error uploading resume:", error);
    throw error;
  }
};

// Delete resume PDF
export const apiDeleteResume = async (userId) => {
  try {
    const response = await api.delete(`/users/api/v1/delete-resume/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting resume:", error);
    throw error;
  }
};

// Get all applications for a user
export const apiGetUserApplications = async (userId) => {
  try {
    const response = await api.get(`/applications/api/v1/user/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching user applications:", error);
    throw error;
  }
};

//update user location
export const apiUpdateUserLocation = async (userId, locationData) => {
  try {
    console.log("Updating user location for userId:", userId, "with location:", locationData)
    const response = await api.patch(`/users/api/v1/location/${userId}`, {
      location: locationData
    }, {
      headers: {
        "Content-Type": "application/json",
      },
    })
    console.log("Location update response:", response.data)
    return response.data
  } catch (error) {
    console.error("Error updating user location:", error)
    if (error.response) {
      console.error("Error response from backend:", error.response.data)
      console.error("Status:", error.response.status)
      throw error
    } else {
      throw new Error("Network error or server is down")
    }
  }
}

//haversine : get vacancies from nearby organizations
export const apiGetNearbyVacancies = async (userId, radius = 10) => {
  try {
    console.log("Fetching nearby vacancies for userId:", userId, "with radius:", radius)
    const response = await api.get(`/users/api/v1/nearby-vacancies/${userId}?radius=${radius}`)
    console.log("Nearby vacancies response:", response.data)
    return response.data
  } catch (error) {
    console.error("Error fetching nearby vacancies:", error)
    if (error.response) {
      console.error("Error response from backend:", error.response.data)
      console.error("Status:", error.response.status)
      throw error
    } else {
      throw new Error("Network error or server is down")
    }
  }
}

//haversine : nearby organizations
export const apiGetNearbyOrganizations = async (userId, radius = 10) => {
  try {
    console.log("Fetching nearby organizations for userId:", userId, "with radius:", radius);
    const response = await api.get(`/users/api/v1/nearby-organizations/${userId}?radius=${radius}`);
    console.log("Nearby organizations response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching nearby organizations:", error);
    if (error.response) {
      console.error("Error response from backend:", error.response.data);
      throw error;
    } else {
      throw new Error("Network error or server is down");
    }
  }
};

// Jaccard Similarity: get job recommendations
export const apiGetJobRecommendations = async (userId, limit = 20) => {
  try {
    console.log("Fetching job recommendations for userId:", userId, "with limit:", limit);
    const response = await api.get(`/users/api/v1/recommendations/${userId}?limit=${limit}`);
    console.log("Job recommendations response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching job recommendations:", error);
    if (error.response) {
      console.error("Error response from backend:", error.response.data);
      throw error;
    } else {
      throw new Error("Network error or server is down");
    }
  }
};


export const apiGetOrganizationJobListings = async (orgId) => {
  try {
    console.log("API: Fetching job listings for orgId:", orgId)

    const response = await fetch(`http://localhost:5000/api/v1/job-listings/${orgId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    console.log("API Response for job listings:", data)

    return data
  } catch (error) {
    console.error("Error in apiGetOrganizationJobListings:", error)
    throw error
  }
}
// Get applications by organization
export const apiGetOrganizationVacancies = async (orgId) => {
  try {
    console.log("Fetching vacancies for orgId:", orgId);
    const response = await api.get(`/applications/api/v1/applications/${orgId}`);
    console.log("Organization vacancies response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching organization vacancies:", error);
    if (error.response) {
      console.error("Error response from backend:", error.response.data);
      throw error;
    } else {
      throw new Error("Network error or server is down");
    }
  }
};

// Add this to your apiAuth.js or services file
export const apiGetVacancyApplications = async (vacancyId) => {
  try {
    console.log("🔗 Fetching applications for vacancy ID:", vacancyId);
    console.log("🌐 Full URL:", `${api.defaults.baseURL}/organizations/api/v1/vacancies/${vacancyId}/applications`);
    
    const response = await api.get(`applications/api/v1/vacancyApplications/${vacancyId}`);
    
    console.log("✅ API Response status:", response.status);
    console.log("📦 Applications response:", response.data);
    return response.data;
  } catch (error) {
    console.error("🚨 Error fetching vacancy applications:", error);
    console.error("📋 Error details:", {
      message: error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      url: error.config?.url
    });
    
    if (error.response) {
      console.error("❌ Error response from backend:", error.response.data);
      throw error;
    } else {
      throw new Error("Network error or server is down");
    }
  }
};

// Frontend API function to fetch application details
export const apiGetApplicationDetails = async (applicationId) => {
  try {
    const response = await fetch(`http://localhost:5000/applications/api/v1/applicationDetails/${applicationId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", 
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error("Error fetching application details:", error)
    throw error
  }
}

// Check if user has applied for a specific job
export const apiCheckApplicationStatus = async (userId, jobId) => {
  try {
    console.log("🔍 Checking application status for userId:", userId, "jobId:", jobId);
    const response = await api.get(`/applications/api/v1/check-status/${userId}/${jobId}`);
    console.log("📊 Application status response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error checking application status:", error);
    if (error.response) {
      console.error("Error response from backend:", error.response.data);
      throw error;
    } else {
      throw new Error("Network error or server is down");
    }
  }
};

// Update application status (for organizations)
export const apiUpdateApplicationStatus = async (applicationId, status) => {
  try {
    console.log("🔄 Updating application status:", { applicationId, status });
    const response = await api.put(`/applications/api/v1/status/${applicationId}`, {
      status: status
    }, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    console.log("✅ Application status updated:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error updating application status:", error);
    if (error.response) {
      console.error("Error response from backend:", error.response.data);
      throw error;
    } else {
      throw new Error("Network error or server is down");
    }
  }
};