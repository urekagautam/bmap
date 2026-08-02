import styles from "./OrganizationNavbar.module.css"
import {Link, useNavigate} from "react-router-dom";

import { IconBag } from "./icons/IconBag"
import SearchBar from "./SearchBar"
import { cns } from "../utils/classNames"
import { IconOrganizationBuilding } from "./icons/IconOrganizationBuilding";
import { IconPeoplePlus } from "./icons/IconPeoplePlus";
import useOrgAuth from "../hooks/useOrgAuth";

export default function OrganizationNavbar({ className = "" }) {
  const { orgId, isAuthenticated, clearAuth } = useOrgAuth();
  const navigate = useNavigate();
  const handleLogout = () => {
    clearAuth();
    navigate("/org/login");
  };
  return (
    <nav className={cns(styles.navbar, className)}>
      <Link className={styles.logo} to="/org">BMAP</Link>
      <div className={styles.navActions}>
        <Link to="/org" className={styles.navItem}>
          <IconBag />
          <span className={styles.navItemText}>DashBoard</span>
        </Link>
        {orgId && (
          <Link to={`/cmpprofile/${orgId}`} className={styles.navItem}>
            <IconOrganizationBuilding />
            <span className={styles.navItemText}>Profile</span>
          </Link>
        )}
        {isAuthenticated && (
          <button
            onClick={handleLogout}
            className={styles.navItem}
            style={{ background: 'none', border: 'none', padding: 0, font: 'inherit' }}
          >
            Logout
          </button>
        )}
      </div>
    </nav>
  );
}
