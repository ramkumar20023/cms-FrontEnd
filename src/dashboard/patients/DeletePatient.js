import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../patients/common.css"; // Common CSS for styling

const DeletePatient = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [patientInfo, setPatientInfo] = useState("");

  useEffect(() => {
    const fetchPatient = async () => {
      try {
        const token = localStorage.getItem("access_token");
        const response = await axios.get(`http://localhost:8000/api/patients/${id}/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Format patient info (e.g., "John Doe (MR No: 100000)")
        const patientName = `${response.data.FirstName} ${response.data.LastName}`;
        const regNo = response.data.RegNo;
        setPatientInfo(`${patientName} (MR No: ${regNo})`);
      } catch (error) {
        alert("Error fetching patient details");
        console.error(error);
        navigate("/dashboard");
      }
    };

    fetchPatient();
  }, [id, navigate]);

  const handleDelete = async () => {
    try {
      const token = localStorage.getItem("access_token");
      await axios.delete(`http://localhost:8000/api/patients/${id}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert("Patient deleted successfully");
      navigate("/dashboard");
    } catch (error) {
      alert("Error deleting patient");
      console.error(error);
    }
  };

  const handleCancel = () => {
    navigate("/dashboard");
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow p-4 mb-5 text-center">
            <h3 className="mb-4 text-danger">Confirm Patient Deletion</h3>
            <p>Are you sure you want to delete the patient:</p>
            <strong>{patientInfo || "Loading..."}</strong>
            <div className="d-flex justify-content-around mt-4">
              <button onClick={handleDelete} className="btn btn-danger">
                Yes, Delete
              </button>
              <button onClick={handleCancel} className="btn btn-secondary">
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeletePatient;