import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import axios from "axios";
import "./common.css";
import logo from "../Images/Health-Logo.png";

const EditDoctor = () => {
  const [departments, setDepartments] = useState([]);
  const [roles, setRoles] = useState([]);
  const [doctorData, setDoctorData] = useState({
    firstname: "",
    lastname: "",
    age: "",
    dateofBirth: "",
    dateofJoining: "",
    emailId: "",
    contactNumber: "",
    address: "",
    specialization: "",
    consultantFees: "",
    gender: "",
    selectedDept: "",
    selectedRole: "",
  });
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ message: "", type: "" });

  const navigate = useNavigate();
  const { Doctorid } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const header = {
          headers: { Authorization: `Bearer ${token}` },
        };
        const deptRes = await axios.get(
          "http://localhost:8000/api/departments/",
          header
        );
        const roleRes = await axios.get(
          "http://localhost:8000/api/roles/",
          header
        );
        const doctorRes = await axios.get(
          `http://localhost:8000/api/doctors/${Doctorid}/`,
          header
        );
        setDepartments(deptRes.data);
        setRoles(roleRes.data);
        setDoctorData({
          firstname: doctorRes.data.FirstName,
          lastname: doctorRes.data.LastName,
          age: doctorRes.data.Age,
          dateofBirth: doctorRes.data.Date_of_Birth,
          dateofJoining: doctorRes.data.Date_of_Joining,
          emailId: doctorRes.data.EmailId,
          contactNumber: doctorRes.data.phone_Number,
          address: doctorRes.data.Address,
          specialization: doctorRes.data.Specialization,
          consultantFees: doctorRes.data.Consultant_fees,
          gender: doctorRes.data.Gender,
          selectedDept: doctorRes.data.Department,
          selectedRole: doctorRes.data.Role,
        });
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };
    fetchData();
  }, [Doctorid]);

  const isValidContact = (number) => {
    const phoneRegex = /^\d{10}$/;
    return phoneRegex.test(number);
  };

  const handleEditDoctor = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!isValidContact(doctorData.contactNumber)) {
      showAlert("Contact number must be 10 digits!", "danger");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const header = {
        headers: { Authorization: `Bearer ${token}` },
      };
      const doctorDataToUpdate = {
        FirstName: doctorData.firstname,
        LastName: doctorData.lastname,
        Age: doctorData.age,
        Date_of_Birth: doctorData.dateofBirth,
        Date_of_Joining: doctorData.dateofJoining,
        EmailId: doctorData.emailId,
        phone_Number: doctorData.contactNumber,
        Address: doctorData.address,
        Specialization: doctorData.specialization,
        Consultant_fees: doctorData.consultantFees,
        Gender: doctorData.gender,
        Department: doctorData.selectedDept,
        Role: doctorData.selectedRole,
      };
      console.log("Sending to backend:", doctorDataToUpdate);

      await axios.put(
        `http://localhost:8000/api/doctors/${Doctorid}/`,
        doctorDataToUpdate,
        header
      );
      setLoading(false);
      showAlert("Doctor updated successfully!", "success");

      setTimeout(() => {
        setAlert({ message: "", type: "" });
      }, 3000);
    } catch (error) {
      console.error("Error updating doctor", error);
      setLoading(false);
      showAlert("Failed to update doctor. Please try again.", "danger");
      setTimeout(() => {
        setAlert({ message: "", type: "" });
      }, 3000);
    }
  };

  const handleLogout = () => {
    navigate("/");
  };

  const showAlert = (message, type) => {
    setAlert({ message, type });
    setTimeout(() => setAlert({ message: "", type: "" }), 3000);
  };

  const handleBack = () => {
    navigate("/Viewdoctor");
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
            <Link to="/Adddoctor">Home</Link>
          </li>
          <li>
            <Link to="/Viewdoctor">Doctor List</Link>
          </li>
          <li>
            <Link to="/" onClick={handleLogout}>
              Logout
            </Link>
          </li>
        </ul>
      </div>

      <div className="container mt-4">
        <div className="card shadow-lg">
          <div className="card-header bg-primary text-white text-center">
            <h3>Edit Doctor</h3>
          </div>
          <div className="card-body">
            {/* Alert Message */}
            {alert.message && (
              <div className={`alert alert-${alert.type}`} role="alert">
                {alert.message}
              </div>
            )}

            <form className="row g-3" onSubmit={handleEditDoctor}>
              <div className="col-md-6">
                <label className="form-label">First Name</label>
                <input
                  type="text"
                  className="form-control"
                  required
                  value={doctorData.firstname}
                  onChange={(e) =>
                    setDoctorData({ ...doctorData, firstname: e.target.value })
                  }
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">Last Name</label>
                <input
                  type="text"
                  className="form-control"
                  required
                  value={doctorData.lastname}
                  onChange={(e) =>
                    setDoctorData({ ...doctorData, lastname: e.target.value })
                  }
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">Age</label>
                <input
                  type="number"
                  className="form-control"
                  required
                  value={doctorData.age}
                  onChange={(e) =>
                    setDoctorData({ ...doctorData, age: e.target.value })
                  }
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">Date of Birth</label>
                <input
                  type="date"
                  className="form-control"
                  required
                  value={doctorData.dateofBirth}
                  onChange={(e) =>
                    setDoctorData({
                      ...doctorData,
                      dateofBirth: e.target.value,
                    })
                  }
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">Date of Joining</label>
                <input
                  type="date"
                  className="form-control"
                  required
                  value={doctorData.dateofJoining}
                  onChange={(e) =>
                    setDoctorData({
                      ...doctorData,
                      dateofJoining: e.target.value,
                    })
                  }
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">Email ID</label>
                <input
                  type="email"
                  className="form-control"
                  required
                  value={doctorData.emailId}
                  onChange={(e) =>
                    setDoctorData({ ...doctorData, emailId: e.target.value })
                  }
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">Contact Number</label>
                <input
                  type="text"
                  className="form-control"
                  required
                  value={doctorData.contactNumber}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, "");
                    setDoctorData({
                      ...doctorData,
                      contactNumber: value,
                    });
                  }}
                  maxLength={10}
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">Address</label>
                <input
                  type="text"
                  className="form-control"
                  value={doctorData.address}
                  onChange={(e) =>
                    setDoctorData({ ...doctorData, address: e.target.value })
                  }
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">Specialization</label>
                <input
                  type="text"
                  className="form-control"
                  required
                  value={doctorData.specialization}
                  onChange={(e) =>
                    setDoctorData({
                      ...doctorData,
                      specialization: e.target.value,
                    })
                  }
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">Consultant Fees</label>
                <input
                  type="text"
                  className="form-control"
                  value={doctorData.consultantFees}
                  onChange={(e) =>
                    setDoctorData({
                      ...doctorData,
                      consultantFees: e.target.value,
                    })
                  }
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">Gender</label>
                <select
                  className="form-select"
                  required
                  value={doctorData.gender}
                  onChange={(e) =>
                    setDoctorData({ ...doctorData, gender: e.target.value })
                  }
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="col-md-6">
                <label className="form-label">Department</label>
                <select
                  className="form-select"
                  required
                  value={doctorData.selectedDept}
                  onChange={(e) =>
                    setDoctorData({
                      ...doctorData,
                      selectedDept: e.target.value,
                    })
                  }
                >
                  <option value="">Select Department</option>
                  {departments.map((dept) => (
                    <option key={dept.DepartmentId} value={dept.DepartmentId}>
                      {dept.DepartmentName}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-md-6">
                <label className="form-label">Role</label>
                <select
                  className="form-select"
                  required
                  value={doctorData.selectedRole}
                  onChange={(e) =>
                    setDoctorData({
                      ...doctorData,
                      selectedRole: e.target.value,
                    })
                  }
                >
                  <option value="">Select Role</option>
                  {roles.map((role) => (
                    <option key={role.RoleId} value={role.RoleId}>
                      {role.RoleName}
                    </option>
                  ))}
                </select>
              </div>

              <div className="d-flex justify-content-center gap-3 mt-3">
                <button type="submit" className="btn btn-success">
                  {loading ? <CircularProgress /> : "Update Doctor"}
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleBack}
                >
                  Back Home
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
export default EditDoctor;
