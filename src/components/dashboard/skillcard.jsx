// SkillsCard.jsx
"use client";

import { useState, useEffect } from "react";
import { TrendingUp } from "lucide-react";
import { getInDemandSkills } from "@/lib/jobAnalysisService";

export const SkillsCard = ({ jobs }) => {
  const [hoveredSkill, setHoveredSkill] = useState(null);
  const [skills, setSkills] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [jobTitleFilter, setJobTitleFilter] = useState("");

  useEffect(() => {
    async function fetchSkillsData() {
      setIsLoading(true);
      try {
        const skillsData = await getInDemandSkills(jobs, jobTitleFilter);
        setSkills(skillsData);
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchSkillsData();
  }, [jobs, jobTitleFilter]);

  return (
    <div className="bg-[#222222] rounded-xl p-6 transform transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/10">
      <div className="flex items-center gap-3 mb-2">
        <TrendingUp className="w-6 h-6 text-emerald-500 animate-bounce" />
        <h2 className="text-2xl font-semibold animate-fade-in">
          In-Demand Skills
        </h2>
        <span className="text-emerald-500 text-sm bg-emerald-500/10 px-2 py-1 rounded ml-auto animate-pulse">
          LIVE
        </span>
      </div>
      <p className="text-gray-400 mb-4">Top trending skills with ranking</p>

      <div className="mb-6">
        <input
          type="text"
          placeholder="Filter by job title (e.g., Frontend Developer)"
          value={jobTitleFilter}
          onChange={(e) => setJobTitleFilter(e.target.value)}
          className="w-full bg-[#333] text-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="space-y-4">
          {skills?.map((skill, index) => (
            <div
              key={index}
              className={`bg-[#2a2a2a] p-4 rounded-lg flex items-center gap-4 transform transition-all duration-300 cursor-pointer
                ${
                  hoveredSkill === index
                    ? "scale-[1.02] shadow-lg shadow-blue-500/20"
                    : ""
                }
                hover:bg-[#333] hover:shadow-lg hover:shadow-blue-500/20`}
              onMouseEnter={() => setHoveredSkill(index)}
              onMouseLeave={() => setHoveredSkill(null)}
            >
              <span
                className={`text-3xl font-bold text-cyan-400 transition-all duration-300`}
              >
                {skill.rank}
              </span>
              <span className="text-xl transition-all duration-300">
                {skill.name}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
