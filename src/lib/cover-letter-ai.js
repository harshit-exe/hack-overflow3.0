// AI-powered cover letter generation

import { generateText } from "ai"
import { groq } from "@ai-sdk/groq"

export const generateCoverLetter = async (formData, resumeData) => {
  try {
    // Check if API key is available
    const apiKey = "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"

    // Format resume data for the AI prompt
    const resumeText = formatResumeForPrompt(resumeData)

    // Create a detailed prompt for the AI
    const prompt = createDetailedPrompt(formData, resumeText)

    // If API key is available, use Groq AI
    if (apiKey) {
      try {
        const { text } = await generateText({
          model: groq("llama-3-8b-8192", { apiKey }),
          prompt: prompt,
          temperature: 0.7,
          maxTokens: 1500,
        })

        return text.trim()
      } catch (aiError) {
        console.error("Error with AI service:", aiError)
        // Fall back to template-based generation if AI fails
        return generateTemplateCoverLetter(formData, resumeData)
      }
    } else {
      // If no API key, use template-based generation
      console.log("No API key available, using template-based generation")
      return generateTemplateCoverLetter(formData, resumeData)
    }
  } catch (error) {
    console.error("Error generating cover letter:", error)
    throw new Error("Failed to generate cover letter. Please try again.")
  }
}

// Format resume data for the AI prompt
const formatResumeForPrompt = (resumeData) => {
  return `
# Resume Information
Name: ${resumeData.name || ""}
Title: ${resumeData.title || ""}

## Professional Summary
${resumeData.bio || ""}

## Skills
${resumeData.skills || ""}

## Experience
${resumeData.experience || ""}

## Education
${resumeData.education || ""}

## Projects
${resumeData.projects || ""}
  `
}

// Create a detailed prompt for the AI
const createDetailedPrompt = (formData, resumeText) => {
  return `
You are a professional cover letter writer with expertise in creating compelling, personalized cover letters.

Create a professional cover letter for a job application with the following details:
- Company: ${formData.companyName}
- Hiring Manager: ${formData.hrName || "Hiring Manager"}
- Job Role: ${formData.jobRole}
- Job Description: ${formData.jobDescription || "Not provided"}

Use the following resume information to personalize the cover letter:
${resumeText}

Guidelines for the cover letter:
1. Format the letter in Markdown
2. Keep it concise (3-4 paragraphs)
3. Start with a professional greeting
4. In the opening paragraph, mention the specific position and express enthusiasm
5. In the middle paragraphs, highlight 2-3 most relevant skills/experiences from the resume that match the job
6. Include specific achievements with measurable results when possible
7. In the closing paragraph, express interest in an interview and provide contact information
8. End with a professional sign-off
9. Make the tone professional but conversational
10. Ensure the letter is ATS-friendly with relevant keywords from the job description
11. Do not include the date or address blocks, just start with the greeting

The cover letter should be unique, tailored to the specific job, and highlight the most relevant qualifications from the resume.
  `
}

// Generate a template-based cover letter if AI is not available
const generateTemplateCoverLetter = (formData, resumeData) => {
  const { companyName, hrName, jobRole, jobDescription } = formData
  const greeting = hrName ? `Dear ${hrName},` : "Dear Hiring Manager,"

  // Extract key skills (first 3-5 skills)
  const skills = resumeData.skills
    ? resumeData.skills
        .split(",")
        .slice(0, 5)
        .map((s) => s.trim())
        .join(", ")
    : "relevant skills"

  // Get job title from resume or use a generic one
  const currentTitle = resumeData.title || "professional"

  return `
# Cover Letter

${greeting}

I am writing to express my interest in the ${jobRole} position at ${companyName}. As a ${currentTitle} with experience in ${skills}, I am excited about the opportunity to contribute my skills and expertise to your team.

${resumeData.bio || `Throughout my career, I have developed strong skills in ${skills}. I am confident that my background and passion for delivering results make me a strong candidate for this role.`}

${resumeData.experience ? `My experience includes ${resumeData.experience.split("\n")[0]}` : "My professional experience has equipped me with the skills necessary to excel in this role."} ${jobDescription ? `I am particularly excited about the opportunity to ${jobDescription.split(".")[0]}.` : ""}

I would welcome the opportunity to discuss how my background, skills and experiences would benefit ${companyName}. Thank you for considering my application. I look forward to the possibility of working with your team.

Sincerely,

${resumeData.name || "Your Name"}
  `
}

