"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Loader2, Check, X, Clock, ArrowLeft, Info, FileText } from "lucide-react"
import Link from "next/link"
import { verifyResume, getResumeHistory } from "@/lib/simplified-verification"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export default function VerifyResumePage() {
  const searchParams = useSearchParams()
  const [resumeHash, setResumeHash] = useState("")
  const [userId, setUserId] = useState("")
  const [loading, setLoading] = useState(false)
  const [verificationResult, setVerificationResult] = useState(null)
  const [resumeHistory, setResumeHistory] = useState([])
  const [error, setError] = useState(null)

  useEffect(() => {
    // Get hash and userId from URL parameters
    const hash = searchParams.get("hash")
    const id = searchParams.get("userId")

    if (hash) setResumeHash(hash)
    if (id) setUserId(id)

    // If both hash and userId are provided, verify automatically
    if (hash && id) {
      verifyResumeData(hash, id)
    }
  }, [searchParams])

  const verifyResumeData = async (hash = resumeHash, id = userId) => {
    if (!hash || !id) {
      setError("Please enter both verification hash and user ID")
      return
    }

    setLoading(true)
    setError(null)

    try {
      // Get resume history
      const history = getResumeHistory(id)
      setResumeHistory(history)

      // Verify resume
      const result = verifyResume(id, hash)

      if (result.verified) {
        setVerificationResult({
          verified: true,
          timestamp: result.timestamp,
          data: result.data,
          changes: result.changes,
          message: "This resume is authentic and has been verified",
        })
      } else {
        setVerificationResult({
          verified: false,
          message:
            "This resume could not be verified. It may have been altered or the verification information is incorrect.",
        })
      }
    } catch (error) {
      console.error("Error verifying resume:", error)
      setError(error.message)
      setVerificationResult({
        verified: false,
        message: "Error verifying resume. Please check your information and try again.",
      })
    } finally {
      setLoading(false)
    }
  }

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString()
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="container mx-auto py-8">
        <div className="flex items-center mb-6">
          <Link href="/dashboard/skill/resume/resume-builder" className="flex items-center text-blue-500 hover:text-blue-400">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Resume Builder
          </Link>
        </div>

        <h1 className="text-4xl font-bold text-blue-500 text-center mb-8 animate-fadeIn">Resume Verification</h1>

        <div className="max-w-2xl mx-auto">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-blue-400">Verify Resume Authenticity</CardTitle>
              <CardDescription className="text-gray-400">
                Check if a resume is authentic and has been verified
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Input Form */}
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-gray-300 mb-1 block">Verification Hash</label>
                  <Input
                    placeholder="Enter verification hash..."
                    value={resumeHash}
                    onChange={(e) => setResumeHash(e.target.value)}
                    className="bg-gray-700 border-gray-600 text-gray-200"
                  />
                </div>

                <div>
                  <label className="text-sm text-gray-300 mb-1 block">User ID</label>
                  <Input
                    placeholder="Enter user ID..."
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                    className="bg-gray-700 border-gray-600 text-gray-200"
                  />
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="p-3 bg-red-900/30 border border-red-700 rounded-md flex items-start">
                  <X className="text-red-500 mr-2 mt-0.5 flex-shrink-0" size={16} />
                  <span className="text-red-400 text-sm">{error}</span>
                </div>
              )}

              {/* Verification Result */}
              {verificationResult && (
                <div
                  className={`p-4 rounded-md ${
                    verificationResult.verified
                      ? "bg-green-900/30 border border-green-700"
                      : "bg-red-900/30 border border-red-700"
                  }`}
                >
                  <div className="flex items-center mb-2">
                    {verificationResult.verified ? (
                      <>
                        <Check className="text-green-500 mr-2" size={20} />
                        <span className="text-green-400 font-medium">Verified</span>
                      </>
                    ) : (
                      <>
                        <X className="text-red-500 mr-2" size={20} />
                        <span className="text-red-400 font-medium">Not Verified</span>
                      </>
                    )}
                  </div>

                  <p className="text-gray-300">{verificationResult.message}</p>

                  {verificationResult.verified && verificationResult.timestamp && (
                    <div className="mt-2 flex items-center text-gray-400 text-sm">
                      <Clock className="mr-1" size={14} />
                      <span>Verified on: {formatDate(verificationResult.timestamp)}</span>
                    </div>
                  )}

                  {/* Display changes made in this version */}
                  {verificationResult.verified &&
                    verificationResult.changes &&
                    verificationResult.changes.length > 0 && (
                      <div className="mt-3">
                        <Accordion type="single" collapsible className="w-full">
                          <AccordionItem value="changes" className="border-gray-700">
                            <AccordionTrigger className="text-sm text-gray-300 hover:text-gray-200">
                              <div className="flex items-center">
                                <FileText className="h-4 w-4 mr-2" />
                                Changes in this version
                              </div>
                            </AccordionTrigger>
                            <AccordionContent>
                              <ul className="list-disc pl-5 space-y-1 text-sm text-gray-300">
                                {verificationResult.changes.map((change, index) => (
                                  <li key={index}>{change}</li>
                                ))}
                              </ul>
                            </AccordionContent>
                          </AccordionItem>
                        </Accordion>
                      </div>
                    )}

                  {/* Display verified resume data */}
                  {verificationResult.verified && verificationResult.data && (
                    <div className="mt-4 p-3 bg-gray-700 rounded-md">
                      <h3 className="text-gray-200 font-medium mb-2">Verified Resume Information:</h3>
                      <div className="space-y-1 text-sm">
                        <p className="text-gray-300">
                          <strong>Name:</strong> {verificationResult.data.name}
                        </p>
                        <p className="text-gray-300">
                          <strong>Title:</strong> {verificationResult.data.title}
                        </p>
                        {verificationResult.data.skills && (
                          <p className="text-gray-300">
                            <strong>Skills:</strong> {verificationResult.data.skills}
                          </p>
                        )}

                        <Accordion type="single" collapsible className="w-full mt-2">
                          <AccordionItem value="details" className="border-gray-700">
                            <AccordionTrigger className="text-sm text-gray-300 hover:text-gray-200">
                              <div className="flex items-center">
                                <Info className="h-4 w-4 mr-2" />
                                View Full Resume Details
                              </div>
                            </AccordionTrigger>
                            <AccordionContent>
                              <div className="space-y-3 text-sm">
                                {verificationResult.data.bio && (
                                  <div>
                                    <h4 className="font-medium text-gray-300">Professional Summary:</h4>
                                    <p className="text-gray-400 whitespace-pre-line">{verificationResult.data.bio}</p>
                                  </div>
                                )}

                                {verificationResult.data.experience && (
                                  <div>
                                    <h4 className="font-medium text-gray-300">Experience:</h4>
                                    <p className="text-gray-400 whitespace-pre-line">
                                      {verificationResult.data.experience}
                                    </p>
                                  </div>
                                )}

                                {verificationResult.data.education && (
                                  <div>
                                    <h4 className="font-medium text-gray-300">Education:</h4>
                                    <p className="text-gray-400 whitespace-pre-line">
                                      {verificationResult.data.education}
                                    </p>
                                  </div>
                                )}

                                {verificationResult.data.projects && (
                                  <div>
                                    <h4 className="font-medium text-gray-300">Projects:</h4>
                                    <p className="text-gray-400 whitespace-pre-line">
                                      {verificationResult.data.projects}
                                    </p>
                                  </div>
                                )}
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                        </Accordion>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Resume History */}
              {resumeHistory.length > 0 && (
                <div>
                  <h3 className="text-gray-300 mb-2">Resume Update History</h3>
                  <div className="space-y-2 max-h-[300px] overflow-y-auto">
                    {resumeHistory.map((entry, index) => (
                      <div
                        key={index}
                        className={`p-3 rounded-md ${
                          entry.hash === resumeHash ? "bg-blue-900/30 border border-blue-700" : "bg-gray-700"
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <div className="text-gray-300 text-sm">
                            {entry.preview.name} - {entry.preview.title}
                          </div>
                          <span className="text-gray-400 text-xs">{formatDate(entry.timestamp)}</span>
                        </div>

                        {entry.changes && entry.changes.length > 0 && (
                          <div className="mt-2 text-xs text-gray-400">
                            <strong>Changes:</strong> {entry.changes[0]}
                            {entry.changes.length > 1 ? ` +${entry.changes.length - 1} more` : ""}
                          </div>
                        )}

                        {entry.hash !== resumeHash && (
                          <div className="mt-2 text-right">
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-7 text-xs border-blue-600 text-blue-400 hover:bg-blue-900/30"
                              onClick={() => {
                                setResumeHash(entry.hash)
                                verifyResumeData(entry.hash, userId)
                              }}
                            >
                              Verify This Version
                            </Button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>

            <CardFooter>
              <Button
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                onClick={() => verifyResumeData()}
                disabled={loading}
              >
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Verify Resume"}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}

