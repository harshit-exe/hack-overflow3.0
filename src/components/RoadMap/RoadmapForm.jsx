"use client"

import { useState } from "react"
import { useGroqAI } from "./useGroqAI"
import { Icon } from "@iconify/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent } from "@/components/ui/card"
import { AlignVerticalJustifyEnd } from "lucide-react"

const careerPaths = [
  {
    value: "software-developer",
    label: "Software Developer",
    icon: "mdi:code-braces",
    description: "Build applications and software systems",
  },
  {
    value: "data-scientist",
    label: "Data Scientist",
    icon: "mdi:chart-scatter-plot",
    description: "Analyze and interpret complex data",
  },
  {
    value: "ux-designer",
    label: "UX Designer",
    icon: "mdi:palette-outline",
    description: "Create user-centered digital experiences",
  },
  {
    value: "product-manager",
    label: "Product Manager",
    icon: "mdi:briefcase-outline",
    description: "Lead product development and strategy",
  },
  {
    value: "cybersecurity-analyst",
    label: "Cybersecurity Analyst",
    icon: "mdi:shield-lock-outline",
    description: "Protect systems and networks",
  },
  {
    value: "ai-engineer",
    label: "AI Engineer",
    icon: "mdi:robot-outline",
    description: "Develop artificial intelligence solutions",
  },
  {
    value: "cloud-architect",
    label: "Cloud Architect",
    icon: "mdi:cloud-outline",
    description: "Design cloud infrastructure",
  },
  {
    value: "devops-engineer",
    label: "DevOps Engineer",
    icon: "mdi:infinity",
    description: "Streamline development operations",
  },
]

const skillLevels = [
  { value: "beginner", label: "Beginner", icon: "mdi:sprout", description: "Just starting out" },
  { value: "intermediate", label: "Intermediate", icon: "mdi:tree", description: "1-3 years experience" },
  { value: "advanced", label: "Advanced", icon: "mdi:palm-tree", description: "3+ years experience" },
]

const focusAreas = [
  {
    value: "technical-skills",
    label: "Technical Skills",
    icon: "mdi:code-tags",
    description: "Programming and technical expertise",
  },
  { value: "soft-skills", label: "Soft Skills", icon: "mdi:account-group", description: "Communication and teamwork" },
  { value: "industry-knowledge", label: "Industry Knowledge", icon: "mdi:briefcase", description: "Domain expertise" },
  {
    value: "project-management",
    label: "Project Management",
    icon: "mdi:clipboard-check",
    description: "Planning and execution",
  },
  { value: "leadership", label: "Leadership", icon: "mdi:account-supervisor", description: "Team management" },
  { value: "innovation", label: "Innovation", icon: "mdi:lightbulb-on", description: "Creative problem-solving" },
]

export default function RoadmapForm({ setRoadmapData, onComplete }) {
  const [careerPath, setCareerPath] = useState("")
  const [skillLevel, setSkillLevel] = useState("")
  const [timeframe, setTimeframe] = useState(12)
  const [selectedFocusAreas, setSelectedFocusAreas] = useState([])
  const [includeCertifications, setIncludeCertifications] = useState(false)
  const [customGoals, setCustomGoals] = useState("")
  const { generateSubtasks, isLoading, error: groqError } = useGroqAI()
  const [localError, setLocalError] = useState(null)

  const handleFocusAreaToggle = (area) => {
    setSelectedFocusAreas((prev) => (prev.includes(area) ? prev.filter((a) => a !== area) : [...prev, area]))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLocalError(null) // Clear any previous local errors
    const prompt = `Create a detailed career development roadmap for a ${skillLevel} level ${careerPath} professional with the following specifications:
    
    Timeline: ${timeframe} months
    Focus Areas: ${selectedFocusAreas.join(", ")}
    ${includeCertifications ? "Include relevant professional certifications." : ""}
    ${customGoals ? `Additional Goals: ${customGoals}` : ""}

    For each step in the roadmap:
    1. Provide a clear title and timeframe
    2. List 3-5 required skills
    3. Include 2-3 learning resources with valid URLs
    4. ${includeCertifications ? "Recommend relevant certifications" : "Skip certifications"}
    5. Ensure logical progression between steps
    
    Make the roadmap practical and industry-aligned.`

    const roadmapData = await generateSubtasks(prompt)

    if (roadmapData?.nodes?.length > 0) {
      setRoadmapData(roadmapData)
      onComplete()
    } else {
      setLocalError("Failed to generate a valid roadmap. Please try again.")
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8  text-white p-6 rounded-lg max-w-4xl mx-auto">
      <div className="space-y-6">
        <div>
          <Label className="text-2xl font-bold text-white mb-4 block">Choose Your Career Path</Label>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {careerPaths.map((path) => (
              <Card
                key={path.value}
                className={`cursor-pointer transition-all ${
                  careerPath === path.value ? "bg-indigo-600 border-green-400" : "bg-black hover:bg-gray-700"
                }`}
                onClick={() => setCareerPath(path.value)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center text-[#ffffff] gap-3">
                    <Icon icon={path.icon} className="w-8 h-8 text-[#6366F1]" />
                    <div>
                      <h3 className="font-semibold text-lg">{path.label}</h3>
                      <p className="text-sm text-gray-300">{path.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div>
          <Label className="text-2xl font-bold text-white mb-4 block">Select Your Level</Label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {skillLevels.map((level) => (
              <Card
                key={level.value}
                className={`cursor-pointer transition-all ${
                  skillLevel === level.value ? "bg-indigo-600 border-green-400" : "bg-black hover:bg-gray-700"
                }`}
                onClick={() => setSkillLevel(level.value)}
              >
                <CardContent className="p-4">
                  <div className="flex text-white items-center gap-3">
                    <Icon icon={level.icon} className="w-8 h-8 text-[#6366F1]" />
                    <div>
                      <h3 className="font-semibold text-lg">{level.label}</h3>
                      <p className="text-sm text-gray-300">{level.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div>
          <Label className="text-2xl font-bold text-white mb-4 block">Timeframe: {timeframe} months</Label>
          <Slider
            min={1}
            max={60}
            step={1}
            value={[timeframe]}
            onValueChange={(value) => setTimeframe(value[0])}
            className="w-full"
          />
        </div>

        <div>
          <Label className="text-2xl font-bold text-white mb-4 block">Focus Areas</Label>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {focusAreas.map((area) => (
              <Card
                key={area.value}
                className={`cursor-pointer transition-all ${
                  selectedFocusAreas.includes(area.value)
                    ? "bg-indigo-600 border-green-400"
                    : "bg-black hover:bg-gray-700"
                }`}
                onClick={() => handleFocusAreaToggle(area.value)}
              >
                <CardContent className="p-4">
                  <div className="flex text-white items-center gap-3">
                    <Icon icon={area.icon} className="w-8 h-8 text-[#6366F1]" />
                    <div>
                      <h3 className="font-semibold text-lg">{area.label}</h3>
                      <p className="text-sm text-gray-300">{area.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-4 bg-gray-800 p-4 rounded-lg">
          <Switch id="certifications" checked={includeCertifications} onCheckedChange={setIncludeCertifications} />
          <Label htmlFor="certifications" className="text-lg text-white cursor-pointer">
            Include Professional Certifications
          </Label>
        </div>

        <div>
          <Label htmlFor="customGoals" className="text-2xl font-bold text-white mb-4 block">
            Custom Goals
          </Label>
          <Input
            id="customGoals"
            value={customGoals}
            onChange={(e) => setCustomGoals(e.target.value)}
            placeholder="Enter any specific goals or areas you want to focus on"
            className="bg-gray-800 text-white border-indigo-600 p-4"
          />
        </div>

        <Button
          type="submit"
          className="w-full text-lg font-semibold h-14 bg-indigo-600 hover:bg-indigo-700 text-white mt-8"
          disabled={isLoading || !careerPath || !skillLevel}
        >
          {isLoading ? (
            <>
              <Icon icon="eos-icons:loading" className="animate-spin mr-2" />
              Generating Your Career Roadmap...
            </>
          ) : (
            <>
              <Icon icon="carbon:roadmap" className="mr-2" />
              Generate Career Roadmap
            </>
          )}
        </Button>

        {(groqError || localError) && (
          <div className="bg-red-900/50 border border-red-500 text-red-200 p-4 rounded-lg mt-4">
            {groqError || localError}
          </div>
        )}
      </div>
    </form>
  )
}