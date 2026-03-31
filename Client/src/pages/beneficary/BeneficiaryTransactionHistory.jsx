import React, { use, useEffect, useState } from "react";
import {
  MdArrowBackIosNew,
  MdCheck,
  MdClose,
  MdDownload,
  MdExpandMore,
  MdFilterList,
  MdVisibility,
  MdWarning,
} from "react-icons/md";
import { GiWheat } from "react-icons/gi";

import { useNavigate } from "react-router";
import axiosInstance from "../../utils/axiosInstance";
import useLogoutHook from "../../hooks/handleLogOutHook.js";
const BeneficiaryTransactionHistory = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [timeRange, setTimeRange] = useState("3");
  const [transactionsData, setTransactionsData] = useState();
  const [isLoading, setIsLoading] = useState(false);

  // useLogOutHook
  const logout = useLogoutHook();

  const navigate = useNavigate();

  // Mock transaction data
  const transactions = [
    {
      id: 1,
      date: "March 15, 2024",
      time: "10:30 AM",
      shop: "Fair Price Shop #123",
      location: "Sector 15, Central Delhi",
      items: [
        { name: "Rice", quantity: "2 kg / 2 kg", status: "completed" },
        { name: "Wheat", quantity: "3 kg / 3 kg", status: "completed" },
      ],
      status: "Completed",
    },
    {
      id: 2,
      date: "March 8, 2024",
      time: "2:15 PM",
      shop: "Fair Price Shop #123",
      location: "Sector 15, Central Delhi",
      items: [
        { name: "Rice", quantity: "2 kg / 2 kg", status: "completed" },
        { name: "Sugar", quantity: "0 kg / 1 kg", status: "partial" },
        { name: "Oil", quantity: "1 L / 1 L", status: "completed" },
      ],
      status: "Partial",
      hasIssue: true,
    },
    {
      id: 3,
      date: "March 1, 2024",
      time: "11:45 AM",
      shop: "Fair Price Shop #123",
      location: "Sector 15, Central Delhi",
      items: [
        { name: "Rice", quantity: "1 kg / 1 kg", status: "completed" },
        { name: "Wheat", quantity: "N/A", status: "missing" },
      ],
      status: "Completed",
    },
  ];

  // Summary statistics
  const stats = {
    total: 12,
    successful: 10,
    partial: 2,
    issues: 1,
  };

  // Api call to fetch transactions based on timeRange would go here

  useEffect(() => {
    setIsLoading(true);
    axiosInstance
      .get("/beneficiary/transaction/history", {
        withCredentials: true,
        params: {
          lastMonths: timeRange,
        },
      })
      .then((response) => {
        setTransactionsData(response.data.data1);
      })
      .catch((error) => {
        console.error("Error fetching transactions:", error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [timeRange]);

  const filteredTransactions = (
    Array.isArray(transactionsData) ? transactionsData : transactions
  ).filter((tx) => {
    if (activeTab === "successful") {
      return tx.items.every((item) => item.anomaly_type === "none");
    }
    if (activeTab === "issues") {
      return tx.items.some((item) => item.anomaly_type !== "none");
    }
    return true;
  });

  const itemsPerPage = 3;
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
  const paginatedTransactions = filteredTransactions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  function handleNavClick(section) {
    switch (section) {
      case "MyRation":
        navigate("/beneficiary/dashboard");
        break;
      case "ReportIssue":
        navigate("/grievance/submit");
        break;
      default:
        break;
    }
  }

  // Handle logout function
  // function handleLogout() {
  //   confirm("Are you sure you want to logout?") &&
  //     axiosInstance
  //       .post("/beneficiary/logout", {}, { withCredentials: true })
  //       .then(() => {
  //         navigate("/beneficiary/login");
  //       })
  //       .catch((error) => {
  //         alert("Logout failed. Please try again.");
  //         console.log(error);
  //       });
  // }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4">
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
              Welcome, {"Beneficiary Name"}
            </span>
            <button
              onClick={logout}
              className="text-sm font-semibold text-red-500 cursor-pointer"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-6xl py-6">
        {/* Mobile Header */}
        <div className="flex items-center justify-between md:hidden mb-5">
          <button className="flex items-center gap-2 text-sm text-gray-600">
            <MdArrowBackIosNew className="h-4 w-4" />
            Back
          </button>
          <h1 className="text-sm font-semibold text-gray-900">
            Transaction History
          </h1>
          <button className="text-gray-600">
            <MdFilterList className="h-5 w-5" />
          </button>
        </div>

        {/* Desktop Header */}

        <nav className="mb-6 flex flex-wrap items-center gap-4 text-sm font-semibold">
          <button
            onClick={() => {
              handleNavClick("MyRation");
            }}
            className="rounded-full px-4 py-2 text-slate-500 hover:text-slate-700"
          >
            My Ration
          </button>
          <button className="rounded-full bg-blue-50 px-4 py-2 text-blue-700 shadow-sm">
            Transaction History
          </button>
          <button
            onClick={() => {
              handleNavClick("ReportIssue");
            }}
            className="rounded-full px-4 py-2 text-slate-500 hover:text-slate-700"
          >
            Report Issue
          </button>
          <button className="rounded-full px-4 py-2 text-slate-500 hover:text-slate-700">
            Settings
          </button>
        </nav>

        <div className="mt-4 hidden items-center justify-between md:flex">
          <h1 className="text-2xl font-semibold text-gray-900">
            Transaction History
          </h1>
          <div className="flex items-center gap-3">
            <div className="relative">
              <select
                value={timeRange}
                onChange={(e) => {
                  setTimeRange(e.target.value);
                }}
                className="appearance-none rounded-md border border-gray-200 bg-white px-4 py-2 pr-9 text-sm text-gray-700"
              >
                <option value="3">Last 3 Months</option>
                <option value="6">Last 6 Months</option>
                <option value="12">Last 1 Year</option>
              </select>
              <MdExpandMore className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
            </div>
            <button className="flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700">
              <MdDownload className="h-4 w-4" />
              Export
            </button>
          </div>
        </div>

        {/* Mobile Filters */}
        <div className="mt-4 md:hidden">
          <div className="relative">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="w-full appearance-none rounded-md border border-gray-200 bg-white px-4 py-2 pr-9 text-sm text-gray-700"
            >
              <option value="3">Last 3 Months</option>
              <option value="6">Last 6 Months</option>
              <option value="12">Last 1 Year</option>
            </select>
            <MdExpandMore className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
          </div>
          <div className="mt-3 flex gap-2 rounded-lg bg-gray-100 p-1">
            {[
              { id: "all", label: "All" },
              { id: "successful", label: "Success" },
              { id: "issues", label: "Issues" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setCurrentPage(1);
                }}
                className={`flex-1 rounded-md px-3 py-2 text-xs font-semibold transition ${
                  activeTab === tab.id
                    ? "bg-blue-100 text-blue-700"
                    : "text-gray-600"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Desktop Tabs */}
        <div className="mt-6 hidden border-b border-gray-200 md:flex">
          {[
            { id: "all", label: "All Transactions" },
            { id: "successful", label: "Successful" },
            { id: "issues", label: "With Issues" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                setCurrentPage(1);
              }}
              className={`px-4 py-3 text-sm font-medium transition ${
                activeTab === tab.id
                  ? "border-b-2 border-blue-600 text-blue-600"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Desktop Table */}
        <div className="mt-6 hidden overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm md:block">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                <tr>
                  <th className="px-6 py-4">Date & Time</th>
                  <th className="px-6 py-4">Shop Details</th>
                  <th className="px-6 py-4">Items</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.map((transaction, index) => (
                  <tr
                    key={index}
                    className="border-b border-gray-100 hover:bg-gray-50"
                  >
                    <td className="px-6 py-4">
                      <div className="text-sm font-semibold text-gray-900">
                        {new Date(transaction?.dateTime).toLocaleDateString()}
                      </div>
                      <div className="text-xs text-gray-500">
                        {new Date(transaction?.dateTime).toLocaleTimeString()}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-semibold text-gray-900">
                        {transaction?.shopDetails?.name}
                      </div>
                      <div className="text-xs text-gray-500">
                        {transaction?.shopDetails?.address}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        {transaction.items.map((item, idx) => (
                          <div
                            key={idx}
                            className="flex items-center gap-2 text-sm text-gray-700"
                          >
                            <span className="font-medium">{item.name}:</span>
                            <span className="text-gray-500">
                              {item.quantity_entitled + item.unit} /
                              {item.quantity_received + item.unit}
                            </span>
                            {item.anomaly_type === "none" ? (
                              <MdCheck className="h-4 w-4 text-green-500" />
                            ) : (
                              <MdClose className="h-4 w-4 text-red-500" />
                            )}
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
                          transaction.items.some(
                            (item) => item.anomaly_type !== "none",
                          )
                            ? "bg-red-100 text-red-700"
                            : "bg-green-100 text-green-700"
                        }`}
                      >
                        {transaction.items.some(
                          (item) => item.anomaly_type !== "none",
                        )
                          ? "Partial"
                          : "Completed"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4 text-sm">
                        <button className="flex items-center gap-1 font-medium text-blue-600 hover:text-blue-700">
                          <MdVisibility className="h-4 w-4" />
                          View Details
                        </button>
                        {transaction.items.some(
                          (item) => item.anomaly_type !== "none",
                        ) && (
                          <button className="flex items-center gap-1 font-medium text-red-600 hover:text-red-700">
                            <MdWarning className="h-4 w-4" />
                            Report
                          </button>
                        )}
                        <button className="text-gray-500 hover:text-gray-700">
                          <MdDownload className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Mobile Cards */}
        <div className="mt-6 space-y-4 md:hidden">
          {filteredTransactions.map((transaction, index) => (
            <div
              key={index}
              className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-sm font-semibold text-gray-900">
                    {new Date(transaction.dateTime).toLocaleString()}
                  </div>
                  <div className="text-xs text-gray-500">
                    {new Date(transaction.dateTime).toLocaleTimeString()}
                  </div>
                </div>
                <span
                  className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
                    transaction.items.some(
                      (item) => item.anomaly_type == "none",
                    )
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {transaction.items.some(
                    (item) => item.anomaly_type === "none",
                  )
                    ? "Success"
                    : "Partial"}
                </span>
              </div>
              <div className="mt-3 text-xs text-gray-600">
                <div>
                  <span className="font-semibold text-gray-800">Shop:</span>{" "}
                  {transaction?.shopDetails?.name}
                </div>
                <div>
                  <span className="font-semibold text-gray-800">Location:</span>{" "}
                  {transaction?.shopDetails?.address}
                </div>
              </div>
              <div className="mt-3 space-y-1 text-xs text-gray-700">
                {transaction.items.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between">
                    <span className="font-medium text-gray-800">
                      {item.name}
                    </span>
                    <span className="flex items-center gap-1">
                      {item.quantity}
                      {item.status === "completed" && (
                        <MdCheck className="h-4 w-4 text-green-500" />
                      )}
                      {item.status === "partial" && (
                        <MdWarning className="h-4 w-4 text-yellow-500" />
                      )}
                      {item.status === "missing" && (
                        <MdClose className="h-4 w-4 text-red-500" />
                      )}
                    </span>
                  </div>
                ))}
              </div>
              <div className="mt-3 flex items-center gap-3 text-xs">
                <button className="text-blue-600 hover:text-blue-700">
                  View Details
                </button>
                {transaction.hasIssue && (
                  <button className="flex items-center gap-1 text-red-600 hover:text-red-700">
                    <MdWarning className="h-4 w-4" />
                    Report Issue
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="mt-6 hidden items-center justify-between md:flex">
          <div className="text-sm text-gray-600">
            Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
            {Math.min(currentPage * itemsPerPage, filteredTransactions.length)}{" "}
            of {filteredTransactions.length} transactions
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="rounded-md border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 transition disabled:cursor-not-allowed disabled:opacity-50"
            >
              Previous
            </button>
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i + 1}
                onClick={() => setCurrentPage(i + 1)}
                className={`rounded-md px-3 py-2 text-sm font-medium transition ${
                  currentPage === i + 1
                    ? "bg-blue-600 text-white"
                    : "border border-gray-200 text-gray-700 hover:border-gray-300"
                }`}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() =>
                setCurrentPage(Math.min(totalPages, currentPage + 1))
              }
              disabled={currentPage === totalPages}
              className="rounded-md border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 transition disabled:cursor-not-allowed disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-4">
          <div className="rounded-lg border border-blue-100 bg-blue-50 p-5">
            <h3 className="text-xs font-semibold text-gray-700">
              Total Transactions
            </h3>
            <div className="mt-2 text-2xl font-bold text-blue-900">
              {stats.total}
            </div>
            <p className="mt-1 text-xs text-gray-600">This month</p>
          </div>
          <div className="rounded-lg border border-green-100 bg-green-50 p-5">
            <h3 className="text-xs font-semibold text-gray-700">Successful</h3>
            <div className="mt-2 text-2xl font-bold text-green-900">
              {stats.successful}
            </div>
            <p className="mt-1 text-xs text-gray-600">83% success rate</p>
          </div>
          <div className="rounded-lg border border-yellow-100 bg-yellow-50 p-5">
            <h3 className="text-xs font-semibold text-gray-700">Partial</h3>
            <div className="mt-2 text-2xl font-bold text-yellow-900">
              {stats.partial}
            </div>
            <p className="mt-1 text-xs text-gray-600">Items missing</p>
          </div>
          <div className="rounded-lg border border-red-100 bg-red-50 p-5">
            <h3 className="text-xs font-semibold text-gray-700">
              Issues Reported
            </h3>
            <div className="mt-2 text-2xl font-bold text-red-900">
              {stats.issues}
            </div>
            <p className="mt-1 text-xs text-gray-600">Under review</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BeneficiaryTransactionHistory;
