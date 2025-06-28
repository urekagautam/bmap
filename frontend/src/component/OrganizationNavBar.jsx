import styles from "./OrganizationNavbar.module.css"
import {Link} from "react-router-dom";

import { IconBag } from "./icons/IconBag"
import SearchBar from "./SearchBar"
import { cns } from "../utils/classNames"
import { IconOrganizationBuilding } from "./icons/IconOrganizationBuilding";
import { IconPeoplePlus } from "./icons/IconPeoplePlus";
import useOrgAuth from "../hooks/useOrgAuth";

export default function OrganizationNavbar({ className = "" }) {
   const { orgId, isAuthenticated } = useOrgAuth()
  return (
    <nav className={cns(styles.navbar, className)}>

      <Link className={styles.logo}>BMAP</Link>
     
  {/*     <div className={styles.searchContainer}>
        <SearchBar />
      </div> */}

      <div className={styles.navActions}>
      <Link to="/org" className={styles.navItem}>
          <IconBag />
          <span className={styles.navItemText}>DashBoard</span>
        </Link>

      {/*   <Link to={`/orgprofile/${orgId}`}  className={styles.navItem}>
          <IconPeoplePlus />
          <span className={styles.navItemText}>Register</span>
        </Link> */}

        <Link to={`/cmpprofile/${orgId}`} className={styles.navItem}>
          <IconOrganizationBuilding />
          <span className={styles.navItemText}>Profile</span>
        </Link>
      </div>
    </nav>
  )
}
