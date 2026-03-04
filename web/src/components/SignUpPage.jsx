import React from "react";
import "../css/SignUpPage.css";
import NexoLogo from "../assets/NEXO.png";
import { Link } from "react-router-dom";
const SignUpPage = () => {
  return (
    <div className="signup-layout">
      
      {/* LEFT SIDE */}
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

      {/* RIGHT SIDE */}
      <div className="right-side">
        <div className="form-wrapper">
          
          <div className="logo">
                      <img src={NexoLogo} alt="Nexo Logo" />
          </div>

          <h2>Join the Nexus</h2>
          <p className="subtitle">
            Sign up to discover and register for events near you.
          </p>

          <form>
            <label>Email</label>
            <input type="email" placeholder="Email Address" />

            <label>Username</label>
            <input type="text" placeholder="Username" />

            <label>Password</label>
            <input type="password" placeholder="Password" />

            <label>Confirm Password</label>
            <input type="password" placeholder="Confirm Password" />

            <button type="submit">Sign up</button>
          </form>

          <p className="login-text">
            Already have an account?  <Link to="/login">Log In</Link>
          </p>

        </div>
      </div>
    </div>
  );
};

export default SignUpPage;