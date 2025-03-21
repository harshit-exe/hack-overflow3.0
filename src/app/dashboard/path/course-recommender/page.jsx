"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertCircle, Briefcase, MessageSquare, BookOpen, Zap } from "lucide-react"
import { useGroqAI } from "@/lib/use-groq-ai"
import FeatureGrid from "@/components/course/feature-grid"
import CareerPathForm from "@/components/course/career-path-form"
import CareerPathDisplay from "@/components/course/career-path-display"
import SkillsRadarChart from "@/components/course/skills-radar-chart"
import CareerTimeline from "@/components/course/career-timeline"
import CareerChat from "@/components/course/career-chat"
import ResourceLibrary from "@/components/course/resource-library"
import CourseRecommendation from "@/components/course/course-recommendation"
export default function AICareerPathGenerator() {
  const [input, setInput] = useState("")
  const [careerPath, setCareerPath] = useState(null)
  const [isScrapingLoading, setIsScrapingLoading] = useState(false)
  const [isPresent, setIsPresent] = useState(false)
  const [scrapingError, setScrapingError] = useState(null)
  const [scrapedData, setScrapedData] = useState(null)
  const { generateCareerPath, isLoading, error: careerPathError } = useGroqAI()

  const handleSubmit = async (formInput, scrapedContent) => {
    setInput(formInput)
    setIsPresent(true)
    setScrapedData(scrapedContent)

    try {
      const generatedCareerPath = await generateCareerPath(formInput, scrapedContent)
      setCareerPath(generatedCareerPath)
    } catch (error) {
      console.error("Error generating career path:", error)
      setScrapingError("Failed to generate career path. Please try again.")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-7xl font-extrabold mb-4 tracking-tight">
            <span className="text-[#57FF31]">Career</span> <span className="text-white">Path</span>{" "}
            <span className="text-[#4F46E5]">Generator</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Discover your ideal career journey with AI-powered guidance and personalized learning resources
          </p>
        </div>

        {!isPresent && <FeatureGrid />}

        <CareerPathForm
          onSubmit={handleSubmit}
          isLoading={isLoading || isScrapingLoading}
          setIsScrapingLoading={setIsScrapingLoading}
          setScrapingError={setScrapingError}
        />

        {(scrapingError || careerPathError) && (
          <Alert
            variant="destructive"
            className="mb-8 bg-red-900/80 backdrop-blur-sm border-l-4 border-red-500 text-white p-4 rounded-xl animate-pulse"
          >
            <AlertCircle className="h-6 w-6 mr-2" />
            <AlertTitle className="font-bold">Error</AlertTitle>
            <AlertDescription>{scrapingError || careerPathError}</AlertDescription>
          </Alert>
        )}

        {careerPath && (
          <div className="mt-12 space-y-8 animate-fadeIn">
            <Card className="bg-black/70 backdrop-blur-md border border-gray-800 rounded-xl overflow-hidden shadow-xl">
              <Tabs defaultValue="outline" className="w-full">
                <TabsList className="w-full grid grid-cols-4 bg-black/80 rounded-t-xl p-1">
                  <TabsTrigger
                    value="outline"
                    className="text-base md:text-lg font-medium data-[state=active]:bg-[#4F46E5] data-[state=active]:text-white transition-all"
                  >
                    <Briefcase className="w-4 h-4 mr-2" />
                    Career Path
                  </TabsTrigger>
                  <TabsTrigger
                    value="skills"
                    className="text-base md:text-lg font-medium data-[state=active]:bg-[#4F46E5] data-[state=active]:text-white transition-all"
                  >
                    <Zap className="w-4 h-4 mr-2" />
                    Skills
                  </TabsTrigger>
                  <TabsTrigger
                    value="courses"
                    className="text-base md:text-lg font-medium data-[state=active]:bg-[#57FF31] data-[state=active]:text-black transition-all"
                  >
                    <BookOpen className="w-4 h-4 mr-2" />
                    Courses
                  </TabsTrigger>
                  <TabsTrigger
                    value="chat"
                    className="text-base md:text-lg font-medium data-[state=active]:bg-[#4F46E5] data-[state=active]:text-white transition-all"
                  >
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Chat
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="outline" className="p-6">
                  <CareerPathDisplay careerPath={careerPath} />
                </TabsContent>
                <TabsContent value="skills" className="p-6">
                  <SkillsRadarChart careerPath={careerPath} />
                </TabsContent>
                <TabsContent value="courses" className="p-6">
                  <CourseRecommendation careerPath={careerPath} searchTerm={input} />
                </TabsContent>
                <TabsContent value="chat" className="p-6">
                  <CareerChat careerPath={careerPath} scrapedData={scrapedData} />
                </TabsContent>
              </Tabs>
            </Card>
            <ResourceLibrary careerPath={careerPath} />
          </div>
        )}
      </div>
    </div>
  )
}

