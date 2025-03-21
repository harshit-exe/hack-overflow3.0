"use client"

import { useState } from "react"
import axios from "axios"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Loader2, Search, Link } from "lucide-react"

export default function CareerPathForm({ onSubmit, isLoading, setIsScrapingLoading, setScrapingError }) {
  const [input, setInput] = useState("")
  const [isUrl, setIsUrl] = useState(false)

  const handleInputChange = (e) => {
    const value = e.target.value
    setInput(value)
    setIsUrl(value.startsWith("http"))
  }

  const scrapeWebsite = async (url) => {
    setIsScrapingLoading(true)
    setScrapingError(null)
    try {
      const response = await axios.get("/api/scrape", {
        params: { url },
        timeout: 30000, // 30 seconds timeout
      })
      return response.data
    } catch (error) {
      console.error("Error scraping website:", error)
      if (error.code === "ECONNABORTED") {
        setScrapingError("Request timed out. The website might be slow or unavailable.")
      } else if (error.response && error.response.status === 404) {
        setScrapingError("The requested page was not found. Please check the URL and try again.")
      } else {
        setScrapingError("Failed to scrape website content. Please check the URL and try again.")
      }
      throw error
    } finally {
      setIsScrapingLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!input.trim()) return

    let scrapedContent = null

    if (input.startsWith("http")) {
      try {
        scrapedContent = await scrapeWebsite(input)
      } catch (error) {
        // Error is already handled in scrapeWebsite
        return
      }
    }

    onSubmit(input, scrapedContent)
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mb-12 bg-black/80 backdrop-blur-md p-6 md:p-8 rounded-2xl shadow-2xl border border-gray-800 transition-all hover:border-[#4F46E5]/50"
    >
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-grow">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            {isUrl ? <Link className="h-5 w-5 text-[#57FF31]" /> : <Search className="h-5 w-5 text-gray-400" />}
          </div>
          <Input
            type="text"
            value={input}
            onChange={handleInputChange}
            placeholder="Enter a job title, skill, or paste a job listing URL"
            className="flex-grow py-6 pl-12 text-base md:text-lg rounded-xl border-2 border-gray-700 bg-black/50 text-white focus:border-[#57FF31] focus:ring-1 focus:ring-[#57FF31] transition-all"
          />
        </div>
        <Button
          type="submit"
          disabled={isLoading || !input.trim()}
          className="bg-gradient-to-r from-[#4F46E5] to-[#57FF31] hover:from-[#57FF31] hover:to-[#4F46E5] text-white font-bold py-6 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              {isUrl ? "Analyzing..." : "Generating..."}
            </>
          ) : (
            <>Generate Career Path</>
          )}
        </Button>
      </div>
      <p className="mt-3 text-gray-400 text-sm">
        {isUrl
          ? "We'll analyze this job listing to create a personalized career path"
          : "Enter a job title or skill to get started, or paste a job listing URL for more specific guidance"}
      </p>
    </form>
  )
}

