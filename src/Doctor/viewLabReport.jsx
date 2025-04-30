import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../Images/Health-Logo.png";
import "../Dashboard/common.css";
import axios from "axios";
import { TablePagination } from "@mui/material";

const ViewLabReport = () => {
  const [labReport, setLabReport] = useState([]);
  const [filteredReports, setFilteredReports] = useState([]);
  const [consultants, setConsultants] = useState([]);
  const [patients, setPatients] = useState([]);
  const [referredBy, setReferredBy] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [warning, setWarning] = useState("");
  const [findings, setFindings] = useState([]);
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
    const fetchLabReport = async () => {
      try {
        const reportres = await axios.get(
          "http://localhost:8000/api/testreport/",
          header
        );
        setFindings(reportres.data);
        console.log("report findings", reportres.data);

        const testReport = await axios.get(
          "http://localhost:8000/api/labtests/",
          header
        );
        setLabReport(testReport.data);
        setFilteredReports(testReport.data);

        const consultantsData = await axios.get(
          "http://localhost:8000/api/consultation/",
          header
        );
        const patientsData = await axios.get(
          "http://localhost:8000/api/patients/",
          header
        );
        const referredByData = await axios.get(
          "http://localhost:8000/api/doctorinform/",
          header
        );

        setConsultants(consultantsData.data);
        setPatients(patientsData.data);
        setReferredBy(referredByData.data);
      } catch (error) {
        console.log("Error fetching lab report:", error.response?.data);
      }
    };

    fetchLabReport();
  }, []);

  const getFindings = (labTestId) => {
    const finding = findings.find((f) => f.LabTesting === labTestId);
    return finding ? finding.Findings : "No findings available";
  };
  const getConsultantName = (id) => {
    const consultant = consultants.find(
      (consult) => consult.consultantId === id
    );
    if (!consultant) return "Unknown Consultant";
    const doctor = referredBy.find(
      (doc) => doc.informId === consultant.doctordetail
    );
    return doctor ? doctor.DoctorName : `Dr. ${consultant.consultantId}`;
  };

  const getPatientName = (id) => {
    const patient = patients.find((patient) => patient.PatientId === id);
    return patient ? patient.full_name : "Unknown Patient";
  };

  const getReferredByName = (id) => {
    const referred = referredBy.find((ref) => ref.informId === id);
    return referred ? referred.DoctorName : "Unknown Referred By";
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const handleViewReport = (report) => {
    setSelectedReport(report);
  };

  const closeModal = () => {
    setSelectedReport(null);
  };

  const handleSearch = () => {
    if (searchTerm.trim() === "") {
      setFilteredReports(labReport);
      setWarning("");
      return;
    }

    const filtered = labReport.filter((report) => {
      const patientName = getPatientName(report.patientinform).toLowerCase();
      const doctorName = getReferredByName(report.Reffered_by).toLowerCase();
      return (
        patientName.includes(searchTerm.toLowerCase()) ||
        doctorName.includes(searchTerm.toLowerCase())
      );
    });

    if (filtered.length === 0) {
      setWarning("No records found!");
    } else {
      setWarning("");
    }

    setFilteredReports(filtered);
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (value.trim() === "") {
      setFilteredReports(labReport);
      setWarning("");
    }
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
            <Link to="/CreateLabReport">Add Findings</Link>
          </li>
          <li>
            <Link to="/" onClick={handleLogout}>
              Logout
            </Link>
          </li>
        </ul>
      </div>

      <div className="container mt-4">
        {/* Heading */}
        <h2 className="text-primary text-center mb-4">View Lab Report</h2>

        {/* Search Bar */}
        <div className="d-flex justify-content-end mb-3">
          <div className="input-group" style={{ width: "300px" }}>
            <input
              type="text"
              className="form-control me-2"
              placeholder="Search by Patient or Doctor"
              value={searchTerm}
              onChange={handleInputChange}
            />
            <button className="btn btn-primary" onClick={handleSearch}>
              Search
            </button>
          </div>
        </div>

        {warning && (
          <div className="alert alert-warning text-center" role="alert">
            {warning}
          </div>
        )}

        <table className="table table-bordered table-hover">
          <thead className="table-info">
            <tr>
              <th>S.No</th>
              <th>MR No</th>
              <th>Sample No</th>
              <th>Test Name</th>
              <th>Test Result</th>
              <th>Findings</th>
              <th>Referred By</th>
              <th>Consultant</th>
              <th>Patient</th>
              <th>Result Date</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredReports
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((report, index) => (
                <tr key={report.LaboratoryId}>
                  <td>{page * rowsPerPage + index + 1}</td>
                  <td>
                    {patients.find((p) => p.PatientId === report.patientinform)
                      ?.RegNo || "N/A"}
                  </td>
                  <td>{report.sample_No}</td>
                  <td>{report.TestName}</td>
                  <td>{report.TestResult}</td>
                  <td>{getFindings(report.LaboratoryId)}</td>
                  <td>{getReferredByName(report.Reffered_by)}</td>
                  <td>{getConsultantName(report.ConsultantId)}</td>
                  <td>{getPatientName(report.patientinform)}</td>
                  <td>{new Date(report.ResultDate).toLocaleDateString()}</td>
                  <td>
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => handleViewReport(report)}
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 50, 100]}
          component="div"
          count={filteredReports.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          style={{color:"red"}}
        />
      </div>

      {/* Modal for Viewing Report Details */}
      {selectedReport && (
        <div
          className="modal"
          style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}
          onClick={closeModal}
        >
          <div
            className="modal-content"
            style={{
              width: "600px",
              margin: "100px auto",
              padding: "20px",
              borderRadius: "10px",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h5 className="text-center mb-3 text-danger">Lab Report Details</h5>
            <p>
              <strong>Sample No:</strong> {selectedReport.sample_No}
            </p>
            <p>
              <strong>Patient:</strong>{" "}
              {getPatientName(selectedReport.patientinform)}
            </p>
            <p>
              <strong>Test Name:</strong> {selectedReport.TestName}
            </p>
            <p>
              <strong>Test Result:</strong> {selectedReport.TestResult}
            </p>
            <p>
              <strong>Findings:</strong>{" "}
              {getFindings(selectedReport.LaboratoryId)}
            </p>
            <p>
              <strong>Referred By:</strong>{" "}
              {getReferredByName(selectedReport.Reffered_by)}
            </p>
            <p>
              <strong>Consultant:</strong>{" "}
              {getConsultantName(selectedReport.ConsultantId)}
            </p>
            <p>
              <strong>Result Date:</strong>{" "}
              {new Date(selectedReport.ResultDate).toLocaleDateString()}
            </p>

            <div className="text-center mt-3">
              <button className="btn btn-secondary btn-sm" onClick={closeModal}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewLabReport;
