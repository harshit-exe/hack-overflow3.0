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
  Sparkles,
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
  background: "#000000",
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
    timeframe: 12,
    focusAreas: ["technical-skills"],
    features: ["skill-tracker", "certifications"],
  }

  const features = {
    "skill-tracker": {
      icon: <Target className="w-5 h-5" />,
      title: "Skill Tracker",
      component: (
        <div className="space-y-4">
          <h3 className="text-xl font-bold">Skill Progress</h3>
          <div className="space-y-3">
            {nodes.slice(0, 5).map((node) => (
              <div key={node.id} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>{node.data.skills[0]}</span>
                  <span>{completedNodes.includes(node.id) ? "100%" : "0%"}</span>
                </div>
                <Progress value={completedNodes.includes(node.id) ? 100 : 0} className="h-2" />
              </div>
            ))}
          </div>
          <div className="bg-indigo-900/30 p-3 rounded-lg mt-4">
            <h4 className="font-medium mb-2">Recommended Next Steps</h4>
            <ul className="text-sm space-y-2">
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
          <h3 className="text-xl font-bold">Job Market Insights</h3>
          <div className="space-y-3">
            <div className="bg-indigo-900/30 p-3 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-medium">In-Demand Skills</h4>
                <Badge className="bg-green-500/90 text-white text-xs">Hot</Badge>
              </div>
              <ul className="text-sm space-y-2">
                {nodes[0]?.data.skills.map((skill, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <span className="text-green-400">+{Math.floor(Math.random() * 30) + 10}%</span>
                    <span>{skill}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-indigo-900/30 p-3 rounded-lg">
              <h4 className="font-medium mb-2">Emerging Opportunities</h4>
              <ul className="text-sm space-y-2">
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
    certifications: {
      icon: <Award className="w-5 h-5" />,
      title: "Certifications",
      component: (
        <div className="space-y-4">
          <h3 className="text-xl font-bold">Recommended Certifications</h3>
          <div className="space-y-3">
            {nodes
              .filter((node) => node.data.certifications && node.data.certifications.length > 0)
              .slice(0, 3)
              .map((node, i) => (
                <Card key={i} className="bg-black border-indigo-800">
                  <CardContent className="p-3">
                    <h4 className="font-medium">{node.data.certifications[0]}</h4>
                    <p className="text-sm text-white mt-1">Aligns with: {node.data.label}</p>
                    <div className="flex gap-2 mt-2">
                      <Button variant="outline" size="sm" className="h-7 text-xs">
                        Learn More
                      </Button>
                      <Button variant="outline" size="sm" className="h-7 text-xs">
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
          <h3 className="text-xl font-bold">Career Achievements</h3>
          <div className="space-y-3">
            {achievements.map((achievement, i) => (
              <Card key={i} className="bg-black border-green-600">
                <CardContent className="p-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-green-600 flex items-center justify-center">
                      <Sparkles className="w-5 h-5 text-black" />
                    </div>
                    <div>
                      <h4 className="font-medium">{achievement.title}</h4>
                      <p className="text-sm text-white">{achievement.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            {achievements.length === 0 && (
              <div className="bg-indigo-900/30 p-3 rounded-lg">
                <h4 className="font-medium mb-2">Unlock Achievements</h4>
                <p className="text-sm text-white">
                  Complete steps in your roadmap to earn achievements and track your progress.
                </p>
                <ul className="text-sm space-y-2 mt-3">
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
                    featurePanel === featureId ? "bg-indigo-600" : "bg-indigo-900/50"
                  } border border-indigo-700 hover:bg-indigo-700 transition-colors`}
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
          <div className="w-48 h-4 bg-gray-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-600 to-green-400"
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
            <Card className="bg-black border-indigo-800 mb-4">
              <CardContent className="p-4">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-bold text-lg flex items-center gap-2">
                    {features[featurePanel]?.icon}
                    <span>{features[featurePanel]?.title}</span>
                  </h3>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => setFeaturePanel(null)}>
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                </div>
                {features[featurePanel]?.component}
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>
      )}

      <div className="h-[700px] border border-indigo-800 rounded-xl overflow-hidden shadow-lg relative">
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
              className={`bg-indigo-600 text-white ${layoutDirection === "TB" ? "ring-2 ring-green-400" : ""}`}
              size="sm"
            >
              <ArrowDownCircle className="mr-2" size={16} />
              Vertical
            </Button>
            <Button
              onClick={() => onLayout("LR")}
              className={`bg-indigo-600 text-white ${layoutDirection === "LR" ? "ring-2 ring-green-400" : ""}`}
              size="sm"
            >
              <ArrowRightCircle className="mr-2" size={16} />
              Horizontal
            </Button>
            <Button onClick={downloadRoadmapAsPDF} className="bg-green-400 text-black" size="sm">
              <Download className="mr-2" size={16} />
              Download PDF
            </Button>
          </Panel>
        </ReactFlow>
      </div>
    </div>
  )
}

