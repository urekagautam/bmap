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
import OrganizationSignup from "./pages/organization/OrganizationSignup";
import JobDescription from "./pages/organization/JobDescription";
import JobApplication from "./pages/user/JobApplication";
import UserProfile from "./pages/user/UserProfile";
import UpdateJob from "./pages/organization/UpdateJob";
import Testing from "./pages/testing";
import JoinAs from "./pages/JoinAs";
import OrganizationLogin from "./pages/organization/OrganizationLogin";
import JobDescriptionView from "./pages/user/JobDescriptionView";
import CompanyProfile from "./features/Organization/CompanyProfile";

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>

          {/* USER ///MODIFY LATER WITH NAVBARS AND STUFF WRAPPING MAYBE*/}
          <Route path="/bmap" element={<JoinAs />} />

          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/search" element={<Search/>}/>
          <Route path="/userprofile" element={<UserProfile />} />
          <Route path="/test" element={<Test />} />
         <Route path="/testing" element={<Testing />} />
          <Route path="/jobapplication/:id" element={<JobApplication />} />
    
            <Route path="/view-orgprofile/:id" element={<CompanyProfileView />} />
           <Route path="/view-jobdescription/:id" element={<JobDescriptionView />} />
        
          {/* ORGANIZATION */}
          <Route path="/org" element={<DashboardPage />} />
          <Route path="/org/signup" element={<OrganizationSignup />} />
          <Route path="/org/login" element={<OrganizationLogin />} />
          <Route path="/orgprofile" element={<ProfilePage />} />
          <Route path="/updatevacancy/:id" element={<UpdateJob />} />
              <Route path="/cmpprofile/:id" element={<CompanyProfile/>} />
        
          {/* <Route path="/cmpprofile" element={<CompanyProfileView />} /> */}
          <Route path="/postjob" element={<JobPosting />} />
          <Route path="/jobdescription/:id" element={<JobDescription />} />
        
          {/* NOT FOUND */}
          <Route path="*" element={<NotFound />} />

        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;