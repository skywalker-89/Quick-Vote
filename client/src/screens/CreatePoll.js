import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../ScreensStyle/CreatePollStyle.css";

const CreatePoll = () => {
  const [pollName, setPollName] = useState("");
  const [choices, setChoices] = useState([{ choice: "" }]);
  const [pollTimeout, setPollTimeout] = useState("none");
  const [specificTimeout, setSpecificTimeout] = useState(1); // Default specific time
  const [pollPassword, setPollPassword] = useState("");
  const [passwordHint, setPasswordHint] = useState("");
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) {
      setUsername(storedUsername);
    } else {
      navigate("/login");
    }
  }, [navigate]);

  const handleChoiceChange = (index, event) => {
    const newChoices = [...choices];
    newChoices[index].choice = event.target.value;
    setChoices(newChoices);
  };

  const addChoice = () => {
    setChoices([...choices, { choice: "" }]);
  };

  const deleteChoice = (index) => {
    const newChoices = [...choices];
    newChoices.splice(index, 1);
    setChoices(newChoices);
  };
  const generatePollCode = () => {
    return Math.floor(100000 + Math.random() * 900000); // Generates a 6-digit random number
  };

  const handleSubmitPoll = async (e) => {
    e.preventDefault();

    const pollCode = generatePollCode(); // Generate a 6-digit poll code
    // alert(pollCode);

    const pollData = {
      pollName,
      choices: choices.map((choice) => choice.choice),
      pollTimeout:
        pollTimeout === "none"
          ? null
          : pollTimeout === "specific"
          ? specificTimeout
          : pollTimeout, // Handle timeout as null or specific
      pollPassword,
      passwordHint,
      pollCode, // Include the generated poll code
    };

    try {
      const response = await axios.post(
        "http://localhost:3001/createPoll",
        pollData
      );
      // const generatedPollCode = pollData.pollCode; // Assuming the backend returns the poll_code
      console.log(pollData);
      console.log(pollCode);
      await navigate(`/dashboard/${pollCode}`);
    } catch (error) {
      console.error("Error creating poll:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("username");
    navigate("/login");
  };

  return (
    <div className="dashboard-container">
      <h1>Create Poll</h1>
      {username && (
        <div className="username-greeting-container">
          <p className="username-greeting">Welcome, {username}!</p>
          <button className="logout-button" onClick={handleLogout}>
            Logout
          </button>
        </div>
      )}
      <form onSubmit={handleSubmitPoll} className="poll-creation-form">
        <div className="poll-field">
          <label>Poll Name</label>
          <input
            type="text"
            value={pollName}
            onChange={(e) => setPollName(e.target.value)}
            required
          />
        </div>

        <div className="poll-field">
          <label>Choices</label>
          {choices.map((choice, index) => (
            <div key={index} className="poll-choice">
              <input
                type="text"
                value={choice.choice}
                onChange={(e) => handleChoiceChange(index, e)}
                required
              />
              <button
                type="button"
                onClick={() => deleteChoice(index)}
                className="delete-choice-btn"
              >
                Delete
              </button>
            </div>
          ))}
          <button type="button" onClick={addChoice} className="add-choice-btn">
            Add Choice
          </button>
        </div>

        {/* <div className="poll-field">
          <label>Poll Timeout</label>
          <select
            value={pollTimeout}
            onChange={(e) => setPollTimeout(e.target.value)}
          >
            <option value="none">None</option>
            <option value="specific">Specific Time</option>
          </select>
        </div> */}

        {pollTimeout === "specific" && (
          <div className="poll-field">
            <label>Specific Timeout (in minutes, max 30 minutes)</label>
            <input
              type="number"
              value={specificTimeout}
              onChange={(e) => {
                const value = Math.min(Math.max(e.target.value, 1), 30); // Limit to between 1 and 30
                setSpecificTimeout(value);
              }}
              max="30"
              min="1"
              required
            />
          </div>
        )}

        <div className="poll-field">
          <label>Poll Password</label>
          <input
            type="password"
            value={pollPassword}
            onChange={(e) => setPollPassword(e.target.value)}
          />
          {pollPassword && (
            <div>
              <label>Password Hint</label>
              <input
                type="text"
                value={passwordHint}
                onChange={(e) => setPasswordHint(e.target.value)}
              />
            </div>
          )}
        </div>

        <button type="submit" className="submit-btn">
          Create Poll
        </button>
      </form>
    </div>
  );
};

export default CreatePoll;
