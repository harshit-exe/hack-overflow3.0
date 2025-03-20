"use client"

import { useCallback, useState } from "react"
import ReactFlow, { MiniMap, Controls, Background, useNodesState, useEdgesState, addEdge, Panel } from "reactflow"
import "reactflow/dist/style.css"
import CustomNode from "./CustomNode"
import { ArrowDownCircle, ArrowRightCircle, Download, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { jsPDF } from "jspdf"
import html2canvas from "html2canvas"
import dagre from "dagre"

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
    dagreGraph.setNode(node.id, { width: 320, height: 200 })
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
          x: nodeWithPosition.x - 160,
          y: nodeWithPosition.y - 100,
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

  const toggleNodeExpansion = useCallback(() => {
    setNodes((nds) =>
      nds.map((node) => ({
        ...node,
        data: { ...node.data, isExpanded: !node.data.isExpanded },
      })),
    )
  }, [setNodes])

  return (
    <div className="mt-12">
      <h2 className="text-3xl font-bold mb-6 text-white">Your Career Development Roadmap</h2>
      <div className="h-[700px] border-4 border-indigo-600 rounded-xl overflow-hidden shadow-xl relative">
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
            >
              <ArrowDownCircle className="mr-2" size={16} />
              Vertical
            </Button>
            <Button
              onClick={() => onLayout("LR")}
              className={`bg-indigo-600 text-white ${layoutDirection === "LR" ? "ring-2 ring-green-400" : ""}`}
            >
              <ArrowRightCircle className="mr-2" size={16} />
              Horizontal
            </Button>
            <Button onClick={downloadRoadmapAsPDF} className="bg-green-400 text-black">
              <Download className="mr-2" size={16} />
              Download PDF
            </Button>
          </Panel>
          <Panel position="bottom-right" className="space-x-2">
            <Button className="bg-indigo-600 text-white" onClick={toggleNodeExpansion}>
              <RefreshCw className="mr-2" size={16} />
              Toggle Details
            </Button>
          </Panel>
        </ReactFlow>
      </div>
    </div>
  )
}

