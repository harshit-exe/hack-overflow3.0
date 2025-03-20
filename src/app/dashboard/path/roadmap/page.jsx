"use client";

import { useState } from "react";
import RoadmapForm from "@/components/RoadMap/RoadmapForm";
import RoadmapVisualization from "@/components/RoadMap/RoadmapVisualization";

export default function CareerRoadmapPage() {
  const [roadmapData, setRoadmapData] = useState(null);
  const [showVisualization, setShowVisualization] = useState(false);

  const handleRoadmapComplete = () => {
    setShowVisualization(true);
  };

  return (
    <div className="min-h-screen bg-[url('/bg.png')] bg-contain text-white p-8">
      <h1 className="text-4xl font-bold mb-8 text-center">
        CAREER DEVELOPMENT ROADMAP
      </h1>

      {!showVisualization ? (
        <RoadmapForm
          setRoadmapData={setRoadmapData}
          onComplete={handleRoadmapComplete}
        />
      ) : (
        <RoadmapVisualization roadmapData={roadmapData} />
      )}
    </div>
  );
}
