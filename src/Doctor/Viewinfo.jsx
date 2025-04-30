import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import logo from "../Images/Health-Logo.png";
import "../Dashboard/common.css";
import axios from "axios";
import { TablePagination } from "@mui/material";

const ViewInfoDoctor = () => {
  const [info, setInfo] = useState([]);
  const [filteredInfo, setFilteredInfo] = useState([]);
  const [specialist, setSpecilist] = useState([]);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // const navigate = useNavigate();

  useEffect(() => {
    if (errorMsg || successMsg) {
      const timer = setTimeout(() => {
        setErrorMsg("");
        setSuccessMsg("");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [errorMsg, successMsg]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const header = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const fetchInfo = async () => {
      try {
        const infoRes = await axios.get(
          "http://localhost:8000/api/doctorinform/",
          header
        );
        const deptresponse = await axios.get(
          "http://localhost:8000/api/departments/",
          header
        );
        setSpecilist(deptresponse.data);
        setInfo(infoRes.data);
        setFilteredInfo(infoRes.data);
        setSuccessMsg("Doctor info loaded successfully");
      } catch (error) {
        setErrorMsg("Failed to fetch doctor information.");
        console.log(error.response?.data);
      }
    };
    fetchInfo();
  }, []);

  const handleSearch = () => {
    const result = info.filter((doc) =>
      doc.DoctorName.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredInfo(result);
  };
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredInfo(info);
    }
  }, [searchTerm, info]);

  const handlePageChange = (event, newpage) => {
    setPage(newpage);
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
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
            <Link to="/Doctorinfo">Home</Link>
          </li>
          <li>
            <Link to="/">Logout</Link>
          </li>
        </ul>
      </div>

      {/* Content */}
      <div className="container mt-5">
        <h3 className="text-center text-primary mb-4">Doctor Information</h3>

        {/* Search Bar */}
        <div className="d-flex justify-content-end mb-3">
          <div className="input-group" style={{ maxWidth: "300px" }}>
            <input
              type="text"
              className="form-control form-control-sm me-2"
              placeholder="Search by Doctor Name"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button className="btn btn-primary btn-sm" onClick={handleSearch}>
              Search
            </button>
          </div>
        </div>

        {/* Alerts */}
        {errorMsg && (
          <div className="alert alert-danger text-center py-2" role="alert">
            {errorMsg}
          </div>
        )}

        {successMsg && (
          <div className="alert alert-success text-center py-2" role="alert">
            {successMsg}
          </div>
        )}

        {/* Table */}
        <div className="d-flex justify-content-center">
          <div style={{ width: "100%", maxWidth: "900px" }}>
            <div className="table-responsive">
              <table className="table table-bordered table-striped shadow table-sm">
                <thead className="table-info text-center">
                  <tr>
                    <th>S.No</th>
                    <th>Doctor Name</th>
                    <th>Specialization</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody className="text-center">
                  {filteredInfo
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((el, index) => (
                      <tr key={el.informId} style={{ cursor: "pointer" }}>
                        <td>
                          {info.findIndex((l) => l.informId === el.informId) +
                            1}
                        </td>
                        <td>{el.DoctorName}</td>
                        <td>
                          {specialist.find(
                            (dept) => dept.DepartmentId === el.specialist
                          )?.DepartmentName || "Unknown"}
                        </td>
                        <td>
                          <Link
                            className="btn btn-sm btn-primary me-2"
                            to={`/EditInfo/${el.informId}`}
                          >
                            Edit
                          </Link>
                        </td>
                      </tr>
                    ))}
                  {filteredInfo.length === 0 && (
                    <tr>
                      <td colSpan="4" className="text-center">
                        <div
                          className="alert alert-warning py-2 m-0"
                          role="alert"
                        >
                          No doctor info available.
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
              <TablePagination
                component="div"
                rowsPerPageOptions={[5, 10, 25, 50, 100]}
                rowsPerPage={rowsPerPage}
                page={page}
                count={filteredInfo.length}
                onPageChange={handlePageChange}
                onRowsPerPageChange={handleRowsPerPageChange}
                style={{ color: "red" }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewInfoDoctor;
