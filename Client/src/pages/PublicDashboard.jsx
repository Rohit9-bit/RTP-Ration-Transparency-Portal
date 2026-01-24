import React, { useEffect, useState } from "react";
import customReactQuery from "../hooks/customReactQuery.js";

const PublicDashboard = () => {
  const { dashboardData, loading } = customReactQuery("/public/dashboard");

  console.log(dashboardData);
  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Public Dashboard</h1>
    </div>
  );
};

export default PublicDashboard;
