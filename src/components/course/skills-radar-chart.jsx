"use client"

import { useEffect, useState } from "react"
import { Radar } from "react-chartjs-2"
import { Chart as ChartJS, RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend } from "chart.js"

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend)

export default function SkillsRadarChart({ careerPath }) {
  const [chartData, setChartData] = useState(null)

  useEffect(() => {
    if (!careerPath || careerPath.length === 0) return

    const allSkills = careerPath.flatMap((stage) => stage.skills)
    const uniqueSkills = [...new Set(allSkills)]
    const skillCounts = uniqueSkills.map((skill) => allSkills.filter((s) => s === skill).length)

    // Limit to top 8 skills for better visualization
    const topSkillsIndices = skillCounts
      .map((count, index) => ({ count, index }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8)
      .map((item) => item.index)

    const topSkills = uniqueSkills.filter((_, index) => topSkillsIndices.includes(index))
    const topSkillCounts = skillCounts.filter((_, index) => topSkillsIndices.includes(index))

    const data = {
      labels: topSkills,
      datasets: [
        {
          label: "Skill Importance",
          data: topSkillCounts,
          backgroundColor: "rgba(87, 255, 49, 0.2)",
          borderColor: "rgba(87, 255, 49, 1)",
          borderWidth: 2,
          pointBackgroundColor: "rgba(79, 70, 229, 1)",
          pointBorderColor: "#fff",
          pointHoverBackgroundColor: "#fff",
          pointHoverBorderColor: "rgba(79, 70, 229, 1)",
        },
      ],
    }

    const options = {
      scales: {
        r: {
          angleLines: {
            display: true,
            color: "rgba(255, 255, 255, 0.1)",
          },
          grid: {
            color: "rgba(255, 255, 255, 0.1)",
          },
          pointLabels: {
            color: "rgba(255, 255, 255, 0.7)",
            font: {
              size: 12,
            },
          },
          ticks: {
            color: "rgba(255, 255, 255, 0.5)",
            backdropColor: "transparent",
          },
          suggestedMin: 0,
          suggestedMax: Math.max(...topSkillCounts) + 1,
        },
      },
      plugins: {
        legend: {
          display: true,
          position: "top",
          labels: {
            color: "rgba(255, 255, 255, 0.7)",
            font: {
              size: 14,
            },
          },
        },
        tooltip: {
          backgroundColor: "rgba(0, 0, 0, 0.7)",
          titleColor: "rgba(87, 255, 49, 1)",
          bodyColor: "#fff",
          borderColor: "rgba(79, 70, 229, 0.5)",
          borderWidth: 1,
        },
      },
    }

    setChartData({ data, options })
  }, [careerPath])

  if (!chartData)
    return (
      <div className="w-full h-[70vh] flex items-center justify-center">
        <p className="text-gray-400">Loading skills analysis...</p>
      </div>
    )

  return (
    <div className="w-full h-[70vh] flex flex-col items-center justify-center">
      <h3 className="text-xl font-bold mb-6 text-white">Skills Analysis</h3>
      <div className="w-full max-w-3xl h-[500px] flex items-center justify-center">
        <Radar data={chartData.data} options={chartData.options} />
      </div>
      <p className="text-gray-400 text-sm mt-4 text-center max-w-lg">
        This chart shows the most important skills across your career path. Higher values indicate skills that appear
        more frequently across different career stages.
      </p>
    </div>
  )
}

