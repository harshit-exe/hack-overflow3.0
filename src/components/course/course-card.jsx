"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, Clock, Award, DollarSign, ExternalLink } from "lucide-react"

export default function CourseCard({ course, onClick }) {
  const { title, platform, instructor, rating, price, duration, level, image, url } = course

  const isPaid = price !== "Free" && price !== 0

  // Format price display
  const formattedPrice = typeof price === "number" ? `$${price.toFixed(2)}` : price === "Free" ? "Free" : price

  // Determine platform color and icon
  const getPlatformColor = () => {
    const platform = course.platform.toLowerCase()
    if (platform.includes("coursera")) return "bg-blue-600"
    if (platform.includes("udemy")) return "bg-purple-600"
    if (platform.includes("edx")) return "bg-red-600"
    if (platform.includes("youtube")) return "bg-red-500"
    if (platform.includes("freecodecamp")) return "bg-green-600"
    return "bg-gray-600"
  }

  // Generate a placeholder image based on the course title
  const generatePlaceholderImage = () => {
    const firstLetter = title.charAt(0).toUpperCase()
    const colors = ["#4F46E5", "#57FF31", "#FF3131", "#31A8FF", "#FFD131"]
    const randomColor = colors[Math.floor(Math.abs(hashCode(title)) % colors.length)]

    return (
      <div className="w-full h-full bg-gradient-to-br from-[#4F46E5]/50 to-[#57FF31]/50 flex items-center justify-center">
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold"
          style={{ backgroundColor: randomColor }}
        >
          {firstLetter}
        </div>
      </div>
    )
  }

  // Simple hash function for deterministic color selection
  const hashCode = (str) => {
    let hash = 0
    for (let i = 0; i < str.length; i++) {
      hash = (hash << 5) - hash + str.charCodeAt(i)
      hash |= 0
    }
    return hash
  }

  return (
    <Card
      className="bg-gray-900 backdrop-blur-md border border-gray-700 rounded-xl overflow-hidden shadow-lg hover:border-[#57FF31] transition-all duration-300 cursor-pointer group"
      onClick={onClick}
    >
      <div className="relative h-40 overflow-hidden">
        {image && !image.includes("undefined") && !image.includes("null") ? (
          <img
            src={image || "/placeholder.svg"}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            onError={(e) => {
              e.target.style.display = "none"
              e.target.parentNode.appendChild(
                document.createRange().createContextualFragment(
                  `<div class="w-full h-full bg-gradient-to-br from-[#4F46E5]/50 to-[#57FF31]/50 flex items-center justify-center">
                  <span class="text-white text-lg font-bold">${platform}</span>
                </div>`,
                ),
              )
            }}
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
              <Star className="w-3 h-3 mr-1 text-yellow-400" /> {rating}
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

