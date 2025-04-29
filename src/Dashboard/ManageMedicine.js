import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import logo from "../Images/Health-Logo.png.jpeg";

const ManageMedicine = () => {
  const [medicines, setMedicines] = useState([]);
  const [selectedMedicine, setSelectedMedicine] = useState("");
  const [pricePerUnit, setPricePerUnit] = useState("");
  const [medicineQuantity, setMedicineQuantity] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMedicines = async () => {
      const token = localStorage.getItem("token");
      const header = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      try {
        const res = await axios.get("http://localhost:8000/api/pharmacy/", header);
        console.log("medicines", res.data);
        setMedicines(res.data);
      } catch (error) {
        console.log("error", error);
      }
    };
    fetchMedicines();
  }, []);

  const handleMedicineChange = (e) => {
    const selectedId = e.target.value;
    setSelectedMedicine(selectedId);
    const selected = medicines.find((med) => med.MedicineId.toString() === selectedId);
    if (selected) {
      setPricePerUnit(selected.PricePerUnit);
    }
  };

  const handlesubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const header = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  
    try {
      const selected = medicines.find(
        (med) => med.MedicineId.toString() === selectedMedicine
      );
  
      if (!selected) {
        alert("Select a valid medicine");
        return;
      }
  
      const quantityNum = parseInt(medicineQuantity);
      if (isNaN(quantityNum) || quantityNum <= 0) {
        alert("Please enter a valid quantity");
        return;
      }
  
      const updatedQty = selected.Quantity - quantityNum;
      if (updatedQty < 0) {
        alert("Not enough stock available.");
        return;
      }
  
      // Create pharmacist entry
      const pharmacistData = {
        Pharm: selected.MedicineId, // Assuming this is the correct field name
        Quantity: quantityNum,
        // Add Appointment if you have one
      };
  
      const pharmacistResponse = await axios.post(
        "http://localhost:8000/api/pharmacists/",
        pharmacistData,
        header
      );
      console.log("Pharmacist response:", pharmacistResponse.data);
  
      // Update admin quantity with corrected format
      const updateData = {
        MedicineName: selected.MedicineName,  // Ensure this is a string
        Expiry_Date: selected.Expiry_Date,   // Ensure this is a valid date
        lowStock: selected.lowStock,         // Ensure this is a number
        supplier: selected.supplier,         // Ensure this is a string
        Quantity: updatedQty,                // Updated quantity after reduction
      };
  
      // Send PUT request with corrected data format
      const updateResponse = await axios.put(
        `http://localhost:8000/api/pharmacy/${selected.MedicineId}/`,
        updateData,
        header
      );
      console.log("Update response:", updateResponse.data);
  
      alert("Medicine Issued Successfully");
      setSelectedMedicine("");
      setPricePerUnit("");
      setMedicineQuantity("");
  
      // Refresh medicines list
      const res = await axios.get("http://localhost:8000/api/pharmacy/", header);
      setMedicines(res.data);
  
    } catch (error) {
      console.error("Error:", error.response?.data);
      alert("Operation failed: " + (error.response?.data?.message || "Unknown error"));
    }
  };
  
  

  const handleLogout = () => {
    localStorage.removeItem("token");
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
          <li><Link to="/dashboard">Dashboard</Link></li>
          <li><Link to="/EditMedicine">View Medicines</Link></li>
          <li><Link to="/" onClick={handleLogout}>Logout</Link></li>
        </ul>
      </div>

      {/* Medicine Card */}
      <div className="card shadow mx-auto mt-4" style={{ maxWidth: "500px" }}>
        <div className="card-header bg-primary text-white py-2">
          <h5 className="mb-0 text-center">Issue Medicines</h5>
        </div>
        <div className="card-body p-3">
          <form onSubmit={handlesubmit}>
            <div className="mb-2">
              <label className="form-label">Medicine Name</label>
              <select className="form-select form-select-sm" value={selectedMedicine} onChange={handleMedicineChange}>
                <option value="">Select Medicine</option>
                {medicines.map((med) => (
                  <option key={med.MedicineId} value={med.MedicineId}>
                    {med.MedicineName}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-2">
              <label className="form-label">Price Per Unit</label>
              <input type="number" className="form-control form-control-sm" value={pricePerUnit} readOnly />
            </div>

            <div className="mb-3">
              <label className="form-label">Medicine Quantity</label>
              <input
                type="number"
                className="form-control form-control-sm"
                placeholder="Enter Quantity"
                value={medicineQuantity}
                onChange={(e) => setMedicineQuantity(e.target.value)}
              />
            </div>

            <div className="d-flex justify-content-center gap-3">
              <button type="submit" className="btn btn-success btn-sm">Submit</button>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => {
                  setSelectedMedicine("");
                  setPricePerUnit("");
                  setMedicineQuantity("");
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>

    </div>
  );
};

export default ManageMedicine;
