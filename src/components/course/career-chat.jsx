"use client"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Loader2, Send, User, Bot } from "lucide-react"
import Typewriter from "./typewriter"

export default function CareerChat({ careerPath, scrapedData }) {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Hi there! I'm your AI career advisor. Ask me anything about your career path or how to develop specific skills.",
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const scrollAreaRef = useRef(null)

  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector("[data-radix-scroll-area-viewport]")
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight
      }
    }
  }, [messages])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!input.trim()) return

    const userMessage = { role: "user", content: input }
    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    // Simulate API call to chat endpoint
    setTimeout(() => {
      // Generate a response based on the user's message and career path
      const response = generateResponse(input, careerPath)

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: response,
          isTyping: true,
        },
      ])

      // Simulate typing effect completion
      setTimeout(() => {
        setMessages((prev) => prev.map((msg, idx) => (idx === prev.length - 1 ? { ...msg, isTyping: false } : msg)))
      }, response.length * 15)

      setIsLoading(false)
    }, 1000)
  }

  // Simple response generation based on user input and career path
  const generateResponse = (userInput, careerPath) => {
    const input = userInput.toLowerCase()

    // Extract all skills from career path
    const allSkills = careerPath.flatMap((stage) => stage.skills || [])

    if (input.includes("start") || input.includes("begin") || input.includes("first step")) {
      const firstStage = careerPath[0]
      return `To start your journey as a ${firstStage.title}, focus on these key skills: ${firstStage.skills.join(", ")}. ${firstStage.description}`
    }

    if (input.includes("skill") || input.includes("learn")) {
      const skillsToLearn = allSkills.slice(0, 5).join(", ")
      return `Based on your career path, I recommend focusing on these key skills: ${skillsToLearn}. These skills appear frequently across different career stages and will provide a strong foundation.`
    }

    if (input.includes("resource") || input.includes("course") || input.includes("book")) {
      const resources = careerPath.flatMap((stage) => stage.resources || []).slice(0, 3)
      if (resources.length > 0) {
        return `Here are some great resources to get started: ${resources.map((r) => `"${r.title}"`).join(", ")}. Would you like me to provide more specific resources for a particular skill?`
      } else {
        return `I recommend looking for courses on platforms like Coursera, Udemy, or freeCodeCamp that focus on the key skills in your career path. Is there a specific skill you'd like resources for?`
      }
    }

    if (input.includes("timeline") || input.includes("how long") || input.includes("years")) {
      return `Career progression varies by individual, but typically: ${careerPath.map((stage, i) => `Stage ${i + 1} (${stage.title}): ~${i + 1}-${i + 2} years`).join(", ")}. Remember that your pace may differ based on your dedication, prior experience, and opportunities.`
    }

    // Default response
    return `I'm here to help with your career journey! You can ask me about specific skills to develop, resources to learn from, timeline expectations, or any other questions about your career path.`
  }

  return (
    <Card className="h-[70vh] flex flex-col bg-black/30 backdrop-blur-md shadow-xl rounded-xl overflow-hidden border border-gray-800">
      <CardContent className="flex-grow flex flex-col p-4 h-full">
        <ScrollArea className="flex-grow mb-4 pr-4" ref={scrollAreaRef}>
          <div className="space-y-4 pb-2">
            {messages.map((message, index) => (
              <div key={index} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`flex items-start max-w-[80%] ${message.role === "user" ? "flex-row-reverse" : ""}`}>
                  <div
                    className={`flex items-center justify-center w-8 h-8 rounded-full shrink-0 ${
                      message.role === "user" ? "bg-[#4F46E5] ml-3" : "bg-[#57FF31] mr-3"
                    }`}
                  >
                    {message.role === "user" ? (
                      <User className={`text-white w-4 h-4`} />
                    ) : (
                      <Bot className={`text-black w-4 h-4`} />
                    )}
                  </div>
                  <div
                    className={`p-3 rounded-xl ${
                      message.role === "user"
                        ? "bg-[#4F46E5] text-white"
                        : "bg-gray-800 text-white border border-gray-700"
                    }`}
                  >
                    {message.role === "assistant" && message.isTyping ? (
                      <Typewriter text={message.content} />
                    ) : (
                      <div>{message.content}</div>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[#57FF31] mr-3">
                  <Bot className="text-black w-4 h-4" />
                </div>
                <div className="p-3 rounded-xl bg-gray-800 text-white border border-gray-700">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 rounded-full bg-gray-500 animate-pulse"></div>
                    <div className="w-2 h-2 rounded-full bg-gray-500 animate-pulse delay-150"></div>
                    <div className="w-2 h-2 rounded-full bg-gray-500 animate-pulse delay-300"></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
        <form onSubmit={handleSubmit} className="flex gap-3 mt-auto">
          <Input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about your career path..."
            className="flex-grow rounded-xl border-gray-700 focus:border-[#57FF31] focus:ring-1 focus:ring-[#57FF31] bg-black/50 text-white"
          />
          <Button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="bg-[#57FF31] hover:bg-[#4F46E5] text-black hover:text-white font-medium rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

