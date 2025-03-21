"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useState } from "react"
import { Briefcase, BookOpen, TrendingUp, Award, Loader2 } from "lucide-react"

export function CareerAdvice({ careerPath, educationLevel, generateAdvice, isGeneratingAdvice }) {
  const [strengths, setStrengths] = useState("")
  const [weaknesses, setWeaknesses] = useState("")
  const [advice, setAdvice] = useState(null)

  const handleGenerateAdvice = async () => {
    const adviceText = await generateAdvice(careerPath, educationLevel, strengths, weaknesses)
    setAdvice(adviceText)
  }

  // Function to parse advice sections
  const parseAdviceSection = (advice, sectionTitle) => {
    if (!advice) return null

    const regex = new RegExp(`${sectionTitle}[:\\s]+(.*?)(?=\\d+\\.|$)`, "s")
    const match = advice.match(regex)
    return match ? match[1].trim() : null
  }

  return (
    <Card className="bg-gray-900 text-white">
      <CardHeader>
        <CardTitle className="text-[#6366F1]">Career Advice</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!advice ? (
          <>
            <p className="text-gray-300 mb-4">
              Get personalized career advice for your {careerPath} journey. Tell us about your strengths and areas for
              improvement.
            </p>
            <div className="space-y-4">
              <div>
                <label htmlFor="strengths" className="block text-sm font-medium text-gray-300 mb-1">
                  Your Strengths
                </label>
                <Textarea
                  id="strengths"
                  placeholder="What are your key strengths? (e.g., problem-solving, communication, technical skills)"
                  value={strengths}
                  onChange={(e) => setStrengths(e.target.value)}
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>
              <div>
                <label htmlFor="weaknesses" className="block text-sm font-medium text-gray-300 mb-1">
                  Areas for Improvement
                </label>
                <Textarea
                  id="weaknesses"
                  placeholder="What areas would you like to improve? (e.g., public speaking, specific technical skills)"
                  value={weaknesses}
                  onChange={(e) => setWeaknesses(e.target.value)}
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>
              <Button
                onClick={handleGenerateAdvice}
                disabled={isGeneratingAdvice}
                className="w-full bg-[#6366F1] hover:bg-[#4F46E5] text-white"
              >
                {isGeneratingAdvice ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating Advice...
                  </>
                ) : (
                  "Get Career Advice"
                )}
              </Button>
            </div>
          </>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-800 p-4 rounded-lg">
                <div className="flex items-start gap-3">
                  <BookOpen className="h-5 w-5 text-[#57FF31] mt-1" />
                  <div>
                    <h3 className="font-medium text-[#57FF31] mb-2">Recommended Skills</h3>
                    <p className="text-sm text-gray-300">
                      {parseAdviceSection(advice, "1") ||
                        parseAdviceSection(advice, "Recommended skills") ||
                        "Focus on developing both technical and soft skills relevant to your field."}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-800 p-4 rounded-lg">
                <div className="flex items-start gap-3">
                  <Briefcase className="h-5 w-5 text-[#57FF31] mt-1" />
                  <div>
                    <h3 className="font-medium text-[#57FF31] mb-2">Entry Points</h3>
                    <p className="text-sm text-gray-300">
                      {parseAdviceSection(advice, "2") ||
                        parseAdviceSection(advice, "Potential entry points") ||
                        "Consider internships, entry-level positions, or freelance work to build experience."}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-800 p-4 rounded-lg">
                <div className="flex items-start gap-3">
                  <TrendingUp className="h-5 w-5 text-[#57FF31] mt-1" />
                  <div>
                    <h3 className="font-medium text-[#57FF31] mb-2">Career Progression</h3>
                    <p className="text-sm text-gray-300">
                      {parseAdviceSection(advice, "3") ||
                        parseAdviceSection(advice, "Long-term career") ||
                        "Plan your career path with clear milestones and continuous learning opportunities."}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-800 p-4 rounded-lg">
                <div className="flex items-start gap-3">
                  <Award className="h-5 w-5 text-[#57FF31] mt-1" />
                  <div>
                    <h3 className="font-medium text-[#57FF31] mb-2">Job Market Insights</h3>
                    <p className="text-sm text-gray-300">
                      {parseAdviceSection(advice, "4") ||
                        parseAdviceSection(advice, "Current job market") ||
                        "Stay informed about industry trends and in-demand skills in your chosen field."}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-800 p-4 rounded-lg">
              <h3 className="font-medium text-[#57FF31] mb-2">Full Advice</h3>
              <p className="text-sm text-gray-300 whitespace-pre-line">{advice}</p>
            </div>

            <Button
              onClick={() => setAdvice(null)}
              variant="outline"
              className="w-full border-[#6366F1] text-[#6366F1]"
            >
              Get New Advice
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

