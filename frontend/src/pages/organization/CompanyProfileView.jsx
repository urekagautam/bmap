import CompanyProfile from "../../features/Organization/CompanyProfile";
import CToaster from "../../component/Toaster.jsx";
import CompanyProfileViewDetails from "../../features/User/CompanyProfileViewDetails.jsx";


export default function CompanyProfileView() {
  return (
    <>
      <CToaster />
      <CompanyProfileViewDetails />
    </>
  );
}
