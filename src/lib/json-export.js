// Professional JSON export with proper formatting

export const exportResumeJSON = (resume) => {
    try {
      // Create a standardized resume object with proper formatting
      const standardizedResume = {
        basics: {
          name: resume.name || "",
          label: resume.title || "",
          summary: resume.bio || "",
          contact: resume.contact || "",
        },
        work: parseExperienceToJSON(resume.experience),
        education: parseEducationToJSON(resume.education),
        skills: parseSkillsToJSON(resume.skills),
        projects: parseProjectsToJSON(resume.projects),
        meta: {
          exportDate: new Date().toISOString(),
          version: "1.0.0",
        },
      }
  
      // Create a blob with the resume data
      const blob = new Blob([JSON.stringify(standardizedResume, null, 2)], { type: "application/json" })
      const url = URL.createObjectURL(blob)
  
      // Create a temporary link and trigger download
      const a = document.createElement("a")
      a.href = url
      a.download = `resume-${resume.name ? resume.name.toLowerCase().replace(/\s+/g, "-") : "export"}-${new Date().toISOString().split("T")[0]}.json`
      document.body.appendChild(a)
      a.click()
  
      // Clean up
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
  
      return true
    } catch (error) {
      console.error("Error exporting resume JSON:", error)
      return false
    }
  }
  
  // Helper functions to parse markdown sections into structured JSON
  
  function parseExperienceToJSON(experienceText) {
    if (!experienceText) return []
  
    // Simple parser for experience section
    // This is a basic implementation - a real parser would be more robust
    const experiences = []
    const sections = experienceText.split(/^##\s+/m).filter(Boolean)
  
    sections.forEach((section) => {
      const lines = section.trim().split("\n")
      const title = lines[0]
  
      // Try to extract company and dates
      let company = ""
      let startDate = ""
      let endDate = ""
  
      const companyMatch = title.match(/(.*?)(?:\s+at\s+|\s+-\s+)(.*?)$/i)
      if (companyMatch) {
        company = companyMatch[2]
      }
  
      const dateMatch = section.match(/(\w+\s+\d{4})\s*(?:-|to|–)\s*(\w+\s+\d{4}|Present)/i)
      if (dateMatch) {
        startDate = dateMatch[1]
        endDate = dateMatch[2]
      }
  
      experiences.push({
        position: title,
        company: company,
        startDate: startDate,
        endDate: endDate,
        description: section.substring(title.length).trim(),
      })
    })
  
    return experiences
  }
  
  function parseEducationToJSON(educationText) {
    if (!educationText) return []
  
    const education = []
    const sections = educationText.split(/^##\s+/m).filter(Boolean)
  
    sections.forEach((section) => {
      const lines = section.trim().split("\n")
      const institution = lines[0]
  
      let degree = ""
      const fieldOfStudy = ""
      let startDate = ""
      let endDate = ""
  
      // Try to extract degree
      const degreeMatch = section.match(/(?:Bachelor|Master|PhD|B\.S\.|M\.S\.|B\.A\.|M\.A\.|M\.B\.A\.)(?:[^,]*)/i)
      if (degreeMatch) {
        degree = degreeMatch[0].trim()
      }
  
      // Try to extract dates
      const dateMatch = section.match(/(\w+\s+\d{4})\s*(?:-|to|–)\s*(\w+\s+\d{4}|Present)/i)
      if (dateMatch) {
        startDate = dateMatch[1]
        endDate = dateMatch[2]
      }
  
      education.push({
        institution: institution,
        degree: degree,
        fieldOfStudy: fieldOfStudy,
        startDate: startDate,
        endDate: endDate,
        description: section.substring(institution.length).trim(),
      })
    })
  
    return education
  }
  
  function parseSkillsToJSON(skillsText) {
    if (!skillsText) return []
  
    return skillsText.split(",").map((skill) => {
      const trimmed = skill.trim()
  
      // Try to extract skill level if present (e.g., "JavaScript: 90%")
      const levelMatch = trimmed.match(/(.*?):\s*(\d+)%/)
  
      if (levelMatch) {
        return {
          name: levelMatch[1].trim(),
          level: levelMatch[2],
          keywords: [],
        }
      }
  
      return {
        name: trimmed,
        level: "",
        keywords: [],
      }
    })
  }
  
  function parseProjectsToJSON(projectsText) {
    if (!projectsText) return []
  
    const projects = []
    const sections = projectsText.split(/^##\s+/m).filter(Boolean)
  
    sections.forEach((section) => {
      const lines = section.trim().split("\n")
      const name = lines[0]
  
      let url = ""
      let description = ""
      let technologies = []
  
      // Try to extract URL
      const urlMatch = section.match(/https?:\/\/[^\s]+/)
      if (urlMatch) {
        url = urlMatch[0]
      }
  
      // Try to extract technologies
      const techMatch = section.match(/Technologies:\s*(.*?)(?:\n|$)/i)
      if (techMatch) {
        technologies = techMatch[1].split(",").map((tech) => tech.trim())
      }
  
      // Extract description (everything that's not the name or URL)
      description = section.substring(name.length).trim()
      if (url) {
        description = description.replace(url, "").trim()
      }
  
      projects.push({
        name: name,
        url: url,
        description: description,
        technologies: technologies,
      })
    })
  
    return projects
  }
  
  