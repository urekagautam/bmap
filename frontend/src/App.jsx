// import { useState, useEffect } from 'react'
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Test from "./pages/Test";
import HomePage from "./pages/user/HomePage";
import DashboardPage from "./pages/organization/DashboardPage";
import ProfilePage from "./pages/organization/ProfilePage";
import NotFound from "./pages/NotFound";
import CompanyProfileView from "./pages/organization/CompanyProfileView";
import JobPosting from "./pages/organization/JobPosting";
import Search from "./features/User/Search/Search";

function App() {


  return (
    <>
      <BrowserRouter>
        <Routes>

          {/* USER ///MODIFY LATER WITH NAVBARS AND STUFF WRAPPING MAYBE*/}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/search" element={<Search/>}/>
          <Route path="/test" element={<Test />} />

          {/* ORGANIZATION */}
          <Route path="/org" element={<DashboardPage />} />
          <Route path="/orgprofile" element={<ProfilePage />} />
          <Route path="/cmpprofile" element={<CompanyProfileView />} />
          <Route path="/postjob" element={<JobPosting />} />

          {/* NOT FOUND */}
          <Route path="*" element={<NotFound />} />

        </Routes>
      </BrowserRouter>
      {/* <p>Backend says: {message}</p> */}
    </>
  );
}

export default App;