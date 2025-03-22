"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import {
  Loader2,
  Github,
  FileDown,
  Zap,
  Code,
  CheckCircle2,
  ChevronRight,
  Save,
  Download,
  RotateCw,
  Eye,
  Shield,
} from "lucide-react"
import { exportToPDF } from "@/lib/pdf-export"
import { exportResumeJSON } from "@/lib/json-export"
import MarkdownPreview from "./markdown-preview"
import ResumeTemplate from "./resume-template"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import BlockchainVerification from "./blockchain-verification"
import Link from "next/link"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FileText, Sparkles } from "lucide-react"

// Local storage key
const RESUME_STORAGE_KEY = "resume-builder-data"

const ResumeBuilder = () => {
  // Add a state for selected template
  const [selectedTemplate, setSelectedTemplate] = useState("modern")
  const [username, setUsername] = useState("")
  const [githubRepos, setGithubRepos] = useState([])
  const [selectedRepo, setSelectedRepo] = useState(null)
  const [repoAnalysis, setRepoAnalysis] = useState(null)
  const [showRepoSelector, setShowRepoSelector] = useState(false)
  const [statusMessage, setStatusMessage] = useState(null)
  const [previewMode, setPreviewMode] = useState("markdown") // "markdown" or "template"
  const [showPreview, setShowPreview] = useState(false)

  const [resume, setResume] = useState({
    name: "",
    title: "",
    bio: "",
    experience: "",
    education: "",
    skills: "",
    projects: "",
    contact: "",
  })

  const [atsScore, setAtsScore] = useState(null)
  const [atsFeedback, setAtsFeedback] = useState("")
  const [loading, setLoading] = useState({
    github: false,
    analyze: false,
    optimize: false,
    ats: false,
    section: null,
    save: false,
    load: false,
  })

  // Load resume data from local storage on component mount
  useEffect(() => {
    loadFromLocalStorage()
  }, [])

  // Save resume data to local storage whenever it changes
  useEffect(() => {
    // Debounce saving to avoid excessive writes
    const saveTimer = setTimeout(() => {
      saveToLocalStorage()
    }, 1000)

    return () => clearTimeout(saveTimer)
  }, [resume])

  // Display status message with auto-clear
  const showStatus = (message, duration = 3000) => {
    setStatusMessage(message)
    setTimeout(() => setStatusMessage(null), duration)
  }

  const loadFromLocalStorage = () => {
    setLoading((prev) => ({ ...prev, load: true }))
    try {
      const savedData = localStorage.getItem(RESUME_STORAGE_KEY)
      if (savedData) {
        const parsedData = JSON.parse(savedData)
        setResume(parsedData)
        console.log("Resume data loaded from local storage:", parsedData)
        showStatus("Resume data loaded from local storage")
      }
    } catch (error) {
      console.error("Error loading from local storage:", error)
    } finally {
      setLoading((prev) => ({ ...prev, load: false }))
    }
  }

  const saveToLocalStorage = () => {
    try {
      localStorage.setItem(RESUME_STORAGE_KEY, JSON.stringify(resume))
      console.log("Resume data saved to local storage")
    } catch (error) {
      console.error("Error saving to local storage:", error)
    }
  }

  const handleManualSave = () => {
    setLoading((prev) => ({ ...prev, save: true }))
    try {
      localStorage.setItem(RESUME_STORAGE_KEY, JSON.stringify(resume))
      console.log("Resume data manually saved to local storage:", resume)
      showStatus("Resume data saved successfully")
    } catch (error) {
      console.error("Error saving to local storage:", error)
      showStatus("Failed to save resume data")
    } finally {
      setLoading((prev) => ({ ...prev, save: false }))
    }
  }

  const handleInputChange = (field, value) => {
    setResume((prev) => ({ ...prev, [field]: value }))
  }

  const fetchGithubData = async () => {
    if (!username) {
      showStatus("Please enter a GitHub username")
      return
    }

    setLoading((prev) => ({ ...prev, github: true }))
    showStatus("Fetching GitHub data...")

    try {
      const response = await fetch(`/api/github?username=${username}`)

      if (!response.ok) {
        throw new Error(`GitHub API error: ${response.status}`)
      }

      const data = await response.json()

      if (data.error) {
        throw new Error(data.error)
      }

      // Set GitHub repos for selection
      setGithubRepos(data.repos)

      // Set basic profile info
      setResume((prev) => ({
        ...prev,
        name: data.profile.name || prev.name || username,
        bio: data.profile.bio || prev.bio,
        contact:
          prev.contact ||
          `GitHub: github.com/${username}\n${data.profile.email ? `Email: ${data.profile.email}\n` : ""}${data.profile.location ? `Location: ${data.profile.location}` : ""}`,
      }))

      // Format languages with percentages
      const formattedLanguages = data.languages.map((lang) => `${lang.name}: ${lang.percentage}%`).join(", ")

      if (formattedLanguages) {
        setResume((prev) => ({
          ...prev,
          skills: formattedLanguages + (prev.skills ? ", " + prev.skills : ""),
        }))
      }

      // Open repo selector dialog
      setShowRepoSelector(true)
      showStatus("GitHub data fetched successfully")
    } catch (error) {
      console.error("Error fetching GitHub data:", error)
      showStatus("Failed to fetch GitHub data. Check username and try again.")
    } finally {
      setLoading((prev) => ({ ...prev, github: false }))
    }
  }

  const selectRepository = (repo) => {
    setSelectedRepo(repo)
    setShowRepoSelector(false)

    // Analyze the selected repository
    analyzeRepository(repo)
  }

  const analyzeRepository = async (repo) => {
    setLoading((prev) => ({ ...prev, analyze: true }))
    showStatus("Analyzing repository...")

    try {
      const response = await fetch("/api/analyze-repo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          repoName: repo.name,
          username: username,
          repoUrl: repo.html_url,
          language: repo.language,
          description: repo.description,
        }),
      })

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`)
      }

      const data = await response.json()

      if (data.error) {
        throw new Error(data.error)
      }

      setRepoAnalysis(data)

      // Add the project to the resume
      const projectDescription = `
## ${repo.name}
${repo.html_url}

${data.summary}

**Technologies:** ${data.technologies.join(", ")}

**Key Features:**
${data.keyFeatures.map((feature) => `- ${feature}`).join("\n")}

**My Contributions:**
${data.contributions.map((contribution) => `- ${contribution}`).join("\n")}

${data.readme ? `**Project Details:**\n${data.readme}` : ""}
      `

      setResume((prev) => ({
        ...prev,
        projects: prev.projects ? prev.projects + "\n\n" + projectDescription : projectDescription,
      }))

      // Add any new skills detected
      if (data.technologies.length > 0) {
        const newSkills = data.technologies.join(", ")
        setResume((prev) => ({
          ...prev,
          skills: prev.skills ? prev.skills + ", " + newSkills : newSkills,
        }))
      }

      showStatus("Project analysis complete and added to resume")
    } catch (error) {
      console.error("Error analyzing repository:", error)
      showStatus("Analysis failed. Using basic information.")

      // Fallback to basic project info
      const basicProjectInfo = `
## ${repo.name}
${repo.html_url}

${repo.description || "No description available"}

**Language:** ${repo.language || "Not specified"}
      `

      setResume((prev) => ({
        ...prev,
        projects: prev.projects ? prev.projects + "\n\n" + basicProjectInfo : basicProjectInfo,
      }))
    } finally {
      setLoading((prev) => ({ ...prev, analyze: false }))
    }
  }

  const optimizeSection = async (section) => {
    if (!resume[section]) {
      showStatus(`The ${section} section is empty`)
      return
    }

    setLoading((prev) => ({ ...prev, section }))
    showStatus(`Optimizing ${section} section...`)

    try {
      const response = await fetch("/api/optimize-section", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: resume[section],
          section,
        }),
      })

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`)
      }

      const data = await response.json()

      if (data.error) {
        throw new Error(data.error)
      }

      // Update the resume section with the optimized content
      setResume((prev) => ({
        ...prev,
        [section]: data.optimizedContent,
      }))

      showStatus(`${section} section enhanced successfully`)
    } catch (error) {
      console.error(`Error optimizing ${section}:`, error)
      showStatus(`Could not optimize ${section}. Please try again.`)
    } finally {
      setLoading((prev) => ({ ...prev, section: null }))
    }
  }

  const analyzeATS = async () => {
    // Check if resume has enough content
    const hasContent = Object.values(resume).some((value) => value.trim && value.trim().length > 0)
    if (!hasContent) {
      showStatus("Please add content to your resume before analyzing")
      return
    }

    setLoading((prev) => ({ ...prev, ats: true }))
    showStatus("Analyzing resume for ATS compatibility...")

    try {
      const response = await fetch("/api/ats-score", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ resume }),
      })

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`)
      }

      const data = await response.json()

      if (data.error) {
        throw new Error(data.error)
      }

      setAtsScore(data.score)
      setAtsFeedback(data.feedback)

      showStatus(`ATS analysis complete: Score ${data.score}/100`)
    } catch (error) {
      console.error("Error analyzing ATS score:", error)
      showStatus("ATS analysis failed. Please try again.")
    } finally {
      setLoading((prev) => ({ ...prev, ats: false }))
    }
  }

  const handleExportPDF = () => {
    try {
      exportToPDF(resume, selectedTemplate)
      showStatus("Resume exported to PDF")
    } catch (error) {
      console.error("Error exporting PDF:", error)
      showStatus("PDF export failed. Please try again.")
    }
  }

  const handleExportJSON = () => {
    try {
      const success = exportResumeJSON(resume)
      if (success) {
        showStatus("Resume data exported as JSON")
      } else {
        showStatus("Failed to export resume data")
      }
    } catch (error) {
      console.error("Error exporting resume JSON:", error)
      showStatus("Failed to export resume data")
    }
  }

  const resetResume = () => {
    if (confirm("Are you sure you want to reset your resume? This cannot be undone.")) {
      setResume({
        name: "",
        title: "",
        bio: "",
        experience: "",
        education: "",
        skills: "",
        projects: "",
        contact: "",
      })
      setAtsScore(null)
      setAtsFeedback("")
      setSelectedRepo(null)
      setRepoAnalysis(null)
      showStatus("Resume has been reset")
    }
  }

  const togglePreviewMode = () => {
    setShowPreview(!showPreview)
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="space-y-6">

        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="pt-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-blue-400">Import GitHub Data</h2>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-green-600 text-gray-200 bg-green-600 hover:bg-green-700 hover:text-white cursor-pointer"
                  onClick={handleManualSave}
                  disabled={loading.save}
                >
                  {loading.save ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : <Save className="h-4 w-4 mr-1" />}
                  Save
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-blue-600 text-gray-200 bg-blue-600 hover:bg-blue-700 hover:text-white cursor-pointer"
                  onClick={handleExportJSON}
                >
                  <Download className="h-4 w-4 mr-1" />
                  Export
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-red-600 text-gray-200 bg-red-600 hover:bg-red-700 hover:text-white cursor-pointer"
                  onClick={resetResume}
                >
                  <RotateCw className="h-4 w-4 mr-1" />
                  Reset
                </Button>
              </div>
            </div>

            {statusMessage && (
              <div className="mb-4 p-2 bg-gray-700 border border-gray-600 rounded text-sm text-gray-200">
                {statusMessage}
              </div>
            )}

            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Github className="text-blue-400" size={20} />
                <span className="text-gray-300">GitHub Username</span>
              </div>
              <div className="flex space-x-2">
                <Input
                  placeholder="e.g. octocat"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="bg-gray-700 border-gray-600 text-gray-200 placeholder:text-gray-400"
                />
                <Button
                  onClick={fetchGithubData}
                  variant="outline"
                  className=" border-blue-500 text-gray-200 bg-blue-600 hover:bg-blue-700 hover:text-white cursor-pointer"
                  disabled={loading.github}
                >
                  {loading.github ? <Loader2 className="h-4 w-4 animate-spin" /> : "Fetch"}
                </Button>
              </div>

              {selectedRepo && (
                <div className="mt-4 p-3 bg-gray-700 rounded-md">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Code className="text-blue-400 mr-2" size={16} />
                      <span className="text-gray-200 font-medium">{selectedRepo.name}</span>
                    </div>
                    <Badge variant="outline" className="bg-blue-900/30 text-blue-300 border-blue-500">
                      {selectedRepo.language || "No language"}
                    </Badge>
                  </div>
                  <p className="text-gray-300 text-sm mt-2">{selectedRepo.description || "No description"}</p>

                  {loading.analyze ? (
                    <div className="flex items-center mt-2 text-yellow-400 text-sm">
                      <Loader2 className="animate-spin mr-2" size={14} />
                      Analyzing repository...
                    </div>
                  ) : repoAnalysis ? (
                    <div className="flex items-center mt-2 text-green-400 text-sm">
                      <CheckCircle2 className="mr-2" size={14} />
                      Analysis complete and added to projects
                    </div>
                  ) : null}

                  <Button
                    variant="link"
                    className="text-blue-400 p-0 h-auto mt-2"
                    onClick={() => setShowRepoSelector(true)}
                  >
                    Change repository
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="personal" className="bg-gray-800 rounded-md p-4 border border-gray-700">
          <TabsList className="grid grid-cols-4 mb-4 bg-gray-700">
            <TabsTrigger value="personal" className="text-white data-[state=active]:bg-blue-900 data-[state=active]:text-blue-100">
              Personal
            </TabsTrigger>
            <TabsTrigger
              value="experience"
              className="text-white data-[state=active]:bg-blue-900 data-[state=active]:text-blue-100"
            >
              Experience
            </TabsTrigger>
            <TabsTrigger value="skills" className="text-white data-[state=active]:bg-blue-900 data-[state=active]:text-blue-100">
              Skills
            </TabsTrigger>
            <TabsTrigger value="projects" className="text-white data-[state=active]:bg-blue-900 data-[state=active]:text-blue-100">
              Projects
            </TabsTrigger>
          </TabsList>

          <TabsContent value="personal" className="space-y-4">
            <div className="flex justify-between items-center">
              <label className="text-gray-300 text-sm">Full Name</label>
              <Button
                size="sm"
                variant="outline"
                className="h-8 border-green-600 text-gray-200 bg-green-600 hover:bg-green-700 hover:text-white cursor-pointer"
                onClick={() => optimizeSection("name")}
                disabled={loading.section === "name"}
              >
                {loading.section === "name" ? (
                  <Loader2 className="h-3 w-3 animate-spin mr-1" />
                ) : (
                  <Zap className="h-3 w-3 mr-1" />
                )}
                Enhance
              </Button>
            </div>
            <Input
              placeholder="Full Name"
              value={resume.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              className="bg-gray-700 border-gray-600 text-gray-200 placeholder:text-gray-400"
            />

            <div className="flex justify-between items-center">
              <label className="text-gray-300 text-sm">Professional Title</label>
              <Button
                size="sm"
                variant="outline"
                className="h-8 border-green-600 text-gray-200 bg-green-600 hover:bg-green-700 hover:text-white cursor-pointer"
                onClick={() => optimizeSection("title")}
                disabled={loading.section === "title"}
              >
                {loading.section === "title" ? (
                  <Loader2 className="h-3 w-3 animate-spin mr-1" />
                ) : (
                  <Zap className="h-3 w-3 mr-1" />
                )}
                Enhance
              </Button>
            </div>
            <Input
              placeholder="Professional Title"
              value={resume.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              className="bg-gray-700 border-gray-600 text-gray-200 placeholder:text-gray-400"
            />

            <div className="flex justify-between items-center">
              <label className="text-gray-300 text-sm">Professional Summary</label>
              <Button
                size="sm"
                variant="outline"
                className="h-8 border-green-600 text-gray-200 bg-green-600 hover:bg-green-700 hover:text-white cursor-pointer"
                onClick={() => optimizeSection("bio")}
                disabled={loading.section === "bio"}
              >
                {loading.section === "bio" ? (
                  <Loader2 className="h-3 w-3 animate-spin mr-1" />
                ) : (
                  <Zap className="h-3 w-3 mr-1" />
                )}
                Enhance with AI
              </Button>
            </div>
            <Textarea
              placeholder="Bio / Professional Summary"
              value={resume.bio}
              onChange={(e) => handleInputChange("bio", e.target.value)}
              className="min-h-[120px] bg-gray-700 border-gray-600 text-gray-200 placeholder:text-gray-400"
            />

            <div className="flex justify-between items-center">
              <label className="text-gray-300 text-sm">Contact Information</label>
              <Button
                size="sm"
                variant="outline"
                className="h-8 border-green-600 text-gray-200 bg-green-600 hover:bg-green-700 hover:text-white cursor-pointer"
                onClick={() => optimizeSection("contact")}
                disabled={loading.section === "contact"}
              >
                {loading.section === "contact" ? (
                  <Loader2 className="h-3 w-3 animate-spin mr-1" />
                ) : (
                  <Zap className="h-3 w-3 mr-1" />
                )}
                Format
              </Button>
            </div>
            <Textarea
              placeholder="Contact Information"
              value={resume.contact}
              onChange={(e) => handleInputChange("contact", e.target.value)}
              className="min-h-[80px] bg-gray-700 border-gray-600 text-gray-200 placeholder:text-gray-400"
            />
          </TabsContent>

          <TabsContent value="experience">
            <div className="flex justify-between items-center mb-2">
              <label className="text-gray-300 text-sm">Work Experience</label>
              <Button
                size="sm"
                variant="outline"
                className="h-8 border-green-600 text-gray-200 bg-green-600 hover:bg-green-700 hover:text-white cursor-pointer"
                onClick={() => optimizeSection("experience")}
                disabled={loading.section === "experience"}
              >
                {loading.section === "experience" ? (
                  <Loader2 className="h-3 w-3 animate-spin mr-1" />
                ) : (
                  <Zap className="h-3 w-3 mr-1" />
                )}
                Enhance with AI
              </Button>
            </div>
            <Textarea
              placeholder="Work Experience (Markdown format)"
              value={resume.experience}
              onChange={(e) => handleInputChange("experience", e.target.value)}
              className="min-h-[300px] bg-gray-700 border-gray-600 text-gray-200 placeholder:text-gray-400"
            />
          </TabsContent>

          <TabsContent value="skills">
            <div className="flex justify-between items-center mb-2">
              <label className="text-gray-300 text-sm">Skills</label>
              <Button
                size="sm"
                variant="outline"
                className="h-8 border-green-600 text-gray-200 bg-green-600 hover:bg-green-700 hover:text-white cursor-pointer"
                onClick={() => optimizeSection("skills")}
                disabled={loading.section === "skills"}
              >
                {loading.section === "skills" ? (
                  <Loader2 className="h-3 w-3 animate-spin mr-1" />
                ) : (
                  <Zap className="h-3 w-3 mr-1" />
                )}
                Enhance with AI
              </Button>
            </div>
            <Textarea
              placeholder="Skills (comma separated)"
              value={resume.skills}
              onChange={(e) => handleInputChange("skills", e.target.value)}
              className="min-h-[100px] bg-gray-700 border-gray-600 text-gray-200 mb-4 placeholder:text-gray-400"
            />

            <div className="flex justify-between items-center mb-2">
              <label className="text-gray-300 text-sm">Education</label>
              <Button
                size="sm"
                variant="outline"
                className="h-8 border-green-600 text-gray-200 bg-green-600 hover:bg-green-700 hover:text-white cursor-pointer"
                onClick={() => optimizeSection("education")}
                disabled={loading.section === "education"}
              >
                {loading.section === "education" ? (
                  <Loader2 className="h-3 w-3 animate-spin mr-1" />
                ) : (
                  <Zap className="h-3 w-3 mr-1" />
                )}
                Enhance with AI
              </Button>
            </div>
            <Textarea
              placeholder="Education (Markdown format)"
              value={resume.education}
              onChange={(e) => handleInputChange("education", e.target.value)}
              className="min-h-[200px] bg-gray-700 border-gray-600 text-gray-200 placeholder:text-gray-400"
            />
          </TabsContent>

          <TabsContent value="projects">
            <div className="flex justify-between items-center mb-2">
              <label className="text-gray-300 text-sm">Projects</label>
              <Button
                size="sm"
                variant="outline"
                className="h-8 border-green-600 text-gray-200 bg-green-600 hover:bg-green-700 hover:text-white cursor-pointer"
                onClick={() => optimizeSection("projects")}
                disabled={loading.section === "projects"}
              >
                {loading.section === "projects" ? (
                  <Loader2 className="h-3 w-3 animate-spin mr-1" />
                ) : (
                  <Zap className="h-3 w-3 mr-1" />
                )}
                Enhance with AI
              </Button>
            </div>
            <Textarea
              placeholder="Projects (Markdown format)"
              value={resume.projects}
              onChange={(e) => handleInputChange("projects", e.target.value)}
              className="min-h-[300px] bg-gray-700 border-gray-600 text-gray-200 placeholder:text-gray-400"
            />
          </TabsContent>
        </Tabs>

        <div className="flex flex-wrap gap-2">
          <Button onClick={analyzeATS} className="bg-green-600 hover:bg-green-700 text-white cursor-pointer" disabled={loading.ats}>
            {loading.ats ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Zap className="mr-2 h-4 w-4" />}
            Analyze ATS Score
          </Button>

          <Button onClick={handleExportPDF} className="bg-blue-600 hover:bg-blue-700 text-white cursor-pointer">
            <FileDown className="mr-2 h-4 w-4" />
            Export PDF
          </Button>

          <Button onClick={togglePreviewMode} className="bg-purple-600 hover:bg-purple-700 text-white cursor-pointer">
            <Eye className="mr-2 h-4 w-4" />
            {showPreview ? "Edit Mode" : "Preview Resume"}
          </Button>

          <Link href="/verify">
            <Button className="bg-purple-600 hover:bg-purple-700 text-white cursor-pointer">
              <Shield className="mr-2 h-4 w-4" />
              Verify Resume
            </Button>
          </Link>

          <Link href="/dashboard/skill/resume/cover-letterr">
            <Button className="bg-purple-600 hover:bg-purple-700 text-white cursor-pointer">
              <FileText className="mr-2 h-4 w-4" />
              Cover Letter
            </Button>
          </Link>

          <Link href="/dashboard/skill/resume/project-recommender">
            <Button className="bg-purple-600 hover:bg-purple-700 text-white cursor-pointer">
              <Sparkles className="mr-2 h-4 w-4" />
              Project Ideas
            </Button>
          </Link>
        </div>

        {atsScore !== null && (
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="pt-6">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-medium text-gray-200">ATS Score</h3>
                <Badge
                  className={`${atsScore >= 80 ? "bg-green-500" : atsScore >= 60 ? "bg-yellow-500" : "bg-red-500"}`}
                >
                  {atsScore}/100
                </Badge>
              </div>
              <Progress value={atsScore} className="h-2 bg-gray-700" />
              <p className="text-sm text-gray-300 mt-2">
                {atsScore >= 80
                  ? "Excellent! Your resume is well-optimized for ATS systems."
                  : atsScore >= 60
                    ? "Good, but there's room for improvement. Try adding more relevant keywords."
                    : "Your resume needs significant improvement to pass ATS filters."}
              </p>

              {atsFeedback && (
                <div className="mt-4 p-3 bg-gray-700 rounded-md text-sm text-gray-200">
                  <h4 className="font-medium mb-2 text-blue-400">AI Feedback:</h4>
                  <p className="whitespace-pre-line">{atsFeedback}</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Blockchain Verification */}
        <BlockchainVerification resume={resume} />
      </div>

      <div className="bg-gray-800 rounded-lg border border-gray-700 p-6 h-fit sticky top-6">
        <h2 className="text-xl font-semibold text-blue-400 mb-4">Resume Preview</h2>

        {showPreview ? (
          <div>
            <div className="mb-4 flex justify-between items-center">
              <h3 className="text-lg font-semibold text-blue-400">Template Style</h3>
              <Select value={selectedTemplate} onValueChange={setSelectedTemplate} className="w-40">
                <SelectTrigger className="bg-gray-700 border-gray-600 text-gray-200">
                  <SelectValue placeholder="Select template" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700 text-gray-200">
                  <SelectItem value="modern">Modern</SelectItem>
                  <SelectItem value="professional">Professional</SelectItem>
                  <SelectItem value="creative">Creative</SelectItem>
                  <SelectItem value="minimal">Minimal</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <ResumeTemplate resume={resume} templateStyle={selectedTemplate} />
          </div>
        ) : (
          <div className="prose prose-invert max-w-none text-gray-200">
            <MarkdownPreview
              content={`
# ${resume.name || "Your Name"}
${resume.title ? `## ${resume.title}` : ""}

${
  resume.contact
    ? `### Contact
${resume.contact}`
    : ""
}

${
  resume.bio
    ? `### Professional Summary
${resume.bio}`
    : ""
}

${
  resume.experience
    ? `### Experience
${resume.experience}`
    : ""
}

${
  resume.education
    ? `### Education
${resume.education}`
    : ""
}

${
  resume.skills
    ? `### Skills
${resume.skills}`
    : ""
}

${
  resume.projects
    ? `### Projects
${resume.projects}`
    : ""
}
              `}
            />
          </div>
        )}
      </div>

      {/* Repository Selection Dialog */}
      <Dialog open={showRepoSelector} onOpenChange={setShowRepoSelector}>
        <DialogContent className="bg-gray-800 text-gray-200 border-gray-700 max-w-3xl">
          <DialogHeader>
            <DialogTitle className="text-blue-400">Select a GitHub Repository</DialogTitle>
            <DialogDescription className="text-gray-400">
              Choose a repository to analyze and add to your resume
            </DialogDescription>
          </DialogHeader>

          <ScrollArea className="h-[400px] mt-4">
            <div className="space-y-2">
              {githubRepos.map((repo) => (
                <div
                  key={repo.id || repo.name}
                  className="p-3 rounded-md bg-gray-700 hover:bg-gray-600 cursor-pointer flex justify-between items-center"
                  onClick={() => selectRepository(repo)}
                >
                  <div>
                    <h3 className="font-medium text-blue-300">{repo.name}</h3>
                    <p className="text-sm text-gray-300 mt-1">{repo.description || "No description"}</p>
                    <div className="flex items-center mt-2 space-x-3 text-xs">
                      {repo.language && (
                        <Badge variant="outline" className="bg-blue-900/30 text-blue-300 border-blue-500">
                          {repo.language}
                        </Badge>
                      )}
                      <span className="text-gray-400">⭐ {repo.stargazers_count || 0}</span>
                      <span className="text-gray-400">🍴 {repo.forks_count || 0}</span>
                    </div>
                  </div>
                  <ChevronRight className="text-gray-400" size={20} />
                </div>
              ))}

              {githubRepos.length === 0 && <div className="p-4 text-center text-gray-400">No repositories found</div>}
            </div>
          </ScrollArea>

          <DialogFooter>
            <Button
              variant="outline"
              className="border-gray-600 text-gray-300 hover:bg-gray-700"
              onClick={() => setShowRepoSelector(false)}
            >
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default ResumeBuilder

