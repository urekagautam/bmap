

import styles from "./OrganizationNavbar.module.css"
import {Link} from "react-router-dom";

import { IconBag } from "./icons/IconBag"
import SearchBar from "./SearchBar"
import { cns } from "../utils/classNames"
import { IconOrganizationBuilding } from "./icons/IconOrganizationBuilding";
import { IconPeoplePlus } from "./icons/IconPeoplePlus";

export default function OrganizationNavbar({ className = "" }) {
  return (
    <nav className={cns(styles.navbar, className)}>

      <Link to="/" className={styles.logo}>BMAP</Link>
     
      <div className={styles.searchContainer}>
        <SearchBar />
      </div>

      <div className={styles.navActions}>
      <Link to="/jobs" className={styles.navItem}>
          <IconBag />
          <span className={styles.navItemText}>DashBoard</span>
        </Link>

        <div className={styles.navItem}>
          <IconPeoplePlus />
          <span className={styles.navItemText}>People</span>
        </div>

        <Link to="/orgprofile" className={styles.navItem}>
          <IconOrganizationBuilding />
          <span className={styles.navItemText}>Profile</span>
        </Link>
      </div>
    </nav>
  )
}
