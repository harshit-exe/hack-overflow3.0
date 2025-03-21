'use client';

import { useState } from 'react';

export const JobMarketTrends = () => {
  const [timeframe, setTimeframe] = useState('Last 30 days');
  
  const jobData = [
    { role: 'Frontend Developer', openings: 80 },
    { role: 'Backend Developer', openings: 70 },
    { role: 'Data Scientist', openings: 65 },
    { role: 'Product Manager', openings: 55 },
  ];

  const maxOpenings = Math.max(...jobData.map(job => job.openings));

  return (
    <div className="bg-[#222222] rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">Job Market Trends</h2>
        <span className="text-emerald-500 text-sm bg-emerald-500/10 px-2 py-1 rounded">LIVE</span>
      </div>

      <div className="flex gap-4 mb-6">
        <button
          className={`px-4 py-1.5 rounded-lg text-sm ${
            timeframe === 'Last 30 days'
              ? 'bg-blue-500 text-white'
              : 'bg-[#333] text-gray-300'
          }`}
          onClick={() => setTimeframe('Last 30 days')}
        >
          Last 30 days
        </button>
        <button
          className={`px-4 py-1.5 rounded-lg text-sm ${
            timeframe === 'This Year'
              ? 'bg-blue-500 text-white'
              : 'bg-[#333] text-gray-300'
          }`}
          onClick={() => setTimeframe('This Year')}
        >
          This Year
        </button>
      </div>

      <div className="space-y-4">
        {jobData.map((job, index) => (
          <div key={index} className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-300">{job.role}</span>
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
        Frontend Developer showing highest demand in {timeframe.toLowerCase()}
      </div>
    </div>
  );
};