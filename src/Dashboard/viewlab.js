import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import logo from "../Images/Helth-care.jpeg";
import axios from "axios";

const ViewLab = () => {
    const [labTest, setLabTest] = useState([]);
    const { id } = useParams();
    const [doctors, setDoctors] = useState([]);
    const [patients, setPatients] = useState([]);
    const [successMessage, setSuccessMessage] = useState("");

    const navigate = useNavigate();

    useEffect(() => {
        const fetchLabtest = async () => {
            const token = localStorage.getItem("access");
            const header = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };
            try {
                const patientRes = await axios.get("http://localhost:8000/api/patients/", header);
                const doctorRes = await axios.get("http://localhost:8000/api/doctorinform/", header);
                const labTestRes = await axios.get("http://localhost:8000/api/labtests/", header);

                setPatients(patientRes.data);
                setDoctors(doctorRes.data);
                setLabTest(labTestRes.data);
            } catch (error) {
                console.error("Error fetching lab test data:", error);
            }
        }
        fetchLabtest();

        const editedFlag = localStorage.getItem("labEdited");
        if (editedFlag === "true") {
            setSuccessMessage("Lab Test Edited Successfully");
            localStorage.removeItem("labEdited");
            setTimeout(() => setSuccessMessage(""), 5000);
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/");
    };

    const getPatientName = (id) => {
        const patient = patients.find(p => p.PatientId === id);
        return patient ? `${patient.FirstName} ${patient.LastName}` : "Unknown";
    };

    const getDoctorName = (id) => {
        const doctor = doctors.find(d => d.informId === id);
        return doctor ? doctor.DoctorName : "Unknown";
    };

    const [selectedTest, setSelectedTest] = useState(null);
    const [showModal, setShowModal] = useState(false);

    const handleShowModal = (test) => {
        setSelectedTest(test);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedTest(null);
    };

    const handleConfirmDelete = async () => {
        try {
            const token = localStorage.getItem("access");
            await axios.delete(`http://localhost:8000/api/labtests/${selectedTest.LaboratoryId}/`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setSuccessMessage("Lab Test Deleted Successfully");
            setTimeout(() => setSuccessMessage(""), 5000);
            setLabTest(prev => prev.filter(t => t.LaboratoryId !== selectedTest.LaboratoryId));
            handleCloseModal();
        } catch (err) {
            console.error("Error deleting lab test:", err);
            alert("Failed to delete lab test.");
        }
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
                        <Link to="/addlabtest">Home</Link>
                    </li>
                    <li>
                        <Link to="/" onClick={handleLogout}>
                            Logout
                        </Link>
                    </li>
                </ul>
            </div>

            <div className="container mt-4">
                {successMessage && (
                    <div className="alert alert-success text-center" role="alert">
                        {successMessage}
                    </div>
                )}

                <h2 className="text-center mb-4 text-primary">View Lab Tests</h2>
                <table className="table table-striped table-bordered">
                    <thead className="table-info">
                        <tr>
                            <th>S.No</th>
                            <th>Sample No</th>
                            <th>Test Name</th>
                            <th>Test Result</th>
                            <th>Patient Name</th>
                            <th>Doctor Name</th>
                            <th>Result Date</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {labTest.map((test, index) => (
                            <tr key={test.LaboratoryId}>
                                <td>{index + 1}</td>
                                <td>{test.sample_No}</td>
                                <td>{test.TestName}</td>
                                <td>{test.TestResult}</td>
                                <td>{test.patientinform ? getPatientName(test.patientinform) : "Not Assigned"}</td>
                                <td>{test.Reffered_by ? getDoctorName(test.Reffered_by) : "Not Assigned"}</td>
                                <td>{test.date_only} {test.time_only}</td>
                                <td>
                                    <Link to={`/edit-lab/${test.LaboratoryId}`} className="btn btn-primary btn-sm me-2" onClick={() => localStorage.setItem("labEdited", "true")}>Edit</Link>
                                    <button className="btn btn-danger btn-sm ms-2" onClick={() => handleShowModal(test)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {showModal && selectedTest && (
                <div className="modal d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Confirm Deletion</h5>
                                <button type="button" className="btn-close" onClick={handleCloseModal}></button>
                            </div>
                            <div className="modal-body text-center">
                                <img src={logo} alt="Healthcare Logo" className="mb-3" style={{ width: "100px" }} />
                                <p>Are you sure you want to delete the lab test record of <strong>{getPatientName(selectedTest.patientinform)}</strong>?</p>
                            </div>
                            <div className="modal-footer">
                                <button className="btn btn-danger" onClick={handleConfirmDelete}>Yes</button>
                                <button className="btn btn-secondary" onClick={handleCloseModal}>No</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );    
};

export default ViewLab;
