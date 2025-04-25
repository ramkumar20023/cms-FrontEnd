import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:8000/api/auth/login/", {
        username: username,
        password: password 
      });
      console.log("Access Token:", response.data);

      localStorage.setItem("access", response.data.access);
      localStorage.setItem("refresh", response.data.refresh);
      localStorage.setItem("username", response.data.username);
      localStorage.setItem("role", response.data.role);

      navigate("/dashboard");
    } catch (error) {
      alert("Login failed");
      console.error(error);
    }
  };


  //   const handleLogin = async (e) => {
  //     e.preventDefault();
  //     try {
  //       const response = await axios.post("http://localhost:8000/api/login/", {
  //         username,
  //         password,
  //       });

  //       // ✅ Store access token from correct location in response
  //       localStorage.setItem("token", response.data.tokens.access);

  //       // ✅ Optionally store user info
  //       localStorage.setItem("username", response.data.username);
  //       localStorage.setItem("role", response.data.role);

  //       // ✅ Navigate to dashboard
  //       navigate("/dashboard");
  //     } catch (error) {
  //       console.error("Login error:", error.response?.data || error.message);

  //       // ✅ Show backend message if available, else fallback
  //       alert(error.response?.data?.message || "Invalid login credentials");
  //     }
  //   };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-4">
          <div className="card p-4 shadow">
            <h2 className="text-center">Login</h2>
            <form onSubmit={handleLogin}>
              <div className="mb-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <input
                  type="password"
                  className="form-control"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className="btn btn-primary w-100">
                Login
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;