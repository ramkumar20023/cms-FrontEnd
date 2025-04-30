import React, { useEffect, useState } from "react";
import logo from "../Images/Health-Logo.png";
import { useNavigate, Link } from "react-router-dom";
import { Modal, Button } from "react-bootstrap";
import axios from "axios";
import "../Doctor/doctor.css";
import { TablePagination } from "@mui/material";

const ViewPatientHistory = () => {
  const [history, setHistory] = useState([]);
  const [filteredHistory, setFilteredHistory] = useState([]);
  const [labReports, setLabReports] = useState([]);
  const [consultations, setConsultations] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchActive, setSearchActive] = useState(false);

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
        const [
          labRes,
          consultationsRes,
          patientHistoryRes,
          doctorsRes,
          appres,
        ] = await Promise.all([
          axios.get("http://localhost:8000/api/labtests/", header),
          axios.get("http://localhost:8000/api/consultation/", header),
          axios.get("http://localhost:8000/api/patienthistory/", header),
          axios.get("http://localhost:8000/api/doctorinform/", header),
          axios.get("http://localhost:8000/api/appointments/", header),
        ]);

        setLabReports(labRes.data);
        setConsultations(consultationsRes.data);
        setHistory(patientHistoryRes.data);
        setFilteredHistory(patientHistoryRes.data);
        setDoctors(doctorsRes.data);
        setAppointments(appres.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);

  const getDoctorName = (id) => {
    const doc = doctors.find((d) => d.informId === id);
    return doc ? doc.DoctorName : "N/A";
  };

  const getLabResult = (id) => {
    const lab = labReports.find((l) => l.LaboratoryId === id);
    return lab ? `${lab.TestName}: ${lab.TestResult}` : "No Report";
  };

  const getPatientName = (consultationId) => {
    const consultation = consultations.find(
      (c) => c.ConsultantId === consultationId
    );
    if (!consultation) return "Unknown";

    const appointment = appointments.find(
      (a) => a.AppointmentId === consultation.Appointment
    );
    return appointment ? appointment.get_patient_name : "Unknown";
  };

  const handleSearch = () => {
    if (searchQuery.trim() === "") {
      setFilteredHistory(history);
      setSearchActive(false);
      return;
    }

    const lowerQuery = searchQuery.toLowerCase();
    const filtered = history.filter((item) => {
      const patientName = getPatientName(item.Consultation).toLowerCase();
      return patientName.includes(lowerQuery);
    });

    setFilteredHistory(filtered);
    setSearchActive(true);
    setPage(0);
  };

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredHistory(history);
      setSearchActive(false);
    }
  }, [searchQuery, history]);
  

  const confirmDelete = async () => {
    if (!selectedRecord) return;
    try {
      await axios.delete(
        `http://localhost:8000/api/patienthistory/${selectedRecord.RecordId}/`,
        header
      );
      const updatedHistory = history.filter(
        (item) => item.RecordId !== selectedRecord.RecordId
      );
      setHistory(updatedHistory);
      setFilteredHistory(updatedHistory);
      setShowModal(false);
      setSelectedRecord(null);
    } catch (error) {
      console.log("Delete failed", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
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
            <Link to="/AddHistory">Create Notes</Link>
          </li>
          <li>
            <Link to="/" onClick={handleLogout}>
              Logout
            </Link>
          </li>
        </ul>
      </div>

      <div style={{marginTop:"30px"}}>
      <h3 className="text-center text-primary mb-3">Patient History</h3>
      </div>

      {/* Search bar */}
      <div className="container mt-4">
        <div className="d-flex justify-content-end mb-3">
          <input
            type="text"
            className="form-control me-2"
            style={{ width: "250px" }}
            placeholder="Search by patient name"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
          <button className="btn btn-primary" onClick={handleSearch}>
            Search
          </button>
        </div>

        <table
          className="table table-bordered table-striped table-hover"
          style={{ cursor: "pointer" }}
        >
          <thead className="table-info">
            <tr>
              <th>Record ID</th>
              <th>Patient Name</th>
              <th>Diagnosis</th>
              <th>Treatment</th>
              <th>Lab Report</th>
              <th>Doctor Name</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredHistory.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center text-danger fw-bold">
                  {searchActive
                    ? "No records found for the searched name."
                    : "No records found"}
                </td>
              </tr>
            ) : (
              filteredHistory
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((item, index) => (
                  <tr key={item.RecordId}>
                    <td>{page * rowsPerPage + index + 1}</td>
                    <td>{getPatientName(item.Consultation)}</td>
                    <td>{item.Diagnosis}</td>
                    <td>{item.Treatment}</td>
                    <td>{getLabResult(item.report)}</td>
                    <td>{getDoctorName(item.doctorname)}</td>
                    <td>
                      <Link
                        className="btn btn-sm btn-primary me-2"
                        to={`/EditHistory/${item.RecordId}`}
                      >
                        Edit
                      </Link>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => {
                          setSelectedRecord(item);
                          setShowModal(true);
                        }}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
            )}
          </tbody>
        </table>

        <TablePagination
          component="div"
          count={filteredHistory.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 25, 50, 100]}
          style={{color:"red"}}
        />
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        centered
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton className="bg-info text-white">
          <Modal.Title className="fw-bold">Delete Patient History</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <p className="fs-5 fw-semibold">
            Are you sure you want to delete{" "}
            <span className="text-danger">{selectedRecord?.Diagnosis}</span>{" "}
            record?
          </p>
        </Modal.Body>

        <Modal.Footer className="d-flex justify-content-center gap-3">
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={confirmDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ViewPatientHistory;
