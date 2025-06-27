import React from "react";
import OrganizationNavbar from "../component/OrganizationNavbar";
import styles from "./testing.module.css";
import { 
  FaFileAlt, 
  FaBriefcase, 
  FaUserFriends, 
  FaCog 
} from "react-icons/fa";

import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import Button from "../component/Button";

function testing() {
  // Pie chart data - static for now, easy to replace with backend later
  const pieData = [
    { name: "Applied", value: 400 },
    { name: "Hired", value: 300 },
    { name: "Rejected", value: 100 },
    { name: "Shortlisted", value: 200 },
  ];

  const COLORS = ['#9D75F0', '#387ADF', '#F55050', '#E3D888'];

  return (
    <>
      <OrganizationNavbar />
      <div className={styles.wrapper}>
        <div className={styles.container}>

          {/* sideNavBar */}
          <aside className={styles.sidebar}>
            <h2 className={styles.heading}>Workspace</h2>

            <div className={styles.section}>
              <p className={styles.sectionTitle}>Dashboard</p>
              <ul className={styles.menu}>
                <li className={`${styles.menuItem} ${styles.active}`}>
                  <FaFileAlt />
                  <span>Overview</span>
                </li>
                <li className={styles.menuItem}>
                  <FaBriefcase />
                  <span>Open Positions</span>
                </li>
                <li className={styles.menuItem}>
                  <FaUserFriends />
                  <span>Applications</span>
                </li>
              </ul>
            </div>

            <div className={styles.section}>
              <p className={styles.sectionTitle}>Settings</p>
              <ul className={styles.menu}>
                <li className={styles.menuItem}>
                  <FaCog />
                  <span>Account Settings</span>
                </li>
              </ul>
            </div>
          </aside>

          {/* creating a center main container */}
          <div className={styles.dashboard}>
            {/* Heading Section */}
            <div className={styles.header}>
              <h1>TechCorp Inc.’s Dashboard</h1>
              <div className={styles.actions}>
                <Button fill="fill" layout="sm" color="neutral" className={styles.actionBtn}>Post a Job</Button>
                <Button fill="fill" layout="sm" color="primary" className={styles.actionBtn}>Enable Location</Button>
              </div>
            </div>

            {/* Stats Section */}
            <div className={styles.stats}>
              <div className={styles.statBox}>
                <div className={styles.insideStatBox}>
                  <p>Active Jobs</p>
                  <div className={styles.statIcon}>
                    <FaBriefcase />
                  </div>
                </div>
                <span>30</span>
              </div>

              <div className={styles.statBox}>
                <div className={styles.insideStatBox}>
                  <p>Total Applications</p>
                  <div className={styles.statIcon}>
                    <FaBriefcase />
                  </div>
                </div>
                <span>888</span>
              </div>

              <div className={styles.statBox}>
                <div className={styles.insideStatBox}>
                  <p>Hired</p>
                  <div className={styles.statIcon}>
                    <FaBriefcase />
                  </div>
                </div>
                <span>60</span>
              </div>

              <div className={styles.statBox}>
                <div className={styles.insideStatBox}>
                  <p>Shortlisted</p>
                  <div className={styles.statIcon}>
                    <FaBriefcase />
                  </div>
                </div>
                <span>60</span>
              </div>
            </div>

            {/* Main Content */}
            <div className={styles.content}>
              {/* Recent Applications Section */}
              <div className={styles.recentApps}>
                <h2>Recent Applications</h2>
                <p>See who applied most recently.</p>

                {/* Applicant 1 */}
                <div className={styles.card}>
                  <div className={styles.imageSection}>
                    <img src="/RandomImage.png" alt="Ureka Gautam" />
                  </div>
                  <div className={styles.userDetails}>
                    <strong>Ureka Gautam</strong>
                    <p>Applied for Senior Developer</p>
                  </div>
                  <div className={styles.meta}>
                    <span>30min ago</span>
                  </div>
                  <div className={styles.meta}>
                    <a href="#">View</a>
                  </div>
                </div>

                {/* Applicant 2 */}
                <div className={styles.card}>
                  <div className={styles.imageSection}>
                    <img src="/RandomImage.png" alt="Ravi Shrestha" />
                  </div>
                  <div className={styles.userDetails}>
                    <strong>Ravi Shrestha</strong>
                    <p>Applied for UI/UX Designer</p>
                  </div>
                  <div className={styles.meta}>
                    <span>1hr ago</span>
                  </div>
                  <div className={styles.meta}>
                    <a href="#">View</a>
                  </div>
                </div>

                {/* Applicant 3 */}
                <div className={styles.card}>
                  <div className={styles.imageSection}>
                    <img src="/RandomImage.png" alt="Sneha Karki" />
                  </div>
                  <div className={styles.userDetails}>
                    <strong>Sneha Karki</strong>
                    <p>Applied for Backend Developer</p>
                  </div>
                  <div className={styles.meta}>
                    <span>2hr ago</span>
                  </div>
                  <div className={styles.meta}>
                    <a href="#">View</a>
                  </div>
                </div>

                {/* Applicant 4 */}
                <div className={styles.card}>
                  <div className={styles.imageSection}>
                    <img src="/RandomImage.png" alt="Bikash Thapa" />
                  </div>
                  <div className={styles.userDetails}>
                    <strong>Bikash Thapa</strong>
                    <p>Applied for Project Manager</p>
                  </div>
                  <div className={styles.meta}>
                    <span>3hr ago</span>
                  </div>
                  <div className={styles.meta}>
                    <a href="#">View</a>
                  </div>
                </div>

                {/* Applicant 5 */}
                <div className={styles.card}>
                  <div className={styles.imageSection}>
                    <img src="/RandomImage.png" alt="Anisha Lama" />
                  </div>
                  <div className={styles.userDetails}>
                    <strong>Anisha Lama</strong>
                    <p>Applied for QA Engineer</p>
                  </div>
                  <div className={styles.meta}>
                    <span>4hr ago</span>
                  </div>
                  <div className={styles.meta}>
                    <a href="#">View</a>
                  </div>
                </div>

                {/* Applicant 6 */}
                <div className={styles.card}>
                  <div className={styles.imageSection}>
                    <img src="/RandomImage.png" alt="Niraj Tamang" />
                  </div>
                  <div className={styles.userDetails}>
                    <strong>Niraj Tamang</strong>
                    <p>Applied for DevOps Engineer</p>
                  </div>
                  <div className={styles.meta}>
                    <span>5hr ago</span>
                  </div>
                  <div className={styles.meta}>
                    <a href="#">View</a>
                  </div>
                </div>

                <Button layout="fw" fill="outline">View All Applications</Button>
              </div>


             {/* Job Performance Section with Pie Chart */}
            <div className={styles.jobPerformance}>
              <div className={styles.pieChartSection}>
                <div className={styles.pieChartHeader}>
                  <h2>Job Performance</h2>
                  <p>Track and evaluate job effectiveness.</p>
                </div>
                {/* Recharts Pie Chart - Updated to remove inner labels */}
                <PieChart width={400} height={350}>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={80}
                    outerRadius={140}
                    paddingAngle={1}
                    dataKey="value"
                    label={false}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  
                </PieChart>
              </div>

              {/* Legend - Keep this as is */}
              <div className={styles.legend}>
                <div><span style={{ background: '#9D75F0' }}></span> Applied</div>
                <div><span style={{ background: '#387ADF' }}></span> Hired</div>
                <div><span style={{ background: '#F55050' }}></span> Rejected</div>
                <div><span style={{ background: '#E3D888' }}></span> Shortlisted</div>
              </div>
            </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}

export default testing;
