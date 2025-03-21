import { NextResponse } from "next/server"

export async function POST(request) {
  try {
    const { message, careerPath, scrapedData } = await request.json()

    // In a real implementation, you would call Groq API here
    // For now, we'll simulate a response based on the message and career path

    const response = generateResponse(message, careerPath, scrapedData)

    return NextResponse.json({ message: response })
  } catch (error) {
    console.error("Error in chat API:", error)
    return NextResponse.json({ error: "Failed to process chat request" }, { status: 500 })
  }
}

function generateResponse(message, careerPath, scrapedData){
  const input = message.toLowerCase()

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

