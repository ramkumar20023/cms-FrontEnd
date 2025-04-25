// src/dashboard/DeleteAppointment.js

import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

import "../patients/common.css"; // Common CSS for styling

const DeleteAppointment = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [appointmentInfo, setAppointmentInfo] = useState("");

  useEffect(() => {
    const fetchAppointment = async () => {
      try {
        const token = localStorage.getItem("access_token");
        const response = await axios.get(`http://localhost:8000/api/appointments/${id}/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const patient = response.data.get_patient_name || `Patient ID ${response.data.Patient}`;
        const doctor = response.data.get_doctor_name || `Doctor ID ${response.data.Doctor}`;
        const formattedDate = new Date(response.data.AppointmentDate).toLocaleString();
        setAppointmentInfo(`${patient} with ${doctor} on ${formattedDate}`);
      } catch (error) {
        alert("Error fetching appointment");
        navigate("/dashboard");
      }
    };

    fetchAppointment();
  }, [id, navigate]);

  const handleDelete = async () => {
    try {
      const token = localStorage.getItem("access_token");
      await axios.delete(`http://localhost:8000/api/appointments/${id}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert("Appointment deleted successfully");
      navigate("/dashboard");
    } catch (error) {
      alert("Error deleting appointment");
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
            <h3 className="mb-4 text-danger">Confirm Deletion</h3>
            <p>Are you sure you want to delete the appointment:</p>
            <strong>{appointmentInfo}</strong>
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

export default DeleteAppointment;
