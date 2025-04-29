import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import logo from "../Images/Health-Logo.png.jpeg";

const GenerateBill = () => {
  const [billNo, setBillNo] = useState('');
  const [medicineName, setMedicineName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [pricePerUnit, setPricePerUnit] = useState('');
  const [medicines, setMedicines] = useState([]);
  const [addedMedicines, setAddedMedicines] = useState([]);
  const [mrNo, setMrNo] = useState('');
  const [patientName, setPatientName] = useState('');
  const [patientDetails, setPatientDetails] = useState({});
  const navigate = useNavigate();

  // Fetch medicines and patient details from the API
  useEffect(() => {
    const fetchMedicinesAndPatientDetails = async () => {
      const token = localStorage.getItem("token");
      const header = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      try {
        const medicineResponse = await axios.get("http://localhost:8000/api/pharmacists/", header);
        setMedicines(medicineResponse.data);

        if (mrNo) {
          const patientResponse = await axios.get(`http://localhost:8000/api/patients/${mrNo}`, header);
          setPatientDetails(patientResponse.data);
          setPatientName(patientResponse.data.full_name);
        } else if (patientName) {
          const patientResponse = await axios.get(`http://localhost:8000/api/patients?name=${patientName}`, header);
          if (patientResponse.data.length > 0) {
            setPatientDetails(patientResponse.data[0]);
            setMrNo(patientResponse.data[0].mr_no);
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchMedicinesAndPatientDetails();
  }, [mrNo, patientName]);

  // Update price per unit based on selected medicine
  useEffect(() => {
    const selectedMed = medicines.find((med) => med.MedicineName === medicineName);
    if (selectedMed) {
      setPricePerUnit(selectedMed.PricePerUnit || '');
    }
  }, [medicineName, medicines]);

  // Handle adding medicine to the bill
  const handleAddMedicine = () => {
    if (!medicineName || !quantity || !pricePerUnit) return;

    const qty = parseFloat(quantity);
    const price = parseFloat(pricePerUnit);
    const total = qty * price;
    const gst = total * 0.18;

    const newMedicine = {
      medicineName,
      quantity: qty,
      pricePerUnit: price,
      total,
      gst
    };

    setAddedMedicines([...addedMedicines, newMedicine]);
    setMedicineName('');
    setQuantity('');
    setPricePerUnit('');
  };

  // Calculate the grand total, GST, and final amount
  const grandTotal = addedMedicines.reduce((sum, med) => sum + med.total, 0);
  const totalGST = addedMedicines.reduce((sum, med) => sum + med.gst, 0);
  const finalAmount = grandTotal + totalGST;

  // Function to print the bill
  const printBill = () => {
    const printContent = document.querySelector(".printable-area");

    if (!printContent) {
      console.error("The printable-area element is not available.");
      return;
    }

    const originalContent = document.body.innerHTML;
    document.body.innerHTML = printContent.innerHTML;
    window.print();
    document.body.innerHTML = originalContent;
    window.location.reload();
  };

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <div>
      {/* Navbar */}
      <div className="navbar d-flex justify-content-between align-items-center p-2 bg-light shadow">
        <div className="logo-container d-flex align-items-center">
          <img src={logo} alt="Logo" className="logo-img" style={{ width: '50px', height: '50px' }} />
          <span className="logo-text ms-2 h4 mb-0">KIMS</span>
        </div>
        <ul className="nav-links list-unstyled d-flex mb-0">
          <li className="me-3"><Link className="text-decoration-none" to="/dashboard">Dashboard</Link></li>
          <li><Link className="text-decoration-none" to="/" onClick={handleLogout}>Logout</Link></li>
        </ul>
      </div>

      <div className="container mt-5 p-4 shadow bg-light rounded">
        <h2 className="text-center mb-4 text-primary">Medicine Billing</h2>

        <div className="mb-3 row">
          <div className="col-md-2">
            <label className="form-label">Bill No</label>
            <input type="text" className="form-control" value={billNo} onChange={(e) => setBillNo(e.target.value)} />
          </div>
          <div className="col-md-2">
            <label className="form-label">MR No</label>
            <input type="text" className="form-control" value={mrNo} onChange={(e) => setMrNo(e.target.value)} />
          </div>
          <div className="col-md-4">
            <label className="form-label">Patient Name</label>
            <input type="text" className="form-control" value={patientName} onChange={(e) => setPatientName(e.target.value)} />
          </div>
        </div>

        <div className="row g-3 align-items-end mb-3">
          <div className="col-md-4">
            <label className="form-label">Medicine Name</label>
            <select className="form-select" value={medicineName} onChange={(e) => setMedicineName(e.target.value)}>
              <option value="">-- Select Medicine --</option>
              {medicines
                .filter((med) => med.MedicineName && med.PricePerUnit !== null)
                .map((med, index) => (
                  <option key={index} value={med.MedicineName}>{med.MedicineName}</option>
                ))}
            </select>
          </div>
          <div className="col-md-2">
            <label className="form-label">Quantity</label>
            <input type="number" className="form-control" value={quantity} onChange={(e) => setQuantity(e.target.value)} />
          </div>
          <div className="col-md-2">
            <label className="form-label">Price/Unit (₹)</label>
            <input type="number" className="form-control" value={pricePerUnit} onChange={(e) => setPricePerUnit(e.target.value)} />
          </div>
          <div className="col-md-2">
            <button className="btn btn-success w-100" onClick={handleAddMedicine}>+ Add</button>
          </div>
          <div className="col-md-2">
            <button className="btn btn-outline-dark w-100" onClick={printBill}>🖨️ Print</button>
          </div>
        </div>

        {addedMedicines.length > 0 && (
          <>
            <div className="table-responsive">
              <table className="table table-bordered table-striped">
                <thead className="table-dark">
                  <tr>
                    <th>Medicine</th>
                    <th>Quantity</th>
                    <th>Price/Unit (₹)</th>
                    <th>Total (₹)</th>
                    <th>GST (18%)</th>
                  </tr>
                </thead>
                <tbody>
                  {addedMedicines.map((med, index) => (
                    <tr key={index}>
                      <td>{med.medicineName}</td>
                      <td>{med.quantity}</td>
                      <td>{med.pricePerUnit.toFixed(2)}</td>
                      <td>{med.total.toFixed(2)}</td>
                      <td>{med.gst.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="text-end mt-3">
              <p><strong>Grand Total:</strong> ₹{grandTotal.toFixed(2)}</p>
              <p><strong>Total GST (18%):</strong> ₹{totalGST.toFixed(2)}</p>
              <h5 className="text-success"><strong>Final Amount: ₹{finalAmount.toFixed(2)}</strong></h5>
            </div>
          </>
        )}

        {/* Printable Bill Area */}
        <div className="d-none d-print-block mt-5 printable-area">
          <div className="text-center">
            <h4 className="fw-bold mb-0">KIMS HOSPITAL</h4>
            <p className="mb-0">EDAPALLY, KOCHI - 24</p>
            <p className="mb-1">Phone: 0484 2344996, 2335996</p>
            <hr />
            <h6 className="fw-bold">BILL SUMMARY</h6>
            <hr />
          </div>

          <div className="row mb-3 align-items-start">
            {/* Left Side */}
            <div className="col-md-6">
              <div className="d-flex flex-column gap-1">
                <div><strong>Bill No:</strong> {billNo}</div>
                <div><strong>MR No:</strong> {mrNo}</div>
                <div><strong>Patient Name:</strong> {patientDetails.full_name || '-'}</div>
              </div>
            </div>

            {/* Right Side */}
            <div className="col-md-6 text-md-end">
              <div className="d-flex flex-column gap-1">
                <div><strong>Age:</strong> {patientDetails.Age || '-'}</div>
                <div><strong>Gender:</strong> {patientDetails.Gender || '-'}</div>
                <div><strong>Phone Number:</strong> {patientDetails.PhoneNumber || '-'}</div>
              </div>
            </div>
          </div>


          <hr />

          <h6 className="fw-bold text-center">Medicine List</h6>
          <table className="table table-bordered">
            <thead className="table-dark">
              <tr>
                <th>SL</th>
                <th>Medicine</th>
                <th>Price/Unit (₹)</th>
                <th>Quantity</th>
                <th>Total (₹)</th>
                <th>GST (₹)</th>
              </tr>
            </thead>
            <tbody>
              {addedMedicines.map((med, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{med.medicineName}</td>
                  <td>{med.pricePerUnit.toFixed(2)}</td>
                  <td>{med.quantity}</td>
                  <td>{med.total.toFixed(2)}</td>
                  <td>{med.gst.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="text-end mt-3">
            <p><strong>Sub Total:</strong> ₹{grandTotal.toFixed(2)}</p>
            <p><strong>Total GST (18%):</strong> ₹{totalGST.toFixed(2)}</p>
            <h5 className="text-success"><strong>Grand Total: ₹{finalAmount.toFixed(2)}</strong></h5>
          </div>

          <hr />

          <div className="text-center mt-4">
            <p><strong>Thank you for visiting KIMS Hospital!</strong></p>
            <p className="text-muted">For any queries, contact us at 0484 2344996</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GenerateBill;