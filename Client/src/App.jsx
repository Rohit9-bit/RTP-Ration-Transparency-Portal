import React from 'react'
// Index.css
import './index.css'
// Components
import PublicDashboard from './pages/PublicDashboard.jsx'
// Routes
import { Routes, Route } from 'react-router' 
import RegisterBeneficary from './pages/beneficary/RegisterBeneficary.jsx'
import LoginBeneficiary from './pages/beneficary/LoginBeneficiary.jsx'



const App = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path='/' element={<PublicDashboard />} />

      {/* Beneficiary Auth Routes */}
      <Route path='/beneficary/register' element={<RegisterBeneficary />} />
      <Route path='/beneficary/login' element={<LoginBeneficiary />} />


      {/* Shop Owner Auth Routes */}
      {/* <Route path='/owner/register' element={} />
      <Route path='/owner/login' element={} /> */}

      {/* Beneficiary Routes */}
      {/* <Route path='/beneficiary/dashboard' element={} />
      <Route path='/beneficary/transaction-history' element={} />
      <Route path='grievance/submit' element={} />
      <Route path='grievance/history' element={} /> */}

      {/* Shop Owner Routes */}
    </Routes>
  )
}

export default App