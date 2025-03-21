"use client"

import { useState } from "react"
import { motion } from "framer-motion"

const TopicInput = ({ onTopicSubmit }) => {
  const [topic, setTopic] = useState("")

  const handleSubmit = (e) => {
    e.preventDefault()
    if (topic.trim()) {
      onTopicSubmit(topic.trim())
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="bg-gray-900 rounded-lg p-6 mb-4 shadow-lg"
    >
      <h2 className="text-2xl font-bold mb-4 text-white">Choose Your Topic</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="Enter a career-related topic..."
          className="w-full p-3 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4F46E5]"
        />
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          type="submit"
          className="w-full p-3 bg-[#433bcf] text-white rounded-lg hover:bg-[#3c3799] transition-colors text-lg font-semibold"
        >
          Start Quiz
        </motion.button>
      </form>
    </motion.div>
  )
}

export default TopicInput

