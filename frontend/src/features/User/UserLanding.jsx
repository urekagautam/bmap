import { Link } from "react-router-dom";
import UserNavbar from "../../component/UserNavbar";
import NearbyJobs from "./landing/NearbyJobs";
import styles from "./UserLanding.module.css";
import { IconLocation } from "../../component/icons/IconLocation";
import { useEffect } from "react";
import { apiGetUserProfile } from "../../services/apiAuth";
import PrefferedJobs from "../User/landing/PreferredJobs";
import NearbyOrganizations from "../User/landing/NearbyOrganizations";

export default function UserLanding() {
  // Session validity check on mount
  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (userId) {
      apiGetUserProfile(userId).catch(() => {
        // The API service will handle logout and redirect
      });
    } else {
      localStorage.clear();
      window.location.href = "/bmap";
    }
  }, []);

  return (
    <>
      <UserNavbar />
      <div className={styles.Banner}>
        <img src="BANNER.svg" />
      </div>
       <section className={styles.sectionWrapper}>
             <NearbyJobs className={styles.section} />
     
             <NearbyOrganizations />
     
             <PrefferedJobs />

     
           </section>
    </>
  );
}
