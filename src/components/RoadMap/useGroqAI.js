"use client"

import { useState, useCallback } from "react"

const GROQ_API_KEY ="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"
const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions"

export function useGroqAI() {
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState(null)
  
    const generateSubtasks = useCallback(async (prompt) => {
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
            model: "mixtral-8x7b-32768",
            messages: [
              {
                role: "system",
                content:
                  "You are an AI assistant that creates detailed career development roadmaps. Format your response as a structured JSON object with nodes and edges for visualization.",
              },
              {
                role: "user",
                content: `${prompt}
                
                Format the response as a JSON object with this exact structure:
                {
                  "nodes": [
                    {
                      "id": "1",
                      "type": "customNode",
                      "data": {
                        "label": "Step Title",
                        "timeframe": "Duration",
                        "skills": ["skill1", "skill2", "skill3"],
                        "resources": [
                          {
                            "name": "Resource Name",
                            "url": "https://example.com"
                          }
                        ],
                        "certifications": ["Certification 1"],
                        "isExpanded": false
                      },
                      "position": { "x": 0, "y": 0 }
                    }
                  ],
                  "edges": [
                    {
                      "id": "e1-2",
                      "source": "1",
                      "target": "2",
                      "type": "smoothstep",
                      "animated": true
                    }
                  ]
                }`,
              },
            ],
            max_tokens: 4000,
            temperature: 0.7,
          }),
        })
  
        if (!response.ok) {
          throw new Error(`Failed to generate roadmap: ${response.status} ${response.statusText}`)
        }
  
        const data = await response.json()
        const content = data.choices[0].message.content
  
        let roadmapData
        try {
          roadmapData = JSON.parse(content)
        } catch (parseError) {
          console.error("Error parsing Groq AI response:", parseError)
          console.log("Raw response:", content)
  
          // Try to extract JSON object from the response
          const jsonMatch = content.match(/\{[\s\S]*\}/)
          if (jsonMatch) {
            try {
              roadmapData = JSON.parse(jsonMatch[0])
            } catch (extractError) {
              console.error("Error extracting JSON from response:", extractError)
              throw new Error("Failed to parse roadmap from response")
            }
          } else {
            throw new Error("Failed to extract roadmap from response")
          }
        }
  
        // Validate the structure
        if (!roadmapData?.nodes || !roadmapData?.edges) {
          throw new Error("Invalid roadmap data structure")
        }
  
        // Add positions if they're missing
        roadmapData.nodes = roadmapData.nodes.map((node, index) => ({
          ...node,
          position: node.position || { x: index * 300, y: index * 100 },
        }))
  
        return roadmapData
      } catch (error) {
        console.error("Error generating roadmap:", error)
        setError(error.message || "Failed to generate roadmap. Please try again.")
        return null
      } finally {
        setIsLoading(false)
      }
    }, [])
  
    return { generateSubtasks, isLoading, error }
  }
  
  