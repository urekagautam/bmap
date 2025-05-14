import styles from "./JobsTab.module.css"
import Button from "../../../component/Button.jsx"
import JobCard from "../../../component/JobCard.jsx"
import { Link } from "react-router-dom"

export default function JobsTab() {

  const jobListings = [
    {
      id: 1,
      title: "Primary Level Teacher",
      company: "Gita Mata School",
      location: "Payutar, Kathmandu",
      skills: ["Communication", "Motivational", "Supervision", "Supervision"],
      salaryMin: "20,000",
      salaryMax: "40,000",
      level:"Mid-Level",
      jobType: "Full-time",
      jobMode: "On-site/In-Office",
      experienceLevel: "Mid level",
      experienceDuration: "More than or equal to 3yrs",
      deadline: "Apply before: 1 week, 3 days from today",
      views: 500,
    },
    {
      id: 2,
      title: "Junior Software Developer",
      company: "TechNova Solutions",
      location: "Thamel, Kathmandu",
      skills: ["JavaScript", "React", "Node.js", "MongoDB"],
      salaryMin: "20,000",
      salaryMax: "40,000",
      level:"Mid-Level",
      jobType: "Full-time",
      jobMode: "Hybrid",
      experienceLevel: "Entry level",
      experienceDuration: "More than or equal to 1yr",
      deadline: "Apply before: 2 weeks, 5 days from today",
      views: 723,
    },
    {
      id: 3,
      title: "Marketing Manager",
      company: "Global Brands Nepal",
      location: "Baluwatar, Kathmandu",
      skills: ["Digital Marketing", "SEO", "Content Strategy", "Analytics", "Campaign..."],
      salaryMin: "20,000",
      salaryMax: "40,000",
      level:"Mid-Level",
      jobType: "Full-time",
      jobMode: "On-site/In-Office",
      experienceLevel: "Senior level",
      experienceDuration: "More than or equal to 5yrs",
      deadline: "Apply before: 1 week, 2 days from today",
      views: 412,
    },
    {
      id: 4,
      title: "Graphic Designer",
      company: "Creative Hub Nepal",
      location: "Jhamsikhel, Lalitpur",
      skills: ["Adobe Photoshop", "Illustrator", "UI/UX", "Typography"],
      salaryMin: "20,000",
      salaryMax: "40,000",
      level:"Mid-Level",
      jobType: "Full-time",
      jobMode: "Remote",
      experienceLevel: "Mid level",
      experienceDuration: "More than or equal to 2yrs",
      deadline: "Apply before: 3 weeks from today",
      views: 389,
    },
    {
      id: 5,
      title: "Senior Accountant",
      company: "Himalayan Bank Ltd.",
      location: "New Baneshwor, Kathmandu",
      skills: ["Financial Reporting", "Taxation", "Auditing", "Reconciliation"],
      salaryMin: "20,000",
      salaryMax: "40,000",
      level:"Mid-Level",
      jobType: "Full-time",
      jobMode: "On-site/In-Office",
      experienceLevel: "Senior level",
      experienceDuration: "More than or equal to 4yrs",
      deadline: "Apply before: 5 days from today",
      views: 276,
    },
    {
      id: 6,
      title: "HR Specialist",
      company: "Mountain Enterprises",
      location: "Kupondole, Lalitpur",
      skills: ["Recruitment", "Employee Relations", "Training", "Compliance"],
      salaryMin: "20,000",
      salaryMax: "40,000",
      level:"Mid-Level",
      jobType: "Full-time",
      jobMode: "On-site/In-Office",
      experienceLevel: "Mid level",
      experienceDuration: "More than or equal to 3yrs",
      deadline: "Apply before: 1 week, 4 days from today",
      views: 342,
    },
  ]

    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.headerText}>
            <h1 className={styles.title}>Current Vacancies</h1>
            <p className={styles.subtitle}>See who we're looking for at TechCorp Inc.</p>
          </div>
          <Link to="/postjob">
          <Button layout="sm" fill="outline" color="neutralLight">
            Post a Job
          </Button>
          </Link>
        </div>
  
        <div className={styles.jobGrid}>
          {jobListings.map((job) => (
            <JobCard
              key={job.id}
              title={job.title}
              company={job.company}
              location={job.location}
              skills={job.skills}
              level={job.level}
              salaryMin={job.salaryMin}
              salaryMax={job.salaryMax}
              jobType={job.jobType}
              jobMode={job.jobMode}
              experienceLevel={job.experienceLevel}
              experienceDuration={job.experienceDuration}
              deadline={job.deadline}
              views={job.views}
            />
          ))}
        </div>
      </div>
    )
  
}