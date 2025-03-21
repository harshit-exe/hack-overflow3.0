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
  Share2,
} from "lucide-react"

export default function CourseDetails({ course, onBack }) {
  const [isLoading, setIsLoading] = useState(false)
  const [courseDetails, setCourseDetails] = useState(null)
  const [imageError, setImageError] = useState(false)

  useEffect(() => {
    const fetchCourseDetails = async () => {
      setIsLoading(true)
      try {
        // Generate dynamic course details immediately without delay
        const details = generateDynamicCourseDetails(course)
        setCourseDetails(details)
      } catch (error) {
        console.error("Error generating course details:", error)
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

  // Generate a placeholder image based on the course title and platform
  const generatePlaceholderImage = () => {
    // Create a unique but deterministic color based on the course title
    const hashCode = (str) => {
      let hash = 0
      for (let i = 0; i < str.length; i++) {
        hash = (hash << 5) - hash + str.charCodeAt(i)
        hash |= 0
      }
      return hash
    }

    const hash = hashCode(course.title + course.platform)

    // Generate platform-specific gradients
    const gradients = {
      Udemy: "from-purple-600/50 to-purple-900/50",
      Coursera: "from-blue-600/50 to-blue-900/50",
      edX: "from-red-600/50 to-red-900/50",
      YouTube: "from-red-500/50 to-red-800/50",
      freeCodeCamp: "from-green-600/50 to-green-900/50",
    }

    const gradient = gradients[course.platform] || "from-[#4F46E5]/50 to-[#57FF31]/50"

    // Get first letter of each word for the placeholder text
    const initials = course.title
      .split(" ")
      .slice(0, 2)
      .map((word) => word.charAt(0).toUpperCase())
      .join("")

    return (
      <div className={`w-full h-48 bg-gradient-to-br ${gradient} flex items-center justify-center`}>
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 rounded-full bg-black/30 flex items-center justify-center text-2xl font-bold text-white">
            {initials}
          </div>
          <span className="text-white text-sm font-medium mt-2">{course.platform}</span>
        </div>
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

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="border-gray-600 hover:bg-[#4F46E5]/20 hover:text-[#57FF31]"
            onClick={() => {
              navigator.clipboard.writeText(course.url)
              alert("Course URL copied to clipboard!")
            }}
          >
            <Share2 className="w-4 h-4 mr-2" />
            Share
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
                {!imageError && course.image ? (
                  <img
                    src={course.image || "/placeholder.svg"}
                    alt={course.title}
                    className="w-full h-48 object-cover"
                    onError={() => setImageError(true)}
                    loading="lazy" // Add lazy loading for better performance
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

// Function to generate dynamic course details based on the course data
function generateDynamicCourseDetails(course) {
  // Create a deterministic random number generator based on the course ID
  const hashCode = (str) => {
    let hash = 0
    for (let i = 0; i < str.length; i++) {
      hash = (hash << 5) - hash + str.charCodeAt(i)
      hash |= 0
    }
    return Math.abs(hash)
  }

  const seed = hashCode(course.id || course.title)
  const random = (min, max) => min + ((seed % 1000) / 1000) * (max - min)
  const randomInt = (min, max) => Math.floor(random(min, max + 1))

  // Generate course description if not provided
  const description =
    course.description ||
    `This comprehensive ${course.title.toLowerCase().includes("advanced") ? "advanced" : "complete"} course on ${course.title.split(":")[0]} provides you with all the skills and knowledge you need to ${course.title.toLowerCase().includes("advanced") ? "master" : "understand"} the subject. Created by ${course.instructor}, this ${course.level || "All Levels"} course is designed to help you succeed in your career.`

  // Generate what you will learn based on the course title
  const generateLearningPoints = (title) => {
    const keywords = title.toLowerCase().split(/\s+/)
    const learningPoints = []

    // Common learning points
    const commonPoints = [
      "Understand core concepts and principles",
      "Apply practical skills in real-world scenarios",
      "Build professional projects for your portfolio",
      "Master industry-standard tools and techniques",
      "Develop problem-solving abilities in the field",
    ]

    // Add common points
    learningPoints.push(...commonPoints)

    // Add specific points based on keywords
    if (keywords.some((k) => ["programming", "code", "development", "software"].includes(k))) {
      learningPoints.push("Write clean, efficient, and maintainable code")
      learningPoints.push("Implement best practices for software development")
    }

    if (keywords.some((k) => ["data", "analytics", "analysis", "statistics"].includes(k))) {
      learningPoints.push("Analyze and interpret complex datasets")
      learningPoints.push("Create insightful data visualizations")
    }

    if (keywords.some((k) => ["design", "ui", "ux", "interface"].includes(k))) {
      learningPoints.push("Design intuitive and user-friendly interfaces")
      learningPoints.push("Apply principles of visual hierarchy and layout")
    }

    if (keywords.some((k) => ["marketing", "business", "management"].includes(k))) {
      learningPoints.push("Develop effective marketing strategies")
      learningPoints.push("Understand key business metrics and KPIs")
    }

    // Shuffle and limit to 6 points
    return learningPoints.sort(() => 0.5 - random(0, 1)).slice(0, 6)
  }

  // Generate course modules based on the course title and duration
  const generateModules = (title, duration) => {
    const modules = []
    const totalHours =
      typeof duration === "string" && duration.includes("hour")
        ? Number.parseInt(duration.match(/\d+/) || "10")
        : typeof duration === "string" && duration.includes("week")
          ? Number.parseInt(duration.match(/\d+/) || "4") * 5
          : 10

    const numModules = Math.min(5, Math.max(3, Math.floor(totalHours / 3)))

    // Common module titles
    const moduleTemplates = [
      {
        title: "Introduction and Fundamentals",
        lessons: ["Course Overview", "Basic Concepts", "Setting Up Your Environment"],
      },
      { title: "Core Principles and Techniques", lessons: ["Key Methodologies", "Essential Tools", "Best Practices"] },
      { title: "Practical Applications", lessons: ["Real-world Examples", "Case Studies", "Hands-on Exercises"] },
      { title: "Advanced Concepts", lessons: ["Advanced Techniques", "Optimization Strategies", "Expert Tips"] },
      {
        title: "Project Work and Implementation",
        lessons: ["Project Planning", "Development Process", "Testing and Deployment"],
      },
      {
        title: "Professional Skills and Career Development",
        lessons: ["Industry Insights", "Portfolio Building", "Career Opportunities"],
      },
    ]

    // Add modules
    for (let i = 0; i < numModules; i++) {
      const moduleTemplate = moduleTemplates[i % moduleTemplates.length]

      // Calculate module duration
      const moduleDuration = `${Math.max(2, Math.floor(totalHours / numModules))} hours`

      // Generate lessons
      const numLessons = randomInt(3, 6)
      const lessons = [...moduleTemplate.lessons]

      // Add specific lessons based on the module
      if (i === 0) {
        lessons.push("Getting Started Guide")
      } else if (i === numModules - 1) {
        lessons.push("Final Project")
        lessons.push("Next Steps and Resources")
      }

      // Limit to the desired number of lessons
      const finalLessons = lessons.slice(0, numLessons)

      modules.push({
        title: moduleTemplate.title,
        lessons: finalLessons,
        duration: moduleDuration,
      })
    }

    return modules
  }

  // Generate reviews
  const generateReviews = () => {
    const reviewTemplates = [
      {
        user: "John D.",
        rating: 5,
        comment: "Excellent course! The instructor explains complex concepts clearly and provides practical examples.",
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
      {
        user: "Emily L.",
        rating: 5,
        comment: "One of the best courses I've taken. The projects were challenging but extremely valuable.",
      },
      {
        user: "David W.",
        rating: 4,
        comment: "Great content and presentation. Some sections could be more in-depth, but overall very good.",
      },
      {
        user: "Jennifer K.",
        rating: 5,
        comment: "The instructor's teaching style made complex topics easy to understand. Highly recommended!",
      },
    ]

    // Select 3-4 reviews
    const numReviews = randomInt(3, 4)
    const selectedIndices = new Set()
    const reviews = []

    for (let i = 0; i < numReviews; i++) {
      let index = randomInt(0, reviewTemplates.length - 1)

      // Avoid duplicates
      while (selectedIndices.has(index)) {
        index = (index + 1) % reviewTemplates.length
      }
      selectedIndices.add(index)

      reviews.push(reviewTemplates[index])
    }

    return reviews
  }

  return {
    ...course,
    description: description,
    whatYouWillLearn: generateLearningPoints(course.title),
    requirements: [
      "Basic understanding of the subject",
      "Computer with internet connection",
      "Dedication and willingness to learn",
    ],
    modules: generateModules(course.title, course.duration),
    reviews: generateReviews(),
  }
}

