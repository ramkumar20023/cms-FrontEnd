import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link } from "react-router-dom";
import "../patients/common.css"; // Common CSS for styling
import logo from "../../Images/Helth-care.jpeg"; // Logo image


const EditPatient = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    FirstName: "",
    LastName: "",
    Age: "",
    DOB: "",
    Gender: "Male",
    Address: "",
    PhoneNumber: "",
    EmergencyContact: "",
    BloodGroup: "",
    Allergy: "",
    Notes: "",
    is_active: true,
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchPatient = async () => {
      try {
        console.log(`Fetching patient with ID: ${id}`);
        const token = localStorage.getItem("access_token");
        const response = await axios.get(`http://localhost:8000/api/patients/${id}/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log('Response:', response);
        setFormData(response.data);
      } catch (error) {
        console.error('Error fetching patient:', error);
        alert("Error fetching patient details");
      }
    };

    fetchPatient();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (name === 'PhoneNumber') {
      validatePhoneNumber(value); // Trigger validation on every change for phone number
    }
    if (name === 'EmergencyContact') {
      validateEmergencyContact(value); // Trigger validation on every change for emergency contact
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("access_token");
      await axios.put(
        `http://localhost:8000/api/patients/${id}/`,
        {
          ...formData,
          is_active: formData.is_active === "Active" || formData.is_active === true,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("Patient updated successfully");
      navigate("/patients");
    } catch (error) {
      if (error.response && error.response.data) {
        setErrors(error.response.data);
      } else {
        alert("Error updating patient");
      }
      console.error(error.response?.data || error);
    }
  };

  // Phone number validation function
  const validatePhoneNumber = (phoneNumber) => {
    const regex = /^[0-9]{10}$/; // Only allows exactly 10 digits
    if (!regex.test(phoneNumber)) {
      setErrors((prev) => ({
        ...prev,
        PhoneNumber: ["Phone number must be exactly 10 digits."],
      }));
    } else {
      setErrors((prev) => {
        const { PhoneNumber, ...rest } = prev; // Remove PhoneNumber error if valid
        return rest;
      });
    }
  };

  // Emergency contact validation function
  const validateEmergencyContact = (emergencyContact) => {
    const regex = /^[0-9]{10}$/; // Only allows exactly 10 digits
    if (!regex.test(emergencyContact)) {
      setErrors((prev) => ({
        ...prev,
        EmergencyContact: ["Emergency contact must be exactly 10 digits."],
      }));
    } else {
      setErrors((prev) => {
        const { EmergencyContact, ...rest } = prev; // Remove EmergencyContact error if valid
        return rest;
      });
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
            <h2 className="text-center mb-4">Edit Patient</h2>

            {errors.non_field_errors && (
              <div className="alert alert-danger">{errors.non_field_errors[0]}</div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="row mb-3">
                <div className="col">
                  <label className="form-label">First Name</label>
                  <input
                    type="text"
                    className="form-control"
                    name="FirstName"
                    value={formData.FirstName}
                    onChange={handleChange}
                    required
                  />
                  {errors.FirstName && <div className="text-danger">{errors.FirstName[0]}</div>}
                </div>
                <div className="col">
                  <label className="form-label">Last Name</label>
                  <input
                    type="text"
                    className="form-control"
                    name="LastName"
                    value={formData.LastName}
                    onChange={handleChange}
                    required
                  />
                  {errors.LastName && <div className="text-danger">{errors.LastName[0]}</div>}
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label">Age</label>
                <input
                  type="number"
                  className="form-control"
                  name="Age"
                  value={formData.Age}
                  onChange={handleChange}
                  required
                />
                {errors.Age && <div className="text-danger">{errors.Age[0]}</div>}
              </div>

              <div className="mb-3">
                <label className="form-label">Date of Birth</label>
                <input
                  type="date"
                  className="form-control"
                  name="DOB"
                  value={formData.DOB}
                  onChange={handleChange}
                  required
                />
                {errors.DOB && <div className="text-danger">{errors.DOB[0]}</div>}
              </div>

              <div className="mb-3">
                <label className="form-label">Gender</label>
                <select
                  className="form-select"
                  name="Gender"
                  value={formData.Gender}
                  onChange={handleChange}
                  required
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
                {errors.Gender && <div className="text-danger">{errors.Gender[0]}</div>}
              </div>

              <div className="mb-3">
                <label className="form-label">Address</label>
                <input
                  type="text"
                  className="form-control"
                  name="Address"
                  value={formData.Address}
                  onChange={handleChange}
                  required
                />
                {errors.Address && <div className="text-danger">{errors.Address[0]}</div>}
              </div>

              <div className="mb-3">
                <label className="form-label">Phone Number</label>
                <input
                  type="text"
                  className="form-control"
                  name="PhoneNumber"
                  value={formData.PhoneNumber}
                  onChange={handleChange}
                  required
                />
                {errors.PhoneNumber && <div className="text-danger">{errors.PhoneNumber[0]}</div>}
              </div>

              <div className="mb-3">
                <label className="form-label">Emergency Contact</label>
                <input
                  type="text"
                  className="form-control"
                  name="EmergencyContact"
                  value={formData.EmergencyContact}
                  onChange={handleChange}
                  required
                />
                {errors.EmergencyContact && <div className="text-danger">{errors.EmergencyContact[0]}</div>}
              </div>

              {/* BloodGroup Field */}
              <div className="mb-3">
                <label className="form-label">Blood Group</label>
                <input
                  type="text"
                  className="form-control"
                  name="BloodGroup"
                  value={formData.BloodGroup}
                  onChange={handleChange}
                />
                {errors.BloodGroup && <div className="text-danger">{errors.BloodGroup[0]}</div>}
              </div>

              {/* Allergy Field */}
              <div className="mb-3">
                <label className="form-label">Allergy</label>
                <input
                  type="text"
                  className="form-control"
                  name="Allergy"
                  value={formData.Allergy}
                  onChange={handleChange}
                />
                {errors.Allergy && <div className="text-danger">{errors.Allergy[0]}</div>}
              </div>

              {/* Notes Field */}
              <div className="mb-3">
                <label className="form-label">Notes</label>
                <textarea
                  className="form-control"
                  name="Notes"
                  value={formData.Notes}
                  onChange={handleChange}
                />
                {errors.Notes && <div className="text-danger">{errors.Notes[0]}</div>}
              </div>

              <div className="mb-3">
                <label className="form-label">Status</label>
                <select
                  className="form-select"
                  name="is_active"
                  value={formData.is_active ? "Active" : "Inactive"}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      is_active: e.target.value === "Active",
                    }))
                  }
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>

              <button type="submit" className="btn btn-primary w-100">
                Update Patient
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default EditPatient;
