import { useState, useEffect } from "react";
import { IconLocation } from "../../../component/icons/IconLocation";
import VacancyCard from "../../../component/VacancyCard";
import MapComponent from "../../../component/MapComponent";
import {
  apiGetNearbyVacancies,
  apiUpdateUserLocation,
  apiGetUserProfile,
} from "../../../services/apiAuth";
import {
  SKILL_OPTIONS,
  DEPARTMENT_OPTIONS,
  JOB_BY_TIME,
  JOB_BY_LOCATION,
  JOB_BY_LEVEL,
} from "../../../constants/constants.js";
import styles from "./NearbyJobs.module.css";

export default function NearbyJobs() {
  const [location, setLocation] = useState(null);
  const [locationError, setLocationError] = useState(null);
  const [vacancies, setVacancies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [locationLoading, setLocationLoading] = useState(false);
  const [checkingLocation, setCheckingLocation] = useState(true);
  const [showManualLocation, setShowManualLocation] = useState(false);
  const [locationInput, setLocationInput] = useState("");
  const [manualCoordinates, setManualCoordinates] = useState(null);

  useEffect(() => {
    const checkUserLocation = async () => {
      const userId = localStorage.getItem("userId");

      if (!userId) {
        setCheckingLocation(false);
        return;
      }

      const cachedUserId = localStorage.getItem("locationUserId");
      const cachedLocation = localStorage.getItem("userLocation");

      if (cachedUserId === userId && cachedLocation) {
        try {
          const parsedLocation = JSON.parse(cachedLocation);
          if (parsedLocation.lat && parsedLocation.lng) {
            setLocation(parsedLocation);
            setCheckingLocation(false);
            return;
          }
        } catch (e) {
          console.error("Error parsing cached location:", e);
          localStorage.removeItem("userLocation");
          localStorage.removeItem("locationUserId");
        }
      }

      try {
        const response = await apiGetUserProfile(userId);

        if (
          response.success &&
          response.data.location?.lat &&
          response.data.location?.lng
        ) {
          const dbLocation = {
            lat: response.data.location.lat,
            lng: response.data.location.lng,
          };

          setLocation(dbLocation);
          localStorage.setItem("userLocation", JSON.stringify(dbLocation));
          localStorage.setItem("locationUserId", userId);
        } else {
          setLocation(null);
          localStorage.removeItem("userLocation");
          localStorage.removeItem("locationUserId");
        }
      } catch (error) {
        console.error("Error checking user location:", error);
        setLocation(null);
        localStorage.removeItem("userLocation");
        localStorage.removeItem("locationUserId");
      } finally {
        setCheckingLocation(false);
      }
    };

    checkUserLocation();
  }, []);

  const getLabelFromValue = (options, value) => {
    const option = options.find((opt) => opt.value === value);
    return option ? option.label : value;
  };

  const convertSkillsToLabels = (skillValues) => {
    if (!Array.isArray(skillValues)) return [];

    return skillValues.map((skillValue) =>
      getLabelFromValue(SKILL_OPTIONS, skillValue)
    );
  };

  const fetchNearbyVacancies = async () => {
    const userId = localStorage.getItem("userId");

    if (!userId) {
      setError("User not logged in");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await apiGetNearbyVacancies(userId, 10);

      if (response.success && response.data.vacancies) {
        const transformedVacancies = response.data.vacancies.map((vacancy) => ({
          id: vacancy._id,
          vacancyTitle: vacancy.title,
          vacancyCompany:
            vacancy.organizationName ||
            vacancy.orgId?.orgName ||
            "Unknown Company",
          skills: convertSkillsToLabels(vacancy.skillsRequired || []),
          deadline: formatDeadline(vacancy.deadline),
          views: "N/A",
          logoSrc: "/RandomImage.png",
          distance: vacancy.distance ? `${vacancy.distance}km away` : null,
          department: getLabelFromValue(DEPARTMENT_OPTIONS, vacancy.department),
          jobByTime: getLabelFromValue(JOB_BY_TIME, vacancy.jobByTime),
          jobByLocation: getLabelFromValue(
            JOB_BY_LOCATION,
            vacancy.jobByLocation
          ),
          jobLevel: getLabelFromValue(JOB_BY_LEVEL, vacancy.jobLevel),
          salary: vacancy.salary,
        }));

        setVacancies(transformedVacancies);
      } else {
        setVacancies([]);
      }
    } catch (err) {
      console.error("Failed to fetch nearby vacancies:", err);
      setError("No vacancies found near you.");
      setVacancies([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (location && !checkingLocation) {
      fetchNearbyVacancies();
    }
  }, [location, checkingLocation]);

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

  if (checkingLocation) {
    return (
      <section className={styles.mainWrapper}>
        <header>
          <IconLocation />
          <h1>Jobs near you</h1>
        </header>
        <div className={styles.loadingContainer}>
          <p>Checking your location...</p>
        </div>
      </section>
    );
  }

  return (
    <section className={styles.mainWrapper}>
      <header>
        <IconLocation />
        <h1>Jobs near you</h1>
      </header>

      {!showManualLocation && (
        <div className={styles.enableLocationContainer}>
          <button
            onClick={() => setShowManualLocation(true)}
            className={styles.enableLocationBtn}
          >
            {location ? "Update Location" : "Enable Location for Recommendations"}
          </button>
        </div>
      )}

      {showManualLocation && (
        <div className={styles.manualLocationSection}>
          <input
            type="text"
            value={locationInput}
            onChange={(e) => setLocationInput(e.target.value)}
            placeholder="Type your location"
            className={styles.locationInput}
          />

          <MapComponent
            location={locationInput}
            onCoordinatesChange={(coords) => setManualCoordinates(coords)}
          />

          <button
            className={styles.confirmLocationBtn}
            onClick={async () => {
              if (!manualCoordinates) {
                setLocationError("Please enter a valid location.");
                return;
              }

              const userId = localStorage.getItem("userId");
              if (!userId) {
                setLocationError("Please log in to save location.");
                return;
              }

              setLocationLoading(true);
              setLocationError(null);

              try {
                const response = await apiUpdateUserLocation(userId, manualCoordinates);
                if (response.success) {
                  setLocation(manualCoordinates);
                  localStorage.setItem("userLocation", JSON.stringify(manualCoordinates));
                  localStorage.setItem("locationUserId", userId);
                  setShowManualLocation(false); // Hide manual location input after successful update
                } else {
                  throw new Error("Failed to save location.");
                }
              } catch (err) {
                console.error("Error updating location:", err);
                setLocationError("Failed to save location. Try again.");
              } finally {
                setLocationLoading(false);
              }
            }}
          >
            {locationLoading ? "Saving..." : "Confirm Location"}
          </button>

          {locationError && <p className={styles.errorText}>{locationError}</p>}
        </div>
      )}

      {loading && (
        <div className={styles.loadingContainer}>
          <p>Loading nearby jobs...</p>
        </div>
      )}

      {error && (
        <div className={styles.errorContainer}>
          <p>{error}</p>
        </div>
      )}

      {!loading && !error && location && (
        <div className={styles.jobsGrid}>
          {vacancies.length === 0 ? (
            <p>No nearby jobs found.</p>
          ) : (
            vacancies.map((job) => (
              <VacancyCard
                id={job.id}
                key={job.id}
                vacancyTitle={job.vacancyTitle}
                vacancyCompany={job.vacancyCompany}
                skills={job.skills}
                deadline={job.deadline}
                views={job.views}
                logoSrc={job.logoSrc}
                distance={job.distance}
                department={job.department}
                jobByTime={job.jobByTime}
                jobByLocation={job.jobByLocation}
                jobLevel={job.jobLevel}
              />
            ))
          )}
        </div>
      )}
    </section>
  );
}