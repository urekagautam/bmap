// import { useState, useEffect } from 'react'
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Test from "./pages/Test";
import HomePage from "./pages/user/HomePage";
import DashboardPage from "./pages/organization/DashboardPage";
import ProfilePage from "./pages/organization/ProfilePage";

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

          {/* USER ///MODIFY LATER WITH NAVBARS AND STUFF WRAPPING MAYBE*/}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/test" element={<Test />} />

          {/* ORGANIZATION */}
          <Route path="/org" element={<DashboardPage />} />
          <Route path="/orgprofile" element={<ProfilePage />} />

        </Routes>
      </BrowserRouter>
      {/* <p>Backend says: {message}</p> */}
    </>
  );
}

export default App;
