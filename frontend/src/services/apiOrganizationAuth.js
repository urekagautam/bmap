import axios from "axios";

// Organization Signup
export const apiOrganizationSignup = async (orgData) => {
  try {
    const response = await axios.post(
      "http://localhost:5000/org/api/v1/auth/signup",
      orgData
    );
    return response.data;
  } catch (error) {
    if (error.response) {
      console.error("Error response from backend:", error.response);
      throw error;
    } else {
      throw new Error("Network error or server is down");
    }
  }
};

// Set organization profile
export const apiOrganizationSetup = async (setupData) => {
  const token = localStorage.getItem("orgAccessToken");
  console.log("IS TOKEN HERE??" + token);

  if (!token) {
    throw new Error("No access token found. Please log in first.");
  }

  try {
    const response = await axios.put(
      "http://localhost:5000/org/api/v1/setup",
      setupData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  } catch (error) {
    if (error.response) {
      console.error("Error response from backend:", error.response);
      throw error;
    } else {
      throw new Error("Network error or server is down");
    }
  }
};

// Get organization profile
export const apiOrganizationGetProfile = async (orgId) => {
  try {
    const response = await axios.get(
      `http://localhost:5000/org/api/v1/profile/id?id=${orgId}`,
      {
        headers: {
           Authorization: `Bearer ${localStorage.getItem('orgAccessToken')}`, 
          'Content-Type': 'application/json'
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error('API Error:', error.response?.data || error.message);
    throw error; 
  }
};

// Get organization details by ID
export const apiGetOrganizationDetails = async (orgId) => {
  const token = localStorage.getItem("orgAccessToken");
  
  if (!token) {
    throw new Error("No access token found. Please log in first.");
  }

  if (!orgId) {
    throw new Error("Organization ID is required.");
  }

  try {
    const response = await axios.get(
      `http://localhost:5000/org/api/v1/getOrganizationDetails/${orgId}`,
      {
        headers: {
          /* Authorization: `Bearer ${token}`, */
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    if (error.response) {
      console.error("Error response from backend:", error.response);
      throw error;
    } else {
      throw new Error("Network error or server is down");
    }
  }
};