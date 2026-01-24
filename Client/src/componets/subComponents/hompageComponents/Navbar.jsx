import React, {useState} from "react";

//icons
import { GiWheat } from "react-icons/gi";
import { CiGlobe } from "react-icons/ci";
import { FaBell } from "react-icons/fa";
import { FaCircleQuestion } from "react-icons/fa6";

const Navbar = ({login, publicPage}) => {
  const [selectedTab, setSelectedTab] = useState(false);
  const handleTab = ()=>{
    setSelectedTab(!selectedTab);
    console.log(selectedTab);
  }
  return (
    <>
      <div className="px-30 py-2 shadow flex items-center justify-between">
        <div className="flex gap-3 items-center">
          <div>
            <GiWheat size={40} color="#193cb8" />
          </div>
          <div className="">
            <h2 className="text-2xl font-bold">Ration Transparency Portal</h2>
            <h4 className="text-md text-gray-600">
              Public Food Distribution System
            </h4>
          </div>
        </div>
        <div className="flex items-center">
          <CiGlobe size={20} color="gray" />
          <select
            name="language"
            id="language"
            className="ml-1 border-none outline-none text-gray-600"
          >
            <option value="en">English</option>
          </select>
          {publicPage ? <a className="mx-5 hover:text-blue-800 transition-colors" href="/">Public Dashboard</a> : null }
          <button className="bg-blue-800 rounded-md px-4 py-2 text-white font-medium cursor-pointer hover:bg-blue-900 transition">
            {login}
          </button>
        </div>
      </div>
      {/* <div className="px-30 py-4 flex items-center justify-between ">
        <div className="flex items-center gap-10 text-lg font-medium text-gray-600">
          <a href="#" className="hover:text-blue-800">
            Public Dashboard
          </a>
          <a href="#" className="hover:text-blue-800">
            Shop Performance
          </a>
          <a href="#" className="hover:text-blue-800">
            District Overview
          </a>
          <a href="#" className="hover:text-blue-800">
            Analytics
          </a>
          <a href="#" className="hover:text-blue-800">
            Report
          </a>
        </div>
        <div className="flex items-center">
          <FaCircleQuestion size={20} color="#4a5565" className="mr-6" />
          <FaBell size={20} color="#4a5565" />
        </div>
      </div> */}
    </>
  );
};

export default Navbar;
