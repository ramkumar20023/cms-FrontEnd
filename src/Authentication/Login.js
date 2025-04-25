import {useState} from "react";
import axios from "axios";
import {useNavigate} from "react-router-dom";

//function for login
const Login=()=>{
    const[username,setUsername]=useState("");
    const[password,setPassword]=useState("");

    const navigate=useNavigate();
    //defines an asynchronouus function to handle login when the form is submitted
    const handleLogin=async(e)=>{
        e.preventDefault();
        try{
            const response=await axios.post("http://localhost:8000/api/auth/login/",{
                username,
                password,
            });
            localStorage.setItem("access_token", response.data.access);
            localStorage.setItem("refresh_token", response.data.refresh);
            localStorage.setItem("username", username);
            navigate("/dashboard");
        }catch(error){
            alert("Invalid login credentials")
            console.log(error)
        }
    };
    
    return(
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
                                    onChange={(e)=>setUsername(e.target.value)} 
                                    required 
                                />
                            </div>
                            <div className="mb-3">
                                <input 
                                    type="password" 
                                    className="form-control" 
                                    placeholder="Password"
                                    onChange={(e)=>setPassword(e.target.value)} 
                                    required 
                                />
                            </div>
                            <button type="submit" className="btn btn-primary w-100">Login</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );  
};
export default Login;

