import { useState, useEffect } from "react"
import { apiGetOrganizationDetails } from "../services/apiOrganizationAuth.js"
import toast from "react-hot-toast"

export function useOrgData(orgId) {
  const [orgData, setOrgData] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function fetchOrganizationData() {
      if (!orgId) {
        setOrgData(null)
        setError(null)
        return
      }

      try {
        setIsLoading(true)
        setError(null)

        console.log("Fetching organization details for ID:", orgId)
        const orgResponse = await apiGetOrganizationDetails(orgId)
        console.log("Organization API Response:", orgResponse)

        setOrgData(orgResponse)
      } catch (orgError) {
        console.error("Error fetching organization details:", orgError)
        setError(orgError.message || "Failed to fetch organization details")
        toast.error("Could not load organization details")
      } finally {
        setIsLoading(false)
      }
    }

    fetchOrganizationData()
  }, [orgId])

  return {
    orgData,
    isLoading,
    error,
    refetch: () => {
      async function fetchOrganizationData() {
        if (!orgId) {
          setOrgData(null)
          setError(null)
          return
        }

        try {
          setIsLoading(true)
          setError(null)

          console.log("Fetching organization details for ID:", orgId)
          const orgResponse = await apiGetOrganizationDetails(orgId)
          console.log("Organization API Response:", orgResponse)

          setOrgData(orgResponse)
        } catch (orgError) {
          console.error("Error fetching organization details:", orgError)
          setError(orgError.message || "Failed to fetch organization details")
          toast.error("Could not load organization details")
        } finally {
          setIsLoading(false)
        }
      }
      if (orgId) {
        fetchOrganizationData()
      }
    },
  }
}

export default useOrgData
