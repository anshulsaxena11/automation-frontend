import React from "react";
import { Routes, Route } from "react-router-dom";
import ReportList from '../pages/report/reportList/reportList'
import ProjectDetailsList from "../pages/projectDetails/ProjectDetailsList/projectDetailsList";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/ProjectDetailsList" element={<ProjectDetailsList />} />
      <Route path="/reportList" element={<ReportList />} />
    </Routes>
  );
};

export default AppRoutes;
