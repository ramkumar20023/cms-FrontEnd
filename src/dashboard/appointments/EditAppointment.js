import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams, Link } from "react-router-dom";
import { FaCalendarCheck } from "react-icons/fa";
import BackButton from "../../components/BackButton";
import "../patients/common.css"; // Common CSS for styling
import logo from "../../Images/Helth-care.jpeg"; // Logo image

const EditAppointment = () => {
  const [patientId, setPatientId] = useState("");
  const [doctorId, setDoctorId] = useState("");
  const [appointmentDate, setAppointmentDate] = useState("");
  const [status, setStatus] = useState("scheduled");
  const [remarks, setRemarks] = useState("");
  const [patients, setPatients] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [doctors, setDoctors] = useState([]);
  const [bookedSlots, setBookedSlots] = useState([]);
  const [errors, setErrors] = useState({});
  const [globalError, setGlobalError] = useState("");

  const { appointmentId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("access_token");

      try {
        const [patientRes, doctorRes, slotRes, appointmentRes] = await Promise.all([
          axios.get("http://localhost:8000/api/patients/", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("http://localhost:8000/api/doc/", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("http://localhost:8000/api/appointments/", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`http://localhost:8000/api/appointments/${appointmentId}/`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        const sortedPatients = patientRes.data.sort((a, b) =>
          (a.full_name || `${a.FirstName} ${a.LastName}`).localeCompare(
            b.full_name || `${b.FirstName} ${b.LastName}`
          )
        );

        const sortedDoctors = doctorRes.data.sort((a, b) =>
          (`${a.FirstName} ${a.LastName}`).localeCompare(`${b.FirstName} ${b.LastName}`)
        );

        setPatients(sortedPatients);
        setDoctors(sortedDoctors);
        const uniqueDepartments = [...new Set(sortedDoctors.map(doc => doc.DepartmentName))];
        setDepartments(uniqueDepartments);
        setBookedSlots(slotRes.data.map(a => ({
          doctorId: a.Doctor,
          datetime: new Date(a.AppointmentDate).toISOString(),
        })));

        setPatientId(appointmentRes.data.Patient);
        setDoctorId(appointmentRes.data.Doctor);
        setSelectedDepartment(
          sortedDoctors.find(d => d.DoctorId === appointmentRes.data.Doctor)?.DepartmentName || ""
        );
        const appointmentDateFromApi = new Date(appointmentRes.data.AppointmentDate);
        if (!isNaN(appointmentDateFromApi)) {
          setAppointmentDate(appointmentDateFromApi.toISOString());
        } else {
          setGlobalError("Invalid appointment date received from server.");
        }
        setStatus(appointmentRes.data.Status || "scheduled");
        setRemarks(appointmentRes.data.Remarks || "");
      } catch (err) {
        console.error("Failed to fetch data:", err);
        setGlobalError("Error loading appointment details.");
      }
    };

    fetchData();
  }, [appointmentId]);

  const validateForm = () => {
    const newErrors = {};
    const selectedDate = new Date(appointmentDate);
    const now = new Date();

    if (!patientId) newErrors.patientId = "Patient is required.";
    if (!doctorId) newErrors.doctorId = "Doctor is required.";

    if (!appointmentDate) {
      newErrors.appointmentDate = "Appointment date is required.";
    } else if (isNaN(selectedDate)) {
      newErrors.appointmentDate = "Invalid date format.";
    } else {
      const maxDate = new Date();
      maxDate.setDate(now.getDate() + 5);

      if (selectedDate < now && selectedDate.toISOString() !== appointmentDate) {
        newErrors.appointmentDate = "Date must be in the future.";
      } else if (selectedDate > maxDate && selectedDate.toISOString() !== appointmentDate) {
        newErrors.appointmentDate = "Only next 5 days are allowed.";
      }

      const hour = selectedDate.getHours();
      if ((hour < 10 || hour >= 13) && selectedDate.toISOString() !== appointmentDate) {
        newErrors.appointmentDate = "Only between 10 AM and 1 PM allowed.";
      }

      const slotTaken = bookedSlots.some(
        s =>
          s.doctorId.toString() === doctorId &&
          s.datetime === selectedDate.toISOString() &&
          s.datetime !== appointmentDate // Exclude current appointment slot
      );

      if (slotTaken) {
        newErrors.appointmentDate = "This time slot is already booked.";
      }
    }

    if (!status) newErrors.status = "Status is required.";
    return newErrors;
  };

  const generateAvailableSlots = () => {
    if (!doctorId) return [];

    const slots = [];
    const now = new Date();
    const max = new Date();
    max.setDate(now.getDate() + 5);

    // Add the current appointment's slot if it exists and is valid
    if (appointmentDate && !isNaN(new Date(appointmentDate))) {
      slots.push(appointmentDate);
    }

    // Generate available slots for the next 5 days, 10 AM–1 PM
    for (let d = new Date(now); d <= max; d.setDate(d.getDate() + 1)) {
      for (let hour = 10; hour < 13; hour++) {
        const slot = new Date(d);
        slot.setHours(hour, 0, 0, 0);
        const iso = slot.toISOString();

        // Skip if this is the current appointment's slot (already added)
        if (iso === appointmentDate) continue;

        const isPast = slot < new Date();
        const isTaken = bookedSlots.some(
          s => s.doctorId.toString() === doctorId && s.datetime === iso
        );

        if (!isPast && !isTaken) {
          slots.push(iso);
        }
      }
    }

    // Sort slots to ensure chronological order
    return slots.sort();
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
        `http://localhost:8000/api/appointments/${appointmentId}/`,
        {
          Patient: patientId,
          Doctor: doctorId,
          AppointmentDate: appointmentDate,
          Status: status,
          Remarks: remarks,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert("Appointment updated successfully");
      navigate("/appointments");
    } catch (err) {
      console.error(err);
      if (err.response?.data) {
        setGlobalError("Server validation failed.");
        setErrors(err.response.data);
      } else {
        setGlobalError("Something went wrong.");
      }
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
            <Link to="/appointments">View Appointment</Link>
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
              <FaCalendarCheck className="me-2" />
              Edit Appointment
            </h2>

            {globalError && (
              <div className="alert alert-danger">{globalError}</div>
            )}

            <form onSubmit={handleSubmit} noValidate>
              {/* Patient Dropdown */}
              <div className="mb-3">
                <label className="form-label fw-semibold">Patient</label>
                <select
                  className={`form-select ${errors.patientId ? "is-invalid" : ""}`}
                  value={patientId}
                  onChange={(e) => setPatientId(e.target.value)}
                  required
                >
                  <option value="">Select a patient</option>
                  {patients.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.id} - {p.full_name || `${p.FirstName} ${p.LastName}`}
                    </option>
                  ))}
                </select>
                {errors.patientId && (
                  <div className="invalid-feedback">{errors.patientId}</div>
                )}
              </div>

              {/* Department Dropdown */}
              <div className="mb-3">
                <label className="form-label fw-semibold">Department</label>
                <select
                  className="form-select"
                  value={selectedDepartment}
                  onChange={(e) => setSelectedDepartment(e.target.value)}
                >
                  <option value="">Select a department</option>
                  {departments.map((dept, idx) => (
                    <option key={idx} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
              </div>

              {/* Doctor Dropdown */}
              <div className="mb-3">
                <label className="form-label fw-semibold">Doctor</label>
                <select
                  className={`form-select ${errors.doctorId ? "is-invalid" : ""}`}
                  value={doctorId}
                  onChange={(e) => setDoctorId(e.target.value)}
                  required
                >
                  <option value="">Select a doctor</option>
                  {doctors
                    .filter((d) => !selectedDepartment || d.DepartmentName === selectedDepartment)
                    .map((d) => (
                      <option key={d.DoctorId} value={d.DoctorId}>
                        {d.DoctorId} - {d.FirstName} {d.LastName} - ({d.DepartmentName})
                      </option>
                    ))}
                </select>
                {errors.doctorId && (
                  <div className="invalid-feedback">{errors.doctorId}</div>
                )}
              </div>

              {/* Appointment Slot Dropdown */}
              <div className="mb-3">
                <label className="form-label fw-semibold">Available Time Slots</label>
                <select
                  className={`form-select ${errors.appointmentDate ? "is-invalid" : ""}`}
                  value={appointmentDate}
                  onChange={(e) => setAppointmentDate(e.target.value)}
                  disabled={!doctorId}
                  required
                >
                  <option value="">Select a slot</option>
                  {generateAvailableSlots().map((slot) => (
                    <option key={slot} value={slot}>
                      {new Date(slot).toLocaleString()}
                    </option>
                  ))}
                  </select>
                {errors.appointmentDate && (
                  <div className="invalid-feedback">{errors.appointmentDate}</div>
                )}
              </div>

              {/* Status */}
              <div className="mb-3">
                <label className="form-label fw-semibold">Status</label>
                <select
                  className={`form-select ${errors.status ? "is-invalid" : ""}`}
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  required
                >
                  <option value="">Select status</option>
                  <option value="scheduled">Scheduled</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
                {errors.status && (
                  <div className="invalid-feedback">{errors.status}</div>
                )}
              </div>

              {/* Remarks */}
              <div className="mb-4">
                <label className="form-label fw-semibold">Remarks</label>
                <textarea
                  className={`form-control ${errors.Remarks ? "is-invalid" : ""}`}
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  rows="3"
                />
                {errors.Remarks && (
                  <div className="invalid-feedback">{errors.Remarks}</div>
                )}
              </div>

              <button type="submit" className="btn btn-primary w-100 shadow-sm">
                Update Appointment
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

export default EditAppointment;