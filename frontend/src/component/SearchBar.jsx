import { IconSearch } from "./icons/IconSearch.jsx";
// import InputField from "./InputField.jsx";
import styles from "./SearchBar.module.css";
import { cns } from "../utils/classNames.js";
import InputField from "./InputField.jsx";

export default function SearchBar({
  className = "",
  layout = "lg",
  value,
  onChange,
  onKeyDown,
  onSearchClick,
}) {
  return (
    <div className={cns(styles.mainWrapper, styles[layout], className)}>
      <div className={styles.searchWrapper}>
        <InputField
          placeholder="Search Job title, company"
          layout="fw"
          border="none"
          value={value}
          onChange={onChange}
          onKeyDown={onKeyDown}
        />
      </div>
      <IconSearch className={styles.icon} onClick={onSearchClick} />
    </div>
  );
}
