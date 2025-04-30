import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../Images/Health-Logo.png";
import axios from "axios";
import "./doctor.css";
import { Modal, Button } from "react-bootstrap";
import TablePagination from "@mui/material/TablePagination";

const PrescriptionView = () => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [medicines, setMedicines] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedPrescription, setSelectedPrescription] = useState(null);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [searchClicked, setSearchClicked] = useState(false);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const header = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  useEffect(() => {
    const fetchPrescriptionData = async () => {
      try {
        const medicineRes = await axios.get(
          "http://localhost:8000/api/pharmacy/",
          header
        );
        const prescripRes = await axios.get(
          "http://localhost:8000/api/prescription/",
          header
        );
        const appointmentRes = await axios.get(
          "http://localhost:8000/api/appointments/",
          header
        );

        setMedicines(medicineRes.data);
        setPrescriptions(prescripRes.data);
        setAppointments(appointmentRes.data);
        setLoading(false);
      } catch (error) {
        console.log("error", error.response?.data);
        setLoading(false);
      }
    };
    fetchPrescriptionData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const getMedicineNames = (medicineIds) => {
    return medicineIds
      .map((id) => {
        const med = medicines.find((m) => m.MedicineId === id);
        return med ? med.MedicineName : "Unknown Medicine";
      })
      .join(", ");
  };

  const getPatientName = (appointmentId) => {
    const appointment = appointments.find(
      (a) => a.AppointmentId === appointmentId
    );
    return appointment ? appointment.get_patient_name : "Unknown Patient";
  };

  const getAppointmentStatus = (appointmentId) => {
    const appointment = appointments.find(
      (a) => a.AppointmentId === appointmentId
    );
    if (appointment) {
      switch (appointment.Status) {
        case "scheduled":
          return <span className="badge bg-warning">Scheduled</span>;
        case "completed":
          return <span className="badge bg-success">Completed</span>;
        case "cancelled":
          return <span className="badge bg-danger">Cancelled</span>;
        default:
          return <span className="badge bg-secondary">Unknown</span>;
      }
    }
    return <span className="badge bg-secondary">Unknown</span>;
  };

  const handleDeleteClick = (prescription) => {
    setSelectedPrescription(prescription);
    setShowModal(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await axios.delete(
        `http://localhost:8000/api/prescription/${selectedPrescription.PrescriptionId}/`,
        header
      );
      setPrescriptions((prev) =>
        prev.filter(
          (p) => p.PrescriptionId !== selectedPrescription.PrescriptionId
        )
      );
      setAlertMessage("Prescription deleted successfully!");
      setAlertType("success");
    } catch (error) {
      console.log("delete error", error.response?.data);
      setAlertMessage("Failed to delete prescription!");
      setAlertType("danger");
    } finally {
      setShowModal(false);
      setSelectedPrescription(null);
      setTimeout(() => {
        setAlertMessage("");
      }, 3000);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedPrescription(null);
  };

  const handleSearch = () => {
    setSearchClicked(true);
    setPage(0); // Reset to first page on search
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const filteredPrescriptions = searchClicked
    ? prescriptions.filter((prescription) => {
        const patientName = getPatientName(prescription.Appointment);
        return patientName.toLowerCase().includes(searchTerm.toLowerCase());
      })
    : prescriptions;

  const paginatedPrescriptions = filteredPrescriptions.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

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
            <Link to="/Addprescription">Home</Link>
          </li>
          <li>
            <Link to="/" onClick={handleLogout}>
              Logout
            </Link>
          </li>
        </ul>
      </div>

      {/* Alert */}
      {alertMessage && (
        <div
          className={`alert alert-${alertType} text-center position-fixed top-0 start-50 translate-middle-x mt-3`}
          style={{ zIndex: 9999, width: "400px" }}
        >
          {alertMessage}
        </div>
      )}

      {/* Content */}
      <div className="container mt-4">
        <h2 className="text-center mb-3 text-primary">Prescriptions List</h2>

        <div className="d-flex justify-content-end mb-4">
          <div className="d-flex">
            <input
              type="text"
              className="form-control"
              placeholder="Search by Patient Name"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSearch()}
              style={{ width: "250px" }}
            />
            <button className="btn btn-primary ms-2" onClick={handleSearch}>
              Search
            </button>
          </div>
        </div>

        {loading ? (
          <div className="text-center">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : (
          <>
            <div className="table-responsive">
              <table className="table table-bordered table-striped table-sm">
                <thead className="table-primary">
                  <tr className="text-center">
                    <th>S.NO</th>
                    <th>Patient Name</th>
                    <th>Frequency</th>
                    <th>Dosage</th>
                    <th>No. of Days</th>
                    <th>Medicines</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedPrescriptions.map((prescription, index) => (
                    <tr
                      key={prescription.PrescriptionId}
                      className="text-center"
                    >
                      <td>{page * rowsPerPage + index + 1}</td>{" "}
                      <td>{getPatientName(prescription.Appointment)}</td>
                      <td>{prescription.Frequency}</td>
                      <td>{prescription.Dosage}</td>
                      <td>{prescription.No_of_Days}</td>
                      <td>{getMedicineNames(prescription.Medicine)}</td>
                      <td>{getAppointmentStatus(prescription.Appointment)}</td>
                      <td>
                        <Link
                          to={`/EditPrescription/${prescription.PrescriptionId}`}
                          className="btn btn-sm btn-primary mb-2"
                        >
                          Edit
                        </Link>
                        <br />
                        <button
                          className="btn btn-sm btn-danger mt-2"
                          onClick={() => handleDeleteClick(prescription)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {searchClicked && filteredPrescriptions.length === 0 && (
                <div
                  className="alert alert-warning text-center mt-3"
                  style={{ fontSize: "1.1rem" }}
                >
                  No prescriptions found for "{searchTerm}"
                </div>
              )}
            </div>

            {/* Pagination */}
            <TablePagination
              component="div"
              count={filteredPrescriptions.length}
              page={page}
              onPageChange={handleChangePage}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              rowsPerPageOptions={[5, 10, 25, 50, 100]}
              style={{color:"red"}}
            />
          </>
        )}
      </div>

      {/* Modal for Delete Confirmation */}
      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton className="bg-primary text-white">
          <Modal.Title>Delete Prescription</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete{" "}
          <strong className="text-danger">
            {getPatientName(selectedPrescription?.Appointment)}
          </strong>
          's Prescription?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            No
          </Button>
          <Button variant="danger" onClick={handleConfirmDelete}>
            Yes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default PrescriptionView;
