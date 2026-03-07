import React from "react";
import "./background.css";
import bg from "../assets/back.svg";

const Background = () => {
  return (
    <div className="left-container">

      <img src={bg} className="bg-image" />

      <div className="overlay">

        <div className="brand">
          <div className="logo"></div>
          <span>EventSphere</span>
        </div>

        <div className="hero">
          <h1>Master Your Next Tech Gathering</h1>

          <p>
            The all-in-one platform for developers and organizers to create
            world-class technical conferences and hackathons.
          </p>
        </div>

        <div className="users">
          <div className="avatars">
            <img src="https://i.pravatar.cc/40?img=1"/>
            <img src="https://i.pravatar.cc/40?img=2"/>
            <img src="https://i.pravatar.cc/40?img=3"/>
          </div>

          <p>Joined by 10k+ organizers worldwide</p>
        </div>

      </div>

    </div>
  );
};

export default Background;