import React, { useEffect, useState } from "react";
import dayjs from 'dayjs'
const backgroundColors = [
  "#4CAF50", "#2196F3", "#FF9800", "#9C27B0",
  "#F44336", "#00BCD4", "#3F51B5", "#795548"
];

const CategoryCount = () => {
  const [countsName, setCountsName] = useState({});
  const [countsType, setCountsType] = useState({});
  const [records, setRecords] = useState([]);  // <-- holds full data list
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState(null);
  const [selectedName, setSelectedName] = useState(null);
  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    fetch("http://192.168.56.1:8080/api/v1/user/report")
      .then(res => res.json())
      .then(json => {
        const fetchedRecords = Array.isArray(json) ? json : json.data;  // rename local var
        setRecords(fetchedRecords);  // <-- Save full data in state here

        const countByName = {};
        fetchedRecords.forEach(item => {
          const key = item.projectName || "Unknown";
          countByName[key] = (countByName[key] || 0) + 1;
        });

        setCountsName(countByName);
        setLoading(false);

        const countByType = {};
        fetchedRecords.forEach(itemtype => {
          const key = itemtype.projectType || "Unknown";
          countByType[key] = (countByType[key] || 0) + 1;
        });

        setCountsType(countByType);
        setLoading(false);
      })
      .catch(err => {
        console.error("Fetch error:", err);
        setLoading(false);
      });
      
  }, []);

  const totalName = Object.values(countsName).reduce((acc, val) => acc + val, 0);
  const totalType = Object.values(countsType).reduce((acc, val) => acc + val, 0);

  const handleCategoryClick = (name) => {
    setSelectedName(name);
    
    const filtered = records.filter(item => (item.projectName || "Unknown") === name);
    setFilteredData(filtered);
  };
  const handleCategoryTypeClick = (type) => {
    setSelectedType(type);
    
    const filtered = records.filter(item => (item.projectType || "Unknown") === type);
    setFilteredData(filtered);
  };

  const closePopup = () => {
    setSelectedType(null);
    setSelectedName(null);
    setFilteredData([]);
  };

  if (loading) return <p>Loading...</p>;

  return (
   
    <div>
      <h3>Project Name</h3>
      <div style={{ display: "flex", flexWrap: "wrap" }}>
        {/* Total Box */}
        <div
          style={{
            backgroundColor: "#a9b8a4",
            margin: "10px",
            padding: "20px",
            borderRadius: "10px",
            color: "#fff",
            minWidth: "200px",
            textAlign: "center",
            cursor: "pointer",
            fontWeight: "bold",
          }}
          onMouseEnter={e => {
            e.currentTarget.style.backgroundColor = "#fff";
            e.currentTarget.style.color = "#000";
          }}
          onMouseLeave={e => {
            e.currentTarget.style.backgroundColor = "#a9b8a4";
            e.currentTarget.style.color = "#fff";
          }}
        >
          <h3>Total</h3>
          <p style={{ fontSize: "22px", margin: 0 }}>{totalName}</p>
        </div>

        {/* Category Boxes */}
        {Object.entries(countsName).map(([name, count], index) => {
          const bgColor = '#a9b8a4';
          return (
            <div
              key={name}
              onClick={() => handleCategoryClick(name)}
              style={{
                backgroundColor: bgColor,
                margin: "10px",
                padding: "20px",
                borderRadius: "10px",
                color: "#fff",
                minWidth: "200px",
                textAlign: "center",
                cursor: "pointer",
              }}
              onMouseEnter={e => {
                e.currentTarget.style.backgroundColor = "#fff";
                e.currentTarget.style.color = "#000";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.backgroundColor = bgColor;
                e.currentTarget.style.color = "#fff";
              }}
            >
              <h3>{name}</h3>
              <p style={{ fontSize: "22px", margin: 0 }}>{count}</p>
            </div>
          );
        })}
      </div>

      {/* Popup Modal with Table */}
      {selectedName && (
        <div
          style={{
            position: "fixed",
            top: "10%",
            left: "50%",
            transform: "translateX(-50%)",
            backgroundColor: "#fff",
            padding: "20px",
            borderRadius: "10px",
            boxShadow: "0 0 15px rgba(0,0,0,0.3)",
            zIndex: 1000,
            width: "80%",
            maxHeight: "70vh",
            overflowY: "auto",
          }}
        >
          <button
            onClick={closePopup}
            style={{
              float: "right",
              background: "red",
              color: "white",
              border: "none",
              padding: "5px 10px",
              borderRadius: "5px",
              cursor: "pointer",
              marginBottom: "10px",
            }}
          >
            Close
          </button>
          <h3>{selectedType} - Details</h3>

          {filteredData.length === 0 ? (
            <p>No data found.</p>
          ) : (
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "#f2f2f2", textAlign: "left" }}>
                  <th style={{ padding: "8px", border: "1px solid #ccc" }}>Project Name</th>
                  <th style={{ padding: "8px", border: "1px solid #ccc" }}>Project Type</th>
                  <th style={{ padding: "8px", border: "1px solid #ccc" }}>Vulnerability Name</th>
                  <th style={{ padding: "8px", border: "1px solid #ccc" }}>sevirty</th>
                  <th style={{ padding: "8px", border: "1px solid #ccc" }}>Other Info</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((item, index) => (
                  <tr key={index}>
                    <td style={{ padding: "8px", border: "1px solid #ccc" }}>{item.projectName || "N/A"}</td>
                    <td style={{ padding: "8px", border: "1px solid #ccc" }}>{item.projectType || "N/A"}</td>
                    <td style={{ padding: "8px", border: "1px solid #ccc" }}>{item.vulnerabilityName || "N/A"}</td>
                    <td style={{ padding: "8px", border: "1px solid #ccc" }}>{item.sevirty || "N/A"}</td>
                    <td style={{ padding: "8px", border: "1px solid #ccc" }}>{item.createdAt ? dayjs(item.createdAt).format('DD-MM-YYYY') : 'N/A'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
  
      <h3>Project Type</h3>
      <div style={{ display: "flex", flexWrap: "wrap" }}>
        {/* Total Box */}
        <div
          style={{
            backgroundColor: "#4b7d7e",
            margin: "10px",
            padding: "20px",
            borderRadius: "10px",
            color: "#fff",
            minWidth: "200px",
            textAlign: "center",
            cursor: "pointer",
            fontWeight: "bold",
          }}
          onMouseEnter={e => {
            e.currentTarget.style.backgroundColor = "#fff";
            e.currentTarget.style.color = "#000";
          }}
          onMouseLeave={e => {
            e.currentTarget.style.backgroundColor = "#4b7d7e";
            e.currentTarget.style.color = "#fff";
          }}
        >
          <h3>Total</h3>
          <p style={{ fontSize: "22px", margin: 0 }}>{totalType}</p>
        </div>

        {/* Category Boxes */}
        {Object.entries(countsType).map(([type, count], index) => {
          const bgColor = '#4b7d7e';
          return (
            <div
              key={type}
              onClick={() => handleCategoryTypeClick(type)}
              style={{
                backgroundColor: bgColor,
                margin: "10px",
                padding: "20px",
                borderRadius: "10px",
                color: "#fff",
                minWidth: "200px",
                textAlign: "center",
                cursor: "pointer",
              }}
              onMouseEnter={e => {
                e.currentTarget.style.backgroundColor = "#fff";
                e.currentTarget.style.color = "#000";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.backgroundColor = bgColor;
                e.currentTarget.style.color = "#fff";
              }}
            >
              <h3>{type}</h3>
              <p style={{ fontSize: "22px", margin: 0 }}>{count}</p>
            </div>
          );
        })}
      </div>

      {/* Popup Modal with Table */}
      {selectedType && (
        <div
          style={{
            position: "fixed",
            top: "10%",
            left: "50%",
            transform: "translateX(-50%)",
            backgroundColor: "#fff",
            padding: "20px",
            borderRadius: "10px",
            boxShadow: "0 0 15px rgba(0,0,0,0.3)",
            zIndex: 1000,
            width: "80%",
            maxHeight: "70vh",
            overflowY: "auto",
          }}
        >
          <button
            onClick={closePopup}
            style={{
              float: "right",
              background: "red",
              color: "white",
              border: "none",
              padding: "5px 10px",
              borderRadius: "5px",
              cursor: "pointer",
              marginBottom: "10px",
            }}
          >
            Close
          </button>
          <h3>{selectedType} - Details</h3>

          {filteredData.length === 0 ? (
            <p>No data found.</p>
          ) : (
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "#f2f2f2", textAlign: "left" }}>
                  <th style={{ padding: "8px", border: "1px solid #ccc" }}>Project Name</th>
                  <th style={{ padding: "8px", border: "1px solid #ccc" }}>Project Type</th>
                  <th style={{ padding: "8px", border: "1px solid #ccc" }}>Vulnerability Name</th>
                  <th style={{ padding: "8px", border: "1px solid #ccc" }}>sevirty</th>
                  <th style={{ padding: "8px", border: "1px solid #ccc" }}>Other Info</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((itemtype, index) => (
                  <tr key={index}>
                    <td style={{ padding: "8px", border: "1px solid #ccc" }}>{itemtype.projectName || "N/A"}</td>
                    <td style={{ padding: "8px", border: "1px solid #ccc" }}>{itemtype.projectType || "N/A"}</td>
                    <td style={{ padding: "8px", border: "1px solid #ccc" }}>{itemtype.vulnerabilityName || "N/A"}</td>
                    <td style={{ padding: "8px", border: "1px solid #ccc" }}>{itemtype.sevirty || "N/A"}</td>
                    <td style={{ padding: "8px", border: "1px solid #ccc" }}>{itemtype.createdAt ? dayjs(itemtype.createdAt).format('DD-MM-YYYY') : 'N/A'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>

  );
};

export default CategoryCount;
