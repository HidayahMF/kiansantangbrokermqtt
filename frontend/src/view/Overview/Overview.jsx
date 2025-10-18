import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import OverviewPribadi from "./OverviewPribadi";
import OverviewKota from "./OverviewKota";

const Overview = () => {
  const [activeTab, setActiveTab] = useState("personal");

  return (
    <div className="p-4 sm:p-6 md:p-8 text-white min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* <h1 className="text-2xl sm:text-3xl font-bold mb-5 sm:mb-6 text-center">
       Your Dashboard
      </h1> */}

      <div className="flex justify-center mb-6 sm:mb-8 relative">
        <div className="flex bg-gray-800 rounded-xl shadow-lg p-1 w-full max-w-[320px] sm:max-w-[400px] justify-between">
          {["personal", "city"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`relative flex-1 text-center px-3 sm:px-6 py-2 font-semibold rounded-lg transition-all duration-300  ${
                activeTab === tab
                  ? "text-white"
                  : "text-gray-400 hover:text-white cursor-pointer"
              }`}
            >
              {tab === "personal" ? "Pribadi" : "Kota"}
              {activeTab === tab && (
                <motion.div
                  layoutId="active-pill"
                  className="absolute inset-0 bg-blue-600 rounded-lg -z-10"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-gray-800/60 backdrop-blur-md rounded-2xl shadow-xl p-4 sm:p-6">
        <AnimatePresence mode="wait">
          {activeTab === "personal" ? (
            <motion.div
              key="personal"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="overflow-x-auto"
            >
              <OverviewPribadi />
            </motion.div>
          ) : (
            <motion.div
              key="city"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="overflow-x-auto"
            >
              <OverviewKota />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Overview;
