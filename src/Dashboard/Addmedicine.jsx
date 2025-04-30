import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import "./common.css";
import logo from "../Images/Health-Logo.png";
import axios from "axios";
import { CircularProgress } from "@mui/material";

const AddMedicine = () => {
  const [medicinename, setMedicineName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [Expirydate, setExpiryDate] = useState("");
  const [priceunit, setPriceunit] = useState("");
  const [lowstack, setLowStack] = useState("");
  const [supplier, setSupplier] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("");
  const [loading, setLoading] = useState("");

  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  const header = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const handleAddmedicine = async (e) => {
    e.preventDefault();
    const data = {
      MedicineName: medicinename,
      Quantity: quantity,
      Expiry_Date: Expirydate,
      PricePerUnit: priceunit,
      lowStock: lowstack,
      supplier: supplier,
    };
    setLoading(true);
    try {
      await axios.post("http://localhost:8000/api/pharmacy/", data, header);
      showAlert("Medicine Added Successfully", "success");
      setLoading(false);

      setMedicineName("");
      setQuantity("");
      setExpiryDate("");
      setPriceunit("");
      setLowStack("");
      setSupplier("");
    } catch (error) {
      console.log(error.response?.data);
      setLoading(false);
      showAlert("Medicine Added Failed. Try Again...", "Danger");
    }
  };

  const showAlert = (msg, type) => {
    setAlertMessage(msg);
    setAlertType(type);
    setTimeout(() => {
      setAlertMessage("");
      setAlertType("");
    }, 3000);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
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
            <Link to="/ViewMedicine">View Medicine</Link>
          </li>
          <li>
            <Link to="/" onClick={handleLogout}>
              Logout
            </Link>
          </li>
        </ul>
      </div>

      {alertMessage && (
        <div
          className={`alert alert-${alertType} text-center position-fixed top-0 start-50 translate-middle-x mt-3 w-50`}
          role="alert"
          style={{ zIndex: 9999 }}
        >
          {alertMessage}
        </div>
      )}

      <div className="container mt-5">
        <div className="container mt-5">
          <form className="w-50 mx-auto shadow p-4 rounded bg-light">
            <h3 className="text-center text-white mb-4 bg-primary p-2 rounded">
              Add Medicines
            </h3>

            <div className="mb-3">
              <label className="form-label">Medicine Name</label>
              <input
                type="text"
                className="form-control"
                value={medicinename}
                onChange={(e) => setMedicineName(e.target.value)}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Quantity</label>
              <input
                type="number"
                className="form-control"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Expiry Date</label>
              <input
                type="date"
                className="form-control"
                value={Expirydate}
                onChange={(e) => setExpiryDate(e.target.value)}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Price Per Unit</label>
              <input
                type="number"
                step="0.01"
                className="form-control"
                value={priceunit}
                onChange={(e) => setPriceunit(parseFloat(e.target.value) || 0)}
                min="0"
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Low Stack</label>
              <input
                type="number"
                className="form-control"
                value={lowstack}
                onChange={(e) => setLowStack(e.target.value)}
              />
            </div>

            <div className="mb-4">
              <label className="form-label">Supplier</label>
              <input
                type="text"
                className="form-control"
                value={supplier}
                onChange={(e) => setSupplier(e.target.value)}
              />
            </div>

            <div className="d-flex justify-content-center gap-3">
              <button
                onClick={handleAddmedicine}
                className="btn btn-success px-4"
                type="submit"
              >
                {loading ? (
                  <CircularProgress size={20} color="inherit" />
                ) : (
                  "Add Medicine"
                )}
              </button>

              <button
                type="button"
                className="btn btn-danger px-4"
                onClick={() => {
                  setMedicineName("");
                  setQuantity("");
                  setExpiryDate("");
                  setPriceunit("");
                  setLowStack("");
                  setSupplier("");
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
export default AddMedicine;
