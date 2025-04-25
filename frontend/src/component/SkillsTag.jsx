import styles from './SkillsTag.module.css'

export default function SkillsTag({skill}) {
 
  return (
    <div className={styles.skillsTagWrapper}>
      <h2>{skill}</h2>
    </div>
  )
}
