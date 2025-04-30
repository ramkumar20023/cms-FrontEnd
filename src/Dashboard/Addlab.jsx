import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import "./common.css";
import logo from "../Images/Health-Logo.png";
import axios from "axios";
import { CircularProgress } from "@mui/material";

const AddLabEquipment = () => {
  const [EquipmentName, setEquipmentName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [lastservice, setLastService] = useState("");
  const [nextservice, setNextService] = useState("");
  const [status, setStatus] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("");
  const [loading,setLoading] = useState(false);

  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  const header = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const handleAddEquipment = async (e) => {
    e.preventDefault();
    const data = {
      EquipmentName: EquipmentName,
      Quantity: quantity,
      Last_Service_Date: lastservice,
      Next_Service_Date: nextservice,
      Status: status,
    };
    setLoading(true)
    try {
      await axios.post("http://localhost:8000/api/lab-devices/", data, header);
      showAlert("Equipment Added Successfully", "success");
      setLoading(false);
      setEquipmentName("");
      setQuantity("");
      setLastService("");
      setNextService("");
      setStatus("");
    } catch (error) {
      console.log("error", error.response?.data);
      setLoading(false);
      showAlert("Equipment Adding Failed. Try Again...", "danger");
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
            <Link to="/ViewlabEquipment">View Equipment List</Link>
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
      <div className="container-sm mt-4">
        <div className="row justify-content-center">
          <div className="col-md-6 p-4 border rounded bg-light shadow">
            <h4 className="text-center mb-4 bg-primary text-white p-2 rounded">
              Add Lab Equipments
            </h4>
            <form onSubmit={handleAddEquipment}>
              <div className="mb-3">
                <label className="form-label">Equipment Name</label>
                <input
                  type="text"
                  className="form-control"
                  value={EquipmentName}
                  onChange={(e) => setEquipmentName(e.target.value)}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Quantity</label>
                <input
                  type="number"
                  className="form-control"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Last Service Date</label>
                <input
                  type="date"
                  className="form-control"
                  value={lastservice}
                  onChange={(e) => setLastService(e.target.value)}
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Next Service Date</label>
                <input
                  type="date"
                  className="form-control"
                  value={nextservice}
                  onChange={(e) => setNextService(e.target.value)}
                />
              </div>

              <div className="mb-4">
                <label className="form-label">Select Status</label>
                <select
                  className="form-select"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  required
                >
                  <option value="">Select Status</option>
                  <option value="working">Working</option>
                  <option value="undermaintenance">Under Maintenance</option>
                  <option value="standby">Stand By</option>
                  <option value="outoforder">Out of Order</option>
                </select>
              </div>

              <div className="d-flex justify-content-center gap-3">
                <button type="submit" className="btn btn-success px-4">
                  {loading ? <CircularProgress/> : "Add Equipment"}
                </button>
                <button
                  type="button"
                  className="btn btn-secondary px-4"
                  onClick={() => {
                    setEquipmentName("");
                    setQuantity("");
                    setLastService("");
                    setNextService("");
                    setStatus("");
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
  );
};
export default AddLabEquipment;
