import axios from "axios"

// Create axios instance for organization API
const orgApi = axios.create({
  baseURL: "http://localhost:5000/org/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
})

// Add request interceptor to include auth token
orgApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("orgAccessToken")
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// Organization Signup
/* export const apiOrganizationSignup = async (orgData) => {
  try {
    const response = await orgApi.post("/auth/signup", orgData)

    console.log("Organization signup response structure:", response.data)

    if (response.data?.data?.accessToken) {
      localStorage.setItem("orgAccessToken", response.data.data.accessToken)
      localStorage.setItem("orgRefreshToken", response.data.data.refreshToken)

      if (response.data?.data?.organization) {
        localStorage.setItem("orgId", response.data.data.organization._id)
        localStorage.setItem("orgName", response.data.data.organization.orgName || "")
        localStorage.setItem("orgEmail", response.data.data.organization.email)
        localStorage.setItem("ownersName", response.data.data.organization.ownersName || "")
      }

      console.log("Organization tokens stored in localStorage")
      console.log("🔑 Org Access token preview:", response.data.data.accessToken.substring(0, 50) + "...")
      console.log("🏢 Organization ID stored:", response.data.data.organization._id)
    } else {
      console.error("No access token in organization signup response")
      console.error("Response data:", response.data)
    }

    return response.data
  } catch (error) {
    console.error("Organization signup error:", error)
    if (error.response) {
      console.error("Error response from backend:", error.response.data)
      throw error
    } else {
      throw new Error("Network error or server is down")
    }
  }
} */

  // Organization Signup
export const apiOrganizationSignup = async (orgData) => {
  try {
    console.log("Sending signup request with data:", { email: orgData.email })
    const response = await orgApi.post("/auth/signup", orgData)

    console.log("Organization signup response structure:", response.data)

    if (response.data?.data?.accessToken) {
      localStorage.setItem("orgAccessToken", response.data.data.accessToken)
      localStorage.setItem("orgRefreshToken", response.data.data.refreshToken)
      if (response.data?.data?.organization) {
        localStorage.setItem("orgId", response.data.data.organization._id)
        localStorage.setItem("orgName", response.data.data.organization.orgName || "")
        localStorage.setItem("orgEmail", response.data.data.organization.email)
        localStorage.setItem("ownersName", response.data.data.organization.ownersName || "")
      }
      console.log("Organization tokens stored in localStorage")
      console.log("🔑 Org Access token preview:", response.data.data.accessToken.substring(0, 50) + "...")
      console.log("🏢 Organization ID stored:", response.data.data.organization._id)
    } else {
      console.error("No access token in organization signup response")
      console.error("Response data:", response.data)
    }

    return response.data
  } catch (error) {
    console.error("Organization signup error:", error)

    if (error.response) {
      console.error("Error response from backend:", error.response.data)
      console.error("Error status:", error.response.status)

      // Extract the error message from the response
      const errorMessage =
        error.response.data?.message || error.response.data?.error || "Something went wrong during signup"

      // Create a new error with the proper message
      const signupError = new Error(errorMessage)
      signupError.response = error.response
      signupError.status = error.response.status

      throw signupError
    } else if (error.request) {
      console.error("No response received:", error.request)
      throw new Error("No response from server. Please check your connection and try again.")
    } else {
      console.error("Request setup error:", error.message)
      throw new Error("Network error or server is down")
    }
  }
}

// Organization Login
export const apiOrganizationLogin = async ({ email, password }) => {
  try {
    console.log("Sending login request for:", email)

    const response = await orgApi.post("/auth/login", { email, password })
    console.log("Login response received:", response)

    // Check if the response has data
    if (!response.data) {
      throw new Error("No data received from server")
    }
    // Return the full response data
    return response.data
  } catch (error) {
    console.error("Login error:", error)

    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error("Error response data:", error.response.data)
      console.error("Error status:", error.response.status)

      // Extract error message from response if available
      const errorMessage =
        error.response.data?.message ||
        error.response.data?.error?.message ||
        error.response.data?.error ||
        `Login failed with status ${error.response.status}`

      // Create a new error with the extracted message
      const loginError = new Error(errorMessage)
      loginError.status = error.response.status
      throw loginError
    } else if (error.request) {
      // The request was made but no response was received
      console.error("No response received:", error.request)
      throw new Error("No response from server. Please check your connection and try again.")
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error("Request setup error:", error.message)
      throw new Error(error.message || "Error setting up login request. Please try again.")
    }
  }
}

// Set organization profile
export const apiOrganizationSetup = async (setupData) => {
  const token = localStorage.getItem("orgAccessToken")
  console.log("IS TOKEN HERE??" + token)
  if (!token) {
    throw new Error("No access token found. Please log in first.")
  }
  try {
    const response = await orgApi.put("/setup", setupData)
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

// ✅ FIXED: Update Organization Location
export const apiUpdateOrganizationLocation = async (orgId, locationData) => {
  try {
    console.log("Updating organization location for orgId:", orgId, "with location:", locationData)
    const response = await orgApi.patch(`/updateLocation/${orgId}`, {
      location: locationData,
    })
    console.log("Organization location update response:", response.data)
    return response.data
  } catch (error) {
    console.error("Error updating organization location:", error)
    if (error.response) {
      console.error("Error response from backend:", error.response.data)
      console.error("Status:", error.response.status)
      throw error
    } else {
      throw new Error("Network error or server is down")
    }
  }
}

// ✅ FIXED: Get organization profile
export const apiOrganizationGetProfile = async (orgId) => {
  try {
    console.log("Fetching organization profile for orgId:", orgId)
    const token = localStorage.getItem("orgAccessToken")
    console.log("Using token:", token ? "Token exists" : "No token found")
    
    const response = await orgApi.get(`/profile/${orgId}`)
    console.log("Organization profile response:", response.data)
    return response.data
  } catch (error) {
    console.error("Error fetching organization profile:", error)
    if (error.response) {
      // Global logout on 401/403/404
      if (error.response.status === 401 || error.response.status === 403 || error.response.status === 404) {
        console.log("Invalid organization session, logging out...")
        localStorage.removeItem("orgAccessToken")
        localStorage.removeItem("orgRefreshToken")
        localStorage.removeItem("orgId")
        localStorage.removeItem("orgName")
        localStorage.removeItem("orgEmail")
        localStorage.removeItem("ownersName")
        window.location.href = "/org/login"
      }
      console.error("Error response from backend:", error.response.data)
      console.error("Status:", error.response.status)
      throw error
    } else {
      throw new Error("Network error or server is down")
    }
  }
}

// Get organization details by ID
export const apiGetOrganizationDetails = async (orgId) => {
  if (!orgId) {
    throw new Error("Organization ID is required.")
  }
  try {
    console.log(`Fetching organization details for ID: ${orgId}`)
    const response = await orgApi.get(`/getOrganizationDetails/${orgId}`)

    console.log("Organization details response:", response.data)

    // Check if the response has the expected structure
    // Always unwrap .data if present
    if (response.data && typeof response.data === "object") {
      if ("data" in response.data) {
        return response.data.data || {}
      }
      // If it looks like the org object itself
      if ("companyLogo" in response.data || "companyCover" in response.data) {
        return response.data
      }
      // Unexpected format, log for debugging
      console.warn("Unexpected organization details response format:", response.data)
      return response.data
    }

    // Return empty object if no data
    return {
      companyLogo: { url: "", publicId: "" },
      companyCover: { url: "", publicId: "" },
      socialProfile: { insta: "", fb: "", x: "" },
    }
  } catch (error) {
    console.error("Error fetching organization details:", error)
    if (error.response) {
      console.error("Error response from backend:", error.response.data)
      throw new Error(error.response.data?.message || "Failed to fetch organization details")
    } else {
      throw new Error("Network error or server is down")
    }
  }
}

// Get organization profile for editing
export const apiGetOrganizationProfileForEdit = async (orgId) => {
  if (!orgId) {
    throw new Error("Organization ID is required.")
  }
  try {
    const response = await orgApi.get(`/getOrganizationDetailsForEdit/${orgId}`)
    // Unwrap ApiResponse format if needed
    return response.data?.data ?? response.data
  } catch (error) {
    if (error.response) {
      console.error("Error response from backend:", error.response)
      throw error
    } else {
      throw new Error("Network error or server is down")
    }
  }
}

// Edit organization information
export const apiEditOrganizationInfo = async (orgId, updateData) => {
  if (!orgId) {
    throw new Error("Organization ID is required.")
  }
  const processedData = { ...updateData }
  if (typeof processedData.benefits === "string") {
    const benefitsArray = processedData.benefits
      .split("\n")
      .map((line) => line.replace(/^\d+\.\s*/, "").trim())
      .filter((line) => line.length > 0)
    processedData.benefits = benefitsArray
  }
  try {
    const response = await orgApi.put(`/editOrganizationInfo/${orgId}`, processedData)
    // Unwrap ApiResponse format if needed
    return response.data?.data ?? response.data
  } catch (error) {
    if (error.response) {
      console.error("Error response from backend:", error.response)
      throw error
    } else {
      throw new Error("Network error or server is down")
    }
  }
}

// Upload organization image (companyLogo, companyCover)
export const apiUploadOrgImage = async (orgId, file, type) => {
  try {
    const token = localStorage.getItem("orgAccessToken")
    if (!token) {
      throw new Error("No access token found. Please log in first.")
    }
    const formData = new FormData()
    formData.append("image", file)

    console.log(`Uploading ${type} for org ${orgId}`)

    const response = await axios.post(`http://localhost:5000/org/api/v1/upload-image/${orgId}?type=${type}`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    })

    console.log(`${type} upload response:`, response.data)

    if (response.data && response.data.success) {
      return {
        success: true,
        url: response.data.data?.url || "",
        publicId: response.data.data?.publicId || "",
      }
    }

    throw new Error(response.data?.message || "Failed to upload image")
  } catch (error) {
    console.error(`Error uploading ${type}:`, error)

    if (error.response) {
      // Global logout on 401/404
      if (error.response.status === 401 || error.response.status === 404) {
        localStorage.removeItem("orgAccessToken")
        localStorage.removeItem("orgId")
        localStorage.removeItem("orgName")
        localStorage.removeItem("orgEmail")
        localStorage.removeItem("ownersName")
        localStorage.removeItem("orgLocation")
    localStorage.removeItem("locationOrgId")
        window.location.href = "/organization/login"
      }
      // Server responded with error status
      console.error("Server error response:", error.response.data)
      throw new Error(error.response.data?.message || `Failed to upload ${type}`)
    } else if (error.request) {
      // Request was made but no response received
      console.error("No response received:", error.request)
      throw new Error("No response from server. Please check your connection.")
    } else {
      // Something else happened
      throw error
    }
  }
}

// Delete organization image
export const apiDeleteOrgImage = async (orgId, type) => {
  const response = await orgApi.delete(`/delete-image/${orgId}?type=${type}`)
  return response.data
}
