import React from "react";
import { GiWheat } from "react-icons/gi";
import { useNavigate } from "react-router";

const AuthHeader = () => {
  const navigate = useNavigate();
  const handleRedirectToPublicDashboard = () => {
    if (confirm("You are redirecting to public dashboard!")) {
      navigate("/");
    }
  };
  return (
    <header className="border-b border-slate-200 bg-white backdrop-blur mx-auto w-full">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between  py-4">
        <div>
          <p className="flex gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 text-center"></p>
          <h1 className="flex gap-2 text-sm sm:text-xl font-bold text-slate-900 items-center">
            <GiWheat className="text-blue-600 text-xl sm:text-2xl" />
            <span>Ration Transparency Portal</span>
          </h1>
        </div>
        <div className="flex items-center gap-4 text-sm text-slate-600">
          <select className="rounded-full border border-slate-200 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
            <option value="Eng">Eng</option>
            <option value="Eng">Hin</option>
          </select>

          <button
            onClick={() => handleRedirectToPublicDashboard()}
            className="rounded-md px-3 py-1 bg-blue-600 text-sm font-semibold text-white cursor-pointer"
          >
            Public Dashboard
          </button>
        </div>
      </div>
    </header>
  );
};

export default AuthHeader;
