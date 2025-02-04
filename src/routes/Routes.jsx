import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from '../pages/HomePage/HomePage'; 
import ReportPage from '../pages/report/report';      

const AppRoutes = () => {
  return (
    <Routes>
      {/* <Route path="/" element={<HomePage />} /> */}
      {/* <Route path="/report" element={<ReportPage />} /> */}
    </Routes>
  );
};

export default AppRoutes;