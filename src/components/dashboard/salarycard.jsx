// SalaryCard.jsx
"use client";

import { useState, useEffect } from "react";
import { TrendingUp, TrendingDown, ChevronDown } from "lucide-react";
import { getSalaryForecasts } from "@/lib/jobAnalysisService";

export const SalaryCard = ({ jobs }) => {
  const [experienceLevel, setExperienceLevel] = useState("Experience Level");
  const [jobFilter, setJobFilter] = useState("");
  const [hoveredRole, setHoveredRole] = useState(null);
  const [roles, setRoles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function fetchSalaryData() {
      setIsLoading(true);
      try {
        // Pass both filters to the service
        const salaryData = await getSalaryForecasts(
          jobs,
          jobFilter,
          experienceLevel
        );
        setRoles(salaryData);
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchSalaryData();
  }, [jobs, jobFilter, experienceLevel]);

  const handleFilterChange = (type, value) => {
    if (type === "experience") {
      setExperienceLevel(value);
    } else if (type === "jobType") {
      setJobFilter(value);
    }
  };

  return (
    <div className="bg-[#222222] rounded-xl p-6 transform transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/10">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold animate-fade-in">
          Salary Forecast - IT Industry
        </h2>
        <span className="text-emerald-500 text-sm bg-emerald-500/10 px-2 py-1 rounded animate-pulse">
          LIVE
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div className="relative transform transition-all duration-300 hover:scale-[1.02]">
          <select
            value={experienceLevel}
            onChange={(e) => handleFilterChange("experience", e.target.value)}
            className="w-full appearance-none bg-[#333] text-gray-300 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 hover:bg-[#3a3a3a]"
          >
            <option>Experience Level</option>
            <option>Fresher</option>
            <option>1-3 Years</option>
            <option>3-5 Years</option>
            <option>5+ Years</option>
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
        </div>

        <div className="relative transform transition-all duration-300 hover:scale-[1.02]">
          <select
            value={jobFilter}
            onChange={(e) => handleFilterChange("jobType", e.target.value)}
            className="w-full appearance-none bg-[#333] text-gray-300 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 hover:bg-[#3a3a3a]"
          >
            <option value="">All Jobs</option>
            <option value="Web">Web Development</option>
            <option value="App">App Development</option>
            <option value="Data">Data Science</option>
            <option value="DevOps">DevOps</option>
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {roles.map((role, index) => (
            <div
              key={index}
              className={`bg-[#2a2a2a] p-4 rounded-lg transform transition-all duration-300 cursor-pointer
                ${
                  hoveredRole === index
                    ? "scale-[1.02] shadow-lg shadow-blue-500/20"
                    : ""
                }
                hover:bg-[#333] hover:shadow-lg hover:shadow-blue-500/20`}
              onMouseEnter={() => setHoveredRole(index)}
              onMouseLeave={() => setHoveredRole(null)}
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-medium">{role.title}</h3>
                {role.trending ? (
                  <TrendingUp className="w-5 h-5 text-emerald-500 animate-bounce" />
                ) : (
                  <TrendingDown className="w-5 h-5 text-red-500 animate-bounce" />
                )}
              </div>
              <p className="text-2xl font-bold text-blue-500 transition-all duration-300 group-hover:text-cyan-300">
                {role.salary}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
