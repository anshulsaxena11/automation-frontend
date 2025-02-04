import React from "react";
import "./contentBody.css";
import HomePage from "../../pages/HomePage/HomePage.jsx";
import ReportPage from "../../pages/report/report.jsx"; // Import ReportPage

const ContentBody = ({ isSidebarExpanded, selectedPage, setSelectedPage }) => {
  const renderPageContent = () => {
    switch (selectedPage) {
      case "home":
        return <HomePage setSelectedPage={setSelectedPage} />;
      case "report":  
        return <ReportPage />;  
      case "about":
        return (
          <div className="about-page-content">
            <h1>About Us</h1>
            <p>This is the About page content.</p>
          </div>
        );
      case "services":
        return (
          <div className="services-page-content">
            <h1>Our Services</h1>
            <p>This is the Services page content.</p>
          </div>
        );
      case "contact":
        return (
          <div className="contact-page-content">
            <h1>Contact Us</h1>
            <p>This is the Contact page content.</p>
          </div>
        );
      default:
        return (
          <div className="default-content">
            <h1>Welcome</h1>
            <p>Please select a page from the sidebar.</p>
          </div>
        );
    }
  };

  return (
    <div
      className="content-body"
      style={{
        marginLeft: isSidebarExpanded ? "300px" : "100px",
        transition: "margin-left 0.3s ease-in-out",
      }}
    >
      {renderPageContent()}
    </div>
  );
};

export default ContentBody;
