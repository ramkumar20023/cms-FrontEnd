import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom';


function AvailableLabTests() {
  const [labTests, setLabTests] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    axios.get('http://localhost:3001/api/labtests') // Update with your API
      .then((res) => {
        setLabTests(res.data);
      })
      .catch((err) => console.log(err));
  }, []);

  const filteredTests = labTests.filter(test =>
    test.testName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container mt-5">
      <h2 className="text-center text-primary mb-4">Available Lab Tests</h2>

      <div className="d-flex justify-content-between mb-3">
        <Link to="/addtests" className="btn btn-primary">Add Lab Test</Link>
        <input
          type="text"
          className="form-control w-50"
          placeholder="Search Test..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <table className="table table-bordered">
        <thead className="table-info text-center">
          <tr>
            <th>S.No</th>
            <th>Test Name</th>
            <th>Price</th>
            <th>Min Value</th>
            <th>Max Value</th>
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
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AvailableLabTests;
