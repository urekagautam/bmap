import axios from "axios"

// Post a new job vacancy
export const apiPostVacancy = async (vacancyData) => {
  // const token = localStorage.getItem("orgAccessToken")

  /* if (!token) {
    throw new Error("No access token found. Please log in first.")
  } */

  try {
    console.log("Sending vacancy data:", vacancyData)
    const response = await axios.post("http://localhost:5000/api/v1/vacancy", vacancyData, {
      headers: {
        /* Authorization: `Bearer ${token}`, */
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
  // const token = localStorage.getItem("orgAccessToken")

  /* if (!token) {
    throw new Error("No access token found. Please log in first.")
  } */

  try {
    const response = await axios.get(`http://localhost:5000/api/v1/vacancy/org?id=${orgId}`, {
      headers: {
        /* Authorization: `Bearer ${token}`, */
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

// Get a specific vacancy by ID
export const apiGetVacancyById = async (vacancyId) => {
  // const token = localStorage.getItem("orgAccessToken")

  /* if (!token) {
    throw new Error("No access token found. Please log in first.")
  } */

  try {
    const response = await axios.get(`http://localhost:5000/api/v1/vacancy/${vacancyId}`, {
      headers: {
        /* Authorization: `Bearer ${token}`, */
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

// Get vacancy details by ID
export const apiGetVacancyDetails = async (vacancyId) => {
  // const token = localStorage.getItem("orgAccessToken")

  /* if (!token) {
    throw new Error("No access token found. Please log in first.")
  } */

  try {
    const response = await axios.get(`http://localhost:5000/api/v1/getvacancy/${vacancyId}`, {
      headers: {
        /* Authorization: `Bearer ${token}`, */
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
