"use client"

import { useState, useEffect } from "react"

export default function useUserAuth() {
  const [userId, setUserId] = useState(null)
  const [token, setToken] = useState(null)
  const [refreshToken, setRefreshToken] = useState(null)
  const [userName, setUserName] = useState(null)
  const [userEmail, setUserEmail] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  // Initialize auth state from localStorage
  useEffect(() => {
    const storedUserId = localStorage.getItem("userId")
    const storedToken = localStorage.getItem("userAccessToken")
    const storedRefreshToken = localStorage.getItem("userRefreshToken")
    const storedUserName = localStorage.getItem("userName")
    const storedUserEmail = localStorage.getItem("userEmail")

    setUserId(storedUserId)
    setToken(storedToken)
    setRefreshToken(storedRefreshToken)
    setUserName(storedUserName)
    setUserEmail(storedUserEmail)
    setIsAuthenticated(!!(storedUserId && storedToken))
  }, [])

  // Set authentication data
  const setAuth = (authData) => {
    const { user, accessToken, refreshToken: newRefreshToken } = authData

    // Store in localStorage
    localStorage.setItem("userId", user._id)
    localStorage.setItem("userAccessToken", accessToken)
    localStorage.setItem("userRefreshToken", newRefreshToken)
    localStorage.setItem("userName", user.name)
    localStorage.setItem("userEmail", user.email)

    // Update state
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
  }

  // Clear authentication data
  const clearAuth = () => {
    // Remove from localStorage
    localStorage.removeItem("userId")
    localStorage.removeItem("userAccessToken")
    localStorage.removeItem("userRefreshToken")
    localStorage.removeItem("userName")
    localStorage.removeItem("userEmail")

    // Clear state
    setUserId(null)
    setToken(null)
    setRefreshToken(null)
    setUserName(null)
    setUserEmail(null)
    setIsAuthenticated(false)

    console.log("Auth data cleared")
  }

  // Update token (for refresh token functionality)
  const updateToken = (newAccessToken, newRefreshToken = null) => {
    localStorage.setItem("userAccessToken", newAccessToken)
    setToken(newAccessToken)

    if (newRefreshToken) {
      localStorage.setItem("userRefreshToken", newRefreshToken)
      setRefreshToken(newRefreshToken)
    }
  }

  // Check if token is expired (basic check)
  const isTokenExpired = () => {
    if (!token) return true

    try {
      const payload = JSON.parse(atob(token.split(".")[1]))
      const currentTime = Date.now() / 1000
      return payload.exp < currentTime
    } catch (error) {
      return true
    }
  }

  // Get user data
  const getUserData = () => {
    return {
      userId,
      userName,
      userEmail,
      token,
      refreshToken,
      isAuthenticated,
    }
  }

  return {
    userId,
    token,
    refreshToken,
    userName,
    userEmail,
    isAuthenticated,
    setAuth,
    clearAuth,
    updateToken,
    isTokenExpired,
    getUserData,
  }
}
