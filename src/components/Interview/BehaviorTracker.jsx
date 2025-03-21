"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { useState, useEffect } from "react"
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"

export function BehaviorTracker({ behaviorData }) {
  const latestBehavior = behaviorData[behaviorData.length - 1] || {}
  const [showChart, setShowChart] = useState(false)
  const [chartData, setChartData] = useState([])
  const [emotionCounts, setEmotionCounts] = useState({})

  useEffect(() => {
    // Process data for the chart
    if (behaviorData.length > 0) {
      // Limit to last 20 data points for better performance
      const processedData = behaviorData.slice(-20).map((data, index) => {
        return {
          index,
          engagement:
            data.engagementScore || (data.engagement === "High" ? 100 : data.engagement === "Medium" ? 50 : 0),
          attentiveness: data.attentiveness === "High" ? 100 : data.attentiveness === "Medium" ? 50 : 0,
          faceMovement: data.faceMovement ? data.faceMovement * 100 : 0,
        }
      })
      setChartData(processedData)

      // Count emotions
      const emotions = {}
      behaviorData.forEach((data) => {
        if (data.emotion) {
          emotions[data.emotion] = (emotions[data.emotion] || 0) + 1
        }
      })
      setEmotionCounts(emotions)
    }
  }, [behaviorData])

  const calculateOverallEngagement = () => {
    if (behaviorData.length === 0) return 0

    // Calculate average engagement score
    let totalEngagement = 0
    let count = 0

    behaviorData.forEach((data) => {
      if (data.engagementScore) {
        totalEngagement += data.engagementScore
        count++
      } else if (data.engagement) {
        totalEngagement += data.engagement === "High" ? 100 : data.engagement === "Medium" ? 50 : 0
        count++
      }
    })

    return count > 0 ? totalEngagement / count : 0
  }

  const calculateOverallAttentiveness = () => {
    if (behaviorData.length === 0) return 0
    const attentivenessCount = behaviorData.filter((data) => data.attentiveness === "High").length
    return (attentivenessCount / behaviorData.length) * 100
  }

  const getDominantEmotion = () => {
    if (Object.keys(emotionCounts).length === 0) return "N/A"

    let maxCount = 0
    let dominantEmotion = "N/A"

    Object.entries(emotionCounts).forEach(([emotion, count]) => {
      if (count > maxCount) {
        maxCount = count
        dominantEmotion = emotion
      }
    })

    return dominantEmotion
  }

  return (
    <Card className="bg-gray-900 text-white">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-[#6366F1]">Behavior Tracker</CardTitle>
        <button onClick={() => setShowChart(!showChart)} className="text-sm text-gray-400 hover:text-white">
          {showChart ? "Hide Chart" : "Show Chart"}
        </button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium text-gray-300 mb-1">Current Engagement</h3>
            <div className="text-lg font-semibold text-[#57FF31]">
              {latestBehavior.engagement ||
                (latestBehavior.engagementScore
                  ? latestBehavior.engagementScore < 30
                    ? "Low"
                    : latestBehavior.engagementScore < 70
                      ? "Medium"
                      : "High"
                  : "N/A")}
            </div>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-300 mb-1">Current Attentiveness</h3>
            <div className="text-lg font-semibold text-[#57FF31]">{latestBehavior.attentiveness || "N/A"}</div>
          </div>

          {latestBehavior.emotion && (
            <div>
              <h3 className="text-sm font-medium text-gray-300 mb-1">Current Emotion</h3>
              <div className="text-lg font-semibold text-[#57FF31] capitalize">{latestBehavior.emotion}</div>
            </div>
          )}

          <div>
            <h3 className="text-sm font-medium text-gray-300 mb-1">Dominant Emotion</h3>
            <div className="text-lg font-semibold text-[#57FF31] capitalize">{getDominantEmotion()}</div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-300 mb-1">Overall Engagement</h3>
            <Progress
              value={calculateOverallEngagement()}
              className="w-full bg-gray-700"
              indicatorColor="bg-[#57FF31]"
            />
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-300 mb-1">Overall Attentiveness</h3>
            <Progress
              value={calculateOverallAttentiveness()}
              className="w-full bg-gray-700"
              indicatorColor="bg-[#57FF31]"
            />
          </div>

          {showChart && chartData.length > 0 && (
            <div className="pt-4">
              <h3 className="text-sm font-medium text-gray-300 mb-3">Behavior Trends</h3>
              <div className="h-[150px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <XAxis dataKey="index" tick={false} />
                    <YAxis hide />
                    <Tooltip
                      contentStyle={{ backgroundColor: "#1f2937", border: "none", borderRadius: "4px" }}
                      labelStyle={{ color: "#9ca3af" }}
                    />
                    <Line
                      type="monotone"
                      dataKey="engagement"
                      stroke="#57FF31"
                      strokeWidth={2}
                      dot={false}
                      name="Engagement"
                    />
                    <Line
                      type="monotone"
                      dataKey="attentiveness"
                      stroke="#6366F1"
                      strokeWidth={2}
                      dot={false}
                      name="Attentiveness"
                    />
                    <Line
                      type="monotone"
                      dataKey="faceMovement"
                      stroke="#f59e0b"
                      strokeWidth={2}
                      dot={false}
                      name="Movement"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

