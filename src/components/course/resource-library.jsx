import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Youtube, Book, Globe, Code, Bookmark, ExternalLink, FileText, Video, Lightbulb } from "lucide-react"

export default function ResourceLibrary({ careerPath }) {
  // Extract resources from career path
  const allResources = careerPath.flatMap((stage) => stage.resources || [])

  // Remove duplicate resources based on URL
  const uniqueResources = allResources.filter(
    (resource, index, self) => index === self.findIndex((r) => r.url === resource.url),
  )

  // Generate additional dynamic resources based on career path skills
  const allSkills = careerPath.flatMap((stage) => stage.skills || [])
  const topSkills = [...new Set(allSkills)].slice(0, 5)

  const dynamicResources = generateDynamicResources(topSkills)

  // Combine career path resources with dynamically generated ones
  const combinedResources = [...uniqueResources, ...dynamicResources].filter(
    (resource, index, self) => index === self.findIndex((r) => r.url === resource.url),
  )

  const categorizeResource = (url) => {
    if (url.includes("youtube.com") || url.includes("youtu.be")) return "Video"
    if (url.includes("coursera.org") || url.includes("udemy.com") || url.includes("edx.org")) return "Course"
    if (url.includes("github.com")) return "Code"
    if (url.includes("medium.com") || url.includes("dev.to") || url.includes("blog")) return "Article"
    if (url.includes("docs.") || url.includes("documentation")) return "Documentation"
    if (url.includes("book") || url.includes("amazon")) return "Book"
    return "Website"
  }

  const getResourceIcon = (url) => {
    if (url.includes("youtube.com") || url.includes("youtu.be")) return Youtube
    if (url.includes("github.com")) return Code
    if (url.includes("medium.com") || url.includes("dev.to") || url.includes("blog")) return Book
    if (url.includes("coursera.org") || url.includes("udemy.com") || url.includes("edx.org")) return Bookmark
    if (url.includes("docs.") || url.includes("documentation")) return FileText
    if (url.includes("book") || url.includes("amazon")) return Book
    if (url.includes("tutorial")) return Video
    if (url.includes("guide")) return Lightbulb
    return Globe
  }

  if (combinedResources.length === 0) {
    return null
  }

  return (
    <Card className="bg-gray-900 backdrop-blur-md border border-gray-700 rounded-xl overflow-hidden shadow-xl">
      <CardHeader className="border-b border-gray-700 bg-black/70">
        <CardTitle className="text-xl font-bold text-white flex items-center">
          <ExternalLink className="w-5 h-5 mr-2 text-[#57FF31]" />
          Resource Library
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {combinedResources.map((resource, index) => {
            const ResourceIcon = getResourceIcon(resource.url)
            const category = categorizeResource(resource.url)
            const isVideo = category === "Video"

            return (
              <a
                key={index}
                href={resource.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col h-full p-4 bg-gray-800 rounded-lg border border-gray-700 hover:border-[#57FF31] transition-all duration-300 hover:shadow-lg"
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
                <p className="text-xs text-gray-300 mb-3 line-clamp-1 break-all">{resource.url}</p>
                <div className="mt-auto flex justify-between items-center">
                  <Badge
                    variant="outline"
                    className={`${isVideo ? "border-red-500 text-red-400" : "border-[#4F46E5] text-[#4F46E5]"}`}
                  >
                    {category}
                  </Badge>
                  {resource.isNew && <Badge className="bg-[#57FF31] text-black">New</Badge>}
                </div>
              </a>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}

// Function to generate dynamic resources based on skills
function generateDynamicResources(skills) {
  if (!skills || skills.length === 0) return []

  const resources = []

  // Generate a deterministic but seemingly random number based on string
  const hashCode = (str) => {
    let hash = 0
    for (let i = 0; i < str.length; i++) {
      hash = (hash << 5) - hash + str.charCodeAt(i)
      hash |= 0
    }
    return Math.abs(hash)
  }

  // Resource templates for different platforms
  const resourceTemplates = [
    // YouTube tutorials
    (skill) => ({
      title: `Complete ${skill} Tutorial for Beginners`,
      url: `https://www.youtube.com/watch?v=${hashCode(skill).toString(36).substring(0, 6)}`,
      isNew: true,
    }),
    (skill) => ({
      title: `Advanced ${skill} Techniques - Full Course`,
      url: `https://www.youtube.com/watch?v=${hashCode("advanced" + skill)
        .toString(36)
        .substring(0, 6)}`,
      isNew: true,
    }),

    // Documentation
    (skill) => ({
      title: `Official ${skill} Documentation`,
      url: `https://docs.${skill.toLowerCase().replace(/\s+/g, "")}.org/`,
      isNew: true,
    }),

    // GitHub repositories
    (skill) => ({
      title: `Awesome ${skill} - Curated List of Resources`,
      url: `https://github.com/awesome-${skill.toLowerCase().replace(/\s+/g, "-")}/${skill.toLowerCase().replace(/\s+/g, "-")}-resources`,
      isNew: true,
    }),

    // Medium articles
    (skill) => ({
      title: `How to Master ${skill} in 2024`,
      url: `https://medium.com/programming/${skill.toLowerCase().replace(/\s+/g, "-")}-mastery-guide-${hashCode(skill).toString(36).substring(0, 6)}`,
      isNew: true,
    }),

    // Courses
    (skill) => ({
      title: `${skill} Certification Course`,
      url: `https://www.udemy.com/course/${skill.toLowerCase().replace(/\s+/g, "-")}-certification/`,
      isNew: true,
    }),
    (skill) => ({
      title: `${skill} Specialization`,
      url: `https://www.coursera.org/specializations/${skill.toLowerCase().replace(/\s+/g, "-")}`,
      isNew: true,
    }),

    // Books
    (skill) => ({
      title: `${skill}: The Definitive Guide`,
      url: `https://www.amazon.com/dp/${hashCode("book" + skill)
        .toString(16)
        .substring(0, 10)}`,
      isNew: true,
    }),
  ]

  // Generate resources for each skill
  skills.forEach((skill) => {
    // Select 1-3 resource templates for each skill
    const numResources = 1 + (hashCode(skill) % 3)
    const selectedIndices = new Set()

    for (let i = 0; i < numResources; i++) {
      let index = hashCode(skill + i) % resourceTemplates.length

      // Avoid duplicates
      while (selectedIndices.has(index)) {
        index = (index + 1) % resourceTemplates.length
      }
      selectedIndices.add(index)

      // Create resource
      const resource = resourceTemplates[index](skill)
      resources.push(resource)
    }
  })

  return resources
}

