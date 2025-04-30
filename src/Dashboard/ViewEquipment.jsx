import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Modal, Button, Alert } from "react-bootstrap";
import { CircularProgress, TablePagination } from "@mui/material";

import "./common.css";
import logo from "../Images/Health-Logo.png";
import axios from "axios";

const ViewlabEquipment = () => {
  const [labEquipment, setlabEquipment] = useState([]);
  const [filteredEquipment, setFilteredEquipment] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [equipmentToDelete, setEquipmentToDelete] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [progress, setProgress] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const header = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const fetchEquipment = async () => {
      setProgress(true);
      try {
        const labRes = await axios.get(
          "http://localhost:8000/api/lab-devices/",
          header
        );
        console.log("labEquipment", labRes.data);

        setlabEquipment(labRes.data);
        setFilteredEquipment(labRes.data);
        setProgress(false);
      } catch (error) {
        console.log("Error", error.response.data);
        setShowAlert("Error Fetching Data", "warning");
        setProgress(false);
      }
    };
    fetchEquipment();
  }, []);

  const handleSearch = () => {
    const filtered = labEquipment.filter((item) =>
      item.EquipmentName.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredEquipment(filtered);
  };

  const handleClear = () => {
    setSearchTerm("");
    setFilteredEquipment(labEquipment);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };
  // Delete fun
  const handleDeleteClick = (equipment) => {
    setEquipmentToDelete(equipment);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    try {
      const token = localStorage.getItem("token");
      const header = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      await axios.delete(
        `http://localhost:8000/api/lab-devices/${equipmentToDelete.ModuleId}`,
        header
      );
      const updatedEquipment = labEquipment.filter(
        (item) => item.ModuleId !== equipmentToDelete.ModuleId
      );
      setlabEquipment(updatedEquipment);
      setFilteredEquipment(updatedEquipment);
      setShowDeleteModal(false);
      setShowAlert(true);

      setTimeout(() => {
        setShowAlert(false);
      }, 3000);
    } catch (error) {
      console.log("Error deleting equipment", error.response.data);
      setShowAlert("Error Deleting Equipment", "danger");
    }
  };
  const handlePageChange = (event, newpage) => {
    setPage(newpage);
  };

  const handleRowsPerpageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  setTimeout(() => {
    setProgress(false);
  }, 500);

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
            <Link to="/AddLabEquipment">Add Lab Equipment</Link>
          </li>
          <li>
            <Link to="/" onClick={handleLogout}>
              Logout
            </Link>
          </li>
        </ul>
      </div>
      {progress ? (
        <CircularProgress color="success" size="3rem" />
      ) : (
        <div>
          <div className="container mt-4">
            <h4 className="text-center text-primary mb-4">
              Lab Equipment List
            </h4>

            <div className="row mb-3">
              <div className="col-md-12 d-flex justify-content-end">
                <div className="input-group" style={{ maxWidth: "300px" }}>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search Equipment..."
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      if (e.target.value === "") handleClear();
                    }}
                  />
                  <button
                    className="btn btn-primary ms-2"
                    onClick={handleSearch}
                  >
                    Search
                  </button>
                </div>
              </div>
            </div>

            {filteredEquipment.length === 0 ? (
              <>
                <div className="table-responsive">
                  <table className="table table-bordered text-center align-middle shadow">
                    <thead className="table-primary">
                      <tr>
                        <th>S.No</th>
                        <th>Equipment Name</th>
                        <th>Quantity</th>
                        <th>Date & Time</th>
                        <th>Last Service Date</th>
                        <th>Next Service Date</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                  </table>
                </div>
                <div className="text-center mt-3">
                  <span
                    className="text-warning fw-semibold"
                    style={{ fontSize: "1.2rem" }}
                  >
                    No Matching Equipment found
                  </span>
                </div>
              </>
            ) : (
              <div className="table-responsive">
                <table className="table table-bordered table-hover text-center align-middle shadow">
                  <thead className="table-primary">
                    <tr>
                      <th>S.No</th>
                      <th>Equipment Name</th>
                      <th>Quantity</th>
                      <th>Date & Time</th>
                      <th>Last Service Date</th>
                      <th>Next Service Date</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredEquipment
                      .slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage
                      )
                      .map((el, index) => (
                        <tr key={el.ModuleId} style={{ cursor: "pointer" }}>
                          <td>
                            {labEquipment.findIndex(
                              (l) => l.ModuleId === el.ModuleId
                            ) + 1}
                          </td>
                          <td>{el.EquipmentName}</td>
                          <td>{el.Quantity}</td>
                          <td>
                            {el.date_only}/{el.time_only}
                          </td>
                          <td>{el.Last_Service_Date}</td>
                          <td>{el.Next_Service_Date}</td>
                          <td>{el.Status}</td>
                          <td>
                            <div className="d-flex justify-content-center gap-2">
                              <Link
                                to={`/EditlabEquipment/${el.ModuleId}`}
                                className="btn btn-sm btn-primary"
                              >
                                Edit
                              </Link>
                              <button
                                className="btn btn-sm btn-danger"
                                onClick={() => handleDeleteClick(el)}
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
          <TablePagination
            component="div"
            rowsPerPageOptions={[5, 10, 25, 50, 100]}
            rowsPerPage={rowsPerPage}
            page={page}
            count={filteredEquipment.length}
            onPageChange={handlePageChange}
            onRowsPerPageChange={handleRowsPerpageChange}
            style={{ color: "red", gap: "10" }}
          />
          {showAlert && (
            <div className="row mb-3">
              <div className="col-md-6 mx-auto">
                <Alert
                  variant="success"
                  onClose={() => setShowAlert(false)}
                  dismissible
                >
                  Equipment deleted successfully!
                </Alert>
              </div>
            </div>
          )}
          <Modal
            show={showDeleteModal}
            onHide={() => setShowDeleteModal(false)}
            centered
            backdrop="static"
            keyboard={false}
          >
            <Modal.Header closeButton className="bg-info text-black">
              <Modal.Title className="modal-title">
                Delete Lab Equipment
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <p className="fw-semibold fs-5">
                Are you sure you want to delete{" "}
                <span className="text-danger">
                  {equipmentToDelete?.EquipmentName}
                </span>
                ?
              </p>
            </Modal.Body>
            <Modal.Footer className="d-flex justify-content-center gap-3">
              <Button
                variant="danger"
                onClick={() => setShowDeleteModal(false)}
              >
                cancel
              </Button>
              <Button variant="success" onClick={handleConfirmDelete}>
                Delete
              </Button>
            </Modal.Footer>
          </Modal>
        </div>
      )}
    </div>
  );
};
export default ViewlabEquipment;
