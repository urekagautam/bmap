
export const formatDepartment = (dept) => {
  if (!dept) return ""

  return dept
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")
}

export const formatCompanySize = (orgData) => {
  if (!orgData) return "Not specified"

  if (orgData.companySize === "fixed" && orgData.minEmployees) {
    return `${orgData.minEmployees} employees`
  } else if (orgData.companySize === "range" && orgData.minEmployees && orgData.maxEmployees) {
    return `${orgData.minEmployees}-${orgData.maxEmployees} employees`
  }

  return "Not specified"
}

export const parseSocialProfiles = (orgData) => {
  if (!orgData || !orgData.socialProfile) return {}

  try {
    const socialData =
      typeof orgData.socialProfile === "string" ? JSON.parse(orgData.socialProfile) : orgData.socialProfile

    return {
      instagram: socialData.instagram || "",
      facebook: socialData.facebook || "",
      x: socialData.twitter || "",
    }
  } catch (error) {
    console.error("Error parsing social profiles:", error)
    return {}
  }
}

export const getFormattedCompanyInfo = (orgData, vacancyData = null) => {
  const companyName = orgData?.orgName || "Company Name"
  const industry = orgData?.industry || (vacancyData ? formatDepartment(vacancyData.department) : "") || "Technology"
  const employeeCount = formatCompanySize(orgData)
  const foundedYear = orgData?.foundedYear || "N/A"
  const address = orgData?.address || "Address not specified"
  const phonenum = orgData?.phoneNo || "Phone not specified"
  const email = orgData?.email || "Email not specified"
  const socials = parseSocialProfiles(orgData)

  return {
    companyName,
    industry,
    employeeCount,
    foundedYear,
    address,
    phonenum,
    email,
    socials,
  }
}

export const formatBenefits = (orgData) => {
  return orgData?.benefits ? orgData.benefits.split(",").map((benefit) => benefit.trim()) : []
}
