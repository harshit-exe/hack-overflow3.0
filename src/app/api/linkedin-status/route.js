import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Check if LinkedIn API key is configured
    const apiKey = process.env.LINKEDIN_API_KEY

    if (!apiKey) {
      return NextResponse.json({
        available: false,
        message: "LinkedIn API key not configured. Using enhanced mock data.",
      })
    }

    // You could do additional validation here if needed
    // For example, make a test API call to verify the key works

    return NextResponse.json({
      available: true,
      message: "LinkedIn API is configured and ready to use.",
    })
  } catch (error) {
    console.error("Error checking LinkedIn API status:", error)
    return NextResponse.json({
      available: false,
      message: "Error checking LinkedIn API status. Using enhanced mock data.",
    })
  }
}

