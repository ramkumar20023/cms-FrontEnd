// src/dashboard/DeleteAppointment.js

import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const DeleteAppointment = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [appointmentInfo, setAppointmentInfo] = useState("");
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

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
        setLoading(false);
      } catch (error) {
        setErrorMsg("Failed to load appointment details.");
        setLoading(false);
      }
    };

    fetchAppointment();
  }, [id]);

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
        <div className="col-md-8">
          <div className="card shadow p-4 text-center">
            <h3 className="text-danger mb-3">Confirm Appointment Deletion</h3>

            {loading ? (
              <p>Loading appointment details...</p>
            ) : errorMsg ? (
              <p className="text-danger">{errorMsg}</p>
            ) : (
              <>
                <p>Are you sure you want to delete the following appointment?</p>
                <strong className="d-block my-3">{appointmentInfo}</strong>
                <div className="d-flex justify-content-center gap-3">
                  <button className="btn btn-danger" onClick={handleDelete}>
                    Yes, Delete
                  </button>
                  <button className="btn btn-secondary" onClick={handleCancel}>
                    Cancel
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteAppointment;
