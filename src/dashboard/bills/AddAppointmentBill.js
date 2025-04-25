import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import BackButton from "../../components/BackButton";
import { FaFileInvoice } from "react-icons/fa";
import { Link } from "react-router-dom";
import "../patients/common.css";
import logo from "../../Images/Helth-care.jpeg";

const AddAppointmentBill = () => {
  const [appointmentId, setAppointmentId] = useState("");
  const [consultantDoctorId, setConsultantDoctorId] = useState("");
  const [consultantFeeDisplay, setConsultantFeeDisplay] = useState("");
  
  const [appointments, setAppointments] = useState([]);
  const [errors, setErrors] = useState({});
  const [globalError, setGlobalError] = useState("");

  const navigate = useNavigate();
  const serviceCharge = 100; // Constant service charge value

  useEffect(() => {
    const fetchAppointments = async () => {
      const token = localStorage.getItem("access_token");
      try {
        const res = await axios.get("http://localhost:8000/api/appointments/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAppointments(res.data);
      } catch (error) {
        console.error("Error fetching appointments:", error);
        setGlobalError("Failed to load appointments. Please try again.");
      }
    };

    fetchAppointments();
  }, []);

  const validateForm = () => {
    const newErrors = {};
    if (!appointmentId) newErrors.appointmentId = "Appointment is required.";
    if (!consultantDoctorId) newErrors.consultantFees = "Consultant fees could not be determined.";
    if (!serviceCharge) newErrors.serviceCharge = "Service charge is required.";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("access_token");
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    try {
      await axios.post(
        "http://localhost:8000/api/bills/",
        {
          Appointment: appointmentId,
          Consultant_fees: parseInt(consultantDoctorId), // Ensure Consultant_fees is an integer (Doctor ID)
          ServiceCharge: parseFloat(serviceCharge), // Service charge is a constant value
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert("Appointment bill added successfully");
      navigate("/bills");
    } catch (error) {
      console.error("Error adding bill:", error);
      if (error.response?.data) {
        setGlobalError("Server validation failed. Please check your input.");
        setErrors(error.response.data);
      } else {
        setGlobalError("Something went wrong. Please try again.");
      }
    }
  };

  const handleAppointmentChange = (e) => {
    const selectedId = e.target.value;
    setAppointmentId(selectedId);

    const selectedAppointment = appointments.find((a) => a.id.toString() === selectedId);
    if (selectedAppointment) {
      setConsultantDoctorId(selectedAppointment.Doctor); // Set Doctor ID
      setConsultantFeeDisplay(selectedAppointment.consultant_fees); // Set Consultant Fees
    } else {
      setConsultantDoctorId(""); // Clear Doctor ID if no appointment is selected
      setConsultantFeeDisplay(""); // Clear Consultant Fees
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    navigate("/login");
  };

  return (
    <div>
      <div className="navbar">
        <div className="logo-container">
          <img src={logo} alt="Logo" className="logo-img" />
          <span className="logo-text">KIMS</span>
        </div>
        <ul className="nav-links">
          <li><Link to="/dashboard">Dashboard</Link></li>
          <li><Link to="/bills">View Bill</Link></li>
          <li><Link to="/" onClick={handleLogout}>Logout</Link></li>
        </ul>
      </div>

      <div className="container mt-5">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="card shadow p-4 mb-5">
              <h2 className="text-center fw-bold mb-4 text-primary">
                <FaFileInvoice className="me-2" />
                Add Appointment Bill
              </h2>

              {globalError && <div className="alert alert-danger">{globalError}</div>}

              <form onSubmit={handleSubmit}>
                {/* Appointment Dropdown */}
                <div className="mb-3">
                  <label className="form-label">Appointment</label>
                  <select
                    className="form-control"
                    value={appointmentId}
                    onChange={handleAppointmentChange}
                    required
                  >
                    <option value="">Select appointment</option>
                    {appointments.map((a) => (
                      <option key={a.id} value={a.id}>
                        {`${a.get_patient_name} with ${a.get_doctor_name} on ${new Date(a.AppointmentDate).toLocaleString()}`}
                      </option>
                    ))}
                  </select>
                  {errors.appointmentId && <div className="text-danger">{errors.appointmentId}</div>}
                </div>

                {/* Consultant Fee (Auto-Filled) */}
                <div className="mb-3">
                  <label className="form-label">Consultant Fees</label>
                  <input
                    type="text"
                    className="form-control"
                    value={consultantFeeDisplay}
                    readOnly
                  />
                  {errors.consultantFees && <div className="text-danger">{errors.consultantFees}</div>}
                </div>

                {/* Service Charge */}
                <div className="mb-3">
                  <label className="form-label">Service Charge</label>
                  <input
                    type="number"
                    className="form-control"
                    value={serviceCharge}
                    readOnly
                    required
                  />
                  {errors.serviceCharge && <div className="text-danger">{errors.serviceCharge}</div>}
                </div>

                {/* Total Amount */}
                <div className="mb-3">
                  <label className="form-label">Total Amount</label>
                  <input
                    type="text"
                    className="form-control"
                    value={`₹${(
                      parseFloat(consultantFeeDisplay || 0) +
                      parseFloat(serviceCharge || 0)
                    ).toFixed(2)}`}
                    readOnly
                  />
                </div>

                <button type="submit" className="btn btn-primary w-100">
                  Add Bill
                </button>
              </form>

              <div className="mt-3">
                <BackButton className="btn btn-secondary w-100" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddAppointmentBill;