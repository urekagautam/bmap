import React from 'react'
import InputField from '../component/InputField'
import styles from './Test.module.css'
import { IconEyeOpen } from '../component/icons/IconEyeOpen'
import { IconEyeClosed } from '../component/icons/IconEyeClosed'
import PasswordField from '../component/PasswordField'
import Button from '../component/Button'

export default function Test() {
  return (
    <div className={styles.abc}>
      <InputField />
      <h3>MEOW</h3>
      <IconEyeOpen className={styles.icon} />
      <IconEyeClosed className={styles.icon} />
      <PasswordField />
      <Button layout='lg' color='neutral' >SEND</Button>
    </div>

  )
}
