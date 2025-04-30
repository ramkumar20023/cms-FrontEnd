import React from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../Images/Health-Logo.png";


const MainLayout = ({ children }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
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
            <Link to="/Viewdoctor">View Doctor</Link>
          </li>
          <li>
            <Link to="/" onClick={handleLogout}>Logout</Link>
          </li>
        </ul>
      </div>

      {/* Page Content */}
      <div className="container mt-4">
        {children}
      </div>

      {/* Footer */}
      <footer className="text-center text-muted mt-5 mb-3">
        &copy; 2025 KIMS Hospital
      </footer>
    </div>
  );
};

export default MainLayout;


// import "../Dashboard/common.css"; 