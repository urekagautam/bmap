import { useState, useEffect } from "react";
import { IconLocation } from "../../../component/icons/IconLocation";
import VacancyCard from "../../../component/VacancyCard";
import { apiGetJobRecommendations } from "../../../services/apiAuth";
import { SKILL_OPTIONS, DEPARTMENT_OPTIONS, JOB_BY_TIME, JOB_BY_LOCATION, JOB_BY_LEVEL } from "../../../constants/constants.js";
import styles from "./NearbyJobs.module.css"; // Using same CSS file

export default function PrefferedJobs() {
  const [vacancies, setVacancies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getLabelFromValue = (options, value) => {
    const option = options.find(opt => opt.value === value);
    return option ? option.label : value;
  };

  const convertSkillsToLabels = (skillValues) => {
    if (!Array.isArray(skillValues)) return [];
    
    return skillValues.map(skillValue =>
      getLabelFromValue(SKILL_OPTIONS, skillValue)
    );
  };

  const fetchJobRecommendations = async () => {
    const userId = localStorage.getItem("userId");
    
    if (!userId) {
      setError("User not logged in");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await apiGetJobRecommendations(userId, 20);
      
      if (response.success && Array.isArray(response.data)) {
        const transformedVacancies = response.data.map(vacancy => ({
          id: vacancy._id,
          vacancyTitle: vacancy.title,
          vacancyCompany: vacancy.organizationName || vacancy.orgId?.orgName || "Unknown Company",
          skills: convertSkillsToLabels(vacancy.skillsRequired || []),
          deadline: formatDeadline(vacancy.deadline),
          views: "N/A",
          logoSrc: "/RandomImage.png",
          similarityScore: vacancy.similarityScore ? `${Math.round(vacancy.similarityScore * 100)}% match` : null,
          department: getLabelFromValue(DEPARTMENT_OPTIONS, vacancy.department),
          jobByTime: getLabelFromValue(JOB_BY_TIME, vacancy.jobByTime),
          jobByLocation: getLabelFromValue(JOB_BY_LOCATION, vacancy.jobByLocation),
          jobLevel: getLabelFromValue(JOB_BY_LEVEL, vacancy.jobLevel),
          salary: vacancy.salary
        }));
        
        setVacancies(transformedVacancies);
        console.log("Transformed job recommendations with labels:", transformedVacancies);
      } else {
        setVacancies([]);
      }
    } catch (err) {
      console.error("Failed to fetch job recommendations:", err);
      setError("Jobs Recommendations not available for you.");
      setVacancies([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobRecommendations();
  }, []);

  const formatDeadline = (deadline) => {
    if (!deadline) return "No deadline specified";
    
    const deadlineDate = new Date(deadline);
    const now = new Date();
    const diffTime = deadlineDate - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return "Deadline passed";
    if (diffDays === 0) return "Due today";
    if (diffDays === 1) return "Due tomorrow";
    if (diffDays < 7) return `${diffDays} days from now`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks from now`;
    
    return deadlineDate.toLocaleDateString();
  };

  return (
    <div className={styles.mainWrapper}>
      <header>
        <IconLocation />
        <h1>Jobs You May Prefer</h1>
     </header>

      {loading && (
        <div className={styles.loading}>
          Loading recommended jobs...
        </div>
      )}

      {error && (
        <div className={styles.error}>
          {error}
        </div>
      )}

      {!loading && !error && (
        <div className={styles.jobsGrid}>
          {vacancies.length === 0 ? (
            <div className={styles.noJobs}>
              No job recommendations found. Please complete your profile to get better recommendations.
            </div>
          ) : (
            <>
              {vacancies.map((job) => (
                <VacancyCard
                  key={job.id}
                  id={job.id}
                  vacancyTitle={job.vacancyTitle}
                  vacancyCompany={job.vacancyCompany}
                  skills={job.skills}
                  deadline={job.deadline}
                  views={job.views}
                  logoSrc={job.logoSrc}
                  additionalInfo={job.similarityScore}
                  department={job.department}
                  jobByTime={job.jobByTime}
                  jobByLocation={job.jobByLocation}
                  jobLevel={job.jobLevel}
                  salary={job.salary}
                />
              ))}
            </>
          )}
        </div>
      )}
    </div>
  );
}