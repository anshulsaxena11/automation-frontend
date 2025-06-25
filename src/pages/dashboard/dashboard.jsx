import React, { useEffect, useState } from "react";
import { getAllReportList } from '../../api/reportApi/reportApi';
import dayjs from 'dayjs';

const CategoryCount = () => {
  const [countsName, setCountsName] = useState({});
  const [countsType, setCountsType] = useState({});
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState({ type: null, name: null });
  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await getAllReportList();
        const json = Array.isArray(response) ? response : response.data;

        setRecords(json);

        const nameCounts = {};
        const typeCounts = {};

        json.forEach(item => {
          const nameKey = item.projectName?.projectName?.trim() || "Unknown";
          const typeKey = item.projectType?.trim() || "Unknown";

          nameCounts[nameKey] = (nameCounts[nameKey] || 0) + 1;
          typeCounts[typeKey] = (typeCounts[typeKey] || 0) + 1;
        });

        setCountsName(nameCounts);
        setCountsType(typeCounts);

        // Debug logs
        console.log("Unique Project Names:", Object.keys(nameCounts));
        console.log("Unique Project Types:", Object.keys(typeCounts));
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const totalName = Object.values(countsName).reduce((acc, val) => acc + val, 0);
  const totalType = Object.values(countsType).reduce((acc, val) => acc + val, 0);

  const handleCategoryClick = (name) => {
    const filtered = records.filter(
      item => (item.projectName?.projectName?.trim() || "Unknown") === name
    );
    setSelectedFilter({ name, type: null });
    setFilteredData(filtered);
  };

  const handleCategoryTypeClick = (type) => {
    const filtered = records.filter(
      item => (item.projectType?.trim() || "Unknown") === type
    );
    setSelectedFilter({ name: null, type });
    setFilteredData(filtered);
  };

  const closePopup = () => {
    setSelectedFilter({ name: null, type: null });
    setFilteredData([]);
  };

  if (loading) return <p>Loading...</p>;

  const renderCategoryBox = (label, count, color, onClick) => (
    <div
      onClick={onClick}
      style={{
        backgroundColor: color,
        margin: "10px",
        padding: "20px",
        borderRadius: "10px",
        color: "#fff",
        minWidth: "200px",
        textAlign: "center",
        cursor: "pointer",
        fontWeight: "bold",
        transition: "all 0.2s ease",
      }}
      onMouseEnter={e => {
        e.currentTarget.style.backgroundColor = "#fff";
        e.currentTarget.style.color = "#000";
      }}
      onMouseLeave={e => {
        e.currentTarget.style.backgroundColor = color;
        e.currentTarget.style.color = "#fff";
      }}
    >
      <h3>{label}</h3>
      <p style={{ fontSize: "22px", margin: 0 }}>{count}</p>
    </div>
  );

  const renderModal = () => {
    if (!selectedFilter.name && !selectedFilter.type) return null;

    const title = selectedFilter.name || selectedFilter.type;

    return (
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
        <h3>{title} - Details</h3>

        {filteredData.length === 0 ? (
          <p>No data found.</p>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#f2f2f2", textAlign: "left" }}>
                <th style={{ padding: "8px", border: "1px solid #ccc" }}>Project Name</th>
                <th style={{ padding: "8px", border: "1px solid #ccc" }}>Project Type</th>
                <th style={{ padding: "8px", border: "1px solid #ccc" }}>Vulnerability Name</th>
                <th style={{ padding: "8px", border: "1px solid #ccc" }}>Severity</th>
                <th style={{ padding: "8px", border: "1px solid #ccc" }}>Created At</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((item, index) => (
                <tr key={index}>
                  <td style={{ padding: "8px", border: "1px solid #ccc" }}>{item.projectName.projectName || "N/A"}</td>
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
    );
  };

  return (
    <div>
      <h3>Project Name</h3>
      <div style={{ display: "flex", flexWrap: "wrap", maxHeight: "300px", overflowY: "auto" }}>
        {renderCategoryBox("Total", totalName, "#a9b8a4", () => {})}
        {Object.entries(countsName).map(([name, count]) =>
          renderCategoryBox(name, count, "#a9b8a4", () => handleCategoryClick(name))
        )}
      </div>

      <h3>Project Type</h3>
      <div style={{ display: "flex", flexWrap: "wrap", maxHeight: "300px", overflowY: "auto" }}>
        {renderCategoryBox("Total", totalType, "#4b7d7e", () => {})}
        {Object.entries(countsType).map(([type, count]) =>
          renderCategoryBox(type, count, "#4b7d7e", () => handleCategoryTypeClick(type))
        )}
      </div>

      {renderModal()}
    </div>
  );
};

export default CategoryCount;
