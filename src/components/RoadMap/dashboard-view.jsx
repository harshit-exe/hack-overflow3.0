"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion"
import { Target, Zap, Sparkles, Rocket, CheckCircle, ChevronRight } from "lucide-react"


export default function DashboardView({ roadmapData }) {
  const [progress, setProgress] = useState(0)
  const [completedNodes, setCompletedNodes] = useState([])
  const [achievements, setAchievements] = useState([])

  const metadata = roadmapData.metadata || {
    careerPath: "software-developer",
    skillLevel: "intermediate",
    learningStyle: "self-paced",
    timeframe: 12,
    focusAreas: ["technical-skills"],
    features: ["skill-tracker", "market-demand", "mentor-suggestions", "resume-optimization"],
  }

  const nodes = roadmapData.nodes || []

  // Update progress when nodes are completed
  useEffect(() => {
    const completed = nodes.filter((node) => node.data.isCompleted).length
    const newProgress = Math.round((completed / nodes.length) * 100) || 0
    setProgress(newProgress)
    setCompletedNodes(nodes.filter((node) => node.data.isCompleted))

    // Initialize achievements based on completed nodes
    if (completed >= 1 && achievements.length === 0) {
      setAchievements([
        {
          title: "Roadmap Pioneer",
          description: "Completed your first milestone!",
        },
      ])
    }
    if (completed >= 3 && achievements.length === 1) {
      setAchievements((prev) => [
        ...prev,
        {
          title: "Skill Master",
          description: "Completed 3 skills in your roadmap!",
        },
      ])
    }
  }, [nodes, achievements.length])

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Career Dashboard</h2>
        <div className="flex items-center gap-2">
          <span className="text-white">Overall Progress:</span>
          <div className="w-48 h-4 bg-zinc-800/80 rounded-full overflow-hidden border border-indigo-600/20">
            <div
              className="h-full bg-gradient-to-r from-indigo-600 via-indigo-500 to-indigo-400 animate-pulse"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <span className="text-white font-medium">{progress}%</span>
        </div>
      </div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {/* Progress Overview */}
        <motion.div variants={item}>
          <Card className="bg-zinc-900/90 border-indigo-600/30 rounded-2xl shadow-lg shadow-indigo-600/10 backdrop-blur-sm transform transition-all hover:shadow-xl hover:shadow-indigo-600/20 hover:border-indigo-500/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl flex items-center gap-2 text-transparent bg-clip-text bg-gradient-to-r from-white to-indigo-200">
                <Target className="w-5 h-5 text-indigo-400" />
                Progress Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1 text-white">
                    <span>Career Path Progress</span>
                    <span>{progress}%</span>
                  </div>
                  <Progress value={progress} className="h-3" />
                </div>

                <div>
                  <h4 className="font-medium mb-2 text-white">Completed Milestones</h4>
                  {completedNodes.length > 0 ? (
                    <ul className="space-y-2">
                      {completedNodes.map((node) => (
                        <li key={node.id} className="flex items-center gap-2 text-green-400">
                          <CheckCircle className="h-5 w-5" />
                          <span>{node.data.label}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-300 text-sm">No milestones completed yet</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Skill Tracker */}
        <motion.div variants={item}>
          <Card className="bg-zinc-900/90 border-indigo-600/30 rounded-2xl shadow-lg shadow-indigo-600/10 backdrop-blur-sm transform transition-all hover:shadow-xl hover:shadow-indigo-600/20 hover:border-indigo-500/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl flex items-center gap-2 text-transparent bg-clip-text bg-gradient-to-r from-white to-indigo-200">
                <Target className="w-5 h-5 text-indigo-400" />
                Skill Progression
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {nodes.slice(0, 5).map((node) => (
                  <div key={node.id} className="space-y-1">
                    <div className="flex justify-between text-sm text-white">
                      <span>{node.data.skills?.[0] || "Loading..."}</span>
                      <span>{node.data.isCompleted ? "100%" : "0%"}</span>
                    </div>
                    <Progress value={node.data.isCompleted ? 100 : 0} className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Achievements */}
        <motion.div variants={item}>
          <Card className="bg-zinc-900/90 border-indigo-600/30 rounded-2xl shadow-lg shadow-indigo-600/10 backdrop-blur-sm transform transition-all hover:shadow-xl hover:shadow-indigo-600/20 hover:border-indigo-500/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl flex items-center gap-2 text-transparent bg-clip-text bg-gradient-to-r from-white to-indigo-200">
                <Sparkles className="w-5 h-5 text-indigo-400" />
                Achievements
              </CardTitle>
            </CardHeader>
            <CardContent>
              {achievements.length > 0 ? (
                <div className="space-y-3">
                  {achievements.map((achievement, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-3 bg-zinc-800/80 p-2 rounded-xl border border-indigo-600/20 hover:border-indigo-500/50 transition-all duration-300 transform hover:scale-[1.02]"
                    >
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-indigo-600/20">
                        <Sparkles className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h4 className="font-medium text-white">{achievement.title}</h4>
                        <p className="text-sm text-gray-300">{achievement.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-3">
                  <p className="text-gray-300 text-sm">Complete steps in your roadmap to earn achievements</p>
                  <div className="bg-zinc-800/80 p-3 rounded-xl border border-indigo-600/20 hover:border-indigo-500/50 transition-all duration-300 transform hover:scale-[1.02]">
                    <h4 className="font-medium text-white">Next Achievement</h4>
                    <div className="flex items-center gap-2 mt-2 text-gray-300">
                      <Sparkles className="w-5 h-5 text-indigo-400" />
                      <span>Roadmap Pioneer: Complete your first milestone</span>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Job Market Insights */}
        <motion.div variants={item}>
          <Card className="bg-zinc-900/90 border-indigo-600/30 rounded-2xl shadow-lg shadow-indigo-600/10 backdrop-blur-sm transform transition-all hover:shadow-xl hover:shadow-indigo-600/20 hover:border-indigo-500/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl flex items-center gap-2 text-transparent bg-clip-text bg-gradient-to-r from-white to-indigo-200">
                <Zap className="w-5 h-5 text-indigo-400" />
                Job Market Insights
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="bg-zinc-800/80 p-3 rounded-xl border border-indigo-600/20 hover:border-indigo-500/50 transition-all duration-300 transform hover:scale-[1.02]">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-medium text-white">In-Demand Skills</h4>
                    <Badge className="bg-indigo-600 text-white text-xs">Hot</Badge>
                  </div>
                  <ul className="text-sm space-y-2 text-gray-300">
                    {nodes[0]?.data.skills?.map((skill, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <span className="text-green-400">+{Math.floor(Math.random() * 30) + 10}%</span>
                        <span>{skill}</span>
                      </li>
                    )) || <li>Loading skills data...</li>}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Resume Optimization */}
        <motion.div variants={item}>
          <Card className="bg-zinc-900/90 border-indigo-600/30 rounded-2xl shadow-lg shadow-indigo-600/10 backdrop-blur-sm transform transition-all hover:shadow-xl hover:shadow-indigo-600/20 hover:border-indigo-500/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl flex items-center gap-2 text-transparent bg-clip-text bg-gradient-to-r from-white to-indigo-200">
                <FileText className="w-5 h-5 text-indigo-400" />
                Resume Optimization
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="bg-zinc-800/80 p-3 rounded-xl border border-indigo-600/20 hover:border-indigo-500/50 transition-all duration-300 transform hover:scale-[1.02]">
                  <h4 className="font-medium mb-2 text-white">ATS Score Estimation</h4>
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm text-white">
                      <span>Current Resume Score</span>
                      <span>68%</span>
                    </div>
                    <Progress value={68} className="h-2" />
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full text-white border-indigo-600/30 hover:bg-indigo-600/20"
                >
                  Upload Resume for Analysis
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Next Steps */}
        <motion.div variants={item} className="md:col-span-2">
          <Card className="bg-zinc-900/90 border-indigo-600/30 rounded-2xl shadow-lg shadow-indigo-600/10 backdrop-blur-sm transform transition-all hover:shadow-xl hover:shadow-indigo-600/20 hover:border-indigo-500/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl flex items-center gap-2 text-transparent bg-clip-text bg-gradient-to-r from-white to-indigo-200">
                <Rocket className="w-5 h-5 text-indigo-400" />
                Recommended Next Steps
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {nodes
                  .filter((node) => !node.data.isCompleted)
                  .slice(0, 2)
                  .map((node) => (
                    <div
                      key={node.id}
                      className="bg-zinc-800/80 p-3 rounded-xl border border-indigo-600/20 hover:border-indigo-500/50 transition-all duration-300 transform hover:scale-[1.02]"
                    >
                      <h4 className="font-medium text-white">{node.data.label}</h4>
                      <p className="text-xs text-gray-300 my-2">Focus on: {node.data.skills?.[0]}</p>
                      <ul className="space-y-1 mt-3 text-sm text-gray-300">
                        <li className="flex items-start gap-2">
                          <ChevronRight className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                          <span>Review learning resources</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <ChevronRight className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                          <span>Complete practical exercises</span>
                        </li>
                      </ul>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  )
}

