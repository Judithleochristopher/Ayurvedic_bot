import { useEffect, useState } from "react";
import { fetchHerbs } from "../api";
import "../styles1.css";

export default function HerbList() {
  const [herbs, setHerbs] = useState([]);

  useEffect(() => {
    async function loadHerbs() {
      const data = await fetchHerbs();
      setHerbs(data);
    }
    loadHerbs();
  }, []);

  return (
    <div className="herb-list-container">
      <h2>Ayurvedic Herbs Library</h2>
      {herbs.length === 0 && <p>Loading...</p>}
      <ul style={{ listStyle: "none", paddingLeft: 0 }}>
        {herbs.map((herb) => (
          <li key={herb.id} className="herb-item">
            <div className="herb-name">{herb.name}</div>
            <div className="herb-properties"><strong>Properties:</strong> {herb.properties}</div>
            <div className="herb-usage"><strong>Usage:</strong> {herb.usage}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}
