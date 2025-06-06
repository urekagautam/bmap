import Tag from "../../../component/Tag.jsx"
import Button from "../../../component/Button.jsx"
import styles from "./AboutTab.module.css"
import { IconOrganizationBuilding } from "../../../component/icons/IconOrganizationBuilding.jsx"
import { IconPeople } from "../../../component/icons/IconPeople.jsx"
import { IconLocationPinned } from "../../../component/icons/IconLocationPinned"
import { IconPhone } from "../../../component/icons/IconPhone.jsx"
import { IconEnvelope } from "../../../component/icons/IconEnvelope.jsx"
import { IconClock } from "../../../component/icons/IconClock.jsx"
import { IconInstagram } from "../../../component/icons/IconInstagram.jsx"
import { IconFacebook } from "../../../component/icons/IconFacebook.jsx"
import { IconX } from "../../../component/icons/IconX.jsx"

export default function AboutTab({ setActiveTab, orgData, companyInfo }) {
  const {
    companyName,
    industry,
    employeeCount,
    address,
    phonenum, 
    email,
    socials,
    description,
    specialities,
    ownerName,
    district,
  } = companyInfo

  const aboutText = description
    ? description.split("\n").filter((paragraph) => paragraph.trim())
    : [
        `${companyName} is a leading company in the ${industry} industry.`,
        "We are committed to delivering excellence and innovation in everything we do.",
      ]

  const specialtiesList =
    specialities && specialities.length > 0 ? specialities : ["Innovation", "Technology", "Excellence"]

  const benefitsList = orgData?.additionalInfo ? orgData.additionalInfo.split(",").map((benefit) => benefit.trim()) : []

  const middleIndex = Math.ceil(benefitsList.length / 2)
  const benefitsLeft = benefitsList.slice(0, middleIndex)
  const benefitsRight = benefitsList.slice(middleIndex)

//LATERRRR 
  const jobs = [
    {
      title: "Senior Developer",
      locationType: "On-site/In-Office",
      employmentType: "Full-time",
    },
    {
      title: "UX Designer",
      locationType: "Remote",
      employmentType: "Full-time",
    },
    {
      title: "Data Analyst",
      locationType: "Hybrid",
      employmentType: "Full-time",
    },
  ]

  return (
    <div className={styles.aboutContent}>
      <div className={styles.aboutAndBenefits}>
        <div className={styles.introSection}>
          <h2>About {companyName}</h2>

          <div className={styles.aboutText}>
            {aboutText.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>

          <div className={styles.specialitySection}>
            <h3>Specialties</h3>
            <div className={styles.specialties}>
              {specialtiesList.map((specialty, index) => (
                <Tag key={index} data={specialty} />
              ))}
            </div>
          </div>
        </div>

        <div className={styles.benefitsSection}>
          <h2>Benefits & Perks</h2>
          {benefitsList.length > 0 ? (
            <div className={styles.benefitsContainer}>
              <ul className={styles.benefitsList}>
                {benefitsLeft.map((benefit, index) => (
                  <li key={index} className={styles.benefitItem}>
                    {benefit}
                  </li>
                ))}
              </ul>
              <ul className={styles.benefitsList}>
                {benefitsRight.map((benefit, index) => (
                  <li key={index} className={styles.benefitItem}>
                    {benefit}
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <div className={styles.noBenefits}>
              <p>No information available</p>
            </div>
          )}
        </div>
      </div>

      <div className={styles.infoAndHiring}>
        <div className={styles.companyOtherInfo}>
          <h2>Company Information</h2>
          <div className={styles.infoList}>
            <span>
              <IconOrganizationBuilding />
              {industry}
            </span>
            <span>
              <IconPeople />
              {employeeCount}
            </span>
            <span className={styles.showLocation}>
              <span className={styles.locationDetails}>
                <IconLocationPinned />
                {district ? `${address}, ${district}` : address}
              </span>
            </span>
            <span>
              <IconPhone />
              {phonenum} 
            </span>
            <span>
              <IconEnvelope />
              {email}
            </span>
          </div>

          <div className={styles.socialInfo}>
            <h4>Social Media</h4>
            <div className={styles.socialsList}>
              {socials.instagram && (
                <a href={socials.instagram} target="_blank" rel="noopener noreferrer">
                  <IconInstagram platform="instagram" />
                </a>
              )}
              {socials.facebook && (
                <a href={socials.facebook} target="_blank" rel="noopener noreferrer">
                  <IconFacebook platform="facebook" />
                </a>
              )}
              {socials.x && (
                <a href={socials.x} target="_blank" rel="noopener noreferrer">
                  <IconX platform="x" />
                </a>
              )}
              {!socials.instagram && !socials.facebook && !socials.x && (
                <span className={styles.notAvailable}>No information available</span>
              )}
            </div>
          </div>
        </div>

        {/* <div className={styles.jobsSection}>
          <h2>Now Hiring</h2>
          <div className={styles.jobsList}>
            {jobs.map((job, index) => (
              <div key={index} className={styles.jobCard}>
                <h3 className={styles.jobTitle}>{job.title}</h3>
                <div className={styles.jobLocation}>
                  <IconClock />
                  <span>
                    {job.locationType} • {job.employmentType}
                  </span>
                </div>
                <div className={styles.viewJobButton}>
                  <Button layout="sm" color="primary" fill="text">
                    View Job
                  </Button>
                </div>
              </div>
            ))}
          </div>
          <div className={styles.viewAllJobsButton}>
            <Button type="button" layout="sm" color="neutralLight" fill="outline" onClick={() => setActiveTab("jobs")}>
              View all Jobs
            </Button>
          </div>
        </div> */}
      </div>
    </div>
  )
}
