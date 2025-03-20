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
    timeframe: 12,
    focusAreas: ["technical-skills"],
    features: ["skill-tracker", "certifications"],
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
          <div className="w-48 h-4 bg-gray-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-600 to-green-400"
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
          <Card className="bg-black border-indigo-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl flex items-center gap-2">
                <Target className="w-5 h-5 text-indigo-400" />
                Progress Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <span>Career Path Progress</span>
                    <span>{progress}%</span>
                  </div>
                  <Progress value={progress} className="h-3" />
                </div>

                <div>
                  <h4 className="font-medium mb-2">Completed Milestones</h4>
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
                    <p className="text-white text-sm">No milestones completed yet</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Skill Tracker */}
        <motion.div variants={item}>
          <Card className="bg-black border-indigo-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl flex items-center gap-2">
                <Target className="w-5 h-5 text-indigo-400" />
                Skill Progression
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {nodes.slice(0, 5).map((node) => (
                  <div key={node.id} className="space-y-1">
                    <div className="flex justify-between text-sm">
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
          <Card className="bg-black border-indigo-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-indigo-400" />
                Achievements
              </CardTitle>
            </CardHeader>
            <CardContent>
              {achievements.length > 0 ? (
                <div className="space-y-3">
                  {achievements.map((achievement, i) => (
                    <div key={i} className="flex items-center gap-3 bg-indigo-900/30 p-2 rounded-lg">
                      <div className="w-10 h-10 rounded-full bg-green-600 flex items-center justify-center">
                        <Sparkles className="w-5 h-5 text-black" />
                      </div>
                      <div>
                        <h4 className="font-medium">{achievement.title}</h4>
                        <p className="text-sm text-white">{achievement.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-3">
                  <p className="text-white text-sm">Complete steps in your roadmap to earn achievements</p>
                  <div className="bg-indigo-900/30 p-3 rounded-lg">
                    <h4 className="font-medium">Next Achievement</h4>
                    <div className="flex items-center gap-2 mt-2">
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
          <Card className="bg-black border-indigo-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl flex items-center gap-2">
                <Zap className="w-5 h-5 text-indigo-400" />
                Job Market Insights
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="bg-indigo-900/30 p-3 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-medium">In-Demand Skills</h4>
                    <Badge className="bg-green-500/90 text-white text-xs">Hot</Badge>
                  </div>
                  <ul className="text-sm space-y-2">
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

        {/* Next Steps */}
        <motion.div variants={item} className="md:col-span-2">
          <Card className="bg-black border-indigo-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl flex items-center gap-2">
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
                    <div key={node.id} className="bg-indigo-900/20 p-3 rounded-lg border border-indigo-800">
                      <h4 className="font-medium">{node.data.label}</h4>
                      <p className="text-xs text-white my-2">Focus on: {node.data.skills?.[0]}</p>
                      <ul className="space-y-1 mt-3 text-sm">
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

