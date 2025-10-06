import { BrowserRouter as Router, Routes, Route, NavLink } from "react-router-dom";
import "./styles1.css";
import "./fullscreen.css";
import Chatbot from "./Components/Chatbot";
import HerbList from "./components/HerbList1";
import Dashboard from "./components/Dashboard";
import Quiz from "./Components/Quiz";

export default function App() {
  return (
    <Router>
      <div className="fullscreen-app">
        <div className="app-header">
          <h1>🌿 AyurBot - Ayurvedic Health Assistant</h1>
          <nav className="top-nav">
            <NavLink to="/" className={({ isActive }) => isActive ? 'active' : ''} end>
              💬 Chat
            </NavLink>
            <NavLink to="/herbs" className={({ isActive }) => isActive ? 'active' : ''}>
              🌱 Herbs
            </NavLink>
            <NavLink to="/dashboard" className={({ isActive }) => isActive ? 'active' : ''}>
              📊 Dashboard
            </NavLink>
            <NavLink to="/quiz" className={({ isActive }) => isActive ? 'active' : ''}>
              🧠 Quiz
            </NavLink>
          </nav>
        </div>
        
        <div className="app-content">
          <Routes>
            <Route path="/" element={<Chatbot />} />
            <Route path="/herbs" element={<HerbList />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/quiz" element={<Quiz />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}
