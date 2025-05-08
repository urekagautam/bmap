import { useState, useRef, useEffect } from "react";
import styles from "./Select.module.css";
import { IconDownArrow } from "../component/icons/IconDownArrow.jsx";
import { cns } from "../utils/classNames";

export default function MultiSelect({
  options = [],
  placeholder = "Select options",
  onChange = () => {},
  defaultValues = [],
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState(defaultValues || []);
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

  useEffect(() => {
    setSelectedOptions(defaultValues);
  }, [defaultValues]);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleOptionClick = (option) => {
    let newSelectedOptions;

    if (selectedOptions.some((item) => item.value === option.value)) {
      newSelectedOptions = selectedOptions.filter(
        (item) => item.value !== option.value
      );
    } else {
      newSelectedOptions = [...selectedOptions, option];
    }

    setSelectedOptions(newSelectedOptions);
    onChange(newSelectedOptions);
  };

  const isOptionSelected = (option) => {
    return selectedOptions.some((item) => item.value === option.value);
  };

  return (
    <div className={styles.selectContainer} ref={selectRef}>
      <div
        className={cns(styles.selectHeader, isOpen && styles.focused)}
        onClick={toggleDropdown}
      >
        <div className={styles.selectedValue}>
          {selectedOptions.length === 0 ? (
            <span className={styles.placeholder}>{placeholder}</span>
          ) : selectedOptions.length === 1 ? (
            selectedOptions[0].label
          ) : (
            `${selectedOptions.length} items selected`
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
                isOptionSelected(option) ? styles.selected : ""
              )}
              onClick={() => handleOptionClick(option)}
            >
              <span className={styles.optionLabel}>{option.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
