import { IconSwitchOn } from "../component/icons/IconSwitchOn";
import { IconSwitchOff } from "../component/icons/IconSwitchOff";
import styles from "./ToggleSwitch.module.css";
import { cns } from "../utils/classNames";

export default function ToggleSwitch({ isOn, onToggle, name, className = "", ...props }) {
  return (
    <button
    type="button"
      className={cns(styles.ToggleContainer, isOn ? styles.on : styles.off, className)}
      onClick={() => onToggle(name, !isOn)}
      {...props}
    >
      {isOn ? <IconSwitchOn className={styles.onSvg} /> : <IconSwitchOff className={styles.offSvg} />}
    </button>
  );
}