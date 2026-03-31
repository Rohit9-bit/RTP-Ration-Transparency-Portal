import React, { useEffect, useState } from "react";
import {
  FiActivity,
  FiAward,
  FiAlertTriangle,
  FiBarChart2,
  FiBriefcase,
  FiCheckCircle,
  FiClock,
  FiDownload,
  FiExternalLink,
  FiFileText,
  FiMapPin,
  FiMonitor,
  FiSearch,
  FiShield,
  FiSmartphone,
  FiUsers,
} from "react-icons/fi";
import { GiWheat } from "react-icons/gi";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import axiosInstance from "../../utils/axiosInstance";

const districtComparison = [
  { region: "North Zone", efficiency: 97.9, color: "bg-emerald-500" },
  { region: "South Zone", efficiency: 94.2, color: "bg-blue-500" },
  { region: "East Zone", efficiency: 90.8, color: "bg-violet-500" },
  { region: "West Zone", efficiency: 88.4, color: "bg-amber-500" },
];

const advancedStats = [
  {
    title: "Monthly Distribution Volume",
    value: "1.28M kg",
    note: "+3.2% from previous month",
    tone: "text-emerald-600",
  },
  {
    title: "Wheat Inventory",
    value: "895K kg",
    note: "Current stock across centers",
    tone: "text-blue-600",
  },
  {
    title: "Rice Inventory",
    value: "245K kg",
    note: "Current stock across centers",
    tone: "text-violet-600",
  },
  {
    title: "Kerosene Allocation",
    value: "168 KL",
    note: "Expected monthly allocation",
    tone: "text-amber-600",
  },
];

const alerts = [
  {
    title: "High inventory variance detected",
    detail:
      "Center #093 reports stock variance above threshold in wheat ledger.",
    level: "High Priority",
    tone: "border-rose-200 bg-rose-50 text-rose-700",
    icon: FiAlertTriangle,
  },
  {
    title: "Scheduled maintenance due",
    detail: "Biometric device update pending for 6 centers before cycle close.",
    level: "Medium",
    tone: "border-amber-200 bg-amber-50 text-amber-700",
    icon: FiClock,
  },
  {
    title: "Audit cycle initiated",
    detail: "Regional monthly audit has started for Central and East zones.",
    level: "Info",
    tone: "border-blue-200 bg-blue-50 text-blue-700",
    icon: FiCheckCircle,
  },
];

const efficiencyTrendData = [
  { month: "Jan", efficiency: 86.4 },
  { month: "Feb", efficiency: 88.1 },
  { month: "Mar", efficiency: 89.7 },
  { month: "Apr", efficiency: 91.2 },
  { month: "May", efficiency: 93.8 },
  { month: "Jun", efficiency: 95.1 },
];

const performanceDistributionData = [
  { name: "Excellent (90%+)", value: 25, color: "#10b981" },
  { name: "Very Good (80%+)", value: 25, color: "#3b82f6" },
  { name: "Good (70%+)", value: 25, color: "#8a088a" },
  { name: "Average (60%+)", value: 25, color: "#f59e0b" },
];

const advancedTrendData = [
  { period: "W1", wheat: 32, rice: 24, sugar: 12 },
  { period: "W2", wheat: 35, rice: 25, sugar: 13 },
  { period: "W3", wheat: 37, rice: 27, sugar: 14 },
  { period: "W4", wheat: 39, rice: 29, sugar: 15 },
  { period: "W5", wheat: 41, rice: 31, sugar: 16 },
  { period: "W6", wheat: 44, rice: 33, sugar: 17 },
];

const commodityBreakdownData = [
  { name: "Wheat", value: 38, color: "#2563eb" },
  { name: "Rice", value: 30, color: "#10b981" },
  { name: "Sugar", value: 18, color: "#f59e0b" },
  { name: "Kerosene", value: 14, color: "#a855f7" },
];

const PublicDashboard = () => {
  const [systemPerformanceMatrics, setSystemPerformanceMetrics] = useState({});
  const [regionalPerformance, setRegionalPerformance] = useState([]);
  const [topPerfromingCenter, setTopPeformingCenter] = useState([]);

  function setData(data) {
    setSystemPerformanceMetrics({
      total_ration_distributed: data[0].total_ration_distributed,
      total_active_distribution_centers:
        data[0].total_active_distribution_centers,
      total_grievances_filled: data[0].total_grievances_filled,
      total_beneficiary_registered: data[0].total_beneficiary_registered,
    });
    setRegionalPerformance(data[0].district_efficiency);
    setTopPeformingCenter(data[0].top_performing_distribution_centers);
  }

  useEffect(() => {
    try {
      axiosInstance
        .get("/public/dashboard")
        .then((response) => {
          console.log("Public Dashboard Data:", response.data.data);
          setData(response.data.data);
        })
        .catch((error) => {
          console.error("Error fetching public dashboard data:", error);
        });
    } catch (error) {
      console.error("Unexpected error in public dashboard data fetch:", error);
    }
  }, []);

  const metricCards = [
    {
      title: "Total Beneficiaries",
      value: systemPerformanceMatrics.total_beneficiary_registered || "2.4M",
      growth: {
        text: "5% new registrations",
        tone: "text-emerald-600",
        icon: "↑",
      },
      icon: FiUsers,
      accent: "bg-blue-100 text-blue-600",
      badge: "Registered",
    },
    {
      title: "Total Distribution Center",
      value:
        systemPerformanceMatrics.total_active_distribution_centers || "1,247",
      growth: {
        text: "98.2% operational",
        tone: "text-emerald-600",
        icon: "●",
      },
      icon: FiMapPin,
      accent: "bg-emerald-100 text-emerald-600",
      badge: "Active",
    },
    {
      title: "Total Rations Distributed",
      value: systemPerformanceMatrics.total_ration_distributed || "143",
      growth: {
        text: "12% vs last month",
        tone: "text-emerald-600",
        icon: "↑",
      },
      icon: FiBarChart2,
      accent: "bg-amber-100 text-amber-600",
      badge: "This Month",
    },
    {
      title: "Total Grievances Resolved",
      value: systemPerformanceMatrics.total_grievances_filled || "847K",
      growth: { text: "8% vs last month", tone: "text-amber-600", icon: "↓" },
      icon: FiActivity,
      accent: "bg-violet-100 text-violet-600",
      badge: "Last 30 Days",
    },
  ];

  const centers = [
    {
      centerId: topPerfromingCenter[0]?.center_name || "RTC-001",
      location: topPerfromingCenter[0]?.address || "Rajouri Garden, Delhi",
      efficiency: topPerfromingCenter[0]?.efficiency || "98.7",
      familiesServed: topPerfromingCenter[0]?.numberOfFamilyServed || "1,247",
    },
    {
      centerId: topPerfromingCenter[1]?.center_name || "RTC-045",
      location: topPerfromingCenter[1]?.address || "Koramangala, Bangalore",
      efficiency: topPerfromingCenter[1]?.efficiency || "96.3",
      familiesServed: topPerfromingCenter[1]?.numberOfFamilyServed || "892",
    },
    {
      centerId: topPerfromingCenter[2]?.center_name || "RTC-123",
      location: topPerfromingCenter[2]?.address || "Andheri West, Mumbai",
      efficiency: topPerfromingCenter[2]?.efficiency || "94.1",
      familiesServed: topPerfromingCenter[2]?.numberOfFamilyServed || "1,563",
    },
    {
      centerId: topPerfromingCenter[3]?.center_name || "RTC-067",
      location: topPerfromingCenter[3]?.address || "Salt Lake, Kolkata",
      efficiency: topPerfromingCenter[3]?.efficiency || "0",
      familiesServed: topPerfromingCenter[3]?.numberOfFamilyServed || "0",
    },
  ];

  function status(eff) {
    const efficiency = Number(eff);
    if (efficiency > 90) {
      return {
        status: "Excellent",
        tone: "border-emerald-200 bg-emerald-50/70",
        iconTone: "bg-emerald-600 text-white",
        badgeTone: "bg-emerald-600 text-white",
        actionTone: "text-emerald-700 hover:text-emerald-900",
        updatedAt: "2 hours ago",
      };
    } else if (efficiency > 80) {
      return {
        status: "Very Good",
        tone: "border-blue-200 bg-blue-50/70",
        iconTone: "bg-blue-700 text-white",
        badgeTone: "bg-blue-700 text-white",
        actionTone: "text-blue-700 hover:text-blue-900",
        updatedAt: "1 hour ago",
      };
    } else if (efficiency > 70) {
      return {
        status: "Good",
        tone: "border-violet-200 bg-violet-50/70",
        iconTone: "bg-violet-600 text-white",
        badgeTone: "bg-violet-600 text-white",
        actionTone: "text-violet-700 hover:text-violet-900",
        updatedAt: "3 hours ago",
      };
    } else if (efficiency > 60) {
      return {
        status: "Needs Attention",
        tone: "border-amber-200 bg-amber-50/70",
        iconTone: "bg-amber-600 text-white",
        badgeTone: "bg-amber-600 text-white",
        actionTone: "text-amber-700 hover:text-amber-900",
        updatedAt: "5 hours ago",
      };
    } else {
      return {
        status: "Needs Attention",
        tone: "border-amber-200 bg-amber-50/70",
        iconTone: "bg-amber-600 text-white",
        badgeTone: "bg-amber-600 text-white",
        actionTone: "text-amber-700 hover:text-amber-900",
        updatedAt: "5 hours ago",
      };
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
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
            <select className="rounded-full border border-slate-200 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
              <option value="Eng">Eng</option>
              <option value="Eng">Hin</option>
            </select>

            <button className="rounded-md px-3 py-1 bg-blue-600 text-sm font-semibold text-white cursor-pointer">
              Beneficiary Login
            </button>
          </div>
        </div>
      </header>

      <section className="bg-blue-900 text-white">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-4 py-10 sm:px-6 lg:px-8">
          <p className="text-xs uppercase tracking-wider text-blue-200">
            Public Dashboard
          </p>
          <h1 className="max-w-3xl text-3xl font-bold leading-tight sm:text-4xl">
            Transparent Ration Distribution System
          </h1>
          <p className="max-w-3xl text-sm text-blue-100">
            Monitor delivery, stock movement, and service coverage in near real
            time with district-level transparency metrics.
          </p>
          <div className="flex flex-wrap gap-3">
            <button className="rounded-md bg-white px-4 py-2 text-sm font-semibold text-blue-800 hover:bg-blue-50">
              Search Distribution Centers
            </button>
            <button className="rounded-md border border-blue-300 px-4 py-2 text-sm font-medium text-white hover:bg-blue-800">
              View Insights
            </button>
          </div>
        </div>
      </section>

      <main className="mx-auto w-full max-w-6xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="mb-8 text-center pt-8">
            <h2 className="text-xl font-semibold text-slate-900">
              Explore Distribution Data
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Search by city, PDS center, or beneficiary card number for public
              records
            </p>
          </div>

          <div className="mx-auto flex max-w-2xl items-center gap-2">
            <div className="flex flex-1 items-center rounded-md border border-slate-300 bg-white px-3">
              <FiSearch className="mr-2 text-slate-400" />
              <input
                type="text"
                placeholder="Search by city, district, or center name..."
                className="w-full bg-transparent py-2.5 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none"
              />
            </div>
            <button className="rounded-md bg-blue-700 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-800">
              Search
            </button>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <article className="rounded-lg border border-blue-100 bg-blue-50 p-4">
              <p className="text-sm font-semibold text-blue-800">
                View All Shops
              </p>
              <p className="mt-1 text-xs text-blue-700/80">
                Explore district-wise distribution centers and activity.
              </p>
              <button className="mt-3 text-xs font-semibold text-blue-700 hover:text-blue-900">
                Explore Centers
              </button>
            </article>
            <article className="rounded-lg border border-emerald-100 bg-emerald-50 p-4">
              <p className="text-sm font-semibold text-emerald-800">
                Check Performance
              </p>
              <p className="mt-1 text-xs text-emerald-700/80">
                Review distribution efficiency and monthly service score.
              </p>
              <button className="mt-3 text-xs font-semibold text-emerald-700 hover:text-emerald-900">
                View Centers
              </button>
            </article>
            <article className="rounded-lg border border-violet-100 bg-violet-50 p-4">
              <p className="text-sm font-semibold text-violet-800">
                Download Public Data
              </p>
              <p className="mt-1 text-xs text-violet-700/80">
                Access comprehensive analytics and report exports.
              </p>
              <button className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-violet-700 hover:text-violet-900">
                <FiDownload />
                Download CSV
              </button>
            </article>
          </div>
        </section>

        <section>
          <div className="mb-5 text-center pt-8">
            <h2 className="text-xl font-semibold text-slate-900">
              System Performance Metrics
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Real-time data on distribution system performance and beneficiary
              service
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {metricCards.map((metric, index) => {
              const Icon = metric.icon;

              return (
                <article
                  key={metric.title}
                  className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
                >
                  <div className="mb-4 flex items-center justify-between">
                    <span className={`rounded-md p-3 ${metric.accent}`}>
                      <Icon className="text-sm" />
                    </span>
                    <span className="rounded bg-slate-100 px-2.5 py-1 text-[11px] font-medium text-slate-500">
                      {metric.badge}
                    </span>
                  </div>
                  <p className="text-2xl font-bold text-slate-900">
                    {metric.value}
                  </p>
                  <p className="mt-1 text-sm text-slate-600">{metric.title}</p>
                  <p
                    className={`mt-2 inline-flex items-center gap-1 text-xs font-semibold ${metric.growth.tone}`}
                  >
                    <span>{metric.growth.icon}</span>
                    {metric.growth.text}
                  </p>
                </article>
              );
            })}
          </div>

          <div className="mt-6 grid gap-4 lg:grid-cols-3">
            <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm lg:col-span-2">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-slate-900">
                  Distribution Efficiency Trend
                </h3>
                <select className="rounded-md border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-700">
                  <option value={6}>Last 6 Months</option>
                  <option value={3}>Last 3 Months</option>
                </select>
              </div>
              <div className="relative h-56 rounded-md bg-white p-2">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={efficiencyTrendData}
                    margin={{ top: 12, right: 20, left: 10, bottom: 20 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis
                      dataKey="month"
                      tick={{ fontSize: 12 }}
                      stroke="#94a3b8"
                    />
                    <YAxis
                      domain={[85, 100]}
                      tick={{ fontSize: 12 }}
                      stroke="#94a3b8"
                    />
                    <Tooltip
                      formatter={(value) => [`${value}%`, "Efficiency"]}
                    />
                    <Line
                      type="monotone"
                      dataKey="efficiency"
                      name="Distribution Efficiency"
                      stroke="#1d4ed8"
                      strokeWidth={2}
                      dot={{ r: 3, fill: "#1d4ed8" }}
                      activeDot={{ r: 5 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </article>

            <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-slate-900">
                  Regional Performance
                </h3>
                <button className="text-sm font-semibold text-blue-700 hover:text-blue-900">
                  View All Regions
                </button>
              </div>
              <div className="space-y-3">
                {[
                  {
                    label:
                      regionalPerformance[0]?.district || "Northern Region",
                    centers:
                      regionalPerformance[0]?.centers + " centers" ||
                      "156 centers",
                    value: regionalPerformance[0]?.efficiency + "%" || "97.8%",
                    tone: "bg-emerald-500",
                  },
                  {
                    label:
                      regionalPerformance[1]?.district || "Southern Region",
                    centers:
                      regionalPerformance[1]?.centers + " centers" ||
                      "203 centers",
                    value: regionalPerformance[1]?.efficiency + "%" || "95.4%",
                    tone: "bg-blue-500",
                  },
                  {
                    label: regionalPerformance[2]?.district || "Eastern Region",
                    centers:
                      regionalPerformance[2]?.centers + " centers" ||
                      "189 centers",
                    value: regionalPerformance[2]?.efficiency + "%" || "92.1%",
                    tone: "bg-amber-500",
                  },
                ].map((item) => (
                  <div key={item.label} className="rounded-md bg-slate-50 p-3">
                    <div className="flex items-center justify-between">
                      <div className="inline-flex items-center gap-2">
                        <span
                          className={`h-2.5 w-2.5 rounded-full ${item.tone}`}
                        />
                        <div>
                          <p className="text-sm font-semibold text-slate-900">
                            {item.label}
                          </p>
                          <p className="text-xs text-slate-500">
                            {item.centers}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-semibold text-slate-900">
                          {item.value}
                        </p>
                        <p className="text-xs text-slate-500">Efficiency</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </article>
          </div>
        </section>

        <section>
          <div className="mb-8 text-center pt-8">
            <h2 className="text-xl font-semibold text-slate-900">
              Top Performing Distribution Centers
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Highlighting centers with exceptional service delivery and
              efficiency
            </p>
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            <div className="grid gap-4 sm:grid-cols-2 lg:col-span-2">
              {centers.map((center) => {
                const result = status(center.efficiency);
                return (
                  <article
                    key={center.centerId}
                    className={`rounded-xl border p-5 shadow-sm ${result.tone}`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <span
                          className={`mt-0.5 inline-flex h-8 w-8 items-center justify-center rounded-md ${result.iconTone}`}
                        >
                          <FiBriefcase className="text-sm" />
                        </span>
                        <div>
                          <p className="text-sm font-semibold text-slate-900">
                            Center ID: {center.centerId}
                          </p>
                          <p className="text-xs text-slate-600">
                            {center.location}
                          </p>
                        </div>
                      </div>
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-semibold whitespace-nowrap ${result.badgeTone}`}
                      >
                        {result.status}
                      </span>
                    </div>

                    <div className="mt-5 grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xl font-bold leading-none text-slate-900">
                          {center.efficiency + "%"}
                        </p>
                        <p className="mt-1 text-xs text-slate-600">
                          Efficiency Rate
                        </p>
                      </div>
                      <div>
                        <p className="text-xl font-bold leading-none text-slate-900">
                          {center.familiesServed}
                        </p>
                        <p className="mt-1 text-xs text-slate-600">
                          Families Served
                        </p>
                      </div>
                    </div>

                    <div className="mt-5 flex items-center justify-between text-xs">
                      <p className="text-slate-600">
                        Last Updated: {result.updatedAt}
                      </p>
                      <button
                        className={`text-xs font-semibold ${result.actionTone}`}
                      >
                        View Details
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>

            <article className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm flex flex-col justify-between items-center">
              <h3 className="mb-4 text-sm font-semibold text-slate-900">
                Performance Distribution
              </h3>
              <div className="relative mx-auto h-40 w-40">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={performanceDistributionData}
                      dataKey="value"
                      nameKey="name"
                      innerRadius={48}
                      outerRadius={68}
                      stroke="none"
                    >
                      {performanceDistributionData.map((entry) => (
                        <Cell key={entry.name} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                  {/* <span className="text-2xl font-bold text-slate-800">
                    100%
                  </span> */}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-5 mt-4 space-y-2 text-xs text-slate-600">
                {performanceDistributionData.map((item) => (
                  <p key={item.name} className="flex items-center">
                    <span className="inline-flex items-center gap-2">
                      <span
                        className="h-2.5 w-2.5 rounded-full"
                        style={{ backgroundColor: item.color }}
                      />
                      {item.name}
                    </span>
                    {/* <span>{item.value}%</span> */}
                  </p>
                ))}
              </div>
            </article>
          </div>
        </section>

        <section className="">
          <div className="text-center pt-8 mb-8">
            <h2 className="text-xl font-semibold text-slate-900">
              District Performance Comparison
            </h2>
            <p className="text-sm text-slate-500">
              Compare distribution efficiency across all zones and geographic
              regions
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: "Top Performer",
                subtitle: "Delhi NCR Region",
                value: "97.2%",
                detail:
                  "Distribution efficiency with 156 active centers serving 234K families",
                icon: FiAward,
                iconTone: "bg-emerald-100 text-emerald-700",
              },
              {
                title: "Highest Growth",
                subtitle: "Bangalore Urban",
                value: "+8.3%",
                detail: "Improvement in efficiency over the last quarter",
                icon: FiBarChart2,
                iconTone: "bg-blue-100 text-blue-700",
              },
              {
                title: "Needs Focus",
                subtitle: "Eastern Region",
                value: "87.4%",
                detail:
                  "Below average performance requiring immediate attention",
                icon: FiAlertTriangle,
                iconTone: "bg-amber-100 text-amber-700",
              },
            ].map((card) => {
              const CardIcon = card.icon;

              return (
                <article
                  key={card.title}
                  className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
                >
                  <div className="flex items-start gap-3">
                    <span
                      className={`inline-flex h-10 w-10 items-center justify-center rounded-md ${card.iconTone}`}
                    >
                      <CardIcon className="text-base" />
                    </span>
                    <div>
                      <p className="text-sm font-semibold leading-tight text-slate-900">
                        {card.title}
                      </p>
                      <p className="mt-0.5 text-xs text-slate-500">
                        {card.subtitle}
                      </p>
                    </div>
                  </div>

                  <p className="mt-4 text-xl font-bold leading-none text-slate-900">
                    {card.value}
                  </p>
                  <p className="mt-2 text-xs leading-5 text-slate-600">
                    {card.detail}
                  </p>
                </article>
              );
            })}
          </div>
        </section>

        <section className="rounded-xl bg-blue-800 px-5 py-6 text-white sm:px-6">
          <div className="grid gap-4 lg:grid-cols-3 lg:items-center">
            <div className="lg:col-span-2">
              <p className="text-xs uppercase tracking-wide text-blue-200">
                Beneficiary Portal Access
              </p>
              <h3 className="mt-1 text-xl font-semibold">
                Secure login for registered beneficiaries to track quota and
                grievance status
              </h3>
              <ul className="mt-3 space-y-1 text-sm text-blue-100">
                <li>• View current month distribution history</li>
                <li>• Access grievance submission and tracking</li>
                <li>• Check transaction receipts and quota balance</li>
              </ul>
              <div className="mt-4 flex flex-wrap gap-2">
                <button className="rounded-md bg-white px-4 py-2 text-sm font-semibold text-blue-800 hover:bg-blue-100">
                  Beneficiary Login
                </button>
                <button className="rounded-md border border-blue-300 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
                  Read Policy
                </button>
              </div>
            </div>

            <article className="rounded-lg border border-blue-500 bg-blue-700/60 p-4 text-center">
              <FiSmartphone className="mx-auto mb-2 text-2xl" />
              <p className="text-sm font-semibold">Quick Mobile Access</p>
              <p className="mt-1 text-xs text-blue-100">
                Optimized for lightweight mobile-friendly beneficiary
                experience.
              </p>
            </article>
          </div>
        </section>

        <section className="">
          <div className="text-center mb-8 pt-8">
            <h2 className="text-xl font-semibold text-slate-900">
              Advanced Analytics Dashboard
            </h2>
            <p className="text-sm text-slate-500">
              Comprehensive monthly and daily analytics for data-driven
              monitoring
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
              <h3 className="text-sm font-semibold text-slate-900">
                Distribution Trends
              </h3>
              <div className="inline-flex rounded-md border border-slate-200 bg-slate-50 p-1 text-xs">
                <button className="rounded-sm bg-white px-2.5 py-1 font-medium text-blue-700 shadow-sm">
                  Daily
                </button>
                <button className="rounded-sm px-2.5 py-1 text-slate-500">
                  Weekly
                </button>
                <button className="rounded-sm px-2.5 py-1 text-slate-500">
                  Monthly
                </button>
              </div>
            </div>

            <div className="grid gap-4 lg:grid-cols-3">
              <article className="rounded-md bg-slate-50 p-4 lg:col-span-2">
                <div className="h-44 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={advancedTrendData}
                      margin={{ top: 8, right: 10, left: 0, bottom: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis
                        dataKey="period"
                        tick={{ fontSize: 11 }}
                        stroke="#94a3b8"
                      />
                      <YAxis tick={{ fontSize: 11 }} stroke="#94a3b8" />
                      <Tooltip />
                      <Area
                        type="monotone"
                        dataKey="wheat"
                        stackId="1"
                        stroke="#10b981"
                        fill="#10b98199"
                      />
                      <Area
                        type="monotone"
                        dataKey="rice"
                        stackId="1"
                        stroke="#3b82f6"
                        fill="#3b82f699"
                      />
                      <Area
                        type="monotone"
                        dataKey="sugar"
                        stackId="1"
                        stroke="#f59e0b"
                        fill="#f59e0b99"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </article>

              <article className="rounded-md bg-slate-50 p-4">
                <h4 className="mb-2 text-xs font-semibold text-slate-700">
                  Commodity Breakdown
                </h4>
                <div className="mx-auto h-36 w-36">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={commodityBreakdownData}
                        dataKey="value"
                        nameKey="name"
                        innerRadius={34}
                        outerRadius={60}
                        stroke="none"
                      >
                        {commodityBreakdownData.map((entry) => (
                          <Cell key={entry.name} fill={entry.color} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-3 grid grid-cols-2 gap-2 text-[11px] text-slate-600">
                  {commodityBreakdownData.map((item) => (
                    <p
                      key={item.name}
                      className="inline-flex items-center gap-1"
                    >
                      <span
                        className="h-2 w-2 rounded-full"
                        style={{ backgroundColor: item.color }}
                      />
                      {item.name}
                    </p>
                  ))}
                </div>
              </article>
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {advancedStats.map((stat, index) => (
                <article
                  key={stat.title}
                  className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-slate-900">
                      {stat.title}
                    </p>
                    <span
                      className="text-xs"
                      style={{
                        color: ["#16a34a", "#ea580c", "#2563eb", "#7c3aed"][
                          index
                        ],
                      }}
                    >
                      ●
                    </span>
                  </div>
                  <p className="mt-2 text-xl font-bold text-slate-900">
                    {stat.value}
                  </p>
                  <p className="mt-1 text-sm text-slate-500">This month</p>
                  <p className={`mt-2 text-xs font-medium ${stat.tone}`}>
                    {stat.note}
                  </p>
                </article>
              ))}
            </div>

            <article className="mt-4 rounded-md border border-slate-200 bg-white p-4">
              <div className="mb-3 flex items-center justify-between">
                <h4 className="text-lg font-semibold text-slate-900">
                  Anomaly Detection & Alerts
                </h4>
                <button className="rounded-md border border-rose-200 bg-rose-50 px-2.5 py-1 text-xs font-semibold text-rose-700">
                  3 Active Alerts
                </button>
              </div>

              <div className="space-y-2">
                {alerts.map((alertItem) => {
                  const AlertIcon = alertItem.icon;

                  return (
                    <div
                      key={alertItem.title}
                      className={`flex items-start justify-between rounded-md border px-3 py-2 ${alertItem.tone}`}
                    >
                      <div className="flex items-start gap-2">
                        <AlertIcon className="mt-0.5 text-lg" />
                        <div>
                          <p className="text-sm font-semibold">
                            {alertItem.title}
                          </p>
                          <p className="text-xs opacity-80">
                            {alertItem.detail}
                          </p>
                        </div>
                      </div>
                      <span className="text-xs font-semibold">
                        {alertItem.level}
                      </span>
                    </div>
                  );
                })}
              </div>
            </article>
          </div>
        </section>
      </main>

      <section className="mx-auto w-full max-w-6xl space-y-5 px-4 pb-8 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-lg font-semibold text-slate-900">
            Data Transparency & Accountability
          </h2>
          <p className="text-xs text-slate-500">
            Open access to aggregated data ensuring transparency in the public
            distribution system
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <article className="rounded-lg border border-blue-100 bg-blue-50 p-5">
            <div className="mb-3 inline-flex h-8 w-8 items-center justify-center rounded-md bg-blue-600 text-white">
              <FiFileText className="text-sm" />
            </div>
            <h3 className="text-sm font-semibold text-blue-900">
              Open Data Initiative
            </h3>
            <p className="mt-1 text-xs text-blue-800/80">
              Download anonymized datasets and monthly distribution reports for
              research and public review.
            </p>
            <div className="mt-4 grid grid-cols-2 gap-2 text-[11px] text-blue-700">
              <button className="rounded-md border border-blue-200 bg-white px-2 py-1 text-left hover:bg-blue-100">
                Distribution Summary
              </button>
              <button className="rounded-md border border-blue-200 bg-white px-2 py-1 text-left hover:bg-blue-100">
                Beneficiary Statistics
              </button>
              <button className="rounded-md border border-blue-200 bg-white px-2 py-1 text-left hover:bg-blue-100">
                Monthly Reports
              </button>
              <button className="rounded-md border border-blue-200 bg-white px-2 py-1 text-left hover:bg-blue-100">
                Audit Summaries
              </button>
            </div>
            <button className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-blue-700 hover:text-blue-900">
              View data repository
              <FiExternalLink />
            </button>
          </article>

          <article className="rounded-lg border border-emerald-100 bg-emerald-50 p-5">
            <div className="mb-3 inline-flex h-8 w-8 items-center justify-center rounded-md bg-emerald-600 text-white">
              <FiShield className="text-sm" />
            </div>
            <h3 className="text-sm font-semibold text-emerald-900">
              Privacy Protection
            </h3>
            <p className="mt-1 text-xs text-emerald-800/80">
              Personal and sensitive beneficiary information is protected
              through strict privacy controls.
            </p>
            <ul className="mt-4 space-y-1.5 text-[11px] text-emerald-800">
              <li className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
                Anonymized personal records
              </li>
              <li className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
                GDPR-compliant data handling
              </li>
              <li className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
                Secure monthly backups
              </li>
              <li className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
                Role-based access controls
              </li>
            </ul>
          </article>
        </div>

        <article className="rounded-lg border border-slate-200 bg-white px-4 py-5 shadow-sm sm:px-6">
          <h3 className="text-center text-sm font-semibold text-slate-900">
            Real-time System Statistics
          </h3>
          <p className="mt-1 text-center text-xs text-slate-500">
            Live updates on key public performance and accountability metrics
          </p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-md bg-slate-50 py-3 text-center">
              <p className="text-lg font-bold text-blue-700">99.7%</p>
              <p className="text-[11px] text-slate-500">System Uptime</p>
            </div>
            <div className="rounded-md bg-slate-50 py-3 text-center">
              <p className="text-lg font-bold text-emerald-700">2.4M</p>
              <p className="text-[11px] text-slate-500">Transactions Today</p>
            </div>
            <div className="rounded-md bg-slate-50 py-3 text-center">
              <p className="text-lg font-bold text-rose-700">847K</p>
              <p className="text-[11px] text-slate-500">Active Users</p>
            </div>
            <div className="rounded-md bg-slate-50 py-3 text-center">
              <p className="text-lg font-bold text-violet-700">1,247</p>
              <p className="text-[11px] text-slate-500">Distribution Centers</p>
            </div>
          </div>
        </article>
      </section>

      <footer className="bg-slate-950 text-slate-200">
        <div className="mx-auto grid w-full max-w-7xl gap-8 px-4 py-8 sm:px-6 md:grid-cols-2 lg:grid-cols-4 lg:px-8">
          <div>
            <p className="text-sm font-semibold text-white">
              Ration Transparency Portal
            </p>
            <p className="mt-2 text-xs text-slate-400">
              Empowering citizens with transparent access to public food
              distribution information.
            </p>
            <div className="mt-3 inline-flex items-center gap-1 text-xs text-slate-400">
              <FiMonitor />
              Public Dashboard
            </div>
          </div>

          <div>
            <p className="text-sm font-semibold text-white">Quick Links</p>
            <ul className="mt-2 space-y-1 text-xs text-slate-400">
              <li>Public Dashboard</li>
              <li>Center Directory</li>
              <li>Monthly Reports</li>
              <li>Data Access</li>
              <li>Open APIs</li>
            </ul>
          </div>

          <div>
            <p className="text-sm font-semibold text-white">Support</p>
            <ul className="mt-2 space-y-1 text-xs text-slate-400">
              <li>Help Center</li>
              <li>Contact Us</li>
              <li>Privacy Policy</li>
              <li>Terms of Service</li>
            </ul>
          </div>

          <div>
            <p className="text-sm font-semibold text-white">
              Contact Information
            </p>
            <ul className="mt-2 space-y-1 text-xs text-slate-400">
              <li>1800-000-0000</li>
              <li>support@ration.gov.in</li>
              <li>Ministry of Consumer Affairs, Food & Public Distribution</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800">
          <div className="mx-auto flex w-full max-w-7xl flex-wrap items-center justify-between gap-2 px-4 py-3 text-[11px] text-slate-400 sm:px-6 lg:px-8">
            <p>© 2026 Government of India. All rights reserved.</p>
            <div className="flex items-center gap-3">
              <span>Accessibility</span>
              <span>Coverage</span>
              <span>Policies</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PublicDashboard;
