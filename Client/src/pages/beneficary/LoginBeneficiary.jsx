import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import axiosInstance from "../../utils/axiosInstance";

const LoginBeneficiary = () => {
  const [formData, setFormData] = useState({
    rationCardNumber: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const regex = /^[0-9]+$/;

  // useEffect(() => {
  //   axiosInstance
  //     .get("/token/check", { withCredentials: true })
  //     .then((response) => {
  //       if (response.status === 200) {
  //         alert("You are already logged in! Redirecting to dashboard.");
  //         navigate("/beneficiary/dashboard");
  //       }
  //     })
  //     .catch((err) => {
  //       console.error(
  //         "Token check failed:",
  //         err.response ? err.response.data : err.message,
  //       );
  //     });
  // }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.rationCardNumber.trim()) {
      setError("Ration Card Number is required");
      return;
    }

    if (!regex.test(formData.rationCardNumber)) {
      setError("Invalid Ration Card Number format. Only digits are allowed.");
      return;
    }

    if (!formData.password.trim()) {
      setError("Password is required");
      return;
    }

    setIsLoading(true);
    try {
      // Add your API call here
      axiosInstance
        .post(
          "/beneficiary/login",
          {
            rationCardNo: "RCN" + formData.rationCardNumber,
            password: formData.password,
          },
          { withCredentials: true },
        )
        .then((response) => {
          console.log("Login successful:", response.data);
          // Handle successful login, e.g., redirect to dashboard
          alert("Login successful! You are now redirecting to the dashboard.");
          navigate("/beneficiary/dashboard");
        })
        .catch((err) => {
          console.error(
            "Login failed:",
            err.response ? err.response.data : err.message,
          );
          setError(
            err.response?.data?.message || "Login failed. Please try again.",
          );
        });
    } catch (err) {
      setError(err.message || "Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-600 to-purple-700 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col lg:flex-row">
          {/* Left Side - Branding & Features */}
          <div className="hidden lg:flex lg:w-1/2 bg-linear-to-br from-blue-600 to-purple-700 px-12 py-16 flex-col justify-center text-white relative overflow-hidden">
            {/* Decorative Elements */}
            <div className="absolute top-0 right-0 w-72 h-72 bg-blue-400 rounded-full opacity-10 -mr-36 -mt-36"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-400 rounded-full opacity-10 -ml-48 -mb-48"></div>

            {/* Content */}
            <div className="relative z-10">
              <div className="mb-12">
                <div className="flex gap-10 align-items-center">
                  <div className="w-16 h-16 bg-white bg-opacity-20 rounded-2xl flex items-center justify-center mb-6 backdrop-blur-md border border-white border-opacity-20">
                    <span className="text-3xl">🛡️</span>
                  </div>
                </div>
                <h2 className="text-4xl font-bold mb-4 leading-tight">
                  Ration Distribution System
                </h2>
                <p className="text-blue-100 text-lg font-light leading-relaxed">
                  Secure access to your ration benefits and distribution
                  details.
                </p>
              </div>

              {/* Features */}
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center shrink-0 backdrop-blur-md border border-white border-opacity-20">
                    <span className="text-xl">📊</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">
                      Track Distributions
                    </h3>
                    <p className="text-blue-100 text-sm">
                      Monitor your ration allocations and distribution history
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center shrink-0 backdrop-blur-md border border-white border-opacity-20">
                    <span className="text-xl">🔐</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">
                      Secure Access
                    </h3>
                    <p className="text-blue-100 text-sm">
                      Your personal data is protected with advanced encryption
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center shrink-0 backdrop-blur-md border border-white border-opacity-20">
                    <span className="text-xl">⏰</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">
                      Real-time Updates
                    </h3>
                    <p className="text-blue-100 text-sm">
                      Get instant notifications for your ration benefits
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom decorative text */}
            <div className="relative z-10 mt-16 pt-8 border-t border-white border-opacity-20">
              <p className="text-blue-100 text-sm font-light">
                ✓ Trusted by thousands of beneficiaries
              </p>
            </div>
          </div>

          {/* Right Side - Login Form */}
          <div className="w-full lg:w-1/2 px-8 py-12 lg:px-12 lg:py-16 flex flex-col justify-center">
            {/* Header */}
            <div className="mb-10">
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                Beneficiary Login
              </h1>
              <p className="text-gray-600 text-base font-medium">
                Access your ration distribution account
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Error Message */}
              {error && (
                <div className="p-4 bg-red-50 border-l-4 border-red-400 rounded-lg flex items-center gap-3 animate-shake">
                  <span className="text-lg">⚠️</span>
                  <p className="text-red-700 text-sm font-medium">{error}</p>
                </div>
              )}

              {/* Ration Card Number Field */}
              <div>
                <label
                  htmlFor="rationCardNumber"
                  className="block text-sm font-semibold text-gray-800 mb-3 tracking-wide"
                >
                  Ration Card Number
                </label>
                <input
                  type="text"
                  id="rationCardNumber"
                  name="rationCardNumber"
                  value={formData.rationCardNumber}
                  maxLength={12}
                  minLength={12}
                  onChange={handleInputChange}
                  placeholder="Enter your ration card number"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg text-sm font-medium focus:outline-none focus:border-blue-600 focus:bg-blue-50 transition-all disabled:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-60"
                  disabled={isLoading}
                />
                <span className="block text-xs text-gray-500 mt-2">
                  e.g., RCN-123456789123 (Enter only the 12-digit number without
                  'RCN-')
                </span>
              </div>

              {/* Password Field */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-semibold text-gray-800 mb-3 tracking-wide"
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    value={formData.password}
                    autoComplete="password"
                    onChange={handleInputChange}
                    placeholder="Enter your password"
                    className="w-full px-4 py-3 pr-12 border-2 border-gray-200 rounded-lg text-sm font-medium focus:outline-none focus:border-blue-600 focus:bg-blue-50 transition-all disabled:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-60"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-lg cursor-pointer hover:opacity-70 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {showPassword ? "👁️" : "👁️‍🗨️"}
                  </button>
                </div>
              </div>

              {/* Forgot Password Link */}
              <div className="text-right">
                <a
                  href="#"
                  className="text-sm font-medium text-blue-600 hover:text-purple-700 hover:underline transition-colors"
                >
                  Forgot Password?
                </a>
              </div>

              {/* Login Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 mt-8 bg-linear-to-r from-blue-600 to-purple-700 text-white font-semibold text-base rounded-lg shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 transition-all disabled:opacity-70 disabled:cursor-not-allowed tracking-wide"
              >
                {isLoading ? "Logging in..." : "Login"}
              </button>
            </form>

            {/* Footer */}
            <div className="mt-10 pt-8 border-t border-gray-200 text-center">
              <p className="text-sm text-gray-700">
                Don't have an account?{" "}
                <a
                  href="/beneficiary/register"
                  className="font-semibold text-blue-600 hover:text-purple-700 hover:underline transition-colors"
                >
                  Register here
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginBeneficiary;
