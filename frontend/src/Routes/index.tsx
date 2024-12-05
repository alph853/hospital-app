import {
    BrowserRouter as Router,
    Routes,
    Route,
  } from "react-router-dom"
  import LoginPage from "@/pages/Login";
  import Dashboard from "@/pages/Dashboard";
  import SearchDoctorPage from "@/pages/Doctor/SearchDoctor";
  import ViewDoctorPage from "@/pages/Doctor/ViewDoctor";
  import SearchPatientPage from "@/pages/Patient/SearchPatient";
  import ViewPatientPage from "@/pages/Patient/ViewPatient";
  import AddPatient from "@/pages/Patient/AddPatient";
  import AddExamination from "@/pages/Patient/AddExamination";
  import AddAdmission from "@/pages/Patient/AddAdmission";
  import Layout from "@/components/Layout";
  import App from "@/App";
  import { Navigate } from "react-router-dom";
  function MyRouter() {
    return (
      <Router>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="dashboard" element={<Layout><Dashboard/></Layout>} />

          <Route path="doctor" element={<Layout><SearchDoctorPage /></Layout>} />
          <Route path="doctor/:doctorId" element={<Layout><ViewDoctorPage /></Layout>} />

          <Route path="patient" element={<Layout><SearchPatientPage /></Layout>} />
          <Route path="patient/add" element={<Layout><AddPatient /></Layout>} />
          <Route path="patient/:patientId/add/admission" element={<Layout><AddAdmission/></Layout>} />
          <Route path="patient/:patientId/add/examination" element={<Layout><AddExamination/></Layout>} />
          <Route path="patient/:patientId" element={<Layout><ViewPatientPage /></Layout>} />

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    );
  }
  
  export default MyRouter;