"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Loader2, Check, AlertTriangle, Copy, ArrowLeft, Clock, Info, FileText } from "lucide-react"
import Link from "next/link"
import {
  getUserId,
  storeResumeForVerification,
  getResumeHistory,
  generateVerificationQR,
} from "@/lib/simplified-verification"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"

export default function VerifyPage() {
  const [resume, setResume] = useState(null)
  const [userId, setUserId] = useState("")
  const [loading, setLoading] = useState(false)
  const [verificationStatus, setVerificationStatus] = useState(null)
  const [resumeHistory, setResumeHistory] = useState([])
  const [qrCode, setQrCode] = useState(null)
  const [error, setError] = useState(null)
  const [showHashInfo, setShowHashInfo] = useState(false)
  const [selectedVersion, setSelectedVersion] = useState(null)

  // Load resume data from local storage on component mount
  useEffect(() => {
    try {
      // Get user ID
      const id = getUserId()
      setUserId(id)

      // Load resume data
      const savedData = localStorage.getItem("resume-builder-data")
      if (savedData) {
        const parsedData = JSON.parse(savedData)
        setResume(parsedData)
      }

      // Load resume history
      loadResumeHistory()
    } catch (error) {
      console.error("Error loading data:", error)
      setError("Could not load resume data. Please go back and create a resume first.")
    }
  }, [])

  // Load resume history
  const loadResumeHistory = () => {
    try {
      setLoading(true)
      const history = getResumeHistory()
      setResumeHistory(history)
      setLoading(false)
    } catch (error) {
      console.error("Error loading resume history:", error)
      setLoading(false)
    }
  }

  // Store resume for verification
  const handleVerifyResume = async () => {
    if (!resume) {
      setError("No resume data found. Please go back and create a resume first.")
      return
    }

    try {
      setLoading(true)
      setError(null)

      // Store resume for verification
      const result = await storeResumeForVerification(resume)

      if (result.success) {
        setVerificationStatus({
          success: true,
          hash: result.hash,
          timestamp: result.timestamp,
          changes: result.changes,
        })

        // Generate QR code
        const qrCodeData = await generateVerificationQR(result.hash)
        setQrCode(qrCodeData)

        // Reload resume history
        loadResumeHistory()
      } else {
        setError(result.error)
      }

      setLoading(false)
    } catch (error) {
      setError(error.message)
      setLoading(false)
    }
  }

  // Copy to clipboard
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
  }

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString()
  }

  // View version details
  const viewVersionDetails = (version) => {
    setSelectedVersion(version)
  }

  return (
    <div className="min-h-screen">
      <div className="container mx-auto py-8">
        <div className="flex items-center mb-6">
          <Link href="/dashboard/skill/resume/resume-builder" className="flex items-center text-white hover:text-blue-400">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Resume Builder
          </Link>
        </div>

        <h1 className="text-4xl font-bold text-white text-center mb-8 animate-fadeIn"> <span className="text-blue-400">Resume</span>  Verification System</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-6">
            <Card className="bg-[#181818] border-gray-700">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-blue-400">Verify Your Resume</CardTitle>
                <CardDescription className="text-gray-400">
                  Create a verifiable record of your resume to prevent fraud and ensure authenticity
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* User ID */}
                <div className="flex items-center justify-between p-3 bg-gray-700 rounded-md">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full mr-2 bg-green-500"></div>
                    <span className="text-gray-300">Your Verification ID:</span>
                  </div>

                  <div className="flex items-center">
                    <span className="text-gray-300 text-sm mr-2 truncate max-w-[150px]">{userId}</span>
                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => copyToClipboard(userId)}>
                      <Copy className="h-3 w-3 text-gray-400" />
                    </Button>
                  </div>
                </div>

                {/* Resume Status */}
                <div className="p-3 bg-gray-700 rounded-md">
                  <h3 className="text-gray-300 mb-2">Resume Status</h3>
                  {resume ? (
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <Check className="text-green-500 mr-2" size={16} />
                        <span className="text-gray-300">Resume loaded from local storage</span>
                      </div>
                      <div className="text-sm text-gray-400">Name: {resume.name || "Not specified"}</div>
                      <div className="text-sm text-gray-400">Title: {resume.title || "Not specified"}</div>
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <AlertTriangle className="text-yellow-500 mr-2" size={16} />
                      <span className="text-gray-300">No resume found. Please create a resume first.</span>
                    </div>
                  )}
                </div>

                {/* Verification Status */}
                {verificationStatus && verificationStatus.success && (
                  <div className="p-4 bg-green-900/30 border border-green-700 rounded-md">
                    <div className="flex items-center mb-2">
                      <Check className="text-green-500 mr-2" size={18} />
                      <span className="text-green-400 font-medium">Resume Verified Successfully</span>
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <span className="text-gray-400 mr-1">Verification Hash:</span>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-5 w-5 p-0"
                                  onClick={() => setShowHashInfo(true)}
                                >
                                  <Info className="h-3 w-3 text-blue-400" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Click for hash information</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                        <div className="flex items-center">
                          <span className="text-gray-300 truncate max-w-[200px] font-mono text-xs">
                            {verificationStatus.hash}
                          </span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 ml-1"
                            onClick={() => copyToClipboard(verificationStatus.hash)}
                          >
                            <Copy className="h-3 w-3 text-gray-400" />
                          </Button>
                        </div>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-gray-400">Timestamp:</span>
                        <span className="text-gray-300">{formatDate(verificationStatus.timestamp)}</span>
                      </div>

                      {/* Changes Made */}
                      <div className="mt-2">
                        <h4 className="text-gray-300 font-medium mb-1">Changes in this version:</h4>
                        <ul className="list-disc pl-5 space-y-1">
                          {verificationStatus.changes.map((change, index) => (
                            <li key={index} className="text-gray-300 text-xs">
                              {change}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                )}

                {/* Error Message */}
                {error && (
                  <div className="p-3 bg-red-900/30 border border-red-700 rounded-md flex items-start">
                    <AlertTriangle className="text-red-500 mr-2 mt-0.5 flex-shrink-0" size={16} />
                    <span className="text-red-400 text-sm">{error}</span>
                  </div>
                )}
              </CardContent>

              <CardFooter>
                <Button
                  className="w-full bg-green-600 hover:bg-green-700 text-white"
                  onClick={handleVerifyResume}
                  disabled={loading || !resume}
                >
                  {loading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <>{verificationStatus && verificationStatus.success ? "Update Verification" : "Verify Resume"}</>
                  )}
                </Button>
              </CardFooter>
            </Card>

            {/* Resume History */}
            {resumeHistory.length > 0 && (
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold text-blue-400">Resume History</CardTitle>
                  <CardDescription className="text-gray-400">Complete history of your resume updates</CardDescription>
                </CardHeader>

                <CardContent>
                  <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
                    {resumeHistory.map((entry, index) => (
                      <div key={index} className="p-3 bg-gray-700 rounded-md">
                        <div className="flex justify-between items-center mb-1">
                          <Badge variant="outline" className="bg-blue-900/30 text-blue-300 border-blue-500">
                            v{resumeHistory.length - index}
                          </Badge>
                          <div className="flex items-center text-gray-400 text-xs">
                            <Clock className="h-3 w-3 mr-1" />
                            {formatDate(entry.timestamp)}
                          </div>
                        </div>
                        <div className="text-sm text-gray-300 mt-1">
                          {entry.preview.name} - {entry.preview.title}
                        </div>
                        <div className="mt-2 flex justify-between items-center">
                          <div className="text-xs text-gray-400">
                            {entry.changes && entry.changes.length > 0 && (
                              <span>
                                {entry.changes[0]}
                                {entry.changes.length > 1 ? ` +${entry.changes.length - 1} more` : ""}
                              </span>
                            )}
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 text-xs text-blue-400 hover:text-blue-300"
                            onClick={() => viewVersionDetails(entry)}
                          >
                            <FileText className="h-3 w-3 mr-1" />
                            Details
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          <div className="space-y-6">
            {/* QR Code */}
            {qrCode && (
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold text-blue-400">Verification QR Code</CardTitle>
                  <CardDescription className="text-gray-400">
                    Share this QR code with potential employers to verify your resume
                  </CardDescription>
                </CardHeader>

                <CardContent className="flex flex-col items-center">
                  <div className="bg-white p-4 rounded-md">
                    <img src={qrCode || "/placeholder.svg"} alt="Verification QR Code" width={250} height={250} />
                  </div>
                  <p className="text-gray-400 text-sm mt-4 text-center">
                    HR can scan this QR code to verify your resume authenticity
                  </p>
                </CardContent>

                <CardFooter>
                  <Button
                    className="w-full"
                    variant="outline"
                    onClick={() => {
                      // Download QR code
                      const link = document.createElement("a")
                      link.href = qrCode
                      link.download = "resume-verification-qr.png"
                      document.body.appendChild(link)
                      link.click()
                      document.body.removeChild(link)
                    }}
                  >
                    Download QR Code
                  </Button>
                </CardFooter>
              </Card>
            )}

            {/* How It Works */}
            <Card className="bg-[#181818] border-gray-700">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-blue-400">How It Works</CardTitle>
                <CardDescription className="text-gray-400">Understanding resume verification</CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h3 className="text-gray-200 font-medium">What is resume verification?</h3>
                  <p className="text-gray-400 text-sm">
                    Resume verification creates a tamper-proof record of your resume by storing a cryptographic hash and
                    timestamp. This provides proof that your resume hasn't been altered since verification.
                  </p>
                </div>

                <div className="space-y-2">
                  <h3 className="text-gray-200 font-medium">How the verification works:</h3>
                  <ol className="text-gray-400 text-sm space-y-1 list-decimal pl-5">
                    <li>Your resume is converted to a unique fingerprint (hash) using SHA-256 algorithm</li>
                    <li>This hash is stored along with a timestamp and list of changes</li>
                    <li>Each update creates a new entry in your history with detailed change tracking</li>
                    <li>The QR code links to a verification page with your resume's unique hash</li>
                    <li>Anyone with the QR code can verify your resume's authenticity and see its history</li>
                  </ol>
                </div>

                <div className="space-y-2">
                  <h3 className="text-gray-200 font-medium">Benefits for job seekers</h3>
                  <ul className="text-gray-400 text-sm space-y-1 list-disc pl-5">
                    <li>Prove the authenticity of your credentials and experience</li>
                    <li>Stand out from candidates with unverified resumes</li>
                    <li>Create a transparent history of your professional growth</li>
                    <li>Prevent others from copying your projects and experience</li>
                  </ul>
                </div>

                <div className="space-y-2">
                  <h3 className="text-gray-200 font-medium">Benefits for employers</h3>
                  <ul className="text-gray-400 text-sm space-y-1 list-disc pl-5">
                    <li>Quickly verify the authenticity of candidate resumes</li>
                    <li>See when resume information was last updated</li>
                    <li>View a complete history of resume changes</li>
                    <li>Identify candidates with verified credentials</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Hash Information Dialog */}
      <Dialog open={showHashInfo} onOpenChange={setShowHashInfo}>
        <DialogContent className="bg-gray-800 text-gray-200 border-gray-700">
          <DialogHeader>
            <DialogTitle className="text-blue-400">Verification Hash Information</DialogTitle>
            <DialogDescription className="text-gray-400">Understanding how your resume is verified</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            <div className="p-3 bg-gray-700 rounded-md">
              <h3 className="text-gray-200 font-medium mb-2">What is a verification hash?</h3>
              <p className="text-gray-300 text-sm">
                A verification hash is a unique digital fingerprint of your resume created using the SHA-256
                cryptographic algorithm. This hash will change if even a single character in your resume is modified,
                making it perfect for verification.
              </p>
            </div>

            {verificationStatus && verificationStatus.hash && (
              <div className="p-3 bg-gray-700 rounded-md">
                <h3 className="text-gray-200 font-medium mb-2">Your Current Hash:</h3>
                <div className="bg-gray-900 p-2 rounded font-mono text-xs text-gray-300 break-all">
                  {verificationStatus.hash}
                </div>
                <p className="text-gray-400 text-xs mt-2">
                  This hash was generated on {formatDate(verificationStatus.timestamp)}
                </p>
              </div>
            )}

            <div className="p-3 bg-gray-700 rounded-md">
              <h3 className="text-gray-200 font-medium mb-2">How verification works:</h3>
              <ol className="text-gray-300 text-sm space-y-1 list-decimal pl-5">
                <li>Your resume data is processed through the SHA-256 algorithm</li>
                <li>The resulting hash is unique to your resume's exact content</li>
                <li>When someone verifies your resume, a new hash is generated</li>
                <li>If the new hash matches the stored hash, the resume is verified</li>
                <li>If even one character is different, the hash won't match</li>
              </ol>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Version Details Dialog */}
      <Dialog open={!!selectedVersion} onOpenChange={() => setSelectedVersion(null)}>
        <DialogContent className="bg-gray-800 text-gray-200 border-gray-700">
          <DialogHeader>
            <DialogTitle className="text-blue-400">Resume Version Details</DialogTitle>
            <DialogDescription className="text-gray-400">
              {selectedVersion && formatDate(selectedVersion.timestamp)}
            </DialogDescription>
          </DialogHeader>

          {selectedVersion && (
            <div className="space-y-4 mt-4">
              <div className="p-3 bg-gray-700 rounded-md">
                <h3 className="text-gray-200 font-medium mb-2">Version Information</h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <span className="text-gray-400">Name:</span>
                  <span className="text-gray-300">{selectedVersion.preview.name}</span>
                  <span className="text-gray-400">Title:</span>
                  <span className="text-gray-300">{selectedVersion.preview.title}</span>
                  <span className="text-gray-400">Version:</span>
                  <span className="text-gray-300">
                    {resumeHistory.findIndex((v) => v.hash === selectedVersion.hash) + 1} of {resumeHistory.length}
                  </span>
                </div>
              </div>

              <div className="p-3 bg-gray-700 rounded-md">
                <h3 className="text-gray-200 font-medium mb-2">Hash</h3>
                <div className="bg-gray-900 p-2 rounded font-mono text-xs text-gray-300 break-all">
                  {selectedVersion.hash}
                </div>
              </div>

              <div className="p-3 bg-gray-700 rounded-md">
                <h3 className="text-gray-200 font-medium mb-2">Changes Made</h3>
                {selectedVersion.changes && selectedVersion.changes.length > 0 ? (
                  <ul className="list-disc pl-5 space-y-1">
                    {selectedVersion.changes.map((change, index) => (
                      <li key={index} className="text-gray-300 text-sm">
                        {change}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-400 text-sm">No specific changes recorded for this version.</p>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

