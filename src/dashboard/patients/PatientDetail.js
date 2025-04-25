import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from "react-router-dom";
import "../patients/common.css"; // Common CSS for styling
import logo from "../../Images/Helth-care.jpeg"; // Logo image
import { useNavigate } from 'react-router-dom';



const PatientDetails = () => {
  const { id } = useParams();
  const [patient, setPatient] = useState(null);
  const [tab, setTab] = useState('details');
  const [appointments, setAppointments] = useState([]);
  const [bills, setBills] = useState([]);

useEffect(() => {
  const fetchData = async () => {
    try {
      const token = localStorage.getItem("access_token");
      const headers = {
        Authorization: `Bearer ${token}`
      };

      const patientRes = await axios.get(`http://localhost:8000/api/patients/${id}/`, { headers });
      setPatient(patientRes.data);

      const apptRes = await axios.get(`http://localhost:8000/api/patients/${id}/appointments/`, { headers });
      setAppointments(apptRes.data);

      const billRes = await axios.get(`http://localhost:8000/api/patients/${id}/bills/`, { headers });
      setBills(billRes.data);
    } catch (error) {
      console.error('Error fetching patient data:', error);
    }
  };

  fetchData();
}, [id]);

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    navigate("/login");
  }

  const navigate = useNavigate();

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
      
    
    <div className="container p-4">
      {/* Tabs */}
      <div className="d-flex mb-4">
        <button
          className={`btn px-4 py-2 rounded me-2 ${tab === 'details' ? 'btn-primary' : 'btn-light'}`}
          onClick={() => setTab('details')}
        >
          Patient Details
        </button>
        <button
          className={`btn px-4 py-2 rounded ${tab === 'history' ? 'btn-primary' : 'btn-light'}`}
          onClick={() => setTab('history')}
        >
          Patient History
        </button>
      </div>

      {/* Patient Details Tab */}
      {tab === 'details' && patient && (
        <div className="card shadow-sm mb-4">
        <div className="card-body">
        <h2 className="card-title mb-4">{patient.full_name}</h2>
        <div className="row">
          <div className="col-md-6">
            <p><strong>Phone:</strong> {patient.PhoneNumber}</p>
            <p><strong>Age:</strong> {patient.Age}</p>
            <p><strong>DOB:</strong> {patient.DOB}</p>
            <p><strong>Gender:</strong> {patient.Gender}</p>
            <p><strong>Status:</strong> {patient.is_active ? "Active" : "Inactive"}</p>
          </div>
          <div className="col-md-6">
            <p><strong>Address:</strong> {patient.Address}</p>
            <p><strong>Blood Group:</strong> {patient.BloodGroup}</p>
            <p><strong>Allergy:</strong> {patient.Allergy || 'N/A'}</p>
            <p><strong>Emergency Contact:</strong> {patient.EmergencyContact || 'N/A'}</p>
            <p><strong>Notes:</strong> {patient.Notes || 'No notes available.'}</p>
          </div>
        </div>

        <div className="mt-4 text-end">
          <Link to={`/patients/edit/${patient.PatientId}`} className="btn btn-warning">
            Edit Patient
          </Link>
        </div>
      </div>


            {/* Add more fields as needed */}
          </div>
      )}

      {/* Patient History Tab */}
      {tab === 'history' && (
        <div>
          {/* Appointment History Section */}
          <div className="card shadow-sm mb-4">
            <div className="card-body">
              <h3 className="card-title mb-3">Appointment History</h3>
              {appointments.length > 0 ? (
                <table className="table table-striped">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Time</th>
                      <th>Doctor</th>
                      <th>Status</th>
                      <th>Token</th>
                    </tr>
                  </thead>
                  <tbody>
                    {appointments.map((appt) => (
                      <tr key={appt.id}>
                        <td>{appt.AppointmentDate.split('T')[0]}</td>
                        <td>{appt.AppointmentTime}</td>
                        <td>{appt.get_doctor_name}</td>
                        <td>{appt.Status}</td>
                        <td>{appt.Token}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p>No appointment history found.</p>
              )}
            </div>
          </div>

          {/* Billing History Section */}
          <div className="card shadow-sm">
            <div className="card-body">
              <h3 className="card-title mb-3">Billing History</h3>
              {bills.length > 0 ? (
                <table className="table table-striped">
                  <thead>
                    <tr>
                      <th>Bill ID</th>
                      <th>Appointment Token</th>
                      <th>Consultant Fees</th>
                      <th>Service Charge</th>
                      <th>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bills.map((bill) => (
                      <tr key={bill.id}>
                        <td>{bill.BillId}</td>
                        <td>{bill.Token}</td>
                        <td>₹{bill.Consultant_fees}</td>
                        <td>₹{bill.ServiceCharge}</td>
                        <td>₹{bill.TotalCost}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p>No billing history found.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
    </div>
  );
};

export default PatientDetails;
