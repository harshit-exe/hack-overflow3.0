"use client"
import { motion } from "framer-motion"

const QuizQuestion = ({ question, onAnswer, progress }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="bg-gray-900 rounded-lg p-6 mb-4 shadow-lg"
    >
      <h2 className="text-2xl font-bold mb-4 text-white">{question.question}</h2>
      <div className="space-y-4">
        {question.options.map((option, index) => (
          <motion.button
            key={index}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full p-4 bg-[#2b2a41] text-white rounded-lg hover:bg-[#5049d4] transition-colors text-left"
            onClick={() => onAnswer(option)}
          >
            {option}
          </motion.button>
        ))}
      </div>
      <div className="mt-6 bg-gray-800 rounded-full h-2">
        <motion.div
          className="bg-[#29e2ff] h-2 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progress * 100}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>
    </motion.div>
  )
}

export default QuizQuestion

