import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { IconSearch } from "./icons/IconSearch.jsx";
import InputField from "./InputField.jsx";
import styles from "./SearchBar.module.css";
import { cns } from "../utils/classNames.js";

export default function SearchBar({ className = "", layout = "lg" }) {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = () => {
    const trimmedQuery = query.trim();
    if (trimmedQuery) {
      navigate(`/search?q=${encodeURIComponent(trimmedQuery)}`);
      setQuery(""); // optional: clear input after search
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className={cns(styles.mainWrapper, styles[layout], className)}>
      <div className={styles.searchWrapper}>
        <InputField
          placeholder="Search Job title, company"
          layout="fw"
          border="none"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
        />
      </div>
      <IconSearch className={styles.icon} onClick={handleSearch} />
    </div>
  );
}
