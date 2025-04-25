import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';


import Dashboard from './dashboard/Dashboard';
import Login from './Authentication/Login';
import Signup from './Authentication/Signup';


// Patients
import AddPatient from './dashboard/patients/AddPatient';
import EditPatient from './dashboard/patients/EditPatient';
import PatientList from './dashboard/patients/PatientList';
import DeletePatient from './dashboard/patients/DeletePatient';
import PatientDetail from './dashboard/patients/PatientDetail';

// Appointments
import AddAppointment from './dashboard/appointments/AddAppointment';
import EditAppointment from './dashboard/appointments/EditAppointment';
import AppointmentList from './dashboard/appointments/AppointmentList';
import DeleteAppointment from './dashboard/appointments/DeleteAppointment';

// Bills
import AddAppointmentBill from './dashboard/bills/AddAppointmentBill';
import EditAppointmentBill from './dashboard/bills/EditAppointmentBill';
import BillingList from './dashboard/bills/BillingList';
import DeleteAppointmentBill from './dashboard/bills/DeleteAppointmentBill';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Dashboard route */}
        <Route path="/dashboard" element={<Dashboard />} />

        {/* Separate routes for AddPatient, EditPatient, etc. */}
        <Route path="/patients/add" element={<AddPatient />} />
        <Route path="/patients/edit/:id" element={<EditPatient />} />
        <Route path="/patients/delete/:id" element={<DeletePatient />} />
        <Route path="/patients" element={<PatientList />} />
        <Route path="/patients/view/:id" element={<PatientDetail />} />




        <Route path="/addappointments" element={<AddAppointment />} />
        <Route path="/appointments/edit/:appointmentId" element={<EditAppointment />} />
        <Route path="/appointments/delete/:id" element={<DeleteAppointment />} />
        <Route path="/appointments" element={<AppointmentList />} />

        <Route path="/billsadd" element={<AddAppointmentBill />} />
        <Route path="/bills/edit/:id" element={<EditAppointmentBill />} />
        <Route path="/bills/delete/:id" element={<DeleteAppointmentBill />} />
        <Route path="/bills" element={<BillingList />} />
      </Routes>
    </Router>
  );
};

export default App;
