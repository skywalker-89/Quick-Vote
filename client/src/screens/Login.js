import React, { useState } from "react";
import axios from "axios";
import "../ScreensStyle/LoginStyle.css";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { email, password } = formData;

    if (!email || !password) {
      setError("Email and password are required");
      return;
    }

    setError("");

    try {
      const response = await axios.post(
        "http://localhost:9999/api/auth/login",
        formData
      );
      // Store username and token in localStorage after login
      localStorage.setItem("username", response.data.username);
      localStorage.setItem("token", response.data.token);

      navigate("/create-poll"); // Navigate to the create poll page
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="login-container">
      <h1 className="login-title">Login to Quick Poll</h1>
      <form className="login-form" onSubmit={handleSubmit}>
        {error && <p className="login-error">{error}</p>}

        <label htmlFor="email" className="login-label">
          Email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          className="login-input"
          value={formData.email}
          onChange={handleChange}
          placeholder="Enter your email"
        />

        <label htmlFor="password" className="login-label">
          Password
        </label>
        <input
          type="password"
          id="password"
          name="password"
          className="login-input"
          value={formData.password}
          onChange={handleChange}
          placeholder="Enter your password"
        />

        <button type="submit" className="login-button">
          Login
        </button>
      </form>

      <p className="login-footer">
        Don't have an account?{" "}
        <a href="/register" className="login-link">
          Sign up here
        </a>
        .
      </p>
    </div>
  );
};

export default Login;
