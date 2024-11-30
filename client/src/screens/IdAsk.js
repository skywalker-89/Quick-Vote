import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../ScreensStyle/IdAskStyle.css"; // Import CSS

const IdAsk = () => {
  const [pollCode, setPollCode] = useState("");
  const [password, setPassword] = useState("");
  const [passwordHint, setPasswordHint] = useState("");
  const [isPasswordRequired, setIsPasswordRequired] = useState(false);
  const [isPasswordCorrect, setIsPasswordCorrect] = useState(true);
  const [username, setUsername] = useState("");
  const [isUsernameValid, setIsUsernameValid] = useState(true);
  const [pollData, setPollData] = useState(null);

  const navigate = useNavigate();

  // Simulating fetching poll data from the backend
  const fetchPollData = async () => {
    try {
      const response = await fetch(`http://localhost:3001/getPoll/${pollCode}`);
      const data = await response.json();
      setPollData(data);
      //   console.log(data.poll_password);
      if (data.poll_password) {
        setPasswordHint(data.password_hint);
        setIsPasswordRequired(true); // Password is required
      } else {
        setIsPasswordRequired(false); // No password required
      }
    } catch (error) {
      console.error("Error fetching poll data:", error);
    }
  };

  useEffect(() => {
    if (pollCode) {
      fetchPollData(); // Fetch poll details when pollCode is available
    }
  }, [pollCode]);

  const handlePollIdSubmit = (e) => {
    e.preventDefault();

    // Validate username
    if (!username.trim()) {
      setIsUsernameValid(false);
      return;
    }

    // Check password if required
    if (isPasswordRequired && password !== pollData.poll_password) {
      setIsPasswordCorrect(false);
      return;
    }

    // If no errors, store the username and navigate to the vote page
    localStorage.setItem("votename", username);
    navigate(`/vote/${pollCode}`);
  };

  return (
    <div className="id-ask-container">
      <h1 className="id-ask-title">Enter Poll ID</h1>

      <form onSubmit={handlePollIdSubmit}>
        {/* Poll ID Input */}
        <div className="poll-id-field">
          <label>Poll ID:</label>
          <input
            type="text"
            value={pollCode}
            onChange={(e) => setPollCode(e.target.value)}
            placeholder="Enter Poll ID"
            required
          />
        </div>

        {/* Username Input */}
        <div className="username-field">
          <label>Enter a Username for Voting:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
              setIsUsernameValid(true); // Reset validation state
            }}
            placeholder="Enter Your Username"
            required
          />
          {!isUsernameValid && (
            <p className="error-message">Please enter a valid username.</p>
          )}
        </div>

        {/* Password Input (if required) */}
        {isPasswordRequired && (
          <div className="password-field">
            <label>Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter Poll Password"
              required
            />
            {passwordHint && (
              <p className="password-hint">Hint: {passwordHint}</p>
            )}
            {!isPasswordCorrect && (
              <p className="error-message">
                Incorrect password. Please try again.
              </p>
            )}
          </div>
        )}

        <button type="submit" className="submit-button">
          Submit
        </button>
      </form>
    </div>
  );
};

export default IdAsk;
