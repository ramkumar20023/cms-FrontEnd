import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { CircularProgress } from "@mui/material";

import "./common.css";
import logo from "../Images/Health-Logo.png";

const StaffEdit = () => {
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
  const [alert, setAlert] = useState({ type: "", message: "" });

  const navigate = useNavigate();
  const { Staffid } = useParams();

  useEffect(() => {
    const fetchstaffEdit = async () => {
      try {
        const token = localStorage.getItem("token");
        const header = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
        const roleRes = await axios.get(
          "http://localhost:8000/api/roles/",
          header
        );
        const staffRes = await axios.get(
          `http://localhost:8000/api/staff/${Staffid}/`,
          header
        );
        console.log("staff", staffRes.data);
        console.log("Role", roleRes.data);

        setRole(roleRes.data);

        setFirstname(staffRes.data.FirstName);
        setLastname(staffRes.data.LastName);
        setAge(staffRes.data.Age);
        setGender(staffRes.data.Gender);
        setDateofBirth(staffRes.data.Date_of_Birth);
        setDateofJoining(staffRes.data.Date_of_Joining);
        setBloodgroup(staffRes.data.BloodGroup);
        setEmailId(staffRes.data.EmailId);
        setContactNumber(staffRes.data.phone_Number);
        setAddress(staffRes.data.Address);
        setSelectedRole(staffRes.data.Role);

        setRole(roleRes.data);
      } catch (error) {
        console.log("error", error.response?.data);
        setAlert({ type: "warning", message: "Error. Fetching Data" });
        setTimeout(() => setAlert({ type: "", message: "" }), 3000);
      }
    };

    fetchstaffEdit();
  }, [Staffid]);


  const isValidContact = (number) => {
    const phoneRegex = /^\d{10}$/;
    return phoneRegex.test(number);
  };

  const handleUpdateStaff = async (e) => {
    e.preventDefault();
    if (!isValidContact(contactnumber)) {
      setAlert({ type: "warning", message: "Contact number must be 10 digits!" });
      setTimeout(() => setAlert({ type: "", message: "" }), 3000);
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
    console.log("update data", data);

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const header = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      await axios.put(`http://localhost:8000/api/staff/${Staffid}/`, data, header);
      setAlert({ type: "success", message: "Staff updated successfully!" });

      setTimeout(() => {
        setAlert({ type: "", message: "" });
      }, 2000);

      setLoading(false);
    } catch (error) {
      setAlert({ type: "danger", message: "Update failed. Try again!" });

      setTimeout(() => setAlert({ type: "", message: "" }), 3000);
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const handleBackClick = () => {
    navigate("/ViewStaff");
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
            <Link to="/Addstaff">Home</Link>
          </li>
          <li>
            <Link to="/StaffView">Staff List</Link>
          </li>
          <li>
            <Link to="/" onClick={handleLogout}>
              Logout
            </Link>
          </li>
        </ul>
      </div>

      {alert.message && (
        <div
          className={`alert alert-${alert.type} text-center position-fixed top-0 start-50 translate-middle-x mt-3 w-50`}
          role="alert"
          style={{ zIndex: 1000 }}
        >
          {alert.message}
        </div>
      )}

      <div className="container mt-4">
        <div className="card shadow-lg">
          <div className="card-header bg-primary text-white text-center">
            <h3>Edit Staff</h3>
          </div>

          <div className="card-body">
            <form className="row g-3" onSubmit={handleUpdateStaff}>
              <div className="col-md-6">
                <label className="form-label">First Name</label>
                <input
                  type="text"
                  className="form-control"
                  value={firstname}
                  onChange={(e) => setFirstname(e.target.value)}
                  required
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">Last Name</label>
                <input
                  type="text"
                  className="form-control"
                  value={lastname}
                  onChange={(e) => setLastname(e.target.value)}
                  required
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">Age</label>
                <input
                  type="number"
                  className="form-control"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  required
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">Gender</label>
                <select
                  className="form-select"
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  required
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
                  value={DateofBirth}
                  onChange={(e) => setDateofBirth(e.target.value)}
                  required
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">Date of Joining</label>
                <input
                  type="date"
                  className="form-control"
                  value={DateofJoining}
                  onChange={(e) => setDateofJoining(e.target.value)}
                  required
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">Blood Group</label>
                <select
                  className="form-select"
                  value={bloodgroup}
                  onChange={(e) => setBloodgroup(e.target.value)}
                  required
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
                  value={emailId}
                  onChange={(e) => setEmailId(e.target.value)}
                  required
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">Contact Number</label>
                <input
                  type="text"
                  className="form-control"
                  value={contactnumber}
                  onChange={(e) => {
                    // Allow only digits and limit to 10 characters
                    const value = e.target.value.replace(/\D/g, '').slice(0, 10);
                    setContactNumber(value);
                  }}
                  required
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
                  required
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">Role</label>
                <select
                  className="form-select"
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  required
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
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    "Update Staff"
                  )}
                </button>

                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleBackClick}
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
export default StaffEdit;
