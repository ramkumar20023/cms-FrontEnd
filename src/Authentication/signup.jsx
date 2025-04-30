import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { CircularProgress } from "@mui/material";
import "../Authentication/index.css";

const Signup = () => {
  const [UserName, setUsername] = useState();
  const [password, setPassword] = useState();
  const [email, setEmail] = useState();
  const [Role, setRole] = useState();
  const [alert, setAlert] = useState({ message: "", type: "" });
  const [loading, setLoading] = useState(false);
  const [passwordWarning, setPasswordWarning] = useState("");

  const navigate = useNavigate();

  const handlesubmit = async (e) => {
    if (password.length < 6) {
      setAlert({
        message: "Password must be at least 6 characters long.",
        type: "danger",
      });
      return;
    }

    e.preventDefault();

    const data = {
      username: UserName,
      password: password,
      group_name: Role,
      email: email,
    };
    setLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:8000/api/auth/signup/",
        data
      );
      console.log("response", response.data);
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("username", response.data.username);
      localStorage.setItem("role", response.data.role);
      setLoading(false);
      setAlert({ message: "Signup Successful!", type: "success" });

      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (error) {
      console.log("error", error.data);
      setLoading(false);
      setAlert({ message: "Signup Failed. Please try again.", type: "danger" });
    }
  };

  useEffect(() => {
    if (alert.message) {
      const timer = setTimeout(() => {
        setAlert({ message: "", type: "" });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [alert]);

  return (
    <section className="d-flex justify-content-center align-items-center vh-100 bg-light flex-column bgcontainer">
      {/* TOP ALERT MESSAGE - Now centered and fixed at top */}
      {alert.message && (
        <div
          className={`alert alert-${alert.type} position-fixed top-0 start-50 translate-middle-x mt-3 shadow rounded`}
          role="alert"
          style={{
            zIndex: 9999,
            fontSize: "1.05rem",
            fontWeight: 500,
            width: "fit-content",
            minWidth: "300px",
            textAlign: "center",
            padding: "12px 20px",
          }}
        >
          {alert.message}
        </div>
      )}
      <div className="text-center mb-4">
        <h1 className="hospital-title">KIMS HOSPITAL</h1>
      </div>
      <div className="card p-4 shadow-sm" style={{ width: "550px" }}>
        <h1 className="text-center mb-4">Signup</h1>
        <div className="mb-3">
          <label htmlFor="username" className="form-label">
            UserName
          </label>
          <input
            type="text"
            className="form-control"
            id="username"
            placeholder="Enter your username"
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="password" className="form-label">
            Password
          </label>
          <input
            type="password"
            className="form-control"
            id="password"
            placeholder="Enter your password"
            onChange={(e) => {
              const pwd = e.target.value;
              setPassword(pwd);

              if (pwd.length > 0 && pwd.length < 6) {
                setPasswordWarning("Password must be at least 6 characters");
              } else if (pwd.length >= 6 && pwd.length < 8) {
                setPasswordWarning(
                  "Warning: Password should be at least 8 characters"
                );
              } else {
                setPasswordWarning("");
              }
            }}
          />
          {/* Password warning below password field */}
          {passwordWarning && (
            <div className="text-warning mt-1" style={{ fontSize: "0.85rem" }}>
              {passwordWarning}
            </div>
          )}
        </div>

        <div className="mb-3">
          <label htmlFor="email" className="form-label">
            Eamil Id
          </label>
          <input
            type="email"
            className="form-control"
            id="email"
            placeholder="Enter your Email Id"
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="mb-4">
          <label htmlFor="role" className="form-label">
            Role
          </label>
          <select
            className="form-select"
            id="role"
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="">Select Role</option>
            <option value="admin">Admin</option>
            <option value="doctor">Doctor</option>
            <option value="receptionist">Receptionist</option>
            <option value="pharmacist">Pharmacist</option>
            <option value="labtech">Lab Technician</option>
          </select>
        </div>

        <button
          className="btn btn-primary w-100 mb-3"
          onClick={handlesubmit}
          disabled={loading}
        >
          {loading ? (
            <CircularProgress size={40} color="secondary" />
          ) : (
            "SIGNUP"
          )}
        </button>

        <div className="text-center">
          <p className="mb-0">
            Already have an account?{" "}
            <a href="/" className="text-decoration-none">
              Login
            </a>
          </p>
        </div>
      </div>
    </section>
  );
};
export default Signup;
