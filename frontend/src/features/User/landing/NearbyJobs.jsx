import { useState, useEffect } from "react";
import { IconLocation } from "../../../component/icons/IconLocation";
import VacancyCard from "../../../component/VacancyCard";
import styles from "./NearbyJobs.module.css";

export default function NearbyJobs() {
  const [location, setLocation] = useState(null);
  const [locationError, setLocationError] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem("userLocation");
    if (saved) {
      setLocation(JSON.parse(saved));
    }
  }, []);

  const handleEnableLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const coords = {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          };
          setLocation(coords);
          localStorage.setItem("userLocation", JSON.stringify(coords));
        },
        (err) => {
          console.error(err);
          setLocationError("Location access denied or unavailable.");
        }
      );
    } else {
      setLocationError("Geolocation is not supported by your browser.");
    }
  };

  const jobListings = [
    {
      id: '683ff064dbf50496e0b4d730',
      vacancyTitle: "Primary Level Teacher",
      vacancyCompany: "Gita Mata School",
      skills: ["Communication", "Motivational", "Supervision"],
      deadline: "1 week, 3 days from today",
      views: "500",
      logoSrc: "/RandomImage.png",
      lat: 27.7000,
      lng: 85.3333,
    },
  ];

  const getDistance = (lat1, lng1, lat2, lng2) => {
    // Haversine formula
    const toRad = (val) => (val * Math.PI) / 180;
    const R = 6371;

    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lng2 - lng1);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) *
        Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; 
  };

  const filteredJobs = location
    ? jobListings.filter((job) => {
        const dist = getDistance(location.lat, location.lng, job.lat, job.lng);
        return dist < 10;
      })
    : [];

  return (
    <section className={styles.mainWrapper}>
      <header>
        <IconLocation />
        <h1>Jobs near you</h1>
      </header>

        {location && (
    <p>
      Your Location: Latitude {location.lat.toFixed(4)}, Longitude {location.lng.toFixed(4)}
    </p>
  )}

      {!location && (
        <div>
          <button onClick={handleEnableLocation}>
            Enable Location for Recommendations
          </button>
          {locationError && <p>{locationError}</p>}
        </div>
      )}

      {location && (
        <div className={styles.jobsGrid}>
          {filteredJobs.length === 0 ? (
            <p>No nearby jobs found.</p>
          ) : (
            filteredJobs.map((job) => (
              <VacancyCard
               id={job.id}
                key={job.id}
                vacancyTitle={job.vacancyTitle}
                vacancyCompany={job.vacancyCompany}
                skills={job.skills}
                deadline={job.deadline}
                views={job.views}
                logoSrc={job.logoSrc}
              />
            ))
          )}
        </div>
      )}
    </section>
  );
}
