<<<<<<< HEAD

//useState-React Hook to manage form Data
import {useState} from "react";
// axios library for making HTTP requests
import axios from "axios";
//A hook from react router to navigate between pages
import {useNavigate} from "react-router-dom";

//defines a Signup component.
const Signup=()=>{
    //useState() initializes a state variable called username
    //with an empty string as the default value
    const[username,setUsername]=useState("");
    const[password,setPassword]=useState("");
    const[group_name,setGroupName]=useState("");
    //useNavigate() is a react router hook that allows navigations
    //to different pages.
    const navigate=useNavigate(); 

//defines an asynchronous function named handlesignup
    const handlesignup=async(e)=>{
        //normally whena a form is submitted, the browser reloads the page
        //e.preventDefault srops this default behaviour, so the page does not refresh
        e.preventDefault();
        try{
            //axios.post(url,data) is used to send data to the backend
            const response=await axios.post("http://localhost:8000/api/auth/signup/",{
                username,
                password,
                group_name,
            });
            //localStorage.setItem("key",value) stores data in the browser
            //the token received from the backend is saved with the key "token"

            localStorage.setItem("access_token", response.data.access);
            localStorage.setItem("refresh_token", response.data.refresh);
            alert("Signup successfull...");
            navigate("/dashboard");
        }catch(error){
            alert("Error signing up..please try again")
            console.log(error)
=======
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Signup = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [group_name, setGroupName] = useState("");  // Group/Role

    const navigate = useNavigate();

    const handleSignup = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("http://localhost:8000/api/auth/signup/", {
                username: username,
                password: password,
                group_name: group_name // Send the group/role here
            });
            console.log("response", response.data);
            
            // Store tokens in localStorage for future use
            localStorage.setItem("access_token",response.data.access);


            alert("Signup Successful!");
            navigate("/");  // Redirect to the homepage or dashboard after signup
        } catch (error) {
            alert("Error signing up. Please try again.");
>>>>>>> 6b41202 (Initial commit)
        }
    };

    return (
        <div className="container mt-5">
<<<<<<< HEAD
            <div className="row justify-content-center">  
                <div className="col-md-4">
                    <div className="card p-4 shadow">
                        <h2 className="text-center">Signup</h2> 
                        <form onSubmit={handlesignup}>
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
                            <div className="mb-3">
                                <input 
                                    type="text" 
                                    className="form-control" 
                                    placeholder="Group Name"
                                    onChange={(e)=>setGroupName(e.target.value)} 
                                    required 
=======
            <div className="row justify-content-center">
                <div className="col-md-4">
                    <div className="card p-4 shadow">
                        <h2 className="text-center">Signup</h2>
                        <form onSubmit={handleSignup}>
                            <div className="mb-3">
                                <input
                                    type="text"
                                    name="username"
                                    className="form-control"
                                    placeholder="Username"
                                    onChange={(e) => setUsername(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <input
                                    type="password"
                                    name="password"
                                    className="form-control"
                                    placeholder="Password"
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <input
                                    type="text"
                                    name="group_name"
                                    className="form-control"
                                    placeholder="Role (e.g., Admin, Doctor, Pharmacist)"
                                    onChange={(e) => setGroupName(e.target.value)}
                                    required
>>>>>>> 6b41202 (Initial commit)
                                />
                            </div>
                            <button type="submit" className="btn btn-success w-100">Signup</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};
<<<<<<< HEAD
  export default Signup;
=======

export default Signup;
>>>>>>> 6b41202 (Initial commit)
