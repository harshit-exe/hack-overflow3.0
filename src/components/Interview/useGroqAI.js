"use client"

import { useState, useCallback } from "react"

// Fallback API key in case the provided one doesn't work
// In a production app, this should be an environment variable
const GROQ_API_KEY = "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"
const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions"

export function useGroqAI() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [retryCount, setRetryCount] = useState(0)

  const callGroqAPI = useCallback(
    async (messages, model = "deepseek-r1-distill-llama-70b", maxTokens = 150, temperature = 0.7) => {
      setIsLoading(true)
      setError(null)

      try {
        console.log("Calling Groq API with messages:", messages)

        const response = await fetch(GROQ_API_URL, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${GROQ_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: model,
            messages: messages,
            max_tokens: maxTokens,
            temperature: temperature,
          }),
        })

        if (!response.ok) {
          const errorData = await response.text()
          console.error("Groq API error response:", errorData)
          throw new Error(`Failed to call Groq API: ${response.status} ${response.statusText}`)
        }

        const data = await response.json()
        console.log("Groq API response:", data)

        if (!data.choices || !data.choices[0] || !data.choices[0].message) {
          throw new Error("Invalid response format from Groq API")
        }

        return data.choices[0].message.content.trim()
      } catch (error) {
        console.error("Error calling Groq API:", error)
        setError(error.message)

        // If we haven't retried too many times, try with a fallback approach
        if (retryCount < 2) {
          setRetryCount((prev) => prev + 1)

          // Fallback to a simpler response
          return generateFallbackResponse(messages)
        }

        return "Failed to process request. Please try again."
      } finally {
        setIsLoading(false)
      }
    },
    [retryCount],
  )

  // Generate a fallback response when the API fails
  const generateFallbackResponse = (messages) => {
    const userMessage = messages.find((m) => m.role === "user")?.content || ""

    if (userMessage.includes("interview question")) {
      return "Tell me about a challenging project you worked on and how you overcame obstacles."
    } else if (userMessage.includes("evaluate")) {
      return "Your answer shows good understanding of the topic. Consider adding more specific examples to strengthen your points. Overall score: 75/100"
    } else if (userMessage.includes("career advice")) {
      return "1. Recommended skills: Focus on both technical and soft skills. Learn the fundamentals thoroughly.\n2. Entry points: Consider internships or entry-level positions to gain experience.\n3. Career progression: Set clear goals and continuously update your skills.\n4. Job market: Research current trends and in-demand technologies in your field."
    } else {
      return "I'm sorry, I couldn't process your request through the API. Please try again later."
    }
  }

  const generateQuestion = useCallback(
    async (interviewType, difficulty = "medium") => {
      const messages = [
        {
          role: "system",
          content: "You are an AI assistant that generates concise interview questions for software developers.",
        },
        {
          role: "user",
          content: `Generate a short 4-5 line, ${difficulty} interview question for a ${interviewType} developer position. Keep it under 20 words.`,
        },
      ]
      return callGroqAPI(messages)
    },
    [callGroqAPI],
  )

  const evaluateAnswer = useCallback(
    async (question, answer, detailedFeedback = false) => {
      const maxTokens = detailedFeedback ? 300 : 150
      const messages = [
        { role: "system", content: "You are an AI assistant that evaluates interview answers." },
        {
          role: "user",
          content: `Question: ${question}
Answer: ${answer}

${detailedFeedback ? "Provide detailed feedback with specific improvement suggestions and a numerical score from 0-100." : "Evaluate the answer and provide short, constructive feedback in 2-3 sentences."}`,
        },
      ]
      return callGroqAPI(messages,"deepseek-r1-distill-llama-70b", maxTokens)
    },
    [callGroqAPI],
  )

  const generateCareerAdvice = useCallback(
    async (careerPath, educationLevel, strengths, weaknesses) => {
      const messages = [
        {
          role: "system",
          content: "You are a career guidance counselor with expertise in professional development and job markets.",
        },
        {
          role: "user",
          content: `Based on this information:
        - Career interest: ${careerPath}
        - Education level: ${educationLevel}
        - Strengths: ${strengths || "Not specified"}
        - Areas for improvement: ${weaknesses || "Not specified"}
        
        Provide personalized career advice including:
        1. Recommended skills to develop
        2. Potential entry points into the field
        3. Long-term career progression
        4. Current job market insights
        Keep it concise but informative.`,
        },
      ]
      return callGroqAPI(messages, "deepseek-r1-distill-llama-70b", 400, 0.7)
    },
    [callGroqAPI],
  )

  const generateHint = useCallback(
    async (question) => {
      const messages = [
        {
          role: "system",
          content: "You are an AI assistant that provides helpful hints for interview questions.",
        },
        {
          role: "user",
          content: `For this interview question: "${question}", provide a short, helpful hint that guides the user without giving away the full answer. Keep it under 100 characters if possible.`,
        },
      ]

      return callGroqAPI(messages, "deepseek-r1-distill-llama-70b", 100, 0.7)
    },
    [callGroqAPI],
  )

  return {
    generateQuestion,
    evaluateAnswer,
    generateCareerAdvice,
    generateHint,
    isLoading,
    error,
  }
}

