"use client"

import { useState, useEffect } from "react"

export default function useOrgAuth() {
  const [orgId, setOrgId] = useState(null)
  const [token, setToken] = useState(null)
  const [refreshToken, setRefreshToken] = useState(null)
  const [orgName, setOrgName] = useState(null)
  const [orgEmail, setOrgEmail] = useState(null)
  const [ownersName, setOwnersName] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  // Initialize auth state from localStorage
  useEffect(() => {
    const storedOrgId = localStorage.getItem("orgId")
    const storedToken = localStorage.getItem("orgAccessToken")
    const storedRefreshToken = localStorage.getItem("orgRefreshToken")
    const storedOrgName = localStorage.getItem("orgName")
    const storedOrgEmail = localStorage.getItem("orgEmail")
    const storedOwnersName = localStorage.getItem("ownersName")

    setOrgId(storedOrgId)
    setToken(storedToken)
    setRefreshToken(storedRefreshToken)
    setOrgName(storedOrgName)
    setOrgEmail(storedOrgEmail)
    setOwnersName(storedOwnersName)
    setIsAuthenticated(!!(storedOrgId && storedToken))
  }, [])

  // Set authentication data
  const setAuth = (authData) => {
    const { organization, accessToken, refreshToken: newRefreshToken } = authData

    // Store in localStorage
    localStorage.setItem("orgId", organization._id)
    localStorage.setItem("orgAccessToken", accessToken)
    localStorage.setItem("orgRefreshToken", newRefreshToken)
    localStorage.setItem("orgName", organization.orgName || "")
    localStorage.setItem("orgEmail", organization.email)
    localStorage.setItem("ownersName", organization.ownersName || "")

    // Update state
    setOrgId(organization._id)
    setToken(accessToken)
    setRefreshToken(newRefreshToken)
    setOrgName(organization.orgName || "")
    setOrgEmail(organization.email)
    setOwnersName(organization.ownersName || "")
    setIsAuthenticated(true)

    console.log("Organization auth data set successfully:", {
      orgId: organization._id,
      orgName: organization.orgName,
      token: accessToken?.slice(0, 10) + "...",
    })
  }

  // Clear authentication data
  const clearAuth = () => {
    // Remove from localStorage
    localStorage.removeItem("orgId")
    localStorage.removeItem("orgAccessToken")
    localStorage.removeItem("orgRefreshToken")
    localStorage.removeItem("orgName")
    localStorage.removeItem("orgEmail")
    localStorage.removeItem("ownersName")

    // Clear state
    setOrgId(null)
    setToken(null)
    setRefreshToken(null)
    setOrgName(null)
    setOrgEmail(null)
    setOwnersName(null)
    setIsAuthenticated(false)

    console.log("Organization auth data cleared")
  }

  return {
    orgId,
    token,
    refreshToken,
    orgName,
    orgEmail,
    ownersName,
    isAuthenticated,
    setAuth,
    clearAuth,
  }
}
