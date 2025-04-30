import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../Images/Health-Logo.png";
import "./doctor.css"; // CSS in same folder

const DoctorDashboard = () => {
  const [username, setUsername] = useState("");
  const [role, setRole] = useState("");

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    const storedRole = localStorage.getItem("role");
    console.log("Stored Username:", storedUsername);
    console.log("Stored Role:", storedRole);
    setUsername(storedUsername);
    setRole(storedRole);
  }, []);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="doctor-container">
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
          {role === "doctor" && (
            <>
              <li>
                <Link to="/Doctorinfo">Doctor Info</Link>
              </li>
              <li>
                <Link to="/Addprescription">Prescription</Link>
              </li>
              <li>
                <Link to="/AddConsultation">Consultation</Link>
              </li>
              <li>
                <Link to="/ViewLabReport">Lab Test Report</Link>
              </li>
              <li>
                <Link to="/ViewHistory">Patient History</Link>
              </li>
            </>
          )}
        </ul>
      </div>
      <div className="section">
        <h2 className="welcome">Welcome to Doctor Management</h2>
      </div>
      <div className="user-info-bar text-center">
        <p className="user-secondary-text">
          Welcome to <span className="underline-text">{username} &</span> Role
          <span className="underline-text">{role}</span>{" "}
          <span className="underline-text logout-link" onClick={handleLogout}>
            Logout
          </span>
        </p>
      </div>
      <div className="docterfooter">
        <p>
          &copy; {new Date().getFullYear()} KIMS Hospital. All Rights Reserved.
        </p>
      </div>
    </div>
  );
};

export default DoctorDashboard;
