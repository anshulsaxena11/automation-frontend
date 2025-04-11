import React, { useState } from "react";
import { FaBars, FaHome, FaInfoCircle, FaBriefcase, FaPhone } from "react-icons/fa";
import { BiSolidReport } from "react-icons/bi";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import "./Sidebar.css";

const Sidebar = ({ onToggle }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const navigate = useNavigate(); // Initialize useNavigate

  const toggleSidebar = () => {
    const newState = !isExpanded;
    setIsExpanded(newState);
    onToggle(newState);
  };

  const handlePageSelect = (page) => {
    // Use navigate to change the route
    if (page === "ProjectDetailsList") {
      navigate("/home");
    } else if (page === "report") {
      navigate("/report");
    }else if(page === "ReportPdfGenerator"){
      navigate("/ReportPdfGenerator")
    }
  };

  return (
    <div className={`sidebar ${isExpanded ? "expanded" : "collapsed"}`}>
      <button className="toggle-button" onClick={toggleSidebar}>
        <FaBars />
      </button>
      <ul className="menu">
        <li className="menu-item" onClick={() => handlePageSelect("ProjectDetailsList")}>
          <FaHome className="icon" />
          {isExpanded && <span className="label">Home</span>}
        </li>
        <li className="menu-item" onClick={() => handlePageSelect("report")}>
          <BiSolidReport className="icon" />
          {isExpanded && <span className="label">Report</span>}
        </li>
        <li className="menu-item" onClick={() => handlePageSelect("ReportPdfGenerator")}>
          <FaBriefcase className="icon" />
          {isExpanded && <span className="label">Generate File</span>}
        </li>
        {/* <li className="menu-item" onClick={() => handlePageSelect("contact")}>
          <FaPhone className="icon" />
          {isExpanded && <span className="label">Contact</span>}
        </li>  */}
      </ul>
    </div>
  );
};

export default Sidebar;
