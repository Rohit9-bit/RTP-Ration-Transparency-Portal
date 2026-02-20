import React from "react";
// Index.css
import "./index.css";
// Components
import PublicDashboard from "./pages/public/PublicDashboard.jsx";
// Routes
import { Routes, Route } from "react-router";
import RegisterBeneficary from "./pages/beneficary/RegisterBeneficary.jsx";
import LoginBeneficiary from "./pages/beneficary/LoginBeneficiary.jsx";
import BeneficiaryDashboard from "./pages/beneficary/BeneficiaryDashboard.jsx";
import BeneficiaryTransactionHistory from "./pages/beneficary/BeneficiaryTransactionHistory.jsx";
import BeneficiaryGrievance from "./pages/beneficary/BeneficiaryGrievance.jsx";

const App = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<PublicDashboard />} />

      {/* Beneficiary Auth Routes */}
      <Route path="/beneficiary/register" element={<RegisterBeneficary />} />
      <Route path="/beneficiary/login" element={<LoginBeneficiary />} />

      {/* Shop Owner Auth Routes */}
      {/* <Route path='/owner/register' element={} />
      <Route path='/owner/login' element={} /> */}

      {/* Beneficiary Routes */}
      <Route path="/beneficiary/dashboard" element={<BeneficiaryDashboard />} />
      <Route
        path="/beneficary/transaction-history"
        element={<BeneficiaryTransactionHistory />}
      />
      <Route path='grievance/submit' element={<BeneficiaryGrievance />} />
      {/* <Route path='grievance/history' element={} /> */}

      {/* Shop Owner Routes */}
    </Routes>
  );
};

export default App;
