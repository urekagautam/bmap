import JobCard from "../component/JobCard.jsx";

import styles from "./Test.module.css";

export default function Test() {
  return (
    <div className={styles.wrapper}>
      <JobCard
        vacancyTitle="Primary Level Teacher"
        vacancyCompany="Gita Mata School"
        location="Payutar, Kathmandu"
        skills={["Communication", "Leadership","Something","Another","Next One","After One"]}
        salaryMin="20000"
        period="Full Time"
        salaryMax="50000"
        employmentType="On-site/In-Office"
        level="Mid Level"
        experienceRequired="More than or equal to 3yrs"
        deadline="smth"
        views="500"
      />

    </div>
  );
}
