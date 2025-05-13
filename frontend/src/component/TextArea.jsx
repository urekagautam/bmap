import styles from "./TextArea.module.css";

export default function TextArea({
  className = "",
  rows = 4,
  ...props
}) {
  return (
    <div className={styles.textAreaContainer}>
    <textarea
      rows={rows}
      className={styles.textArea}
      {...props} 
    />
    </div>
  );
}