import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import BackButton from "../../components/BackButton";
import { FaFileInvoice } from "react-icons/fa";
import "../patients/common.css"; // Common CSS for styling
import logo from "../../Images/Helth-care.jpeg"; // Logo image
import { useNavigate } from "react-router-dom";

const BillingList = () => {
  const [bills, setBills] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortColumn, setSortColumn] = useState("CreatedAt");
  const [sortOrder, setSortOrder] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [billsPerPage, setBillsPerPage] = useState(5);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const token = localStorage.getItem("access_token");
    const headers = { Authorization: `Bearer ${token}` };

    try {
      const [billRes, appointmentRes, doctorRes, patientRes] = await Promise.all([
        axios.get("http://localhost:8000/api/bills/", { headers }),
        axios.get("http://localhost:8000/api/appointments/", { headers }),
        axios.get("http://localhost:8000/api/doctors/", { headers }),
        axios.get("http://localhost:8000/api/patients/", { headers }),
      ]);

      setBills(billRes.data);
      setAppointments(appointmentRes.data);
      setDoctors(doctorRes.data);
      setPatients(patientRes.data);
    } catch (err) {
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  };

  const getAppointmentDetails = (id) =>
    appointments.find((a) => Number(a.AppointmentId) === Number(id));

  const getDoctorName = (appointmentId) => {
    const appointment = getAppointmentDetails(appointmentId);
    const doctor = doctors.find((d) => Number(d.DoctorId) === Number(appointment?.Doctor));
    return doctor ? `${doctor.FirstName} ${doctor.LastName}` : "Unknown Doctor";
  };

  const getPatientName = (appointmentId) => {
    const appointment = getAppointmentDetails(appointmentId);
    const patient = patients.find((p) => Number(p.id) === Number(appointment?.Patient));
    return patient ? patient.full_name : "Unknown Patient";
  };

  const handleSort = (column) => {
    const newOrder = sortColumn === column && sortOrder === "asc" ? "desc" : "asc";
    setSortColumn(column);
    setSortOrder(newOrder);
  };

  const sortBills = (bills) => {
    return [...bills].sort((a, b) => {
      const aVal = a[sortColumn] ?? "";
      const bVal = b[sortColumn] ?? "";
      if (aVal < bVal) return sortOrder === "asc" ? -1 : 1;
      if (aVal > bVal) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });
  };

  const filterBills = (bills) =>
    bills.filter((bill) => {
      const patient = getPatientName(bill.Appointment).toLowerCase();
      const doctor = getDoctorName(bill.Appointment).toLowerCase();
      const billId = String(bill.BillId);
      return (
        patient.includes(searchQuery.toLowerCase()) ||
        doctor.includes(searchQuery.toLowerCase()) ||
        billId.includes(searchQuery)
      );
    });

  const paginateBills = (bills) => {
    const startIndex = (currentPage - 1) * billsPerPage;
    return bills.slice(startIndex, startIndex + billsPerPage);
  };

  const processedBills = paginateBills(sortBills(filterBills(bills)));
  const totalPages = Math.ceil(filterBills(bills).length / billsPerPage);


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
                              <Link to="/patients">View Patient</Link>
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
      <div className="card shadow-lg border-0 rounded-4 p-4 mt-5">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="text-center fw-bold mb-4 text-primary">
            <FaFileInvoice className="me-2" />
             Appointment Bills</h2>
          <Link to="/billsadd" className="btn btn-success px-4 shadow-sm">
            <i className="fas fa-plus me-2"></i> Add Bill
          </Link>
        </div>

        <div className="d-flex justify-content-between align-items-center mb-3">
          <input
            type="text"
            placeholder="Search by Patient, Doctor, or Bill ID"
            className="form-control shadow-sm w-50"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
          />
          <select
            className="form-select w-auto"
            value={billsPerPage}
            onChange={(e) => {
              setBillsPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
          >
            {[5, 10, 15, 20].map((num) => (
              <option key={num} value={num}>{num} per page</option>
            ))}
          </select>
        </div>

        {loading ? (
          <div className="text-center mt-5">Loading bills...</div>
        ) : (
          <>
            <table className="table table-hover table-striped">
              <thead className="table-dark">
                <tr>
                  <th>SL No</th>
                  <th onClick={() => handleSort("CreatedAt")} className="clickable-column">
                    Date {sortColumn === "CreatedAt" && (sortOrder === "asc" ? "↑" : "↓")}
                  </th>
                  <th>Patient</th>
                  <th>Doctor</th>
                  <th>Total</th>
                  <th>Appointment Token</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {processedBills.length > 0 ? (
                  processedBills.map((bill, index) => (
                    <tr key={bill.BillId}>
                      <td>{(currentPage - 1) * billsPerPage + index + 1}</td>
                      <td>{new Date(bill.CreatedAt).toLocaleString()}</td>
                      <td>{getPatientName(bill.Appointment)}</td>
                      <td>{getDoctorName(bill.Appointment)}</td>
                      <td>₹{bill.TotalCost}</td>
                      <td>{bill.Token}</td>
                      <td>
                        <Link to={`/bills/edit/${bill.BillId}`} className="btn btn-primary btn-sm me-2">
                          Edit
                        </Link>
                        <Link to={`/bills/delete/${bill.BillId}`} className="btn btn-danger btn-sm">
                          Delete
                        </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="text-center text-muted">No bills found.</td>
                  </tr>
                )}
              </tbody>
            </table>

            {processedBills.length > 0 && (
              <div className="pagination d-flex justify-content-center mt-4">
                <button
                  className="btn btn-secondary me-2 shadow-sm"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(currentPage - 1)}
                >
                  Previous
                </button>
                <span className="align-self-center">{currentPage} / {totalPages}</span>
                <button
                  className="btn btn-secondary ms-2 shadow-sm"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(currentPage + 1)}
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
    </div>
  );
};

export default BillingList;
