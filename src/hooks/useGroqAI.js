"use client"

import { useState } from "react"

const GROQ_API_KEY ="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"
const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions"
const careerFields = [
    "Front End Developer",
    "Back End Developer",
    "UI/UX",
    "AI/ML",
    "Data Analytics",
    "Blockchain",
    "Mobile Developer",
    "Cloud Engineer",
    "Cybersecurity Specialist",
    "DevOps Engineer",
  ]
  
  export function useGroqAI() {
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState(null)
  
    const analyzeResponses = async (responses) => {
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
            model: "gemma2-9b-it",
            messages: [
              { role: "system", content: "You are an AI career advisor specializing in technology fields." },
              {
                role: "user",
                content: `Based on these user responses to career questions: ${JSON.stringify(responses)}, suggest the top 3 most suitable technology fields for the user from this list: ${careerFields.join(", ")}. Provide a confidence percentage for each. Format your response as a JSON array of objects with fields: name and percentage. Ensure the response is valid JSON.`,
              },
            ],
            max_tokens: 500,
            temperature: 0.7,
          }),
        })
  
        if (!response.ok) {
          throw new Error(`Failed to analyze responses: ${response.status} ${response.statusText}`)
        }
  
        const data = await response.json()
        const content = data.choices[0].message.content
  
        let analysisJson
        try {
          analysisJson = JSON.parse(content)
        } catch (parseError) {
          console.error("Error parsing Groq AI response:", parseError)
          console.log("Raw response:", content)
  
          // Attempt to extract JSON from the response
          const jsonMatch = content.match(/\[[\s\S]*\]/)
          if (jsonMatch) {
            try {
              analysisJson = JSON.parse(jsonMatch[0])
            } catch (extractError) {
              console.error("Error extracting JSON from response:", extractError)
              throw new Error("Failed to parse career suggestions from Groq AI response")
            }
          } else {
            throw new Error("No valid JSON found in the Groq AI response")
          }
        }
  
        if (!Array.isArray(analysisJson)) {
          throw new Error("Groq AI response is not an array of career suggestions")
        }
  
        return analysisJson
      } catch (error) {
        console.error("Error analyzing responses with Groq AI:", error)
        setError(error.message || "Failed to analyze responses. Please try again later.")
        return []
      } finally {
        setIsLoading(false)
      }
    }
  
    return { analyzeResponses, isLoading, error }
  }
  
  
  