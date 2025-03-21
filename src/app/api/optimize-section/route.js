import { NextResponse } from "next/server"
import { generateText } from "ai"
import { groq } from "@ai-sdk/groq"

export async function POST(request) {
  try {
    const { content, section } = await request.json()

    if (!content || !section) {
      return NextResponse.json({ error: "Content and section are required" }, { status: 400 })
    }

    // Get API key from environment variables
    const apiKey = "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"

    if (!apiKey) {
      console.error("GROQ_API_KEY is not set in environment variables")
      return NextResponse.json(
        {
          error: "API configuration error",
          optimizedContent: content, // Return original content as fallback
        },
        { status: 500 },
      )
    }

    // Create a prompt based on the section type
    let prompt = ""
    const systemPrompt = "You are an expert resume writer specializing in professional and ATS-friendly content."

    switch (section) {
      case "name":
        prompt = `Format this name to be professional: "${content}". Return only the formatted name.`
        break
      case "title":
        prompt = `Enhance this professional title to be more impactful and ATS-friendly: "${content}". Return only the enhanced title.`
        break
      case "bio":
        prompt = `
          Optimize this professional summary to be more compelling, 
          impactful, and ATS-friendly. Focus on strengths and achievements.
          
          Professional Summary:
          ${content}
          
          Return only the optimized professional summary.
        `
        break
      case "experience":
        prompt = `
          Optimize this work experience section to be more compelling, 
          impactful, and ATS-friendly. Highlight achievements with metrics where possible.
          
          Experience:
          ${content}
          
          Return only the optimized experience section, maintaining the markdown format.
        `
        break
      case "education":
        prompt = `
          Optimize this education section to be more compelling
          and professional. Include relevant details clearly and concisely.
          
          Education:
          ${content}
          
          Return only the optimized education section, maintaining the markdown format.
        `
        break
      case "skills":
        prompt = `
          Organize and enhance this skills section to be more 
          ATS-friendly. Group similar skills together and ensure key technical terms are included.
          
          Skills:
          ${content}
          
          Return only the optimized skills, maintaining the same format (comma-separated).
        `
        break
      case "projects":
        prompt = `
          Optimize this projects section to be more compelling,
          impactful, and ATS-friendly. Highlight technical achievements and focus on outcomes.
          
          Projects:
          ${content}
          
          Return only the optimized projects section, maintaining the markdown format.
        `
        break
      case "contact":
        prompt = `
          Format this contact information to be professional and well-organized:
          
          ${content}
          
          Return only the formatted contact information.
        `
        break
      default:
        prompt = `Optimize this content to be more professional and well-written: ${content}`
    }

    // Use Groq AI to optimize the section with a more reliable approach
    try {
      const { text } = await generateText({
        model: groq("llama-3-8b-8192", { apiKey }),
        system: systemPrompt,
        prompt: prompt,
        temperature: 0.7,
        maxTokens: 1000,
      })

      return NextResponse.json({ optimizedContent: text.trim() })
    } catch (aiError) {
      console.error("Error with AI service:", aiError)

      // Fallback approach with simplified prompt if the first attempt fails
      try {
        const { text } = await generateText({
          model: groq("llama-3-8b-8192", { apiKey }),
          prompt: `Improve this resume ${section}: ${content}`,
        })

        return NextResponse.json({ optimizedContent: text.trim() })
      } catch (fallbackError) {
        console.error("Fallback AI service also failed:", fallbackError)
        return NextResponse.json({
          optimizedContent: content,
          message: "AI enhancement unavailable. Original content preserved.",
        })
      }
    }
  } catch (error) {
    console.error("Error optimizing section:", error)
    return NextResponse.json(
      {
        error: "Failed to optimize section",
        optimizedContent: "Could not optimize content. Please try again.",
      },
      { status: 500 },
    )
  }
}

