"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Loader2, Check, X, Clock, ExternalLink, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { getResumeHistory, verifyResumeOnBlockchain, getAddressExplorerUrl } from "@/lib/blockchain"

export default function VerifyResume() {
  const searchParams = useSearchParams()
  const [resumeHash, setResumeHash] = useState("")
  const [walletAddress, setWalletAddress] = useState("")
  const [loading, setLoading] = useState(false)
  const [verificationResult, setVerificationResult] = useState(null)
  const [resumeHistory, setResumeHistory] = useState([])
  const [error, setError] = useState(null)

  useEffect(() => {
    // Get hash and address from URL parameters
    const hash = searchParams.get("hash")
    const address = searchParams.get("address")

    if (hash) setResumeHash(hash)
    if (address) setWalletAddress(address)

    // If both hash and address are provided, verify automatically
    if (hash && address) {
      verifyResume(hash, address)
    }
  }, [searchParams])

  const verifyResume = async (hash = resumeHash, address = walletAddress) => {
    if (!hash || !address) {
      setError("Please enter both resume hash and wallet address")
      return
    }

    setLoading(true)
    setError(null)

    try {
      // Get resume history from blockchain
      const history = await getResumeHistory(address)
      setResumeHistory(history)

      // Verify resume on blockchain
      const result = await verifyResumeOnBlockchain(address, hash)

      if (result.verified) {
        setVerificationResult({
          verified: true,
          timestamp: result.timestamp,
          message: "This resume is authentic and verified on the blockchain",
        })
      } else {
        setVerificationResult({
          verified: false,
          message: "This resume hash was not found on the blockchain",
        })
      }
    } catch (error) {
      console.error("Error verifying resume:", error)
      setError(error.message)
      setVerificationResult({
        verified: false,
        message: "Error verifying resume. Please check your connection and try again.",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="container mx-auto py-8">
        <div className="flex items-center mb-6">
          <Link href="/" className="flex items-center text-blue-500 hover:text-blue-400">
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
                Check if a resume is authentic and has been verified on the blockchain
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Input Form */}
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-gray-300 mb-1 block">Resume Hash</label>
                  <Input
                    placeholder="Enter resume hash..."
                    value={resumeHash}
                    onChange={(e) => setResumeHash(e.target.value)}
                    className="bg-gray-700 border-gray-600 text-gray-200"
                  />
                </div>

                <div>
                  <label className="text-sm text-gray-300 mb-1 block">Wallet Address</label>
                  <Input
                    placeholder="Enter wallet address..."
                    value={walletAddress}
                    onChange={(e) => setWalletAddress(e.target.value)}
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
                      <span>Verified on: {new Date(verificationResult.timestamp).toLocaleString()}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Resume History */}
              {resumeHistory.length > 0 && (
                <div>
                  <h3 className="text-gray-300 mb-2">Resume Update History</h3>
                  <div className="space-y-2 max-h-[200px] overflow-y-auto">
                    {resumeHistory.map((entry, index) => (
                      <div
                        key={index}
                        className={`p-3 rounded-md flex justify-between items-center ${
                          entry.hash === resumeHash ? "bg-blue-900/30 border border-blue-700" : "bg-gray-700"
                        }`}
                      >
                        <div className="flex items-center">
                          <span className="text-gray-300 text-sm truncate max-w-[200px]">{entry.hash}</span>
                        </div>
                        <span className="text-gray-400 text-xs">{new Date(entry.timestamp).toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>

            <CardFooter className="flex flex-col space-y-4">
              <Button
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                onClick={() => verifyResume()}
                disabled={loading}
              >
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Verify Resume"}
              </Button>

              {walletAddress && (
                <div className="text-center text-gray-400 text-sm">
                  <a
                    href={getAddressExplorerUrl(walletAddress)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:underline flex items-center justify-center"
                  >
                    View Address on Blockchain Explorer
                    <ExternalLink className="h-3 w-3 ml-1" />
                  </a>
                </div>
              )}
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}

