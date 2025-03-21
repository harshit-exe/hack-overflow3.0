"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  ArrowLeft,
  Star,
  Clock,
  Award,
  DollarSign,
  ExternalLink,
  BookOpen,
  Users,
  CheckCircle,
  MessageSquare,
} from "lucide-react"

export default function CourseDetails({ course, onBack }) {
  const [isLoading, setIsLoading] = useState(false)
  const [courseDetails, setCourseDetails] = useState(null)

  useEffect(() => {
    const fetchCourseDetails = async () => {
      setIsLoading(true)
      try {
        // In a real implementation, you would fetch detailed course info
        // For now, we'll simulate a delay and use the existing course data
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Simulate fetching additional details
        setCourseDetails({
          ...course,
          description:
            course.description ||
            "This course provides comprehensive training on the subject matter, designed to help you master key concepts and practical skills.",
          whatYouWillLearn: [
            "Understand core concepts and principles",
            "Apply practical skills in real-world scenarios",
            "Build professional projects for your portfolio",
            "Master industry-standard tools and techniques",
            "Develop problem-solving abilities in the field",
          ],
          requirements: [
            "Basic understanding of the subject",
            "Computer with internet connection",
            "Dedication and willingness to learn",
          ],
          modules: [
            {
              title: "Introduction to the Subject",
              lessons: ["Overview", "History and Background", "Core Concepts"],
              duration: "2 hours",
            },
            {
              title: "Fundamental Principles",
              lessons: ["Key Theories", "Practical Applications", "Case Studies"],
              duration: "4 hours",
            },
            {
              title: "Advanced Techniques",
              lessons: ["Professional Methods", "Problem Solving", "Optimization"],
              duration: "5 hours",
            },
            {
              title: "Real-world Projects",
              lessons: ["Project Planning", "Implementation", "Review and Feedback"],
              duration: "8 hours",
            },
          ],
          reviews: [
            {
              user: "John D.",
              rating: 5,
              comment:
                "Excellent course! The instructor explains complex concepts clearly and provides practical examples.",
            },
            {
              user: "Sarah M.",
              rating: 4,
              comment: "Very informative and well-structured. I would have liked more practice exercises.",
            },
            {
              user: "Michael R.",
              rating: 5,
              comment: "This course exceeded my expectations. I've learned skills I can immediately apply in my job.",
            },
          ],
        })
      } catch (error) {
        console.error("Error fetching course details:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchCourseDetails()
  }, [course])

  const isPaid = course.price !== "Free" && course.price !== 0

  // Format price display
  const formattedPrice =
    typeof course.price === "number" ? `$${course.price.toFixed(2)}` : course.price === "Free" ? "Free" : course.price

  // Generate a placeholder image based on the course title
  const generatePlaceholderImage = () => {
    return (
      <div className="w-full h-48 bg-gradient-to-br from-[#4F46E5]/50 to-[#57FF31]/50 flex items-center justify-center">
        <BookOpen className="w-16 h-16 text-white opacity-70" />
      </div>
    )
  }

  if (isLoading || !courseDetails) {
    return (
      <Card className="bg-gray-900 backdrop-blur-md border border-gray-700 rounded-xl overflow-hidden shadow-xl">
        <div className="h-[600px] flex items-center justify-center">
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 border-4 border-[#57FF31] border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-gray-300">Loading course details...</p>
          </div>
        </div>
      </Card>
    )
  }

  return (
    <Card className="bg-gray-900 backdrop-blur-md border border-gray-700 rounded-xl overflow-hidden shadow-xl">
      <div className="border-b border-gray-700 bg-black/70 p-4 flex justify-between items-center">
        <Button variant="ghost" onClick={onBack} className="text-white hover:text-[#57FF31] hover:bg-transparent p-0">
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to courses
        </Button>

        <a
          href={course.url}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-gradient-to-r from-[#4F46E5] to-[#57FF31] text-white px-4 py-2 rounded-lg flex items-center hover:opacity-90 transition-opacity"
        >
          <ExternalLink className="w-4 h-4 mr-2" />
          View on {course.platform}
        </a>
      </div>

      <ScrollArea className="h-[600px]">
        <div className="p-6">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="w-full md:w-2/3">
              <h1 className="text-2xl font-bold text-white mb-3">{course.title}</h1>

              <div className="flex flex-wrap items-center gap-3 mb-4">
                <Badge className="bg-[#4F46E5] text-white">{course.platform}</Badge>

                {course.level && (
                  <Badge variant="outline" className="border-gray-600 bg-gray-800 text-gray-200">
                    {course.level}
                  </Badge>
                )}

                {course.rating && (
                  <div className="flex items-center text-yellow-400">
                    <Star className="fill-current w-4 h-4" />
                    <span className="ml-1 text-white">{course.rating}</span>
                  </div>
                )}

                {course.enrollments && (
                  <div className="flex items-center text-gray-300">
                    <Users className="w-4 h-4 mr-1" />
                    <span>{course.enrollments.toLocaleString()} students</span>
                  </div>
                )}
              </div>

              <p className="text-gray-300 mb-6">{courseDetails.description}</p>

              <div className="mb-6">
                <h2 className="text-lg font-semibold text-white mb-3 flex items-center">
                  <CheckCircle className="w-5 h-5 mr-2 text-[#57FF31]" />
                  What You'll Learn
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {courseDetails.whatYouWillLearn.map((item, index) => (
                    <div key={index} className="flex items-start">
                      <div className="text-[#57FF31] mr-2">•</div>
                      <span className="text-gray-300">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <h2 className="text-lg font-semibold text-white mb-3 flex items-center">
                  <BookOpen className="w-5 h-5 mr-2 text-[#57FF31]" />
                  Course Content
                </h2>
                <div className="space-y-3">
                  {courseDetails.modules.map((module, index) => (
                    <div key={index} className="border border-gray-700 rounded-lg overflow-hidden">
                      <div className="bg-gray-800 p-3 flex justify-between items-center">
                        <h3 className="font-medium text-white">{module.title}</h3>
                        <Badge variant="outline" className="border-gray-600">
                          <Clock className="w-3 h-3 mr-1" /> {module.duration}
                        </Badge>
                      </div>
                      <div className="p-3 bg-gray-900">
                        <ul className="space-y-2">
                          {module.lessons.map((lesson, lessonIndex) => (
                            <li key={lessonIndex} className="text-gray-300 flex items-center">
                              <div className="w-5 h-5 rounded-full bg-[#4F46E5]/20 flex items-center justify-center mr-2">
                                <span className="text-xs text-[#4F46E5]">{lessonIndex + 1}</span>
                              </div>
                              {lesson}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="w-full md:w-1/3">
              <Card className="bg-gray-800 border border-gray-700 overflow-hidden sticky top-6">
                {course.image && !course.image.includes("undefined") && !course.image.includes("null") ? (
                  <img
                    src={course.image || "/placeholder.svg"}
                    alt={course.title}
                    className="w-full h-48 object-cover"
                    onError={(e) => {
                      e.target.style.display = "none"
                      e.target.parentNode.appendChild(
                        document.createRange().createContextualFragment(generatePlaceholderImage()),
                      )
                    }}
                  />
                ) : (
                  generatePlaceholderImage()
                )}

                <CardContent className="p-4">
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center">
                      {isPaid ? (
                        <>
                          <DollarSign className="w-5 h-5 text-[#4F46E5] mr-1" />{" "}
                          <span className="text-xl font-bold text-white">{formattedPrice}</span>
                        </>
                      ) : (
                        <Badge className="bg-[#57FF31] text-black">
                          <Award className="w-4 h-4 mr-1" /> Free Course
                        </Badge>
                      )}
                    </div>

                    {course.duration && (
                      <Badge variant="outline" className="border-gray-600 text-gray-200">
                        <Clock className="w-3 h-3 mr-1" /> {course.duration}
                      </Badge>
                    )}
                  </div>

                  <div className="space-y-3 mb-4">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Instructor</span>
                      <span className="text-white font-medium">{course.instructor || "Unknown"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Last Updated</span>
                      <span className="text-white">{course.lastUpdated || "Recently"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Language</span>
                      <span className="text-white">{course.language || "English"}</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <a
                      href={course.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-[#57FF31] hover:bg-[#4F46E5] text-black hover:text-white w-full py-2 rounded-lg flex items-center justify-center font-medium transition-colors"
                    >
                      {isPaid ? "Enroll Now" : "Start Learning"}
                    </a>

                    <Button
                      variant="outline"
                      className="w-full border-gray-600 hover:bg-[#4F46E5]/20 hover:text-[#57FF31] transition-colors"
                    >
                      <BookOpen className="w-4 h-4 mr-2" />
                      Add to Wishlist
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="mt-8">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center">
              <MessageSquare className="w-5 h-5 mr-2 text-[#57FF31]" />
              Student Reviews
            </h2>

            <div className="space-y-4">
              {courseDetails.reviews.map((review, index) => (
                <div key={index} className="border border-gray-700 rounded-lg p-4 bg-gray-800">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium text-white">{review.user}</span>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${i < review.rating ? "text-yellow-400 fill-current" : "text-gray-600"}`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-300">{review.comment}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </ScrollArea>
    </Card>
  )
}

