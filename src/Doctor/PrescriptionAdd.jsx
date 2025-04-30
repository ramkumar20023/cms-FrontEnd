import React, { useEffect, useState } from "react";
import logo from "../Images/Health-Logo.png";
import "./doctor.css";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const AddPrescription = () => {
  const [frequency, setFrequency] = useState("");
  const [dosage, setDosage] = useState("");
  const [noOfDays, setNoOfDays] = useState("");
  const [typedMedicine, setTypedMedicine] = useState("");
  const [selectedMedicines, setSelectedMedicines] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState("");
  const [medicines, setMedicines] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("");

  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  const header = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  useEffect(() => {
    const fetchPrescription = async () => {
      try {
        const medicineRes = await axios.get(
          "http://localhost:8000/api/pharmacy/",
          header
        );
        const appointmentRes = await axios.get(
          "http://localhost:8000/api/appointments/",
          header
        );
        console.log("medicine", medicineRes.data);
        console.log("appointment", appointmentRes.data);

        setMedicines(medicineRes.data);
        setAppointments(appointmentRes.data);
      } catch (error) {
        console.log("error", error.response?.data);
      }
    };
    fetchPrescription();
  }, []);

  const handleAddMedicine = (medicine) => {
    if (!selectedMedicines.some((m) => m.MedicineId === medicine.MedicineId)) {
      setSelectedMedicines([...selectedMedicines, medicine]);
    }
    setTypedMedicine("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Selected Appointment ID:", selectedAppointment);

    if (!selectedAppointment) {
      alert("Please select an appointment.");
      return;
    }

    const data = {
      Frequency: frequency,
      Dosage: dosage,
      No_of_Days: noOfDays,
      Appointment: selectedAppointment,
      Medicine: selectedMedicines.map((m) => m.MedicineId),
    };
    console.log("sending data", data);

    try {
      await axios.post("http://localhost:8000/api/prescription/", data, header);
      alert("Prescription Added Successfully");

      await axios.patch(
        `http://localhost:8000/api/appointments/${selectedAppointment}/`,
        { Status: "completed" },
        header
      );

      setFrequency("");
      setDosage("");
      setNoOfDays("");
      setSelectedMedicines([]);
      setSelectedAppointment("");
      showAlert("Prescription Added Successfully!", "success");
    } catch (error) {
      console.log("Error", error.response?.data);
      showAlert("Prescription Add Failed!", "danger");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const showAlert = (message, type) => {
    setAlertMessage(message);
    setAlertType(type);

    setTimeout(() => {
      setAlertMessage("");
      setAlertType("");
    }, 3000); // alert will disappear after 3 seconds
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
            <Link to="/DoctorDashboard">Dashboard</Link>
          </li>
          <li>
            <Link to="/ViewPrescription">View Prescription</Link>
          </li>
          <li>
            <Link to="/">Logout</Link>
          </li>
        </ul>
      </div>

      {alertMessage && (
        <div className={`alert alert-${alertType} text-center`} role="alert">
          {alertMessage}
        </div>
      )}

      {/* Form inside Bootstrap Card */}
      <div className="container mt-4">
        <div className="card mx-auto" style={{ maxWidth: "600px" }}>
          <div className="card-body">
            <h2 className="card-title text-center mb-4 bg-primary p-2 text-white">
              Add Prescription
            </h2>

            <div className="mb-3">
              <label className="form-label">Select Appointment</label>
              <select
                className="form-select"
                onChange={(e) => setSelectedAppointment(Number(e.target.value))}
                value={selectedAppointment}
              >
                <option value="">--select appointment--</option>
                {appointments
                  .filter((a) => a.Status === "scheduled")
                  .map((a) => (
                    <option key={a.AppointmentId} value={a.AppointmentId}>
                      {a.get_patient_name} |{" "}
                      {new Date(a.AppointmentDate).toLocaleDateString()} | Dr.{" "}
                      {a.get_doctor_name}
                    </option>
                  ))}
              </select>
            </div>

            <div className="mb-3">
              <label className="form-label">Frequency</label>
              <input
                type="text"
                className="form-control"
                onChange={(e) => setFrequency(e.target.value)}
                value={frequency}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Dosage</label>
              <input
                type="text"
                className="form-control"
                onChange={(e) => setDosage(e.target.value)}
                value={dosage}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">No Of Days</label>
              <input
                type="text"
                className="form-control"
                onChange={(e) => setNoOfDays(e.target.value)}
                value={noOfDays}
              />
            </div>

            {/* Medicine Search and Add */}
            <div className="mb-3">
              <label className="form-label">Medicines</label>
              <input
                type="text"
                className="form-control"
                placeholder="Type Medicine Name"
                value={typedMedicine}
                onChange={(e) => setTypedMedicine(e.target.value)}
              />
              <ul className="list-group mt-2">
                {typedMedicine &&
                  medicines
                    .filter((med) =>
                      med.MedicineName.toLowerCase().includes(
                        typedMedicine.toLowerCase()
                      )
                    )
                    .map((med) => (
                      <li
                        key={med.MedicineId}
                        onClick={() => handleAddMedicine(med)}
                        className="list-group-item list-group-item-action"
                        style={{ cursor: "pointer" }}
                      >
                        {med.MedicineName}
                      </li>
                    ))}
              </ul>

              {/* Selected Medicines */}
              <div className="mt-3">
                <h6>Selected Medicines List:</h6>
                <ul className="list-group">
                  {selectedMedicines.map((m, idx) => (
                    <li key={idx} className="list-group-item">
                      {m.MedicineName}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Buttons */}
            <div className="text-center mt-4">
              <button
                type="submit"
                className="btn btn-success me-2"
                onClick={handleSubmit}
              >
                Submit
              </button>

              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => {
                  setFrequency("");
                  setDosage("");
                  setNoOfDays("");
                  setSelectedMedicines([]);
                  setTypedMedicine("");
                  setSelectedAppointment("");
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddPrescription;
