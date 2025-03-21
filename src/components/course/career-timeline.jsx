"use client"

import { VerticalTimeline, VerticalTimelineElement } from "react-vertical-timeline-component"
import "react-vertical-timeline-component/style.min.css"
import { Briefcase, Award, BookOpen, Code } from "lucide-react"

export default function CareerTimeline({ careerPath }) {
  const getIcon = (index) => {
    const icons = [Briefcase, Code, BookOpen, Award]
    return icons[index % icons.length]
  }

  const getColor = (index) => {
    return index % 2 === 0 ? "#4F46E5" : "#57FF31"
  }

  const getTextColor = (index) => {
    return index % 2 === 0 ? "white" : "black"
  }

  return (
    <div className="w-full h-[70vh] overflow-auto pr-4">
      <VerticalTimeline lineColor="rgba(255, 255, 255, 0.2)">
        {careerPath.map((stage, index) => {
          const Icon = getIcon(index)
          const color = getColor(index)
          const textColor = getTextColor(index)

          return (
            <VerticalTimelineElement
              key={index}
              className="vertical-timeline-element--work"
              contentStyle={{
                background: color,
                color: textColor,
                boxShadow: "0 10px 25px rgba(0, 0, 0, 0.2)",
                borderRadius: "12px",
              }}
              contentArrowStyle={{ borderRight: `7px solid ${color}` }}
              date={`Stage ${index + 1}`}
              dateClassName="text-gray-300 font-medium"
              iconStyle={{ background: color, color: textColor }}
              icon={<Icon />}
            >
              <h3 className={`vertical-timeline-element-title text-xl font-bold text-${textColor}`}>{stage.title}</h3>
              <p className={`my-4 text-${textColor} opacity-90`}>{stage.description}</p>

              {stage.milestones && stage.milestones.length > 0 && (
                <div className="mt-4">
                  <h4 className={`text-${textColor} font-semibold mb-2`}>Key Milestones:</h4>
                  <ul className={`list-disc pl-5 text-${textColor} opacity-90`}>
                    {stage.milestones.map((milestone, mIndex) => (
                      <li key={mIndex} className="mb-1">
                        {milestone}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </VerticalTimelineElement>
          )
        })}
      </VerticalTimeline>
    </div>
  )
}

