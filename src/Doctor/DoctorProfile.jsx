import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import logo from "../Images/Health-Logo.png";
import "../Dashboard/common.css";

const AddInformDoctor = () => {
  const [doctorName, setDoctorName] = useState("");
  const [departments, setDepartments] = useState([]);
  const [selectedDept, setSelectedDept] = useState("");
  const [alertMsg, setAlertMsg] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const token = localStorage.getItem("token");
        const headers = { Authorization: `Bearer ${token}` };
        const response = await axios.get(
          "http://localhost:8000/api/departments/",
          { headers }
        );
        console.log(response.data);

        setDepartments(response.data);
      } catch (error) {
        console.error("Error fetching departments", error);
      }
    };

    fetchDepartments();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const headers = { Authorization: `Bearer ${token}` };

    try {
      const data = {
        DoctorName: doctorName,
        specialist: selectedDept,
      };
    
      await axios.post("http://localhost:8000/api/doctorinform/", data, {
        headers,
      });
    
      setAlertMsg("Doctor Info Saved Successfully");
      setTimeout(() => setAlertMsg(""), 3000);
    
      setDoctorName("");
      setSelectedDept("");
    } catch (error) {
      console.error("Error submitting data", error);
      setAlertMsg("Failed to save doctor info");
      setTimeout(() => setAlertMsg(""), 3000);
    }
    
  };

  const handleLogout = () => {
    navigate("/");
  };

  return (
    <div>
      <div className="navbar">
        <div className="logo-container">
          <img src={logo} alt="Logo" className="logo-img" />
          <span className="logo-text">KIMS</span>
        </div>

        <ul className="nav-links">
          <li>
            <Link to="/DoctorDashboard">Dashboard</Link>
          </li>
          <li>
            <Link to="/Viewinfo">View Info</Link>
          </li>
          <li>
            <Link to="/" onClick={handleLogout}>
              Logout
            </Link>
          </li>
        </ul>
      </div>
      <div className="container mt-4">
        {alertMsg && (
          <div className="alert alert-info text-center" role="alert">
            {alertMsg}
          </div>
        )}

        <div className="container d-flex justify-content-center align-items-center mt-5">
          <div
            className="card p-4 shadow"
            style={{ width: "100%", maxWidth: "500px" }}
          >
            <h4 className="text-center bg-primary text-white mb-4 p-2">
              Add Doctor Info
            </h4>

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Doctor Name</label>
                <input
                  type="text"
                  className="form-control"
                  value={doctorName}
                  onChange={(e) => setDoctorName(e.target.value)}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Department</label>
                <select
                  className="form-select"
                  value={selectedDept}
                  onChange={(e) => setSelectedDept(e.target.value)}
                  required
                >
                  <option value="">-- Select Department --</option>
                  {departments.map((dept) => (
                    <option key={dept.DepartmentId} value={dept.DepartmentId}>
                      {dept.DepartmentName}
                    </option>
                  ))}
                </select>
              </div>

              <div className="d-flex justify-content-center gap-3">
                <button type="submit" className="btn btn-success px-4">
                  Submit
                </button>
                <button
                  type="button"
                  className="btn btn-secondary px-4"
                  onClick={() => {
                    setDoctorName("");
                    setSelectedDept("");
                  }}
                >
                  cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddInformDoctor;
