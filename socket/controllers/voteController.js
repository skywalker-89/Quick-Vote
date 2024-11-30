const pool = require("../config/db");

// Handle vote (adjusted for Socket.IO)
const handleVote = async (io, socket, pollCode, username, choiceId) => {
  console.log("Voting with choiceId:", choiceId); // Debug log to check if choiceId is correct
  try {
    // Check if the user has already voted
    const checkVote = await pool.query(
      "SELECT * FROM votes WHERE poll_code = $1 AND username = $2",
      [pollCode, username]
    );

    if (checkVote.rows.length > 0) {
      console.log("User has already voted"); // Debug log
      socket.emit("voteError", { error: "User has already voted" });
      return;
    }

    // Insert the vote into the votes table (only storing username and choice_id)
    await pool.query(
      "INSERT INTO votes (poll_code, username, choice_id) VALUES ($1, $2, $3)",
      [pollCode, username, choiceId]
    );

    console.log("Vote registered for choiceId:", choiceId); // Debug log

    // Increment the vote count for the selected choice in the choices table
    const updateVoteQuery =
      "UPDATE choices SET votes = votes + 1 WHERE id = $1";
    console.log("Running query to update vote count for choiceId:", choiceId); // Debug log
    const updateResult = await pool.query(updateVoteQuery, [choiceId]);

    // Check if the vote count was updated successfully
    if (updateResult.rowCount === 0) {
      console.log("No rows updated for choiceId:", choiceId); // Debug log
      socket.emit("voteError", { error: "Error updating vote count" });
      return;
    }

    // Fetch the updated poll data and choices
    const updatedPollData = await pool.query(
      "SELECT poll_code, poll_name FROM polls WHERE poll_code = $1",
      [pollCode]
    );

    // If the poll doesn't exist, return an error
    if (updatedPollData.rows.length === 0) {
      console.log("Poll not found"); // Debug log
      socket.emit("voteError", { error: "Poll not found" });
      return;
    }

    // Fetch choices related to the poll, including updated vote counts
    const updatedChoices = await pool.query(
      "SELECT id, choice, votes FROM choices WHERE poll_code = $1",
      [pollCode]
    );

    // Ensure that choices are fetched and attached to poll data
    const pollWithChoices = updatedPollData.rows[0];
    pollWithChoices.choices = updatedChoices.rows;

    // Emit updated poll data (with updated vote counts) to all clients
    io.emit("pollData", pollWithChoices);

    return pollWithChoices; // Return updated poll data
  } catch (err) {
    console.error("Error occurred while processing vote:", err); // Debug log for errors
    socket.emit("voteError", { error: "Error registering vote" });
    throw err; // Throw error to be caught in the socket event handler
  }
};

module.exports = {
  handleVote,
};
