import { IconLocation } from "../../../component/icons/IconLocation";
import VacancyCard from "../../../component/VacancyCard";

import styles from "./NearbyJobs.module.css"

export default function NearbyJobs() {
  // Sample data for job listings
  const jobListings = [
    {
      id: 1,
      vacancyTitle: "Primary Level Teacher",
      vacancyCompany: "Gita Mata School",
      skills: ["Communication", "Motivational", "Supervision"],
      deadline: "1 week, 3 days from today",
      views: "500",
      logoSrc: "/RandomImage.png",
    },
    {
      id: 2,
      vacancyTitle: "Primary Level Teacher",
      vacancyCompany: "Gita Mata School",
      skills: ["Communication", "Motivational", "Supervision"],
      deadline: "1 week, 3 days from today",
      views: "500",
      logoSrc: "/RandomImage.png",
    },
    {
      id: 3,
      vacancyTitle: "Primary Level Teacher",
      vacancyCompany: "Gita Mata School",
      skills: ["Communication", "Motivational", "Supervision"],
      deadline: "1 week, 3 days from today",
      views: "500",
      logoSrc: "/RandomImage.png",
    },
    {
      id: 4,
      vacancyTitle: "Primary Level Teacher",
      vacancyCompany: "Gita Mata School",
      skills: ["Communication", "Motivational", "Supervision"],
      deadline: "1 week, 3 days from today",
      views: "500",
      logoSrc: "/RandomImage.png",
    },
    {
      id: 5,
      vacancyTitle: "Primary Level Teacher",
      vacancyCompany: "Gita Mata School",
      skills: ["Communication", "Motivational", "Supervision"],
      deadline: "1 week, 3 days from today",
      views: "500",
      logoSrc: "/RandomImage.png",
    },
    {
      id: 6,
      vacancyTitle: "Primary Level Teacher",
      vacancyCompany: "Gita Mata School",
      skills: ["Communication", "Motivational", "Supervision"],
      deadline: "1 week, 3 days from today",
      views: "500",
      logoSrc: "/RandomImage.png",
    },
  ]

  return (
    <section className={styles.mainWrapper}>
      <header>
        <IconLocation />
        <h1>Jobs near you</h1>
      </header>

      <div className={styles.jobsGrid}>
        {jobListings.map((job) => (
          <VacancyCard
            key={job.id}
            vacancyTitle={job.vacancyTitle}
            vacancyCompany={job.vacancyCompany}
            skills={job.skills}
            deadline={job.deadline}
            views={job.views}
            logoSrc={job.logoSrc}
          />
        ))}
      </div>
    </section>
  )
}
