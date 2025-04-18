import React from 'react'
import VacancyCard from '../component/VacancyCard'
import styles from './Test.module.css'
import SearchBar from '../component/SearchBar'

export default function Test() {
  return (
    <div className={styles.abc}>
   {/*    <VacancyCard 
        deadline="1 week, 3 days from today"
        views="500"
        vacancyTitle="Primary Level Teacher"
        vacancyCompany="Gita Mata School"
        skills={["Communication", "Motivation", "Supervision"]}
      /> */}

      <SearchBar />
    </div>
  )
}