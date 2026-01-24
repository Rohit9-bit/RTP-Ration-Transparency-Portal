import React from "react";
import Navbar from "../../componets/subComponents/hompageComponents/Navbar";

import { FaShieldAlt } from "react-icons/fa";

const LoginBeneficiary = () => {
  return (
    <div>
      <Navbar login={"Shop Owner Login"} publicPage={true} />
      <div className="px-30 flex my-8">
        <div className="w-[50%] border px-10 py-25 bg-blue-100">
          <h1 className="text-4xl font-bold">Secure Access</h1>
          <p className="text-xl my-4 text-gray-900 w-150">
            Login to view your ration entitlements, transaction history, and
            report any issues with the distribution system.
          </p>
          <div className="">
            <FaShieldAlt
              size={20}
              color="#193cb8"
              className=""
            />
          <div>
            <h2>Secure Authentication</h2>
            <p>OTP-based login for maximum security</p>
          </div>
          <div>
            <h2>Moblie Verification</h2>
            <p>SMS OTP to registered mobile number</p>
          </div>
          <div>
            <h2>24/7 Access</h2>
            <p>Check your entitlements anytime</p>
          </div>
          </div>
        </div>
        <div className="w-[50%] border px-10">World</div>
      </div>
    </div>
  );
};

export default LoginBeneficiary;
