import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import logo from "../Images/Health-Logo.png";
import "../Doctor/doctor.css";

const EditPatientHistory = () => {
  const { id } = useParams();
 
  const [consultations, setConsultations] = useState([]);
  const [labtests, setLabTests] = useState([]);
  const [doctors, setDoctors] = useState([]);

  const [Consultation, setConsultation] = useState("");
  const [report, setReport] = useState("");
  const [Diagnosis, setDiagnosis] = useState("");
  const [Treatment, setTreatment] = useState("");
  const [doctorname, setDoctorname] = useState("");

  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const header = {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [labRes, consultRes, doctorRes, historyRes] = await Promise.all([
          axios.get("http://localhost:8000/api/labtests/", header),
          axios.get("http://localhost:8000/api/consultation/", header),
          axios.get("http://localhost:8000/api/doctorinform/", header),
          axios.get(`http://localhost:8000/api/patienthistory/${id}`, header),
        ]);

        setLabTests(labRes.data);
        setConsultations(consultRes.data);
        setDoctors(doctorRes.data);

        const data = historyRes.data;
        setConsultation(data.Consultation);
        setReport(data.report || "");
        setDiagnosis(data.Diagnosis);
        setTreatment(data.Treatment);
        setDoctorname(data.doctorname || "");

        console.log("lab", labRes.data);
        console.log("consultant", consultRes.data);
        console.log("doctor", doctorRes.data);
        console.log("history", historyRes.data);
        
      } catch (err) {
        console.error("Error fetching data", err);
        setError("Failed to load data");
        setTimeout(() => {
          setError("");
        }, 2000);
      }
    };

    fetchData();
  }, [id]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const updatedData = {
      Consultation,
      report: report || null,
      Diagnosis,
      Treatment,
      doctorname: doctorname || null,
    };

    console.log("update data", updatedData);
    

    axios
      .put(
        `http://localhost:8000/api/patienthistory/${id}`,
        updatedData,
        header
      )
      .then(() => {
        setSuccess("Patient history updated successfully!");
        setTimeout(() => {
          setSuccess("");
        }, 2000);
      })
      .catch(() => {
        setError("Failed to update patient history");
      });
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div>
      <div className="navbar">
        <div className="logo-container">
          <img
            src={logo}
            alt="Logo"
            className="logo-img"
            onClick={handleLogout}
          />
          <span className="logo-text">KIMS</span>
        </div>
        <ul className="nav-links">
          <li>
            <Link to="/ViewHistory">View History</Link>
          </li>
          <li>
            <Link to="/" onClick={handleLogout}>
              Logout
            </Link>
          </li>
        </ul>
      </div>

      {success && (
        <div className="alert alert-success text-center">{success}</div>
      )}
      {error && <div className="alert alert-danger text-center">{error}</div>}

      <div className="container mt-5">
        <form
          onSubmit={handleSubmit}
          className="p-4 shadow-sm border rounded bg-light"
        >
          <h3 className="text-center mb-4 text-white bg-primary p-3">
            Edit Patient History
          </h3>
          <div className="mb-3">
            <label className="form-label">Consultation</label>
            <select
              className="form-select"
              value={Consultation}
              onChange={(e) => setConsultation(e.target.value)}
              required
            >
              <option value="">Select Consultation</option>
              {consultations.map((item) => (
                <option key={item.ConsultantId} value={item.ConsultantId}>
                  {item.ConsultantId} - {item.Notes}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-3">
            <label className="form-label">Lab Test Report</label>
            <select
              className="form-select"
              value={report}
              onChange={(e) => setReport(e.target.value)}
            >
              <option value="">Select Report</option>
              {labtests.map((item) => (
                <option key={item.LaboratoryId} value={item.LaboratoryId}>
                  {item.LaboratoryId} - {item.TestName}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-3">
            <label className="form-label">Diagnosis</label>
            <textarea
              className="form-control"
              value={Diagnosis}
              onChange={(e) => setDiagnosis(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Treatment</label>
            <textarea
              className="form-control"
              value={Treatment}
              onChange={(e) => setTreatment(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Doctor</label>
            <select
              className="form-select"
              value={doctorname}
              onChange={(e) => setDoctorname(e.target.value)}
            >
              <option value="">Select Doctor</option>
              {doctors.map((doc) => (
                <option key={doc.informId} value={doc.informId}>
                  {doc.DoctorName || `Doctor ${doc.informId}`}
                </option>
              ))}
            </select>
          </div>

          <button type="submit" className="btn btn-primary me-2">
            Update
          </button>
          <Link to="/ViewHistory" className="btn btn-secondary">
            Back
          </Link>
        </form>
      </div>
    </div>
  );
};

export default EditPatientHistory;
