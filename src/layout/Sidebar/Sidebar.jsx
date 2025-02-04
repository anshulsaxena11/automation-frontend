import React, { useState } from "react";
import { FaBars, FaHome, FaInfoCircle, FaBriefcase, FaPhone } from "react-icons/fa";
import "./Sidebar.css";

const Sidebar = ({ onToggle, onPageSelect }) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const toggleSidebar = () => {
    const newState = !isExpanded;
    setIsExpanded(newState);
    onToggle(newState);
  };

  const handlePageSelect = (page) => {
    onPageSelect(page);
  };

  return (
    <div className={`sidebar ${isExpanded ? "expanded" : "collapsed"}`}>
      <button className="toggle-button" onClick={toggleSidebar}>
        <FaBars />
      </button>
      <ul className="menu">
        <li className="menu-item" onClick={() => handlePageSelect("home")}>
          <FaHome className="icon" />
          {isExpanded && <span className="label">Home</span>}
        </li>
        <li className="menu-item" onClick={() => handlePageSelect("report")}>
          <FaInfoCircle className="icon" />
          {isExpanded && <span className="label">Report</span>}
        </li>
        {/* <li className="menu-item" onClick={() => handlePageSelect("services")}>
          <FaBriefcase className="icon" />
          {isExpanded && <span className="label">Services</span>}
        </li>
        <li className="menu-item" onClick={() => handlePageSelect("contact")}>
          <FaPhone className="icon" />
          {isExpanded && <span className="label">Contact</span>}
        </li> */}
      </ul>
    </div>
  );
};

export default Sidebar;