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
