
import Tag from "../component/Tag.jsx";
import styles from "./Test.module.css";
import {IconEyeOpen} from "../component/icons/IconEyeOpen.jsx"
import {IconBills} from "../component/icons/IconBills.jsx"


export default function Test() {
  return (
    <div className={styles.wrapper}>
    <Tag icon= {<IconBills />} data="skill" layout="green"/>
    <Tag icon= {<IconEyeOpen />} data="skill" layout="blue"/>
    <Tag  data="skill" />
    </div>
  );
}
