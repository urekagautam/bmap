import { useState, useEffect } from "react"

export default function useOrgAuth() {
  const [orgId, setOrgId] = useState(null)
  const [token, setToken] = useState(null)
  const [refreshToken, setRefreshToken] = useState(null)
  const [orgName, setOrgName] = useState(null)
  const [orgEmail, setOrgEmail] = useState(null)
  const [ownersName, setOwnersName] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  // Function to load data from localStorage
  const loadFromStorage = () => {
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

    console.log("useOrgAuth loaded:", {
      orgId: storedOrgId,
      isAuthenticated: !!(storedOrgId && storedToken)
    })
  }

  useEffect(() => {
    loadFromStorage()

    // Listening for storage changes (when localStorage is updated)
    const handleStorageChange = (e) => {
      if (e.key?.startsWith('org')) {
        loadFromStorage()
      }
    }

    window.addEventListener('storage', handleStorageChange)
    
    //Listening for custom events (for same-tab updates)
    const handleCustomStorageChange = () => {
      loadFromStorage()
    }
    
    window.addEventListener('orgAuthUpdated', handleCustomStorageChange)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('orgAuthUpdated', handleCustomStorageChange)
    }
  }, [])

  const setAuth = (authData) => {
    const { organization, accessToken, refreshToken: newRefreshToken } = authData

    localStorage.setItem("orgId", organization._id)
    localStorage.setItem("orgAccessToken", accessToken)
    localStorage.setItem("orgRefreshToken", newRefreshToken)
    localStorage.setItem("orgName", organization.orgName || "")
    localStorage.setItem("orgEmail", organization.email)
    localStorage.setItem("ownersName", organization.ownersName || "")

    // Triggerring custom event to notify other components
    window.dispatchEvent(new CustomEvent('orgAuthUpdated'))

    console.log("Organization auth data set successfully:", {
      orgId: organization._id,
      orgName: organization.orgName,
      token: accessToken?.slice(0, 10) + "...",
    })
  }

  const clearAuth = () => {
    localStorage.removeItem("orgId")
    localStorage.removeItem("orgAccessToken")
    localStorage.removeItem("orgRefreshToken")
    localStorage.removeItem("orgName")
    localStorage.removeItem("orgEmail")
    localStorage.removeItem("ownersName")

    setOrgId(null)
    setToken(null)
    setRefreshToken(null)
    setOrgName(null)
    setOrgEmail(null)
    setOwnersName(null)
    setIsAuthenticated(false)

    // Trigger custom event
    window.dispatchEvent(new CustomEvent('orgAuthUpdated'))

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