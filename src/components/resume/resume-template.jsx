"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Printer } from "lucide-react"

const ResumeTemplate = ({ resume }) => {
  const [fontFamily, setFontFamily] = useState("font-sans")

  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="relative">
      <div className="absolute right-4 top-4 flex gap-2 print:hidden">
        <Button
          variant="outline"
          size="sm"
          className="bg-gray-800 border-gray-600 text-gray-200 hover:bg-gray-700"
          onClick={() => setFontFamily(fontFamily === "font-sans" ? "font-serif" : "font-sans")}
        >
          {fontFamily === "font-sans" ? "Serif" : "Sans"}
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="bg-gray-800 border-gray-600 text-gray-200 hover:bg-gray-700"
          onClick={handlePrint}
        >
          <Printer className="h-4 w-4 mr-1" />
          Print
        </Button>
      </div>

      <div className={`bg-white text-black p-8 rounded-lg shadow-lg print-content ${fontFamily}`}>
        <header className="border-b border-gray-300 pb-4 mb-6">
          <h1 className="text-3xl font-bold text-center text-gray-800">{resume.name || "Your Name"}</h1>
          {resume.title && <h2 className="text-xl text-center text-gray-600 mt-1">{resume.title}</h2>}

          {resume.contact && (
            <div className="flex flex-wrap justify-center gap-x-4 mt-3 text-sm text-gray-600">
              {resume.contact.split("\n").map((line, i) => (
                <div key={i} className="flex items-center">
                  {i > 0 && <span className="hidden md:inline mx-2">•</span>}
                  {line}
                </div>
              ))}
            </div>
          )}
        </header>

        <main className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            {resume.bio && (
              <section>
                <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-1 mb-2">
                  Professional Summary
                </h3>
                <div className="text-gray-700 whitespace-pre-line">{resume.bio}</div>
              </section>
            )}

            {resume.experience && (
              <section>
                <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-1 mb-2">Experience</h3>
                <div className="prose max-w-none text-gray-700">
                  <div
                    dangerouslySetInnerHTML={{
                      __html: formatMarkdown(resume.experience),
                    }}
                  />
                </div>
              </section>
            )}

            {resume.projects && (
              <section>
                <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-1 mb-2">Projects</h3>
                <div className="prose max-w-none text-gray-700">
                  <div
                    dangerouslySetInnerHTML={{
                      __html: formatMarkdown(resume.projects),
                    }}
                  />
                </div>
              </section>
            )}
          </div>

          <div className="space-y-6">
            {resume.skills && (
              <section>
                <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-1 mb-2">Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {resume.skills.split(",").map((skill, i) => (
                    <span key={i} className="bg-gray-100 text-gray-800 px-2 py-1 rounded-md text-sm">
                      {skill.trim()}
                    </span>
                  ))}
                </div>
              </section>
            )}

            {resume.education && (
              <section>
                <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-1 mb-2">Education</h3>
                <div className="prose max-w-none text-gray-700">
                  <div
                    dangerouslySetInnerHTML={{
                      __html: formatMarkdown(resume.education),
                    }}
                  />
                </div>
              </section>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}

// Simple markdown formatter for basic formatting
function formatMarkdown(text) {
  if (!text) return ""

  // Handle headers
  text = text.replace(/^## (.*?)$/gm, '<h4 class="text-lg font-medium mt-4 mb-1">$1</h4>')
  text = text.replace(/^# (.*?)$/gm, '<h3 class="text-xl font-semibold mt-4 mb-2">$1</h3>')

  // Handle bold
  text = text.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")

  // Handle italic
  text = text.replace(/\*(.*?)\*/g, "<em>$1</em>")

  // Handle links
  text = text.replace(
    /\[(.*?)\]$$(.*?)$$/g,
    '<a href="$2" class="text-blue-600 hover:underline" target="_blank">$1</a>',
  )

  // Handle lists
  text = text
    .replace(/^- (.*?)$/gm, "<li>$1</li>")
    .replace(/<li>.*?<\/li>/gs, (match) => `<ul class="list-disc pl-5 my-2">${match}</ul>`)

  // Handle paragraphs
  text = text.replace(/^([^<].*?)$/gm, "<p>$1</p>")

  // Clean up empty paragraphs
  text = text.replace(/<p><\/p>/g, "")

  return text
}

export default ResumeTemplate

