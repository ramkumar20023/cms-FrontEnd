import React, { useEffect, useState } from "react";
import axios from "axios";
import "../Dashboard/style.css";
import logo from "../Images/Helth-care.jpeg";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

const ViewLabReports = () => {
  const [labTests, setLabTests] = useState([]);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("access");
      const headers = { headers: { Authorization: `Bearer ${token}` } };

      try {
        const [labRes, patientRes, doctorRes] = await Promise.all([
          axios.get("http://localhost:8000/api/labtests/", headers),
          axios.get("http://localhost:8000/api/patients/", headers),
          axios.get("http://localhost:8000/api/doctorinform/", headers),
        ]);

        setLabTests(labRes.data);
        setPatients(patientRes.data);
        setDoctors(doctorRes.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const getPatient = (id) => patients.find((p) => p.PatientId === id);
  const getDoctor = (id) => doctors.find((d) => d.informId === id);

  const handleView = (test) => {
    const patient = getPatient(test.patientinform);
    const doctor = getDoctor(test.Reffered_by);
    setSelectedReport({
      lab: test,
      patient,
      doctor,
    });
  };

  const handleClose = () => {
    setSelectedReport(null);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleLogout = () => {
    localStorage.removeItem("access");
    navigate("/login");
  }

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
            <Link to="/" onClick={handleLogout}>
              Logout
            </Link>
          </li>
        </ul>
      </div>
      <div className="container mt-5">
        <h2 className="text-center mb-4">Lab Reports</h2>
        <table className="table table-bordered table-striped">
          <thead className="table-info">
            <tr>
              <th>#</th>
              <th>Sample No</th>
              <th>Test Name</th>
              <th>Test Result</th>
              <th>Patient Name</th>
              <th>Doctor Name</th>
              <th>Result Date</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {labTests.map((test, index) => (
              <tr key={test.LaboratoryId}>
                <td>{index + 1}</td>
                <td>{test.sample_No}</td>
                <td>{test.TestName}</td>
                <td>{test.TestResult}</td>
                <td>{getPatient(test.patientinform)?.FirstName} {getPatient(test.patientinform)?.LastName}</td>
                <td>{getDoctor(test.Reffered_by)?.DoctorName || "Unknown"}</td>
                <td>{test.date_only}</td>
                <td>
                  <button
                    className="btn btn-sm btn-info"
                    onClick={() => handleView(test)}
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {selectedReport && (
          <div className="modal d-block" tabIndex="-1" role="dialog" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
            <div className="modal-dialog modal-lg" role="document">
              <div className="modal-content p-4" style={{ borderRadius: "10px" }}>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h3 className="text-primary fw-bold">KIMS HOSPITAL</h3>
                  <div>
                    <button className="btn btn-outline-secondary me-2" onClick={handleClose}>Cancel</button>
                    <button className="btn btn-success" onClick={handlePrint}>Print</button>
                  </div>
                </div>

                <hr />
                <h5 className="text-muted">Patient Information</h5>
                <hr />
                <div className="row">
                  <div className="col-md-6"><strong>MR.No:</strong> {selectedReport.patient?.RegNo}</div>
                  <div className="col-md-6"><strong>Name:</strong> {selectedReport.patient?.FirstName} {selectedReport.patient?.LastName}</div>
                  <div className="col-md-6"><strong>Age:</strong> {selectedReport.patient?.Age}</div>
                  <div className="col-md-6"><strong>DOB:</strong> {selectedReport.patient?.DOB}</div>
                  <div className="col-md-6"><strong>Gender:</strong> {selectedReport.patient?.Gender}</div>
                  <div className="col-md-6"><strong>Blood Group:</strong> {selectedReport.patient?.BloodGroup}</div>
                </div>

                <hr className="mt-4" />
                <h5 className="text-muted">Lab Test Information</h5>
                <hr />
                <div className="row">
                  <div className="col-md-6"><strong>Sample No:</strong> {selectedReport.lab.sample_No}</div>
                  <div className="col-md-6"><strong>Test Name:</strong> {selectedReport.lab.TestName}</div>
                  <div className="col-md-6"><strong>Result:</strong> {selectedReport.lab.TestResult}</div>
                  <div className="col-md-6"><strong>Referred By:</strong> {selectedReport.doctor?.DoctorName || "Not Assigned"}</div>
                  <div className="col-md-6"><strong>Date:</strong> {selectedReport.lab.date_only}</div>
                  <div className="col-md-6"><strong>Time:</strong> {selectedReport.lab.time_only}</div>
                </div>
              </div>
            </div>
          </div>
        )}


      </div>
    </div>
  );
};

export default ViewLabReports;
