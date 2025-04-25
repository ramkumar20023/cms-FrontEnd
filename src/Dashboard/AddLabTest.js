import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import logo from "../Images/Helth-care.jpeg";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const AddLabTest = () => {
  const [sampleNo, setSampleNo] = useState("");
  const [testName, setTestName] = useState("");
  const [testResult, setTestResult] = useState("");
  const [patientId, setPatientId] = useState("");
  const [doctorId, setDoctorId] = useState("");
  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("access");
    const header = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const fetchData = async () => {
      try {
        const patientRes = await axios.get("http://localhost:8000/api/patients/", header);
        const doctorRes = await axios.get("http://localhost:8000/api/doctorinform/", header);
        setPatients(patientRes.data);
        setDoctors(doctorRes.data);
      } catch (error) {
        console.error("Response data:", error.response?.data);
        toast.error("Error fetching patient/doctor data.");
      }
    };

    fetchData();
  }, []);

  const handleClickAddLab = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("access");
    const header = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const data = {
      sample_No: sampleNo,
      TestName: testName,
      TestResult: testResult,
      Reffered_by: patientId,
      patientinform: doctorId,
    };

    try {
      await axios.post("http://localhost:8000/api/labtests/", data, header);
      toast.success("Lab Test Added Successfully", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      setSampleNo("");
      setTestName("");
      setTestResult("");
      setPatientId("");
      setDoctorId("");
    } catch (error) {
      console.error("Error adding lab test:", error);
      toast.error("Failed to add lab test", {
        position: "top-center",
        autoClose: 5000,
      });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("access");
    navigate("/");
  };

  return (
    <div>
      {/* Navbar */}
      <div className="navbar">
        <div className="logo-container">
          <img src={logo} alt="Logo" className="logo-img" />
          <span className="logo-text">KIMS</span>
        </div>

        <ul className="nav-links">
          <li>
            <Link to="/dashboard">Dashboard</Link>
          </li>
          <li>
            <Link to="/ViewLab">View Test</Link>
          </li>
          <li>
            <Link to="/addtests">Available Test</Link>
          </li>
          <li>
            <Link to="/" onClick={handleLogout}>
              Logout
            </Link>
          </li>
        </ul>
      </div>

      <div className="container mt-5 d-flex justify-content-center">
        <div className="card shadow col-md-8 col-lg-6">
          <div className="card-header bg-primary text-white">
            <h4 className="mb-0 text-center">Add Lab Test</h4>
          </div>
          <div className="card-body">
            <form onSubmit={handleClickAddLab}>
              <div className="mb-3">
                <label className="form-label">Sample No</label>
                <input
                  type="number"
                  className="form-control"
                  value={sampleNo}
                  onChange={(e) => setSampleNo(e.target.value)}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Test Name</label>
                <input
                  type="text"
                  className="form-control"
                  value={testName}
                  onChange={(e) => setTestName(e.target.value)}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Test Result</label>
                <input
                  type="text"
                  className="form-control"
                  value={testResult}
                  onChange={(e) => setTestResult(e.target.value)}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Patient Name</label>
                <select
                  className="form-select"
                  value={patientId}
                  onChange={(e) => setPatientId(e.target.value)}
                  required
                >
                  <option value="">Select Patient</option>
                  {patients.map((p) => (
                    <option key={p.PatientId} value={p.PatientId}>
                      {p.FirstName} {p.LastName}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-3">
                <label className="form-label">Referred By</label>
                <select
                  className="form-select"
                  value={doctorId}
                  onChange={(e) => setDoctorId(e.target.value)}
                  required
                >
                  <option value="">Select Doctor</option>
                  {doctors.map((d) => (
                    <option key={d.informId} value={d.informId}>
                      {d.DoctorName}
                    </option>
                  ))}
                </select>
              </div>

              <div className="d-flex justify-content-center gap-3 mt-4">
                <button type="submit" className="btn btn-success">
                  Add Lab
                </button>
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={() => {
                    setSampleNo("");
                    setTestName("");
                    setTestResult("");
                    setPatientId("");
                    setDoctorId("");
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Toast Container for Notifications */}
      <ToastContainer />
    </div>
  );
};

export default AddLabTest;
