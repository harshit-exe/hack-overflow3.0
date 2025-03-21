// JobMarketTrends.jsx
"use client";

import { useState, useEffect } from "react";
import { getTrendingJobs } from "@/lib/jobAnalysisService";

export const JobMarketTrends = ({ jobs }) => {
  const [timeframe, setTimeframe] = useState("Last 30 days");
  const [jobData, setJobData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function fetchTrendingJobs() {
      if (jobs && jobs.length > 0) {
        setIsLoading(true);
        try {
          const trendingJobs = await getTrendingJobs(jobs);
          setJobData(trendingJobs);
        } catch (error) {
          console.error("Error:", error);
        } finally {
          setIsLoading(false);
        }
      }
    }

    fetchTrendingJobs();
  }, [jobs, timeframe]); // Re-fetch if jobs data or timeframe changes

  const maxOpenings = Math.max(...(jobData.map((job) => job.openings) || [1]));

  return (
    <div className="bg-[#222222] rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">Job Market Trends</h2>
        <span className="text-emerald-500 text-sm bg-emerald-500/10 px-2 py-1 rounded">
          LIVE
        </span>
      </div>

      <div className="flex gap-4 mb-6">
        <button
          className={`px-4 py-1.5 rounded-lg text-sm ${
            timeframe === "Last 30 days"
              ? "bg-blue-500 text-white"
              : "bg-[#333] text-gray-300"
          }`}
          onClick={() => setTimeframe("Last 30 days")}
        >
          Last 30 days
        </button>
        <button
          className={`px-4 py-1.5 rounded-lg text-sm ${
            timeframe === "This Year"
              ? "bg-blue-500 text-white"
              : "bg-[#333] text-gray-300"
          }`}
          onClick={() => setTimeframe("This Year")}
        >
          This Year
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {jobData.map((job, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-300">{job.role || job.title}</span>
                  <span className="text-gray-400">{job.openings}</span>
                </div>
                <div className="h-2 bg-[#333] rounded-full">
                  <div
                    className="h-full bg-blue-500 rounded-full"
                    style={{
                      width: `${(job.openings / maxOpenings) * 100}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 text-xs text-gray-500">
            {jobData.length > 0 && jobData[0].role
              ? `${
                  jobData[0].role || jobData[0].title
                } showing highest demand in ${timeframe.toLowerCase()}`
              : "Analyzing job market trends..."}
          </div>
        </>
      )}
    </div>
  );
};
