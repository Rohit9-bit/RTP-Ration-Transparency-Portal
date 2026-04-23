import React, { useEffect, useMemo, useState } from "react";
import { GiWheat } from "react-icons/gi";
import {
  MdDeleteForever,
  MdEdit,
  MdLockOutline,
  MdOutlineHome,
  MdOutlinePeopleAlt,
} from "react-icons/md";
import { useNavigate } from "react-router";
import axiosInstance from "../../utils/axiosInstance";
import useLogoutHook from "../../hooks/handleLogOutHook.js";
import DashboardHeader from "../../components/DashboardHeader.jsx";

const initialFormData = {
  familySize: "",
  address: "",
  currentPassword: "",
  newPassword: "",
};

const BeneficiaryAccountDetails = () => {
  const [accountInfo, setAccountInfo] = useState(null);
  const [formData, setFormData] = useState(initialFormData);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [dangerPassword, setDangerPassword] = useState("");
  const [dangerConfirmationText, setDangerConfirmationText] = useState("");

  const navigate = useNavigate();
  const logout = useLogoutHook();

  useEffect(() => {
    const getAccountDetails = async () => {
      setIsLoading(true);
      setError("");

      try {
        const response = await axiosInstance.get("/beneficiary/account", {
          withCredentials: true,
        });

        const data = response.data?.data;
        setAccountInfo(data);
        setFormData((prev) => ({
          ...prev,
          familySize: data?.family_size ? String(data.family_size) : "",
          address: data?.address || "",
        }));
      } catch (apiError) {
        setError(
          apiError.response?.data?.message ||
            "Unable to fetch account details. Please try again.",
        );
      } finally {
        setIsLoading(false);
      }
    };

    getAccountDetails();
  }, []);

  const isFormChanged = useMemo(() => {
    if (!accountInfo) return false;

    const familySizeChanged =
      String(accountInfo.family_size || "") !==
      String(formData.familySize || "");
    const addressChanged =
      String(accountInfo.address || "").trim() !==
      String(formData.address || "").trim();
    const passwordChanged = formData.newPassword.trim() !== "";

    return familySizeChanged || addressChanged || passwordChanged;
  }, [accountInfo, formData]);

  function handleNavClick(section) {
    switch (section) {
      case "MyRation":
        navigate("/beneficiary/dashboard");
        break;
      case "TransactionHistory":
        navigate("/beneficiary/transaction-history");
        break;
      case "ReportIssue":
        navigate("/beneficiary/grievance/submit");
        break;
      default:
        break;
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSuccessMessage("");
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    const normalizedAddress = formData.address.trim();
    const parsedFamilySize = parseInt(formData.familySize, 10);

    if (!normalizedAddress) {
      setError("Address cannot be empty.");
      return;
    }

    if (
      Number.isNaN(parsedFamilySize) ||
      parsedFamilySize < 1 ||
      parsedFamilySize > 20
    ) {
      setError("Family members must be between 1 and 20.");
      return;
    }

    if (formData.newPassword && formData.newPassword.length < 8) {
      setError("New password must be at least 8 characters.");
      return;
    }

    if (formData.newPassword && !formData.currentPassword) {
      setError("Enter current password to update to a new password.");
      return;
    }

    if (!isFormChanged) {
      setError("No changes to save.");
      return;
    }

    const payload = {
      address: normalizedAddress,
      family_size: parsedFamilySize,
    };

    if (formData.newPassword.trim() !== "") {
      payload.currentPassword = formData.currentPassword;
      payload.newPassword = formData.newPassword;
    }

    setIsSaving(true);

    try {
      const response = await axiosInstance.post(
        "/beneficiary/account/update",
        payload,
        {
          withCredentials: true,
        },
      );

      const updatedData = response.data?.data;
      setAccountInfo(updatedData);
      setFormData((prev) => ({
        ...prev,
        familySize: String(updatedData?.family_size || ""),
        address: updatedData?.address || "",
        currentPassword: "",
        newPassword: "",
      }));
      setSuccessMessage("Account details updated successfully.");
      setIsEditMode(false);
    } catch (apiError) {
      setError(
        apiError.response?.data?.message ||
          "Failed to update account details. Please try again.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteAccount = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    if (!dangerPassword.trim()) {
      setError("Please enter your current password to delete your account.");
      return;
    }

    if (dangerConfirmationText !== "DELETE") {
      setError(
        "Type DELETE in confirmation box to permanently delete account.",
      );
      return;
    }

    const finalConfirmation = confirm(
      "This will permanently delete your account and cannot be undone. Continue?",
    );

    if (!finalConfirmation) {
      return;
    }

    setIsDeleting(true);

    try {
      await axiosInstance.post(
        "/beneficiary/account/delete",
        {
          currentPassword: dangerPassword,
          confirmationText: dangerConfirmationText,
        },
        {
          withCredentials: true,
        },
      );

      alert("Your account has been deleted permanently.");
      navigate("/beneficiary/login");
    } catch (apiError) {
      setError(
        apiError.response?.data?.message ||
          "Failed to delete account. Please try again.",
      );
    } finally {
      setIsDeleting(false);
    }
  };

  return isLoading ? (
    <div className="flex h-screen items-center justify-center">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
    </div>
  ) : (
    <div className="min-h-screen bg-linear-to-br from-[#fffdf6] via-[#f6f9ff] to-[#fdf1ea] text-slate-900">
      <DashboardHeader />

      <div className="mx-auto w-full max-w-6xl py-6">
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
          <button
            onClick={() => {
              handleNavClick("ReportIssue");
            }}
            className="rounded-full px-4 py-2 text-slate-500 hover:text-slate-700"
          >
            Report Issue
          </button>
          <button className="rounded-full bg-blue-50 px-4 py-2 text-blue-700 shadow-sm">
            Settings
          </button>
        </nav>

        <div className="grid gap-6 lg:grid-cols-[1fr_1.6fr]">
          <aside className="space-y-6">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="mb-4 text-sm font-semibold text-slate-700">
                Account Overview
              </h2>
              <div className="space-y-3 text-sm text-slate-600">
                <div className="flex items-center justify-between">
                  <span>Name:</span>
                  <span className="font-semibold text-slate-800">
                    {accountInfo?.full_name || "-"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Ration Card Number:</span>
                  <span className="font-semibold text-slate-800">
                    {accountInfo?.ration_card_no || "-"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Family Members:</span>
                  <span className="font-semibold text-slate-800">
                    {accountInfo?.family_size || "-"}
                  </span>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-emerald-100 bg-emerald-50/70 p-5 shadow-sm">
              <h3 className="mb-3 text-sm font-semibold text-emerald-700">
                Editable Fields
              </h3>
              <ul className="space-y-3 text-sm text-slate-700">
                <li className="flex items-center gap-2">
                  <MdOutlineHome className="text-lg text-emerald-700" />
                  Address
                </li>
                <li className="flex items-center gap-2">
                  <MdOutlinePeopleAlt className="text-lg text-emerald-700" />
                  Total Family Members
                </li>
                <li className="flex items-center gap-2">
                  <MdLockOutline className="text-lg text-emerald-700" />
                  Password
                </li>
              </ul>
            </div>
          </aside>

          <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-7 shadow-sm">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">
                  My Profile
                </h2>
                <p className="mt-2 text-sm text-slate-500">
                  View all account details here. Click update when you want to
                  edit address, family members, or password.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setError("");
                  setSuccessMessage("");
                  setIsEditMode(true);
                }}
                className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow transition hover:bg-blue-700"
              >
                <MdEdit className="text-base" />
                Update your account details
              </button>
            </div>

            {error && (
              <p className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </p>
            )}

            {successMessage && (
              <p className="mt-4 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                {successMessage}
              </p>
            )}

            {!isEditMode ? (
              <div className="mt-6 grid gap-5 sm:grid-cols-2">
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Beneficiary Name
                  </p>
                  <p className="mt-2 text-base font-semibold text-slate-900">
                    {accountInfo?.full_name || "-"}
                  </p>
                </div>
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Ration Card Number
                  </p>
                  <p className="mt-2 text-base font-semibold text-slate-900">
                    {accountInfo?.ration_card_no || "-"}
                  </p>
                </div>
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Total Family Members
                  </p>
                  <p className="mt-2 text-base font-semibold text-slate-900">
                    {accountInfo?.family_size || "-"}
                  </p>
                </div>
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 sm:col-span-2">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Address
                  </p>
                  <p className="mt-2 text-base font-semibold text-slate-900 whitespace-pre-wrap">
                    {accountInfo?.address || "-"}
                  </p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="mt-6 space-y-5">
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">
                      Beneficiary Name
                    </label>
                    <input
                      value={accountInfo?.full_name || ""}
                      disabled
                      className="w-full rounded-lg border border-slate-200 bg-slate-100 px-4 py-2.5 text-sm text-slate-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">
                      Ration Card Number
                    </label>
                    <input
                      value={accountInfo?.ration_card_no || ""}
                      disabled
                      className="w-full rounded-lg border border-slate-200 bg-slate-100 px-4 py-2.5 text-sm text-slate-500 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Total Family Members
                  </label>
                  <input
                    type="number"
                    name="familySize"
                    min="1"
                    max="20"
                    value={formData.familySize}
                    onChange={handleInputChange}
                    className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-700 outline-none ring-blue-100 transition focus:border-blue-500 focus:ring-2"
                    placeholder="Enter family members count"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Address
                  </label>
                  <textarea
                    name="address"
                    rows="3"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-700 outline-none ring-blue-100 transition focus:border-blue-500 focus:ring-2"
                    placeholder="Enter your full address"
                  ></textarea>
                </div>

                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <h3 className="mb-3 text-sm font-semibold text-slate-700">
                    Change Password (Optional)
                  </h3>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-sm font-medium text-slate-700">
                        Current Password
                      </label>
                      <input
                        type="password"
                        name="currentPassword"
                        value={formData.currentPassword}
                        onChange={handleInputChange}
                        className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-700 outline-none ring-blue-100 transition focus:border-blue-500 focus:ring-2"
                        placeholder="Enter current password"
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-medium text-slate-700">
                        New Password
                      </label>
                      <input
                        type="password"
                        name="newPassword"
                        value={formData.newPassword}
                        onChange={handleInputChange}
                        className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-700 outline-none ring-blue-100 transition focus:border-blue-500 focus:ring-2"
                        placeholder="Minimum 8 characters"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white shadow transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
                  >
                    {isSaving ? "Saving Changes..." : "Save Changes"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (!accountInfo) return;
                      setError("");
                      setSuccessMessage("");
                      setIsEditMode(false);
                      setFormData({
                        familySize: String(accountInfo.family_size || ""),
                        address: accountInfo.address || "",
                        currentPassword: "",
                        newPassword: "",
                      });
                    }}
                    className="rounded-xl border border-slate-300 px-6 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}

            <div className="mt-8 rounded-2xl border border-red-200 bg-red-50 p-5 sm:p-6">
              <div className="flex items-start gap-3">
                <MdDeleteForever className="mt-0.5 text-2xl text-red-600" />
                <div>
                  <h3 className="text-lg font-bold text-red-700">
                    Danger Zone
                  </h3>
                  <p className="mt-1 text-sm text-red-700/90">
                    Permanently delete your beneficiary account. This action
                    cannot be undone.
                  </p>
                </div>
              </div>

              <form onSubmit={handleDeleteAccount} className="mt-5 space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-red-800">
                    Enter Current Password
                  </label>
                  <input
                    type="password"
                    value={dangerPassword}
                    onChange={(e) => {
                      setDangerPassword(e.target.value);
                    }}
                    className="w-full rounded-lg border border-red-200 bg-white px-4 py-2.5 text-sm text-slate-700 outline-none ring-red-100 transition focus:border-red-400 focus:ring-2"
                    placeholder="Current password"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-red-800">
                    Type DELETE to Confirm
                  </label>
                  <input
                    type="text"
                    value={dangerConfirmationText}
                    onChange={(e) => {
                      setDangerConfirmationText(e.target.value);
                    }}
                    className="w-full rounded-lg border border-red-200 bg-white px-4 py-2.5 text-sm uppercase text-slate-700 outline-none ring-red-100 transition focus:border-red-400 focus:ring-2"
                    placeholder="DELETE"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isDeleting}
                  className="rounded-xl bg-red-600 px-5 py-2.5 text-sm font-semibold text-white shadow transition hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-red-300"
                >
                  {isDeleting
                    ? "Deleting Account..."
                    : "Delete My Account Permanently"}
                </button>
              </form>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default BeneficiaryAccountDetails;
