import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import logo from "../Images/Health-Logo.png.jpeg"; // Replace with your logo path

const PrescriptionSearch = () => {
  const [prescriptions, setPrescriptions] = useState([]); // State to store prescription data
  const [searchTerm, setSearchTerm] = useState(""); // State for search input
  const [filteredPrescriptions, setFilteredPrescriptions] = useState([]); // Filtered data
  const [error, setError] = useState(""); // Error message
  const [loading, setLoading] = useState(false); // Loading state

  // Fetch all prescriptions on component mount
  useEffect(() => {
    fetchPrescriptions();
  }, []);

  const fetchPrescriptions = async () => {
    const token = localStorage.getItem("token"); // Retrieve token from localStorage
    const header = { headers: { Authorization: `Bearer ${token}` } };
    setLoading(true);
    try {
      const response = await axios.get(
        "http://127.0.0.1:8000/api/receptprescriptions/",
        header
      );
      setPrescriptions(response.data);
      setFilteredPrescriptions(response.data); // Initialize filtered data
    } catch (err) {
      setError("Error fetching prescriptions.");
    } finally {
      setLoading(false);
    }
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    if (e.target.value.trim() === "") {
      setFilteredPrescriptions(prescriptions); // Reset to all prescriptions
    } else {
      const filtered = prescriptions.filter((prescription) =>
        `${prescription.Patients.FirstName} ${prescription.Patients.LastName}`
          .toLowerCase()
          .includes(e.target.value.trim().toLowerCase())
      );
      setFilteredPrescriptions(filtered);
    }
  };

  // Handle search button click
  const handleSearch = () => {
    if (searchTerm.trim() === "") {
      setFilteredPrescriptions(prescriptions); // Reset to all prescriptions
    } else {
      const filtered = prescriptions.filter((prescription) =>
        `${prescription.Patients.FirstName} ${prescription.Patients.LastName}`
          .toLowerCase()
          .includes(searchTerm.trim().toLowerCase())
      );
      setFilteredPrescriptions(filtered);
    }
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/"; // Redirect to login page
  };

  return (
    <div>
      {/* Navbar */}
      <div className="navbar bg-light shadow-sm p-3">
        <div className="logo-container d-flex align-items-center">
          <img src={logo} alt="Logo" className="logo-img" style={{ width: 40, height: 40 }} />
          <span className="logo-text fs-4 ms-2 fw-bold text-primary">KIMS</span>
        </div>
        <ul className="nav-links list-unstyled d-flex gap-4 mb-0">
          <li><Link className="text-decoration-none" to="/dashboard">Dashboard</Link></li>
          <li><Link className="text-decoration-none text-danger" to="/" onClick={handleLogout}>Logout</Link></li>
        </ul>
      </div>

      <div className="container mt-5">
        <h2 className="text-center text-primary mb-4">Prescription Details</h2>

        {/* Search Bar */}
        <div className="d-flex justify-content-end mb-3">
          <input
            type="text"
            className="form-control me-2"
            placeholder="Search by patient name..."
            value={searchTerm}
            onChange={handleSearchChange}
            style={{ width: "250px" }}
          />
          <button className="btn btn-primary" onClick={handleSearch}>
            Search
          </button>
        </div>

        
        {/* Error Message */}
        {error && <p className="text-danger text-center">{error}</p>}

        {/* Loading Spinner */}
        {loading ? (
          <div className="text-center">
            <div className="spinner-border text-primary" />
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-bordered table-striped">
              <thead className="table-primary text-center">
                <tr>
                  <th>S.No</th>
                  <th>Patient Name</th>
                  <th>Doctor Name</th>
                  <th>Frequency</th>
                  <th>Dosage</th>
                  <th>No. of Days</th>
                  <th>Medicine</th>
                </tr>
              </thead>
              <tbody>
                {filteredPrescriptions.length > 0 ? (
                  filteredPrescriptions.map((prescription, index) => (
                    <tr key={prescription.PrescripId}>
                      <td>{index + 1}</td>
                      <td>
                        {prescription.Patients.FirstName}{" "}
                        {prescription.Patients.LastName}
                      </td>
                      <td>{prescription.Doctor.DoctorName || "N/A"}</td>
                      <td>{prescription.Prescription.Frequency || "N/A"}</td>
                      <td>{prescription.Prescription.Dosage || "N/A"}</td>
                      <td>{prescription.Prescription.No_of_Days || "N/A"}</td>
                      <td>{prescription.Prescription.Medicine || "N/A"}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="text-center">
                      No prescriptions found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default PrescriptionSearch;