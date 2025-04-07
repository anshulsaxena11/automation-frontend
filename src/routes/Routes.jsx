import React from "react";
import { Routes, Route } from "react-router-dom";
import ReportList from '../pages/report/reportList/reportList'
import ProjectDetailsList from "../pages/projectDetails/ProjectDetailsList/projectDetailsList";
import ReportPdfGenerator from "../pages/ReportPdfGenerator/ReportPdfGenerator"

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/ProjectDetailsList" element={<ProjectDetailsList />} />
      <Route path="/reportList" element={<ReportList />} />
      <Route Path="/ReportPdfGenerator" element={<ReportPdfGenerator/>}/>
    </Routes>
  );
};

export default AppRoutes;
