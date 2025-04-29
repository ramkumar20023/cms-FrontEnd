import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:8000/api/auth/login/", {
        username: username,
        password: password,

      });
      console.log("response", response.data);
      
      localStorage.setItem("token", response.data.access);
      alert("Login Successful!");
      navigate("/dashboard"); // Redirect to the dashboard after login
    } catch (error) {
      setErrorMessage(error.response?.data?.message || "Invalid username or password!");
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Username:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {errorMessage && <div className="error">{errorMessage}</div>}
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
