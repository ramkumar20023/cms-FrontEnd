import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import logo from "../Images/Helth-care.jpeg";

const DeleteLabTest = () => {
    const { id } = useParams(); // Lab test ID from route
    const navigate = useNavigate();

    const token = localStorage.getItem("access");
    const headers = {
        Authorization: `Bearer ${token}`,
    };

    const [labTest, setLabTest] = useState(null);
    const [patients, setPatients] = useState([]);
    const [showSuccess, setShowSuccess] = useState(false);

    useEffect(() => {
        const fetchLabTest = async () => {
            try {
                const labRes = await axios.get(`http://localhost:8000/api/labtests/${id}/`, { headers });
                const patientRes = await axios.get("http://localhost:8000/api/patients/", { headers });

                setLabTest(labRes.data);
                setPatients(patientRes.data);
            } catch (err) {
                console.error("Error fetching data:", err);
                alert("Failed to load lab test data.");
            }
        };

        fetchLabTest();
    }, [id]);

    const handleDelete = async () => {
        try {
            await axios.delete(`http://localhost:8000/api/labtests/${id}/`, { headers });
            setShowSuccess(true);

            setTimeout(() => {
                navigate("/ViewLab");
            }, 2000);
        } catch (err) {
            console.error("Error deleting lab test:", err);
            alert("Failed to delete lab test.");
        }
    };

    const handleLogout = () => {
        localStorage.clear();
        navigate("/login");
    };

    return (
        <div className="container mt-5">
            <div className="card text-center shadow p-4">
                <img src={logo} alt="Healthcare Logo" className="mb-3" style={{ width: "100px", margin: "0 auto" }} />
                {showSuccess ? (
                    <div className="alert alert-success fw-bold" role="alert">
                        ✅ Lab Test Deleted Successfully
                    </div>
                ) : (
                    <>
                        <h4 className="mb-4">
                            Are you sure you want to delete the lab test record of{" "}
                            <strong>
                                {
                                    labTest && patients.length > 0 &&
                                    (
                                        patients.find(p => p.PatientId === labTest.patientinform)?.full_name ||
                                        `${patients.find(p => p.PatientId === labTest.patientinform)?.FirstName || ""} ${patients.find(p => p.PatientId === labTest.patientinform)?.LastName || ""}`
                                    )
                                }
                            </strong>
                            ?
                        </h4>
                        <div className="d-flex justify-content-center gap-3">
                            <button className="btn btn-danger px-4" onClick={handleDelete}>Yes</button>
                            <button className="btn btn-secondary px-4" onClick={() => navigate("/ViewLab")}>No</button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default DeleteLabTest;
