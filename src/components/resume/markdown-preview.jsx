"use client"

import { useEffect, useState } from "react"
import dynamic from "next/dynamic"
import "katex/dist/katex.min.css"

// Dynamically import ReactMarkdown with no SSR
const ReactMarkdown = dynamic(() => import("react-markdown"), {
  ssr: false,
})

// Simple component to render markdown content safely
const MarkdownPreview = ({ content }) => {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <div className="animate-pulse bg-gray-700 h-96 w-full rounded-md"></div>
  }

  // Use a simple rendering approach without LaTeX plugins to avoid errors
  return (
    <div className="markdown-preview prose prose-invert">
      <ReactMarkdown>{content}</ReactMarkdown>
    </div>
  )
}

export default MarkdownPreview

