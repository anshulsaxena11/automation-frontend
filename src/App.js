import React, { useState } from "react";
import Sidebar from "./layout/Sidebar/Sidebar";
import ContentBody from "./components/contentBody/ContentBody";
import AppRoutes from "./routes/Routes"
import "./App.css";

function App() {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const [selectedPage, setSelectedPage] = useState("home"); 

  const handleSidebarToggle = (isExpanded) => {
    setIsSidebarExpanded(isExpanded);
  };

  const handlePageSelect = (page) => {
    setSelectedPage(page);
  };

  return (
    <div className="App">
      <Sidebar onToggle={handleSidebarToggle} onPageSelect={handlePageSelect} />
      {/* <ContentBody isSidebarExpanded={isSidebarExpanded} selectedPage={selectedPage} /> */}
      <ContentBody
        isSidebarExpanded={isSidebarExpanded}
        selectedPage={selectedPage}
        setSelectedPage={setSelectedPage} // Pass setSelectedPage to ContentBody
      />
      <AppRoutes />
    </div>
  );
}

export default App;