import { useEffect } from "react";
import styles from "./CheckboxGroup.module.css";
import { cns } from "../utils/classNames";
import { IconCheckboxChecked } from "./icons/IconCheckboxChecked";
import { IconCheckboxUnchecked } from "./icons/IconCheckboxUnchecked";

export default function CheckboxGroup({
  options = [],
  name = "checkboxGroup",
  selectedValues = [], 
  onChange = () => {},  
}) {

  const handleChange = (value) => {
    let newSelectedValues = [...selectedValues];

    if (selectedValues.includes(value)) {
      // Removing value that is already selected for check uncheck purpose
      newSelectedValues = newSelectedValues.filter((val) => val !== value);
    } else {
      newSelectedValues.push(value);
    }
    onChange(newSelectedValues); 
  };

  const isChecked = (value) => {
    return selectedValues.includes(value); 
  };

  return (
      <div className={styles.optionsContainer}>
        {options.map((option) => (
          <label key={option.value} className={styles.checkboxLabel}>
            <div className={styles.checkboxWrapper}>
              <input
                type="checkbox"
                name={`${name}[${option.value}]`}
                value={option.value}
                checked={isChecked(option.value)}  
                onChange={() => handleChange(option.value)}  
                className={styles.checkboxInput}
              />
              <div className={styles.checkboxCustom}>
                {isChecked(option.value) ? (
                  <IconCheckboxChecked className={styles.checkedIcon} />
                ) : (
                  <IconCheckboxUnchecked className={styles.uncheckedIcon} />
                )}
              </div>
            </div>
            <span className={cns(styles.labelText, isChecked(option.value) ? styles.checkedlabel : "")}>
              {option.label}
            </span>
          </label>
        ))}
      </div>
  );
}
