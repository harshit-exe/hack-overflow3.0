"use client";

import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function InterviewTips() {
  // const tips = [
  //   "Research the company thoroughly",
  //   "Practice common questions",
  //   "Prepare your own questions",
  //   "Follow up after interview",
  // ]

  const [selectedCategory, setSelectedCategory] = useState("Fundamentals of Programming");

  const roadmap = [
    {
      category: "Fundamentals of Programming",
      completed: true,
      color: "green",
      topics: ["Python Basics", "Data Structures", "Algorithms"],
    },
    {
      category: "Web Development",
      completed: false,
      color: "blue",
      topics: ["HTML/CSS", "JavaScript", "React"],
    },
    {
      category: "Backend Development",
      completed: false,
      color: "gray",
      topics: ["Node.js", "Databases", "API Design"],
    },
  ];

  const testResults = [
    { subject: "React", score: 85 },
    { subject: "Node.js", score: 78 },
    { subject: "Python", score: 92 },
    { subject: "Java", score: 70 },
  ];

  return (
    <div className="grid md:grid-cols-2 gap-6 p-6 bg-black text-white">
      {/* Learning Roadmap */}
      <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-800">
        <h2 className="text-lg font-semibold">Your Learning Roadmap</h2>

        {roadmap.map((section, index) => (
          <div key={index} className="mt-4">
            <div
              className="flex items-center space-x-2 cursor-pointer"
              onClick={() => setSelectedCategory(section.category)}
            >
              <div
                className={`w-3 h-3 rounded-full ${
                  section.completed ? `bg-${section.color}-500` : "border border-gray-400"
                }`}
              />
              <h3
                className={`text-md font-medium ${
                  selectedCategory === section.category ? "text-white" : "text-gray-400"
                }`}
              >
                {section.category}
              </h3>
            </div>

            {selectedCategory === section.category && (
              <div className="flex gap-2 mt-2">
                {section.topics.map((topic, idx) => (
                  <span
                    key={idx}
                    className={`px-3 py-1 rounded-full text-sm ${
                      section.completed ? "bg-green-600" : "bg-gray-700"
                    }`}
                  >
                    {topic}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Mock Test Results */}
      <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-800">
        <h2 className="text-lg font-semibold">Mock Test Results</h2>
        <div className="mt-4 h-40">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={testResults} layout="vertical">
              <XAxis type="number" hide />
              <YAxis dataKey="subject" type="category" width={80} />
              <Tooltip />
              <Bar dataKey="score" fill="limegreen" barSize={25} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-4 text-sm">
          {testResults.map((result, index) => (
            <div key={index} className="flex justify-between">
              <span>{result.subject}</span>
              <span className="text-gray-400">{result.score}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

// export function InterviewTips() {
//   const tips = [
//     "Research the company thoroughly",
//     "Practice common questions",
//     "Prepare your own questions",
//     "Follow up after interview",
//   ]

//   return (
//     <Card className="bg-zinc-900 border-zinc-800">
//       <CardHeader>
//         <CardTitle className="text-lg">Interview Tips</CardTitle>
//       </CardHeader>
//       <CardContent>
//         <ul className="space-y-2">
//           {tips.map((tip) => (
//             <li key={tip} className="flex items-center gap-2">
//               <span className="h-2 w-2 bg-green-500 rounded-full" />
//               <span className="text-sm text-zinc-300">{tip}</span>
//             </li>
//           ))}
//         </ul>
//       </CardContent>
//     </Card>
//   )
// }


