import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";
import "../styles1.css";

const dummyData = [
  { date: "Day 1", healthScore: 50 },
  { date: "Day 5", healthScore: 60 },
  { date: "Day 10", healthScore: 75 },
  { date: "Day 15", healthScore: 80 },
  { date: "Day 20", healthScore: 90 },
];

export default function Dashboard() {
  // In a real app, fetch user progress data and update chart
  return (
    <div className="dashboard-container">
      <h2>Personal Health Dashboard</h2>
      <div className="dashboard-chart">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={dummyData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis domain={[0, 100]} />
            <Tooltip />
            <Line type="monotone" dataKey="healthScore" stroke="#82ca9d" />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <p>Track your Ayurveda health progress over time.</p>
    </div>
  );
}
