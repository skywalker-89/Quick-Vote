import "./App.css";
import CreatePoll from "./screens/CreatePoll";
import Welcome from "./screens/Welcome";
import { Routes, Route } from "react-router-dom";
import Login from "./screens/Login";
import Register from "./screens/Register";
import Dashboard from "./screens/Dashboard";
import IdAsk from "./screens/IdAsk";
import Vote from "./screens/Vote";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Welcome />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/create-poll" element={<CreatePoll />} />
      <Route path="/dashboard/:pollCode" element={<Dashboard />} />
      <Route path="/id-ask" element={<IdAsk />} />
      <Route path="/vote/:pollCode" element={<Vote />} />
    </Routes>
  );
}

export default App;
