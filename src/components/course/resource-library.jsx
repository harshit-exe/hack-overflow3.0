import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Youtube, Book, Globe, Code, Bookmark, ExternalLink } from "lucide-react"

export default function ResourceLibrary({ careerPath }) {
  const allResources = careerPath.flatMap((stage) => stage.resources || [])

  // Remove duplicate resources based on URL
  const uniqueResources = allResources.filter(
    (resource, index, self) => index === self.findIndex((r) => r.url === resource.url),
  )

  const categorizeResource = (url) => {
    if (url.includes("youtube.com") || url.includes("youtu.be")) return "Video"
    if (url.includes("coursera.org") || url.includes("udemy.com") || url.includes("edx.org")) return "Course"
    if (url.includes("github.com")) return "Code"
    if (url.includes("medium.com") || url.includes("dev.to") || url.includes("blog")) return "Article"
    return "Website"
  }

  const getResourceIcon = (url) => {
    if (url.includes("youtube.com") || url.includes("youtu.be")) return Youtube
    if (url.includes("github.com")) return Code
    if (url.includes("medium.com") || url.includes("dev.to") || url.includes("blog")) return Book
    if (url.includes("coursera.org") || url.includes("udemy.com") || url.includes("edx.org")) return Bookmark
    return Globe
  }

  if (uniqueResources.length === 0) {
    return null
  }

  return (
    <Card className="bg-black/70 backdrop-blur-md border border-gray-800 rounded-xl overflow-hidden shadow-xl">
      <CardHeader className="border-b border-gray-800 bg-black/50">
        <CardTitle className="text-xl font-bold text-white flex items-center">
          <ExternalLink className="w-5 h-5 mr-2 text-[#57FF31]" />
          Resource Library
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {uniqueResources.map((resource, index) => {
            const ResourceIcon = getResourceIcon(resource.url)
            const category = categorizeResource(resource.url)
            const isVideo = category === "Video"

            return (
              <a
                key={index}
                href={resource.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col h-full p-4 bg-black/50 rounded-lg border border-gray-800 hover:border-[#4F46E5] transition-all duration-300 hover:shadow-lg"
              >
                <div className="flex items-center mb-2">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${isVideo ? "bg-red-500/20" : "bg-[#57FF31]/20"} mr-3`}
                  >
                    <ResourceIcon className={`w-4 h-4 ${isVideo ? "text-red-500" : "text-[#57FF31]"}`} />
                  </div>
                  <h3 className="text-base font-semibold text-white group-hover:text-[#57FF31] transition-colors duration-300 line-clamp-1">
                    {resource.title}
                  </h3>
                </div>
                <p className="text-xs text-gray-400 mb-3 line-clamp-1 break-all">{resource.url}</p>
                <div className="mt-auto">
                  <Badge
                    variant="outline"
                    className={`${isVideo ? "border-red-500 text-red-400" : "border-[#4F46E5] text-[#4F46E5]"}`}
                  >
                    {category}
                  </Badge>
                </div>
              </a>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}

