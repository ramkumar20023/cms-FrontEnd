import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams, Link } from "react-router-dom";
import { FaFileInvoice } from "react-icons/fa";
import BackButton from "../../components/BackButton";
import "../patients/common.css";
import logo from "../../Images/Helth-care.jpeg";

const EditAppointmentBill = () => {
  const [appointment, setAppointment] = useState(null);
  const [consultantFees, setConsultantFees] = useState("");
  const [serviceCharge, setServiceCharge] = useState("");
  const [doctorName, setDoctorName] = useState("");
  const [patientName, setPatientName] = useState("");
  const [errors, setErrors] = useState({});
  const [globalError, setGlobalError] = useState("");
  const navigate = useNavigate();
  const { id } = useParams(); // bill ID

  useEffect(() => {
    const token = localStorage.getItem("access_token");

    const fetchBillAndRelatedData = async () => {
      try {
        // Fetch the bill
        const billRes = await axios.get(`http://localhost:8000/api/bills/${id}/`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const appointmentId = billRes.data.Appointment;
        setServiceCharge(billRes.data.service_charge || "100"); // Default to 100 if not set

        // Fetch appointment to get consultant fees and other details
        const appointmentRes = await axios.get(`http://localhost:8000/api/appointments/${appointmentId}/`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const appointmentData = appointmentRes.data;
        setAppointment(appointmentData);
        setPatientName(appointmentData.get_patient_name || "");
        setDoctorName(appointmentData.get_doctor_name || "");
        
        // Set consultant fees from appointment data (not editable)
        const appointmentConsultantFees = appointmentData.consultant_fees || appointmentData.get_doctor?.consultant_fees || "0";
        setConsultantFees(appointmentConsultantFees);

      } catch (error) {
        console.error("Error fetching bill or related data:", error);
        setGlobalError("Failed to load bill data");
      }
    };

    fetchBillAndRelatedData();
  }, [id]);

  const validateForm = () => {
    const newErrors = {};
    const serviceChargeNum = parseFloat(serviceCharge);

    if (isNaN(serviceChargeNum) || serviceChargeNum < 0) {
      newErrors.serviceCharge = "Service Charge must be a positive number.";
    }

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
      await axios.put(
        `http://localhost:8000/api/bills/${id}/`,
        {
          Appointment: appointment?.id,
          ConsultantFees: parseFloat(consultantFees),
          ServiceCharge: parseFloat(serviceCharge),
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert("Bill updated successfully");
      navigate("/bills");
    } catch (error) {
      setGlobalError("Error updating bill");
      console.error(error);
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
          <li>
            <Link to="/dashboard">Dashboard</Link>
          </li>
          <li>
            <Link to="/bills">View Bill</Link>
          </li>
          <li>
            <Link to="/" onClick={handleLogout}>
              Logout
            </Link>
          </li>
        </ul>
      </div>

      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <div className="card shadow-sm rounded-4 border-0 p-4 bg-light">
            <h2 className="text-center fw-bold mb-4 text-primary">
              <FaFileInvoice className="me-2" />
              Edit Appointment Bill
            </h2>

            {globalError && (
              <div className="alert alert-danger">{globalError}</div>
            )}

            <form onSubmit={handleSubmit} noValidate>
              {appointment && (
                <>
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Patient</label>
                    <input
                      type="text"
                      className="form-control"
                      value={patientName}
                      readOnly
                      style={{ backgroundColor: "#f8f9fa", cursor: "default" }}
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-semibold">Doctor</label>
                    <input
                      type="text"
                      className="form-control"
                      value={doctorName}
                      readOnly
                      style={{ backgroundColor: "#f8f9fa", cursor: "default" }}
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-semibold">Consultant Fees</label>
                    <input
                      type="number"
                      className="form-control"
                      value={consultantFees}
                      readOnly
                      style={{ backgroundColor: "#f8f9fa", cursor: "default" }}
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-semibold">Service Charge</label>
                    <input
                      type="number"
                      className="form-control"
                      value={serviceCharge}
                      onChange={(e) => setServiceCharge(e.target.value)}
                      required
                      step="0.01"
                    />
                    {errors.serviceCharge && (
                      <div className="text-danger">{errors.serviceCharge}</div>
                    )}
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-semibold">Total Amount</label>
                    <input
                      type="text"
                      className="form-control"
                      value={`₹${(
                        parseFloat(consultantFees || 0) +
                        parseFloat(serviceCharge || 0)
                      ).toFixed(2)}`}
                      readOnly
                      style={{ backgroundColor: "#f1f1f1", fontWeight: "bold" }}
                    />
                  </div>
                </>
              )}

              <button type="submit" className="btn btn-primary w-100 shadow-sm">
                Update Bill
              </button>
            </form>

            <div className="mt-3">
              <BackButton className="btn btn-secondary w-100" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditAppointmentBill;