import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, useParams, Navigate } from 'react-router-dom';
import SignUp from './componenets/loginAndSignUp/SignUp';
import DashboardLayout from './componenets/Dashboard/DashboardLayout';
import Dashboard from './componenets/Dashboard/Dashboard';
import Patients from './componenets/Patients/Patients';
import Receptions from './componenets/OurDoctors';
import Doctors from './componenets/Doctors/Doctors';
import Appointments from './componenets/Appointment/Appointments';
import Payments from './componenets/invoice/Payments';
import Invoices from './componenets/invoice/Invoices';
import Services from './componenets/Services';
import Medicines from './componenets/Medicines';
import Branch from './componenets/Branch';
import Diagnosis from './componenets/Diagnosis';
import Visit from './componenets/Visit';
import PatientForm from './componenets/Patients/PatientForm';
import LoginForm from './componenets/loginAndSignUp/LoginForm';
import PatientDetails from './componenets/Patients/PatientDetails';
import { useToken } from './api/Token';
//import ClinicAndBranch from './componenets/Clinic/ClinicAndBranch';
import SuperAdmin from './componenets/loginAndSignUp/SuperAdmin';
import Clinic from './componenets/Clinic/Clinic';
import ShowOneClinic from './componenets/Clinic/ShowOneClinic';
import CustomizedSteppers from './componenets/Clinic/CustomizedSteppers';
import FetchEmailName from './componenets/User/FetchEmail';
import DoctorDetails from './componenets/Doctors/DoctorDetails';
import DoctorAppointment from './componenets/Doctors/DoctorAppointment/DoctorAppointment';

import DoctorPrescription from './componenets/Doctors/DoctorPrescription';
import UpdateAppointment from './componenets/Doctors/DoctorAppointment/UpdateAppointment';
import CreateAppointment from './componenets/Appointment/CreateAppointment';
import ScheduledAppointment from './componenets/Appointment/ScheduledAppointmant';
import Record from './componenets/Record';
import Profile from './tools/Profile';
import OurDoctors from './componenets/OurDoctors';
import WellNestDetail from './componenets/Dashboard/WellNestDetail';
import MedicationStackForm from './tools/MedicationStackForm';
import NewPage from './componenets/Dashboard/NewPage';
import ContactPage from './componenets/Dashboard/ContactPage';
import ClinicStaffDetails from './componenets/Clinic/ClinicStaffDetails';
import Portal from './SuperAdmin/Portal';
import DashboardSuperAdmin from './SuperAdmin/DashboardSuperAdmin';
import Frontdesk from './componenets/Front_desk/Frontdesk';
import RoleCreation from './componenets/Clinic/RoleCreation';
import AllUsers from './componenets/loginAndSignUp/AllUsers';
import PreAppointment from './componenets/Front_desk/PreAppointment';
import NewTabContent from './componenets/Appointment/NewTabContent';






// const PatientDetailsWrapper: React.FC = () => {
//   const { id } = useParams<{ id: string }>();
//   const { accessToken } = useToken();

//   if (!id || !accessToken) {
//     return <div>Error: Missing patient ID or access token</div>;
//   }

//   return <PatientDetails id={id} accessToken={accessToken} />;
// };

const App: React.FC = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
 

  const handleDialogOpen = () => {
    setIsDialogOpen(true);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
  };

  return (
    <Router>
      <div className={isDialogOpen ? "blurred" : "clear"}>
        <Routes>
          <Route path="/" element={<LoginForm />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/allUsers" element={<AllUsers />} />
          <Route path="/stepper" element={<CustomizedSteppers />} />
          <Route path="/showOneClinic" element={<ShowOneClinic open={true} onClose={handleDialogClose} />} />
          <Route path="/useremail" element={<FetchEmailName />} />
          <Route path="/dashboard/medications" element={<MedicationStackForm />} />
          <Route path="/portal" element={<Portal />} />
          <Route path="/roleCreation" element={<RoleCreation/>} />
          
          {/* <Route path="/dashboardSuperAdmin" element={<DashboardSuperAdmin />} /> */}
       
          {/* <Route path="users" element={<ManageUsers />} />
          <Route path="settings" element={<Settings />} /> */}

          
          <Route path="/clinic/:clinicId/staff" element={<ClinicStaffDetails />} />
          {/* <Route path="/showOneClinic/:clinicName" element={<ShowOneClinic />} /> */}
          {/* <Route path="/clinic" element={<Clinic />} />
          <Route path="/branch" element={<Branch />} /> */}
          {/* <Route path="/stepper" element={<CustomizedSteppers />} /> */}
          <Route path="/dashboard" element={<DashboardLayout />}>
          
            <Route index element={<Dashboard />} />
            <Route path="patients" element={<Patients />} />
            <Route path="ourdoctors" element={<OurDoctors />} />
            <Route path="doctors" element={<Doctors />} />
            <Route path="record" element={<Record />} />
            <Route path="appointments" element={<Appointments />} />
            <Route path="preAppointment" element={<PreAppointment />} />
            <Route path="create-appointment" element={<CreateAppointment />} />
            <Route path="frontdesk" element={<Frontdesk />} />
            <Route path="newPatient" element={<NewTabContent />} />
            {/* <Route path="payments" element={<Payments />} /> */}
            <Route path="invoices" element={<Invoices />} />
            <Route path="doctor-details/:id" element={<DoctorDetails />} />
            <Route path="services" element={<Services />} />
            <Route path="medicines" element={<Medicines />} />
            <Route path="scheduled-appointment" element={<ScheduledAppointment />} />
            
           
            
            {/* <Route path="clinic" element={<Clinic />} />
            <Route path="branch" element={<Branch />} /> */}
            <Route path="diagnosis" element={<Diagnosis />} />
            <Route path="visit" element={<Visit />} />
            <Route path="wellnest-detail" element={<WellNestDetail />} />
          </Route>
          {/* <Route path="/patients" element={<Patients />} /> */}
          <Route path="/patient-form" element={<PatientForm />} />
          <Route path="patient-details/:id" element={<PatientDetails />} />
          <Route path="/superadmin" element={<SuperAdmin />} />
          {/* <Route path="/clinic-and-branch" element={<ClinicAndBranch />} /> */}
        
          <Route path="/appointments/:id" element={<DoctorAppointment />} />
          <Route path="/updateappointment/:id" element={<UpdateAppointment />} />
          <Route path="/doctor-prescription/:patientId" element={<DoctorPrescription />} />
          {/* <Route path="/record" element={<Record />} /> */}
          <Route path="/payments/:patientId/:paymentStatus" element={<Payments />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/new-page" element={<NewPage />} /> 
          <Route path="/contact" element={<ContactPage />} />
         

           {/* Routes that require the Portal layout */}
           <Route path="/portal" element={<Portal />}>
          <Route index element={<Navigate to="/portal/dashboardSuperAdmin" />} />
          <Route path="dashboardSuperAdmin" element={<DashboardSuperAdmin />} />
          {/* <Route path="users" element={<Users />} />
          <Route path="settings" element={<Settings />} /> */}
        </Route>
        
        </Routes>
      </div>
    </Router>
  );
};

export default App;
