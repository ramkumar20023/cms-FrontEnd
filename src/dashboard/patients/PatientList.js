import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import BackButton from '../../components/BackButton';
import { FaSearch } from 'react-icons/fa';
import { FaUserPlus } from 'react-icons/fa';
import "../patients/common.css"; // Common CSS for styling
import logo from "../../Images/Helth-care.jpeg"; // Logo image
import { useNavigate } from 'react-router-dom';

const PatientList = () => {
  const [patients, setPatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const patientsPerPage = 5;
  const [sortField, setSortField] = useState('full_name');
  const [sortOrder, setSortOrder] = useState('asc');

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const token = localStorage.getItem('access_token');
        const response = await axios.get('http://localhost:8000/api/patients/', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPatients(response.data);
      } catch (error) {
        alert('Error fetching patients');
        console.log(error);
      }
    };

    fetchPatients();
  }, []);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value.toLowerCase());
    setCurrentPage(1); // reset to first page on search
  };

  const handleSort = (field) => {
    const order = sortField === field && sortOrder === 'asc' ? 'desc' : 'asc';
    setSortField(field);
    setSortOrder(order);
  };

  const sortedPatients = [...patients].sort((a, b) => {
    let valA = a[sortField];
    let valB = b[sortField];
    if (typeof valA === 'string') valA = valA.toLowerCase();
    if (typeof valB === 'string') valB = valB.toLowerCase();
    if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
    if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  const filteredPatients = sortedPatients.filter((patient) =>
    patient.full_name.toLowerCase().includes(searchTerm) ||
    patient.PhoneNumber.includes(searchTerm) ||
    (patient.EmergencyContact && patient.EmergencyContact.includes(searchTerm))
  );

  const indexOfLastPatient = currentPage * patientsPerPage;
  const indexOfFirstPatient = indexOfLastPatient - patientsPerPage;
  const currentPatients = filteredPatients.slice(indexOfFirstPatient, indexOfLastPatient);

  const totalPages = Math.ceil(filteredPatients.length / patientsPerPage);
  
  const navigate = useNavigate();
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
    
    <div className="container mt-4">
      <BackButton />

      <div className="mt-5">
        <h2 className="text-center fw-bold mb-4 text-primary">
          <FaUserPlus className="me-2" />Patient List</h2>

        {/* Search Bar */}
        <div className="d-flex justify-content-center mb-4">
          <div className="input-group w-50">
            <span className="input-group-text"><FaSearch /></span>
            <input
              type="text"
              className="form-control"
              placeholder="Search by name or contact"
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>
        </div>

        {/* Patient Table */}
        <div className="card shadow-sm p-4">
          <table className="table table-bordered table-hover">
            <thead className="table-info">
              <tr>
                <th>SL No</th>
                <th onClick={() => handleSort('full_name')} style={{ cursor: 'pointer' }}>Name</th>
                <th onClick={() => handleSort('Age')} style={{ cursor: 'pointer' }}>Age</th>
                <th>Gender</th>
                <th>Phone</th>
                <th>Emergency</th>
                <th onClick={() => handleSort('RegistrationDate')} style={{ cursor: 'pointer' }}>Registered On</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentPatients.length > 0 ? currentPatients.map((patient, index) => (
                <tr key={patient.id}>
                  <td>{(currentPage - 1) * patientsPerPage + index + 1}</td> {/* SL No */}
                  <td>{patient.full_name}</td>
                  <td>{patient.Age}</td>
                  <td>{patient.Gender}</td>
                  <td>{patient.PhoneNumber}</td>
                  <td>{patient.EmergencyContact || '—'}</td>
                  <td>{new Date(patient.RegistrationDate).toLocaleDateString()}</td>
                  <td>
                    <Link to={`/patients/view/${patient.id}`} className="btn btn-info btn-sm me-2">
                      View
                    </Link>
                    <Link to={`/patients/edit/${patient.id}`} className="btn btn-primary btn-sm me-2">
                      Edit
                    </Link>
                    <Link to={`/patients/delete/${patient.id}`} className="btn btn-danger btn-sm">
                      Delete
                    </Link>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="7" className="text-center text-muted">No patients found.</td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="d-flex justify-content-between align-items-center mt-4">
              <button
                className="btn btn-outline-primary btn-sm"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => prev - 1)}
              >
                Previous
              </button>
              <span>Page {currentPage} of {totalPages}</span>
              <button
                className="btn btn-outline-primary btn-sm"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((prev) => prev + 1)}
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  </div>
  );
};

export default PatientList;
