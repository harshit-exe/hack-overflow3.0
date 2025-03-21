"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
// import { Toaster } from "@/components/ui/toaster"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LayoutDashboard, MapPin } from "lucide-react"
import DashboardView from "@/components/RoadMap/dashboard-view"
import RoadmapVisualization from "@/components/RoadMap/RoadmapVisualization"
import RoadmapForm from "@/components/RoadMap/RoadmapForm"

export default function CareerRoadmapPage() {
  const [roadmapData, setRoadmapData] = useState(null)
  const [showVisualization, setShowVisualization] = useState(false)
  const [activeTab, setActiveTab] = useState("roadmap")

  const handleRoadmapComplete = () => {
    setShowVisualization(true)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handleReset = () => {
    setShowVisualization(false)
    setRoadmapData(null)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <AnimatePresence mode="wait">
        {!showVisualization ? (
          <motion.div
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="max-w-5xl mx-auto px-4 py-8"
          >
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center mb-12"
            >
              <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-green-400">
                CAREER DEVELOPMENT ROADMAP
              </h1>
              <p className="text-white max-w-3xl mx-auto">
                Plan your professional journey with our AI-powered career roadmap generator. Get personalized guidance,
                track your progress, and achieve your career goals.
              </p>
            </motion.div>
            <RoadmapForm setRoadmapData={setRoadmapData} onComplete={handleRoadmapComplete} />
          </motion.div>
        ) : (
          <div className="max-w-7xl mx-auto px-4 py-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">Your Career Development Roadmap</h2>
              <button
                onClick={handleReset}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md text-sm font-medium"
              >
                Create New Roadmap
              </button>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto mb-6">
                <TabsTrigger
                  value="roadmap"
                  className="flex items-center justify-center gap-2 data-[state=active]:bg-indigo-700"
                >
                  <MapPin size={16} />
                  <span>Roadmap</span>
                </TabsTrigger>
                <TabsTrigger
                  value="dashboard"
                  className="flex items-center justify-center gap-2 data-[state=active]:bg-indigo-700"
                >
                  <LayoutDashboard size={16} />
                  <span>Dashboard</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="roadmap" className="mt-2">
                <RoadmapVisualization roadmapData={roadmapData} />
              </TabsContent>

              <TabsContent value="dashboard" className="mt-2">
                <DashboardView roadmapData={roadmapData} />
              </TabsContent>
            </Tabs>
          </div>
        )}
      </AnimatePresence>
      {/* <Toaster /> */}
    </div>
  )
}

