import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import BackButton from "../../components/BackButton";
import { FaUserPlus } from "react-icons/fa"; // Icon for Add Patient
import { Link } from "react-router-dom";
import "../patients/common.css"; // Common CSS for styling
import logo from "../../Images/Helth-care.jpeg"; // Logo image

// Function to calculate age based on DOB
const calculateAge = (dob) => {
  const birthDate = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
};

const AddPatient = () => {
  const [bloodGroup, setBloodGroup] = useState("");
  const [allergy, setAllergy] = useState("");
  const [notes, setNotes] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [age, setAge] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("male");
  const [address, setAddress] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [emergencyContact, setEmergencyContact] = useState("");
  const [status, setStatus] = useState("Active");

  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  // Handle DOB change and auto-calculate age
  const handleDobChange = (e) => {
    const newDob = e.target.value;
    setDob(newDob);
    const calculatedAge = calculateAge(newDob);
    setAge(calculatedAge); // Auto-set age based on DOB
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Reset previous errors
    setErrors({});

    // Frontend validation
    const validationErrors = {};

    // Phone Number validation
    if (!phoneNumber.match(/^\d{10}$/)) {
      validationErrors.phoneNumber = "Phone number must be exactly 10 digits.";
    }

    // Emergency Contact validation
    if (!emergencyContact.match(/^\d{10}$/)) {
      validationErrors.emergencyContact = "Emergency contact must be exactly 10 digits.";
    }

    // Age and DOB validation
    if (dob && age) {
      const calculatedAge = calculateAge(dob);
      if (parseInt(age) !== calculatedAge) {
        validationErrors.age = `Age does not match Date of Birth. Expected age is ${calculatedAge}.`;
      }
    }

    // Check if there are any validation errors
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return; // Stop submission if there are validation errors
    }

    try {
      const token = localStorage.getItem("access_token");
      const response = await axios.post(
        "http://localhost:8000/api/patients/",
        {
          FirstName: firstName,
          LastName: lastName,
          Age: age,
          DOB: dob,
          Gender: gender,
          Address: address,
          PhoneNumber: phoneNumber,
          BloodGroup: bloodGroup,
          Allergy: allergy,
          Notes: notes,
          EmergencyContact: emergencyContact,
          is_active: status === "Active",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("Patient added successfully");
      navigate("/dashboard");

      setFirstName("");
    } catch (error) {
      if (error.response && error.response.data) {
        setErrors(error.response.data); // Handle backend errors
      } else {
        alert("Error adding patient");
        console.error(error);
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    navigate("/login");
  }
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
            <Link to="/patients">View Patient</Link>
          </li>
          <li>
            <Link to="/" onClick={handleLogout}>
              Logout
            </Link>
          </li>
        </ul>
      </div>
          <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card shadow p-4 mb-5">
            <h2 className="text-center fw-bold mb-4 text-primary">
              <FaUserPlus className="me-2" />
              Add Patient
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="row mb-3">
                <div className="col">
                  <label className="form-label">First Name</label>
                  <input
                    type="text"
                    className="form-control"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                  />
                </div>
                <div className="col">
                  <label className="form-label">Last Name</label>
                  <input
                    type="text"
                    className="form-control"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label">Date of Birth</label>
                <input
                  type="date"
                  className="form-control"
                  value={dob}
                  onChange={handleDobChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Age</label>
                <input
                  type="number"
                  className="form-control"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  required
                  readOnly
                />
                {errors.age && <div className="text-danger">{errors.age}</div>}
              </div>

              <div className="mb-3">
                <label className="form-label">Gender</label>
                <select
                  className="form-select"
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  required
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="mb-3">
                <label className="form-label">Address</label>
                <input
                  type="text"
                  className="form-control"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Phone Number</label>
                <input
                  type="text"
                  className="form-control"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  required
                />
                {errors.phoneNumber && (
                  <div className="text-danger">{errors.phoneNumber}</div>
                )}
              </div>

              <div className="mb-3">
                <label className="form-label">Emergency Contact</label>
                <input
                  type="text"
                  className="form-control"
                  value={emergencyContact}
                  onChange={(e) => setEmergencyContact(e.target.value)}
                  required
                />
                {errors.emergencyContact && (
                  <div className="text-danger">{errors.emergencyContact}</div>
                )}
              </div>

              <div className="mb-3">
                <label className="form-label">Blood Group</label>
                <select
                  className="form-select"
                  value={bloodGroup}
                  onChange={(e) => setBloodGroup(e.target.value)}
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

              <div className="mb-3">
                <label className="form-label">Allergy</label>
                <input
                  type="text"
                  className="form-control"
                  value={allergy}
                  onChange={(e) => setAllergy(e.target.value)}
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Notes</label>
                <textarea
                  className="form-control"
                  rows="1"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Status</label>
                <select
                  className="form-select"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>

              <button type="submit" className="btn btn-primary w-100">
                Add Patient
              </button>
            </form>
            {/* Back Button - Beneath the Add Bill button */}
            <div className="mt-3">
              <BackButton className="btn btn-secondary w-100" />
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default AddPatient;
