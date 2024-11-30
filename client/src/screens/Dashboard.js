import React, { useState, useEffect } from "react";
import io from "socket.io-client"; // Import socket.io-client
import Chart from "react-apexcharts"; // Chart.js library for rendering the bar chart
import "../ScreensStyle/DashboardStyle.css"; // Import CSS styles
import { useParams, useNavigate } from "react-router-dom"; // Use useParams
import axios from "axios"; // For fetching the poll data from the backend

// Connect to the backend server via Socket.IO
const socket = io("http://localhost:3001");

const Dashboard = () => {
  const { pollCode } = useParams(); // Get the pollId from the URL
  const [pollData, setPollData] = useState(null);
  const [pollResults, setPollResults] = useState([]);
  const [username, setUsername] = useState("");
  const [isPollEnded, setIsPollEnded] = useState(false);
  const navigate = useNavigate();

  useEffect(
    () => {
      const storedUsername = localStorage.getItem("username");
      if (storedUsername) {
        setUsername(storedUsername);
      } else {
        navigate("/login");
      }

      console.log("pollCode:", pollCode); // Log the pollCode to debug

      if (!pollCode) {
        console.error("Poll code is undefined");
        window.location.href = "/"; // Redirect to homepage or another page if pollCode is missing
        return;
      }

      const fetchPollData = async () => {
        try {
          const response = await axios.get(
            `http://localhost:3001/getPoll/${pollCode}`
          );
          console.log(response.data);
          setPollData(response.data);
          setPollResults(response.data.choices || []); // Ensure pollResults is always an array
        } catch (error) {
          console.error("Error fetching poll data:", error);
        }
      };

      fetchPollData();

      socket.on("pollData", (polls) => {
        const currentPollData = polls[pollCode];
        if (currentPollData) {
          setPollData(currentPollData);
          setPollResults(currentPollData.choices || []); // Ensure pollResults is always an array
        }
      });

      return () => {
        socket.off("pollData");
      };
    },
    [pollCode],
    [navigate]
  );

  const chartOptions = {
    chart: {
      type: "bar", // Using a bar chart to show votes
    },
    xaxis: {
      categories:
        pollResults && pollResults.length > 0
          ? pollResults.map((choice) => choice.choice)
          : [], // Check pollResults before using map
    },
    yaxis: {
      title: {
        text: "Votes",
      },
    },
  };

  const chartSeries = [
    {
      name: "Votes",
      data:
        pollResults && pollResults.length > 0
          ? pollResults.map((choice) => choice.votes)
          : [], // Check pollResults before using map
    },
  ];

  // const handleVote = (choiceIndex) => {
  //   // Send vote to the backend via Socket.IO
  //   socket.emit("vote", pollCode, choiceIndex);
  // };

  const handleEndPoll = () => {
    const shouldDownloadCSV = window.confirm(
      "Do you want to download the poll results as a CSV?"
    );

    if (shouldDownloadCSV) {
      downloadCSV(pollResults, pollData.poll_name);
    }

    setIsPollEnded(true); // Mark the poll as ended
  };

  const downloadCSV = (data, poll_name) => {
    // Clean up the poll name to make it a valid file name
    const cleanedPollName = poll_name
      .replace(/[\/:*?"<>|]/g, "_")
      .replace(/\s+/g, "_");

    const csvContent =
      "data:text/csv;charset=utf-8," +
      "Choice, Votes\n" +
      data.map((row) => `${row.choice}, ${row.votes}`).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${cleanedPollName}_results.csv`); // Use the cleaned poll name
    link.click();
  };

  const handleLogout = () => {
    localStorage.removeItem("username");
    window.location.href = "/login"; // Redirect to login page
  };

  if (!pollData) return <div>Loading...</div>; // Show loading until poll data is fetched

  return (
    <div className="dashboard-container">
      <div className="header-container">
        <h1 className="dashboard-title">{pollData.poll_name}</h1>
        <p className="poll-id">Poll ID: {pollData.poll_code}</p>
        <div className="username-logout">
          <p className="username-greeting">Hi, {username}!</p>
          <button className="logout-button" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>

      <div className="poll-content">
        <h2>Live Poll Results</h2>

        {/* Bar Chart for live voting results */}
        <div className="chart-container">
          <Chart
            options={chartOptions}
            series={chartSeries}
            type="bar"
            width="100%"
            height={350}
          />
        </div>

        {/* Vote Buttons */}
        {/* {!isPollEnded && (
          <div className="vote-buttons">
            {pollResults.map((choice, index) => (
              <button key={index} onClick={() => handleVote(index)}>
                Vote for {choice.choice}
              </button>
            ))}
          </div>
        )} */}

        {/* End Poll Button */}
        {!isPollEnded && (
          <button className="end-poll-button" onClick={handleEndPoll}>
            End Poll
          </button>
        )}

        {/* If poll is ended */}
        {isPollEnded && <p>The poll has ended.</p>}
      </div>
    </div>
  );
};

export default Dashboard;
