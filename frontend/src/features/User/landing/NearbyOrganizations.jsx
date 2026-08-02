import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { IconLocation } from "../../../component/icons/IconLocation";
import { apiGetNearbyOrganizations } from "../../../services/apiAuth";
import styles from "./NearbyOrganizations.module.css";

export default function NearbyOrganizations() {
  const [organizations, setOrganizations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNearbyOrganizations = async () => {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        setError("User not logged in");
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const response = await apiGetNearbyOrganizations(userId, 10);
        if (response.success && Array.isArray(response.data)) {
          setOrganizations(response.data);
        } else {
          setOrganizations([]);
        }
      } catch (err) {
        console.error("Failed to fetch nearby organizations:", err);
        setError("No nearby organizations found.");
        setOrganizations([]);
      } finally {
        setLoading(false);
      }
    };

    fetchNearbyOrganizations();
  }, []);

  return (
    <section className={styles.mainWrapper}>
      <header>
        <IconLocation />
        <h1>Companies near you</h1>
      </header>

      {loading && <p>Loading nearby companies...</p>}
      {error && <p>{error}</p>}

      {!loading && !error && (
        <div className={styles.orgGrid}>
          {organizations.length === 0 ? (
            <p>No nearby organizations found.</p>
          ) : (
            organizations.map((org) => (
              <Link
                key={org._id}
                to={`/view-orgprofile/${org._id}`}
                className={styles.orgLink}
              >
                <div className={styles.orgCard}>
                  <img
                    src="/CompanyProfileImage.png"
                    alt="Company Logo"
                    className={styles.logo}
                  />
                  {/* <p className={styles.orgId}>ID: {org._id}</p> */}
                </div>
              </Link>
            ))
          )}
        </div>
      )}
    </section>
  );
}
