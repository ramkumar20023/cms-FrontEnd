// src/dashboard/DeleteAppointmentBill.js

import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const DeleteAppointmentBill = () => {
  const { id } = useParams(); // Get the bill ID from URL params
  const navigate = useNavigate();
  const [billInfo, setBillInfo] = useState("");

  useEffect(() => {
    // Fetch the appointment bill details to display
    const fetchBill = async () => {
      try {
        const token = localStorage.getItem("access_token");
        const response = await axios.get(`http://localhost:8000/api/bills/${id}/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const appointmentDetails = response.data.Appointment
          ? `Appointment with ID ${response.data.Appointment}`
          : "Unknown Appointment";
        setBillInfo(`Bill for ${appointmentDetails} with total cost ${response.data.TotalCost}`);
      } catch (error) {
        alert("Error fetching bill");
        navigate("/dashboard/bill-list"); // Redirect to bill list if there's an error
      }
    };

    fetchBill();
  }, [id, navigate]);

  const handleDelete = async () => {
    try {
      const token = localStorage.getItem("access_token");
      // Delete the bill
      await axios.delete(`http://localhost:8000/api/bills/${id}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert("Bill deleted successfully");
      navigate("/bills"); // Redirect to dashboard after deletion
    } catch (error) {
      alert("Error deleting bill");
      console.error(error);
    }
  };

  const handleCancel = () => {
    navigate("/bills"); // Cancel the deletion and navigate back to dashboard
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow p-4 mb-5 text-center">
            <h3 className="mb-4 text-danger">Confirm Deletion</h3>
            <p>Are you sure you want to delete the following bill?</p>
            <strong>{billInfo}</strong>
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

export default DeleteAppointmentBill;
