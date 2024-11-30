import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../componentsStyle/CircularDropdownStyle.css";

const CircularDropdown = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is authenticated by checking localStorage
    const username = localStorage.getItem("username");
    if (username) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem("username");
    setIsAuthenticated(false);
    navigate("/login");
  };

  const handleCreatePoll = () => {
    navigate("/create-poll");
  };

  const handleLogin = () => {
    navigate("/login");
  };

  const handleRegister = () => {
    navigate("/register");
  };

  return (
    <div className="circular-dropdown-container">
      <button className="circular-btn" onClick={toggleDropdown}>
        <span className="circle-icon">+</span>
      </button>
      {isOpen && (
        <div className="dropdown-options">
          {isAuthenticated ? (
            <>
              <button className="dropdown-item" onClick={handleCreatePoll}>
                Create Poll
              </button>
              <button className="dropdown-item" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <button className="dropdown-item" onClick={handleLogin}>
                Login
              </button>
              <button className="dropdown-item" onClick={handleRegister}>
                Register
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default CircularDropdown;
