import React, { useEffect, useState } from "react";
import axios from "axios";
import logo from "../Images/Health-Logo.png";
import "./doctor.css";
import { Link, useNavigate, useParams } from "react-router-dom";

const EditConsultation = () => {
  const [notes, setNotes] = useState("");
  const [appointments, setAppointments] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState("");
  const [selectedPrescription, setSelectedPrescription] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();
  const { consultationId } = useParams(); 

  useEffect(() => {
    const token = localStorage.getItem("token");

    const header = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const fetchData = async () => {
      try {
        const [appresponse, prescRes, docRes, consultationRes] = await Promise.all([
          axios.get("http://localhost:8000/api/appointments/", header),
          axios.get("http://localhost:8000/api/prescription/", header),
          axios.get("http://localhost:8000/api/doctorinform/", header),
          axios.get(`http://localhost:8000/api/consultation/${consultationId}/`, header)
        ]);

        setDoctors(docRes.data);
        setPrescriptions(prescRes.data);
        setAppointments(appresponse.data);

        const consultationData = consultationRes.data;
        setNotes(consultationData.Notes || "");
        
        // Set selected values after all data is loaded
        if (appresponse.data && consultationData.Appointment) {
          const appointment = appresponse.data.find(
            (appt) => appt.AppointmentId === consultationData.Appointment
          );
          setSelectedAppointment(appointment || "");
        }

        if (prescRes.data && consultationData.Prescription) {
          const prescription = prescRes.data.find(
            (pres) => pres.PrescriptionId === consultationData.Prescription
          );
          setSelectedPrescription(prescription || "");
        }

        if (docRes.data && consultationData.doctordetail) {
          const doctor = docRes.data.find(
            (doc) => doc.informId === consultationData.doctordetail
          );
          setSelectedDoctor(doctor || "");
        }

        setIsLoading(false);
      } catch (error) {
        console.error(
          "Error fetching data",
          error.response?.data || error.message
        );
        setIsLoading(false);
      }
    };

    fetchData();
  }, [consultationId]);

  const token = localStorage.getItem("token");
  const header = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      Notes: notes,
      Appointment: selectedAppointment?.AppointmentId,
      Prescription: selectedPrescription?.PrescriptionId,
      doctordetail: selectedDoctor?.informId,
    };
    console.log("send data", payload);

    try {
      await axios.put(
        `http://localhost:8000/api/consultation/${consultationId}/`,
        payload,
        header
      );
      setMessage("Consultation updated successfully!");
    } catch (error) {
      console.error("Error updating consultation", error);
      setMessage("Failed to update consultation.");
    }

    setTimeout(() => {
      setMessage("");
    }, 3000);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  if (isLoading) {
    return <div className="text-center mt-5">Loading...</div>;
  }

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
            style={{ cursor: "pointer" }}
          />
          <span className="logo-text">KIMS</span>
        </div>

        <ul className="nav-links">
          <li>
            <Link to="/DoctorDashboard">Dashboard</Link>
          </li>
          <li>
            <Link to="/ViewConsultation">View Consultation</Link>
          </li>
          <li>
            <Link to="/">Logout</Link>
          </li>
        </ul>
      </div>

      {/* Main Card */}
      <div className="container mt-5 d-flex justify-content-center">
        <div
          className="card p-4 shadow-lg"
          style={{ width: "500px", borderRadius: "20px" }}
        >
          <h3 className="text-center mb-4 bg-primary text-white p-2">
            Edit Consultation
          </h3>

          {message && (
            <div className="alert alert-info text-center">{message}</div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Appointment input */}
            <select
              className="form-control mb-3"
              value={
                selectedAppointment ? selectedAppointment.AppointmentId : ""
              }
              onChange={(e) => {
                const selected = appointments.find(
                  (appt) => appt.AppointmentId === parseInt(e.target.value)
                );
                setSelectedAppointment(selected);
              }}
              required
            >
              <option value="">Select Appointment</option>
              {appointments.map((appt) => (
                <option key={appt.AppointmentId} value={appt.AppointmentId}>
                  {`${appt.get_patient_name} | ${new Date(
                    appt.AppointmentDate
                  ).toLocaleDateString()} ${new Date(
                    appt.AppointmentDate
                  ).toLocaleTimeString()} | ${appt.get_doctor_name}`}
                </option>
              ))}
            </select>

            {/* Prescription input */}
            <input
              className="form-control mb-3"
              list="prescriptionOptions"
              placeholder="Select Prescription"
              value={
                selectedPrescription
                  ? `${selectedPrescription.Frequency} | ${selectedPrescription.Dosage}`
                  : ""
              }
              onChange={(e) => {
                const selected = prescriptions.find(
                  (pres) =>
                    `${pres.Frequency} | ${pres.Dosage}` === e.target.value
                );
                setSelectedPrescription(selected);
              }}
            />
            <datalist id="prescriptionOptions">
              {prescriptions.map((pres) => (
                <option
                  key={pres.PrescriptionId}
                  value={`${pres.Frequency} | ${pres.Dosage}`}
                ></option>
              ))}
            </datalist>

            {/* Doctor input */}
            <input
              className="form-control mb-3"
              list="doctorOptions"
              placeholder="Select Doctor"
              value={selectedDoctor ? `Dr. ${selectedDoctor.DoctorName}` : ""}
              onChange={(e) => {
                const selected = doctors.find(
                  (doc) => `Dr. ${doc.DoctorName}` === e.target.value
                );
                setSelectedDoctor(selected);
              }}
              required
            />
            <datalist id="doctorOptions">
              {doctors.map((doc) => (
                <option
                  key={doc.informId}
                  value={`Dr. ${doc.DoctorName}`}
                ></option>
              ))}
            </datalist>

            {/* Notes */}
            <div className="mb-3">
              <label className="form-label">Notes</label>
              <textarea
                className="form-control"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows="4"
                required
              ></textarea>
            </div>

            {/* Submit button */}
            <div className="d-flex justify-content-center gap-3">
              <button type="submit" className="btn btn-success">
                Submit
              </button>
              <Link to="/ViewConsultation" className="btn btn-secondary">Back</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditConsultation;