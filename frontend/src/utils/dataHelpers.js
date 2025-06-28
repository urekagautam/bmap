import {
  SKILL_OPTIONS,
  JOB_BY_TITLE,
  JOB_BY_TIME,
  JOB_BY_LOCATION,
  JOB_BY_LEVEL,
  FIELD_OF_EXPERTISE_OPTIONS,
  DISTRICT_OPTIONS,
  GENDER_OPTIONS,
} from "../constants/constants"

// Helper function to get label from value
export const getOptionLabel = (value, options) => {
  if (!value) return ""
  const option = options.find((opt) => opt.value === value)
  return option ? option.label : value
}

// Helper functions for specific fields
export const getSkillLabel = (skillValue) => getOptionLabel(skillValue, SKILL_OPTIONS)

export const getJobTitleLabel = (titleValue) => getOptionLabel(titleValue, JOB_BY_TITLE)

export const getJobTimeLabel = (timeValue) => getOptionLabel(timeValue, JOB_BY_TIME)

export const getJobLocationLabel = (locationValue) => getOptionLabel(locationValue, JOB_BY_LOCATION)

export const getJobLevelLabel = (levelValue) => getOptionLabel(levelValue, JOB_BY_LEVEL)

export const getFieldOfInterestLabel = (fieldValue) => getOptionLabel(fieldValue, FIELD_OF_EXPERTISE_OPTIONS)

export const getDistrictLabel = (districtValue) => getOptionLabel(districtValue, DISTRICT_OPTIONS)

export const getGenderLabel = (genderValue) => getOptionLabel(genderValue, GENDER_OPTIONS)

// Helper function to convert skills array from values to labels
export const convertSkillsToLabels = (skillsArray) => {
  if (!Array.isArray(skillsArray)) return []
  return skillsArray.map((skill) => getSkillLabel(skill))
}

// Helper function to convert skills array from values to option objects
export const convertSkillsToOptions = (skillsArray) => {
  if (!Array.isArray(skillsArray)) return []
  return skillsArray.map((skill) => {
    const option = SKILL_OPTIONS.find((opt) => opt.value === skill)
    return option || { value: skill, label: skill }
  })
}

// Social media URL generators
export const generateSocialMediaUrl = (platform, username) => {
  if (!username) return null

  const socialUrls = {
    instagram: `https://www.instagram.com/${username}`,
    facebook: `https://www.facebook.com/${username}`,
    x: `https://x.com/${username}`,
    twitter: `https://twitter.com/${username}`,
    linkedin: `https://www.linkedin.com/in/${username}`,
    github: `https://github.com/${username}`,
    portfolio: username, 
  }

  return socialUrls[platform] || username
}

// Helper function to get social media URLs
export const getSocialMediaUrls = (socialProfile) => {
  if (!socialProfile) return {}

  return {
    instagram: generateSocialMediaUrl("instagram", socialProfile.insta),
    facebook: generateSocialMediaUrl("facebook", socialProfile.fb),
    x: generateSocialMediaUrl("x", socialProfile.x),
    linkedin: generateSocialMediaUrl("linkedin", socialProfile.linkedin),
    github: generateSocialMediaUrl("github", socialProfile.github),
    portfolio: socialProfile.portfolio, 
  }
}
