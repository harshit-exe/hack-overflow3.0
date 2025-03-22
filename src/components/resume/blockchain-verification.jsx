"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2, Check, AlertTriangle, ExternalLink, Copy } from "lucide-react"
import { connectWallet, storeResumeOnBlockchain, getResumeHistory, generateQRCode } from "@/lib/blockchain"

const BlockchainVerification = ({ resume }) => {
  const [isConnected, setIsConnected] = useState(false)
  const [walletAddress, setWalletAddress] = useState("")
  const [loading, setLoading] = useState(false)
  const [verificationStatus, setVerificationStatus] = useState(null)
  const [resumeHistory, setResumeHistory] = useState([])
  const [qrCode, setQrCode] = useState(null)
  const [error, setError] = useState(null)

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
      const history = await getResumeHistory(address)
      setResumeHistory(history)
    } catch (error) {
      console.error("Error loading resume history:", error)
    }
  }

  // Handle wallet connection
  const handleConnectWallet = async () => {
    try {
      setLoading(true)
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
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-blue-400">Blockchain Verification</CardTitle>
        <CardDescription className="text-gray-400">
          Verify your resume on the blockchain to prevent fraud and ensure authenticity
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
              <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => copyToClipboard(walletAddress)}>
                <Copy className="h-3 w-3 text-gray-400" />
              </Button>
            </div>
          ) : (
            <Button
              variant="outline"
              size="sm"
              className="border-blue-500 text-white bg-blue-700 hover:bg-blue-800 hover:text-white cursor-pointer"
              onClick={handleConnectWallet}
              disabled={loading}
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : "Connect Wallet"}
            </Button>
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
                  href={`https://mumbai.polygonscan.com/tx/${verificationStatus.txHash}`}
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

        {/* QR Code */}
        {qrCode && (
          <div className="flex flex-col items-center p-4 bg-gray-700 rounded-md">
            <h3 className="text-gray-300 mb-2">Verification QR Code</h3>
            <div className="bg-white p-2 rounded-md">
              <img src={qrCode || "/placeholder.svg"} alt="Verification QR Code" width={200} height={200} />
            </div>
            <p className="text-gray-400 text-sm mt-2 text-center">
              HR can scan this QR code to verify your resume authenticity
            </p>
          </div>
        )}

        {/* Resume History */}
        {resumeHistory.length > 0 && (
          <div className="mt-4">
            <h3 className="text-gray-300 mb-2">Resume Update History</h3>
            <div className="space-y-2 max-h-[200px] overflow-y-auto pr-2">
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
          disabled={loading}
        >
          {loading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <>
              {verificationStatus && verificationStatus.success ? "Update Verification" : "Verify Resume on Blockchain"}
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}

export default BlockchainVerification

