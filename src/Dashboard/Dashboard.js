import React from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../Images/Helth-care.jpeg";
import "../Dashboard/style.css";


const Dashboard = () => {
  // const [username, setUsername] = useState("");
  // const [role, setRole] = useState("");

  // useEffect(() => {
  //   const storedUsername = localStorage.getItem("username");
  //   const storedRole = localStorage.getItem("role");
  //   console.log("Stored Username:", storedUsername);
  //   console.log("Stored Role:", storedRole);
  //   setUsername(storedUsername);
  //   setRole(storedRole);
  // }, []);

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    // localStorage.removeItem("username");
    // localStorage.removeItem("role");
    navigate("/");
  };
  return (
    <div className="dashboard-container">
      <div className="navbar">
        <div className="logo-container">
          <img
            src={logo}
            alt="Logo"
            className="logo-img"
            onClick={handleLogout}
          />
          <span className="logo-text">KIMS</span>
        </div>

        <ul className="nav-links">
              <li>
                <Link to="/addlabtest">Lab Test</Link>
              </li>
              <li>
                <Link to={`/LabReport/1`}>View Report</Link>
              </li>
              <li>
                <Link to="/addlabbill">Generate Bill</Link>
              </li>
              <li>
                <Link to="/LabInventory">Lab Inventory</Link>
              </li>

        </ul>
      </div>
      <div className="section">
        <h2 className="welcome">Welcome to Lab Technician Management</h2>
      </div>
      {/* <div className="user-info-bar text-center">
        <p className="user-secondary-text">
          Welcome to <span className="underline-text">{username} &</span> Role
          <span className="underline-text">{role}</span>{" "}
          <span className="underline-text logout-link" onClick={handleLogout}>
            Logout
          </span>
        </p>
      </div> */}

      <div className="footer">
        <p>
          &copy; {new Date().getFullYear()} KIMS Hospital. All Rights Reserved.
        </p>
      </div>
    </div>
  );
};

export default Dashboard;