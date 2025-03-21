"use client"
import { motion } from "framer-motion"
import { Briefcase, Code, BarChartIcon as ChartBar, Users, Clock } from "lucide-react"
import SearchBar from "./SearchBar"

const predefinedTopics = [
  { id: "softSkills", name: "Soft Skills", icon: Users },
  { id: "technicalSkills", name: "Technical Skills", icon: Code },
  { id: "leadership", name: "Leadership", icon: Briefcase },
  { id: "dataAnalysis", name: "Data Analysis", icon: ChartBar },
  { id: "projectManagement", name: "Project Management", icon: Clock },
]

const allTopics = [
  "Soft Skills",
  "Technical Skills",
  "Leadership",
  "Data Analysis",
  "Project Management",
  "Communication",
  "Problem Solving",
  "Time Management",
  "Teamwork",
  "Creativity",
  "Critical Thinking",
  "Adaptability",
  "Emotional Intelligence",
  "Negotiation",
  "Public Speaking",
  "Writing",
  "Customer Service",
  "Sales",
  "Marketing",
  "Finance",
  "Human Resources",
  "Operations",
  "Strategy",
  "Innovation",
  "Entrepreneurship",
]

const TopicSelector = ({ onTopicSubmit }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="bg-gray-900 rounded-lg p-6 mb-4 shadow-lg"
    >
      <h2 className="text-2xl font-bold mb-4 text-white">Choose Your Career Topic</h2>
      <SearchBar onSearch={onTopicSubmit} suggestions={allTopics} />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {predefinedTopics.map((topic) => (
          <motion.button
            key={topic.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-4 bg-black border-blue-50 text-white rounded-lg hover:bg-[#5c56d9] transition-colors text-left flex items-center space-x-3"
            onClick={() => onTopicSubmit(topic.name)}
          >
            <topic.icon className="w-6 h-6" />
            <span>{topic.name}</span>
          </motion.button>
        ))}
      </div>
    </motion.div>
  )
}

export default TopicSelector

