import React, { useEffect } from "react";
import { useNavigate } from "react-router";
import axiosInstance from "../utils/axiosInstance.js";
import useLogoutHook from "../hooks/handleLogOutHook.js";
import { GiWheat } from "react-icons/gi";

const DashboardHeader = () => {
  const [accountInfo, setAccountInfo] = React.useState(null);

  const Logout = useLogoutHook();

  const navigate = useNavigate();

  useEffect(() => {
    try {
      axiosInstance
        .get("/beneficiary/account")
        .then((response) => {
          setAccountInfo(response.data.data);
        })
        .catch((error) => {
          console.error("Error fetching account details:", error);
        });
    } catch (error) {
      console.error("Error fetching account details:", error);
    }
  }, []);

  return (
    <header className="border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-2 py-4">
        <div>
          <p className="flex gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 text-center"></p>
          <h1 className="flex gap-2 text-sm sm:text-xl font-bold text-slate-900 items-center">
            <GiWheat className="text-blue-600 text-xl sm:text-2xl" />
            <span>Ration Transparency Portal</span>
          </h1>
        </div>
        <div className="flex items-center gap-4 text-sm text-slate-600">
          <button className="rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-500">
            EN
          </button>
          <span className="hidden text-sm font-medium text-slate-700 sm:inline">
            Welcome, {accountInfo?.full_name || "Beneficiary Name"}
          </span>
          <button
            onClick={Logout}
            className="text-sm font-semibold text-red-500 cursor-pointer"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
