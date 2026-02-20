import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import axiosInstance from "../../utils/axiosInstance";
import { centersData, dummyCentersId } from "../../utils/centersData";

const RegisterBeneficary = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone_no: "",
    password: "",
    security_PIN: "",
    family_size: "",
    state: "",
    district: "",
    address: "",
    rationCardNo: "",
    centerId: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [centersId, setCentersId] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    axiosInstance
      .get(
        "/centers/?state=" + formData.state + "&district=" + formData.district,
      )
      .then((response) => {
        setCentersId(response.data);
      })
      .catch((error) => {
        console.error("Error fetching centers:", error);
        setCentersId([]);
        setErrors((prev) => ({
          ...prev,
          centerId:
            "Failed to load centers. Please check your state and district.",
        }));
      });
  }, [formData.state, formData.district]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) newErrors.fullName = "Full Name is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }
    if (!formData.phone_no.trim()) {
      newErrors.phone_no = "Phone number is required";
    } else if (!/^\d{10}$/.test(formData.phone_no.replace(/\D/g, ""))) {
      newErrors.phone_no = "Phone number must be 10 digits";
    }
    if (!formData.password.trim()) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    if (!formData.security_PIN.trim()) {
      newErrors.security_PIN = "Security PIN is required";
    } else if (!/^\d{4}$/.test(formData.security_PIN)) {
      newErrors.security_PIN = "Security PIN must be 4 digits";
    }
    if (!formData.family_size)
      newErrors.family_size = "Family size is required";
    if (!formData.state.trim()) newErrors.state = "State is required";
    if (!formData.district.trim()) newErrors.district = "District is required";
    if (!formData.address.trim()) newErrors.address = "Address is required";
    if (!formData.rationCardNo.trim())
      newErrors.rationCardNo = "Ration Card Number is required";
    if (!formData.centerId.trim()) newErrors.centerId = "Center ID is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;
    setIsLoading(true);
    try {
      // Add your API call here
      axiosInstance
        .post("/beneficiary/register", formData, {withCredentials: true})
        .then((response) => {
          console.log("Registration successful:", response.data);
          // You can redirect the user or show a success message here
          alert("Registration successful! You are now redirecting to the dashboard.");
          navigate("/beneficiary/dashboard");
        })
        .catch((error) => {
          console.error("Registration error:", error);
          setErrors({
            submit:
              error.response?.data?.message ||
              "Registration failed. Please try again.",
          });
        });
      // Handle successful registration
    } catch (err) {
      setErrors({
        submit: err.message || "Registration failed. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-600 to-purple-700 flex items-center justify-center p-4 py-12">
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
                <div className="w-16 h-16 bg-white bg-opacity-20 rounded-2xl flex items-center justify-center mb-6 backdrop-blur-md border border-white border-opacity-20">
                  <span className="text-3xl">🛡️</span>
                </div>
                <h2 className="text-4xl font-bold mb-4 leading-tight">
                  Join Our Community
                </h2>
                <p className="text-blue-100 text-lg font-light leading-relaxed">
                  Register to access secure ration distribution services and
                  benefits.
                </p>
              </div>

              {/* Features */}
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center shrink-0 backdrop-blur-md border border-white border-opacity-20">
                    <span className="text-xl">📝</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">
                      Easy Registration
                    </h3>
                    <p className="text-blue-100 text-sm">
                      Quick and simple registration process
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center shrink-0 backdrop-blur-md border border-white border-opacity-20">
                    <span className="text-xl">✅</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">
                      Instant Verification
                    </h3>
                    <p className="text-blue-100 text-sm">
                      Get verified and access benefits immediately
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center shrink-0 backdrop-blur-md border border-white border-opacity-20">
                    <span className="text-xl">🎁</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">
                      Exclusive Benefits
                    </h3>
                    <p className="text-blue-100 text-sm">
                      Access special offers and ration distribution
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom decorative text */}
            <div className="relative z-10 mt-16 pt-8 border-t border-white border-opacity-20">
              <p className="text-blue-100 text-sm font-light">
                ✓ Join thousands of registered beneficiaries
              </p>
            </div>
          </div>

          {/* Right Side - Registration Form */}
          <div className="w-full lg:w-1/2 px-8 py-12 lg:px-12 lg:py-12 flex flex-col justify-start">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                Create Account
              </h1>
              <p className="text-gray-600 text-base font-medium">
                Register as a beneficiary to access ration distribution
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Submit Error */}
              {errors.submit && (
                <div className="p-4 bg-red-50 border-l-4 border-red-400 rounded-lg flex items-center gap-3">
                  <span className="text-lg">⚠️</span>
                  <p className="text-red-700 text-sm font-medium">
                    {errors.submit}
                  </p>
                </div>
              )}

              {/* Full Name */}
              <div>
                <label
                  htmlFor="fullName"
                  className="block text-sm font-semibold text-gray-800 mb-2"
                >
                  Full Name *
                </label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  placeholder="Enter your full name"
                  className={`w-full px-4 py-2.5 border-2 rounded-lg text-sm font-medium focus:outline-none transition-all disabled:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-60 ${
                    errors.fullName
                      ? "border-red-400 focus:border-red-500 focus:bg-red-50"
                      : "border-gray-200 focus:border-blue-600 focus:bg-blue-50"
                  }`}
                  disabled={isLoading}
                />
                {errors.fullName && (
                  <p className="text-red-600 text-xs mt-1">{errors.fullName}</p>
                )}
              </div>

              {/* Email & Phone Row */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-semibold text-gray-800 mb-2"
                  >
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="your.email@example.com"
                    className={`w-full px-4 py-2.5 border-2 rounded-lg text-sm font-medium focus:outline-none transition-all disabled:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-60 ${
                      errors.email
                        ? "border-red-400 focus:border-red-500 focus:bg-red-50"
                        : "border-gray-200 focus:border-blue-600 focus:bg-blue-50"
                    }`}
                    disabled={isLoading}
                  />
                  {errors.email && (
                    <p className="text-red-600 text-xs mt-1">{errors.email}</p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="phone_no"
                    className="block text-sm font-semibold text-gray-800 mb-2"
                  >
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    id="phone_no"
                    name="phone_no"
                    maxLength={10}
                    minLength={10}
                    value={formData.phone_no}
                    onChange={handleInputChange}
                    placeholder="9573938457"
                    className={`w-full px-4 py-2.5 border-2 rounded-lg text-sm font-medium focus:outline-none transition-all disabled:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-60 ${
                      errors.phone_no
                        ? "border-red-400 focus:border-red-500 focus:bg-red-50"
                        : "border-gray-200 focus:border-blue-600 focus:bg-blue-50"
                    }`}
                    disabled={isLoading}
                  />
                  {errors.phone_no && (
                    <p className="text-red-600 text-xs mt-1">
                      {errors.phone_no}
                    </p>
                  )}
                </div>
              </div>

              {/* Password & PIN Row */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-semibold text-gray-800 mb-2"
                  >
                    Password *
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      name="password"
                      value={formData.password}
                      autoComplete="password"
                      onChange={handleInputChange}
                      placeholder="At least 6 characters"
                      className={`w-full px-4 py-2.5 pr-10 border-2 rounded-lg text-sm font-medium focus:outline-none transition-all disabled:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-60 ${
                        errors.password
                          ? "border-red-400 focus:border-red-500 focus:bg-red-50"
                          : "border-gray-200 focus:border-blue-600 focus:bg-blue-50"
                      }`}
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={isLoading}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-lg cursor-pointer hover:opacity-70 transition-opacity disabled:opacity-50"
                    >
                      {showPassword ? "👁️" : "👁️‍🗨️"}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-red-600 text-xs mt-1">
                      {errors.password}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="security_PIN"
                    className="block text-sm font-semibold text-gray-800 mb-2"
                  >
                    Security PIN (4 digits) *
                  </label>
                  <input
                    type="text"
                    id="security_PIN"
                    name="security_PIN"
                    value={formData.security_PIN}
                    onChange={handleInputChange}
                    placeholder="1234"
                    maxLength="4"
                    className={`w-full px-4 py-2.5 border-2 rounded-lg text-sm font-medium focus:outline-none transition-all disabled:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-60 ${
                      errors.security_PIN
                        ? "border-red-400 focus:border-red-500 focus:bg-red-50"
                        : "border-gray-200 focus:border-blue-600 focus:bg-blue-50"
                    }`}
                    disabled={isLoading}
                  />
                  {errors.security_PIN && (
                    <p className="text-red-600 text-xs mt-1">
                      {errors.security_PIN}
                    </p>
                  )}
                </div>
              </div>

              {/* Family Size & State Row */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                <div>
                  <label
                    htmlFor="family_size"
                    className="block text-sm font-semibold text-gray-800 mb-2"
                  >
                    Family Size *
                  </label>
                  <select
                    id="family_size"
                    name="family_size"
                    value={formData.family_size}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2.5 border-2 rounded-lg text-sm font-medium focus:outline-none transition-all disabled:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-60 ${
                      errors.family_size
                        ? "border-red-400 focus:border-red-500 focus:bg-red-50"
                        : "border-gray-200 focus:border-blue-600 focus:bg-blue-50"
                    }`}
                    disabled={isLoading}
                  >
                    <option value="">Select family size</option>
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((size) => (
                      <option key={size} value={size}>
                        {size} {size === 1 ? "person" : "people"}
                      </option>
                    ))}
                  </select>
                  {errors.family_size && (
                    <p className="text-red-600 text-xs mt-1">
                      {errors.family_size}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="state"
                    className="block text-sm font-semibold text-gray-800 mb-2"
                  >
                    State *
                  </label>
                  <select
                    id="state"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2.5 border-2 rounded-lg text-sm font-medium focus:outline-none transition-all disabled:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-60 ${
                      errors.state
                        ? "border-red-400 focus:border-red-500 focus:bg-red-50"
                        : "border-gray-200 focus:border-blue-600 focus:bg-blue-50"
                    }`}
                    disabled={isLoading}
                  >
                    <option value="">Select state</option>
                    {Object.keys(centersData).map((state) => (
                      <option key={state} value={state}>
                        {state}
                      </option>
                    ))}
                  </select>

                  {errors.state && (
                    <p className="text-red-600 text-xs mt-1">{errors.state}</p>
                  )}
                </div>
              </div>

              {/* District & Address Row */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                <div>
                  <label
                    htmlFor="district"
                    className="block text-sm font-semibold text-gray-800 mb-2"
                  >
                    District *
                  </label>
                  <select
                    id="district"
                    name="district"
                    value={formData.district}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2.5 border-2 rounded-lg text-sm font-medium focus:outline-none transition-all disabled:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-60 ${
                      errors.district
                        ? "border-red-400 focus:border-red-500 focus:bg-red-50"
                        : "border-gray-200 focus:border-blue-600 focus:bg-blue-50"
                    }`}
                    disabled={isLoading}
                  >
                    <option value="">Select district</option>
                    {formData.state && centersData[formData.state]
                      ? centersData[formData.state].map((district) => (
                          <option key={district} value={district}>
                            {district}
                          </option>
                        ))
                      : ["select state first"].map((msg) => (
                          <option key={msg} value="">
                            {msg}
                          </option>
                        ))}
                  </select>
                  {errors.district && (
                    <p className="text-red-600 text-xs mt-1">
                      {errors.district}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="address"
                    className="block text-sm font-semibold text-gray-800 mb-2"
                  >
                    Address *
                  </label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="e.g., 456 district faridabad"
                    className={`w-full px-4 py-2.5 border-2 rounded-lg text-sm font-medium focus:outline-none transition-all disabled:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-60 ${
                      errors.address
                        ? "border-red-400 focus:border-red-500 focus:bg-red-50"
                        : "border-gray-200 focus:border-blue-600 focus:bg-blue-50"
                    }`}
                    disabled={isLoading}
                  />
                  {errors.address && (
                    <p className="text-red-600 text-xs mt-1">
                      {errors.address}
                    </p>
                  )}
                </div>
              </div>

              {/* Ration Card & Center ID Row */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                <div>
                  <label
                    htmlFor="rationCardNo"
                    className="block text-sm font-semibold text-gray-800 mb-2"
                  >
                    Ration Card Number *
                  </label>
                  <input
                    type="text"
                    id="rationCardNo"
                    name="rationCardNo"
                    value={formData.rationCardNo}
                    maxLength={12}
                    minLength={12}
                    onChange={handleInputChange}
                    placeholder="384328594832"
                    className={`w-full px-4 py-2.5 border-2 rounded-lg text-sm font-medium focus:outline-none transition-all disabled:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-60 ${
                      errors.rationCardNo
                        ? "border-red-400 focus:border-red-500 focus:bg-red-50"
                        : "border-gray-200 focus:border-blue-600 focus:bg-blue-50"
                    }`}
                    disabled={isLoading}
                  />
                  {errors.rationCardNo && (
                    <p className="text-red-600 text-xs mt-1">
                      {errors.rationCardNo}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="centerId"
                    className="block text-sm font-semibold text-gray-800 mb-2"
                  >
                    Center ID *
                  </label>
                  <select
                    id="centerId"
                    name="centerId"
                    value={formData.centerId}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2.5 border-2 rounded-lg text-sm font-medium focus:outline-none transition-all disabled:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-60 ${
                      errors.centerId
                        ? "border-red-400 focus:border-red-500 focus:bg-red-50"
                        : "border-gray-200 focus:border-blue-600 focus:bg-blue-50"
                    }`}
                    disabled={isLoading}
                  >
                    <option value="">Select centerId</option>
                    {formData.state && formData.district
                      ? centersId.centers.map((center) => (
                          <option
                            key={center.center_id}
                            value={center.center_id}
                          >
                            {center.center_id}
                          </option>
                        ))
                      : ["select state and district first"].map((msg) => (
                          <option key={msg} value="">
                            {msg}
                          </option>
                        ))}
                  </select>
                  {errors.centerId && (
                    <p className="text-red-600 text-xs mt-1">
                      {errors.centerId}
                    </p>
                  )}
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 mt-6 bg-linear-to-r from-blue-600 to-purple-700 text-white font-semibold text-base rounded-lg shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 transition-all disabled:opacity-70 disabled:cursor-not-allowed tracking-wide"
              >
                {isLoading ? "Registering..." : "Create Account"}
              </button>
            </form>

            {/* Footer */}
            <div className="mt-8 pt-6 border-t border-gray-200 text-center">
              <p className="text-sm text-gray-700">
                Already have an account?{" "}
                <a
                  href="/beneficiary/login"
                  className="font-semibold text-blue-600 hover:text-purple-700 hover:underline transition-colors"
                >
                  Login here
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterBeneficary;
