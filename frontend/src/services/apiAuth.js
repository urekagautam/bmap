import axios from 'axios'

export const apiSignup = async (userData) => {
  try {
    const response = await axios.post("http://localhost:5000/users/api/v1/auth/signup", userData);
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


// Login
/* export async function apiLogin(data) {
    const response = await axios.post("/api/v1/auth/login", data);
    return response.data;
  }
  
  // Signup
  export async function apiSignup(data) {
    const response = await axios.post("http://localhost:5000/users/api/v1/auth/signup", data);
    return response.data;
  } */