import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import "./common.css";
import logo from "../Images/Health-Logo.png";
import { CircularProgress } from "@mui/material";
import axios from "axios";

const Addstaff = () => {
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [DateofBirth, setDateofBirth] = useState("");
  const [DateofJoining, setDateofJoining] = useState("");
  const [bloodgroup, setBloodgroup] = useState("");
  const [emailId, setEmailId] = useState("");
  const [contactnumber, setContactNumber] = useState("");
  const [address, setAddress] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [roles, setRole] = useState([]);
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
    const fetchRoleData = async () => {
      try {
        const roleres = await axios.get(
          "http://localhost:8000/api/roles/",
          header
        );
        console.log("roledata", roleres.data);
        setRole(roleres.data);
      } catch (error) {
        console.log("error", error.data);
        triggerToast("Error. Fetching Data", "danger");
      }
    };
    fetchRoleData();
  }, []);

  const isValidContact = (number) => {
    const phoneRegex = /^\d{10}$/;
    return phoneRegex.test(number);
  };

  const triggerToast = (message, type = "success") => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleAddStaff = async (e) => {
    e.preventDefault();

    if (!isValidContact(contactnumber)) {
      triggerToast("Contact Number Must Be 10 Digits!", "warning");
      return;
    }
    const data = {
      FirstName: firstname,
      LastName: lastname,
      Age: age,
      Gender: gender,
      Date_of_Birth: DateofBirth,
      Date_of_Joining: DateofJoining,
      BloodGroup: bloodgroup,
      EmailId: emailId,
      phone_Number: contactnumber,
      Address: address,
      Role: selectedRole,
    };

    setLoading(true);
    try {
      await axios.post("http://localhost:8000/api/staff/", data, header);
      setLoading(false);
      triggerToast("Staff Added Successfully", "success");

      setFirstname("");
      setLastname("");
      setAge("");
      setGender("");
      setDateofBirth("");
      setDateofJoining("");
      setBloodgroup("");
      setEmailId("");
      setContactNumber("");
      setAddress("");
      setSelectedRole("");
    }
     catch (error) {
      console.log("error", error.response?.data);
      triggerToast("Staff Adding Failed. Try Again...", "danger");
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
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
            <Link to="/dashboard">Dashboard</Link>
          </li>
          <li>
            <Link to="/ViewStaff">View Staff</Link>
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
            <h3>Add New Staff</h3>
          </div>
          <div className="card-body">
            <form className="row g-3" onSubmit={handleAddStaff}>
              <div className="col-md-6">
                <label className="form-label">First Name</label>
                <input
                  type="text"
                  className="form-control"
                  name="first_name"
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
                  name="last_name"
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
                  name="age"
                  value={age}
                  required
                  onChange={(e) => setAge(e.target.value)}
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">Gender</label>
                <select
                  className="form-select"
                  name="gender"
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
                <label className="form-label">Date of Birth</label>
                <input
                  type="date"
                  className="form-control"
                  name="dob"
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
                  name="doj"
                  value={DateofJoining}
                  required
                  onChange={(e) => setDateofJoining(e.target.value)}
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">Blood Group</label>
                <select
                  className="form-select"
                  name="blood_group"
                  value={bloodgroup}
                  required
                  onChange={(e) => setBloodgroup(e.target.value)}
                >
                  <option value="">Select Blood Group</option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                </select>
              </div>

              <div className="col-md-6">
                <label className="form-label">Email ID</label>
                <input
                  type="email"
                  className="form-control"
                  name="email"
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
                  name="contact"
                  value={contactnumber}
                  required
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '');
                    setContactNumber(value.slice(0, 10));
                  }}
                  maxLength={10}
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">Address</label>
                <input
                  type="text"
                  className="form-control"
                  name="address"
                  value={address}
                  required
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">Role</label>
                <select
                  className="form-select"
                  name="role"
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
                  {loading ? <CircularProgress size={40} color="success"/> : "Add Staff"}
                </button>

                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={() => {
                    setFirstname("");
                    setLastname("");
                    setAge("");
                    setGender("");
                    setDateofBirth("");
                    setDateofJoining("");
                    setBloodgroup("");
                    setEmailId("");
                    setContactNumber("");
                    setAddress("");
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

export default Addstaff;
