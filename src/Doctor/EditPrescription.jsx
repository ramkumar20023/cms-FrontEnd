import React, { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import axios from "axios";
import logo from "../Images/Health-Logo.png";
import "./doctor.css";

const EditPrescription = () => {
  const { id } = useParams(); // prescription id
  const [frequency, setFrequency] = useState("");
  const [dosage, setDosage] = useState("");
  const [noOfDays, setNoOfDays] = useState("");
  const [typedMedicine, setTypedMedicine] = useState("");
  const [selectedMedicines, setSelectedMedicines] = useState([]);
  const [appointmentId, setAppointmentId] = useState(null);
  const [status, setStatus] = useState("scheduled");
  const [alert, setAlert] = useState({ message: "", type: "" });

  const [allMedicines, setAllMedicines] = useState([]);
  const [appointments, setAppointments] = useState([]);

  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const header = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const prescriptionRes = await axios.get(
          `http://localhost:8000/api/prescription/${id}/`,
          header
        );
        const medicineRes = await axios.get(
          "http://localhost:8000/api/pharmacy/",
          header
        );
        const appointmentRes = await axios.get(
          "http://localhost:8000/api/appointments/",
          header
        );

        const prescription = prescriptionRes.data;
        console.log(prescription, "Prescription");

        setFrequency(prescription.Frequency);
        setDosage(prescription.Dosage);
        setNoOfDays(prescription.No_of_Days);
        setSelectedMedicines(
          medicineRes.data.filter((m) =>
            prescription.Medicine.includes(m.MedicineId)
          )
        );
        setAppointmentId(prescription.Appointment);

        const relatedAppointment = appointmentRes.data.find(
          (a) => a.AppointmentId === prescription.Appointment
        );
        setStatus(relatedAppointment?.Status || "scheduled");

        setAllMedicines(medicineRes.data);
        setAppointments(appointmentRes.data);
      } catch (error) {
        console.log("error", error.response?.data);
      }
    };

    fetchData();
  }, [id]);

  const showAlert = (message, type) => {
    setAlert({ message, type });

    setTimeout(() => {
      setAlert({ message: "", type: "" });
    }, 3000);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!appointmentId) {
      alert("Appointment missing");
      return;
    }

    const data = {
      Frequency: frequency,
      Dosage: dosage,
      No_of_Days: noOfDays,
      Appointment: appointmentId,
      Medicine: selectedMedicines.map((m) => m.MedicineId),
    };

    try {
      await axios.put(
        `http://localhost:8000/api/prescription/${id}/`,
        data,
        header
      );

      await axios.patch(
        `http://localhost:8000/api/appointments/${appointmentId}/`,
        { Status: status },
        header
      );

      showAlert("Prescription updated successfully!", "success");
      //   navigate("/ViewPrescription");
    } catch (error) {
      console.log("update error", error.response?.data);
      showAlert("Failed to update prescription", "danger");
    }
  };

  const handleAddMedicine = (medicine) => {
    if (!selectedMedicines.some((m) => m.MedicineId === medicine.MedicineId)) {
      setSelectedMedicines([...selectedMedicines, medicine]);
    }
    setTypedMedicine("");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div>
      {/* Navbar */}
      <div className="navbar">
        <div className="logo-container">
          <img
            src={logo}
            alt="Logo"
            className="logo-img"
            onClick={handleLogout}
          />
          <span className="logo-text">KIMS</span>
        </div>

        <ul className="nav-links">
          <li>
            <Link to="/ViewPrescription">Home</Link>
          </li>
          <li>
            <Link to="/" onClick={handleLogout}>
              Logout
            </Link>
          </li>
        </ul>
      </div>

      {alert.message && (
        <div
          className={`alert alert-${alert.type} text-center mx-auto`}
          role="alert"
          style={{
            position: "fixed",
            top: "20px",
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 9999,
            width: "400px",
            fontSize: "18px",
          }}
        >
          {alert.message}
        </div>
      )}

      {/* Edit Form */}
      <div className="container mt-4">
        <div className="card mx-auto" style={{ maxWidth: "600px" }}>
          <div className="card-body">
            <h2 className="card-title text-center mb-4 bg-primary p-2 text-white">
              Edit Prescription
            </h2>

            {/* Frequency */}
            <div className="mb-3">
              <label className="form-label">Frequency</label>
              <input
                type="text"
                className="form-control"
                value={frequency}
                onChange={(e) => setFrequency(e.target.value)}
              />
            </div>

            {/* Dosage */}
            <div className="mb-3">
              <label className="form-label">Dosage</label>
              <input
                type="text"
                className="form-control"
                value={dosage}
                onChange={(e) => setDosage(e.target.value)}
              />
            </div>

            {/* No of Days */}
            <div className="mb-3">
              <label className="form-label">No of Days</label>
              <input
                type="text"
                className="form-control"
                value={noOfDays}
                onChange={(e) => setNoOfDays(e.target.value)}
              />
            </div>

            {/* Status */}
            <div className="mb-3">
              <label className="form-label">Status</label>
              <select
                className="form-select"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="scheduled">Scheduled</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            {/* Medicine Search */}
            <div className="mb-3">
              <label className="form-label">Search Medicine</label>
              <input
                type="text"
                className="form-control"
                value={typedMedicine}
                onChange={(e) => setTypedMedicine(e.target.value)}
                placeholder="Type medicine name"
              />
              <ul className="list-group mt-2">
                {typedMedicine &&
                  allMedicines
                    .filter((m) =>
                      m.MedicineName.toLowerCase().includes(
                        typedMedicine.toLowerCase()
                      )
                    )
                    .map((m) => (
                      <li
                        key={m.MedicineId}
                        onClick={() => handleAddMedicine(m)}
                        className="list-group-item list-group-item-action"
                        style={{ cursor: "pointer" }}
                      >
                        {m.MedicineName}
                      </li>
                    ))}
              </ul>
            </div>

            {/* Selected Medicines */}
            <div className="mt-3">
              <h6>Selected Medicines</h6>
              <ul className="list-group">
                {selectedMedicines.map((m, idx) => (
                  <li key={idx} className="list-group-item">
                    {m.MedicineName}
                  </li>
                ))}
              </ul>
            </div>

            {/* Submit Button */}
            <div className="text-center mt-4">
              <button className="btn btn-success me-3" onClick={handleUpdate}>
                Update
              </button>
              <Link to="/ViewPrescription" className="btn btn-secondary">
                Back
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditPrescription;
