import axios from "axios"

// Follow an organization
export const apiFollowOrganization = async (orgId) => {
  try {
    const response = await axios.post(
      `http://localhost:5000/users/api/v1/follow/${orgId}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("userAccessToken")}`,
        },
      },
    )
    return response.data
  } catch (error) {
    console.error("Error following organization:", error)
    throw error
  }
}

// Unfollow an organization
export const apiUnfollowOrganization = async (orgId) => {
  try {
    const response = await axios.delete(`http://localhost:5000/users/api/v1/follow/${orgId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("userAccessToken")}`,
      },
    })
    return response.data
  } catch (error) {
    console.error("Error unfollowing organization:", error)
    throw error
  }
}

// Check follow status
export const apiCheckFollowStatus = async (orgId) => {
  try {
    const response = await axios.get(`http://localhost:5000/users/api/v1/follow/status/${orgId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("userAccessToken")}`,
      },
    })
    return response.data
  } catch (error) {
    console.error("Error checking follow status:", error)
    throw error
  }
}

// Get all followed organizations
export const apiGetFollowedOrganizations = async () => {
  try {
    const response = await axios.get("http://localhost:5000/users/api/v1/follow/following", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("userAccessToken")}`,
      },
    })
    return response.data
  } catch (error) {
    console.error("Error getting followed organizations:", error)
    throw error
  }
}

//Get organization follower count (public endpoint)
export const apiGetOrganizationFollowerCount = async (orgId) => {
  try {
    const response = await axios.get(`http://localhost:5000/api/v1/organization/${orgId}/followers`)
    return response.data
  } catch (error) {
    console.error("Error getting follower count:", error)
    throw error
  }
}
