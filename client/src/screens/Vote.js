import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import io from "socket.io-client";
import "../ScreensStyle/VoteStyle.css";

const socket = io("http://localhost:3001");

const Vote = () => {
  const [pollData, setPollData] = useState(null);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [hasVoted, setHasVoted] = useState(false);
  const { pollCode } = useParams();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");

  useEffect(() => {
    const storedUsername = localStorage.getItem("votename");
    console.log(storedUsername);
    if (!storedUsername) {
      navigate(`/id-ask`);
    } else {
      setUsername(storedUsername); // Set username after navigation check
      fetchPollData();
    }
  }, [navigate, pollCode]);

  useEffect(() => {
    socket.on("pollData", (data) => {
      setPollData(data);
    });

    socket.on("voteError", (error) => {
      alert(error.error); // Display error on voting failure
    });

    // Cleanup listeners when the component unmounts
    return () => {
      socket.off("pollData");
      socket.off("voteError");
    };
  }, []);

  const fetchPollData = async () => {
    try {
      const response = await fetch(`http://localhost:3001/getPoll/${pollCode}`);
      const data = await response.json();
      setPollData(data);
    } catch (error) {
      console.error("Error fetching poll data:", error);
    }
  };

  const handleVote = () => {
    if (selectedChoice === null) return; // Ensure choice is selected

    const selectedChoiceId = pollData.choices[selectedChoice].choiceId;

    socket.emit("vote", pollCode, username, selectedChoiceId); // Send vote to server
    setHasVoted(true);

    // Save the voted users in localStorage
    localStorage.setItem(
      "votedUsers",
      JSON.stringify([
        ...(JSON.parse(localStorage.getItem("votedUsers")) || []),
        username,
      ])
    );

    localStorage.removeItem("votename"); // Clear votename after voting
    navigate("/");
    alert("Thank you for voting!");
  };

  if (!pollData || !pollData.choices) return <div className="loader"></div>;

  return (
    <div className="vote-container">
      <h1>{pollData.pollName}</h1>
      <p>{pollData.description}</p>

      <div className="vote-choices">
        {pollData.choices.map((choice, index) => (
          <div className="vote-option" key={index}>
            <input
              type="radio"
              id={`choice-${index}`}
              name="voteChoice"
              value={index}
              onChange={() => setSelectedChoice(index)}
            />
            <label htmlFor={`choice-${index}`}>{choice.choice}</label>
          </div>
        ))}
      </div>

      <button onClick={handleVote} disabled={hasVoted}>
        {hasVoted ? "Vote Submitted" : "Submit Vote"}
      </button>
    </div>
  );
};

export default Vote;
