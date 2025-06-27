
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import Button from "../../component/Button"
import { IconBag } from "../../component/icons/IconBag"
import { IconOrganizationBuilding } from "../../component/icons/IconOrganizationBuilding"
import styles from "./JoinAsDetails.module.css"

export default function JoinAsDetails() {
  const [selectedRole, setSelectedRole] = useState("")
  const navigate = useNavigate()

  const handleRoleSelect = (role) => {
    setSelectedRole(role)
  }

  const handleContinue = () => {
    if (!selectedRole) {
      alert("Please select a role to continue")
      return
    }

    if (selectedRole === "employer") {
      navigate("/org/signup")
    } else if (selectedRole === "jobseeker") {
      navigate("/signup")
    }
  }

  return (
    <section className={styles.mainWrapper}>
      <div className={styles.centralWrapper}>
        <div className={styles.title}>
          <h1>Create An Account</h1>
          <p>Tell us who you are : an Employer or a Job Seeker ?</p>
        </div>

        <div className={styles.roleWrapper}>
          <div
            className={`${styles.roles} ${selectedRole === "employer" ? styles.selected : ""}`}
            onClick={() => handleRoleSelect("employer")}
          >
            <div className={styles.icon}>
              <IconOrganizationBuilding />
            </div>
            <div className={styles.roleTitle}>
              <h2>Employer</h2>
              <p>Post Jobs & find right applicants.</p>
            </div>
          </div>

          <div
            className={`${styles.roles} ${selectedRole === "jobseeker" ? styles.selected : ""}`}
            onClick={() => handleRoleSelect("jobseeker")}
          >
            <div className={styles.icon}>
              <IconBag />
            </div>
            <div className={styles.roleTitle}>
              <h2>Job Seeker</h2>
              <p>Discover right job opportunities for you.</p>
            </div>
          </div>
        </div>

        <div className={styles.buttonWrapper}>
          <Button color="neutral" layout="xs" onClick={handleContinue} disabled={!selectedRole}>
            Continue
          </Button>
        </div>
      </div>
    </section>
  )
}
