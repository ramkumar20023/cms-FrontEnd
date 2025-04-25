import React, { useEffect, useState } from "react";
import axios from "axios";
import "../Dashboard/style.css";
import logo from "../Images/Helth-care.jpeg";
import { useNavigate, Link } from "react-router-dom";

const LabBilling = () => {
  const [labTests, setLabTests] = useState([]);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [selectedTestId, setSelectedTestId] = useState("");
  const [billingData, setBillingData] = useState({
    DeviceCharge: 0,
    ServiceCharge: 0,
    TestingCharge: 0,
    TotalPrice: 0,
  });

  const [printInfo, setPrintInfo] = useState(null);
  const navigate = useNavigate();

  const token = localStorage.getItem("access");
  const headers = { headers: { Authorization: `Bearer ${token}` } };

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [labRes, patientRes, doctorRes] = await Promise.all([
          axios.get("http://localhost:8000/api/labtests/", headers),
          axios.get("http://localhost:8000/api/patients/", headers),
          axios.get("http://localhost:8000/api/doctorinform/", headers),
        ]);
        setLabTests(labRes.data);
        setPatients(patientRes.data);
        setDoctors(doctorRes.data);
      } catch (error) {
        console.error("Error loading data", error);
      }
    };
    fetchInitialData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updated = { ...billingData, [name]: parseFloat(value) || 0 };
    updated.TotalPrice = updated.DeviceCharge + updated.ServiceCharge + updated.TestingCharge;
    setBillingData(updated);
  };

  const handleSubmit = async () => {
    try {
      const test = labTests.find((t) => t.LaboratoryId === parseInt(selectedTestId));
      const patient = patients.find((p) => p.PatientId === test?.patientinform);
      const doctor = doctors.find((d) => d.informId === test?.Reffered_by);

      const data = {
        ...billingData,
        LabTest: test?.LaboratoryId,
        PatientName: patient?.full_name,
        ReferredBy: doctor?.DoctorName,
      };
      console.log("Submitting bill data:", data);

      await axios.post("http://localhost:8000/api/labbills/", data, headers);
      setPrintInfo({ test, billing: data, patient, doctor });
    } catch (error) {
      console.error("Error submitting bill", error);
    }
  };

  const printBill = () => {
    const printContent = document.querySelector(".printable-area");
    const originalContent = document.body.innerHTML;

    document.body.innerHTML = printContent.innerHTML;
    window.print();
    document.body.innerHTML = originalContent;
    window.location.reload(); // Reload to restore the original state
  };

  const handleLogout = () => {
    localStorage.removeItem("access");
    navigate("/login");
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
            <Link to="/" onClick={handleLogout}>Logout</Link>
          </li>
        </ul>
      </div>

      <div className="container mt-5">
        <div className="card p-4 shadow">
          <h2 className="mb-4">Generate Lab Bill</h2>
          <div className="mb-3">
            <label>Select Lab Test</label>
            <select className="form-control" onChange={(e) => setSelectedTestId(e.target.value)} value={selectedTestId}>
              <option value="">Select a test</option>
              {labTests.map((test) => (
                <option key={test.LaboratoryId} value={test.LaboratoryId}>
                  {test.TestName} (Sample #{test.sample_No})
                </option>
              ))}
            </select>
          </div>

          <div className="row mb-3">
            {["DeviceCharge", "ServiceCharge", "TestingCharge"].map((field) => (
              <div className="col-md-4" key={field}>
                <label>{field.replace("Charge", " Charge")}</label>
                <input
                  type="number"
                  className="form-control"
                  name={field}
                  value={billingData[field]}
                  onChange={handleChange}
                />
              </div>
            ))}
            <div className="col-md-4">
              <label>Total Price</label>
              <input type="number" className="form-control" value={billingData.TotalPrice} readOnly />
            </div>
          </div>

          <button className="btn btn-success" onClick={handleSubmit}>Generate & Print</button>
        </div>

        {/* Printable Bill Card */}
        {/* Printable Bill Card */}
        {printInfo && (
          <div className="printable-area mt-5 d-flex justify-content-center d-print-block">
            <div className="card p-4 shadow" style={{ maxWidth: "600px", width: "100%" }}>
              <h2 className="text-center mb-3">KIMS HOSPITAL</h2>
              <hr />
              <h5 className="mt-3">Patient Information</h5>
              <p><strong>MR.No:</strong> {printInfo.patient?.RegNo}</p>
              <p><strong>Name:</strong> {printInfo.patient?.FirstName} {printInfo.patient?.LastName}</p>

              <hr />
              <h5 className="mt-3">Lab Test Information</h5>
              <p><strong>Test Name:</strong> {printInfo.test?.TestName}</p>
              <p><strong>Testing Charge:</strong> ₹{printInfo.billing.TestingCharge.toFixed(2)}</p>
              <p><strong>Total Price:</strong> ₹{printInfo.billing.TotalPrice.toFixed(2)}</p>

              <hr />
              <h5 className="mt-3">Referred By</h5>
              <p><strong>Doctor Name:</strong> {printInfo.doctor?.DoctorName}</p>

              <div className="text-end mt-4">
                <button className="btn btn-primary" onClick={printBill}>Print</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LabBilling;