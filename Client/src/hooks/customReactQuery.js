import axiosInstance from "../utils/axiosInstance.js";
import { useEffect, useState } from "react";


const customReactQuery = (urlPath) => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(false);
  async function getData() {
    try {
      const response = await axiosInstance.get("/public/dashboard");
      if (response.data) {
        setDashboardData(response.data);
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      setLoading(false);
    }
  }

  useEffect(() => {
    (async () => {
      setLoading(true);
      await getData();
      setLoading(false);
    })();
  }, []);

  return { dashboardData, loading };
};

export default customReactQuery;
