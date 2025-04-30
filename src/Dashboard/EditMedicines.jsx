import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import logo from "../Images/Health-Logo.png.jpeg";
import "bootstrap/dist/css/bootstrap.min.css";
import { Modal, Button } from "react-bootstrap";

const EditMedicines = () => {
  const [medicines, setMedicines] = useState([]);
  const [filteredMedicines, setFilteredMedicines] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchClicked, setSearchClicked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedMedicineId, setSelectedMedicineId] = useState(null);

  useEffect(() => {
    fetchMedicines();
  }, []);

  const fetchMedicines = async () => {
    const token = localStorage.getItem("token");
    const header = { headers: { Authorization: `Bearer ${token}` } };
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:8000/api/pharmacy/", header);
      setMedicines(response.data);
      setFilteredMedicines(response.data);
    } catch (error) {
      setError("Error fetching medicines");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    const term = searchTerm.trim().toLowerCase();
    const filtered = medicines.filter((m) =>
      m.MedicineName.toLowerCase().includes(term)
    );
    setFilteredMedicines(filtered);
    setSearchClicked(true);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    if (e.target.value.trim() === "") {
      setFilteredMedicines(medicines);
      setSearchClicked(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  const handleEdit = (medicine) => {
    const newQuantity = prompt(
      `Current quantity for ${medicine.MedicineName} is ${medicine.Quantity}. Enter new quantity (<= current):`
    );

    if (newQuantity !== null) {
      const newQty = parseInt(newQuantity, 10);
      if (isNaN(newQty)) {
        alert("Please enter a valid number.");
      } else if (newQty > medicine.Quantity) {
        alert(`Quantity cannot exceed current stock (${medicine.Quantity}).`);
      } else if (newQty < 0) {
        alert("Quantity cannot be negative.");
      } else {
        updateQuantity(medicine.MedicineId, newQty);
      }
    }
  };

  const updateQuantity = async (medicineId, newQuantity) => {
    try {
      const token = localStorage.getItem("token");
      const header = { headers: { Authorization: `Bearer ${token}` } };

      const response = await axios.patch(
        `http://localhost:8000/api/pharmacy/${medicineId}/`,
        { Quantity: newQuantity },
        header
      );

      const updatedList = medicines.map((m) =>
        m.MedicineId === medicineId ? { ...m, Quantity: newQuantity } : m
      );
      setMedicines(updatedList);
      setFilteredMedicines(updatedList);
      alert(`Quantity for ${response.data.MedicineName} updated successfully.`);
    } catch (error) {
      alert("Error updating quantity.");
    }
  };

  const confirmDelete = (id) => {
    setSelectedMedicineId(id);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirmed = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:8000/api/pharmacy/${selectedMedicineId}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const updatedList = medicines.filter((m) => m.MedicineId !== selectedMedicineId);
      setMedicines(updatedList);
      setFilteredMedicines(updatedList);
      setShowDeleteModal(false);
    } catch (err) {
      alert("Failed to delete medicine");
    }
  };

  return (
    <div>
      {/* Navbar */}
      <div className="navbar bg-light shadow-sm p-3">
        <div className="logo-container d-flex align-items-center">
          <img src={logo} alt="Logo" className="logo-img" style={{ width: 40, height: 40 }} />
          <span className="logo-text fs-4 ms-2 fw-bold text-primary">KIMS</span>
        </div>
        <ul className="nav-links list-unstyled d-flex gap-4 mb-0">
          <li><Link className="text-decoration-none" to="/pharmdashboard">Dashboard</Link></li>
          <li><Link className="text-decoration-none text-danger" to="/" onClick={handleLogout}>Logout</Link></li>
        </ul>
      </div>

      <div className="container mt-5">
        <h3 className="text-primary text-center mb-4">Medicine List</h3>

        {/* Search Bar */}
        <div className="d-flex justify-content-end mb-3">
          <input
            type="text"
            className="form-control me-2"
            placeholder="Search by medicine name..."
            value={searchTerm}
            onChange={handleSearchChange}
            style={{ width: "250px" }}
          />
          <button className="btn btn-primary" onClick={handleSearch}>Search</button>
        </div>

        {/* No Result Message */}
        {searchClicked && filteredMedicines.length === 0 && (
          <p className="text-warning">
            No tablets found for "{searchTerm}". Try a different name.
          </p>
        )}

        {/* Data Table */}
        {loading ? (
          <div className="text-center">
            <div className="spinner-border text-primary" />
          </div>
        ) : error ? (
          <p className="text-danger">{error}</p>
        ) : (
          <div className="table-responsive">
            <table className="table table-striped table-bordered shadow-sm rounded">
              <thead className="table-primary text-center">
                <tr>
                  <th>S.No</th>
                  <th>Medicine Name</th>
                  <th>Total Quantity</th>
                  <th>Price per Unit</th>
                  <th>Expiry Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody className="text-center align-middle">
                {filteredMedicines.map((medicine, index) => (
                  <tr key={medicine.MedicineId}>
                    <td>{index + 1}</td>
                    <td className="fw-semibold">{medicine.MedicineName}</td>
                    <td>{medicine.Quantity}</td>
                    <td>₹{medicine.PricePerUnit}</td>
                    <td>{medicine.Expiry_Date}</td>
                    <td>
                      {medicine.Quantity <= 10 ? (
                        <span className="badge bg-danger">
                          Low Stock ({medicine.Quantity})
                        </span>
                      ) : (
                        <span className="badge bg-success">In Stock</span>
                      )}
                    </td>
                    <td>
                      <button
                        className="btn btn-sm btn-warning me-2"
                        onClick={() => handleEdit(medicine)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => confirmDelete(medicine.MedicineId)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this medicine?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDeleteConfirmed}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default EditMedicines;
