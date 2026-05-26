import { useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  // tank inputs
  const [temp, setTemp] = useState("");
  const [ph, setPh] = useState("");
  const [tds, setTds] = useState("");
  const [fishList, setFishList] = useState([]);

  // fish search
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [selectedFish, setSelectedFish] = useState(null);

  // ---------------- TANK RECOMMEND ----------------
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

  // ---------------- LIVE SEARCH ----------------
  const searchFish = async (text) => {
    setQuery(text);

    if (!text) {
      setSuggestions([]);
      return;
    }

    try {
      const res = await axios.get("http://localhost:5000/fish/search", {
        params: { q: text }
      });

      setSuggestions(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  // ---------------- SELECT FISH ----------------
  const selectFish = async (name) => {
    try {
      const res = await axios.get(
        `http://localhost:5000/fish/${name}`
      );

      setSelectedFish(res.data);
      setSuggestions([]);
      setQuery(name);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="app-shell">
      {/* HEADER */}
      <div className="app-header">
        <h1>🐠 Tank Fish System</h1>
        <p className="subtitle">
          Search fish or find fish based on tank conditions
        </p>
      </div>

      {/* ================= FISH NAME SEARCH ================= */}
      <div style={{ position: "relative", marginBottom: "30px" }}>
        <input
          className="input-field"
          type="text"
          placeholder="Search fish by name..."
          value={query}
          onChange={(e) => searchFish(e.target.value)}
        />

        {/* suggestions dropdown */}
        {suggestions.length > 0 && (
          <div
            style={{
              position: "absolute",
              width: "100%",
              background: "rgba(0,0,0,0.8)",
              borderRadius: "10px",
              marginTop: "5px",
              zIndex: 10
            }}
          >
            {suggestions.map((fish) => (
              <div
                key={fish.id}
                onClick={() => selectFish(fish.name)}
                style={{
                  padding: "10px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px"
                }}
              >
                <img
                  src={fish.image_url}
                  style={{
                    width: "40px",
                    height: "40px",
                    objectFit: "cover",
                    borderRadius: "6px"
                  }}
                />
                {fish.name}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ================= SELECTED FISH ================= */}
      {selectedFish && (
        <div className="fish-card">
          <img className="fish-image" src={selectedFish.image_url} />
          <h2>{selectedFish.name}</h2>
          <p>{selectedFish.description}</p>

          <div className="fish-info">
            <p>🌡 {selectedFish.temp_min} - {selectedFish.temp_max}</p>
            <p>⚗️ {selectedFish.ph_min} - {selectedFish.ph_max}</p>
            <p>💧 {selectedFish.tds_min} - {selectedFish.tds_max}</p>
          </div>
        </div>
      )}

      {/* ================= TANK SEARCH ================= */}
      <form
        className="filters-grid"
        onSubmit={(e) => {
          e.preventDefault();
          findFish();
        }}
      >
        <input
          className="input-field"
          type="number"
          placeholder="Temperature"
          value={temp}
          onChange={(e) => setTemp(e.target.value)}
        />

        <input
          className="input-field"
          type="number"
          placeholder="pH"
          value={ph}
          onChange={(e) => setPh(e.target.value)}
        />

        <input
          className="input-field"
          type="number"
          placeholder="TDS"
          value={tds}
          onChange={(e) => setTds(e.target.value)}
        />

        <button type="submit" className="find-button">
          Find Fish
        </button>
      </form>

      <div className="separator" />

      {/* ================= RESULTS ================= */}
      {fishList.length === 0 ? (
        <p className="no-result">No fish found yet.</p>
      ) : (
        fishList.map((fish, index) => (
          <div key={index} className="fish-card">
            <img className="fish-image" src={fish.image_url} />

            <h2 className="fish-name">{fish.name}</h2>
            <p className="fish-description">{fish.description}</p>

            <div className="fish-info">
              <p>🌡 {fish.temp_min}°C - {fish.temp_max}°C</p>
              <p>⚗️ {fish.ph_min} - {fish.ph_max}</p>
              <p>💧 {fish.tds_min} - {fish.tds_max}</p>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default App;