import React, { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import { useNavigate } from "react-router";

// Icons
import { GiWheat } from "react-icons/gi";

const BeneficiaryDashboard = () => {
  const [currentEntitlement, setCurrentEntitlement] = useState({});
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [accountInfo, setAccountInfo] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    setIsLoading(true);

    axiosInstance
      .get("/beneficiary/dashboard", { withCredentials: true })
      .then((response) => {
        processDashboardData(response.data.data[0]);
      })
      .catch((error) => {
        alert("Failed to load dashboard data. Please try again later.");
        setError(
          error.response?.data?.message ||
            "An error occurred while fetching data.",
        );
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  function processDashboardData(data) {
    if (!data) return;
    setCurrentEntitlement(data.thisMonthsQuota);
    setRecentTransactions(data.thisMonthsTransactionArray);
    setAccountInfo(data.beneficiaryAccountsDetails);
  }

  function handleNavClick(section) {
    switch (section) {
      case "TransactionHistory":
        navigate("/beneficary/transaction-history");
        break;
      case "ReportIssue":
        navigate("/grievance/submit");
        break;
      default:
        break;
    }
  }

  function handleLogout() {
    confirm("Are you sure you want to logout?") &&
      axiosInstance
        .post("/beneficiary/logout", { withCredentials: true })
        .then(() => {
          navigate("/beneficiary/login");
        })
        .catch(() => {
          alert("Logout failed. Please try again.");
        });
  }

  return error === "" ? (
    <div className="min-h-screen bg-linear-to-br from-[#fffdf6] via-[#f6f9ff] to-[#fdf1ea] font-sans text-slate-900">
      <header className="border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4">
          <div>
            <p className="flex gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 text-center"></p>
            <h1 className="flex gap-2 text-xl font-bold text-slate-900 items-center">
              <GiWheat className="text-blue-600" size={30} />
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
              onClick={handleLogout}
              className="text-sm font-semibold text-red-500 cursor-pointer"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {isLoading ? (
        <div className="flex h-screen items-center justify-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
        </div>
      ) : (
        <div className="mx-auto w-full max-w-6xl px-6 pb-12 pt-6">
          <nav className="mb-6 flex flex-wrap items-center gap-4 text-sm font-semibold">
            <button className="rounded-full bg-blue-50 px-4 py-2 text-blue-700 shadow-sm">
              My Ration
            </button>
            <button
              onClick={() => {
                handleNavClick("TransactionHistory");
              }}
              className="rounded-full px-4 py-2 text-slate-500 hover:text-slate-700"
            >
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

          <div className="grid gap-6 lg:grid-cols-[1.05fr_1.2fr_0.9fr]">
            <section className="space-y-6">
              <div className="rounded-2xl border border-slate-200 bg-blue-50/60 p-5 shadow-sm">
                <h2 className="mb-4 text-sm font-semibold text-blue-700">
                  My Current Entitlement
                </h2>
                <ul className="space-y-3 text-sm">
                  {(Array.isArray(currentEntitlement)
                    ? currentEntitlement
                    : []
                  ).map((item, index) => (
                    <li
                      className="flex items-center justify-between"
                      key={index}
                    >
                      <span className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-orange-400"></span>
                        {item.commodity.commodity_name}
                      </span>
                      <span className="font-semibold">
                        {item.quantity_entitled +
                          " (" +
                          item.commodity.unit +
                          ")"}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <h2 className="mb-4 text-sm font-semibold text-slate-700">
                  Quick Actions
                </h2>
                <div className="space-y-3 text-sm font-semibold">
                  <button className="flex w-full items-center justify-center gap-2 rounded-xl bg-red-500 px-4 py-3 text-white shadow hover:bg-red-600">
                    Report an Issue
                  </button>
                  <button className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-white shadow hover:bg-blue-700">
                    View All Transactions
                  </button>
                  <button className="flex w-full items-center justify-center gap-2 rounded-xl bg-green-500 px-4 py-3 text-white shadow hover:bg-green-600">
                    Download Certificate
                  </button>
                </div>
              </div>
            </section>

            <section className="space-y-6">
              <div className="rounded-2xl border border-emerald-100 bg-emerald-50/70 p-5 shadow-sm">
                <h2 className="mb-4 text-sm font-semibold text-emerald-700">
                  This Month's Status
                </h2>
                <div className="space-y-4 text-sm">
                  {(Array.isArray(currentEntitlement)
                    ? currentEntitlement
                    : []
                  ).map((item, index) => (
                    <div key={index}>
                      <div className="mb-2 flex items-center justify-between text-xs font-semibold text-slate-600">
                        <span>{item.commodity.commodity_name} Received</span>
                        <span className="text-emerald-700">
                          {item.quantity_entitled +
                            " (" +
                            item.commodity.unit +
                            ")" +
                            " / " +
                            item.quantity_remaining +
                            " (" +
                            item.commodity.unit +
                            ")"}
                          (
                          {((item.quantity_entitled - item.quantity_remaining) /
                            item.quantity_entitled) *
                            100 +
                            "%"}
                          )
                        </span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-amber-100">
                        <div
                          className={`h-2 w-[${
                            ((item.quantity_entitled -
                              item.quantity_remaining) /
                              item.quantity_entitled) *
                              100 +
                            "%"
                          }] rounded-full bg-amber-500`}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <h2 className="mb-4 text-sm font-semibold text-slate-700">
                  Recent Transactions
                </h2>
                <div className="space-y-4 text-sm">
                  {(Array.isArray(recentTransactions)
                    ? recentTransactions
                    : []
                  ).map((transaction, index) => (
                    <div
                      key={index}
                      className="rounded-xl border border-slate-100 bg-slate-50 p-4"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-slate-500">
                          {new Date(transaction?.dateTime).toLocaleDateString(
                            "en-US",
                            {
                              month: "long",
                              day: "numeric",
                              year: "numeric",
                            },
                          ) || "March 15, 2024"}
                        </span>
                        <span
                          className={`rounded-full  ${
                            transaction?.status.anomaly_type === "none"
                              ? "bg-emerald-100"
                              : "bg-amber-100"
                          } px-2 py-1 text-[11px] font-semibold text-emerald-700`}
                        >
                          {transaction?.status.anomaly_type === "none"
                            ? "Success"
                            : transaction?.status.anomaly_type}
                        </span>
                      </div>
                      <p className="mt-2 text-sm font-semibold text-slate-800">
                        {transaction?.shopDetails.name ||
                          "Fair Price Shop #123"}
                      </p>
                      <p className="text-xs text-slate-500 flex gap-2">
                        {transaction?.items.map((item, index) => (
                          <span key={index}>
                            {item.name +
                              ": " +
                              item.quantity_received +
                              item.unit +
                              ","}
                          </span>
                        ))}
                      </p>
                    </div>
                  ))}

                  <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-slate-500">
                        March 8, 2024
                      </span>
                      <span className="rounded-full bg-amber-100 px-2 py-1 text-[11px] font-semibold text-amber-700">
                        Partial
                      </span>
                    </div>
                    <p className="mt-2 text-sm font-semibold text-slate-800">
                      Fair Price Shop #123
                    </p>
                    <p className="text-xs text-slate-500">
                      Rice: 2 kg, Kerosene: 1 L
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <aside className="space-y-6">
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <h2 className="mb-4 text-sm font-semibold text-slate-700">
                  Account Information
                </h2>
                <div className="space-y-3 text-sm text-slate-600">
                  <div className="flex items-center justify-between">
                    <span>Ration Card Number:</span>
                    <span className="font-semibold text-slate-800">
                      {accountInfo?.ration_card_no || "BENE5749"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Family Members:</span>
                    <span className="font-semibold text-slate-800">
                      {accountInfo.family_size}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Card Type:</span>
                    <span className="font-semibold text-slate-800">BPL</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>District:</span>
                    <span className="font-semibold text-slate-800">
                      {accountInfo.district || "District Name"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Shop Assigned:</span>
                    <span className="font-semibold text-slate-800">
                      {accountInfo.distributionCenter?.center_name ||
                        "center_name"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Shop Address:</span>
                    <span className="font-semibold text-slate-800">
                      {accountInfo.distributionCenter?.address || "center_name"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-amber-100 bg-amber-50/70 p-5 shadow-sm">
                <h2 className="mb-4 text-sm font-semibold text-amber-700">
                  Announcements
                </h2>
                <div className="space-y-4 text-sm">
                  <div>
                    <p className="font-semibold text-slate-800">
                      New Distribution Schedule
                    </p>
                    <p className="text-xs text-slate-500">
                      April 2024 schedule is now available. Check your assigned
                      dates.
                    </p>
                    <p className="mt-2 text-[11px] font-semibold text-amber-700">
                      Posted: Mar 20, 2024
                    </p>
                  </div>
                  <hr className="border-amber-100" />
                  <div>
                    <p className="font-semibold text-slate-800">
                      Quality Standards Update
                    </p>
                    <p className="text-xs text-slate-500">
                      New quality parameters implemented for better grain
                      quality.
                    </p>
                    <p className="mt-2 text-[11px] font-semibold text-amber-700">
                      Posted: Mar 18, 2024
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-blue-100 bg-blue-50/70 p-5 shadow-sm">
                <h2 className="mb-4 text-sm font-semibold text-blue-700">
                  Help & Support
                </h2>
                <div className="space-y-3 text-sm text-slate-600">
                  <p className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-blue-500"></span>
                    Helpline: 1800-XXX-XXXX
                  </p>
                  <p className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-blue-500"></span>
                    Email Support
                  </p>
                  <p className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-blue-500"></span>
                    FAQ
                  </p>
                </div>
              </div>
            </aside>
          </div>
        </div>
      )}
    </div>
  ) : (
    <div className="flex flex-col h-screen items-center justify-center">
      <p className="text-red-500 text-lg font-semibold">{error}</p>
      <a className="text-blue-800 underline" href="/beneficiary/login">
        Login again!
      </a>
    </div>
  );
};

export default BeneficiaryDashboard;
