"use client"

import { useState } from "react"
import { AnimatePresence } from "framer-motion"
import { Loader } from "lucide-react"
import TopicInput from "@/components/MockTest/TopicInput"
import QuizQuestion from "@/components/MockTest/QuizQuestion"
import QuizResults from "@/components/MockTest/QuizResults"
import { useGroqAI } from "@/components/MockTest/useGroqAI"
import CareerPathVisualizer from "@/components/MockTest/CareerPathVisualizer"
import TopicSelector from "@/components/MockTest/TopicSelector"

export default function CareerDevelopmentHub() {
  const [currentTopic, setCurrentTopic] = useState("")
  const [questions, setQuestions] = useState([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [userAnswers, setUserAnswers] = useState([])
  const [quizCompleted, setQuizCompleted] = useState(false)
  const [quizStarted, setQuizStarted] = useState(false)
  const [careerPath, setCareerPath] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  const { generateQuestions, generateCareerPath, error } = useGroqAI()

  const handleTopicSubmit = async (topic) => {
    setCurrentTopic(topic)
    setIsLoading(true)
    try {
      const [newQuestions, path] = await Promise.all([generateQuestions(topic), generateCareerPath(topic)])
      setQuestions(newQuestions)
      setCareerPath(path)
      setQuizStarted(true)
    } catch (error) {
      console.error("Error starting quiz:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleAnswer = (answer) => {
    const newAnswers = [...userAnswers, answer]
    setUserAnswers(newAnswers)

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    } else {
      setQuizCompleted(true)
    }
  }

  const restartQuiz = () => {
    setCurrentTopic("")
    setQuestions([])
    setCurrentQuestionIndex(0)
    setUserAnswers([])
    setQuizCompleted(false)
    setQuizStarted(false)
    setCareerPath([])
  }

  return (
    <div className="min-h-screen bg-transparent bg-contain text-white p-4">
      <h1 className="text-4xl font-bold text-center mb-8 text-white">CAREER DEVELOPMENT HUB</h1>
      <div className="max-w-4xl mx-auto">
        <AnimatePresence mode="wait">
          {!quizStarted && <TopicSelector onTopicSubmit={handleTopicSubmit} />}
          {isLoading && (
            <div className="flex justify-center items-center h-64">
              <Loader className="w-12 h-12 animate-spin text-[#57FF31]" />
            </div>
          )}
          {error && <div className="bg-red-500 text-white p-4 rounded-lg text-center">{error}</div>}
          {quizStarted && !quizCompleted && questions.length > 0 && (
            <>
              <QuizQuestion
                question={questions[currentQuestionIndex]}
                onAnswer={handleAnswer}
                progress={(currentQuestionIndex + 1) / questions.length}
              />
              <CareerPathVisualizer topic={currentTopic} skills={careerPath} />
            </>
          )}
          {quizCompleted && (
            <>
              <QuizResults
                topic={currentTopic}
                questions={questions}
                userAnswers={userAnswers}
                onRestart={restartQuiz}
              />
              <CareerPathVisualizer topic={currentTopic} skills={careerPath} />
            </>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
