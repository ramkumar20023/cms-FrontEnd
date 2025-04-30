import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

// Authentication
import Login from './Authentication/login';
import Signup from './Authentication/Signup';

// Dashboard
import Dashboard from './Dashboard/Dashboard';


// Additional Features
import PrescriptionSearch from './Dashboard/PrescriptionSearch';
import GenerateBill from './Dashboard/GenerateBill';
import EditMedicines from './Dashboard/EditMedicines';
import ManageMedicine from './Dashboard/ManageMedicine';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Dashboard */}
        <Route path="/pharmdashboard" element={<Dashboard />} />

        {/* Extra */}
        <Route path="/prescriptions" element={<PrescriptionSearch />} />
        <Route path="/generate-bill" element={<GenerateBill />} />
        <Route path="/editmedicine" element={<EditMedicines />} />
        <Route path="/managemedicine" element={<ManageMedicine />} />
      </Routes>
    </Router>
  );
};

export default App;
