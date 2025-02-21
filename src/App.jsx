"use client";

import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom/client";
import "./styles.css";

function App() {
  const [jsonInput, setJsonInput] = useState(
    JSON.stringify({ data: ["A", "C", "z"] }, null, 2) // Default formatted JSON
  );
  const [parsedData, setParsedData] = useState(null);
  const [error, setError] = useState("");
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [apiResponse, setApiResponse] = useState(null);

  useEffect(() => {
    document.title = "22BCS15832"; // Replace with your roll number
  }, []);

  const validateAndSubmit = async () => {
    try {
      const parsed = JSON.parse(jsonInput);
      setParsedData(parsed);
      setError("");

      const response = await fetch(
        "https://bajaj-project-1-42dq.onrender.com/bfhl",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: jsonInput,
        }
      );

      const data = await response.json();

      if (!data || !data.is_success) {
        throw new Error(data.error || "API response failed");
      }

      setApiResponse(data);
    } catch (err) {
      setError("Invalid JSON format or API error");
      setApiResponse(null);
      setParsedData(null);
    }
  };

  const filterOptions = [
    { value: "alphabets", label: "Alphabets" },
    { value: "numbers", label: "Numbers" },
    { value: "highest_alphabet", label: "Highest Alphabet" }, // Fixed key
  ];

  const handleFilterChange = (value) => {
    setSelectedFilters((prev) =>
      prev.includes(value) ? prev.filter((f) => f !== value) : [...prev, value]
    );
  };

  const renderFilteredResponse = () => {
    if (!apiResponse) return null;

    return (
      <div className="filtered-response">
        <h3>Filtered Response</h3>
        {selectedFilters.includes("numbers") && apiResponse.numbers && (
          <div className="response-item">
            <span>Numbers:</span> {apiResponse.numbers.join(", ")}
          </div>
        )}
        {selectedFilters.includes("alphabets") && apiResponse.alphabets && (
          <div className="response-item">
            <span>Alphabets:</span> {apiResponse.alphabets.join(", ")}
          </div>
        )}
        {selectedFilters.includes("highest_alphabet") &&
          apiResponse.highest_alphabet && (
            <div className="response-item">
              <span>Highest Alphabet:</span> {apiResponse.highest_alphabet}
            </div>
          )}
      </div>
    );
  };

  return (
    <div className="container">
      <div className="input-section">
        <label>API Input</label>
        <textarea
          value={jsonInput}
          onChange={(e) => setJsonInput(e.target.value)}
          className={error ? "error" : ""}
        />
        {error && <div className="error-message">{error}</div>}
        <button onClick={validateAndSubmit}>Submit</button>
      </div>

      {parsedData && (
        <div className="filter-section">
          <div className="multi-filter">
            {filterOptions.map((option) => (
              <div
                key={option.value}
                className={`filter-chip ${
                  selectedFilters.includes(option.value) ? "selected" : ""
                }`}
                onClick={() => handleFilterChange(option.value)}
              >
                {option.label}
                {selectedFilters.includes(option.value) && (
                  <span className="remove-filter">×</span>
                )}
              </div>
            ))}
          </div>
          {renderFilteredResponse()}
        </div>
      )}
    </div>
  );
}

// Render the App
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

export default App;
