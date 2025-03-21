import { NextResponse } from "next/server"
import { streamText } from "ai"
import { groq } from "@ai-sdk/groq"

export async function POST(request) {
  try {
    const { resume } = await request.json()

    if (!resume) {
      return NextResponse.json({ error: "Resume data is required" }, { status: 400 })
    }

    // Get API key from environment variables
    const apiKey ="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"

    if (!apiKey) {
      console.error("GROQ_API_KEY is not set in environment variables")
      return NextResponse.json(
        {
          error: "API configuration error",
          optimizedResume: resume, // Return original resume as fallback
        },
        { status: 500 },
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

    // Use Groq AI to optimize the resume
    let optimizedText = ""

    try {
      const stream = await streamText({
        model: groq("llama-3-8b-8192", { apiKey }),
        prompt: `
          You are an expert resume writer with experience in professional formatting. Optimize the following resume to be more professional, 
          impactful, and ATS-friendly. Improve the language, highlight achievements with metrics 
          where possible, and ensure it's well-structured.
          
          Keep the same general content and information, but make it more compelling and professional.
          
          Resume:
          ${resumeText}
          
          Return the optimized resume in the same markdown format, preserving all sections.
        `,
        onChunk: (chunk) => {
          if (chunk.type === "text-delta") {
            optimizedText += chunk.text
          }
        },
      })

      // Parse the AI response back into resume sections
      const optimizedResume = parseOptimizedResume(optimizedText, resume)

      return NextResponse.json({ optimizedResume })
    } catch (error) {
      console.error("Error with AI optimization:", error)
      return NextResponse.json({
        error: "AI optimization failed",
        optimizedResume: resume, // Return original resume as fallback
      })
    }
  } catch (error) {
    console.error("Error optimizing resume:", error)
    return NextResponse.json({ error: "Failed to optimize resume" }, { status: 500 })
  }
}

function parseOptimizedResume(text, originalResume) {
  // This is a simple parser - in a real app, you might want a more robust solution
  const sections = {
    name: originalResume.name,
    title: originalResume.title,
    bio: "",
    experience: "",
    education: "",
    skills: "",
    projects: "",
    contact: originalResume.contact,
  }

  // Extract Professional Summary/Bio
  const bioMatch = text.match(/### Professional Summary\n([\s\S]*?)(?=###|$)/)
  if (bioMatch && bioMatch[1]) {
    sections.bio = bioMatch[1].trim()
  }

  // Extract Experience
  const experienceMatch = text.match(/### Experience\n([\s\S]*?)(?=###|$)/)
  if (experienceMatch && experienceMatch[1]) {
    sections.experience = experienceMatch[1].trim()
  }

  // Extract Education
  const educationMatch = text.match(/### Education\n([\s\S]*?)(?=###|$)/)
  if (educationMatch && educationMatch[1]) {
    sections.education = educationMatch[1].trim()
  }

  // Extract Skills
  const skillsMatch = text.match(/### Skills\n([\s\S]*?)(?=###|$)/)
  if (skillsMatch && skillsMatch[1]) {
    sections.skills = skillsMatch[1].trim()
  }

  // Extract Projects
  const projectsMatch = text.match(/### Projects\n([\s\S]*?)(?=###|$)/)
  if (projectsMatch && projectsMatch[1]) {
    sections.projects = projectsMatch[1].trim()
  }

  // If any section failed to parse, use the original content
  if (!sections.bio) sections.bio = originalResume.bio
  if (!sections.experience) sections.experience = originalResume.experience
  if (!sections.education) sections.education = originalResume.education
  if (!sections.skills) sections.skills = originalResume.skills
  if (!sections.projects) sections.projects = originalResume.projects

  return sections
}

