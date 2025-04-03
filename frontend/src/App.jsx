import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [message, setMessage] = useState('')

  useEffect(()=>{
    fetch('http://localhost:5000/')
    .then((res)=>res.text())
    .then((data)=>setMessage(data))
    .catch((err)=>console.error('Error fetching data', err));
  },[]);

  return (
    <>
    <h2>BMAP, 6th Sem!</h2>
    <p>Backend says: {message}</p>
    </>
  )
}

export default App
