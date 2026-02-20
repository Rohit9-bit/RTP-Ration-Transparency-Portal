import React, { useState } from "react";
import {
  MdDownload,
  MdVisibility,
  MdWarning,
  MdExpandMore,
} from "react-icons/md";

const BeneficiaryTransactionHistory = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [timeRange, setTimeRange] = useState("6months");

  // Mock transaction data
  const transactions = [
    {
      id: 1,
      date: "March 15, 2024",
      time: "10:30 AM",
      shop: "Fair Price Shop #123",
      location: "Sector 15, Central Delhi",
      items: [
        { name: "Rice", quantity: "2kg/2kg", status: "completed" },
        { name: "Wheat", quantity: "3kg/3kg", status: "completed" },
      ],
      status: "Completed",
      statusColor: "bg-green-50 border-l-4 border-green-500",
    },
    {
      id: 2,
      date: "March 8, 2024",
      time: "2:15 PM",
      shop: "Fair Price Shop #123",
      location: "Sector 15, Central Delhi",
      items: [
        { name: "Rice", quantity: "2kg/2kg", status: "completed" },
        { name: "Sugar", quantity: "0kg/1kg", status: "partial" },
        { name: "Oil", quantity: "1L/1L", status: "completed" },
      ],
      status: "Partial",
      statusColor: "bg-yellow-50 border-l-4 border-yellow-500",
      hasIssue: true,
    },
    {
      id: 3,
      date: "March 1, 2024",
      time: "11:45 AM",
      shop: "Fair Price Shop #123",
      location: "Sector 15, Central Delhi",
      items: [
        { name: "Rice", quantity: "1kg/1kg", status: "completed" },
        { name: "Wheat", quantity: "N/A", status: "missing" },
      ],
      status: "Completed",
      statusColor: "bg-green-50 border-l-4 border-green-500",
    },
  ];

  // Summary statistics
  const stats = {
    total: 12,
    successful: 10,
    partial: 2,
    issues: 1,
  };

  const filteredTransactions = transactions.filter((tx) => {
    if (activeTab === "successful") return tx.status === "Completed";
    if (activeTab === "issues") return tx.hasIssue;
    if (activeTab === "pending") return tx.status === "Partial";
    return true;
  });

  const itemsPerPage = 3;
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
  const paginatedTransactions = filteredTransactions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">
            Transaction History
          </h1>
          <div className="flex gap-3">
            {/* Time Range Dropdown */}
            <div className="relative">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-10 text-gray-700 cursor-pointer hover:border-gray-400"
              >
                <option value="3months">Last 3 Months</option>
                <option value="6months">Last 6 Months</option>
                <option value="1year">Last 1 Year</option>
              </select>
              <MdExpandMore className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-600 pointer-events-none" />
            </div>
            {/* Export Button */}
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg flex items-center gap-2 transition">
              <MdDownload className="w-4 h-4" />
              Export
            </button>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-4 mb-6 border-b border-gray-200">
          {[
            { id: "all", label: "All Transactions" },
            { id: "successful", label: "Successful" },
            { id: "issues", label: "With Issues" },
            { id: "pending", label: "Pending" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                setCurrentPage(1);
              }}
              className={`px-4 py-3 font-medium border-b-2 transition ${
                activeTab === tab.id
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-600 hover:text-gray-900"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Transactions Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden mb-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Date & Time
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Shop Details
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Items
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginatedTransactions.map((transaction) => (
                  <tr
                    key={transaction.id}
                    className={`border-b border-gray-100 hover:bg-gray-50 transition ${transaction.statusColor}`}
                  >
                    <td className="px-6 py-4">
                      <div className="text-sm font-semibold text-gray-900">
                        {transaction.date}
                      </div>
                      <div className="text-xs text-gray-500">
                        {transaction.time}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-semibold text-gray-900">
                        {transaction.shop}
                      </div>
                      <div className="text-xs text-gray-500">
                        {transaction.location}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        {transaction.items.map((item, idx) => (
                          <div
                            key={idx}
                            className="text-sm text-gray-700 flex items-center gap-2"
                          >
                            <span className="font-medium">{item.name}</span>
                            <span className="text-gray-500">
                              {item.quantity}
                            </span>
                            {item.status === "completed" && (
                              <span className="text-green-600 text-lg">✓</span>
                            )}
                            {item.status === "partial" && (
                              <span className="text-yellow-600">⚠</span>
                            )}
                            {item.status === "missing" && (
                              <span className="text-red-600">✗</span>
                            )}
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                          transaction.status === "Completed"
                            ? "bg-green-100 text-green-800"
                            : transaction.status === "Partial"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                        }`}
                      >
                        {transaction.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-3 items-center">
                        <button className="text-blue-600 hover:text-blue-800 font-medium text-sm flex items-center gap-1 transition">
                          <MdVisibility className="w-4 h-4" />
                          View Details
                        </button>
                        {transaction.hasIssue && (
                          <button className="text-red-600 hover:text-red-800 font-medium text-sm flex items-center gap-1 transition">
                            <MdWarning className="w-4 h-4" />
                            Report
                          </button>
                        )}
                        <button className="text-gray-600 hover:text-gray-800 text-sm transition">
                          ⬇
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        <div className="flex justify-between items-center mb-8">
          <div className="text-sm text-gray-600">
            Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
            {Math.min(currentPage * itemsPerPage, filteredTransactions.length)}{" "}
            of {filteredTransactions.length} transactions
          </div>
          <div className="flex gap-2 items-center">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:border-gray-400 transition"
            >
              Previous
            </button>
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i + 1}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                  currentPage === i + 1
                    ? "bg-blue-600 text-white"
                    : "border border-gray-300 text-gray-700 hover:border-gray-400"
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
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:border-gray-400 transition"
            >
              Next
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
            <h3 className="text-gray-700 font-medium text-sm mb-2">
              Total Transactions
            </h3>
            <div className="text-3xl font-bold text-blue-900">
              {stats.total}
            </div>
            <p className="text-xs text-gray-600 mt-1">This month</p>
          </div>
          <div className="bg-green-50 rounded-lg p-6 border border-green-200">
            <h3 className="text-gray-700 font-medium text-sm mb-2">
              Successful
            </h3>
            <div className="text-3xl font-bold text-green-900">
              {stats.successful}
            </div>
            <p className="text-xs text-gray-600 mt-1">83% success rate</p>
          </div>
          <div className="bg-yellow-50 rounded-lg p-6 border border-yellow-200">
            <h3 className="text-gray-700 font-medium text-sm mb-2">Partial</h3>
            <div className="text-3xl font-bold text-yellow-900">
              {stats.partial}
            </div>
            <p className="text-xs text-gray-600 mt-1">Items missing</p>
          </div>
          <div className="bg-red-50 rounded-lg p-6 border border-red-200">
            <h3 className="text-gray-700 font-medium text-sm mb-2">
              Issues Reported
            </h3>
            <div className="text-3xl font-bold text-red-900">
              {stats.issues}
            </div>
            <p className="text-xs text-gray-600 mt-1">Under review</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BeneficiaryTransactionHistory;
