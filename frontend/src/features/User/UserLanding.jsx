import { Link } from "react-router-dom";
import UserNavbar from "../../component/UserNavbar";
import NearbyJobs from "./landing/NearbyJobs";
import styles from "./UserLanding.module.css";

export default function UserLanding() {
  const id="683fefafdbf50496e0b4d71b";
  return (
   <>
    <UserNavbar />
    <div className={styles.Banner}>
            <img src="BANNER.svg" />
            </div>
    <section className={styles.sectionWrapper}>
           <NearbyJobs />
           <Link to={`/cmpprofile/${id}`}>Organization Profile</Link>
    </section>
    </>
  )
}
