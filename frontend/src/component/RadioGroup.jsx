import styles from "./RadioGroup.module.css";
import { IconRadioChecked } from "./icons/IconRadioChecked";
import { IconRadioUnchecked } from "./icons/IconRadioUnchecked";
import { cns } from "../utils/classNames";

export default function RadioGroup({
  options = [],
  name = "radioGroup",
  selectedValue = null,    
  onChange = () => {},
}) {
  
  const isChecked = (value) => {
    return selectedValue === value;
  };

  const handleChange = (value) => {
    onChange(value);
  };

  return (
    <div className={styles.optionsContainer}>
      {options.map((option) => (
        <label key={option.value} className={styles.radioLabel}>
          <div className={styles.radioWrapper}>
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={selectedValue === option.value}
              onChange={() => handleChange(option.value)}
              className={styles.radioInput}
            />
            <div className={styles.radioCustom}>
              {isChecked(option.value) ? (
                <IconRadioChecked className={styles.checkedIcon} />
              ) : (
                <IconRadioUnchecked className={styles.uncheckedIcon} />
              )}
            </div>
          </div>
          <span className={cns(styles.labelText, isChecked(option.value) ? styles.checkedlabel : "")}>{option.label}</span>
        </label>
      ))}
    </div>
  );
}