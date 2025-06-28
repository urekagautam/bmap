import Tag from "../../../component/Tag.jsx";
import styles from "./AboutTab.module.css";
import { IconOrganizationBuilding } from "../../../component/icons/IconOrganizationBuilding.jsx";
import { IconPeople } from "../../../component/icons/IconPeople.jsx";
import { IconLocationPinned } from "../../../component/icons/IconLocationPinned";
import { IconPhone } from "../../../component/icons/IconPhone.jsx";
import { IconEnvelope } from "../../../component/icons/IconEnvelope.jsx";
import { IconInstagram } from "../../../component/icons/IconInstagram.jsx";
import { IconFacebook } from "../../../component/icons/IconFacebook.jsx";
import { IconX } from "../../../component/icons/IconX.jsx";
import { SKILL_OPTIONS } from "../../../constants/constants.js"; 

export default function AboutTab({ setActiveTab, orgData, companyInfo }) {
  const companyName = companyInfo?.companyName || null;
  const industry = companyInfo?.industry || null;
  
  console.log("AboutTab - Company Info:", companyInfo);
  console.log("AboutTab - Raw orgData specialities:", orgData?.specialities);
  
  const employeeCount = companyInfo?.employeeCount || null;
  const address = companyInfo?.address || null;
  const phonenum = companyInfo?.phonenum || null;
  const email = companyInfo?.email || null;
  const socials = companyInfo?.socials || {};
  const description = companyInfo?.description || null;
  const district = companyInfo?.district || null;

  const getSpecialtyLabels = (specialties) => {
    if (!specialties || !Array.isArray(specialties)) {
      console.log("No specialties or not an array:", specialties);
      return [];
    }
    
    console.log("Processing specialties:", specialties);
    
    return specialties.map(specialty => {

      if (typeof specialty === "object" && specialty.label) {
        console.log("Specialty is already an object:", specialty);
        return specialty.label;
      }
      
      const found = SKILL_OPTIONS.find(option => option.value === specialty);
      const result = found ? found.label : specialty;
      
      console.log(`Mapping specialty "${specialty}" to "${result}"`);
      return result;
    });
  };

  const formatSocialUrl = (platform, username) => {
    if (!username || username.trim() === "") return null;
    
    const cleanUsername = username
      .replace(/^https?:\/\/(www\.)?/, '') 
      .replace(/^(instagram\.com\/|facebook\.com\/|twitter\.com\/|x\.com\/)/, '')
      .replace(/^@/, '')
      .trim();
    
    if (!cleanUsername) return null;
    
    switch (platform.toLowerCase()) {
      case 'instagram':
        return `https://instagram.com/${cleanUsername}`;
      case 'facebook':
        return `https://facebook.com/${cleanUsername}`;
      case 'x':
      case 'twitter':
        return `https://x.com/${cleanUsername}`;
      default:
        return `https://${cleanUsername}`;
    }
  };

  const formattedSocials = {
    instagram: formatSocialUrl('instagram', socials.instagram),
    facebook: formatSocialUrl('facebook', socials.facebook),
    x: formatSocialUrl('x', socials.x),
  };

  console.log("Original socials:", socials);
  console.log("Formatted socials:", formattedSocials);

  const aboutText = description
    ? description.split("\n").filter((paragraph) => paragraph.trim())
    : null;

  const specialityLabels = getSpecialtyLabels(orgData?.specialities || []);
  const specialtiesList = specialityLabels.length > 0 ? specialityLabels : null;

  console.log("Final specialty labels:", specialityLabels);

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
                specialtiesList.map((specialtyLabel, index) => (
                  <Tag key={index} data={specialtyLabel} />
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
            {industry && industry !== "Industry Not Specified" ? (
              <span>
                <IconOrganizationBuilding />
                {industry}
              </span>
            ) : null}

            {employeeCount && employeeCount !== "Not specified" ? (
              <span>
                <IconPeople />
                {employeeCount}
              </span>
            ) : null}

            {address && address !== "Address not specified" ? (
              <span className={styles.showLocation}>
                <span className={styles.locationDetails}>
                  <IconLocationPinned />
                  {district ? `${address}, ${district}` : address}
                </span>
              </span>
            ) : null}

            {phonenum && phonenum !== "Phone not specified" ? (
              <span>
                <IconPhone />
                {phonenum}
              </span>
            ) : null}

            {email && email !== "Email not specified" ? (
              <span>
                <IconEnvelope />
                {email}
              </span>
            ) : null}

            {(!industry || industry === "Not Specified") && 
             (!employeeCount || employeeCount === "Not specified") && 
             (!address || address === "Address not specified") && 
             (!phonenum || phonenum === "Phone not specified") && 
             (!email || email === "Email not specified") && (
              <p className={styles.noInfo}>No information available</p>
            )}
          </div>

          <div className={styles.socialInfo}>
            <h4>Social Media</h4>
            <div className={styles.socialsList}>
      
              {formattedSocials.instagram ? (
                <a
                  href={formattedSocials.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={`Visit our Instagram: ${socials.instagram}`}
                >
                  <IconInstagram platform="instagram" />
                </a>
              ) : null}

              {formattedSocials.facebook ? (
                <a
                  href={formattedSocials.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={`Visit our Facebook: ${socials.facebook}`}
                >
                  <IconFacebook platform="facebook" />
                </a>
              ) : null}

              {formattedSocials.x ? (
                <a 
                  href={formattedSocials.x} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  title={`Visit our X/Twitter: ${socials.x}`}
                >
                  <IconX platform="x" />
                </a>
              ) : null}

              {!formattedSocials.instagram && !formattedSocials.facebook && !formattedSocials.x && (
                <span className={styles.noInfo}>No information available</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}