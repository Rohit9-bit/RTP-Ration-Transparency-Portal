import React from "react";

// icons
import { MdOutlineSearch, MdOutlineAnalytics } from "react-icons/md";

const Herosection = () => {
  return (
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
  );
};

export default Herosection;
