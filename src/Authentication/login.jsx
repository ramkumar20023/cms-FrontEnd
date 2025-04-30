import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CircularProgress } from "@mui/material";
import "../Authentication/index.css";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ message: "", type: "" });

  const navigate = useNavigate();

  const handlelogin = async (e) => {
    e.preventDefault();
    const data = {
      username: username,
      password: password,
    };
    setLoading(true);
    try {
      const res = await axios.post(
        "http://localhost:8000/api/auth/login/",
        data
      );
      console.log("token", res.data);
      localStorage.setItem("token", res?.data?.access);
      localStorage.setItem("username", res.data.username);
      localStorage.setItem("role", res.data.role);
      setLoading(false);
      setAlert({ message: "Login Successfully!", type: "success" });

      setTimeout(() => {
        switch (res.data.role) {
          case "Admin":
            navigate("/dashboard");
            break;
          case "Doctor":
            navigate("/DoctorDashboard");
            break;
          case "Receptionist":
            navigate("/receptionist"); // change based on your path
            break;
          case "Pharmacist":
            navigate("/pharmacist"); // change based on your path
            break;
          case "Lab Technician":
            navigate("/lab"); // change based on your path
            break;
          default:
            navigate("/Unauthorized");
        }
      }, 1500);
    } catch (error) {
      console.log(error);
      setLoading(false);
      setAlert({ message: "Invalid Login Credentials", type: "danger" });

      setTimeout(() => {
        setAlert({ message: "", type: "" });
      }, 4000);
    }
  };

  return (
    <section className="d-flex justify-content-center align-items-center vh-100 bg-light flex-column bgcontainer">
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

      <h1 className="mb-4 hospital-title">KIMS HOSPITAL</h1>
      <div className="card p-4 shadow-sm" style={{ width: "400px" }}>
        <h1 className="text-center mb-4">Login</h1>
        <div className="mb-3">
          <label htmlFor="username" className="form-label">
            UserName:
          </label>
          <input
            type="text"
            className="form-control"
            id="username"
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label htmlFor="password" className="form-label">
            Password:
          </label>
          <input
            type="password"
            className="form-control"
            id="password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button
          className="btn btn-primary w-100 mb-3"
          onClick={handlelogin}
          disabled={loading}
        >
          {loading ? <CircularProgress size={40} color="secondary" /> : "LOGIN"}
        </button>
        <div className="text-center">
          <p className="mb-0">
            Don't have an account?{" "}
            <a href="/signup" className="text-decoration-none">
              Sign Up
            </a>
          </p>
        </div>
      </div>
    </section>
  );
};
export default Login;
