"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ExternalLink, BookOpen, DollarSign, Award } from "lucide-react"
import CourseCard from "./course-card"
import CourseDetails from "./course-details"

export default function CourseRecommendation({ careerPath, searchTerm }) {
  const [courses, setCourses] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [selectedCourse, setSelectedCourse] = useState(null)
  const [activeTab, setActiveTab] = useState("all")

  // Extract skills from career path to use as search terms
  const getSearchTerms = () => {
    if (searchTerm) return [searchTerm]

    const allSkills = careerPath.flatMap((stage) => stage.skills || [])
    // Get unique skills and prioritize the most common ones
    const skillCounts = {}
    allSkills.forEach((skill) => {
      skillCounts[skill] = (skillCounts[skill] || 0) + 1
    })

    // Sort by frequency and get top 3
    return Object.keys(skillCounts)
      .sort((a, b) => skillCounts[b] - skillCounts[a])
      .slice(0, 3)
  }

  const searchCourses = async () => {
    setIsLoading(true)
    setError(null)
    setCourses([])

    const searchTerms = getSearchTerms()

    try {
      // Search for each term in parallel
      const results = await Promise.all(
        searchTerms.map((term) =>
          fetch(`/api/courses/search?query=${encodeURIComponent(term)}`).then((res) => res.json()),
        ),
      )

      // Flatten and deduplicate results
      const allCourses = results.flatMap((result) => result.courses || [])
      const uniqueCourses = allCourses.filter(
        (course, index, self) => index === self.findIndex((c) => c.id === course.id),
      )

      // Sort courses: free courses first, then by rating
      const sortedCourses = uniqueCourses.sort((a, b) => {
        // First sort by free/paid
        const aIsFree = a.price === "Free" || a.price === 0
        const bIsFree = b.price === "Free" || b.price === 0

        if (aIsFree && !bIsFree) return -1
        if (!aIsFree && bIsFree) return 1

        // Then sort by rating
        return (b.rating || 0) - (a.rating || 0)
      })

      setCourses(sortedCourses)
    } catch (error) {
      console.error("Error searching courses:", error)
      setError("Failed to fetch course recommendations. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (careerPath && careerPath.length > 0) {
      searchCourses()
    }
  }, [careerPath, searchTerm])

  const handleCourseSelect = (course) => {
    setSelectedCourse(course)
  }

  const handleBackToList = () => {
    setSelectedCourse(null)
  }

  const filteredCourses = courses.filter((course) => {
    if (activeTab === "all") return true
    if (activeTab === "free") return course.price === "Free" || course.price === 0
    if (activeTab === "paid") return course.price !== "Free" && course.price !== 0
    return true
  })

  if (selectedCourse) {
    return <CourseDetails course={selectedCourse} onBack={handleBackToList} />
  }

  return (
    <Card className="bg-gray-900 backdrop-blur-md border border-gray-700 rounded-xl overflow-hidden shadow-xl">
      <div className="border-b border-gray-700 bg-black/70 p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center">
            <BookOpen className="w-5 h-5 mr-2 text-[#57FF31]" />
            Course Recommendations
          </h2>
          <p className="text-gray-300 text-sm mt-1">
            {searchTerm ? `Courses related to "${searchTerm}"` : "Courses based on your career path skills"}
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full md:w-auto">
          <TabsList className="bg-black/70 border border-gray-700 rounded-lg">
            <TabsTrigger value="all" className="data-[state=active]:bg-[#4F46E5] data-[state=active]:text-white">
              All Courses
            </TabsTrigger>
            <TabsTrigger value="free" className="data-[state=active]:bg-[#57FF31] data-[state=active]:text-black">
              <Award className="w-4 h-4 mr-1" />
              Free
            </TabsTrigger>
            <TabsTrigger value="paid" className="data-[state=active]:bg-[#4F46E5] data-[state=active]:text-white">
              <DollarSign className="w-4 h-4 mr-1" />
              Paid
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <ScrollArea className="h-[600px]">
        <div className="p-6">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-64">
              <div className="w-16 h-16 border-4 border-[#57FF31] border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="text-gray-300">Searching for the best courses for your career path...</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <p className="text-red-400 mb-4">{error}</p>
              <Button
                onClick={searchCourses}
                className="bg-[#4F46E5] hover:bg-[#57FF31] hover:text-black transition-colors"
              >
                Try Again
              </Button>
            </div>
          ) : filteredCourses.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <p className="text-gray-300 mb-4">No courses found. Try a different search term.</p>
              <Button
                onClick={searchCourses}
                className="bg-[#4F46E5] hover:bg-[#57FF31] hover:text-black transition-colors"
              >
                Refresh
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCourses.map((course) => (
                <CourseCard key={course.id} course={course} onClick={() => handleCourseSelect(course)} />
              ))}
            </div>
          )}

          {!isLoading && filteredCourses.length > 0 && (
            <div className="mt-6 text-center">
              <p className="text-gray-300 text-sm">Showing {filteredCourses.length} courses from various platforms</p>
              <div className="flex justify-center gap-4 mt-3">
                <a
                  href="https://www.coursera.org/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-[#57FF31] hover:text-white text-sm"
                >
                  <ExternalLink className="w-4 h-4 mr-1" />
                  Coursera
                </a>
                <a
                  href="https://www.udemy.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-[#57FF31] hover:text-white text-sm"
                >
                  <ExternalLink className="w-4 h-4 mr-1" />
                  Udemy
                </a>
                <a
                  href="https://www.freecodecamp.org/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-[#57FF31] hover:text-white text-sm"
                >
                  <ExternalLink className="w-4 h-4 mr-1" />
                  freeCodeCamp
                </a>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>
    </Card>
  )
}

