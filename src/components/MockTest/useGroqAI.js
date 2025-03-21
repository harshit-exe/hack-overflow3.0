"use client"

import { useState } from "react"

const GROQ_API_KEY = "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"
const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions"

export function useGroqAI() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const extractJsonFromContent = (content) => {
    try {
      // Try direct parsing first
      return JSON.parse(content);
    } catch (error) {
      // Look for JSON array in markdown code blocks or otherwise
      const jsonRegex = /\[[\s\S]*\]/m; // Match anything that looks like a JSON array
      const match = content.match(jsonRegex);
      
      if (match && match[0]) {
        try {
          return JSON.parse(match[0]);
        } catch (innerError) {
          throw new Error("Could not parse JSON from response content");
        }
      }
      throw new Error("No valid JSON array found in the response");
    }
  };

  const generateQuestions = async (topic, count = 5) => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await fetch(GROQ_API_URL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [
            {
              role: "system",
              content: `You are an AI that generates multiple-choice questions for career skills practice. Focus on creating questions that test and improve knowledge and skills related to ${topic} in a professional context. Each question should have 4 options with one correct answer. Return your response as a proper JSON array, without markdown formatting.`,
            },
            {
              role: "user",
              content: `Generate ${count} multiple-choice questions about ${topic} in a professional setting. Provide the questions as a JSON array of objects, where each object has the following structure: { question: string, options: string[], correctAnswer: string }. DO NOT include any markdown formatting or explanation text - only the JSON array.`,
            },
          ],
          max_tokens: 1000,
          temperature: 0.7,
        }),
      })

      if (!response.ok) {
        throw new Error(`Failed to generate questions: ${response.status} ${response.statusText}`)
      }

      const data = await response.json()
      const content = data.choices[0].message.content
      
      // Use the new extraction function
      const questionsJson = extractJsonFromContent(content)

      if (!Array.isArray(questionsJson)) {
        throw new Error("AI response is not an array of questions")
      }

      return questionsJson
    } catch (error) {
      console.error("Error generating questions:", error)
      setError(error.message || "Failed to generate questions. Please try again later.")
      return []
    } finally {
      setIsLoading(false)
    }
  }

  const generateCareerPath = async (topic) => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await fetch(GROQ_API_URL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [
            {
              role: "system",
              content: `You are an AI career advisor that generates career paths and skill progressions. Return your response as a proper JSON array, without markdown formatting.`,
            },
            {
              role: "user",
              content: `Generate a career path for someone interested in ${topic}. Provide a JSON array of 5 skills or milestones, where each object has the following structure: { name: string, description: string }. DO NOT include any markdown formatting or explanation text - only the JSON array.`,
            },
          ],
          max_tokens: 1000,
          temperature: 0.7,
        }),
      })

      if (!response.ok) {
        throw new Error(`Failed to generate career path: ${response.status} ${response.statusText}`)
      }

      const data = await response.json()
      const content = data.choices[0].message.content
      
      // Use the same extraction function for consistency
      const careerPathJson = extractJsonFromContent(content)

      if (!Array.isArray(careerPathJson)) {
        throw new Error("AI response is not an array of career path steps")
      }

      return careerPathJson
    } catch (error) {
      console.error("Error generating career path:", error)
      setError(error.message || "Failed to generate career path. Please try again later.")
      return []
    } finally {
      setIsLoading(false)
    }
  }

  return { generateQuestions, generateCareerPath, isLoading, error }
}