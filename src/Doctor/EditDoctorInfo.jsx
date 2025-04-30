import React, { useEffect, useState } from "react";
import logo from "../Images/Health-Logo.png";
import "../Dashboard/common.css";
import axios from "axios";
import { useNavigate, useParams, Link } from "react-router-dom";

const EditInfoDoctor = () => {
  const [doctorName, setDoctorName] = useState("");
  const [departments, setDepartments] = useState([]);
  const [selectedDept, setSelectedDept] = useState("");
  const [alertMsg, setAlertMsg] = useState("");

  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const header = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

        const deptRes = await axios.get(
          "http://localhost:8000/api/departments/",
          header
        );
        setDepartments(deptRes.data);

        const docRes = await axios.get(
          `http://localhost:8000/api/doctorinform/${id}/`,
          header
        );
        setDoctorName(docRes.data.DoctorName);
        setSelectedDept(docRes.data.specialist);
      } catch (error) {
        console.error("Error fetching data", error);
        setAlertMsg("Error Fetching Data", "warning");
      }
    };

    fetchData();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const header = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      const data = {
        DoctorName: doctorName,
        specialist: selectedDept,
      };

      await axios.put(
        `http://localhost:8000/api/doctorinform/${id}/`,
        data,
        header
      );

      setAlertMsg("Doctor Info Updated Successfully");
      setTimeout(() => setAlertMsg(""), 3000);
    } catch (error) {
      console.error("Error updating doctor info", error);
      setAlertMsg("Failed to update doctor info");
      setTimeout(() => setAlertMsg(""), 3000);
    }
  };

  const handleLogout = () => {
    navigate("/");
  };

  return (
    <div>
      <div className="navbar">
        <div className="logo-container">
          <img src={logo} alt="Logo" className="logo-img" />
          <span className="logo-text">KIMS</span>
        </div>

        <ul className="nav-links">
          <li>
            <Link to="/Viewinfo">View Info</Link>
          </li>
          <li>
            <Link to="/" onClick={handleLogout}>
              Logout
            </Link>
          </li>
        </ul>
      </div>

      <div className="container mt-4">
        {alertMsg && (
          <div className="alert fs-7 text-center" role="alert" style={{ fontSize: "1rem", padding: "8px" }}>
            {alertMsg}
          </div>
        )}

        <div className="container d-flex justify-content-center align-items-center mt-5">
          <div
            className="card p-4 shadow"
            style={{ width: "100%", maxWidth: "500px" }}
          >
            <h4 className="text-center bg-primary text-white mb-4 p-2">
              Update Doctor Info
            </h4>

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Doctor Name</label>
                <input
                  type="text"
                  className="form-control"
                  value={doctorName}
                  onChange={(e) => setDoctorName(e.target.value)}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Department</label>
                <select
                  className="form-select"
                  value={selectedDept}
                  onChange={(e) => setSelectedDept(e.target.value)}
                  required
                >
                  <option value="">-- Select Department --</option>
                  {departments.map((dept) => (
                    <option key={dept.DepartmentId} value={dept.DepartmentId}>
                      {dept.DepartmentName}
                    </option>
                  ))}
                </select>
              </div>

              <div className="d-flex justify-content-center gap-3">
                <button type="submit" className="btn btn-success px-4">
                  Update
                </button>
                <Link className="btn btn-secondary px-4" to="/Viewinfo">
                  Back
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditInfoDoctor;
