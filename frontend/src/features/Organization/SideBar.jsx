import styles from "./OrganizationDashboard.module.css"
import {
  FaFileAlt,
  FaBriefcase,
  FaUserFriends,
  FaCog
} from "react-icons/fa";
import { Link } from "react-router-dom";

function SideBar({ activeMenu = "overview" }) {
  const menuItems = [
    {
      id: "overview",
      icon: <FaFileAlt />,
      label: "Overview",
      path: "/org"
    },
    {
      id: "jobpostings",
      icon: <FaBriefcase />,
      label: "Job Postings",
      path: "/orgJobPostings"
    },
    {
      id: "applications",
      icon: <FaUserFriends />,
      label: "Applications",
      path: "/orgJobApplications"
    }
  ];

  return (
    <aside className={styles.sidebar}>
      <h2 className={styles.heading}>Workspace</h2>
      
      <div className={styles.section}>
        <p className={styles.sectionTitle}>Dashboard</p>
        <ul className={styles.menu}>
          {menuItems.map((item) => (
            <li 
              key={item.id}
              className={`${styles.menuItem} ${activeMenu === item.id ? styles.active : ''}`}
            >
              {item.icon}
              <Link to={item.path}>
                <span>{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
      
   {/*    <div className={styles.section}>
        <p className={styles.sectionTitle}>Settings</p>
        <ul className={styles.menu}>
          <li className={styles.menuItem}>
            <FaCog />
            <span>Log Out</span>
          </li>
        </ul>
      </div> */}
    </aside>
  )
}

export default SideBar