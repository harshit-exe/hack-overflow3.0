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
      className={`bg-gradient-to-br from-zinc-900 to-zinc-800 border ${
        data.isCompleted ? "border-indigo-400 shadow-lg shadow-indigo-400/20" : "border-indigo-600/30"
      } rounded-2xl p-4 shadow-lg w-[280px] transition-all duration-300 hover:shadow-xl hover:shadow-indigo-600/20 backdrop-blur-sm`}
    >
      <Handle
        type="target"
        position={Position.Top}
        className={`w-3 h-3 ${data.isCompleted ? "bg-indigo-400 shadow-lg shadow-indigo-400/50" : "bg-indigo-600"}`}
      />

      <div className="flex items-center justify-between mb-2">
        <div className="font-bold text-lg text-white flex items-center gap-2">
          {data.isCompleted && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            >
              <CheckCircle className="text-indigo-400 w-5 h-5" />
            </motion.div>
          )}
          <span>{data.label}</span>
        </div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-white hover:bg-indigo-600/20 p-1 rounded-full transition-all duration-300"
        >
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
            <ul className="list-disc list-inside text-gray-300">
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
              <ul className="list-disc list-inside text-gray-300">
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
                    className="text-indigo-300 hover:underline"
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
                className="w-full bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white rounded-xl shadow-md shadow-indigo-600/20 transform transition-transform hover:scale-[1.02]"
                size="sm"
              >
                Mark as Complete
              </Button>
            </div>
          )}

          {data.isCompleted && (
            <div className="mt-3">
              <Badge className="w-full flex justify-center bg-gradient-to-r from-indigo-600/30 to-indigo-500/30 text-white py-1 rounded-xl">
                Completed
              </Badge>
            </div>
          )}
        </motion.div>
      )}

      <Handle
        type="source"
        position={Position.Bottom}
        className={`w-3 h-3 ${data.isCompleted ? "bg-indigo-400" : "bg-indigo-600"}`}
      />
    </div>
  )
}

export default memo(CustomNode)
