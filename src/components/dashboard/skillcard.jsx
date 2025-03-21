'use client';

import { useState } from 'react';
import { TrendingUp } from 'lucide-react';

export const SkillsCard = () => {
  const [hoveredSkill, setHoveredSkill] = useState(null);

  const skills = [
    { rank: 1, name: 'Data Analysis', color: 'text-cyan-400' },
    { rank: 2, name: 'UI/UX Design', color: 'text-cyan-400' },
    { rank: 3, name: 'React.js', color: 'text-cyan-400' },
    { rank: 4, name: 'Python', color: 'text-cyan-400' },
    { rank: 5, name: 'Digital Marketing', color: 'text-cyan-400' },
  ];

  return (
    <div className="bg-[#222222] rounded-xl p-6 transform transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/10">
      <div className="flex items-center gap-3 mb-2">
        <TrendingUp className="w-6 h-6 text-emerald-500 animate-bounce" />
        <h2 className="text-2xl font-semibold animate-fade-in">In-Demand Skills</h2>
        <span className="text-emerald-500 text-sm bg-emerald-500/10 px-2 py-1 rounded ml-auto animate-pulse">LIVE</span>
      </div>
      <p className="text-gray-400 mb-8">Top trending skills with ranking</p>

      <div className="space-y-4">
        {skills.map((skill, index) => (
          <div
            key={index}
            className={`bg-[#2a2a2a] p-4 rounded-lg flex items-center gap-4 transform transition-all duration-300 cursor-pointer
              ${hoveredSkill === index ? 'scale-[1.02] shadow-lg shadow-blue-500/20' : ''}
              hover:bg-[#333] hover:shadow-lg hover:shadow-blue-500/20`}
            onMouseEnter={() => setHoveredSkill(index)}
            onMouseLeave={() => setHoveredSkill(null)}
          >
            <span className={`text-3xl font-bold ${skill.color} transition-all duration-300`}>
              {skill.rank}
            </span>
            <span className="text-xl transition-all duration-300">{skill.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};