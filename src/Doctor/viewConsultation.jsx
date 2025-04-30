import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import logo from "../Images/Health-Logo.png";
import { Modal, Button, Alert } from "react-bootstrap";
import TablePagination from "@mui/material/TablePagination";

const ViewConsultation = () => {
  const [consultations, setConsultations] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedConsult, setSelectedConsult] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const [page, setPage] = useState(0); 
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const navigate = useNavigate();

  useEffect(() => {
    fetchConsultations();
  }, []);

  const fetchConsultations = async () => {
    const token = localStorage.getItem("token");
    const header = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    try {
      const [res, presRes, appointRes, doctres] = await Promise.all([
        axios.get("http://localhost:8000/api/consultation/", header),
        axios.get("http://localhost:8000/api/prescription/", header),
        axios.get("http://localhost:8000/api/appointments/", header),
        axios.get("http://localhost:8000/api/doctorinform/", header),
      ]);

      setConsultations(res.data);
      setPrescriptions(presRes.data);
      setAppointments(appointRes.data);
      setDoctors(doctres.data);

      setLoading(false);
    } catch (error) {
      console.error("Error fetching consultations:", error.response?.data);
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const handleDeleteClick = (consult) => {
    setSelectedConsult(consult);
    setShowModal(true);
  };

  const handleConfirmDelete = async () => {
    const token = localStorage.getItem("token");
    const header = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    try {
      await axios.delete(
        `http://localhost:8000/api/consultation/${selectedConsult.ConsultantId}/`,
        header
      );
      setShowModal(false);
      setShowSuccess(true);
      fetchConsultations();

      setTimeout(() => {
        setShowSuccess(false);
      }, 2000);
    } catch (error) {
      console.error("Error deleting consultation:", error.response?.data);
    }
  };

  const getPrescriptionName = (id) => {
    const pres = prescriptions.find((p) => p.PrescriptionId === id);
    return pres ? pres.Frequency : "N/A";
  };

  const getAppointmentPatientName = (id) => {
    const app = appointments.find((a) => a.AppointmentId === id);
    return app ? app.get_patient_name : "N/A";
  };

  const getDoctorName = (id) => {
    const doc = doctors.find((d) => d.informId === id);
    return doc ? doc.DoctorName : "N/A";
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  if (loading) {
    return <div className="text-center mt-5">Loading consultations...</div>;
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
          />
          <span className="logo-text">KIMS</span>
        </div>

        <ul className="nav-links">
          <li>
            <Link to="/AddConsultation">Home</Link>
          </li>
          <li>
            <Link to="/" onClick={handleLogout}>
              Logout
            </Link>
          </li>
        </ul>
      </div>

      <div className="container mt-5">
        <h2 className="text-center mb-4 text-primary">Consultation List</h2>

        {showSuccess && (
          <Alert variant="success" className="text-center">
            Deleted Successfully!
          </Alert>
        )}

        <table className="table table-bordered table-hover">
          <thead className="table-info">
            <tr>
              <th>S.No</th>
              <th>Notes</th>
              <th>Prescription</th>
              <th>Appointment</th>
              <th>Doctor</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {consultations
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage) 
              .map((consult, index) => (
                <tr key={consult.ConsultantId}>
                  <td>{page * rowsPerPage + index + 1}</td>
                  <td>{consult.Notes}</td>
                  <td>
                    {consult.Prescription
                      ? getPrescriptionName(consult.Prescription)
                      : "No Prescription"}
                  </td>
                  <td>
                    {consult.Appointment
                      ? getAppointmentPatientName(consult.Appointment)
                      : "No Appointment"}
                  </td>
                  <td>
                    {consult.doctordetail
                      ? getDoctorName(consult.doctordetail)
                      : "No Doctor Assigned"}
                  </td>
                  <td>
                    <Link
                      className="btn btn-primary me-2"
                      to={`/Editconsultation/${consult.ConsultantId}`}
                    >
                      Edit
                    </Link>
                    <button
                      className="btn btn-danger"
                      onClick={() => handleDeleteClick(consult)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>

        {/* MUI Table Pagination */}
        <TablePagination
          component="div"
          count={consultations.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 25,50,100]}
          style={{color:"red"}}
        />
      </div>

      {/* Modal */}
      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton className="bg-primary text-white p-3">
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedConsult ? (
            <>
              Are you sure you want to delete this consultation?{" "}
              <span className="text-danger">{selectedConsult.Notes}</span>
            </>
          ) : (
            <p>Consultation details not available.</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={handleConfirmDelete}
            disabled={!selectedConsult}
          >
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ViewConsultation;
