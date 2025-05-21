import { cns } from '../utils/classNames'
import styles from './Tag.module.css'

export default function Tag({data, icon=null, layout="default"}) {
 
  return (
    <div className={cns(styles.tagWrapper, styles[layout])}>
      {icon}
      <h2>{data}</h2>
    </div>
  )
}
