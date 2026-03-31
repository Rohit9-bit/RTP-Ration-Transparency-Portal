import React, { useEffect, useState } from "react";
import { MdError, MdPhone, MdMessage, MdInfo } from "react-icons/md";
import { GiWheat } from "react-icons/gi";
import { useNavigate } from "react-router";
import axiosInstance from "../../utils/axiosInstance";
import useLogoutHook from "../../hooks/handleLogOutHook.js";

const BeneficiaryGrievance = () => {
  const [formData, setFormData] = useState({
    issueType: "",
    relatedTransaction: "",
    commodity: "",
    expectedQuantity: "",
    actualReceived: "",
    description: "",
    priorityLevel: "Medium",
  });

  // Logout Hook
  const Logout = useLogoutHook();

  console.log("Current form data:", formData);

  const handleSubmit = async (e) => {
    e.preventDefault(); // prevent reload on form submit
    console.log("Submitting grievance with data:", formData);
    try {
      await axiosInstance.post(
        "/grievance/submit",
        {
          issue_type: formData.issueType,
          description: formData.description,
          quantity_discrepancy_details: {
            commodityId: formData.commodity,
            expected_quantity: formData.expectedQuantity,
            actual_quantity: formData.actualReceived,
          },
        },
        {
          withCredentials: true,
          params: { priority: formData.priorityLevel },
        },
      );
      console.log("Grievance submitted successfully!");
    } catch (error) {
      console.log("Error submitting grievance:", error);
    }
  };

  // Recent Reports
  // useEffect(() => {
  //   try {
  //     axiosInstance
  //       .get("/grievance/history", { withCredentials: true })
  //       .then((response) => {
  //         console.log("Grievance history fetched successfully:", response.data);
  //       })
  //       .catch((error) => {
  //         console.log("Error fetching grievance history:", error);
  //       });
  //   } catch (error) {
  //     console.log("Error in grievance history useEffect:", error);
  //   }
  // }, []);

  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // const handleSaveDraft = () => {
  //   console.log("Draft saved:", formData);
  //   // Add save draft logic here
  // };

  function handleNavClick(section) {
    switch (section) {
      case "MyRation":
        navigate("/beneficiary/dashboard");
        break;
      case "TransactionHistory":
        navigate("/beneficiary/transaction-history");
        break;
      default:
        break;
    }
  }

  const recentReports = [
    { id: "Ticket #07-2024-..", status: "Resolved", date: "Dec 16, 2026" },
    { id: "Ticket #07-2024-..", status: "Pending", date: "Dec 11, 2026" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Bar */}
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
              onClick={Logout}
              className="text-sm font-semibold text-red-500 cursor-pointer"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto py-6">
        {/*navigation Tabs */}
        <nav className="mb-6 flex flex-wrap items-center gap-4 text-sm font-semibold">
          <button
            onClick={() => {
              handleNavClick("MyRation");
            }}
            className="rounded-full px-4 py-2 text-slate-500 hover:text-slate-700"
          >
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
          <button className="rounded-full bg-blue-50 px-4 py-2 text-blue-700 shadow-sm">
            Report Issue
          </button>
          <button className="rounded-full px-4 py-2 text-slate-500 hover:text-slate-700">
            Settings
          </button>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Form Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-6 md:p-8">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                Report an Issue
              </h1>
              <p className="text-blue-600 text-sm mb-6">
                Help us improve the ration distribution system by reporting any
                issues you encounter
              </p>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Issue Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Issue Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="issueType"
                    value={formData.issueType}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="">Select the type of issue</option>
                    <option value="quantity">Quantity Discrepancy</option>
                    <option value="quality">Quality Issue</option>
                    <option value="timing">Timing Issue</option>
                    <option value="staff">Staff Behavior</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                {/* Related Transaction */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Related Transaction (Optional)
                  </label>
                  <select
                    name="relatedTransaction"
                    value={formData.relatedTransaction}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select a recent transaction</option>
                    <option value="trans1">Transaction #001 - Jan 2026</option>
                    <option value="trans2">Transaction #002 - Feb 2026</option>
                  </select>
                </div>

                {/* Quantity Discrepancy Details */}
                {formData.issueType === "quantity" && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900 mb-4">
                      Quantity Discrepancy Details
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Commodity
                        </label>
                        <select
                          name="commodity"
                          value={formData.commodity}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="">Select</option>
                          <option value="COMM36476">Rice</option>
                          <option value="COMM35473">Wheat</option>
                          <option value="COMM46532">Sugar</option>
                          <option value="COMM43874">Mustard Oil</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Expected Quantity
                        </label>
                        <input
                          type="text"
                          name="expectedQuantity"
                          value={formData.expectedQuantity}
                          onChange={handleInputChange}
                          placeholder="e.g., 5 kg"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Actual Received
                        </label>
                        <input
                          type="text"
                          name="actualReceived"
                          value={formData.actualReceived}
                          onChange={handleInputChange}
                          placeholder="e.g., 2.5 kg"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                    <div className="mt-3 flex items-start space-x-2 text-sm text-yellow-800">
                      <MdError className="w-4 h-4 mt-0.5 shrink-0" />
                      <span>
                        Transaction: This was rice received from entitled amount
                      </span>
                    </div>
                  </div>
                )}

                {/* Detailed Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Detailed Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows="6"
                    placeholder="Please provide a detailed description of the issue. Include dates, times, and any relevant context that will help us investigate and resolve the problem."
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    required
                    minLength={50}
                    maxLength={10000}
                  ></textarea>
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>Minimum 50 characters required</span>
                    <span>{formData.description.length}/10000 characters</span>
                  </div>
                </div>

                {/* Receiving Evidence Checkbox */}
                {/* <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="receivingEvidence"
                    name="receivingEvidence"
                    checked={formData.receivingEvidence}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label
                    htmlFor="receivingEvidence"
                    className="ml-2 text-sm text-gray-700"
                  >
                    Receiving evidence (Optional)
                  </label>
                </div> */}

                {/* Priority Level */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Priority Level
                  </label>
                  <div className="flex flex-wrap gap-4">
                    {["Low", "Medium", "High", "Urgent"].map((level) => (
                      <label
                        key={level}
                        className="flex items-center cursor-pointer"
                      >
                        <input
                          type="radio"
                          name="priorityLevel"
                          value={level}
                          checked={formData.priorityLevel === level}
                          onChange={handleInputChange}
                          className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                        />
                        <span className="ml-2 text-sm text-gray-700">
                          {level}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                  {/* <button
                    type="button"
                    onClick={handleSaveDraft}
                    className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors font-medium"
                  >
                    Save as Draft
                  </button> */}
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors font-medium flex items-center justify-center"
                  >
                    <MdMessage className="w-4 h-4 mr-2" />
                    Submit Report
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* What Happens Next */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-5">
              <div className="flex items-start space-x-2 mb-3">
                <MdInfo className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <h3 className="font-semibold text-gray-900">
                  What Happens Next?
                </h3>
              </div>
              <ol className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start">
                  <span className="font-semibold mr-2">1.</span>
                  <span>Your report will be assigned a unique ticket ID</span>
                </li>
                <li className="flex items-start">
                  <span className="font-semibold mr-2">2.</span>
                  <span>Investigation on your case within 24-48 hours</span>
                </li>
                <li className="flex items-start">
                  <span className="font-semibold mr-2">3.</span>
                  <span>
                    You'll receive updates via your registered mobile...
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="font-semibold mr-2">4.</span>
                  <span>Resolution typically takes 3-7 business days</span>
                </li>
              </ol>
            </div>

            {/* Your Recent Reports */}
            <div className="bg-white rounded-lg shadow-sm p-5">
              <h3 className="font-semibold text-gray-900 mb-4">
                Your Recent Reports
              </h3>
              <div className="space-y-3">
                {recentReports.map((report, index) => (
                  <div
                    key={index}
                    className="border border-gray-200 rounded-lg p-3"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-gray-900">
                        {report.id}
                      </span>
                      <span
                        className={`text-xs px-2 py-1 rounded ${
                          report.status === "Resolved"
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {report.status}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600">
                      Quantity Discrepancy
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Submitted: {report.date}
                    </p>
                  </div>
                ))}
              </div>
              <button className="w-full mt-4 text-sm text-blue-600 hover:text-blue-700 font-medium">
                View All Reports
              </button>
            </div>

            {/* Emergency Contact */}
            <div className="bg-red-50 border border-red-200 rounded-lg p-5">
              <div className="flex items-start space-x-2 mb-3">
                <MdPhone className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <h3 className="font-semibold text-gray-900">
                  Emergency Contact
                </h3>
              </div>
              <p className="text-sm text-gray-700 mb-3">
                For urgent issues that require immediate attention:
              </p>
              <div className="space-y-2 text-sm">
                <p className="font-medium text-gray-900">
                  Helpline: 1800-XXX-XXXX
                </p>
                <p className="font-medium text-gray-900">
                  WhatsApp: +91-XXXX-XXXXXX
                </p>
                <p className="text-gray-600">Hours: 24/7 Support</p>
              </div>
            </div>

            {/* Helpful Tips */}
            <div className="bg-white rounded-lg shadow-sm p-5">
              <h3 className="font-semibold text-gray-900 mb-3">Helpful Tips</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  <span>Be specific with dates and locations</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  <span>Include photos when possible</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  <span>Keep your transaction receipts handy</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  <span>Double-check all information before submitting</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BeneficiaryGrievance;
