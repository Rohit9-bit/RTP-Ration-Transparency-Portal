import React, { useState } from "react";
import Navbar from "../../componets/subComponents/hompageComponents/Navbar";

import { FaShieldAlt, FaMobileAlt, FaClock } from "react-icons/fa";

const LoginBeneficiary = () => {
  const [CardNumber, setCardNumber] = useState("");
  const [password, setPassword] = useState("");
  const [isError, setIsError] = useState(false);

  

  function handleCardNumberChange(e) {
    setCardNumber(e.target.value);
  }

  function handlePasswordChange(e) {
    setPassword(e.target.value);
  }

  function handleLogin(e) {
    e.preventDefault();
    const regex = /^[0-9]+$/;
    if (
      CardNumber === "" ||
      password === "" ||
      CardNumber.length !== 12 ||
      regex.test(CardNumber) === false
    ) {
      setIsError(true);
      return;
    } else {
      setIsError(false);
    }
    setCardNumber("");
    setPassword("");
  }
  return (
    <div className="h-full">
      <Navbar login={"Shop Owner Login"} publicPage={true} />
      <div className="flex h-screen">
        <div className="w-1/2 h-full bg-blue-200 px-30 flex flex-col justify-center">
          <h1 className="text-4xl font-bold ">Secure Access</h1>
          <p className="text-xl text-gray-900 my-4">
            Login to view your ration entitlements, transaction history, and
            report any issues with the distribution system.
          </p>
          <div className="my-4 flex items-baseline">
            <FaShieldAlt className="inline-block mr-2 text-blue-600" />
            <div className="flex flex-col">
              <span className="text-xl text-gray-900 font-bold">
                Secure and Encrypted Login
              </span>
              <span className="text-lg text-gray-900">
                OTP-based login for maximum security
              </span>
            </div>
          </div>
          <div className="my-4 flex items-baseline">
            <FaMobileAlt className="inline-block mr-2 text-blue-600" />
            <div className="flex flex-col">
              <span className="text-xl text-gray-900 font-bold">
                Mobile Verification
              </span>
              <span className="text-lg text-gray-900">
                SMS OTP to registered mobile number
              </span>
            </div>
          </div>
          <div className="my-4 flex items-baseline">
            <FaClock className="inline-block mr-2 text-blue-600" />
            <div className="flex flex-col">
              <span className="text-xl text-gray-900 font-bold">
                24/7 Access
              </span>
              <span className="text-lg text-gray-900">
                Check your entitlements anytime
              </span>
            </div>
          </div>
        </div>
        <div className="w-1/2 h-full flex flex-col px-30 justify-center">
          <div className="px-25 py-20 shadow-xl rounded-lg bg-white border border-gray-300">
            <div className="text-center mb-10">
              <h2 className="text-4xl font-bold mb-2">Beneficiary Login</h2>
              {isError ? (
                <p className="text-red-600">Invalid Credentials!</p>
              ) : null}
            </div>
            <form onSubmit={handleLogin} className="flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <label htmlFor="Ration Card Number" className="font-semibold">
                  Ration Card Number
                </label>
                <input
                  onChange={handleCardNumberChange}
                  value={CardNumber}
                  placeholder="Enter 12 digit card number"
                  type="text"
                  maxLength={12}
                  minLength={12}
                  className="w-full border px-4 py-3 rounded-md text-xl focus:outline-blue-600 bg-gray-50"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="Password" className="font-semibold">
                  Password
                </label>
                <input
                  onChange={handlePasswordChange}
                  value={password}
                  placeholder="Enter your password"
                  type="text"
                  className="w-full border px-4 py-3 rounded-md text-xl focus:outline-blue-600 bg-gray-50"
                />
              </div>
              <button
                type="submit"
                className="bg-blue-600 text-white py-3 rounded-md text-xl font-semibold hover:bg-blue-700 transition duration-300"
              >
                Login
              </button>

              <div>
                <h2>
                  Don't have Ration Card Number?
                  <a href="/beneficary/register" className="text-blue-600">
                    {" "}
                    Register
                  </a>
                </h2>
                <h2 className="text-red-600 cursor-pointer">Login Issue?</h2>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginBeneficiary;
