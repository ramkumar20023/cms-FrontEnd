import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import logo from "../Images/Helth-care.jpeg";

const ViewBill = () => {
  const [bills, setBills] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBills = async () => {
      const token = localStorage.getItem("access");
      const header = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      try {
        const response = await axios.get("http://localhost:8000/api/labbills/", header);
        setBills(response.data);
        console.log("Bills:", response.data);
      } catch (error) {
        console.error("Error fetching bills:", error);
        alert("Failed to fetch bill data.");
      }
    };

    fetchBills();
  }, []);

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
          <li><Link to="/dashboard">Dashboard</Link></li>
          <li><Link to="/AddLabBill">Add Bill</Link></li>
          <li><Link to="/" onClick={handleLogout}>Logout</Link></li>
        </ul>
      </div>

      {/* Table Section */}
      <div className="container mt-4">
        <h2 className="text-center text-primary mb-4">Lab Bill List</h2>
        <table className="table table-bordered table-hover">
          <thead className="table-info">
            <tr>
              <th>S.No</th>
              <th>MR No</th>
              <th>Patient Name</th>
              <th>Age</th>
              <th>DOB</th>
              <th>Gender</th>
              <th>Blood Group</th>
              <th>Referred By</th>
              <th>Device Charge</th>
              <th>Service Charge</th>
              <th>Testing Charge</th>
              <th>Total Price</th>
            </tr>
          </thead>
          <tbody>
            {bills.length > 0 ? (
              bills.map((bill, index) => (
                <tr key={bill.id}>
                  <td>{index + 1}</td>
                  <td>{bill.mr_no}</td>
                  <td>{bill.patient_name}</td>
                  <td>{bill.age}</td>
                  <td>{bill.dob}</td>
                  <td>{bill.gender}</td>
                  <td>{bill.blood_group}</td>
                  <td>{bill.referred_by}</td>
                  <td>{bill.device_charge}</td>
                  <td>{bill.service_charge}</td>
                  <td>{bill.testing_charge}</td>
                  <td>{bill.total_price}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="12" className="text-center">No bills found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ViewBill;
