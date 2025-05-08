import React from "react";
import { Routes, Route } from "react-router-dom";
import ReportList from '../pages/report/reportList/reportList'
import ProjectDetailsList from "../pages/projectDetails/ProjectDetailsList/projectDetailsList";
import ReportPdfGenerator from "../pages/ReportPdfGenerator/ReportPdfGenerator"
import AdminSyncEmploy from "../pages/adminEmp/adminEmp"
import ProjectMapping from "../pages/ProjectMapping/ProjectMapping"
import SkillMapping from "../pages/skillMapping/SkillMappimg"
import ToolsAndHardwareList from "../pages/toolsandHardware/ToolsAndHardwareList/ToolsAndHardwareList"
import ToolsAndHardwareMappingList from "../pages/ToolsandHardwareMaster/toolsAndHardwareList/ToolsAndHardwareList"

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/ProjectDetailsList" element={<ProjectDetailsList />} />
      <Route path="/reportList" element={<ReportList />} />
      <Route Path="/ReportPdfGenerator" element={<ReportPdfGenerator/>}/>
      <Route Path="/admin-Emp" element = {<AdminSyncEmploy/>}/>
      <Route Path="/user-Emp" element = {<ProjectMapping/>}/>
      <Route Path="/skills-Mapping" element={<SkillMapping/>}/>
      <Route path="/Tools-Hardware-list" element={<ToolsAndHardwareList/>}/>
      <Route path="/Tools-Hardware-Master-List" element={<ToolsAndHardwareMappingList/>}/>
    </Routes>
  );
};

export default AppRoutes;