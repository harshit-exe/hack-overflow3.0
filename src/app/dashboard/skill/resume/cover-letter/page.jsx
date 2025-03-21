"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Loader2, FileDown, ArrowLeft, Wand2, Copy, CheckCircle2, Edit3 } from "lucide-react"
import Link from "next/link"
import { generateCoverLetter } from "@/lib/cover-letter-ai"
import MarkdownPreview from "@/components/resume/markdown-preview"


export default function CoverLetterPage() {
  const [formData, setFormData] = useState({
    companyName: "",
    hrName: "",
    jobRole: "",
    jobDescription: "",
  })

  const [resumeData, setResumeData] = useState(null)
  const [coverLetter, setCoverLetter] = useState("")
  const [editableCoverLetter, setEditableCoverLetter] = useState("")
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("preview")
  const [copied, setCopied] = useState(false)
  const [statusMessage, setStatusMessage] = useState(null)

  // Load resume data from local storage on component mount
  useEffect(() => {
    try {
      const savedData = localStorage.getItem("resume-builder-data")
      if (savedData) {
        const parsedData = JSON.parse(savedData)
        setResumeData(parsedData)
        console.log("Resume data loaded from local storage")
      } else {
        setStatusMessage({
          type: "warning",
          message: "No resume data found. Please create a resume first.",
        })
      }
    } catch (error) {
      console.error("Error loading from local storage:", error)
      setStatusMessage({
        type: "error",
        message: "Error loading resume data. Please create a resume first.",
      })
    }
  }, [])

  // Handle input changes
  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  // Generate cover letter
  const handleGenerateCoverLetter = async () => {
    if (!resumeData) {
      setStatusMessage({
        type: "error",
        message: "No resume data found. Please create a resume first.",
      })
      return
    }

    if (!formData.companyName || !formData.jobRole) {
      setStatusMessage({
        type: "warning",
        message: "Please enter at least the company name and job role.",
      })
      return
    }

    setLoading(true)
    setStatusMessage({
      type: "info",
      message: "Generating your personalized cover letter...",
    })

    try {
      const generatedLetter = await generateCoverLetter(formData, resumeData)
      setCoverLetter(generatedLetter)
      setEditableCoverLetter(generatedLetter)
      setActiveTab("preview")
      setStatusMessage({
        type: "success",
        message: "Cover letter generated successfully!",
      })
    } catch (error) {
      console.error("Error generating cover letter:", error)
      setStatusMessage({
        type: "error",
        message: "Failed to generate cover letter. Please try again.",
      })
    } finally {
      setLoading(false)
    }
  }

  // Handle cover letter edit
  const handleCoverLetterEdit = (value) => {
    setEditableCoverLetter(value)
  }

  // Save edited cover letter
  const handleSaveEdit = () => {
    setCoverLetter(editableCoverLetter)
    setActiveTab("preview")
    setStatusMessage({
      type: "success",
      message: "Cover letter updated successfully!",
    })
  }

  // Copy to clipboard
  const copyToClipboard = () => {
    navigator.clipboard.writeText(coverLetter)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // Download as TXT
  const downloadAsTxt = () => {
    const element = document.createElement("a")
    const file = new Blob([coverLetter], { type: "text/plain" })
    element.href = URL.createObjectURL(file)
    element.download = `Cover_Letter_${formData.companyName.replace(/\s+/g, "_")}.txt`
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  return (
    <main className="min-h-screen ">
      <div className="container mx-auto py-8">
        <div className="flex items-center mb-6">
          <Link href="/dashboard/skill/resume/resume-builder" className="flex items-center text-White hover:text-blue-400">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Resume Builder
          </Link>
        </div>

        <h1 className="text-4xl font-bold text-white text-center mb-8 animate-fadeIn">
        <span className="text-[#57FF31]">  AI </span> -Powered Cover Letter Generator
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-6">
            <Card className="bg-[#181818] border-gray-700">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-blue-400">Job Details</CardTitle>
                <CardDescription className="text-gray-400">
                  Enter information about the job you're applying for
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                {statusMessage && (
                  <div
                    className={`p-3 rounded-md flex items-start ${
                      statusMessage.type === "error"
                        ? "bg-red-900/30 border border-red-700"
                        : statusMessage.type === "warning"
                          ? "bg-yellow-900/30 border border-yellow-700"
                          : statusMessage.type === "success"
                            ? "bg-green-900/30 border border-green-700"
                            : "bg-blue-900/30 border border-blue-700"
                    }`}
                  >
                    <span
                      className={`text-sm ${
                        statusMessage.type === "error"
                          ? "text-red-400"
                          : statusMessage.type === "warning"
                            ? "text-yellow-400"
                            : statusMessage.type === "success"
                              ? "text-green-400"
                              : "text-blue-400"
                      }`}
                    >
                      {statusMessage.message}
                    </span>
                  </div>
                )}

                <div>
                  <label className="text-sm text-gray-300 mb-1 block">Company Name *</label>
                  <Input
                    placeholder="e.g. Acme Corporation"
                    value={formData.companyName}
                    onChange={(e) => handleInputChange("companyName", e.target.value)}
                    className="bg-transperent border-gray-400 text-gray-200 placeholder:text-gray-400 "
                  />
                </div>

                <div>
                  <label className="text-sm text-gray-300 mb-1 block">HR/Hiring Manager Name</label>
                  <Input
                    placeholder="e.g. John Smith (leave blank if unknown)"
                    value={formData.hrName}
                    onChange={(e) => handleInputChange("hrName", e.target.value)}
                    className="bg-transperent border-gray-400 text-gray-200 placeholder:text-gray-400"
                  />
                </div>

                <div>
                  <label className="text-sm text-gray-300 mb-1 block">Job Role/Title *</label>
                  <Input
                    placeholder="e.g. Senior Frontend Developer"
                    value={formData.jobRole}
                    onChange={(e) => handleInputChange("jobRole", e.target.value)}
                    className="bg-transperent border-gray-400 text-gray-200 placeholder:text-gray-400"
                  />
                </div>

                <div>
                  <label className="text-sm text-gray-300 mb-1 block">Job Description (Optional but recommended)</label>
                  <Textarea
                    placeholder="Paste the job description here for a more tailored cover letter..."
                    value={formData.jobDescription}
                    onChange={(e) => handleInputChange("jobDescription", e.target.value)}
                    className="min-h-[150px] bg-transperent border-gray-400 text-gray-200 placeholder:text-gray-400"
                  />
                </div>
              </CardContent>

              <CardFooter>
                <Button
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  onClick={handleGenerateCoverLetter}
                  disabled={loading}
                >
                  {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />}
                  Generate Cover Letter
                </Button>
              </CardFooter>
            </Card>

            <Card className="bg-[#181818] border-gray-700">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-blue-400">How It Works</CardTitle>
                <CardDescription className="text-gray-400">
                  Our AI-powered cover letter generator creates personalized, professional cover letters
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center">
                    <Badge className="bg-blue-600 text-white mr-2">1</Badge>
                    <h3 className="text-gray-200 font-medium">Enter Job Details</h3>
                  </div>
                  <p className="text-gray-400 text-sm pl-7">
                    Provide the company name, hiring manager's name, and job role you're applying for.
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center">
                    <Badge className="bg-blue-600 text-white mr-2">2</Badge>
                    <h3 className="text-gray-200 font-medium">AI Analyzes Your Resume</h3>
                  </div>
                  <p className="text-gray-400 text-sm pl-7">
                    Our AI engine analyzes your resume data from your profile to identify relevant skills and
                    experiences.
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center">
                    <Badge className="bg-blue-600 text-white mr-2">3</Badge>
                    <h3 className="text-gray-200 font-medium">Tailored Cover Letter Generation</h3>
                  </div>
                  <p className="text-gray-400 text-sm pl-7">
                    The AI creates a personalized cover letter highlighting your most relevant qualifications for the
                    specific job.
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center">
                    <Badge className="bg-blue-600 text-white mr-2">4</Badge>
                    <h3 className="text-gray-200 font-medium">Review and Edit</h3>
                  </div>
                  <p className="text-gray-400 text-sm pl-7">
                    Review the generated cover letter, make any necessary edits, and download it as a TXT file.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="bg-[#181818] border-gray-700">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-xl font-semibold text-blue-400">Your Cover Letter</CardTitle>
                  <CardDescription className="text-gray-400">
                    Preview and edit your personalized cover letter
                  </CardDescription>
                </div>

                {coverLetter && (
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-blue-600 text-blue-400 hover:bg-blue-900/30"
                      onClick={copyToClipboard}
                    >
                      {copied ? <CheckCircle2 className="h-4 w-4 mr-1" /> : <Copy className="h-4 w-4 mr-1" />}
                      {copied ? "Copied!" : "Copy"}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-green-600 text-green-400 hover:bg-green-900/30"
                      onClick={downloadAsTxt}
                    >
                      <FileDown className="h-4 w-4 mr-1" />
                      Download
                    </Button>
                  </div>
                )}
              </CardHeader>

              <CardContent>
                {coverLetter ? (
                  <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="grid grid-cols-2 mb-4 bg-gray-700">
                      <TabsTrigger
                        value="preview"
                        className="data-[state=active]:bg-blue-900 data-[state=active]:text-blue-100"
                      >
                        Preview
                      </TabsTrigger>
                      <TabsTrigger
                        value="edit"
                        className="data-[state=active]:bg-blue-900 data-[state=active]:text-blue-100"
                      >
                        Edit
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="preview" className="mt-0">
                      <div className="bg-gray-700 rounded-md p-4">
                        <MarkdownPreview content={coverLetter} />
                      </div>
                    </TabsContent>

                    <TabsContent value="edit" className="mt-0">
                      <div className="flex flex-col space-y-4">
                        <Textarea
                          value={editableCoverLetter}
                          onChange={(e) => handleCoverLetterEdit(e.target.value)}
                          className="min-h-[400px] font-mono text-sm bg-gray-700 border-gray-600 text-gray-200"
                        />
                        <Button
                          onClick={handleSaveEdit}
                          className="self-end bg-green-600 hover:bg-green-700 text-white"
                        >
                          <Edit3 className="h-4 w-4 mr-1" />
                          Save Changes
                        </Button>
                      </div>
                    </TabsContent>
                  </Tabs>
                ) : (
                  <div className="bg-[#181818] rounded-md p-6 flex flex-col items-center justify-center min-h-[400px] text-center">
                    <Wand2 className="h-12 w-12 text-gray-500 mb-4" />
                    <h3 className="text-gray-300 text-lg font-medium mb-2">No Cover Letter Generated Yet</h3>
                    <p className="text-gray-400 max-w-md">
                      Fill in the job details on the left and click "Generate Cover Letter" to create your personalized
                      cover letter.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="bg-[#181818] border-gray-700">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-blue-400">Cover Letter Tips</CardTitle>
                <CardDescription className="text-gray-400">
                  Best practices for an effective cover letter
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h3 className="text-gray-200 font-medium">Keep it concise</h3>
                  <p className="text-gray-400 text-sm">
                    Aim for 3-4 paragraphs and no more than one page. Hiring managers often skim cover letters.
                  </p>
                </div>

                <div className="space-y-2">
                  <h3 className="text-gray-200 font-medium">Customize for each application</h3>
                  <p className="text-gray-400 text-sm">
                    Tailor your cover letter for each job by highlighting relevant skills and experiences.
                  </p>
                </div>

                <div className="space-y-2">
                  <h3 className="text-gray-200 font-medium">Address specific requirements</h3>
                  <p className="text-gray-400 text-sm">
                    Reference key requirements from the job description and explain how you meet them.
                  </p>
                </div>

                <div className="space-y-2">
                  <h3 className="text-gray-200 font-medium">Show enthusiasm</h3>
                  <p className="text-gray-400 text-sm">
                    Express genuine interest in the role and company to demonstrate your motivation.
                  </p>
                </div>

                <div className="space-y-2">
                  <h3 className="text-gray-200 font-medium">Proofread carefully</h3>
                  <p className="text-gray-400 text-sm">
                    Check for spelling, grammar, and formatting errors before submitting your application.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  )
}

