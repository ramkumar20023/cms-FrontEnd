import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate, Link } from "react-router-dom";
import logo from "../Images/Helth-care.jpeg";

const EditLabDeviceStatus = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [device, setDevice] = useState(null);
    const [status, setStatus] = useState("");
    const [successMessage, setSuccessMessage] = useState(""); // NEW
    const token = localStorage.getItem("access");

    useEffect(() => {
        axios
            .get(`http://localhost:8000/api/devices/${id}/`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .then((res) => {
                setDevice(res.data);
                setStatus(res.data.Status);
            })
            .catch((err) => console.error("Error fetching device:", err));
    }, [id, token]);

    const handleStatusUpdate = () => {
        axios
            .patch(
                `http://localhost:8000/api/labdevices/${id}/update-status/`,
                { Status: status },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            )
            .then(() => {
                setSuccessMessage("Status updated successfully!"); // SET MESSAGE
                setTimeout(() => {
                    //   navigate("/labinventory");
                }, 1500); // Wait 1.5s then go
            })
            .catch((err) => {
                console.error("Error updating status:", err);
                alert("Failed to update status.");
            });
    };

    if (!device) return <div>Loading...</div>;

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
                        <Link to="/LabInventory">View Equipment</Link>
                    </li>
                    <li>
                        <Link to="/">Logout</Link>
                    </li>
                </ul>
            </div>
            <div className="container mt-4 d-flex justify-content-center">
                <div className="card shadow-sm p-4" style={{ maxWidth: "500px", width: "100%" }}>
                    {successMessage && (
                        <div className="alert alert-success text-center" role="alert">
                            {successMessage}
                        </div>
                    )}

                    <h3 className="mb-4 text-center bg-primary p-2">Update Equipment</h3>

                    <div className="mb-3">
                        <label className="form-label">Equipment Name</label>
                        <input
                            type="text"
                            className="form-control"
                            value={device.EquipmentName}
                            disabled
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Quantity</label>
                        <input
                            type="number"
                            className="form-control"
                            value={device.Quantity}
                            disabled
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Last Service Date</label>
                        <input
                            type="date"
                            className="form-control"
                            value={device.Last_Service_Date}
                            disabled
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Next Service Date</label>
                        <input
                            type="date"
                            className="form-control"
                            value={device.Next_Service_Date}
                            disabled
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Date</label>
                        <input
                            type="date"
                            className="form-control"
                            value={device.date_only}
                            disabled
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Status</label>
                        <select
                            className="form-select"
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                        >
                            <option value="working">Working</option>
                            <option value="undermaintenance">Under Maintenance</option>
                            <option value="standby">Standby</option>
                            <option value="outoforder">Out of Order</option>
                        </select>
                    </div>

                    <div className="d-flex justify-content-center">
                        <button
                            className="btn btn-primary btn-sm mt-3"
                            onClick={handleStatusUpdate}
                        >
                            Update Status
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditLabDeviceStatus;
