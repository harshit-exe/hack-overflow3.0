// Real blockchain implementation using ethers.js
import { ethers } from "ethers"

// Smart contract ABI (Application Binary Interface)
const CONTRACT_ABI = [
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "_resumeHash",
        type: "bytes32",
      },
    ],
    name: "addResume",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "user",
        type: "address",
      },
    ],
    name: "getResumeHistory",
    outputs: [
      {
        components: [
          {
            internalType: "bytes32",
            name: "resumeHash",
            type: "bytes32",
          },
          {
            internalType: "uint256",
            name: "timestamp",
            type: "uint256",
          },
        ],
        internalType: "struct ResumeVerification.Resume[]",
        name: "",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "user",
        type: "address",
      },
      {
        internalType: "bytes32",
        name: "_resumeHash",
        type: "bytes32",
      },
    ],
    name: "verifyResume",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
]

// Contract address on Sepolia Testnet - you'll need to deploy your contract and update this
const CONTRACT_ADDRESS = "0x742d35Cc6634C0532925a3b844Bc454e4438f44e" // Example contract address

// Hash the resume data using SHA-256
export const hashResumeData = (resumeData) => {
  return ethers.utils.id(JSON.stringify(resumeData))
}

// Connect to the blockchain using MetaMask
export const connectWallet = async () => {
  try {
    // Check if MetaMask is installed
    if (!window.ethereum) {
      throw new Error("MetaMask not installed! Please install MetaMask to use blockchain features.")
    }

    // Request account access
    await window.ethereum.request({ method: "eth_requestAccounts" })

    // Create ethers provider and signer
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner()
    const address = await signer.getAddress()

    // Check if we're on the correct network (Sepolia)
    const network = await provider.getNetwork()
    if (network.chainId !== 11155111) {
      try {
        // Try to switch to Sepolia network
        await window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: "0xaa36a7" }], // 11155111 in hex
        })
      } catch (switchError) {
        // If Sepolia network is not added, add it
        if (switchError.code === 4902) {
          await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: "0xaa36a7",
                chainName: "Sepolia Testnet",
                nativeCurrency: {
                  name: "Sepolia ETH",
                  symbol: "ETH",
                  decimals: 18,
                },
                rpcUrls: [
                  "https://eth-sepolia.g.alchemy.com/v2/demo",
                  "https://rpc.sepolia.org",
                  "https://sepolia.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161",
                ],
                blockExplorerUrls: ["https://sepolia.etherscan.io/"],
              },
            ],
          })
        } else {
          throw switchError
        }
      }
    }

    return { provider, signer, address }
  } catch (error) {
    console.error("Error connecting to wallet:", error)
    throw error
  }
}

// Get contract instance
export const getContract = async () => {
  try {
    const { signer } = await connectWallet()
    return new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer)
  } catch (error) {
    console.error("Error getting contract:", error)
    throw error
  }
}

// Store resume hash on blockchain
export const storeResumeOnBlockchain = async (resumeData) => {
  try {
    const resumeHash = hashResumeData(resumeData)
    console.log("Resume hash:", resumeHash)

    // Get contract instance
    const contract = await getContract()

    // Store hash on blockchain
    const tx = await contract.addResume(resumeHash)
    console.log("Transaction sent:", tx.hash)

    // Wait for transaction to be mined
    const receipt = await tx.wait()
    console.log("Transaction confirmed:", receipt)

    return {
      success: true,
      hash: resumeHash,
      txHash: tx.hash,
    }
  } catch (error) {
    console.error("Error storing resume on blockchain:", error)

    // If MetaMask is not connected or user rejected transaction
    if (error.code === 4001) {
      return {
        success: false,
        error: "Transaction rejected. Please approve the transaction in MetaMask.",
      }
    }

    return {
      success: false,
      error: error.message,
    }
  }
}

// Get resume history from blockchain
export const getResumeHistory = async (address) => {
  try {
    const contract = await getContract()
    const history = await contract.getResumeHistory(address)

    // Format history data
    return history.map((entry) => ({
      hash: entry.resumeHash,
      timestamp: new Date(entry.timestamp.toNumber() * 1000).toISOString(),
    }))
  } catch (error) {
    console.error("Error getting resume history:", error)
    return []
  }
}

// Verify resume on blockchain
export const verifyResumeOnBlockchain = async (address, resumeHash) => {
  try {
    const contract = await getContract()
    const [verified, timestamp] = await contract.verifyResume(address, resumeHash)

    return {
      verified,
      timestamp: verified ? new Date(timestamp.toNumber() * 1000).toISOString() : null,
    }
  } catch (error) {
    console.error("Error verifying resume:", error)
    return { verified: false, timestamp: null }
  }
}

// Generate QR code for resume verification
export const generateQRCode = async (resumeHash, walletAddress) => {
  try {
    // Create verification URL
    const verificationUrl = `${window.location.origin}/verify?hash=${resumeHash}&address=${walletAddress}`

    // Generate QR code using a public API
    return `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(verificationUrl)}`
  } catch (error) {
    console.error("Error generating QR code:", error)
    return null
  }
}

// Get explorer URL for transaction
export const getExplorerUrl = (txHash) => {
  return `https://sepolia.etherscan.io/tx/${txHash}`
}

// Get explorer URL for address
export const getAddressExplorerUrl = (address) => {
  return `https://sepolia.etherscan.io/address/${address}`
}

