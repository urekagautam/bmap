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
    <div className={cns(styles.inputContainer, styles[layout])}> 
      <input
        type="text"
        placeholder=""
        className={cns(
          styles.input,
          className,
          error ? styles.error : "",
          styles[border]
        )}
        {...props}
      />
    </div>
  );
}
