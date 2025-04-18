

import styles from "./UserNavbar.module.css"
import {Link} from "react-router-dom";

import { IconNotification } from "./icons/IconNotification"
import { IconUserProfile } from "./icons/IconUserProfile"
import { IconBag } from "./icons/IconBag"
import SearchBar from "./SearchBar"
import { cns } from "../utils/classNames"

export default function UserNavbar({ className = "" }) {
  return (
    <nav className={cns(styles.navbar, className)}>

      <Link to="/" className={styles.logo}>BMAP</Link>
     
      <div className={styles.searchContainer}>
        <SearchBar />
      </div>

      <div className={styles.navActions}>
      <Link to="/jobs" className={styles.navItem}>
          <IconBag />
          <span className={styles.navItemText}>Jobs</span>
        </Link>

        <div className={styles.navItem}>
          <IconNotification />
          <span className={styles.navItemText}>Notification</span>
        </div>

        <Link to="/profile" className={styles.navItem}>
          <IconUserProfile />
          <span className={styles.navItemText}>Profile</span>
        </Link>
      </div>
    </nav>
  )
}
