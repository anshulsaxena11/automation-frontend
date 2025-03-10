import React, { useState, useEffect } from "react";
import { Routes, Route, useLocation  } from "react-router-dom";
import ProjectDetailsList from "../../pages/projectDetails/ProjectDetailsList/projectDetailsList.jsx";
import Home from "../../pages/projectDetails/HomePage/HomePage.jsx"
import ReportList from "../../pages/report/reportList/reportList.jsx";
import EditReportForm from "../../pages/report/reportEdit/reportEdit.jsx"
import Report from "../../pages/report/reportForm/report.jsx"
import ReportView from "../../pages/report/reportView/reportView.jsx"
import ProjectDetailsView from "../../pages/projectDetails/projectDetailView/projectDetailsView.jsx"
import ProjectDetailsEdit from "../../pages/projectDetails/projectDetailsEdit/projectDetailsEdit.jsx"
import VaptLoader from "../../components/loader/loader.jsx";
import './contentBody.css'

const ContentBody = ({ isSidebarExpanded }) => {
  const [loading, setLoading] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 1000); // Simulated loading time

    return () => clearTimeout(timer);
  }, [location.pathname]); // Trigger loader on route change

  return (
    <div className={`content-body ${isSidebarExpanded ? "expanded" : "collapsed"}`}>
      {/* Loader Overlay (Doesn't affect layout) */}
      {loading && (
        <div className="vapt-loader-overlay">
          <VaptLoader />
        </div>
      )}

      {/* Page Content Remains in Place */}
      <div className={`page-content ${loading ? "loading" : ""}`}>
        <Routes>
          <Route path="/home" element={<ProjectDetailsList />} />
          <Route path="/ProjectDetails" element={<Home />} />
          <Route path="/projectDetails/:id" element={<ProjectDetailsView />} />
          <Route path="/projectDetailsEdit/:id" element={<ProjectDetailsEdit />} />
          <Route path="/report" element={<ReportList />} />
          <Route path="/newReport" element={<Report />} />
          <Route path="/newReportView/:id" element={<ReportView />} />
          <Route path="/editReport/:id" element={<EditReportForm />} />
        </Routes>
      </div>
    </div>
  );
};

export default ContentBody;