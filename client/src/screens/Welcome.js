import React, { useState, useEffect } from "react";
import "../ScreensStyle/WelcomeStyle.css"; // Import CSS styles
import { useNavigate } from "react-router-dom";
import CircularDropdown from "../components/CircularDropdown";

const Welcome = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  // Check if the user is authenticated when the component mounts
  useEffect(() => {
    const username = localStorage.getItem("username");
    if (username) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  const handleCreatePollClick = () => {
    if (isAuthenticated) {
      // If authenticated, go to create-poll page
      navigate("/create-poll");
    } else {
      // If not authenticated, redirect to login page
      navigate("/login");
    }
  };

  return (
    <div className="welcome-container">
      <h1 className="welcome-title">Welcome to Quick Poll</h1>
      <p className="welcome-subtitle">What would you like to do?</p>

      <div className="welcome-buttons">
        {/* Update the button's onClick to check authentication */}
        <button
          className="welcome-button create-button"
          onClick={handleCreatePollClick}
        >
          Create a Poll
        </button>
        <button
          className="welcome-button vote-button"
          onClick={() => navigate("/id-ask")}
        >
          Vote
        </button>
      </div>

      {/* Include the CircularDropdown here */}
      <CircularDropdown />
    </div>
  );
};

export default Welcome;
