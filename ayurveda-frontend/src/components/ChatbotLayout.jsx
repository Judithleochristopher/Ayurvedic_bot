import { NavLink } from "react-router-dom";
import { FaLeaf, FaChartBar, FaQuestionCircle, FaRobot } from "react-icons/fa"; // Example icons

export default function ChatbotLayout({ children }) {
  return (
    <div className="ayurchat-bg">
      <div className="ayurchat-card">
        <div className="ayurchat-header">
          <FaRobot style={{ fontSize: 40, color: "#3d8767", marginRight: 10 }} />
          <h2>Ayur Bot</h2>
        </div>
        <div className="ayurchat-main">{children}</div>
        <div className="ayurchat-input-row">
          {/* Your input and send button here */}
        </div>
        <div className="ayurchat-bottom-nav">
          <NavLink to="/herbs" className="nav-btn" title="Herbs Library">
            <FaLeaf />
          </NavLink>
          <NavLink to="/dashboard" className="nav-btn" title="Health Dashboard">
            <FaChartBar />
          </NavLink>
          <NavLink to="/quiz" className="nav-btn" title="Quiz">
            <FaQuestionCircle />
          </NavLink>
        </div>
      </div>
    </div>
  );
}
