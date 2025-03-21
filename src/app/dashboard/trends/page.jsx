"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { FiSearch, FiMapPin, FiBriefcase, FiFilter } from "react-icons/fi";

function App() {
  const [searchQuery, setSearchQuery] = useState("");

  const trendingJobs = [
    { title: "Software Engineer", salary: "₹12 LPA", change: "+8%" },
    { title: "Data Scientist", salary: "₹15 LPA", change: "+12%" },
    { title: "UI/UX Designer", salary: "₹10 LPA", change: "0%" },
    { title: "Product Manager", salary: "₹18 LPA", change: "-3%"},
    { title: "Frontend Developer", salary: "₹11 LPA", change: "+5%" },
  ];

  const highestPaying = [
    { title: "DevOps Engineer", salary: "₹14-18 LPA", change: "+15%" },
    { title: "Cloud Architect", salary: "₹20-25 LPA", change: "+10%" },
    { title: "ML Engineer", salary: "₹16-22 LPA", change: "+8%" },
    { title: "Backend Engineer", salary: "₹15-20 LPA", change: "-2%"},
    { title: "Data Engineer", salary: "₹13-17 LPA", change: "+6%" },
  ];

  return (
    <div className="min-h-screen p-6 ">
      <nav className="flex justify-between items-center mb-8 px-4"></nav>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row gap-4 mb-8 px-4"
      >
        <div className="flex-1 relative">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search for roles, skills, or companies"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#181818] rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent border border-gray-700/50"
          />
        </div>
        <div className="flex gap-2 md:gap-4">
          <button className="flex text-white items-center gap-2 bg-[#181818] px-4 py-3 rounded-lg hover:bg-opacity-80 transition-colors border border-gray-700/50 hover:border-accent/50">
            <FiMapPin className="text-white" /> Location
          </button>
          <button className="flex text-white items-center gap-2 bg-[#181818] px-4 py-3 rounded-lg hover:bg-opacity-80 transition-colors border border-gray-700/50 hover:border-accent/50">
            <FiBriefcase className="text-white" /> Experience
          </button>
          <button className="flex text-white items-center gap-2 bg-[#181818] px-4 py-3 rounded-lg hover:bg-opacity-80 transition-colors border border-gray-700/50 hover:border-accent/50">
            <FiFilter className="text-white" /> Category
          </button>
        </div>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-8 px-4">
        <motion.section
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-[#181818] p-6 rounded-xl backdrop-blur-sm border border-gray-700/50"
        >
          <div className="flex items-center gap-2 mb-6">
            <h2 className="text-xl font-semibold text-blue-400">Trending Jobs</h2>
            <span className="px-2 py-1 text-xs bg-green-500/20 text-green-400 rounded-full font-medium">
              LIVE
            </span>
          </div>
          <div className="space-y-4">
            {trendingJobs.map((job, index) => (
              <motion.div
                key={index}
                className="job-card border-b border-zinc-500 pb-[4px]"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <h3 className="font-semibold mb-2">{job.title}</h3>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">{job.salary}</span>
                  <span
                    className={`stat-change ${
                      job.change.startsWith("+")
                        ? "positive text-green-400"
                        : job.change.startsWith("-")
                        ? "negative text-red-400"
                        : "neutral"
                    }`}
                  >
                    {job.change}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-[#181818] p-6 rounded-xl backdrop-blur-sm border border-gray-700/50"
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-blue-400">Highest Paying Roles</h2>
            <select className="bg-gray-800 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent border border-gray-700/50 appearance-none cursor-pointer hover:bg-opacity-80 transition-colors">
              <option>This Month</option>
              <option>Last Month</option>
              <option>This Year</option>
            </select>
          </div>
          <div className="space-y-4">
            {highestPaying.map((job, index) => (
              <motion.div
                key={index}
                className="job-card border-b border-zinc-500 pb-[4px]"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <h3 className="font-semibold mb-2">{job.title}</h3>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">{job.salary}</span>
                  <span
                    className={`stat-change ${
                        job.change.startsWith("+")
                          ? "positive text-green-400"
                          : job.change.startsWith("-")
                          ? "negative text-red-400"
                          : "neutral"
                      }`}
                  >
                    {job.change}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>
      </div>
    </div>
  );
}

export default App;
