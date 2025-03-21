"use client"

import React, { useState, useMemo, useRef, useEffect } from "react"
import TinderCard from "react-tinder-card"
import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { careerQuestions } from "@/lib/questions"
import { useGroqAI } from "@/hooks/useGroqAI"
import { ChevronLeft, ChevronRight, RotateCcw, ArrowRight } from "lucide-react"
import { useRouter } from "next/navigation"

const TOTAL_QUESTIONS = 7

export default function CareerSwipe() {
  const [questions, setQuestions] = useState([])
  const [currentIndex, setCurrentIndex] = useState(TOTAL_QUESTIONS - 1)
  const [lastDirection, setLastDirection] = useState()
  const currentIndexRef = useRef(currentIndex)
  const [answers, setAnswers] = useState([])
  const [results, setResults] = useState(null)
  const { analyzeResponses, isLoading, error } = useGroqAI()
  const router =useRouter()
  useEffect(() => {
    // Randomly select 7 questions
    const shuffled = [...careerQuestions].sort(() => 0.5 - Math.random())
    setQuestions(shuffled.slice(0, TOTAL_QUESTIONS))
  }, [])

  const childRefs = useMemo(
    () =>
      Array(TOTAL_QUESTIONS)
        .fill(0)
        .map(() => React.createRef()),
    [],
  )

  const updateCurrentIndex = (val) => {
    setCurrentIndex(val)
    currentIndexRef.current = val
  }

  const canGoBack = currentIndex < TOTAL_QUESTIONS - 1
  const canSwipe = currentIndex >= 0

  const swiped = (direction, nameToDelete, index) => {
    setLastDirection(direction)
    updateCurrentIndex(index - 1)
    setAnswers([...answers, { question: nameToDelete, answer: direction === "right" ? "right" : "left" }])
  }

  const outOfFrame = (name, idx) => {
    console.log(`${name} (${idx}) left the screen!`, currentIndexRef.current)
    currentIndexRef.current >= idx && childRefs[idx].current.restoreCard()
  }

  const swipe = async (dir) => {
    if (canSwipe && currentIndex < TOTAL_QUESTIONS) {
      await childRefs[currentIndex].current.swipe(dir)
    }
  }

  const goBack = async () => {
    if (!canGoBack) return
    const newIndex = currentIndex + 1
    updateCurrentIndex(newIndex)
    await childRefs[newIndex].current.restoreCard()
  }

  useEffect(() => {
    const analyzeResults = async () => {
      if (currentIndex < 0 && !results && !isLoading) {
        const analysis = await analyzeResponses(answers)
        setResults(analysis)
        console.log("AI Analysis:", analysis)
      }
    }

    analyzeResults()
  }, [currentIndex, results, isLoading, analyzeResponses, answers])

  const handleResultSelection = (result) => {
    console.log("Selected career:", result)
  }

  const handleGetStarted = () => {
    console.log("User clicked Get Started")
    router.push("/dashboard")
    
    // Add your logic here for what should happen when the user clicks "Let's Get Started"
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center  h-[90vh] text-white bg-black p-4">
        <h1 className="text-4xl font-bold mb-8 text-center text-[#6366F1]">Error</h1>
        <div className="w-full max-w-md p-6 bg-gray-900 rounded-xl shadow-xl border-2 border-red-500">
          <p className="text-xl text-red-500">{error}</p>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[90vh]  text-white bg-black p-4">
        <h1 className="text-4xl font-bold mb-8 text-center text-[#6366F1]">👨‍🍳 AI is cooking up your results! ✨</h1>
        <div className="w-24 h-24 border-t-4 border-[#57FF31] border-solid rounded-full animate-spin"></div>
        <p className="mt-4 text-xl text-[#57FF31]">Analyzing your tech DNA...</p>
      </div>
    )
  }

  if (results) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-4">
        <h1 className="text-4xl font-bold mb-8 text-center text-[#6366F1]">Your Tech Career Match</h1>
        <div className="w-full max-w-md p-6 bg-gray-900 rounded-xl shadow-xl border-2 border-[#6366F1] mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-[#57FF31]">Top Recommendations:</h2>
          {results.map((result, index) => (
            <Card
              key={index}
              className={`p-4 mb-4 cursor-pointer transition-all duration-300 ${
                index === 0
                  ? "bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] text-white"
                  : "bg-gray-800 hover:bg-gradient-to-r hover:from-[#6366F1] hover:to-[#8B5CF6] hover:text-white"
              }`}
              onClick={() => handleResultSelection(result)}
            >
              <div className="flex justify-between items-center">
                <h3 className="text-2xl font-bold">{result.name}</h3>
                <span className="text-xl font-semibold">{result.percentage}%</span>
              </div>
              <div className="mt-2 h-2 bg-gray-700 rounded-full">
                <div className="h-full bg-[#57FF31] rounded-full" style={{ width: `${result.percentage}%` }}></div>
              </div>
            </Card>
          ))}
        </div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
          <Button
            onClick={handleGetStarted}
            className="bg-[#57FF31] hover:bg-[#45CC20] text-black font-bold py-3 px-6 rounded-full text-lg flex items-center"
          >
            Let's Get Started
            <ArrowRight className="ml-2" />
          </Button>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="bg-black flex flex-col items-center justify-between h-[100vh]  text-white  overflow-hidden">
      <h1 className="text-4xl font-bold mb-4 text-center text-[#6366F1]">Tech Career Compass</h1>
      <div className="w-full max-w-md mb-4 bg-gray-800 rounded-full h-2.5">
        <div
          className="bg-[#57FF31] h-2.5 rounded-full"
          style={{ width: `${((TOTAL_QUESTIONS - currentIndex - 1) / TOTAL_QUESTIONS) * 100}%` }}
        ></div>
      </div>
      <div className="relative w-full max-w-md h-[60vh]">
        {questions.map((question, index) => (
          <TinderCard
            ref={childRefs[index]}
            className="absolute w-full h-full cursor-grab active:cursor-grabbing"
            key={question.question}
            onSwipe={(dir) => swiped(dir, question.question, index)}
            onCardLeftScreen={() => outOfFrame(question.question, index)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.3 }}
              className="w-full h-full"
            >
              <Card className="w-full h-full bg-gray-900 shadow-xl rounded-xl overflow-hidden flex flex-col border-2 border-[#6366F1]">
                <div className="relative h-1/3 overflow-hidden">
                  <img
                    src={`https://picsum.photos/seed/${encodeURIComponent(question.imagePrompt)}/400/100`}
                    alt="Question visual"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent" />
                </div>
                <div className="p-4 flex flex-col flex-grow justify-between">
                  <div>
                    <div className="text-4xl mb-2 text-center">{question.icon}</div>
                    <h2 className="text-xl font-bold text-center mb-4 text-white">{question.question}</h2>
                  </div>
                  <div className="flex justify-between items-center">
                    <motion.div
                      className="bg-[#6366F1] text-white px-4 py-2 rounded-xl text-sm font-semibold text-center flex-1 mr-2"
                      whileHover={{ scale: 1.05, backgroundColor: "#57FF31" }}
                    >
                      👈 {question.leftOption}
                    </motion.div>
                    <motion.div
                      className="bg-[#6366F1] text-white px-4 py-2 rounded-xl text-sm font-semibold text-center flex-1 ml-2"
                      whileHover={{ scale: 1.05, backgroundColor: "#57FF31" }}
                    >
                      {question.rightOption} 👉
                    </motion.div>
                  </div>
                </div>
              </Card>
            </motion.div>
          </TinderCard>
        ))}
      </div>
      <div className="flex justify-center space-x-6 mt-4 mb-4 ">
        <motion.button
          className="bg-[#6366F1] text-white p-3 rounded-full text-lg font-semibold"
          whileHover={{ scale: 1.1, backgroundColor: "#57FF31" }}
          whileTap={{ scale: 0.9 }}
          onClick={() => swipe("left")}
        >
          <ChevronLeft size={24} />
        </motion.button>
        <motion.button
          className="bg-[#6366F1] text-white p-3 rounded-full text-lg font-semibold"
          whileHover={{ scale: 1.1, backgroundColor: "#57FF31" }}
          whileTap={{ scale: 0.9 }}
          onClick={() => goBack()}
          disabled={!canGoBack}
        >
          <RotateCcw size={24} />
        </motion.button>
        <motion.button
          className="bg-[#6366F1] text-white p-3 rounded-full text-lg font-semibold"
          whileHover={{ scale: 1.1, backgroundColor: "#57FF31" }}
          whileTap={{ scale: 0.9 }}
          onClick={() => swipe("right")}
        >
          <ChevronRight size={24} />
        </motion.button>
      </div>
      {lastDirection && (
        <motion.h2
          key={lastDirection}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="text-lg text-[#57FF31]"
        >
          You swiped {lastDirection}
        </motion.h2>
      )}
    </div>
  )
}

