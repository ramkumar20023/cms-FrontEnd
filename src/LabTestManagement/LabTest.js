import React, { useState, useEffect } from "react";
import axios from "axios";

const LabTestTable = () => {
  const [labTests, setLabTests] = useState([]);

  useEffect(() => {
    const fetchLabTests = async () => {
      const token = localStorage.getItem("access");
      const headers = { Authorization: `Bearer ${token}` };

      try {
        const response = await axios.get("http://localhost:8000/api/labtests/", { headers });
        setLabTests(response.data);
      } catch (error) {
        console.error("Error fetching lab tests:", error);
      }
    };

    fetchLabTests();
  }, []);

  const getStatusBadge = (status) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "badge bg-success";
      case "pending":
        return "badge bg-warning text-dark";
      case "cancel":
        return "badge bg-danger";
      default:
        return "badge bg-secondary";
    }
  };

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold">🧪 Lab Test Management</h2>
        <button className="btn btn-danger">+ Create Lab Test</button>
      </div>

      <div className="table-responsive shadow-sm rounded">
        <table className="table table-hover table-bordered align-middle">
          <thead className="table-dark text-center">
            <tr>
              <th>Lab Test ID</th>
              <th>Patient</th>
              <th>Test</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {labTests.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center py-4">No lab tests found.</td>
              </tr>
            ) : (
              labTests.map((test) => (
                <tr key={test.LaboratoryId}>
                  <td className="text-center">{test.LaboratoryId}</td>
                  <td>{test.PatientName}</td>
                  <td>{test.TestName}</td>
                  <td className="text-center">
                    <span className={getStatusBadge(test.Status)}>
                      {test.Status.toUpperCase()}
                    </span>
                  </td>
                  <td className="text-center">
                    <div className="d-flex justify-content-center gap-2">
                      <button className="btn btn-outline-primary btn-sm">View</button>
                      <button className="btn btn-outline-warning btn-sm">Update</button>
                      <button className="btn btn-outline-danger btn-sm">Cancel</button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LabTestTable;
