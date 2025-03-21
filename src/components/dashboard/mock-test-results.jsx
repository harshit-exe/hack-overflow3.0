'use client';
import { useState } from "react";
import { FaPlus, FaCheckCircle } from "react-icons/fa";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function MockTestResults() {
  const [tasks, setTasks] = useState([
    { id: 1, text: "Complete React Assignment", due: "Today", color: "red" },
    { id: 2, text: "Review Database Concepts", due: "Tomorrow", color: "yellow" },
    { id: 3, text: "Prepare Mock Interview", due: "This Week", color: "red" },
    { id: 4, text: "Read System Design Paper", due: "This Week", color: "green" },
  ]);
  // const results = [
  //   { label: "Total Questions", value: "5", icon: "□" },
  //   { label: "Correct Answers", value: "1", icon: "✓" },
  //   { label: "Score", value: "20%", icon: "★" },
  //   { label: "Hints Used", value: "0", icon: "?" },
  //   { label: "Topics Covered", value: "Node.js", icon: "◆" },
  // ]

  return (
    // <Card className="bg-zinc-900 border-zinc-800">
    //   <CardHeader>
    //     <CardTitle>Mock Test Results</CardTitle>
    //   </CardHeader>
    //   <CardContent>
    //     <div className="space-y-4">
    //       {results.map((result) => (
    //         <div key={result.label} className="flex items-center gap-3">
    //           <span className="text-zinc-500">{result.icon}</span>
    //           <span className="text-sm text-zinc-400">{result.label}</span>
    //           <span className="text-sm ml-auto">{result.value}</span>
    //         </div>
    //       ))}
    //     </div>
    //   </CardContent>
    // </Card>

    <div className="bg-gray-900 text-white p-5 rounded-xl w-96">
      <h2 className="text-lg font-semibold mb-4">Tasks</h2>
      <div className="flex items-center mb-4">
        <input
          type="text"
          placeholder="Add new task..."
          className="flex-1 p-2 rounded-lg bg-gray-800 text-white outline-none"
        />
        <button className="ml-2 bg-green-500 p-2 rounded-lg hover:bg-green-600">
          <FaPlus className="text-white" />
        </button>
      </div>
      <ul>
        {tasks.map((task) => (
          <li key={task.id} className="flex items-center justify-between p-2 mb-2 bg-gray-800 rounded-lg">
            <div className="flex items-center">
              <span className={`h-3 w-3 rounded-full bg-${task.color}-500 mr-2`}></span>
              <div>
                <p className="font-medium">{task.text}</p>
                <span className="text-sm text-gray-400">{task.due}</span>
              </div>
            </div>
            <FaCheckCircle className="text-gray-400" />
          </li>
        ))}
      </ul>
    </div>
  )
}

