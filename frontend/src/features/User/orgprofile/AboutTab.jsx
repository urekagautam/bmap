import Tag from "../../../component/Tag.jsx";
import styles from "../../Organization/profile/AboutTab.module.css";
import { IconOrganizationBuilding } from "../../../component/icons/IconOrganizationBuilding.jsx";
import { IconPeople } from "../../../component/icons/IconPeople.jsx";
import { IconLocationPinned } from "../../../component/icons/IconLocationPinned";
import { IconPhone } from "../../../component/icons/IconPhone.jsx";
import { IconEnvelope } from "../../../component/icons/IconEnvelope.jsx";
import { IconInstagram } from "../../../component/icons/IconInstagram.jsx";
import { IconFacebook } from "../../../component/icons/IconFacebook.jsx";
import { IconX } from "../../../component/icons/IconX.jsx";

export default function AboutTab({ setActiveTab, orgData, companyInfo }) {
  const companyName = companyInfo?.companyName || null;
  const industry = companyInfo?.industry || null;
  console.log(companyInfo);
  const employeeCount = companyInfo?.employeeCount || null;
  const address = companyInfo?.address || null;
  const phonenum = companyInfo?.phonenum || null;
  const email = companyInfo?.email || null;
  const socials = companyInfo?.socials || {};
  const description = companyInfo?.description || null;
  const specialities = companyInfo?.specialities || null;
  const district = companyInfo?.district || null;

  const aboutText = description
    ? description.split("\n").filter((paragraph) => paragraph.trim())
    : null;

  const specialtiesList =
    specialities && Array.isArray(specialities) && specialities.length > 0
      ? specialities
      : null;

  const benefitsList =
    orgData?.benefits &&
    Array.isArray(orgData.benefits) &&
    orgData.benefits.length > 0
      ? orgData.benefits
      : null;

  const middleIndex = benefitsList ? Math.ceil(benefitsList.length / 2) : 0;
  const benefitsLeft = benefitsList ? benefitsList.slice(0, middleIndex) : [];
  const benefitsRight = benefitsList ? benefitsList.slice(middleIndex) : [];

  return (
    <div className={styles.aboutContent}>
      <div className={styles.aboutAndBenefits}>
        <div className={styles.introSection}>
          <h2>About {companyName || "Company"}</h2>

          <div className={styles.aboutText}>
            {aboutText && aboutText.length > 0 ? (
              aboutText.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))
            ) : (
              <p className={styles.noInfo}>No information available</p>
            )}
          </div>

          <div className={styles.specialitySection}>
            <h3>Specialties</h3>
            <div className={styles.specialties}>
              {specialtiesList ? (
                specialtiesList.map((specialty, index) => (
                  <Tag key={index} data={specialty} />
                ))
              ) : (
                <p className={styles.noInfo}>No information available</p>
              )}
            </div>
          </div>
        </div>

        <div className={styles.benefitsSection}>
          <h2>Benefits & Perks</h2>
          {benefitsList && benefitsList.length > 0 ? (
            <div className={styles.benefitsContainer}>
              <ul className={styles.benefitsList}>
                {benefitsLeft.map((benefit, index) => (
                  <li key={index} className={styles.benefitItem}>
                    {benefit}
                  </li>
                ))}
              </ul>
              {benefitsRight.length > 0 && (
                <ul className={styles.benefitsList}>
                  {benefitsRight.map((benefit, index) => (
                    <li key={index} className={styles.benefitItem}>
                      {benefit}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ) : (
            <div className={styles.noBenefits}>
              <p className={styles.noInfo}>No information available</p>
            </div>
          )}
        </div>
      </div>

      <div className={styles.infoAndHiring}>
        <div className={styles.companyOtherInfo}>
          <h2>Company Information</h2>
          <div className={styles.infoList}>
            {industry ? (
              <span>
                <IconOrganizationBuilding />
                {industry}
              </span>
            ) : null}

            {employeeCount ? (
              <span>
                <IconPeople />
                {employeeCount}
              </span>
            ) : null}

            {address ? (
              <span className={styles.showLocation}>
                <span className={styles.locationDetails}>
                  <IconLocationPinned />
                  {district ? `${address}, ${district}` : address}
                </span>
              </span>
            ) : null}

            {phonenum ? (
              <span>
                <IconPhone />
                {phonenum}
              </span>
            ) : null}

            {email ? (
              <span>
                <IconEnvelope />
                {email}
              </span>
            ) : null}

            {!industry && !employeeCount && !address && !phonenum && !email && (
              <p className={styles.noInfo}>No information available</p>
            )}
          </div>

          <div className={styles.socialInfo}>
            <h4>Social Media</h4>
            <div className={styles.socialsList}>
              {socials.instagram ? (
                <a
                  href={socials.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <IconInstagram platform="instagram" />
                </a>
              ) : null}

              {socials.facebook ? (
                <a
                  href={socials.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <IconFacebook platform="facebook" />
                </a>
              ) : null}

              {socials.x ? (
                <a href={socials.x} target="_blank" rel="noopener noreferrer">
                  <IconX platform="x" />
                </a>
              ) : null}

              {!socials.instagram && !socials.facebook && !socials.x && (
                <span className={styles.noInfo}>No information available</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
