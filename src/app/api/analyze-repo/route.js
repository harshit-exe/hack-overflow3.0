import { NextResponse } from "next/server"
import { generateText } from "ai"
import { groq } from "@ai-sdk/groq"
import * as cheerio from "cheerio"

export async function POST(request) {
  try {
    const { repoName, username, repoUrl, language, description } = await request.json()

    if (!repoName || !username) {
      return NextResponse.json({ error: "Repository name and username are required" }, { status: 400 })
    }

    // Get API key from environment variables
    const apiKey = "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"

    if (!apiKey) {
      console.error("GROQ_API_KEY is not set in environment variables")
      // Continue with basic analysis without AI
    }

    // Fetch repository details from GitHub API
    let repoDetails = null
    let repoStructure = []
    let readmeContent = ""
    let readmeHtml = ""
    let packageJson = null

    try {
      // Fetch basic repo info
      const repoResponse = await fetch(`https://api.github.com/repos/${username}/${repoName}`, {
        headers: {
          Accept: "application/vnd.github.v3+json",
          "User-Agent": "Resume-Builder-App",
        },
      })

      if (repoResponse.ok) {
        repoDetails = await repoResponse.json()

        // Fetch repository contents to analyze structure
        const contentsResponse = await fetch(`https://api.github.com/repos/${username}/${repoName}/contents`, {
          headers: {
            Accept: "application/vnd.github.v3+json",
            "User-Agent": "Resume-Builder-App",
          },
        })

        if (contentsResponse.ok) {
          const contents = await contentsResponse.json()
          repoStructure = contents.map((item) => ({
            name: item.name,
            type: item.type,
            path: item.path,
          }))

          // Look for README file
          const readmeFile = contents.find((file) => file.name.toLowerCase().includes("readme") && file.type === "file")

          if (readmeFile) {
            // First try to get the HTML version of the README from the actual repo page
            try {
              const repoPageResponse = await fetch(`https://github.com/${username}/${repoName}`)
              if (repoPageResponse.ok) {
                const html = await repoPageResponse.text()
                const $ = cheerio.load(html)

                // Extract README content from the article element
                readmeHtml = $(".markdown-body").html() || ""

                if (readmeHtml) {
                  // Convert HTML to plain text for AI processing
                  const tempDiv = $("<div></div>")
                  tempDiv.html(readmeHtml)
                  readmeContent = tempDiv.text().trim()
                }
              }
            } catch (htmlError) {
              console.error("Error fetching repo page HTML:", htmlError)
            }

            // If HTML extraction failed, fallback to raw content
            if (!readmeContent) {
              const readmeResponse = await fetch(readmeFile.download_url)
              if (readmeResponse.ok) {
                readmeContent = await readmeResponse.text()
              }
            }

            // Truncate README if it's too long
            if (readmeContent.length > 2000) {
              readmeContent = readmeContent.substring(0, 2000) + "...\n\n(README truncated for brevity)"
            }
          }
        }

        // Try to detect package.json for dependencies
        const packageJsonFile = repoStructure.find((file) => file.name === "package.json")

        if (packageJsonFile) {
          const packageResponse = await fetch(
            `https://api.github.com/repos/${username}/${repoName}/contents/${packageJsonFile.path}`,
            {
              headers: {
                Accept: "application/vnd.github.v3+json",
                "User-Agent": "Resume-Builder-App",
              },
            },
          )

          if (packageResponse.ok) {
            const packageData = await packageResponse.json()
            if (packageData.content) {
              try {
                // Decode base64 content
                const decodedContent = atob(packageData.content.replace(/\n/g, ""))
                packageJson = JSON.parse(decodedContent)
              } catch (e) {
                console.error("Error parsing package.json:", e)
              }
            }
          }
        }
      }
    } catch (error) {
      console.error("Error fetching repo details:", error)
    }

    // Extract technologies from various files
    const technologies = new Set()

    // Add main language
    if (language) technologies.add(language)

    // Add from package.json dependencies
    if (packageJson && packageJson.dependencies) {
      Object.keys(packageJson.dependencies).forEach((dep) => technologies.add(dep))

      // Infer framework from dependencies
      if (packageJson.dependencies.react) technologies.add("React")
      if (packageJson.dependencies.vue) technologies.add("Vue.js")
      if (packageJson.dependencies.angular) technologies.add("Angular")
      if (packageJson.dependencies.next) technologies.add("Next.js")
      if (packageJson.dependencies.express) technologies.add("Express.js")
      if (packageJson.dependencies["@nestjs/core"]) technologies.add("NestJS")
    }

    // Look for config files to infer technologies
    repoStructure.forEach((file) => {
      const name = file.name.toLowerCase()
      if (name === "tailwind.config.js" || name === "tailwind.config.ts") technologies.add("Tailwind CSS")
      if (name === "webpack.config.js") technologies.add("Webpack")
      if (name === "vite.config.js" || name === "vite.config.ts") technologies.add("Vite")
      if (name === "dockerfile") technologies.add("Docker")
      if (name === ".eslintrc.js" || name === ".eslintrc.json") technologies.add("ESLint")
      if (name === "jest.config.js") technologies.add("Jest")
      if (name === "cypress.json" || name === "cypress.config.js") technologies.add("Cypress")
      if (name === "prisma.schema") technologies.add("Prisma")
      if (name === ".github") technologies.add("GitHub Actions")
    })

    // Extract key information from README
    let readmeSummary = ""
    if (readmeContent) {
      // Try to extract the first paragraph or section that's not a heading
      const paragraphs = readmeContent.split("\n\n")
      for (const paragraph of paragraphs) {
        if (paragraph.trim() && !paragraph.startsWith("#")) {
          readmeSummary = paragraph.trim()
          if (readmeSummary.length > 300) {
            readmeSummary = readmeSummary.substring(0, 300) + "..."
          }
          break
        }
      }
    }

    // Prepare technologies array from Set
    const detectedTechnologies = Array.from(technologies).slice(0, 10)

    // If no API key, create a basic analysis without AI
    if (!apiKey) {
      const basicAnalysis = {
        summary:
          description ||
          `${repoName} is a ${language || "software"} project that demonstrates programming skills in ${detectedTechnologies.join(", ")}.`,
        technologies: detectedTechnologies.length > 0 ? detectedTechnologies : [language || "Git", "GitHub"],
        keyFeatures: [
          "Efficient code structure and organization",
          "Implementation of industry best practices",
          "User-friendly interface and experience",
        ],
        contributions: [
          `Developed ${repoName} using ${language || "various technologies"}`,
          "Implemented key features and functionality",
          "Maintained code quality and documentation",
        ],
        readme: readmeSummary || "",
      }

      return NextResponse.json(basicAnalysis)
    }

    // Use AI to analyze the repository based on available information
    const systemPrompt =
      "You are an expert software developer and technical resume writer. Provide concise, accurate, and professional analysis of GitHub repositories for resume use."

    const analysisPrompt = `
      Analyze this GitHub repository for a professional resume entry:
      
      Repository: ${repoName} (${username})
      URL: ${repoUrl || `https://github.com/${username}/${repoName}`}
      Language: ${language || "Unknown"}
      Description: ${description || "No description available"}
      
      ${
        repoDetails
          ? `
      Stars: ${repoDetails.stargazers_count}
      Forks: ${repoDetails.forks_count}
      Issues: ${repoDetails.open_issues_count}
      Created: ${repoDetails.created_at}
      Updated: ${repoDetails.updated_at}
      `
          : ""
      }
      
      ${detectedTechnologies.length > 0 ? `Detected Technologies: ${detectedTechnologies.join(", ")}` : ""}
      
      ${
        packageJson
          ? `
      Dependencies: ${Object.keys(packageJson.dependencies || {}).join(", ")}
      DevDependencies: ${Object.keys(packageJson.devDependencies || {}).join(", ")}
      `
          : ""
      }
      
      Repository Structure:
      ${repoStructure
        .slice(0, 15)
        .map((item) => `- ${item.name} (${item.type})`)
        .join("\n")}
      ${repoStructure.length > 15 ? `... and ${repoStructure.length - 15} more files/directories` : ""}
      
      README Summary:
      ${readmeSummary || "No README summary available"}
      
      Create:
      1. A concise 2-3 sentence summary of the project's purpose and significance
      2. A list of 5-8 key technologies used
      3. 3-5 key features or components
      4. 3-5 impressive contributions that would stand out on a resume
      
      Format your response as JSON:
      {
        "summary": "Project summary here",
        "technologies": ["Tech1", "Tech2", "Tech3"],
        "keyFeatures": ["Feature 1", "Feature 2", "Feature 3"],
        "contributions": ["Contribution 1", "Contribution 2", "Contribution 3"],
        "readme": "A brief excerpt from the README that would be valuable on a resume"
      }
    `

    // Attempt to get an analysis from AI
    let analysisData
    try {
      const { text } = await generateText({
        model: groq("llama-3-8b-8192", { apiKey }),
        system: systemPrompt,
        prompt: analysisPrompt,
      })

      // Extract JSON from the response
      const jsonMatch = text.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        analysisData = JSON.parse(jsonMatch[0])
      } else {
        throw new Error("Could not extract JSON from response")
      }
    } catch (error) {
      console.error("Error in AI analysis:", error)

      // Create a fallback analysis using the data we already collected
      analysisData = {
        summary:
          description ||
          `${repoName} is a ${language || "software"} project with ${repoDetails?.stargazers_count || 0} stars and ${repoDetails?.forks_count || 0} forks.`,
        technologies: detectedTechnologies.length > 0 ? detectedTechnologies : [language || "Git", "GitHub"],
        keyFeatures: ["Advanced functionality", "User-friendly interface", "Robust architecture"],
        contributions: [
          `Developed ${repoName} using ${language || "various technologies"}`,
          "Implemented key features and functionality",
          "Maintained code quality and documentation",
        ],
        readme: readmeSummary || "",
      }
    }

    return NextResponse.json(analysisData)
  } catch (error) {
    console.error("Error analyzing repository:", error)
    return NextResponse.json(
      {
        error: "Failed to analyze repository",
        summary: "Repository analysis failed.",
        technologies: ["Unable to detect technologies"],
        keyFeatures: ["Error in analysis"],
        contributions: ["Please try again with another repository"],
        readme: "",
      },
      { status: 500 },
    )
  }
}

