import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000",
});

// Add a request interceptor to include the token in headers
api.interceptors.request.use(
  (config) => {
    // Try organization token first, then user token
    const orgToken = localStorage.getItem("orgAccessToken");
    const userToken = localStorage.getItem("authToken");
    const token = orgToken || userToken;
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Get recent applications for an organization
export const apiGetApplicationsByOrg = async (orgId) => {
  try {
    const response = await api.get(`/applications/api/v1/applications/recent/${orgId}`);
    return response.data;
  } catch (error) {
    console.error("API Error Details:", error.response?.data || error.message);
    throw error.response?.data || new Error("Failed to fetch applications");
  }
};

// Update application status
export const apiUpdateApplicationStatus = async (applicationId, status) => {
  try {
    console.log("Making API call to update status:", { applicationId, status });
    
    // Check if we have authentication token
    const orgToken = localStorage.getItem("orgAccessToken");
    const userToken = localStorage.getItem("authToken");
    const token = orgToken || userToken;
    console.log("Auth token present:", !!token);
    console.log("Using org token:", !!orgToken);
    console.log("Using user token:", !!userToken);
    
    const response = await api.put(`/applications/api/v1/status/${applicationId}`, { status });
    console.log("API response:", response.data);
    return response.data;
  } catch (error) {
    console.error("API Error updating status:", error.response?.data || error.message);
    console.error("Full error:", error);
    console.error("Error status:", error.response?.status);
    console.error("Error headers:", error.response?.headers);
    
    // Throw a more descriptive error
    if (error.response?.status === 401) {
      throw new Error("Authentication failed. Please log in again.");
    } else if (error.response?.status === 404) {
      throw new Error("Application not found.");
    } else if (error.response?.status === 400) {
      throw new Error(error.response.data?.message || "Invalid request.");
    } else {
      throw error.response?.data || new Error("Failed to update status");
    }
  }
};

// Submit a new job application
export const apiSubmitApplication = async (applicationData) => {
    try {
        const response = await api.post("/applications/api/v1/submit", applicationData);
        return response.data;
    } catch (error) {
        console.error("Error submitting application:", error.response?.data || error.message);
        throw error.response?.data || new Error("Failed to submit application");
    }
};

// Get all applications for a specific user
export const apiGetUserApplications = async (userId) => {
    try {
        const response = await api.get(`/applications/api/v1/user/${userId}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching user applications:", error.response?.data || error.message);
        throw error.response?.data || new Error("Failed to fetch user applications");
    }
};

export const apiGetDashboardStats = async (orgId) => {
  try {
    const response = await api.get(`/applications/api/v1/dashboard-stats/${orgId}`);
    return response.data;
  } catch (error) {
    console.error("API Error fetching dashboard stats:", error.response?.data || error.message);
    throw error.response?.data || new Error("Failed to fetch dashboard stats");
  }
};
