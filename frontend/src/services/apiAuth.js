import axios from "axios"

export const apiSignup = async (userData) => {
  try {
    const response = await axios.post("http://localhost:5000/users/api/v1/auth/signup", userData)
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

export const apiGetUserProfile = async (userId) => {
  try {
    const response = await axios.get(`http://localhost:5000/users/api/v1/userprofile/${userId}`);
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

export const apiLogin = async ({ email, password }) => {
  try {
    const response = await axios.post(
      "http://localhost:5000/users/api/v1/auth/login",
      {
        email,
        password,
      },
      {
        withCredentials: true, 
      },
    )
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

export const apiGetUserDataForApplication = async (userId) => {
  try {
    const response = await axios.get(
      `http://localhost:5000/users/api/v1/profile-data/${userId}`,
        {
        headers: {
          // Authorization: `Bearer ${token}`
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching user data for application:", error);
    throw error;
  }
};



export const apiUpdateUserProfile = async (userId, userData) => {
  try {
    const response = await axios.put(
      `http://localhost:5000/users/api/v1/userprofile/${userId}`,
      userData,
      {
        headers: {
          "Content-Type": "application/json",
          // Authorization: `Bearer ${token}`
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error updating user profile:", error);
    throw error;
  }
};

export const apiUpdateUserProfileForApplication = async (userId, userData) => {
  try {
    const response = await axios.put(
      `http://localhost:5000/users/api/v1/profile-data/${userId}`,
      userData,
      {
        headers: {
          "Content-Type": "application/json",
          // Authorization: `Bearer ${token}`
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error updating user profile:", error);
    throw error;
  }
};

export const apiSubmitJobApplication = async (applicationData) => {
  try {
    const response = await axios.post(
      `http://localhost:5000/applications/api/v1/submit`,
      applicationData,
      {
        headers: {
          "Content-Type": "application/json",
          // Authorization: `Bearer ${token}`
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error submitting job application:", error);
    throw error;
  }
};

/* export const apiLogin = async (loginData) => {
  try {
    const response = await axios.post("http://localhost:5000/users/api/v1/auth/login", loginData)
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



