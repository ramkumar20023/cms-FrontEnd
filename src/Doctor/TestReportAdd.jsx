import React, { useEffect, useState } from "react";
import axios from "axios";
import logo from "../Images/Health-Logo.png";
import { Link, useNavigate } from "react-router-dom";
import "../Dashboard/common.css";

const CreateLabReport = () => {
  const [tests, setTests] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [selectedTest, setSelectedTest] = useState("");
  const [selectedAppointment, setSelectedAppointment] = useState("");
  const [findings, setFindings] = useState("");
  const [message, setMessage] = useState("");
  const navigate =useNavigate();

  const token = localStorage.getItem("token");
  const headers = {
    Authorization: `Bearer ${token}`,
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const labTestResponse = await axios.get(
          "http://localhost:8000/api/labtests/",
          { headers }
        );
        setTests(labTestResponse.data);

        const appointmentResponse = await axios.get(
          "http://localhost:8000/api/appointments/",
          { headers }
        );
        setAppointments(appointmentResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
        setMessage("Error loading tests or appointments!");
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage("");
      }, 3000); // 3 seconds
      return () => clearTimeout(timer);
    }
  }, [message]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedTest || !selectedAppointment || !findings) {
      setMessage("Please fill all fields!");
      return;
    }

    try {
      const payload = {
        LabTesting: selectedTest,
        Appointment: selectedAppointment,
        Findings: findings,
      };

      await axios.post("http://localhost:8000/api/testreport/", payload, {
        headers,
      });

      setMessage("Lab Report created successfully!");
      setSelectedTest("");
      setSelectedAppointment("");
      setFindings("");
    } catch (error) {
      console.error("Error creating report:", error.response?.data);
      setMessage("Error creating lab report!");
    }
  };
  const handleLogout=()=>{
    localStorage.removeItem("token");
    navigate("/");
  }
  return (
    <div>
      <div>
        {/* Navbar */}
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
              <Link to="/ViewLabReport">Home</Link>
            </li>
            <li>
              <Link to="/" onClick={handleLogout}>
                Logout
              </Link>
            </li>
          </ul>
        </div>
        <div className="container mt-5">
          <div className="row justify-content-center">
            <div className="col-md-8">
              <div className="card shadow-lg p-4">
                <h2 className="text-white bg-primary text-center mb-4 p-2">
                  Create Lab Report
                </h2>

                {message && (
                  <div className="alert alert-info text-center" role="alert">
                    {message}
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  {/* Test Dropdown */}
                  <div className="mb-3">
                    <label className="form-label">Select Test:</label>
                    <select
                      className="form-select"
                      value={selectedTest}
                      onChange={(e) => setSelectedTest(e.target.value)}
                    >
                      <option value="">-- Select Test --</option>
                      {tests.map((test) => (
                        <option
                          key={test.LaboratoryId}
                          value={test.LaboratoryId}
                        >
                          {test.TestName}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Appointment/Patient Dropdown */}
                  <div className="mb-3">
                    <label className="form-label">
                      Select Patient (Appointment):
                    </label>
                    <select
                      className="form-select"
                      value={selectedAppointment}
                      onChange={(e) => setSelectedAppointment(e.target.value)}
                    >
                      <option value="">-- Select Patient --</option>
                      {appointments.map((app) => (
                        <option
                          key={app.AppointmentId}
                          value={app.AppointmentId}
                        >
                          {app.get_patient_name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Findings Textarea */}
                  <div className="mb-3">
                    <label className="form-label">Findings:</label>
                    <textarea
                      className="form-control"
                      rows="4"
                      value={findings}
                      onChange={(e) => setFindings(e.target.value)}
                      placeholder="Enter test findings..."
                    />
                  </div>

                  {/* Buttons */}
                  <div className="text-center">
                    <button type="submit" className="btn btn-primary me-2">
                      Create Report
                    </button>
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => {
                        setSelectedTest("");
                        setSelectedAppointment("");
                        setFindings("");
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateLabReport;
