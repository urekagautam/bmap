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

        // Ensure we have valid data before updating state
        if (orgResponse && typeof orgResponse === 'object') {
          // Ensure companyLogo and companyCover have the correct structure
          const formattedData = {
            ...orgResponse,
            companyLogo: orgResponse.companyLogo || { url: '', publicId: '' },
            companyCover: orgResponse.companyCover || { url: '', publicId: '' },
            socialProfile: orgResponse.socialProfile || { insta: '', fb: '', x: '' }
          }
          setOrgData(formattedData)
        } else {
          console.error('Invalid organization data format:', orgResponse)
          throw new Error('Received invalid organization data format from server')
        }
      } catch (orgError) {
        console.error("Error fetching organization details:", orgError)
        setError(orgError.message || "Failed to fetch organization details")
        toast.error(orgError.message || "Could not load organization details")
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
    refetch: async () => {
      if (!orgId) {
        setOrgData(null)
        setError(null)
        return null
      }

      try {
        setIsLoading(true)
        setError(null)

        console.log("Refetching organization details for ID:", orgId)
        const orgResponse = await apiGetOrganizationDetails(orgId)
        console.log("Refetched Organization API Response:", orgResponse)

        // Ensure we have valid data before updating state
        if (orgResponse && typeof orgResponse === 'object') {
          // Ensure companyLogo and companyCover have the correct structure
          const formattedData = {
            ...orgResponse,
            companyLogo: orgResponse.companyLogo || { url: '', publicId: '' },
            companyCover: orgResponse.companyCover || { url: '', publicId: '' },
            socialProfile: orgResponse.socialProfile || { insta: '', fb: '', x: '' }
          }
          setOrgData(formattedData)
          return formattedData
        } else {
          console.error('Invalid organization data format during refetch:', orgResponse)
          throw new Error('Received invalid organization data format from server')
        }
      } catch (orgError) {
        console.error("Error refetching organization details:", orgError)
        const errorMsg = orgError.message || "Failed to refetch organization details"
        setError(errorMsg)
        toast.error(errorMsg)
        throw orgError
      } finally {
        setIsLoading(false)
      }
    },
  }
}

export default useOrgData
