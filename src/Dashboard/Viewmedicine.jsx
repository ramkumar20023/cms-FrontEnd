import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CircularProgress, TablePagination } from "@mui/material";
import "./common.css";
import logo from "../Images/Health-Logo.png";
import axios from "axios";

const ViewMedicine = () => {
  const [medicine, setMedicine] = useState([]);
  const [filteredMedicine, setFilteredMedicine] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  // const [showAlert, setShowAlert] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [medicineToDelete, setMedicineToDelete] = useState(null);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [progress, setProgress] = useState(false);

  const navigate = useNavigate();

  const fetchMedicine = async () => {
    setProgress(true);
    try {
      const token = localStorage.getItem("token");
      const header = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const medicineRes = await axios.get(
        "http://localhost:8000/api/pharmacy/",
        header
      );
      setMedicine(medicineRes.data);
      setFilteredMedicine(medicineRes.data);
      setProgress(false);
    } catch (error) {
      console.log(error.response.data);
      triggerAlert("Error Fetching Data", "warning");
      setProgress(false);
    }
  };

  useEffect(() => {
    fetchMedicine();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const handleSearch = () => {
    if (searchTerm === "") {
      setFilteredMedicine(medicine);
      // setShowAlert(false);
    } else {
      const filtered = medicine.filter((item) =>
        item.MedicineName.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredMedicine(filtered);
      // setShowAlert(filtered.length === 0);
    }
  };

  const handleClearSearch = (e) => {
    setSearchTerm(e.target.value);
    if (e.target.value === "") {
      setFilteredMedicine(medicine);
      // setShowAlert(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const header = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      await axios.delete(`http://localhost:8000/api/pharmacy/${id}/`, header);
      triggerAlert("Medicine Deleted Successfully", "success");
      navigate("/ViewMedicine");
      fetchMedicine();
    } catch (error) {
      console.error("Delete error:", error);
      triggerAlert("Failed to Delete Medicine", "danger");
    }
    setDeleteModal(false);
  };

  const openDeleteModal = (medicine) => {
    setMedicineToDelete(medicine);
    setDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setDeleteModal(false);
  };

  const triggerAlert = (msg, type) => {
    setAlertMessage(msg);
    setAlertType(type);
    setTimeout(() => {
      setAlertMessage("");
      setAlertType("");
    }, 3000);
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (event) => {
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
            <Link to="/AddMedicine">Add Medicine</Link>
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
            <h2 className="text-primary text-center mb-3">Medicines List</h2>
            <div className="d-flex justify-content-end mb-4">
              <div className="d-flex" style={{ width: "350px" }}>
                <input
                  type="text"
                  className="form-control me-2"
                  placeholder="Search by Medicine Name"
                  value={searchTerm}
                  onChange={handleClearSearch}
                />
                <button className="btn btn-primary" onClick={handleSearch}>
                  Search
                </button>
              </div>
            </div>
            {/* 
        {showAlert && (
          <div
            className="alert alert-warning text-center"
            role="alert"
            style={{ maxWidth: "500px", margin: "0 auto" }}
          >
            No data found
          </div>
        )} */}

            <div className="table-responsive">
              <table className="table table-bordered table-hover table-striped">
                <thead className="table-primary text-center">
                  <tr>
                    <th>S.No</th>
                    <th>Medicine Name</th>
                    <th>Quantity</th>
                    <th>Price Per Unit</th>
                    <th>Expiry Date</th>
                    <th>Low Stock</th>
                    <th>Supplier</th>
                    <th>Date & Time</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredMedicine.length === 0 ? (
                    <tr>
                      <td
                        colSpan="9"
                        className="text-center text-danger fw-bold"
                      >
                        No data found
                      </td>
                    </tr>
                  ) : (
                    filteredMedicine
                      .slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage
                      )
                      .map((el, index) => (
                        <tr key={el.MedicineId}>
                          <td>
                            {medicine.findIndex(
                              (m) => m.MedicineId === el.MedicineId
                            ) + 1}
                          </td>
                          <td>{el.MedicineName}</td>
                          <td>{el.Quantity}</td>
                          <td>{el.PricePerUnit}</td>
                          <td>{el.Expiry_Date}</td>
                          <td>{el.lowStock}</td>
                          <td>{el.supplier}</td>
                          <td>
                            {el.date_only} {el.time_only}
                          </td>
                          <td>
                            <Link
                              to={`/EditMedicine/${el.MedicineId}`}
                              className="btn btn-sm btn-primary me-2"
                            >
                              Edit
                            </Link>
                            <button
                              className="btn btn-sm btn-danger"
                              onClick={() => openDeleteModal(el)}
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
          <TablePagination
            component="div"
            rowsPerPageOptions={[5, 10, 25, 100]}
            page={page}
            rowsPerPage={rowsPerPage}
            count={filteredMedicine.length}
            onPageChange={handlePageChange}
            onRowsPerPageChange={handleRowsPerPageChange}
            style={{ gap: "10px", color: "red" }}
          />
          {deleteModal && (
            <div
              className="modal"
              style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}
            >
              <div className="modal-dialog">
                <div className="modal-content">
                  <div className="modal-header bg-info text-black">
                    <h5 className="modal-title">Delete Medicine</h5>
                    <button
                      type="button"
                      className="btn-close"
                      onClick={closeDeleteModal}
                    ></button>
                  </div>
                  <div className="modal-body">
                    Are you sure you want to delete{" "}
                    <strong className="text-danger">
                      {medicineToDelete?.MedicineName}
                    </strong>
                    ?
                  </div>
                  <div className="modal-footer">
                    <button
                      type="button"
                      className="btn btn-danger"
                      onClick={closeDeleteModal}
                    >
                      cancel
                    </button>
                    <button
                      type="button"
                      className="btn btn-success"
                      onClick={() => handleDelete(medicineToDelete.MedicineId)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
          {alertMessage && (
            <div
              className={`alert alert-${alertType} text-center position-fixed top-0 start-50 translate-middle-x mt-3`}
              role="alert"
              style={{
                zIndex: 9999,
                width: "400px",
                fontSize: "1.1rem",
                padding: "15px",
              }}
            >
              {alertMessage}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ViewMedicine;
