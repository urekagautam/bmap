import styles from './Tag.module.css'

export default function Tag({skill}) {
 
  return (
    <div className={styles.tagWrapper}>
      <h2>{skill}</h2>
    </div>
  )
}
