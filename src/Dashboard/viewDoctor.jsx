import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CircularProgress, TablePagination } from "@mui/material";
import axios from "axios";
import "./common.css";
import logo from "../Images/Health-Logo.png";

const ViewDoctor = () => {
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [roles, setRole] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("");
  const [page, setPage] = useState(0);
  const [rowsperpage, setRowsPerPage] = useState(10);
  const [progress, setProgress] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const header = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const getData = async () => {
      setProgress(true);
      try {
        const doctorRes = await axios.get(
          "http://localhost:8000/api/doctors/",
          header
        );
        const deptres = await axios.get(
          "http://localhost:8000/api/departments/",
          header
        );
        const roleRes = await axios.get(
          "http://localhost:8000/api/roles/",
          header
        );
        console.log("doctor", doctorRes.data);

        setDoctors(doctorRes.data);
        setFilteredDoctors(doctorRes.data);
        setDepartments(deptres.data);
        setRole(roleRes.data);
        setProgress(false);
      } catch (error) {
        console.error("Error fetching data", error);
        showAlertMessage("Error Fetching Data...", "warning");
        setProgress(false);
      }
    };
    getData();
  }, []);

  useEffect(() => {
    if (searchTerm === "") {
      setFilteredDoctors(doctors);
    }
  }, [searchTerm, doctors]);

  const handleSearch = () => {
    const filtered = doctors.filter((doct) => {
      const doctorName = `${doct.FirstName || ""} ${
        doct.LastName || ""
      }`.toLowerCase();
      const dept = departments.find((d) => d.DepartmentId === doct.Department);
      const deptName = dept?.DepartmentName?.toLowerCase() || "";
      const specialization = doct.Specialization?.toLowerCase() || "";

      return (
        doctorName.includes(searchTerm.toLowerCase()) ||
        deptName.includes(searchTerm.toLowerCase()) ||
        specialization.includes(searchTerm.toLowerCase())
      );
    });

    setFilteredDoctors(filtered);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const handleDeleteClick = (doctor) => {
    setSelectedDoctor(doctor);
    setShowDeleteModal(true);
  };

  const handlecancelDelete = () => {
    setShowDeleteModal(false);
    setSelectedDoctor(null);
  };

  const handleconfirmDelete = async () => {
    try {
      const token = localStorage.getItem("token");
      const header = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      await axios.delete(
        `http://localhost:8000/api/doctors/${selectedDoctor.DoctorId}/`,
        header
      );
      const updatedlist = doctors.filter(
        (doc) => doc.DoctorId !== selectedDoctor.DoctorId
      );
      setDoctors(updatedlist);
      setFilteredDoctors(updatedlist);
      showAlertMessage("Doctor Deleted Successfully", "success");
    } catch (error) {
      console.log("error", error);
      showAlertMessage("Failed to delete doctor", "danger");
    }
    setShowDeleteModal(false);
    setSelectedDoctor(null);
  };

  const showAlertMessage = (message, type = "success") => {
    setAlertMessage(message);
    setAlertType(type);

    setTimeout(() => {
      setAlertMessage("");
      setAlertType("");
    }, 3000);
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  setTimeout(() => {
    setProgress(false);
  }, 500);

  return (
    <div>
      {/* Navbar */}
      <div className="navbar">
        <div className="logo-container">
          <img src={logo} alt="Logo" className="logo-img" />
          <span className="logo-text">KIMS</span>
        </div>

        <ul className="nav-links">
          <li>
            <Link to="/Adddoctor">Home</Link>
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
          <div className="container mt-5">
            <h2 className="text-center mb-4 doctor-heading">Doctor List</h2>

            <div className="d-flex justify-content-end mb-3 gap-2">
              <input
                type="text"
                placeholder="Search by doctor or department"
                className="form-control w-25"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button className="btn btn-primary" onClick={handleSearch}>
                Search
              </button>
            </div>

            <div className="table-responsive mt-3 px-4">
              <table className="table table-striped table-bordered table-hover custom-table">
                <thead className="table-primary">
                  <tr>
                    <th>S.No</th>
                    <th>FirstName</th>
                    <th>LastName</th>
                    <th>Age</th>
                    <th>Date Of Birth</th>
                    <th>Date of Joining</th>
                    <th>Email</th>
                    <th>Contact Number</th>
                    <th>Address</th>
                    <th>Specialization</th>
                    <th>Consultant Fees</th>
                    <th>Gender</th>
                    <th>Department</th>
                    <th>Role</th>
                    <th>Created Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDoctors.length === 0 ? (
                    <tr>
                      <td colSpan="16" className="text-center text-danger">
                        No doctors found matching your search.
                      </td>
                    </tr>
                  ) : (
                    filteredDoctors
                      .slice(
                        page * rowsperpage,
                        page * rowsperpage + rowsperpage
                      )
                      .map((doct, index) => (
                        <tr key={doct.DoctorId}>
                          <td>
                            {doctors.findIndex(
                              (d) => d.DoctorId === doct.DoctorId
                            ) + 1}
                          </td>
                          <td>{doct.FirstName}</td>
                          <td>{doct.LastName}</td>
                          <td>{doct.Age}</td>
                          <td>{doct.Date_of_Birth}</td>
                          <td>{doct.Date_of_Joining}</td>
                          <td>{doct.EmailId}</td>
                          <td>{doct.phone_Number}</td>
                          <td>{doct.Address}</td>
                          <td>{doct.Specialization}</td>
                          <td>{doct.Consultant_fees}</td>
                          <td>{doct.Gender}</td>
                          <td>
                            {departments.find(
                              (d) => d.DepartmentId === doct.Department
                            )?.DepartmentName || "Unknown"}
                          </td>
                          <td>
                            {roles.find((r) => r.RoleId === doct.Role)
                              ?.RoleName || "Unknown"}
                          </td>
                          <td>
                            {doct.date_only} {doct.time_only}
                          </td>
                          <td>
                            <Link
                              to={`/EditDoctor/${doct.DoctorId}/`}
                              className="btn btn-sm btn-primary mb-2"
                            >
                              Edit
                            </Link>
                            <br />
                            <button
                              className="btn btn-sm btn-danger mt-2"
                              onClick={() => handleDeleteClick(doct)}
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
            rowsPerPageOptions={[5, 10, 25, 50, 100]}
            count={filteredDoctors.length}
            rowsPerPage={rowsperpage}
            page={page}
            onPageChange={handlePageChange}
            onRowsPerPageChange={handleChangeRowsPerPageChange}
            style={{ gap: "10px", color: "red" }}
          />

          {/* {Model Delete Function} */}
          {showDeleteModal && selectedDoctor && (
            <div className="modal d-block" tabIndex="-1">
              <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                  <div className="modal-header bg-info justify-content-center">
                    <h5 className="modal-title text-black">Delete Doctor</h5>
                  </div>
                  <div className="modal-body text-center">
                    <p>
                      Are you sure you want to delete{" "}
                      <strong className="text-danger">
                        {selectedDoctor.FirstName} {selectedDoctor.LastName}
                      </strong>
                      ?
                    </p>
                  </div>
                  <div className="modal-footer justify-content-center">
                    <button
                      className="btn btn-danger me-2"
                      onClick={handlecancelDelete}
                    >
                      cancel
                    </button>
                    <button
                      className="btn btn-success"
                      onClick={handleconfirmDelete}
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
              className={`alert alert-${alertType} alert-dismissible fade show top-center-alert`}
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

export default ViewDoctor;
