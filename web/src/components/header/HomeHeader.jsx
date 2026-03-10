import React from "react";
import "../../css/HomeHeader.css";
import NexoLogo from "../../assets/Nexo-logo.png";

function HomeHeader() {
  return (
    <nav className="header">
    
        <div className="logo">
          <img src={NexoLogo} alt="Nexo Logo" />
        </div>
<div className="header-container">
        <nav className="nav">
          <a href="#home">HOME</a>
          <a href="#about">ABOUT</a>
          <a href="#features">FEATURES</a>
          <a href="#contact">CONTACT</a>
        </nav>
      </div>
    </nav>
  );
}

export default HomeHeader;