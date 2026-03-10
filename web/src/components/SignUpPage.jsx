import React, { useState } from "react";
import "../css/SignUpPage.css";
import NexoLogo from "../assets/NEXO.png";
import { Link,useNavigate  } from "react-router-dom";


const SignUpPage = () => {

  const navigate = useNavigate();
  
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:8080/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email,
          username,
          password,
          confirmPassword
        })
      });

      const data = await response.text();
      alert(data);

       // ✅ redirect to login and pass values
    if (data === "User registered successfully!") {
      navigate("/login", {
        state: { email: email, password: password }
      });
    }

    } catch (error) {
      console.error("Error:", error);
      alert("Something went wrong");
    }
  };

  return (
    <div className="signup-layout">

      <div className="left-side">
        <div className="overlay"></div>
        <div className="hero-text">
          <h1>
            Be Part Of <br />
            What’s <br />
            Happening
          </h1>
          <p>
            Create your Nexus account
            and never miss an event that
            matters to you.
          </p>
        </div>
      </div>

      <div className="right-side">
        <div className="form-wrapper">

          <div className="logo">
            <img src={NexoLogo} alt="Nexo Logo" />
          </div>

          <h2>Join the Nexus</h2>
          <p className="subtitle">
            Sign up to discover and register for events near you.
          </p>

          {/* 🔥 IMPORTANT CHANGE HERE */}
          <form onSubmit={handleSubmit}>

            <label>Email</label>
            <input
              type="email"
              placeholder="Email Address"
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <label>Username</label>
            <input
              type="text"
              placeholder="Username"
              onChange={(e) => setUsername(e.target.value)}
              required
            />

            <label>Password</label>
            <input
              type="password"
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <label>Confirm Password</label>
            <input
              type="password"
              placeholder="Confirm Password"
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />

            <button type="submit">Sign up</button>
          </form>

          <p className="login-text">
            Already have an account? <Link to="/login">Log In</Link>
          </p>

        </div>
      </div>
    </div>
  );
};

export default SignUpPage;