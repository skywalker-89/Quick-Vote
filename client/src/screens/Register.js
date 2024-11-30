import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Import the useNavigate hook
import "../ScreensStyle/RegisterStyle.css";

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate(); // Initialize navigate

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validatePassword = (password) => {
    const regex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#$!._])[A-Za-z\d#$!._]{8,16}$/;
    return regex.test(password);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { username, email, password, confirmPassword } = formData;

    if (!username || !email || !password || !confirmPassword) {
      setError("All fields are required.");
      return;
    }

    if (!validatePassword(password)) {
      setError(
        "Password must be 8-16 characters long, include at least one uppercase letter, one lowercase letter, one number, and one special character (#$!._)."
      );
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setError("");

    try {
      const response = await axios.post(
        "http://localhost:9999/api/auth/register",
        formData
      );
      console.log(response.data); // Handle token storage or redirection
      // Redirect to the login page after successful registration
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="register-container">
      <h1 className="register-title">Register</h1>
      <form className="register-form" onSubmit={handleSubmit}>
        {error && <p className="register-error">{error}</p>}

        <label htmlFor="username" className="register-label">
          Username
        </label>
        <input
          type="text"
          id="username"
          name="username"
          className="register-input"
          value={formData.username}
          onChange={handleChange}
          placeholder="Enter your username"
        />

        <label htmlFor="email" className="register-label">
          Email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          className="register-input"
          value={formData.email}
          onChange={handleChange}
          placeholder="Enter your email"
        />

        <label htmlFor="password" className="register-label">
          Password
        </label>
        <input
          type="password"
          id="password"
          name="password"
          className="register-input"
          value={formData.password}
          onChange={handleChange}
          placeholder="Enter your password"
        />

        <label htmlFor="confirmPassword" className="register-label">
          Confirm Password
        </label>
        <input
          type="password"
          id="confirmPassword"
          name="confirmPassword"
          className="register-input"
          value={formData.confirmPassword}
          onChange={handleChange}
          placeholder="Confirm your password"
        />

        <button type="submit" className="register-button">
          Register
        </button>
      </form>
      <p className="login-footer">
        Already have an account?{" "}
        <a href="/login" className="register-link">
          Login here
        </a>
        .
      </p>
    </div>
  );
};

export default Register;
