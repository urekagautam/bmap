
import OrganizationNavbar from "../../component/OrganizationNavbar";
import styles from './OrganizationDashboard.module.css'
import useOrgAuth from "../../hooks/useOrgAuth.js"

export default function OrganizationDashboard() {
     const { orgId } = useOrgAuth()
  return (


    <>
      <OrganizationNavbar />

        {/* TRYYY IMAGE UPLOAD */}
    {/*   <label className={styles.UploadPan} htmlFor="pan">
        Upload File
      <input 
      type="file" 
      id="pan" 
      accept="image/*"
      onChange={(e) => setImgFiles(e.target.files)}
      className={styles.pan}/>
      </label> */}

      <section className={styles.mainWrapper}>
         idd : {orgId}
      </section>
    </>
  )
}
