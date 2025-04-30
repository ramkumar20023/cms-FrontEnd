import React, { useEffect, useState } from "react";
import { useNavigate, Link, useParams } from "react-router-dom";
import { CircularProgress } from "@mui/material";

import "./common.css";
import logo from "../Images/Health-Logo.png";
import axios from "axios";

const EditMedicine = () => {
  const [medicinename, setMedicineName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [Expirydate, setExpiryDate] = useState("");
  const [priceunit, setPriceunit] = useState("");
  const [lowstack, setLowStack] = useState("");
  const [supplier, setSupplier] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("");
  const [loading, setLoading] = useState("");
  
  const {id} = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMedicine = async () => {
      const token = localStorage.getItem("token");
      const header = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      try{
        const MedicineRes=await axios.get(`http://localhost:8000/api/pharmacy/${id}/`,header)
        console.log("Medicinename>>>",MedicineRes.data);
        
        setMedicineName(MedicineRes.data.MedicineName);
        setQuantity(MedicineRes.data.Quantity);
        setExpiryDate(MedicineRes.data.Expiry_Date);
        setPriceunit(MedicineRes.data.PricePerUnit);
        setLowStack(MedicineRes.data.lowStock);
        setSupplier(MedicineRes.data.supplier);
      } 
      catch(error){
        console.log(error.response?.data);
        showAlert("Error.Fetching Data", "warning");
      }
    };
    fetchMedicine();
  },[id]);

  const handleEditMedicine = async (e) => {
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
    try{
        const token = localStorage.getItem("token");
        const header = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
        await axios.put(`http://localhost:8000/api/pharmacy/${id}/`,data,header);
        
        showAlert("Medicine Updated Successfully","success");
        setLoading(false)
    }
    catch(error){
        console.log("error>>>",error.response);
        showAlert("Medicine Updation Failed...","danger");
        setLoading(false)
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

  const handleBackhome = () => {
    navigate("/ViewMedicine");
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
            <Link to="/ViewMedicine">Medicines List</Link>
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
              Update Medicine
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
                onChange={(e) => setPriceunit(parseFloat(e.target.value)||0)}
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
                onClick={handleEditMedicine}
                className="btn btn-success px-4"
                type="submit"
              >
                {loading ? (
                  <CircularProgress size={20} color="inherit" />
                ) : (
                  "Update Medicine"
                )}
              </button>

              <button
                type="button"
                className="btn btn-secondary px-4"
                onClick={handleBackhome}
              >
                Back Home
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
export default EditMedicine;
