import React from "react";

// icons
import { MdOutlineSearch, MdOutlineAnalytics } from "react-icons/md";
import { FaStore, FaArrowRightLong, FaMapLocationDot } from "react-icons/fa6";
import { GoGraph } from "react-icons/go";

const Herosection = () => {
  return (
    <section>
      <div className="bg-blue-900 px-30 py-15">
        <h2 className="text-5xl font-bold text-white w-200">
          Transparent Ration Distribution System
        </h2>
        <p className="text-xl text-white w-200 my-10">
          Monitor, track, and ensure fair distribution of essential commodities
          across all distribution centers. Real-time transparency for better
          governance.
        </p>
        <button className="py-3 px-5 bg-white rounded-md text-blue-800 font-medium cursor-pointer">
          <MdOutlineSearch size={20} className="inline-block mr-2" />
          Search Distribution Centers
        </button>
        <button className="py-3 px-5 mx-8 rounded-md border-white border text-white font-medium cursor-pointer">
          <MdOutlineAnalytics size={20} className="inline-block mr-2" />
          View Analytics
        </button>
      </div>
      <div className="px-30 py-15">
        <h1 className="text-4xl font-bold text-center">
          Explore Distribution Data
        </h1>
        <p className="text-xl text-gray-600 my-3 text-center">
          Search by shop ID, district or location to access detailed performance
          matrics
        </p>
        <div className="flex justify-center my-10">
          <div className="flex border border-gray-400 border-r-0 w-200 items-center rounded-md rounded-r-none px-4 py-3">
            <MdOutlineSearch
              size={25}
              className="inline-block mr-2"
              color="#4a5565"
            />
            <input
              type="text"
              placeholder="Enter Shop ID, District or Location..."
              className=" rounded-l-md w-full outline-none text-lg"
            />
          </div>
          <button className="py-3 px-4 bg-blue-800 text-white rounded-md rounded-l-none text-lg font-medium">
            Search
          </button>
        </div>
        <div className="flex justify-between my-15">
        <div className="w-130 bg-blue-100 rounded-xl p-10">
          <div className="flex gap-3">
            <FaStore size={25} color="#2b6cb0" />
            <h3 className="text-xl font-semibold">View All Shops</h3>
          </div>
          <p className="my-3 text-lg">
            Browse complete list of distribution centers with performance
            metrics
          </p>
          <button className="text-blue-800 font-medium cursor-pointer text-lg">Explore Shops
            <FaArrowRightLong size={20} className="inline-block ml-2" />
          </button>
        </div>
        <div className="w-130 bg-green-100 rounded-xl p-10">
          <div className="flex gap-3">
            <FaMapLocationDot size={25} color="green" />
            <h3 className="text-xl font-semibold">District Performance</h3>
          </div>
          <p className="my-3 text-lg">
            Browse complete list of distribution centers with performance
            metrics
          </p>
          <button className="text-green-800 font-medium cursor-pointer text-lg">View Districts
            <FaArrowRightLong size={20} className="inline-block ml-2" />
          </button>
        </div>
        <div className="w-130 bg-purple-100 rounded-xl p-10">
          <div className="flex gap-3">
            <GoGraph size={25} color="purple" className="font-medium" />
            <h3 className="text-xl font-semibold">Overall Statics</h3>
          </div>
          <p className="my-3 text-lg">
            Browse complete list of distribution centers with performance
            metrics
          </p>
          <button className="text-purple-800 font-medium cursor-pointer text-lg">View Analytics
            <FaArrowRightLong size={20} className="inline-block ml-2" />
          </button>
        </div>
      </div>
      </div>
    </section>
  );
};

export default Herosection;
