"use client"

import React, { memo } from "react"
import { Handle, Position } from "reactflow"
import { Book, Link, Calendar, Award, ChevronDown, ChevronUp } from "lucide-react"

function CustomNode({ data }) {
  const [isExpanded, setIsExpanded] = React.useState(false)

  return (
    <div className="bg-black border-2 border-indigo-600 rounded-xl p-4 shadow-lg w-80">
      <Handle type="target" position={Position.Top} className="w-3 h-3 bg-indigo-600" />
      <div className="flex items-center justify-between mb-2">
        <div className="font-bold text-xl text-indigo-400">{data.label}</div>
        <button onClick={() => setIsExpanded(!isExpanded)} className="text-green-400">
          {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </button>
      </div>
      <div className="text-sm text-gray-300 mb-2">
        <h4 className="font-semibold mb-1 flex items-center">
          <Calendar className="mr-2 text-indigo-400" size={16} />
          Timeframe: {data.timeframe}
        </h4>
      </div>
      {isExpanded && (
        <>
          <div className="text-sm text-gray-300 mb-2">
            <h4 className="font-semibold mb-1 flex items-center">
              <Book className="mr-2 text-indigo-400" size={16} />
              Required Skills:
            </h4>
            <ul className="list-disc list-inside">
              {data.skills.map((skill, index) => (
                <li key={index}>{skill}</li>
              ))}
            </ul>
          </div>
          {data.certifications && data.certifications.length > 0 && (
            <div className="text-sm text-gray-300 mb-2">
              <h4 className="font-semibold mb-1 flex items-center">
                <Award className="mr-2 text-indigo-400" size={16} />
                Recommended Certifications:
              </h4>
              <ul className="list-disc list-inside">
                {data.certifications.map((cert, index) => (
                  <li key={index}>{cert}</li>
                ))}
              </ul>
            </div>
          )}
          <div className="text-sm text-gray-300">
            <h4 className="font-semibold mb-1 flex items-center">
              <Link className="mr-2 text-indigo-400" size={16} />
              Resources:
            </h4>
            <ul className="list-disc list-inside">
              {data.resources.map((resource, index) => (
                <li key={index}>
                  <a
                    href={resource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-green-400 hover:underline"
                  >
                    {resource.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </>
      )}
      <Handle type="source" position={Position.Bottom} className="w-3 h-3 bg-indigo-600" />
    </div>
  )
}

export default memo(CustomNode)

