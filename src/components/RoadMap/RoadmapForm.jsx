"use client"

import { useState } from "react"

import { Icon } from "@iconify/react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Sparkles, Zap, Target, Award, Users, Briefcase, Brain, Rocket, Check } from "lucide-react"
import { useGroqAI } from "./useGroqAI"

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
  {
    value: "soft-skills",
    label: "Soft Skills",
    icon: "mdi:account-group",
    description: "Communication and teamwork",
  },
  {
    value: "industry-knowledge",
    label: "Industry Knowledge",
    icon: "mdi:briefcase",
    description: "Domain expertise",
  },
  {
    value: "project-management",
    label: "Project Management",
    icon: "mdi:clipboard-check",
    description: "Planning and execution",
  },
  {
    value: "leadership",
    label: "Leadership",
    icon: "mdi:account-supervisor",
    description: "Team management",
  },
  {
    value: "innovation",
    label: "Innovation",
    icon: "mdi:lightbulb-on",
    description: "Creative problem-solving",
  },
]

const advancedFeatures = [
  {
    id: "skill-tracker",
    title: "Skill Progression Tracker",
    description: "AI analyzes real-time progress & suggests next steps",
    icon: <Target className="w-5 h-5 text-indigo-400" />,
  },
  {
    id: "market-demand",
    title: "Real-Time Job Market Demand",
    description: "Roadmap updates based on industry trends",
    icon: <Zap className="w-5 h-5 text-indigo-400" />,
  },
  {
    id: "mentor-suggestions",
    title: "Personalized Mentor Suggestions",
    description: "AI matches you with mentors based on career goals",
    icon: <Users className="w-5 h-5 text-indigo-400" />,
  },
  {
    id: "certifications",
    title: "Skill Validation & Certification",
    description: "AI recommends certifications to boost credibility",
    icon: <Award className="w-5 h-5 text-indigo-400" />,
  },
  {
    id: "career-detours",
    title: "Smart Career Detours",
    description: "AI suggests alternative paths if job market shifts",
    icon: <Rocket className="w-5 h-5 text-indigo-400" />,
  },
  {
    id: "gamification",
    title: "Gamified Career Journey",
    description: "Unlock achievements for completing milestones",
    icon: <Sparkles className="w-5 h-5 text-indigo-400" />,
  },
  {
    id: "community",
    title: "Community & Peer Learning",
    description: "Connect with others on the same career path",
    icon: <Users className="w-5 h-5 text-indigo-400" />,
  },
  {
    id: "freelance",
    title: "AI-Powered Freelance Guidance",
    description: "Get suggestions for freelance projects based on skills",
    icon: <Briefcase className="w-5 h-5 text-indigo-400" />,
  },
]

export default function RoadmapForm({ setRoadmapData, onComplete }) {
  const [careerPath, setCareerPath] = useState("")
  const [skillLevel, setSkillLevel] = useState("")
  const [timeframe, setTimeframe] = useState(12)
  const [selectedFocusAreas, setSelectedFocusAreas] = useState([])
  const [includeCertifications, setIncludeCertifications] = useState(false)
  const [customGoals, setCustomGoals] = useState("")
  const [activeTab, setActiveTab] = useState("basic")
  const [selectedFeatures, setSelectedFeatures] = useState(["skill-tracker", "certifications"])
  const { generateSubtasks, isLoading, error: groqError } = useGroqAI()
  const [localError, setLocalError] = useState(null)

  const handleFocusAreaToggle = (area) => {
    setSelectedFocusAreas((prev) => (prev.includes(area) ? prev.filter((a) => a !== area) : [...prev, area]))
  }

  const handleFeatureToggle = (featureId) => {
    setSelectedFeatures((prev) =>
      prev.includes(featureId) ? prev.filter((id) => id !== featureId) : [...prev, featureId],
    )

    // Auto-enable certifications if skill validation is selected
    if (featureId === "certifications" && !selectedFeatures.includes("certifications")) {
      setIncludeCertifications(true)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLocalError(null) // Clear any previous local errors

    // Validate form
    if (!careerPath) {
      setLocalError("Please select a career path")
      return
    }
    if (!skillLevel) {
      setLocalError("Please select your skill level")
      return
    }
    if (selectedFocusAreas.length === 0) {
      setLocalError("Please select at least one focus area")
      return
    }

    // Build advanced features string for prompt
    const featuresPrompt = selectedFeatures
      .map((id) => {
        const feature = advancedFeatures.find((f) => f.id === id)
        return feature ? `- ${feature.title}: ${feature.description}` : ""
      })
      .filter(Boolean)
      .join("\n")

    const prompt = `Create a detailed career development roadmap for a ${skillLevel} level ${careerPath} professional with the following specifications:
    
    Timeline: ${timeframe} months
    Focus Areas: ${selectedFocusAreas.join(", ")}
    ${includeCertifications ? "Include relevant professional certifications." : ""}
    ${customGoals ? `Additional Goals: ${customGoals}` : ""}
    
    Advanced Features to incorporate:
    ${featuresPrompt}

    For each step in the roadmap:
    1. Provide a clear title and timeframe
    2. List 3-5 required skills
    3. Include 2-3 learning resources with valid URLs
    4. ${includeCertifications ? "Recommend relevant certifications" : "Skip certifications"}
    5. Ensure logical progression between steps
    
    Make the roadmap practical and industry-aligned.`

    try {
      const roadmapData = await generateSubtasks(prompt)

      if (roadmapData?.nodes?.length > 0) {
        // Add metadata about selected features
        const enhancedRoadmapData = {
          ...roadmapData,
          metadata: {
            careerPath,
            skillLevel,
            timeframe,
            focusAreas: selectedFocusAreas,
            features: selectedFeatures,
          },
        }
        setRoadmapData(enhancedRoadmapData)
        onComplete()
      } else {
        setLocalError("Failed to generate a valid roadmap. Please try again.")
      }
    } catch (error) {
      setLocalError(`Error generating roadmap: ${error.message}`)
    }
  }

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-8 max-w-5xl mx-auto bg-black rounded-xl border border-indigo-800 shadow-xl text-white"
    >
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full grid grid-cols-2 bg-indigo-950/50 border-b border-indigo-800 rounded-none">
          <TabsTrigger
            value="basic"
            className="data-[state=active]:bg-indigo-700 rounded-none border-r border-indigo-800"
          >
            Basic Settings
          </TabsTrigger>
          <TabsTrigger value="advanced" className="data-[state=active]:bg-indigo-700 rounded-none">
            Advanced Features
          </TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="p-6">
          <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
            <motion.div variants={item}>
              <Label className="text-xl font-bold text-white mb-4 block">Career Path</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                {careerPaths.map((path) => (
                  <Card
                    key={path.value}
                    className={`cursor-pointer transition-all duration-200 border text-white ${
                      careerPath === path.value
                        ? "bg-indigo-600/20 border-indigo-400"
                        : "bg-black/60 border-indigo-800 hover:border-indigo-600"
                    }`}
                    onClick={() => setCareerPath(path.value)}
                  >
                    <CardContent className="p-4 flex items-center gap-3">
                      <div className="shrink-0">
                        <Icon icon={path.icon} className="w-8 h-8 text-indigo-400" />
                      </div>
                      <div>
                        <h3 className="font-medium">{path.label}</h3>
                        <p className="text-xs text-white">{path.description}</p>
                      </div>
                      {careerPath === path.value && (
                        <div className="ml-auto">
                          <Check className="w-5 h-5 text-indigo-400" />
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </motion.div>

            <motion.div variants={item}>
              <Label className="text-xl font-bold text-white mb-4 block">Skill Level</Label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {skillLevels.map((level) => (
                  <Card
                    key={level.value}
                    className={`cursor-pointer transition-all duration-200 border ${
                      skillLevel === level.value
                        ? "bg-indigo-600/20 border-indigo-400"
                        : "bg-black/60 border-indigo-800 hover:border-indigo-600"
                    }`}
                    onClick={() => setSkillLevel(level.value)}
                  >
                    <CardContent className="p-4 flex items-center gap-3">
                      <div className="shrink-0">
                        <Icon icon={level.icon} className="w-8 h-8 text-indigo-400" />
                      </div>
                      <div>
                        <h3 className="font-medium">{level.label}</h3>
                        <p className="text-xs text-white">{level.description}</p>
                      </div>
                      {skillLevel === level.value && (
                        <div className="ml-auto">
                          <Check className="w-5 h-5 text-indigo-400" />
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </motion.div>

            <motion.div variants={item}>
              <div className="flex items-center justify-between">
                <Label className="text-xl font-bold text-white">Timeframe</Label>
                <span className="text-indigo-400 font-medium">{timeframe} months</span>
              </div>
              <Slider
                min={1}
                max={60}
                step={1}
                value={[timeframe]}
                onValueChange={(value) => setTimeframe(value[0])}
                className="my-4"
              />
              <div className="flex justify-between text-xs text-white">
                <span>1 month</span>
                <span>1 year</span>
                <span>3 years</span>
                <span>5 years</span>
              </div>
            </motion.div>

            <motion.div variants={item}>
              <Label className="text-xl font-bold text-white mb-4 block">Focus Areas</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {focusAreas.map((area) => (
                  <Card
                    key={area.value}
                    className={`cursor-pointer transition-all duration-200 border ${
                      selectedFocusAreas.includes(area.value)
                        ? "bg-indigo-600/20 border-indigo-400"
                        : "bg-black/60 border-indigo-800 hover:border-indigo-600"
                    }`}
                    onClick={() => handleFocusAreaToggle(area.value)}
                  >
                    <CardContent className="p-4 flex items-center gap-3">
                      <div className="shrink-0">
                        <Icon icon={area.icon} className="w-8 h-8 text-indigo-400" />
                      </div>
                      <div>
                        <h3 className="font-medium">{area.label}</h3>
                        <p className="text-xs text-white">{area.description}</p>
                      </div>
                      {selectedFocusAreas.includes(area.value) && (
                        <div className="ml-auto">
                          <Check className="w-5 h-5 text-indigo-400" />
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </motion.div>

            <motion.div variants={item}>
              <div className="flex items-center gap-4 p-4 rounded-lg border border-indigo-800 bg-indigo-900/10">
                <Switch
                  id="certifications"
                  checked={includeCertifications}
                  onCheckedChange={setIncludeCertifications}
                />
                <Label htmlFor="certifications" className="text-lg cursor-pointer">
                  Include Professional Certifications
                </Label>
              </div>
            </motion.div>

            <motion.div variants={item}>
              <Label htmlFor="customGoals" className="text-xl font-bold text-white mb-2 block">
                Custom Goals (Optional)
              </Label>
              <Input
                id="customGoals"
                value={customGoals}
                onChange={(e) => setCustomGoals(e.target.value)}
                placeholder="Enter any specific goals or areas you want to focus on"
                className="bg-black/80 border-indigo-800 focus:border-indigo-400"
              />
            </motion.div>
          </motion.div>
        </TabsContent>

        <TabsContent value="advanced" className="p-6">
          <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
            <motion.div variants={item} className="p-4 rounded-lg border border-indigo-800 bg-indigo-900/10">
              <h3 className="text-xl font-bold flex items-center gap-2 mb-2">
                <Brain className="text-indigo-400" />
                Advanced AI Features
              </h3>
              <p className="text-gray-300 text-sm">
                Select the advanced features you want to include in your career roadmap. These AI-powered features will
                enhance your career planning experience.
              </p>
            </motion.div>

            <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {advancedFeatures.map((feature) => (
                <Card
                  key={feature.id}
                  className={`cursor-pointer transition-all duration-200 border ${
                    selectedFeatures.includes(feature.id)
                      ? "bg-indigo-600/20 border-indigo-400"
                      : "bg-black/60 border-indigo-800 hover:border-indigo-600"
                  }`}
                  onClick={() => handleFeatureToggle(feature.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="shrink-0 mt-1">{feature.icon}</div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium">{feature.title}</h3>
                          {feature.id === "skill-tracker" && (
                            <Badge className="bg-green-500/90 text-white text-xs">Popular</Badge>
                          )}
                        </div>
                        <p className="text-xs text-white">{feature.description}</p>
                      </div>
                      {selectedFeatures.includes(feature.id) && (
                        <div className="ml-auto">
                          <Check className="w-5 h-5 text-indigo-400" />
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </motion.div>
          </motion.div>
        </TabsContent>
      </Tabs>

      <div className="p-6 pt-0">
        <Button type="submit" className="w-full h-14 bg-indigo-600 hover:bg-indigo-700 text-white" disabled={isLoading}>
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
          <div className="bg-red-900/30 border border-red-500 text-red-200 p-4 rounded-lg mt-4">
            {groqError || localError}
          </div>
        )}
      </div>
    </form>
  )
}

