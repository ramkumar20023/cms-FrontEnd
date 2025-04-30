import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CircularProgress, TablePagination } from "@mui/material";

import "./common.css";
import logo from "../Images/Health-Logo.png";
import axios from "axios";

const StaffView = () => {
  const [roles, setRoles] = useState([]);
  const [staff, setStaff] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredStaff, setFilteredStaff] = useState([]);
  const [showAlert, setShowAlert] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("");
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

    const fetchstaff = async () => {
      setProgress(true);
      try {
        const roleRes = await axios.get(
          "http://localhost:8000/api/roles/",
          header
        );
        const staffRes = await axios.get(
          "http://localhost:8000/api/staff/",
          header
        );
        console.log("datastaff", staffRes.data);

        setRoles(roleRes.data);
        setStaff(staffRes.data);
        setFilteredStaff(staffRes.data);
        setProgress(false);
      } catch (error) {
        console.log(error);
        showAlertMessage("Error Fetching Data", "warning");
        setProgress(false);
      }
    };
    fetchstaff();
  }, []);

  useEffect(() => {
    if (searchTerm === "") {
      setFilteredStaff(staff);
      setShowAlert(false);
    }
  }, [searchTerm, staff]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const handleSearch = () => {
    if (searchTerm === "") {
      setFilteredStaff(staff);
      setShowAlert(false);
      return;
    }

    const filtered = staff.filter((el) => {
      const fullName = `${el.FirstName} ${el.LastName}`.toLowerCase();
      const roleName =
        roles.find((r) => r.RoleId === el.Role)?.RoleName?.toLowerCase() || "";
      return (
        el.FirstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        el.LastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        roleName.includes(searchTerm.toLowerCase()) ||
        fullName.includes(searchTerm.toLowerCase())
      );
    });

    if (filtered.length === 0) {
      setShowAlert(true);
    } else {
      setShowAlert(false);
    }
    setFilteredStaff(filtered);
  };

  const handleDeleteClick = (staff) => {
    setSelectedStaff(staff);
    setShowDeleteModal(true);
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setSelectedStaff(null);
  };

  const confirmDelete = async () => {
    try {
      const token = localStorage.getItem("token");
      const header = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      await axios.delete(
        `http://localhost:8000/api/staff/${selectedStaff.StaffId}/`,
        header
      );
      setStaff((prev) => prev.filter((s) => s.StaffId !== searchTerm.StaffId));
      setFilteredStaff((prev) =>
        prev.filter((s) => s.StaffId !== selectedStaff.StaffId)
      );
      showAlertMessage("Staff deleted successfully", "success");
    } catch (error) {
      console.log("error", error.response?.data);
      showAlertMessage("Failed to delete staff", "danger");
    }
    setShowDeleteModal(false);
    setSelectedStaff(null);
  };

  const showAlertMessage = (message, type = "success") => {
    setAlertMessage(message);
    setAlertType(type);

    setTimeout(() => {
      setAlertMessage("");
      setAlertType("");
    }, 3000);
  };
  console.log(showAlert);

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
            <Link to="/Addstaff">Home</Link>
          </li>
          <li>
            <Link to="/" onClick={handleLogout}>
              Logout
            </Link>
          </li>
        </ul>
      </div>

      <div className="d-flex justify-content-center mt-3">
        <h2 className="doctor-heading">Staff List</h2>
      </div>

      <div className="d-flex justify-content-end mb-3 px-4">
        <input
          type="text"
          className="form-control search-bar"
          placeholder="Search by Name or Role"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button className="btn btn-primary ms-2" onClick={handleSearch}>
          Search
        </button>
      </div>
      {progress ? (
        <CircularProgress size="3rem" color="success" />
      ) : (
        <div>
          <div className="table-wrapper mt-3 px-4">
            <table className="table table-bordered table-hover custom-table shadow">
              <thead className="table-primary text-center">
                <tr>
                  <th>S.No</th>
                  <th>FirstName</th>
                  <th>LastName</th>
                  <th>Age</th>
                  <th>Gender</th>
                  <th>Date Of Birth</th>
                  <th>Date of Joining</th>
                  <th>Blood Group</th>
                  <th>Email Id</th>
                  <th>Contact Number</th>
                  <th>Address</th>
                  <th>Role</th>
                  <th>Created Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredStaff.length === 0 ? (
                  <tr>
                    <td colSpan="13" className="text-center">
                      <div
                        className="alert alert-warning d-inline-block px-4 py-2"
                        role="alert"
                      >
                        No matching staff data found.
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredStaff
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((el, index) => (
                      <tr key={el.StaffId} style={{ cursor: "pointer" }}>
                        <td>
                          {staff.findIndex((s) => s.StaffId === el.StaffId) + 1}
                        </td>
                        <td>{el.FirstName}</td>
                        <td>{el.LastName}</td>
                        <td>{el.Age}</td>
                        <td>{el.Gender}</td>
                        <td>{el.Date_of_Birth}</td>
                        <td>{el.Date_of_Joining}</td>
                        <td>{el.BloodGroup}</td>
                        <td>{el.EmailId}</td>
                        <td>{el.phone_Number}</td>
                        <td>{el.Address}</td>
                        <td>
                          {roles.find((rl) => rl.RoleId === el.Role)
                            ?.RoleName || "UnKnown"}
                        </td>
                        <td>
                          {el.date_only} {el.time_only}
                        </td>
                        <td>
                          <Link
                            to={`/Editstaff/${el.StaffId}/`}
                            className="btn btn-sm btn-primary mb-2"
                          >
                            Edit
                          </Link>
                          <br />
                          <button
                            className="btn btn-sm btn-danger mt-2"
                            onClick={() => handleDeleteClick(el)}
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
          <TablePagination
            component="div"
            rowsPerPageOptions={[5, 10, 25, 50, 100]}
            count={filteredStaff.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handlePageChange}
            onRowsPerPageChange={handleRowsPerPageChange}
            style={{ gap: "10px", color: "red" }}
          />

          {showDeleteModal && selectedStaff && (
            <div className="modal d-block" tabIndex="-1">
              <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                  <div
                    className="modal-header text-dark bg-info"
                    style={{ justifyContent: "center" }}
                  >
                    <h5 className="modal-title">Delete Staff</h5>
                  </div>
                  <div className="modal-body">
                    <p>
                      Are you sure you want to delete{" "}
                      <strong className="text-danger">
                        {selectedStaff.FirstName} {selectedStaff.LastName}
                      </strong>
                      ?
                    </p>
                  </div>
                  <div className="modal-footer">
                    <button
                      className="btn btn-danger me-2"
                      onClick={cancelDelete}
                    >
                      cancel
                    </button>
                    <button className="btn btn-success" onClick={confirmDelete}>
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {alertMessage && (
            <div
              className={`alert alert-${alertType} alert-dismissible fade show mx-4`}
              role="alert"
            >
              {alertMessage}
              <button
                type="button"
                className="btn-close"
                onClick={() => setAlertMessage("")}
                aria-label="Close"
              ></button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default StaffView;
