import React, { useEffect, useState } from 'react';
import axios from 'axios';
import logo from "../Images/Helth-care.jpeg";
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

const LabDeviceTable = () => {
  const navigate = useNavigate();
  const [devices, setDevices] = useState([]);

  useEffect(() => {
    const fetchDevices = async () => {
      const token = localStorage.getItem('access');
      const header = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      try {
        const response = await axios.get("http://localhost:8000/api/lab-devices",header); 
        console.log('Fetched devices:', response.data); 

        setDevices(response.data);
      } catch (error) {
        console.error('Error fetching devices:', error);
      }
    };

    fetchDevices();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
    navigate('/');
  }

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
            <Link to="/" onClick={handleLogout}>
              Logout
            </Link>
          </li>
        </ul>
      </div>
      <div className="container mt-4">
        <h2 className="mb-4">Lab Devices Inventory</h2>
        <table className="table table-bordered table-striped table-hover">
          <thead className="thead-primary">
            <tr>
              {/* <th>S.No</th> */}
              <th>Equipment Name</th>
              <th>Quantity</th>
              <th>Date & Time</th>
              <th>Last Service Date</th>
              <th>Next Service Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {devices.map(device => (
              <tr key={device.ModuleId}>
                <td>{device.EquipmentName}</td>
                <td>{device.Quantity}</td>
                <td>{device.Date}</td>
                <td>{device.Last_Service_Date}</td>
                <td>{device.Next_Service_Date || 'N/A'}</td>
                <td>{device.Status}</td>
                <td>
                  <Link to={`/editlabinventory/${device.ModuleId}`} className='btn btn-primary btn-sm me-2'>Edit</Link>
                  <button className='btn btn-info btn-sm'>View</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LabDeviceTable;
