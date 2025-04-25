import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

function AvailableLabTests() {
  const [labTests, setLabTests] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [newTest, setNewTest] = useState({
    testName: '',
    price: '',
    minValue: '',
    maxValue: ''
  });

  useEffect(() => {
    fetchTests();
  }, []);

  const fetchTests = () => {
    axios.get('http://localhost:3001/api/labtests')
      .then((res) => setLabTests(res.data))
      .catch((err) => console.log(err));
  };

  const handleInputChange = (e) => {
    setNewTest({ ...newTest, [e.target.name]: e.target.value });
  };

  const handleAddTest = (e) => {
    e.preventDefault();
    axios.post('http://localhost:3001/api/labtests', newTest)
      .then(() => {
        fetchTests();
        setNewTest({ testName: '', price: '', minValue: '', maxValue: '' });
        setShowForm(false);
      })
      .catch((err) => console.log(err));
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this test?')) {
      axios.delete(`http://localhost:3001/api/labtests/${id}`)
        .then(() => fetchTests())
        .catch((err) => console.log(err));
    }
  };

  const handleView = (test) => {
    alert(`Test Details:\n\nName: ${test.testName}\nPrice: ₹${test.price}\nRange: ${test.minValue} - ${test.maxValue}`);
  };

  const filteredTests = labTests.filter(test =>
    test.testName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container mt-5">
      <h2 className="text-center text-primary mb-4">Available Lab Tests</h2>

      <div className="d-flex justify-content-between mb-3">
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : '+ Add Lab Test'}
        </button>
        <input
          type="text"
          className="form-control w-50"
          placeholder="Search Test..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {showForm && (
        <form onSubmit={handleAddTest} className="mb-4 border p-3 rounded bg-light">
          <div className="row">
            <div className="col-md-3 mb-2">
              <input
                type="text"
                className="form-control"
                placeholder="Test Name"
                name="testName"
                value={newTest.testName}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="col-md-2 mb-2">
              <input
                type="number"
                className="form-control"
                placeholder="Price"
                name="price"
                value={newTest.price}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="col-md-2 mb-2">
              <input
                type="number"
                className="form-control"
                placeholder="Min Value"
                name="minValue"
                value={newTest.minValue}
                onChange={handleInputChange}
              />
            </div>
            <div className="col-md-2 mb-2">
              <input
                type="number"
                className="form-control"
                placeholder="Max Value"
                name="maxValue"
                value={newTest.maxValue}
                onChange={handleInputChange}
              />
            </div>
            <div className="col-md-3 mb-2">
              <button type="submit" className="btn btn-success w-100">Save</button>
            </div>
          </div>
        </form>
      )}

      <table className="table table-bordered">
        <thead className="table-info text-center">
          <tr>
            <th>S.No</th>
            <th>Test Name</th>
            <th>Price</th>
            <th>Min Value</th>
            <th>Max Value</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody className="text-center">
          {filteredTests.map((test, index) => (
            <tr key={test.id}>
              <td>{index + 1}</td>
              <td>{test.testName}</td>
              <td>₹{test.price}</td>
              <td>{test.minValue}</td>
              <td>{test.maxValue}</td>
              <td>
                <button className="btn btn-primary btn-sm me-2" onClick={() => handleView(test)}>View</button>
                <button className="btn btn-danger btn-sm" onClick={() => handleDelete(test.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AvailableLabTests;
