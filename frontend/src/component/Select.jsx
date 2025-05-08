import React, { useState, useRef, useEffect } from "react";
import styles from "./Select.module.css";
import { IconDownArrow } from "../component/icons/IconDownArrow.jsx";
import { cns } from "../utils/classNames.js";

export default function Select({
  options = [],
  placeholder = "Select an option",
  onChange = () => {},
  defaultValue = null,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(defaultValue);
  const selectRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectRef.current && !selectRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleOptionClick = (option) => {
    setSelectedOption(option);
    setIsOpen(false);
    onChange(option);
  };

  return (
    <div className={styles.selectContainer} ref={selectRef}>
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
          {options.map((option) => (
            <div
              key={option.value}
              className={cns(
                styles.option,
                selectedOption && selectedOption.value === option.value
                  ? styles.selected
                  : ""
              )}
              onClick={() => handleOptionClick(option)}
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
