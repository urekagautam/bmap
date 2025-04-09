// import { useState, useEffect } from 'react'
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Test from "./pages/Test";

function App() {
  /*   const [message, setMessage] = useState('')

  useEffect(()=>{
    fetch('http://localhost:5000/')
    .then((res)=>res.text())
    .then((data)=>setMessage(data))
    .catch((err)=>console.error('Error fetching data', err));
  },[]); */

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/test" element={<Test />} />
        </Routes>
      </BrowserRouter>
      {/* <p>Backend says: {message}</p> */}
    </>
  );
}

export default App;
