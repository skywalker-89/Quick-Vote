# Quick Poll

Quick Poll is a web-based Poll App that allows users to vote on different polls, manage polls, and view results. The app is designed with a front-end, back-end, and socket integration to support real-time interactions and dynamic updates.

## Features

- **Poll Creation**: Users can create new polls with various choices.
- **Voting System**: Users can vote on available choices within each poll.
- **Real-Time Updates**: Poll results are updated in real-time using WebSockets.
- **Poll Results**: Users can view the current results of each poll.
- **7-Day Weather Forecast**: View the weather conditions and forecasts in the related feature (weather integration).

## Tech Stack

- **Frontend**: React (for building the user interface)
- **Backend**: Node.js Express a server-side API to manage poll data
- **Database**: PostgreSQL (or your preferred SQL database)
- **Real-time communication**: WebSockets for real-time updates

## Project Structure

- `client/`: Contains the frontend application code, built with React.
- `server/`: Backend code to handle poll data and business logic.
- `socket/`: Backend code for real-time updates using WebSockets.

## Database Schema

### Tables:

- `polls`:
  - `poll_code`: Unique identifier for each poll
  - `question`: The question being asked in the poll

- `choices`:
  - `choice_id`: Unique identifier for each choice
  - `choice_text`: Text of the choice
  - `poll_code`: Foreign key referencing `polls.poll_code`

## Setup

### 1. Clone the Repository

git clone https://github.com/skywalker-89/Quick-Vote.git

### 2. Install Dependencies
cd server
npm install
cd client
npm install
cd socket npm install

### 3. Set Up the Database
Ensure PostgreSQL is installed.
Create a new database for the project and run the SQL scripts to set up the tables.
Update the server code with the correct database connection credentials.

### 4. Run the Application
cd client
npm start
cd server
nodemon serer.js
cd socket 
nodemon server.js


