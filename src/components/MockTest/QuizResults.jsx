"use client"
import { motion } from "framer-motion"
import { CheckCircle, XCircle } from "lucide-react"

const QuizResults = ({ topic, questions, userAnswers, onRestart }) => {
  const correctAnswers = userAnswers.filter((answer, index) => answer === questions[index].correctAnswer).length
  const score = Math.round((correctAnswers / questions.length) * 100)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="bg-gray-900 rounded-lg p-6 text-center shadow-lg"
    >
      <h2 className="text-3xl font-bold mb-4 text-[#31d2ff]">Quiz Completed!</h2>
      <p className="text-xl mb-6">
        Your score on {topic}: <span className="font-bold text-[#4F46E5]">{score}%</span>
      </p>
      <div className="space-y-4 mb-6 text-left">
        {questions.map((q, index) => (
          <div key={index} className="flex items-start">
            {userAnswers[index] === q.correctAnswer ? (
              <CheckCircle className="text-[#57FF31] mr-2 mt-1 flex-shrink-0" />
            ) : (
              <XCircle className="text-red-500 mr-2 mt-1 flex-shrink-0" />
            )}
            <div>
              <p className="font-semibold">{q.question}</p>
              <p className="text-sm text-gray-400">Your answer: {userAnswers[index]}</p>
              <p className="text-sm text-[#57FF31]">Correct answer: {q.correctAnswer}</p>
            </div>
          </div>
        ))}
      </div>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="px-6 py-3 bg-[#232060] text-white rounded-lg hover:bg-[#574ff7] transition-colors text-lg font-semibold"
        onClick={onRestart}
      >
        Start New Quiz
      </motion.button>
    </motion.div>
  )
}

export default QuizResults

