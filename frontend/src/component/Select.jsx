import React, { useState, useRef, useEffect } from "react";
import styles from "./Select.module.css";
import { IconDownArrow } from "../component/icons/IconDownArrow.jsx";
import { cns } from "../utils/classNames.js";
import InputField from "./InputField.jsx";

export default function Select({
  options = [],
  placeholder = "Select an option",
  onChange = () => {},
  defaultValue = null,
  layout = "md",
  searchable = true, 
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(defaultValue);
  const [searchQuery, setSearchQuery] = useState("");
  const selectRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectRef.current && !selectRef.current.contains(event.target)) {
        setIsOpen(false);
        setSearchQuery("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleDropdown = () => {
    setIsOpen((prev) => {
      const newState = !prev;
      if (!newState) setSearchQuery("");
      return newState;
    });
  };

  const handleOptionClick = (option) => {
    setSelectedOption(option);
    setIsOpen(false);
    setSearchQuery("");
    onChange(option);
  };

  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={cns(styles.selectContainer, styles[layout])} ref={selectRef}>
      <div
        className={cns(styles.selectHeader, isOpen && styles.focused)}
        onClick={toggleDropdown}
      >
        <div className={styles.selectedValue}>
          {selectedOption ? (
            selectedOption.label
          ) : (
            <span className={styles.placeholder}>{placeholder}</span>
          )}
        </div>

        <div className={cns(styles.arrow, isOpen ? styles.up : styles.down)}>
          <IconDownArrow />
        </div>
      </div>

      {isOpen && (
        <div className={styles.optionsContainer}>
          {/* ✅ Conditionally render search input */}
          {searchable && (
            <InputField
              layout="fw"
              border="none"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={styles.searchInput}
            />
          )}

          <div className={styles.optionsList}>
            {(searchable ? filteredOptions : options).length > 0 ? (
              (searchable ? filteredOptions : options).map((option) => (
                <div
                  key={option.value}
                  className={cns(
                    styles.option,
                    selectedOption?.value === option.value ? styles.selected : ""
                  )}
                  onClick={() => handleOptionClick(option)}
                >
                  {option.label}
                </div>
              ))
            ) : (
              <div className={styles.noOptions}>No options found</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

