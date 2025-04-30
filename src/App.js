import React from "react";
import { Route, Routes } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Signup from "./Authentication/signup";
import Login from "./Authentication/login";
import Dashboard from "./Dashboard/dashboard";
import Adddoctor from "./Dashboard/Doctor";
import ViewDoctor from "./Dashboard/viewDoctor";
import EditDoctor from "./Dashboard/EditDoctor";
import Addstaff from "./Dashboard/staffAdd";
import StaffEdit from "./Dashboard/Editstaff";
import StaffView from "./Dashboard/viewStaff";
import AddLabEquipment from "./Dashboard/Addlab";
import ViewlabEquipment from "./Dashboard/ViewEquipment";
import EditLabEquipment from "./Dashboard/EditEquipment";
import AddMedicine from "./Dashboard/Addmedicine";
import ViewMedicine from "./Dashboard/Viewmedicine";
import EditMedicine from "./Dashboard/Editmedicines";
import DoctorDashboard from "./Doctor/doctorDashboard";
import AddInformDoctor from "./Doctor/DoctorProfile";
import PrivateRoute from "./Authentication/privateRouter";
import ViewInfoDoctor from "./Doctor/Viewinfo";
import EditInfoDoctor from "./Doctor/EditDoctorInfo";
import AddPrescription from "./Doctor/PrescriptionAdd";
import PrescriptionView from "./Doctor/Viewprescription";
import EditPrescription from "./Doctor/EditPrescription";
import EditConsultation from "./Doctor/EditConsultation";
import AddConsultation from "./Doctor/AddConsultation";
import ViewConsultation from "./Doctor/viewConsultation";
import CreateLabReport from "./Doctor/TestReportAdd";
import ViewLabReport from "./Doctor/viewLabReport";
import ViewPatientHistory from "./Doctor/viewhistory";
import AddPatientHistory from "./Doctor/Addhistory";
import EditPatientHistory from "./Doctor/EditHistory";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route
        path="/Unauthorized"
        element={
          <h3 className="text-danger text-center mt-5">Access Denied</h3>
        }
      />

      <Route
        path="/dashboard"
        element={
          <PrivateRoute allowedRoles={["Admin"]}>
            <Dashboard />
          </PrivateRoute>
        }
      />

      <Route
        path="/Adddoctor"
        element={
          <PrivateRoute allowedRoles={["Admin"]}>
            <Adddoctor />
          </PrivateRoute>
        }
      />
      <Route
        path="/Viewdoctor"
        element={
          <PrivateRoute allowedRoles={["Admin"]}>
            <ViewDoctor />
          </PrivateRoute>
        }
      />
      <Route
        path="/EditDoctor/:Doctorid"
        element={
          <PrivateRoute allowedRoles={["Admin"]}>
            <EditDoctor />
          </PrivateRoute>
        }
      />

      <Route
        path="/AddStaff"
        element={
          <PrivateRoute allowedRoles={["Admin"]}>
            <Addstaff />
          </PrivateRoute>
        }
      />
      <Route
        path="/ViewStaff"
        element={
          <PrivateRoute allowedRoles={["Admin"]}>
            <StaffView />
          </PrivateRoute>
        }
      />
      <Route
        path="/EditStaff/:Staffid"
        element={
          <PrivateRoute allowedRoles={["Admin"]}>
            <StaffEdit />
          </PrivateRoute>
        }
      />

      <Route
        path="/AddLabEquipment"
        element={
          <PrivateRoute allowedRoles={["Admin"]}>
            <AddLabEquipment />
          </PrivateRoute>
        }
      />
      <Route
        path="/ViewlabEquipment"
        element={
          <PrivateRoute allowedRoles={["Admin"]}>
            <ViewlabEquipment />
          </PrivateRoute>
        }
      />
      <Route
        path="/EditlabEquipment/:labid"
        element={
          <PrivateRoute allowedRoles={["Admin"]}>
            <EditLabEquipment />
          </PrivateRoute>
        }
      />

      <Route
        path="/AddMedicine"
        element={
          <PrivateRoute allowedRoles={["Admin"]}>
            <AddMedicine />
          </PrivateRoute>
        }
      />
      <Route
        path="/ViewMedicine"
        element={
          <PrivateRoute allowedRoles={["Admin"]}>
            <ViewMedicine />
          </PrivateRoute>
        }
      />
      <Route
        path="/EditMedicine/:id"
        element={
          <PrivateRoute allowedRoles={["Admin"]}>
            <EditMedicine />
          </PrivateRoute>
        }
      />

      {/* Doctor URL */}
      <Route
        path="/DoctorDashboard"
        element={
          <PrivateRoute allowedRoles={["Doctor"]}>
            <DoctorDashboard />
          </PrivateRoute>
        }
      />
      <Route
        path="/Doctorinfo"
        element={
          <PrivateRoute allowedRoles={["Doctor"]}>
            <AddInformDoctor />
          </PrivateRoute>
        }
      />

      <Route path="/Viewinfo" element={<PrivateRoute allowedRoles={['Doctor']}> <ViewInfoDoctor/> </PrivateRoute>} />
      <Route path="/EditInfo/:id" element={<PrivateRoute allowedRoles={['Doctor']}><EditInfoDoctor/></PrivateRoute>}/>
      <Route path="/Addprescription" element={<PrivateRoute allowedRoles={['Doctor']}><AddPrescription/></PrivateRoute>}/>
      <Route path="/ViewPrescription" element={<PrivateRoute allowedRoles={['Doctor']}><PrescriptionView/></PrivateRoute>}/>
      <Route path="/EditPrescription/:id" element={<PrivateRoute allowedRoles={['Doctor']}><EditPrescription/></PrivateRoute>} />
      <Route path="/AddConsultation" element={<PrivateRoute allowedRoles={['Doctor']}><AddConsultation/></PrivateRoute>} />
      <Route path="/ViewConsultation" element={<PrivateRoute allowedRoles={['Doctor']}><ViewConsultation/></PrivateRoute>}/>
      <Route path="/Editconsultation/:consultationId" element={<PrivateRoute allowedRoles={['Doctor']}><EditConsultation/></PrivateRoute>}/>
      <Route path="/CreateLabReport" element={<PrivateRoute allowedRoles={['Doctor']}><CreateLabReport/></PrivateRoute>}/>
      <Route path="/ViewLabReport" element={<PrivateRoute allowedRoles={['Doctor']}><ViewLabReport/></PrivateRoute>} />
      <Route path="/ViewHistory" element={<PrivateRoute allowedRoles={['Doctor']}><ViewPatientHistory/></PrivateRoute>} />
      <Route path="/AddHistory" element={<PrivateRoute allowedRoles={['Doctor']}><AddPatientHistory/></PrivateRoute>} />
      <Route path="/EditHistory/:id" element={<PrivateRoute allowedRoles={['Doctor']}><EditPatientHistory/></PrivateRoute>} />
    </Routes>
  );
}

export default App;
