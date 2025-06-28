import { useState, useEffect } from "react"

export default function useUserAuth() {
  const [userId, setUserId] = useState(null)
  const [token, setToken] = useState(null)
  const [refreshToken, setRefreshToken] = useState(null)
  const [userName, setUserName] = useState(null)
  const [userEmail, setUserEmail] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    try {
      const storedUserId = localStorage.getItem("userId")
      const storedToken = localStorage.getItem("userAccessToken")
      const storedRefreshToken = localStorage.getItem("userRefreshToken")
      const storedUserName = localStorage.getItem("userName")
      const storedUserEmail = localStorage.getItem("userEmail")

      console.log("Loading auth from localStorage:", {
        hasUserId: !!storedUserId,
        hasToken: !!storedToken,
        userId: storedUserId,
      })

      setUserId(storedUserId)
      setToken(storedToken)
      setRefreshToken(storedRefreshToken)
      setUserName(storedUserName)
      setUserEmail(storedUserEmail)
      setIsAuthenticated(!!(storedUserId && storedToken))
    } catch (error) {
      console.error("Error loading auth from localStorage:", error)
    
      setUserId(null)
      setToken(null)
      setRefreshToken(null)
      setUserName(null)
      setUserEmail(null)
      setIsAuthenticated(false)
    } finally {
      setIsLoading(false) 
    }
  }, [])

  const setAuth = (authData) => {
    try {
      const { user, accessToken, refreshToken: newRefreshToken } = authData

      localStorage.setItem("userId", user._id)
      localStorage.setItem("userAccessToken", accessToken)
      localStorage.setItem("userRefreshToken", newRefreshToken)
      localStorage.setItem("userName", user.name)
      localStorage.setItem("userEmail", user.email)

      setUserId(user._id)
      setToken(accessToken)
      setRefreshToken(newRefreshToken)
      setUserName(user.name)
      setUserEmail(user.email)
      setIsAuthenticated(true)

      console.log("Auth data set successfully:", {
        userId: user._id,
        userName: user.name,
        token: accessToken?.slice(0, 10) + "...",
      })
    } catch (error) {
      console.error("Error setting auth data:", error)
    }
  }

  const clearAuth = () => {
    try {

      localStorage.removeItem("userId")
      localStorage.removeItem("userAccessToken")
      localStorage.removeItem("userRefreshToken")
      localStorage.removeItem("userName")
      localStorage.removeItem("userEmail")

      setUserId(null)
      setToken(null)
      setRefreshToken(null)
      setUserName(null)
      setUserEmail(null)
      setIsAuthenticated(false)

      console.log("Auth data cleared")
    } catch (error) {
      console.error("Error clearing auth data:", error)
    }
  }

  const updateToken = (newAccessToken, newRefreshToken = null) => {
    try {
      localStorage.setItem("userAccessToken", newAccessToken)
      setToken(newAccessToken)

      if (newRefreshToken) {
        localStorage.setItem("userRefreshToken", newRefreshToken)
        setRefreshToken(newRefreshToken)
      }

      console.log("Token updated successfully")
    } catch (error) {
      console.error("Error updating token:", error)
    }
  }

  const isTokenExpired = () => {
    if (!token) return true

    try {
      const payload = JSON.parse(atob(token.split(".")[1]))
      const currentTime = Date.now() / 1000
      return payload.exp < currentTime
    } catch (error) {
      console.error("Error checking token expiration:", error)
      return true
    }
  }

  const getUserData = () => {
    return {
      userId,
      userName,
      userEmail,
      token,
      refreshToken,
      isAuthenticated,
      isLoading,
    }
  }

  return {
    userId,
    token,
    refreshToken,
    userName,
    userEmail,
    isAuthenticated,
    isLoading, 
    setAuth,
    clearAuth,
    updateToken,
    isTokenExpired,
    getUserData,
  }
}
