import { IconSearch } from "./icons/IconSearch.jsx"
import InputField from "./InputField.jsx"
import styles from "./SearchBar.module.css"
import { cns } from "../utils/classNames.js"

export default function SearchBar({ className="", layout = "lg"}) {
  return (
    <div className={cns(styles.mainWrapper, styles[layout])}>
      <InputField placeholder="Search Job tiltle, company" layout="fw" border="none" />
      <IconSearch />
    </div>
  )
}
