import Tag from "../../../component/Tag.jsx";
import { useState } from "react";
import Button from "../../../component/Button.jsx";
import styles from "./AboutTab.module.css"

import { IconOrganizationBuilding } from "../../../component/icons/IconOrganizationBuilding.jsx";
import { IconPeople } from "../../../component/icons/IconPeople.jsx";
import { IconLocationPinned } from "../../../component/icons/IconLocationPinned";
import { IconPhone } from "../../../component/icons/IconPhone.jsx";
import { IconEnvelope } from "../../../component/icons/IconEnvelope.jsx";
import { IconClock } from "../../../component/icons/IconClock.jsx";
import { IconInstagram } from "../../../component/icons/IconInstagram.jsx";
import { IconFacebook } from "../../../component/icons/IconFacebook.jsx";
import { IconX } from "../../../component/icons/IconX.jsx";



export default function AboutTab() {

    const [activeTab, setActiveTab] = useState("about");

// Company data
const companyName = "TechCorp Inc.";
const industry = "Technology";
const employeeCount = "500-1000 employees";

const address = "Payutar, Kathmandu";
const phonenum = "+977 9840034685";
const email = "TecCorp123@gmail.com";

/*  based on newlines paragraph as an array store gareo hunchu so  /n ansar chutai as an array baseko assume garera: */
const aboutText = [
  "TechCorp is a leading technology company specializing in cloud-based solutions for businesses. Founded in 2010, we've grown to serve over 10,000 customers worldwide.",
  "Our mission is to empower businesses with innovative technology solutions that drive growth and efficiency. We're committed to creating a positive impact through our products and services, and we're proud to be recognized as a leader in our industry.",
];

// Benefits data (same case as above)
const benefits = [
  "Competitive Salary and equity package",
  "Flexible work hours and remote work options",
  "Professional development budget",
  "Regular team events & retreats",
  "Comprehensive health, dental, and vision insurance",
  "Generous vacation policy",
  "Home office stipend",
  "Wellness programs and gym membership",
];

// Specialties data
const specialties = [
  "Cloud Computing",
  "Software Development",
  "AI",
  "Machine Learning",
  "Data Analytics",
];

//half garera 2ta column ma rakhna
const middleIndex = Math.ceil(benefits.length / 2);
const benefitsLeft = benefits.slice(0, middleIndex);
const benefitsRight = benefits.slice(middleIndex);

// Jobs data
const jobs = [
  {
    title: "Senior Developer",
    locationType: "On-site/In-Office",
    employmentType: "Full-time",
  },
  {
    title: "UX Designer",
    locationType: "None",
    employmentType: "Freelance",
  },
  {
    title: "UX Designer",
    locationType: "None",
    employmentType: "Freelance",
  },
];



const socials = {
  instagram: "urekagautam",
  facebook: "Ureka Gautam",
  x: "ureka",
};
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
                      {specialties.map((specialty, index) => (
                        <Tag key={index} skill={specialty} />
                      ))}
                    </div>
                  </div>
                </div>

                <div className={styles.benefitsSection}>
                  <h2>Benefits & Perks</h2>
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
                        {address}
                      </span>
                      <Button fill="text" color="accent">
                        Show Location
                      </Button>
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
                        <a
                          href={`https://instagram.com/${socials.instagram}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <IconInstagram platform="instagram" />
                        </a>
                      )}
                      {socials.facebook && (
                        <a
                          href={`https://facebook.com/${socials.facebook}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <IconFacebook platform="facebook" />
                        </a>
                      )}
                      {socials.x && (
                        <a
                          href={`https://twitter.com/${socials.x}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <IconX platform="x" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>

                <div className={styles.jobsSection}>
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
                    <Button
                      type="button"
                      layout="sm"
                      color="neutralLight"
                      fill="outline"
                      onClick={() => setActiveTab("jobs")}
                    >
                      View all Jobs
                    </Button>
                  </div>
                </div>
              </div>
            </div>


)
}