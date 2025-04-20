import { cns } from "../utils/classNames";
import styles from "./Button.module.css";

export default function Button({
  className = "",
  layout = "md",
  fill = "fill",
  color = "primary",
  children,
  ...props
}) {
  return (
    <button
      className={cns(
        styles.btn,
        styles[layout],
        styles[color],
        styles[fill],
        className
      )}
      {...props}
    >
      <div className={styles.inline}>
        {children}
      </div>
    </button>
  );
}
