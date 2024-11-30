const pool = require("../config/db");

const createPoll = async (req, res) => {
  const {
    pollName,
    choices,
    pollTimeout,
    pollPassword,
    passwordHint,
    pollCode,
  } = req.body; // Ensure you're passing pollCode from frontend

  console.log("Received Poll Data:", req.body); // Log data for debugging

  try {
    // Handle pollTimeout (null for 'none', or an integer for specific time)
    const timeout = pollTimeout === "none" ? null : pollTimeout;

    // Insert poll into the polls table
    const pollQuery = `
      INSERT INTO polls (poll_name, poll_password, password_hint, poll_timeout, poll_code)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id;
    `;
    const pollValues = [
      pollName,
      pollPassword,
      passwordHint,
      timeout,
      pollCode,
    ]; // Pass pollCode
    const pollResult = await pool.query(pollQuery, pollValues);

    // Get the poll's ID (optional if you need it for anything)
    const pollId = pollResult.rows[0].id;

    // Validate that choices array is not empty and contains valid text
    if (
      !choices ||
      choices.length === 0 ||
      choices.some((choice) => !choice.trim())
    ) {
      return res
        .status(400)
        .json({ error: "Poll must have at least one valid choice" });
    }

    // Insert choices into the choices table
    const choiceQuery = `
      INSERT INTO choices (poll_code, choice)
      VALUES ($1, $2)
      RETURNING id;
    `;

    // Map over the choices and insert each one individually
    const choicePromises = choices.map(
      (choice) => pool.query(choiceQuery, [pollCode, choice]) // Directly insert the choice string
    );
    await Promise.all(choicePromises);

    // Fetch the choices to return in the response
    const result = await pool.query(
      "SELECT choice FROM choices WHERE poll_code = $1",
      [pollCode]
    );

    const createdChoices = result.rows;

    res.status(200).json({
      message: "Poll created successfully!",
      pollCode,
      pollName,
      choices: createdChoices, // Return the choices
    });
  } catch (error) {
    console.error("Error creating poll:", error);
    res.status(500).json({ error: "Failed to create poll" });
  }
};

const getPollData = async (req, res) => {
  const { pollCode } = req.params;

  try {
    // Query for poll data and associated choices, including the choice ID
    const pollResult = await pool.query(
      `SELECT p.*, c.id AS choice_id, c.choice, c.votes
       FROM polls p
       LEFT JOIN choices c ON p.poll_code = c.poll_code
       WHERE p.poll_code = $1`,
      [pollCode]
    );

    if (pollResult.rows.length === 0) {
      return res.status(404).json({ error: "Poll not found" });
    }

    // Group choices by poll code and format them
    const pollData = {
      ...pollResult.rows[0], // Include poll data
      choices: pollResult.rows.map((row) => ({
        choiceId: row.choice_id, // Add the choiceId (i.e., `id` from `choices`)
        choice: row.choice,
        votes: row.votes,
      })),
    };

    res.status(200).json(pollData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error fetching poll data" });
  }
};
module.exports = {
  createPoll,
  getPollData,
};
