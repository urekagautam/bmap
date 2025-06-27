import { Link } from "react-router-dom";
import UserNavbar from "../../component/UserNavbar";
import NearbyJobs from "./landing/NearbyJobs";
import styles from "./UserLanding.module.css";
import { IconLocation } from "../../component/icons/IconLocation";

export default function UserLanding() {
  const id = "683fefafdbf50496e0b4d71b";
  const id2 = "683fefc5dbf50496e0b4d722";
  const jobId = "";
  return (
    <>
      <UserNavbar />
      <div className={styles.Banner}>
        <img src="BANNER.svg" />
      </div>
      <section className={styles.sectionWrapper}>
        <NearbyJobs />

        <section className={styles.mainWrapper}>
          <header>
            <IconLocation />
            <h1>Companies near you</h1>
          </header>

            <div className={styles.companyInfo}>
                  <Link to={`/view-orgprofile/${id}`}>Organization Profile1</Link>
                  <Link to={`/view-orgprofile/${id2}`}>Organization Profile2</Link>
                
            </div>
        </section>
   {/*      <Link to={`/cmpprofile/${id}`}>Organization Profile</Link>
        <Link to={`/jobapplication/${jobId}`}>Job Application</Link> */}
      </section>
    </>
  );
}
