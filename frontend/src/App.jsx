import { useState } from "react";
import axios from "axios";

function App() {
  const [temp, setTemp] = useState("");
  const [ph, setPh] = useState("");
  const [tds, setTds] = useState("");
  const [fishList, setFishList] = useState([]);

  const findFish = async () => {
    try {
      const res = await axios.get("http://localhost:5000/recommend", {
        params: { temp, ph, tds }
      });
      setFishList(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Tank Fish Recommendation</h2>

      <input
        placeholder="Temperature"
        onChange={(e) => setTemp(e.target.value)}
      />
      <br />

      <input
        placeholder="pH"
        onChange={(e) => setPh(e.target.value)}
      />
      <br />

      <input
        placeholder="TDS"
        onChange={(e) => setTds(e.target.value)}
      />
      <br />

      <button onClick={findFish}>Find Fish</button>

      <hr />

      {fishList.map((fish, index) => (
        <div
          key={index}
          style={{
            border: "1px solid #ddd",
            borderRadius: "10px",
            padding: "15px",
            marginBottom: "15px",
            boxShadow: "0 2px 6px rgba(0,0,0,0.1)"
          }}
        >
          <h3 style={{ marginBottom: "5px" }}>{fish.name}</h3>

          <p>{fish.description}</p>

          <div style={{ marginTop: "10px" }}>
            <p>🌡 Temp: {fish.temp_min} - {fish.temp_max}</p>
            <p>⚗️ pH: {fish.ph_min} - {fish.ph_max}</p>
            <p>💧 TDS: {fish.tds_min} - {fish.tds_max}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default App;