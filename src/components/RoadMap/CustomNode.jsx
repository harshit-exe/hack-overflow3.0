"use client"

import React, { memo } from "react"
import { Handle, Position } from "reactflow"
import { Book, Link, Calendar, Award, ChevronDown, ChevronUp, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { Badge } from "@/components/ui/badge"

function CustomNode({ data }) {
  const [isExpanded, setIsExpanded] = React.useState(data.isExpanded || false)

  return (
    <div
      className={`bg-black border ${
        data.isCompleted ? "border-green-400" : "border-indigo-600"
      } rounded-lg p-4 shadow-lg w-[280px] transition-all duration-300`}
    >
      <Handle
        type="target"
        position={Position.Top}
        className={`w-3 h-3 ${data.isCompleted ? "bg-green-400" : "bg-indigo-600"}`}
      />

      <div className="flex items-center justify-between mb-2">
        <div className="font-bold text-lg text-indigo-400 flex items-center gap-2">
          {data.isCompleted && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            >
              <CheckCircle className="text-green-400 w-5 h-5" />
            </motion.div>
          )}
          <span>{data.label}</span>
        </div>
        <button onClick={() => setIsExpanded(!isExpanded)} className="text-indigo-400">
          {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>
      </div>

      <div className="text-sm text-white mb-2">
        <h4 className="font-medium mb-1 flex items-center">
          <Calendar className="mr-2 text-indigo-400" size={14} />
          Timeframe: {data.timeframe}
        </h4>
      </div>

      {isExpanded && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="text-sm text-white mb-2">
            <h4 className="font-medium mb-1 flex items-center">
              <Book className="mr-2 text-indigo-400" size={14} />
              Required Skills:
            </h4>
            <ul className="list-disc list-inside">
              {data.skills.map((skill, index) => (
                <li key={index}>{skill}</li>
              ))}
            </ul>
          </div>

          {data.certifications && data.certifications.length > 0 && (
            <div className="text-sm text-white mb-2">
              <h4 className="font-medium mb-1 flex items-center">
                <Award className="mr-2 text-indigo-400" size={14} />
                Recommended Certifications:
              </h4>
              <ul className="list-disc list-inside">
                {data.certifications.map((cert, index) => (
                  <li key={index}>{cert}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="text-sm text-white">
            <h4 className="font-medium mb-1 flex items-center">
              <Link className="mr-2 text-indigo-400" size={14} />
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

          {!data.isCompleted && (
            <div className="mt-3">
              <Button
                onClick={() => data.onComplete && data.onComplete()}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
                size="sm"
              >
                Mark as Complete
              </Button>
            </div>
          )}

          {data.isCompleted && (
            <div className="mt-3">
              <Badge className="w-full flex justify-center bg-green-600 text-white py-1">Completed</Badge>
            </div>
          )}
        </motion.div>
      )}

      <Handle
        type="source"
        position={Position.Bottom}
        className={`w-3 h-3 ${data.isCompleted ? "bg-green-400" : "bg-indigo-600"}`}
      />
    </div>
  )
}

export default memo(CustomNode)

