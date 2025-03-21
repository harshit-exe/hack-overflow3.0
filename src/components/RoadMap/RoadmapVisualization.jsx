"use client"

import { useCallback, useState, useEffect } from "react"
import ReactFlow, { MiniMap, Controls, Background, useNodesState, useEdgesState, addEdge, Panel } from "reactflow"
import "reactflow/dist/style.css"
import CustomNode from "./CustomNode"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
// import { useToast } from "@/hooks/use-toast"
import {
  ArrowDownCircle,
  ArrowRightCircle,
  Download,
  ChevronRight,
  ChevronLeft,
  Zap,
  Target,
  Award,
  Users,
  Sparkles,
  Rocket,
  FileText,
} from "lucide-react"
import { jsPDF } from "jspdf"
import html2canvas from "html2canvas"
import dagre from "dagre"
import confetti from "canvas-confetti"

const nodeTypes = {
  customNode: CustomNode,
}

const minimapStyle = {
  height: 120,
}

const flowStyles = {
  background: "#18181b", // zinc-900
}

const getLayoutedElements = (nodes, edges, direction = "TB") => {
  const dagreGraph = new dagre.graphlib.Graph()
  dagreGraph.setDefaultEdgeLabel(() => ({}))
  dagreGraph.setGraph({ rankdir: direction })

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: 300, height: 150 })
  })

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target)
  })

  dagre.layout(dagreGraph)

  return {
    nodes: nodes.map((node) => {
      const nodeWithPosition = dagreGraph.node(node.id)
      return {
        ...node,
        position: {
          x: nodeWithPosition.x - 150,
          y: nodeWithPosition.y - 75,
        },
      }
    }),
    edges,
  }
}


export default function RoadmapVisualization({ roadmapData }) {
  const [nodes, setNodes, onNodesChange] = useNodesState(roadmapData.nodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(roadmapData.edges)
  const [layoutDirection, setLayoutDirection] = useState("TB")
  const [progress, setProgress] = useState(0)
  const [completedNodes, setCompletedNodes] = useState([])
  const [featurePanel, setFeaturePanel] = useState(null)
  const [achievements, setAchievements] = useState([])
  const { toast } = useState(null)

  const metadata = roadmapData.metadata || {
    careerPath: "software-developer",
    skillLevel: "intermediate",
    learningStyle: "self-paced",
    timeframe: 12,
    focusAreas: ["technical-skills"],
    features: ["skill-tracker", "market-demand", "mentor-suggestions", "resume-optimization"],
  }

  const features = {
    "skill-tracker": {
      icon: <Target className="w-5 h-5" />,
      title: "Skill Tracker",
      component: (
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-white">Skill Progress</h3>
          <div className="space-y-3">
            {nodes.slice(0, 5).map((node) => (
              <div key={node.id} className="space-y-1">
                <div className="flex justify-between text-sm text-white">
                  <span>{node.data.skills[0]}</span>
                  <span>{completedNodes.includes(node.id) ? "100%" : "0%"}</span>
                </div>
                <Progress value={completedNodes.includes(node.id) ? 100 : 0} className="h-2" />
              </div>
            ))}
          </div>
          <div className="bg-zinc-800 p-3 rounded-lg mt-4 border border-indigo-600/20">
            <h4 className="font-medium mb-2 text-white">Recommended Next Steps</h4>
            <ul className="text-sm space-y-2 text-gray-300">
              {nodes
                .filter((node) => !completedNodes.includes(node.id))
                .slice(0, 3)
                .map((node) => (
                  <li key={node.id} className="flex items-start gap-2">
                    <ChevronRight className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                    <span>
                      {node.data.label}: Focus on {node.data.skills[0]}
                    </span>
                  </li>
                ))}
            </ul>
          </div>
        </div>
      ),
    },
    "market-demand": {
      icon: <Zap className="w-5 h-5" />,
      title: "Market Trends",
      component: (
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-white">Job Market Insights</h3>
          <div className="space-y-3">
            <div className="bg-zinc-800 p-3 rounded-lg border border-indigo-600/20">
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-medium text-white">In-Demand Skills</h4>
                <Badge className="bg-indigo-500 text-white text-xs">Hot</Badge>
              </div>
              <ul className="text-sm space-y-2 text-gray-300">
                {nodes[0]?.data.skills.map((skill, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <span className="text-green-400">+{Math.floor(Math.random() * 30) + 10}%</span>
                    <span>{skill}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-zinc-800 p-3 rounded-lg border border-indigo-600/20">
              <h4 className="font-medium mb-2 text-white">Emerging Opportunities</h4>
              <ul className="text-sm space-y-2 text-gray-300">
                <li className="flex items-start gap-2">
                  <ChevronRight className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                  <span>Remote {metadata.careerPath.replace("-", " ")} roles increased by 34%</span>
                </li>
                <li className="flex items-start gap-2">
                  <ChevronRight className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                  <span>Startups hiring {metadata.skillLevel} professionals up 22%</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      ),
    },
    "mentor-suggestions": {
      icon: <Users className="w-5 h-5" />,
      title: "Mentors",
      component: (
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-white">Recommended Mentors</h3>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="bg-zinc-800 border-indigo-600/20">
                <CardContent className="p-3 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-indigo-600/30 flex items-center justify-center text-xl font-bold text-white">
                    {String.fromCharCode(64 + i)}
                  </div>
                  <div>
                    <h4 className="font-medium text-white">Mentor {i}</h4>
                    <p className="text-sm text-gray-300">
                      {metadata.careerPath.replace("-", " ")} expert • {3 + i} years
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-2 h-7 text-xs text-white border-indigo-600/30 hover:bg-indigo-600/20"
                    >
                      Connect
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ),
    },
    "resume-optimization": {
      icon: <FileText className="w-5 h-5" />,
      title: "Resume Optimization",
      component: (
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-white">Resume Analysis</h3>
          <div className="bg-zinc-800 p-3 rounded-lg border border-indigo-600/20">
            <h4 className="font-medium mb-2 text-white">ATS Score Estimation</h4>
            <div className="space-y-1">
              <div className="flex justify-between text-sm text-white">
                <span>Current Resume Score</span>
                <span>68%</span>
              </div>
              <Progress value={68} className="h-2" />
              <p className="text-xs text-gray-300 mt-2">
                Upload your resume for a detailed analysis and improvement suggestions
              </p>
            </div>
          </div>
          <div className="bg-zinc-800 p-3 rounded-lg border border-indigo-600/20">
            <h4 className="font-medium mb-2 text-white">Keyword Recommendations</h4>
            <div className="flex flex-wrap gap-2 mt-2">
              {nodes[0]?.data.skills.map((skill, i) => (
                <Badge key={i} className="bg-indigo-600/30 text-white">
                  {skill}
                </Badge>
              ))}
            </div>
            <p className="text-xs text-gray-300 mt-2">Include these keywords in your resume to improve visibility</p>
          </div>
        </div>
      ),
    },
    certifications: {
      icon: <Award className="w-5 h-5" />,
      title: "Certifications",
      component: (
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-white">Recommended Certifications</h3>
          <div className="space-y-3">
            {nodes
              .filter((node) => node.data.certifications && node.data.certifications.length > 0)
              .slice(0, 3)
              .map((node, i) => (
                <Card key={i} className="bg-zinc-800 border-indigo-600/20">
                  <CardContent className="p-3">
                    <h4 className="font-medium text-white">{node.data.certifications[0]}</h4>
                    <p className="text-sm text-gray-300 mt-1">Aligns with: {node.data.label}</p>
                    <div className="flex gap-2 mt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-7 text-xs text-white border-indigo-600/30 hover:bg-indigo-600/20"
                      >
                        Learn More
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-7 text-xs text-white border-indigo-600/30 hover:bg-indigo-600/20"
                      >
                        Add to Goals
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </div>
      ),
    },
    gamification: {
      icon: <Sparkles className="w-5 h-5" />,
      title: "Achievements",
      component: (
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-white">Career Achievements</h3>
          <div className="space-y-3">
            {achievements.map((achievement, i) => (
              <Card key={i} className="bg-zinc-800 border-green-600">
                <CardContent className="p-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-green-600 flex items-center justify-center">
                      <Sparkles className="w-5 h-5 text-black" />
                    </div>
                    <div>
                      <h4 className="font-medium text-white">{achievement.title}</h4>
                      <p className="text-sm text-gray-300">{achievement.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            {achievements.length === 0 && (
              <div className="bg-zinc-800 p-3 rounded-lg border border-indigo-600/20">
                <h4 className="font-medium mb-2 text-white">Unlock Achievements</h4>
                <p className="text-sm text-gray-300">
                  Complete steps in your roadmap to earn achievements and track your progress.
                </p>
                <ul className="text-sm space-y-2 mt-3 text-gray-300">
                  <li className="flex items-start gap-2">
                    <ChevronRight className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                    <span>Complete first milestone: "Roadmap Pioneer"</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ChevronRight className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                    <span>Complete 3 skills: "Skill Master"</span>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      ),
    },
    "career-detours": {
      icon: <Rocket className="w-5 h-5" />,
      title: "Career Paths",
      component: (
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-white">Alternative Career Paths</h3>
          <div className="space-y-3">
            <Card className="bg-zinc-800 border-indigo-600/20">
              <CardContent className="p-3">
                <h4 className="font-medium text-white">Related Roles</h4>
                <ul className="text-sm space-y-2 mt-2 text-gray-300">
                  {["Technical Lead", "Solutions Architect", "DevOps Specialist"].map((role, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <ChevronRight className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                      <span>{role}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
            <Card className="bg-zinc-800 border-indigo-600/20">
              <CardContent className="p-3">
                <h4 className="font-medium text-white">Skill Overlap</h4>
                <p className="text-sm text-gray-300 mt-1">Your current skills align with these alternative paths</p>
                <div className="mt-2 space-y-1">
                  <div className="flex justify-between text-sm text-white">
                    <span>Product Management</span>
                    <span>65%</span>
                  </div>
                  <Progress value={65} className="h-2" />
                  <div className="flex justify-between text-sm text-white">
                    <span>Technical Writing</span>
                    <span>48%</span>
                  </div>
                  <Progress value={48} className="h-2" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      ),
    },
  }

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge({ ...params, type: "smoothstep", animated: true }, eds)),
    [setEdges],
  )

  const onLayout = useCallback(
    (direction) => {
      const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(nodes, edges, direction)
      setNodes([...layoutedNodes])
      setEdges([...layoutedEdges])
      setLayoutDirection(direction)
    },
    [nodes, edges, setNodes, setEdges],
  )

  const downloadRoadmapAsPDF = async () => {
    const element = document.querySelector(".react-flow__viewport")
    if (!element) return

    const canvas = await html2canvas(element, { scale: 2 })
    const imgData = canvas.toDataURL("image/png")
    const pdf = new jsPDF("landscape", "mm", "a4")
    const imgProps = pdf.getImageProperties(imgData)
    const pdfWidth = pdf.internal.pageSize.getWidth()
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width
    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight)
    pdf.save("career-roadmap.pdf")
  }

  const markNodeComplete = useCallback(
    (nodeId) => {
      if (completedNodes.includes(nodeId)) {
        setCompletedNodes(completedNodes.filter((id) => id !== nodeId))
      } else {
        setCompletedNodes([...completedNodes, nodeId])

        // Trigger confetti effect
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ["#6366F1", "#a5b4fc", "#ffffff"],
        })

        // Add achievement if this is the first completed node
        if (completedNodes.length === 0) {
          const newAchievement = {
            title: "Roadmap Pioneer",
            description: "Completed your first milestone!",
          }
          setAchievements([...achievements, newAchievement])

          toast({
            title: "Achievement Unlocked!",
            description: "Roadmap Pioneer: Completed your first milestone!",
          })
        }

        // Add achievement if this is the third completed node
        if (completedNodes.length === 2) {
          const newAchievement = {
            title: "Skill Master",
            description: "Completed 3 skills in your roadmap!",
          }
          setAchievements([...achievements, newAchievement])

          toast({
            title: "Achievement Unlocked!",
            description: "Skill Master: Completed 3 skills in your roadmap!",
          })
        }
      }
    },
    [completedNodes, achievements, toast],
  )

  // Update progress when nodes are completed
  useEffect(() => {
    const newProgress = Math.round((completedNodes.length / nodes.length) * 100)
    setProgress(newProgress)
  }, [completedNodes, nodes.length])

  // Update nodes with completion status
  useEffect(() => {
    setNodes((nds) =>
      nds.map((node) => ({
        ...node,
        data: {
          ...node.data,
          isCompleted: completedNodes.includes(node.id),
          onComplete: () => markNodeComplete(node.id),
        },
      })),
    )
  }, [completedNodes, setNodes, markNodeComplete])

  // Initial layout
  useEffect(() => {
    onLayout(layoutDirection)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex -space-x-2">
            {metadata.features.slice(0, 4).map((featureId) => {
              const feature = features[featureId]
              if (!feature) return null

              return (
                <button
                  key={featureId}
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    featurePanel === featureId
                      ? "bg-gradient-to-r from-indigo-600 to-indigo-500 ring-2 ring-white/50"
                      : "bg-zinc-800/80"
                  } border border-indigo-600/30 hover:bg-indigo-600/70 transition-all duration-300 transform hover:scale-110 shadow-lg shadow-indigo-600/20`}
                  onClick={() => setFeaturePanel(featurePanel === featureId ? null : featureId)}
                  title={feature.title}
                >
                  {feature.icon}
                </button>
              )
            })}
          </div>
          <span className="text-sm text-white">Click an icon to view feature details</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-white">Progress:</span>
          <div className="w-48 h-4 bg-zinc-800/80 rounded-full overflow-hidden border border-indigo-600/20">
            <div
              className="h-full bg-gradient-to-r from-indigo-600 via-indigo-500 to-indigo-400 animate-pulse"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <span className="text-white font-medium">{progress}%</span>
        </div>
      </div>

      {featurePanel && (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <Card className="bg-zinc-900/90 border-indigo-600/30 mb-4 rounded-2xl shadow-lg shadow-indigo-600/10 backdrop-blur-sm transform transition-all">
              <CardContent className="p-4">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-bold text-lg flex items-center gap-2 text-white">
                    {features[featurePanel]?.icon}
                    <span>{features[featurePanel]?.title}</span>
                  </h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 text-white hover:bg-indigo-600/20"
                    onClick={() => setFeaturePanel(null)}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                </div>
                {features[featurePanel]?.component}
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>
      )}

      <div className="h-[700px] border border-indigo-600/30 rounded-2xl overflow-hidden shadow-lg shadow-indigo-600/10 relative">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          fitView
          style={flowStyles}
        >
          <Controls className="text-white" />
          <MiniMap style={minimapStyle} zoomable pannable nodeColor="#6366F1" />
          <Background color="#6366F1" gap={16} variant="dots" />
          <Panel position="top-right" className="space-x-2">
            <Button
              onClick={() => onLayout("TB")}
              className={`bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white rounded-full ${layoutDirection === "TB" ? "ring-2 ring-white/50" : ""} transition-all duration-300 transform hover:scale-105`}
              size="sm"
            >
              <ArrowDownCircle className="mr-2" size={16} />
              Vertical
            </Button>
            <Button
              onClick={() => onLayout("LR")}
              className={`bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white rounded-full ${layoutDirection === "LR" ? "ring-2 ring-white/50" : ""} transition-all duration-300 transform hover:scale-105`}
              size="sm"
            >
              <ArrowRightCircle className="mr-2" size={16} />
              Horizontal
            </Button>
            <Button onClick={downloadRoadmapAsPDF} className="bg-indigo-600 text-white" size="sm">
              <Download className="mr-2" size={16} />
              Download PDF
            </Button>
          </Panel>
        </ReactFlow>
      </div>
    </div>
  )
}
