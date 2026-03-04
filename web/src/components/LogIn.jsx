
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../css/SignUpPage.css";
import NexoLogo from "../assets/NEXO.png";

const LogIn = () => {
  return (
    <div className="signup-layout">
      
      {/* LEFT SIDE */}
      <div className="left-side">
        <div className="overlay"></div>
        <div className="hero-text">
          <h1>
            Ready for  <br />
            Your Next  <br />
            Experience?
          </h1>
          <p>
            Log in and stay connected to the events you love.
          </p>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="right-side">
        <div className="form-wrapper">
          
          <div className="logo">
            <img src={NexoLogo} alt="Nexo Logo" />
          </div>

          <h2>Welcome Back</h2>
          <p className="subtitle">
            Sign in to access your tickets and saved events.
          </p>

          <form>
            <label>Email</label>
            <input type="email" placeholder="Email Address" />

            <label>Password</label>
            <input type="password" placeholder="Password" />

            <button type="submit">Log In</button>
          </form>

          <p className="login-text">
            Don’t have an account?  <Link to="/">Join the Nexus</Link>
          </p>

        </div>
      </div>
    </div>
  );
};

export default LogIn; 