import { cns } from "../utils/classNames.js";
import styles from "./InputField.module.css";

export default function InputField({
  className = "",
  layout = "md",
  border,
  error,
  ...props
}) {
  return (
    <div className={styles.inpContainerwrapper}>
    <div className={styles.inputContainer}>
      <input
        type="text"
        placeholder=""
        className={cns(
          styles.input,
          styles[layout],
          styles[border],
          className,
          error ? styles.error : ""
        )}
        {...props}
      />
    </div>
      {error && (
        <span className={styles.errorMessage}>
            {error}
        </span>
    )}
    </div>
  );
}
