"use client"
import { motion } from "framer-motion"

const SkillProgress = ({ skills, skillLevels, currentSkill }) => {
  return (
    <div className="grid grid-cols-5 gap-4 mb-8">
      {skills.map((skill) => (
        <div key={skill.id} className="text-center">
          <div className="mb-2 font-semibold text-sm">{skill.name}</div>
          <motion.div
            className="h-24 bg-gray-800 rounded-lg relative overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              className="absolute bottom-0 w-full bg-[#4F46E5]"
              initial={{ height: 0 }}
              animate={{ height: `${(skillLevels[skill.id] / 10) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
            <div className="absolute inset-0 flex items-center justify-center font-bold text-2xl">
              {skillLevels[skill.id]}
            </div>
          </motion.div>
          {currentSkill === skill.id && (
            <motion.div
              className="mt-2 text-[#57FF31] text-2xl"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            >
              ▲
            </motion.div>
          )}
        </div>
      ))}
    </div>
  )
}

export default SkillProgress

