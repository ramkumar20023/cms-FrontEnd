import { BrowserRouter as Router,Route,Routes } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import Signup from "./Authentication/Signup";
import Login from "./Authentication/Login";
import AddLabTest from "./Dashboard/AddLabTest";
import Dashboard from "./Dashboard/Dashboard";
import ViewLab from "./Dashboard/viewlab";
import Labtest from "./Dashboard/AvailableTest";
import AvailableTest from "./Dashboard/AvailableTest";
import EditLabTest from "./Dashboard/EditLabTest";
import LabReport from "./Dashboard/LabReport";
import DeleteLabTest from "./Dashboard/DeleteLabTest";
import LabBilling from "./Dashboard/AddLabBill";
import LabDeviceTable from "./Dashboard/LabInventory";
import AddTests from "./Dashboard/AddTests";
import EditLabDeviceStatus from "./Dashboard/Editlabinventory";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/" element={<Login />} />
        {/* <Route path="/dashboard" element={<LabDashboard />} /> */}
        <Route path="/dashboard" element={<Dashboard/>} />
        <Route path="/addlabtest" element={<AddLabTest />} />
        <Route  path="/ViewLab" element={<ViewLab/>}/>
        <Route  path="/delete-lab-test/:id" element={<DeleteLabTest/>}/>
        <Route path="/Labtest" element={<Labtest/>} />
        {/* <Route path="/addlabtest" element={<AddLabTest />} /> */}
        <Route path="/addlabbill" element={<LabBilling />} />
        <Route path="/edit-lab/:id" element={<EditLabTest />} />
        <Route path="/testAvailable" element={<AvailableTest/>} />
        <Route path="/LabReport/:reportId" element={<LabReport />} />
        <Route path="/LabInventory" element={<LabDeviceTable/>} />
         <Route path="/addtests" element={<AddTests />} />
         <Route path="/editlabinventory/:id" element={<EditLabDeviceStatus />} />


        {/* <Route path="/addlabtest" element={<AddLabTest />} /> */}
      </Routes>
    </Router>
  );
}

export default App;
