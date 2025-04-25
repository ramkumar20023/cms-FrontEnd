import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import BackButton from "../../components/BackButton";
import { FaCalendarPlus } from "react-icons/fa";
import "../patients/common.css"; // Common CSS for styling
import logo from "../../Images/Helth-care.jpeg"; // Logo image
import { useNavigate } from "react-router-dom";

const AppointmentList = () => {
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [sortColumn, setSortColumn] = useState("AppointmentDate");
  const [sortOrder, setSortOrder] = useState("asc");
  const [filterUpcoming, setFilterUpcoming] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [appointmentsPerPage, setAppointmentsPerPage] = useState(5);

  useEffect(() => {
    fetchAppointments();
    fetchDoctors();
  }, []);

  const fetchAppointments = async () => {
    const token = localStorage.getItem("access_token");
    try {
      const res = await axios.get("http://localhost:8000/api/appointments/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAppointments(res.data);
    } catch (err) {
      console.error("Error fetching appointments:", err);
    }
  };

  const fetchDoctors = async () => {
    const token = localStorage.getItem("access_token");
    try {
      const res = await axios.get("http://localhost:8000/api/doctors/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDoctors(res.data);
    } catch (err) {
      console.error("Error fetching doctors:", err);
    }
  };

  const getDoctorName = (doctorId) => {
    const doctor = doctors.find((d) => d.DoctorId === doctorId);
    return doctor ? `${doctor.FirstName} ${doctor.LastName}` : "Unknown Doctor";
  };

  const handleDelete = async (id) => {
    const confirm = window.confirm("Are you sure you want to delete this appointment?");
    if (!confirm) return;

    const token = localStorage.getItem("access_token");
    try {
      await axios.delete(`http://localhost:8000/api/appointments/${id}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Appointment deleted successfully");
      fetchAppointments();
    } catch (err) {
      alert("Error deleting appointment");
      console.error(err);
    }
  };

  const filterAppointments = (appointments) => {
    return appointments.filter((a) => {
      if (filterUpcoming && new Date(a.AppointmentDate) <= new Date()) {
        return false;
      }

      // Filter by status if selected
      if (statusFilter !== "all" && a.Status !== statusFilter) {
        return false;
      }

      return true;
    });
  };

  const getStatusCount = (appointments, status) => {
    return appointments.filter((a) => a.Status === status).length;
  };

  // Sorting function
  const sortAppointments = (appointments) => {
    return appointments.sort((a, b) => {
      if (sortColumn === "AppointmentDate") {
        return sortOrder === "asc"
          ? new Date(a.AppointmentDate) - new Date(b.AppointmentDate)
          : new Date(b.AppointmentDate) - new Date(a.AppointmentDate);
      }
      if (sortColumn === "Status") {
        return sortOrder === "asc" ? a.Status.localeCompare(b.Status) : b.Status.localeCompare(a.Status);
      }
      return 0;
    });
  };

  const totalPages = Math.ceil(filterAppointments(appointments).length / appointmentsPerPage);

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    navigate("/login");
  }

  const navigate = useNavigate();



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
                        <Link to="/appointments">View Appointments</Link>
                      </li>
                      <li>
                        <Link to="/" onClick={handleLogout}>
                          Logout
                        </Link>
                      </li>
                    </ul>
                  </div>
    
    <div className="container mt-4">
      <BackButton />
      <div className="container mt-5">
        <div className="card shadow-lg p-4 rounded-lg border-0">
          <h2 className="text-center fw-bold mb-4 text-primary">
            <FaCalendarPlus className="me-2" />
            Appointments</h2>

          {/* Filters */}
          <div className="d-flex justify-content-between mb-3">
            <Link to="/addappointments" className="btn btn-success shadow-sm">
              + Add Appointment
            </Link>
            <div className="d-flex align-items-center">
              <label className="me-2 text-secondary">Filter Upcoming:</label>
              <input
                type="checkbox"
                checked={filterUpcoming}
                onChange={(e) => {
                  setCurrentPage(1);
                  setFilterUpcoming(e.target.checked);
                }}
              />
            </div>
            <div className="d-flex align-items-center">
              <label className="me-2 text-secondary">Status:</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="form-select form-select-sm"
              >
                <option value="all">All</option>
                <option value="scheduled">Scheduled</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          {/* Status Counters */}
          <div className="d-flex justify-content-between mb-3 text-muted">
            <div>Scheduled: {getStatusCount(appointments, "scheduled")}</div>
            <div>Completed: {getStatusCount(appointments, "completed")}</div>
            <div>Cancelled: {getStatusCount(appointments, "cancelled")}</div>
          </div>

          {/* Table */}
          <table className="table table-hover table-bordered table-striped">
          <thead className="table-dark">
              <tr>
                <th>SL No</th> {/* Serial number header */}
                <th
                  className="cursor-pointer"
                  onClick={() => {
                    setSortColumn("AppointmentDate");
                    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                  }}
                >
                  Date {sortColumn === "AppointmentDate" && (sortOrder === "asc" ? "↑" : "↓")}
                </th>
                <th>Patient</th>
                <th>Doctor</th>
                <th>Status</th>
                <th>Token</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortAppointments(filterAppointments(appointments))
                .slice((currentPage - 1) * appointmentsPerPage, currentPage * appointmentsPerPage)
                .map((a, index) => (
                  <tr key={a.id}>
                    <td>{(currentPage - 1) * appointmentsPerPage + index + 1}</td> {/* Serial number */}
                    <td>{new Date(a.AppointmentDate).toLocaleString()}</td>
                    <td>{a.get_patient_name}</td>
                    <td>{getDoctorName(a.Doctor)}</td>
                    <td>
                      <span
                        className={`badge ${
                          a.Status === "scheduled"
                            ? "bg-info"
                            : a.Status === "completed"
                            ? "bg-success"
                            : "bg-danger"
                        }`}
                      >
                        {a.Status.charAt(0).toUpperCase() + a.Status.slice(1)}
                      </span>
                    </td>
                    <td>
                      <span className="badge bg-secondary">{a.Token}</span>
                    </td>
                    <td>
                      <Link to={`/appointments/edit/${a.id}`} className="btn btn-primary btn-sm me-2 shadow-sm">
                        Edit
                      </Link>
                      <button onClick={() => handleDelete(a.id)} className="btn btn-danger btn-sm shadow-sm">
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              {appointments.length === 0 && (
                <tr>
                  <td colSpan="7" className="text-center">
                    No appointments found.
                  </td>
                </tr>
              )}
            </tbody>

          </table>

          {/* Pagination */}
          <div className="d-flex justify-content-between align-items-center mt-3">
            <div>
              Showing {appointmentsPerPage} per page | Total: {appointments.length}
            </div>
            <div>
              <button
                className="btn btn-outline-secondary btn-sm me-2 rounded-pill"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                Previous
              </button>
              <span>
                Page {currentPage} of {totalPages}
              </span>
              <button
                className="btn btn-outline-secondary btn-sm ms-2 rounded-pill"
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default AppointmentList;
