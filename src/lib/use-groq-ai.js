"use client"

import { useState } from "react"

const GROQ_API_KEY ="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"
const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions"


export function useGroqAI() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const sanitizeJsonString = (str) => {
    let cleaned = str.trim()
    const startIndex = cleaned.indexOf("[")
    const endIndex = cleaned.lastIndexOf("]")

    if (startIndex !== -1 && endIndex !== -1) {
      cleaned = cleaned.substring(startIndex, endIndex + 1)
    }

    return cleaned
  }

  const validateCareerStage = (stage) => {
    const defaultStage = {
      title: "Untitled Stage",
      description: "No description provided.",
      skills: [],
      actions: [],
      milestones: [],
      resources: [],
    }

    if (!stage || typeof stage !== "object") {
      return defaultStage
    }

    return {
      title: typeof stage.title === "string" ? stage.title : defaultStage.title,
      description: typeof stage.description === "string" ? stage.description : defaultStage.description,
      skills: Array.isArray(stage.skills)
        ? stage.skills.filter((item) => typeof item === "string")
        : defaultStage.skills,
      actions: Array.isArray(stage.actions)
        ? stage.actions.filter((item) => typeof item === "string")
        : defaultStage.actions,
      milestones: Array.isArray(stage.milestones)
        ? stage.milestones.filter((item) => typeof item === "string")
        : defaultStage.milestones,
      resources: Array.isArray(stage.resources)
        ? stage.resources.filter(
            (item) =>
              item && typeof item === "object" && typeof item.title === "string" && typeof item.url === "string",
          )
        : defaultStage.resources,
    }
  }

  const summarizeScrapedContent = (scrapedContent) => {
    if (!scrapedContent) return ""

    let summary = ""
    if (scrapedContent.title) summary += `Title: ${scrapedContent.title}\n`
    if (scrapedContent.description) summary += `Description: ${scrapedContent.description}\n`

    if (scrapedContent.headings && scrapedContent.headings.length > 0) {
      summary += "Key Headings:\n"
      scrapedContent.headings.slice(0, 5).forEach((heading) => {
        summary += `- ${heading.text}\n`
      })
    }

    if (scrapedContent.careerInfo) {
      const { jobTitle, responsibilities, qualifications, skills } = scrapedContent.careerInfo
      if (jobTitle) summary += `Job Title: ${jobTitle}\n`
      if (responsibilities && responsibilities.length > 0) {
        summary += "Key Responsibilities:\n"
        responsibilities.slice(0, 3).forEach((resp) => (summary += `- ${resp}\n`))
      }
      if (qualifications && qualifications.length > 0) {
        summary += "Key Qualifications:\n"
        qualifications.slice(0, 3).forEach((qual) => (summary += `- ${qual}\n`))
      }
      if (skills && skills.length > 0) {
        summary += "Key Skills:\n"
        skills.slice(0, 5).forEach((skill) => (summary += `- ${skill}\n`))
      }
    }

    return summary.trim()
  }

  const generateCareerPath = async (userInput, scrapedContent) => {
    setIsLoading(true)
    setError(null)

    try {
      const summarizedContent = summarizeScrapedContent(scrapedContent)

      const response = await fetch(GROQ_API_URL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
        model: "deepseek-r1-distill-llama-70b",
          messages: [
            {
              role: "system",
              content:
                "You are an AI assistant that creates detailed and well-structured career paths based on user input and summarized job information. Always respond with a valid JSON array containing career stage objects.",
            },
            {
              role: "user",
              content: `Create a comprehensive career path based on the following information:
                User Input: ${userInput}
                Summarized Content: ${summarizedContent}
                
                Use the summarized content (if available) to enhance the career path with specific details.
                If no summarized content is available, create a general career path based on the user input.
                
                Return ONLY a JSON array of career stage objects with the following structure:
                [
                  {
                    "title": "Career Stage Title",
                    "description": "Stage description (2-3 sentences)",
                    "skills": ["skill1", "skill2", "skill3"],
                    "actions": ["action1", "action2", "action3"],
                    "milestones": ["milestone1", "milestone2", "milestone3"],
                    "resources": [{"title": "Resource Title", "url": "resource_url"}]
                  }
                ]
                Provide 3-5 career stages, starting from entry-level and progressing to senior positions.`,
            },
          ],
          max_tokens: 2000,
          temperature: 0.7,
        }),
      })

      if (!response.ok) {
        throw new Error(
          response.status === 404
            ? "Groq AI API endpoint not found"
            : response.status === 429
              ? "Rate limit exceeded"
              : `API request failed: ${response.status} ${response.statusText}`,
        )
      }

      const data = await response.json()
      const generatedContent = data.choices[0].message.content

      const cleanedContent = sanitizeJsonString(generatedContent)

      let careerPathJson
      try {
        careerPathJson = JSON.parse(cleanedContent)
      } catch (parseError) {
        console.error("Initial parsing error:", parseError)
        console.log("Raw content:", generatedContent)
        console.log("Cleaned content:", cleanedContent)

        const jsonMatch = cleanedContent.match(/\[\s*{[\s\S]*}\s*\]/)
        if (jsonMatch) {
          try {
            careerPathJson = JSON.parse(jsonMatch[0])
          } catch (retryError) {
            throw new Error("Failed to parse the JSON response after multiple attempts")
          }
        } else {
          throw new Error("No valid JSON array structure found in the response")
        }
      }

      if (!Array.isArray(careerPathJson)) {
        throw new Error("Response is not a valid array of career stages")
      }

      const validatedCareerPath = careerPathJson.map(validateCareerStage)

      return validatedCareerPath
    } catch (error) {
      console.error("Career path generation error:", error)
      setError(error.message || "Failed to generate career path. Please try again.")
      return []
    } finally {
      setIsLoading(false)
    }
  }

  return { generateCareerPath, isLoading, error }
}

