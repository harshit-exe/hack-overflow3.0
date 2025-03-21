import { NextResponse } from "next/server"
import { generateText } from "ai"
import { groq } from "@ai-sdk/groq"

export async function POST(request) {
  try {
    const { resume } = await request.json()

    if (!resume) {
      return NextResponse.json({ error: "Resume data is required" }, { status: 400 })
    }

    // Get API key from environment variables
    const apiKey = "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"
    if (!apiKey) {
      console.error("GROQ_API_KEY is not set in environment variables")
      return NextResponse.json(
        {
          score: 70,
          feedback: "ATS analysis is currently unavailable. Please try again later.",
        },
        { status: 200 },
      )
    }

    // Convert resume object to a string for the AI to process
    const resumeText = `
# ${resume.name}
## ${resume.title}

### Contact
${resume.contact}

### Professional Summary
${resume.bio}

### Experience
${resume.experience}

### Education
${resume.education}

### Skills
${resume.skills}

### Projects
${resume.projects}
    `

    // Use Groq AI to analyze the resume and generate an ATS score
    const systemPrompt =
      "You are an expert ATS (Applicant Tracking System) analyzer with experience in resume evaluation."

    try {
      const { text: scoreText } = await generateText({
        model: groq("llama-3-8b-8192", { apiKey }),
        system: systemPrompt,
        prompt: `
          Evaluate the following resume and provide a score from 0-100 based on:
          
          1. Keyword optimization (30 points)
          2. Formatting and structure (20 points)
          3. Quantifiable achievements (20 points)
          4. Relevance and clarity (20 points)
          5. Overall impression (10 points)
          
          Resume:
          ${resumeText}
          
          Return ONLY a number between 0-100 representing the total score.
        `,
        temperature: 0.3,
        maxTokens: 10,
      })

      // Extract the score from the AI response
      const score = Number.parseInt(scoreText.trim().match(/\d+/)?.[0] || "70", 10)

      // Validate the score
      const validScore = score >= 0 && score <= 100 ? score : 70

      // Generate detailed feedback for the score
      const { text: feedback } = await generateText({
        model: groq("llama-3-8b-8192", { apiKey }),
        system: systemPrompt,
        prompt: `
          The following resume received an ATS score of ${validScore}/100.
          
          Provide 3-5 specific, actionable suggestions to improve this resume for ATS systems.
          Be direct and practical with your feedback. Focus on improvements that would have the most impact.
          
          Resume:
          ${resumeText}
        `,
        temperature: 0.7,
        maxTokens: 500,
      })

      return NextResponse.json({
        score: validScore,
        feedback: feedback.trim(),
      })
    } catch (aiError) {
      console.error("Error with AI service:", aiError)

      // Provide a default score and generic feedback if AI fails
      return NextResponse.json({
        score: 65,
        feedback:
          "To improve your resume: 1) Add more industry-specific keywords relevant to your target position. 2) Quantify your achievements with specific metrics and results. 3) Ensure your formatting is consistent and ATS-friendly. 4) Include more specific technical skills and tools you've worked with. 5) Make sure your most relevant experience is prominently featured.",
      })
    }
  } catch (error) {
    console.error("Error analyzing ATS score:", error)
    return NextResponse.json(
      {
        error: "Failed to analyze ATS score",
        score: 60,
        feedback:
          "Something went wrong with the analysis. In general, focus on relevant keywords, quantify achievements, and ensure clean formatting for better ATS performance.",
      },
      { status: 200 },
    ) // Return 200 even on error to prevent UI disruption
  }
}

