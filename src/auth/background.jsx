import React from "react";
import "./background.css";
import bg from "../assets/back.svg";
import eventSphere from "../assets/eventSphere.svg";
import logo from "../assets/logo.svg";

const Background = () => {
  return (
    <div className="left-container">

      <img src={bg} className="bg-image" />

      <div className="overlay">

        <div className="brand">
          <img src={logo} className="logo-image"/>
          <img src={eventSphere} className="eventSphere-image"/>
        </div>

        <div className="hero">
          <h1>“Discover and Host the Future of Tech Events.”</h1>

          <p>
            Join hackathons, workshops, and competitions. Connect with innovators and build something amazing.
          </p>
        </div>
      </div>

    </div>
  );
};

export default Background;