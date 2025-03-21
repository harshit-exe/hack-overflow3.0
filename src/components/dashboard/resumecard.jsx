'use client';

import { Upload } from 'lucide-react';

export const ResumeCard = () => {
  return (
    <div className="bg-[#222222] rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">Resume Strength Indicator</h2>
        <span className="text-emerald-500 text-sm bg-emerald-500/10 px-2 py-1 rounded">LIVE</span>
      </div>

      <div className="flex flex-col items-center mb-8">
        <div className="relative w-32 h-32">
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-4xl font-bold">78</span>
          </div>
          <svg className="transform -rotate-90 w-32 h-32">
            <circle
              cx="64"
              cy="64"
              r="56"
              className="stroke-[#333]"
              strokeWidth="8"
              fill="none"
            />
            <circle
              cx="64"
              cy="64"
              r="56"
              className="stroke-blue-500"
              strokeWidth="8"
              fill="none"
              strokeDasharray="351.86"
              strokeDashoffset="77.41"
            />
          </svg>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-blue-500" />
          <span className="text-gray-300">Add more project details</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-blue-500" />
          <span className="text-gray-300">Include relevant keywords</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-blue-500" />
          <span className="text-gray-300">Optimize summary section</span>
        </div>
      </div>

      <button className="w-full mt-6 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg flex items-center justify-center gap-2">
        <Upload className="w-4 h-4" />
        Upload Resume to Improve
      </button>
    </div>
  );
};