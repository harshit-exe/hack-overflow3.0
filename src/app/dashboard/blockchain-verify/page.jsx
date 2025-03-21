"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Loader2, Check, AlertTriangle, ExternalLink, Copy, ArrowLeft } from "lucide-react"
import Link from "next/link"
import {
  connectWallet,
  storeResumeOnBlockchain,
  getResumeHistory,
  generateQRCode,
  getExplorerUrl,
  getAddressExplorerUrl,
} from "@/lib/blockchain"

export default function BlockchainVerifyPage() {
  const [resume, setResume] = useState(null)
  const [isConnected, setIsConnected] = useState(false)
  const [walletAddress, setWalletAddress] = useState("")
  const [loading, setLoading] = useState(false)
  const [verificationStatus, setVerificationStatus] = useState(null)
  const [resumeHistory, setResumeHistory] = useState([])
  const [qrCode, setQrCode] = useState(null)
  const [error, setError] = useState(null)
  const [networkName, setNetworkName] = useState("Sepolia Testnet")

  // Load resume data from local storage on component mount
  useEffect(() => {
    try {
      const savedData = localStorage.getItem("resume-builder-data")
      if (savedData) {
        const parsedData = JSON.parse(savedData)
        setResume(parsedData)
      }
    } catch (error) {
      console.error("Error loading resume from local storage:", error)
      setError("Could not load resume data. Please go back and create a resume first.")
    }
  }, [])

  // Check if MetaMask is installed
  useEffect(() => {
    if (typeof window !== "undefined") {
      if (!window.ethereum) {
        setError("MetaMask is not installed. Please install MetaMask to use blockchain features.")
      }
    }
  }, [])

  // Connect wallet on component mount
  useEffect(() => {
    const checkConnection = async () => {
      try {
        if (window.ethereum) {
          const { address } = await connectWallet()
          setWalletAddress(address)
          setIsConnected(true)

          // Load resume history
          loadResumeHistory(address)
        }
      } catch (error) {
        console.error("Error checking wallet connection:", error)
      }
    }

    checkConnection()
  }, [])

  // Load resume history from blockchain
  const loadResumeHistory = async (address) => {
    try {
      setLoading(true)
      const history = await getResumeHistory(address)
      setResumeHistory(history)
      setLoading(false)
    } catch (error) {
      console.error("Error loading resume history:", error)
      setLoading(false)
    }
  }

  // Handle wallet connection
  const handleConnectWallet = async () => {
    try {
      setLoading(true)
      setError(null)

      const { address } = await connectWallet()
      setWalletAddress(address)
      setIsConnected(true)

      // Load resume history
      await loadResumeHistory(address)

      setLoading(false)
    } catch (error) {
      setError(error.message)
      setLoading(false)
    }
  }

  // Store resume on blockchain
  const handleVerifyResume = async () => {
    if (!resume) {
      setError("No resume data found. Please go back and create a resume first.")
      return
    }

    try {
      setLoading(true)
      setError(null)

      // Check if wallet is connected
      if (!isConnected) {
        await handleConnectWallet()
      }

      // Store resume on blockchain
      const result = await storeResumeOnBlockchain(resume)

      if (result.success) {
        setVerificationStatus({
          success: true,
          hash: result.hash,
          txHash: result.txHash,
        })

        // Generate QR code
        const qrCodeData = await generateQRCode(result.hash, walletAddress)
        setQrCode(qrCodeData)

        // Reload resume history
        await loadResumeHistory(walletAddress)
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

  return (
    <div className="min-h-screen bg-black">
      <div className="container mx-auto py-8">
        <div className="flex items-center mb-6">
          <Link href="/" className="flex items-center text-blue-500 hover:text-blue-400">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Resume Builder
          </Link>
        </div>

        <h1 className="text-4xl font-bold text-blue-500 text-center mb-8 animate-fadeIn">
          Blockchain Resume Verification
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-6">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-blue-400">Verify Your Resume</CardTitle>
                <CardDescription className="text-gray-400">
                  Store your resume on the blockchain to prevent fraud and ensure authenticity
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Wallet Connection Status */}
                <div className="flex items-center justify-between p-3 bg-gray-700 rounded-md">
                  <div className="flex items-center">
                    <div className={`w-3 h-3 rounded-full mr-2 ${isConnected ? "bg-green-500" : "bg-red-500"}`}></div>
                    <span className="text-gray-300">Wallet Status:</span>
                  </div>

                  {isConnected ? (
                    <div className="flex items-center">
                      <span className="text-gray-300 text-sm mr-2 truncate max-w-[150px]">{walletAddress}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => copyToClipboard(walletAddress)}
                      >
                        <Copy className="h-3 w-3 text-gray-400" />
                      </Button>
                      <a
                        href={getAddressExplorerUrl(walletAddress)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ml-2"
                      >
                        <ExternalLink className="h-4 w-4 text-blue-400" />
                      </a>
                    </div>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-blue-500 text-blue-400 hover:bg-blue-900"
                      onClick={handleConnectWallet}
                      disabled={loading}
                    >
                      {loading ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : "Connect MetaMask"}
                    </Button>
                  )}
                </div>

                {/* Network Info */}
                <div className="p-3 bg-gray-700 rounded-md flex justify-between items-center">
                  <span className="text-gray-300">Network:</span>
                  <Badge className="bg-purple-600">{networkName}</Badge>
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
                      <span className="text-green-400 font-medium">Resume Verified on Blockchain</span>
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Resume Hash:</span>
                        <div className="flex items-center">
                          <span className="text-gray-300 truncate max-w-[200px]">{verificationStatus.hash}</span>
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
                        <span className="text-gray-400">Transaction:</span>
                        <a
                          href={getExplorerUrl(verificationStatus.txHash)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-400 hover:underline flex items-center"
                        >
                          View on Explorer
                          <ExternalLink className="h-3 w-3 ml-1" />
                        </a>
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
                  disabled={loading || !resume || !window.ethereum}
                >
                  {loading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      {verificationStatus && verificationStatus.success
                        ? "Update Verification"
                        : "Verify Resume on Blockchain"}
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>

            {/* Resume History */}
            {resumeHistory.length > 0 && (
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold text-blue-400">Resume History</CardTitle>
                  <CardDescription className="text-gray-400">
                    Complete history of your resume updates on the blockchain
                  </CardDescription>
                </CardHeader>

                <CardContent>
                  <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
                    {resumeHistory.map((entry, index) => (
                      <div key={index} className="p-2 bg-gray-700 rounded-md flex justify-between items-center">
                        <div className="flex items-center">
                          <Badge variant="outline" className="bg-blue-900/30 text-blue-300 border-blue-500 mr-2">
                            v{resumeHistory.length - index}
                          </Badge>
                          <span className="text-gray-300 text-sm truncate max-w-[150px]">{entry.hash}</span>
                        </div>
                        <span className="text-gray-400 text-xs">{new Date(entry.timestamp).toLocaleString()}</span>
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

            {/* Blockchain Info */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-blue-400">How It Works</CardTitle>
                <CardDescription className="text-gray-400">
                  Understanding blockchain-based resume verification
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h3 className="text-gray-200 font-medium">What is blockchain verification?</h3>
                  <p className="text-gray-400 text-sm">
                    Blockchain verification creates a tamper-proof record of your resume by storing a cryptographic hash
                    on a decentralized blockchain. This provides proof that your resume hasn't been altered since
                    verification.
                  </p>
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
                    <li>Reduce time spent on background checks</li>
                    <li>Identify candidates with verified credentials</li>
                  </ul>
                </div>

                <div className="space-y-2">
                  <h3 className="text-gray-200 font-medium">Technical Details</h3>
                  <p className="text-gray-400 text-sm">
                    This verification system uses the Polygon Mumbai Testnet, a blockchain network designed for testing
                    decentralized applications. Each verification creates a permanent record that can be independently
                    verified.
                  </p>
                  <p className="text-gray-400 text-sm">
                    <a
                      href="https://mumbai.polygonscan.com/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:underline"
                    >
                      View Polygon Mumbai Explorer
                    </a>
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

