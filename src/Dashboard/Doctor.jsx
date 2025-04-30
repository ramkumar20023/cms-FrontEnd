import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./common.css";
import logo from "../Images/Health-Logo.png";
import axios from "axios";
import { CircularProgress } from "@mui/material";

const Adddoctor = () => {
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [age, setAge] = useState("");
  const [DateofBirth, setDateofBirth] = useState("");
  const [DateofJoining, setDateofJoining] = useState("");
  const [emailId, setEmailId] = useState("");
  const [contactnumber, setContactNumber] = useState("");
  const [address, setAddress] = useState("");
  const [Specialization, setSpecialization] = useState("");
  const [ConsultantFees, setConsultantFees] = useState("");
  const [gender, setGender] = useState("");
  const [selectedDept, setSelectedDept] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [departments, setDepartments] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("success");

  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  const header = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  useEffect(() => {
    const fetchdata = async () => {
      try {
        const deptres = await axios.get(
          "http://localhost:8000/api/departments/",
          header
        );
        const roleres = await axios.get(
          "http://localhost:8000/api/roles/",
          header
        );
        console.log("departments", deptres.data);
        console.log("roles", roleres.data);

        setDepartments(deptres.data);
        setRoles(roleres.data);
      } catch (error) {
        console.log(error);
        triggerToast("Error. Fetching Data", "danger");
      }
    };
    fetchdata();
  }, []);

  const triggerToast = (message, type = "success") => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);

    setTimeout(() => {
      setShowToast(false);
    }, 3000);
  };

  const isValidContact = (number) => {
    const phoneRegex = /^\d{10}$/;
    return phoneRegex.test(number);
  };

  const handleAddDoctor = async (e) => {
    e.preventDefault();

    if (!isValidContact(contactnumber)) {
      triggerToast("Contact Number Must Be 10 Digits!", "warning");
      return;
    }

    const data = {
      FirstName: firstname,
      LastName: lastname,
      Age: age,
      Gender: gender.toLowerCase(),
      Date_of_Birth: DateofBirth,
      Date_of_Joining: DateofJoining,
      EmailId: emailId,
      phone_Number: contactnumber,
      Address: address,
      Specialization: Specialization,
      Consultant_fees: ConsultantFees,
      Department: selectedDept,
      Role: selectedRole,
    };

    console.log("sending data", data);
    setLoading(true);
    try {
      await axios.post("http://localhost:8000/api/doctors/", data, header);
      triggerToast("Doctor Added Successfully", "success");
      setLoading(false);

      setFirstname("");
      setLastname("");
      setAge("");
      setDateofBirth("");
      setDateofJoining("");
      setEmailId("");
      setAddress("");
      setContactNumber("");
      setSpecialization("");
      setConsultantFees("");
      setSelectedDept("");
      setSelectedRole("");
    } catch (error) {
      console.log("error", error.response?.data);
      triggerToast("Doctor Adding Failed. Try Again", "danger");
      setLoading(false);
    }
  };

  const handleLogout = () => {
    navigate("/");
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
            <Link to="/dashboard">Dashboard</Link>
          </li>
          <li>
            <Link to="/Viewdoctor">View Doctor</Link>
          </li>
          <li>
            <Link to="/" onClick={handleLogout}>
              Logout
            </Link>
          </li>
        </ul>
      </div>

      {showToast && (
        <div
          className={`toast-container position-fixed top-0 start-50 translate-middle-x mt-3`}
          style={{ zIndex: 9999 }}
        >
          <div
            className={`toast align-items-center text-white bg-${toastType} border-0 show`}
            role="alert"
          >
            <div className="d-flex">
              <div className="toast-body">{toastMessage}</div>
            </div>
          </div>
        </div>
      )}

      {/* Form inside Card */}
      <div className="container mt-4">
        <div className="card shadow-lg">
          <div className="card-header bg-primary text-white text-center">
            <h3>Add New Doctor</h3>
          </div>
          <div className="card-body">
            <form className="row g-3" onSubmit={handleAddDoctor}>
              <div className="col-md-6">
                <label className="form-label">First Name</label>
                <input
                  type="text"
                  className="form-control"
                  value={firstname}
                  required
                  onChange={(e) => setFirstname(e.target.value)}
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">Last Name</label>
                <input
                  type="text"
                  className="form-control"
                  value={lastname}
                  required
                  onChange={(e) => setLastname(e.target.value)}
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">Age</label>
                <input
                  type="number"
                  className="form-control"
                  value={age}
                  required
                  onChange={(e) => setAge(e.target.value)}
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">Date of Birth</label>
                <input
                  type="date"
                  className="form-control"
                  value={DateofBirth}
                  required
                  onChange={(e) => setDateofBirth(e.target.value)}
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">Date of Joining</label>
                <input
                  type="date"
                  className="form-control"
                  value={DateofJoining}
                  required
                  onChange={(e) => setDateofJoining(e.target.value)}
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">Email ID</label>
                <input
                  type="email"
                  className="form-control"
                  value={emailId}
                  required
                  onChange={(e) => setEmailId(e.target.value)}
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">Contact Number</label>
                <input
                  type="text"
                  className="form-control"
                  value={contactnumber}
                  required
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '');
                    setContactNumber(value);
                  }}
                  maxLength={10}
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">Address</label>
                <input
                  type="text"
                  className="form-control"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">Specialization</label>
                <input
                  type="text"
                  className="form-control"
                  value={Specialization}
                  required
                  onChange={(e) => setSpecialization(e.target.value)}
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">Consultant Fees</label>
                <input
                  type="text"
                  className="form-control"
                  value={ConsultantFees}
                  onChange={(e) => setConsultantFees(e.target.value)}
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">Gender</label>
                <select
                  className="form-select"
                  value={gender}
                  required
                  onChange={(e) => setGender(e.target.value)}
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
                  value={selectedDept}
                  required
                  onChange={(e) => setSelectedDept(e.target.value)}
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
                  value={selectedRole}
                  required
                  onChange={(e) => setSelectedRole(e.target.value)}
                >
                  <option value="">Select Role</option>
                  {roles.map((role) => (
                    <option key={role.RoleId} value={role.RoleId}>
                      {role.RoleName}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-12 text-center mt-3">
                <button type="submit" className="btn btn-success me-5">
                  {loading ? (
                    <CircularProgress size={40} color="success" />
                  ) : (
                    "Add Doctor"
                  )}
                </button>

                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={() => {
                    setFirstname("");
                    setLastname("");
                    setAge("");
                    setDateofBirth("");
                    setDateofJoining("");
                    setEmailId("");
                    setAddress("");
                    setContactNumber("");
                    setSpecialization("");
                    setConsultantFees("");
                    setSelectedDept("");
                    setSelectedRole("");
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Adddoctor;
