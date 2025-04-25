import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Select from "react-select";
import logo from "../Images/Helth-care.jpeg";

const EditLabTest = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [sampleNo, setSampleNo] = useState("");
  const [testName, setTestName] = useState("");
  const [testResult, setTestResult] = useState("");
  const [patientId, setPatientId] = useState("");
  const [doctorId, setDoctorId] = useState("");
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);

  const token = localStorage.getItem("access");
  const headers = {
    Authorization: `Bearer ${token}`,
  };

  useEffect(() => {
    const fetchLabTest = async () => {
      try {
        const labRes = await axios.get(`http://localhost:8000/api/labtests/${id}/`, { headers });
        const patientRes = await axios.get("http://localhost:8000/api/patients/", { headers });
        const doctorRes = await axios.get("http://localhost:8000/api/doctorinform/", { headers });

        setSampleNo(labRes.data.sample_No);
        setTestName(labRes.data.TestName);
        setTestResult(labRes.data.TestResult);
        setPatientId(String(labRes.data.patientinform));
        setDoctorId(String(labRes.data.Reffered_by));

        setPatients(patientRes.data);
        setDoctors(doctorRes.data);
      } catch (err) {
        console.error("Error fetching data:", err);
        alert("Failed to load lab test data.");
      }
    };

    fetchLabTest();
  }, [id]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    const updatedData = {
      sample_No: sampleNo,
      TestName: testName,
      TestResult: testResult,
      patientinform: parseInt(patientId),
      Reffered_by: parseInt(doctorId),
    };

    try {
      await axios.put(`http://localhost:8000/api/labtests/${id}/`, updatedData, { headers });
      localStorage.setItem("labEdited", "true"); // ✅ Store flag for success message
      navigate("/ViewLab"); // ✅ Redirect to ViewLab, where the message is shown
    } catch (err) {
      console.error("Update error:", err);
      alert("Failed to update lab test.");
    }
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
            <button onClick={() => navigate("/ViewLab")} className="btn btn-link">
              View Test
            </button>
          </li>
          <li>
            <button
              className="btn btn-link"
              onClick={() => {
                localStorage.removeItem("access");
                navigate("/");
              }}
            >
              Logout
            </button>
          </li>
        </ul>
      </div>

      <div className="container mt-5 d-flex justify-content-center">
        <div className="card shadow col-md-8 col-lg-6">
          <div className="card-header bg-warning text-dark">
            <h4 className="mb-0 text-center">Edit Lab Test</h4>
          </div>
          <div className="card-body">
            <form onSubmit={handleUpdate}>
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
                <Select
                  options={patients.map((p) => ({
                    value: String(p.PatientId),
                    label: `${p.FirstName} ${p.LastName}`,
                  }))}
                  value={patients
                    .map((p) => ({
                      value: String(p.PatientId),
                      label: `${p.FirstName} ${p.LastName}`,
                    }))
                    .find((opt) => opt.value === String(patientId))}
                  onChange={(selected) => setPatientId(selected.value)}
                  placeholder="Select Patient"
                  isSearchable
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Referred By</label>
                <Select
                  options={doctors.map((d) => ({
                    value: String(d.informId),
                    label: d.DoctorName,
                  }))}
                  value={doctors
                    .map((d) => ({
                      value: String(d.informId),
                      label: d.DoctorName,
                    }))
                    .find((opt) => opt.value === String(doctorId))}
                  onChange={(selected) => setDoctorId(selected.value)}
                  placeholder="Select Doctor"
                  isSearchable
                />
              </div>

              <div className="d-flex justify-content-center gap-3 mt-4">
                <button type="submit" className="btn btn-primary px-4">
                  Update
                </button>
                <button
                  type="button"
                  className="btn btn-secondary px-4"
                  onClick={() => navigate("/ViewLab")}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditLabTest;
