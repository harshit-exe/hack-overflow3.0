"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, Clock, Award, DollarSign, ExternalLink } from "lucide-react"
import { useState } from "react"

export default function CourseCard({ course, onClick }) {
  const { title, platform, instructor, rating, price, duration, level, image, url } = course
  const [imageError, setImageError] = useState(false)

  const isPaid = price !== "Free" && price !== 0

  // Format price display
  const formattedPrice = typeof price === "number" ? `$${price.toFixed(2)}` : price === "Free" ? "Free" : price

  // Pre-generate platform colors for faster rendering
  const PLATFORM_COLORS = {
    coursera: "bg-blue-600",
    udemy: "bg-purple-600",
    edx: "bg-red-600",
    youtube: "bg-red-500",
    freecodecamp: "bg-green-600",
  }

  // Optimize the platform color function
  const getPlatformColor = () => {
    const platformKey = course.platform.toLowerCase()
    for (const [key, value] of Object.entries(PLATFORM_COLORS)) {
      if (platformKey.includes(key)) return value
    }
    return "bg-gray-600"
  }

  // Optimize placeholder image generation
  const generatePlaceholderImage = () => {
    // Simplified gradient selection
    const platformKey = course.platform.toLowerCase()
    let gradient = "from-[#4F46E5]/50 to-[#57FF31]/50"

    if (platformKey.includes("udemy")) gradient = "from-purple-600/50 to-purple-900/50"
    else if (platformKey.includes("coursera")) gradient = "from-blue-600/50 to-blue-900/50"
    else if (platformKey.includes("edx")) gradient = "from-red-600/50 to-red-900/50"
    else if (platformKey.includes("youtube")) gradient = "from-red-500/50 to-red-800/50"
    else if (platformKey.includes("freecodecamp")) gradient = "from-green-600/50 to-green-900/50"

    // Get first letter of each word for the placeholder text (max 2 words)
    const words = title.split(" ").slice(0, 2)
    const initials = words.map((word) => word.charAt(0).toUpperCase()).join("")

    return (
      <div className={`w-full h-full bg-gradient-to-br ${gradient} flex items-center justify-center`}>
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 rounded-full bg-black/30 flex items-center justify-center text-2xl font-bold text-white">
            {initials}
          </div>
          <span className="text-white text-sm font-medium mt-2">{platform}</span>
        </div>
      </div>
    )
  }

  return (
    <Card
      className="bg-gray-900 backdrop-blur-md border border-gray-700 rounded-xl overflow-hidden shadow-lg hover:border-[#57FF31] transition-all duration-300 cursor-pointer group"
      onClick={onClick}
    >
      <div className="relative h-40 overflow-hidden">
        {!imageError && image ? (
          <img
            src={image || "/placeholder.svg"}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            onError={() => setImageError(true)}
            loading="lazy" // Add lazy loading for better performance
          />
        ) : (
          generatePlaceholderImage()
        )}
        <div className="absolute top-0 left-0 m-3">
          <Badge className={`${getPlatformColor()} text-white border-none`}>{platform}</Badge>
        </div>
        <div className="absolute top-0 right-0 m-3">
          <Badge className={isPaid ? "bg-[#4F46E5] text-white" : "bg-[#57FF31] text-black"}>
            {isPaid ? (
              <>
                <DollarSign className="w-3 h-3 mr-1" /> {formattedPrice}
              </>
            ) : (
              <>
                <Award className="w-3 h-3 mr-1" /> Free
              </>
            )}
          </Badge>
        </div>
      </div>

      <CardContent className="p-4">
        <h3 className="text-lg font-bold text-white mb-2 line-clamp-2 group-hover:text-[#57FF31] transition-colors">
          {title}
        </h3>

        <p className="text-gray-300 text-sm mb-3 line-clamp-1">{instructor || "Unknown instructor"}</p>

        <div className="flex flex-wrap gap-2 mb-3">
          {level && (
            <Badge variant="outline" className="bg-gray-800 text-gray-200 border-gray-600">
              {level}
            </Badge>
          )}

          {duration && (
            <Badge variant="outline" className="bg-gray-800 text-gray-200 border-gray-600">
              <Clock className="w-3 h-3 mr-1" /> {duration}
            </Badge>
          )}

          {rating && (
            <Badge variant="outline" className="bg-gray-800 text-gray-200 border-gray-600">
              <Star className="w-3 h-3 mr-1 text-yellow-400 fill-current" /> {rating}
            </Badge>
          )}
        </div>

        <div className="flex justify-between items-center mt-4">
          <span className="text-xs text-gray-300">
            {course.enrollments ? `${course.enrollments.toLocaleString()} students` : ""}
          </span>
          <span className="text-[#57FF31] text-xs flex items-center group-hover:underline">
            View details <ExternalLink className="w-3 h-3 ml-1" />
          </span>
        </div>
      </CardContent>
    </Card>
  )
}

