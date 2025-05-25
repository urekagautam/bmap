import axios from "axios"

export const apiOrganizationSignup = async (orgData) => {
  try {
    const response = await axios.post("http://localhost:5000/org/api/v1/auth/signup", orgData)
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

/* export const apiLogin = async ({ email, password }) => {
  const response = await axios.post("http://localhost:5000/api/auth/login", {
    email,
    password,
  });
  return response.data;
}; */

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



