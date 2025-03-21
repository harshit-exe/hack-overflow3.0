"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown, ChevronUp } from "lucide-react"

const CareerPathVisualizer = ({ topic, skills }) => {
  const [expandedSkill, setExpandedSkill] = useState(null)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="bg-gray-900 rounded-lg p-6 mb-4 shadow-lg"
    >
      <h2 className="text-2xl font-bold mb-4 text-white">Career Path: {topic}</h2>
      <div className="relative">
        <div className="absolute left-4 top-0 bottom-0 w-1 bg-[#4F46E5]"></div>
        {skills.map((skill, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="ml-10 mb-4 relative"
          >
            <div className="absolute -left-10 top-1 w-4 h-4 rounded-full bg-[#57FF31] border-4 border-[#4F46E5]"></div>
            <motion.div
              className="bg-gray-800 p-4 rounded-lg cursor-pointer"
              onClick={() => setExpandedSkill(expandedSkill === index ? null : index)}
            >
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-white">{skill.name}</h3>
                {expandedSkill === index ? (
                  <ChevronUp className="text-white" />
                ) : (
                  <ChevronDown className="text-white" />
                )}
              </div>
              <AnimatePresence>
                {expandedSkill === index && (
                  <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="text-gray-400 mt-2"
                  >
                    {skill.description}
                  </motion.p>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}

export default CareerPathVisualizer

