"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Menu, ArrowRight, ArrowUpRight, Plus, Clock } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
// import './style.css'
export default function Dashboard() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const mentoringSessions = [
    { title: "System Design Interview", mentor: "David Kim", time: "2:00 PM Today", icon: "💻" },
    { title: "Algorithm Deep Dive", mentor: "Lisa Chen", time: "11:00 AM Tomorrow", icon: "🔍" },
    { title: "Frontend Architecture", mentor: "Mike Rose", time: "3:30 PM Monday", icon: "🎨" },
  ]

  const upcomingEvents = [
    {
      title: "Web3 Hackathon 2025",
      description: "Build the future of decentralized apps",
      date: "Feb 12-18, 2025",
      participants: 55,
    },
    { title: "AI Workshop", date: "Feb 10", participants: 35 },
    { title: "Code Review Session", date: "Feb 11", participants: 25 },
  ]

  const resumeItems = [
    { title: "Skills", completed: "12/15", editLink: "#" },
    { title: "Experience", completed: "3/13", editLink: "#" },
    { title: "Education", completed: "2/2", editLink: "#" },
  ]
  const handleVideoCall = () => {
    window.open("h", "_blank");
  };

  return (
    <div className="min-h-screen  text-white">
      {/* Header */}
  

      {/* Main Content */}
      <main className="px-6 py-8 space-y-8">
        <div className="space-y-2">
        </div>
        <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">
          Hello, Students Your Learning Dashboard
        </h1>
        <ArrowRight className="w-8 h-8 text-indigo-500" />
      </div>
      <p className="text-gray-400 mt-2">
        Track your progress and upcoming activities
      </p>

      {/* Virtual Classroom Card */}
      <div className="bg-indigo-600 rounded-3xl p-6 pb-0 mt-8 flex items-center">
        <div className="flex-1">
          <h2 className="text-2xl font-semibold">Virtual Classroom</h2>

          {/* Current Session */}
          <div className="bg-indigo-500 p-4 rounded-xl mt-4 mr-80">
            <p className="text-gray-300">Current Session</p>
            <p className="text-lg font-medium">Advanced JavaScript</p>
            <p className="text-sm text-gray-300">with Prof. Sarah Johnson</p>
          </div>

          {/* Participants */}
          <div className="bg-indigo-500 p-4 rounded-xl mt-4 mr-80 flex items-center space-x-2">
            <p className="text-gray-300">Participants</p>
            <div className="flex -space-x-2">
              <Image
                src="/Ellipse 4.png"
                alt="Participant"
                width={32}
                height={32}
                className="w-8 h-8 rounded-full border-2 border-white"
              />
              <Image
                src="/Ellipse 5.png"
                alt="Participant"
                width={32}
                height={32}
                className="w-8 h-8 rounded-full border-2 border-white"
              />
              <Image
                src="/Ellipse 6.png"
                alt="Participant"
                width={32}
                height={32}
                className="w-8 h-8 rounded-full border-2 border-white"
              />
              <span className="bg-gray-800 text-white text-sm w-8 h-8 flex items-center justify-center rounded-full border-2 border-white">
                +12
              </span>
            </div>
          </div>

          {/* Enter VR Classroom Button */}
          <button onClick={handleVideoCall} className="bg-black text-white flex items-center mt-3 mr-4 pb-1 pr-1 pl-4 pt-1 px-6 py-2 rounded-full">
            Enter VR Classroom 
            <div className="bg-[#57FF31] text-black p-1 pl-1 pr-1 ml-4 rounded-full">
            <ArrowUpRight className="ml-1 m-1" />
            </div>
          </button> 
    
        </div> 

        {/* VR Image */}
        <div className="hidden md:block -pt-8 -mt-6 -mr-6">
          <Image
            src="/Frame 63.png"
            alt="VR Learning"
            width={400}
            height={250}
            className="rounded-xl"
          />
        </div>
      </div>
      <br />
      <br />

        {/* Three Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Mentoring Sessions */}
          <div className="bg-[#191919] rounded-[24px] p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold">Mentoring Sessions</h3>
              <button className="bg-[#57FF31] rounded-full p-2 hover:bg-[#4ee029] transition-colors">
                <Plus className="w-4 h-4 text-black" />
              </button>
            </div>
            <div className="space-y-4">
              {mentoringSessions.map((session, index) => (
                <div key={index} className="flex items-center gap-4 p-3 hover:bg-white/5 rounded-lg transition-colors">
                  <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center text-lg">
                    {session.icon}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium">{session.title}</h4>
                    <p className="text-sm text-[#949494]">with {session.mentor}</p>
                  </div>
                  <div className="flex items-center text-sm text-[#949494]">
                    <Clock className="w-4 h-4 mr-1" />
                    {session.time}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming Events */}
          <div className="bg-[#191919] rounded-[24px] p-6">
            <h3 className="text-xl font-semibold mb-6">Upcoming Events</h3>
            <div className="space-y-4">
              {upcomingEvents.map((event, index) => (
                <div key={index} className="p-4 hover:bg-white/5 rounded-lg transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium">{event.title}</h4>
                    <ArrowUpRight className="w-4 h-4 text-[#57FF31]" />
                  </div>
                  {event.description && <p className="text-sm text-[#949494] mb-2">{event.description}</p>}
                  <div className="flex justify-between items-center text-sm text-[#949494]">
                    <span>{event.date}</span>
                    <span>{event.participants} participants</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Your Resume */}
          <div className="bg-[#191919] rounded-[24px] p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold">Your Resume</h3>
              <div className="w-12 h-12 rounded-full bg-[#6366F1] flex items-center justify-center text-sm font-medium">
                85%
              </div>
            </div>
            <div className="space-y-4">
              {resumeItems.map((item, index) => (
                <div key={index} className="flex justify-between items-center p-2">
                  <div>
                    <h4 className="font-medium">{item.title}</h4>
                    <p className="text-sm text-[#949494]">{item.completed} completed</p>
                  </div>
                  <Link href={item.editLink} className="text-[#6366F1] hover:text-[#5457cd] transition-colors">
                    Edit
                  </Link>
                </div>
              ))}
              <button className="w-full py-3 mt-4 border border-[#434343] rounded-lg hover:bg-white/5 transition-colors">
                Update Resume
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[#000000] text-white py-16 relative overflow-hidden">
        <div className="container mx-auto px-6 relative">
          {/* Decorative Elements */}
          <motion.div
            className="absolute left-[20%] top-0 w-32 h-12 bg-[#FAC3D3] rounded-full"
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 6, repeat: Number.POSITIVE_INFINITY }}
          />
          <motion.div
            className="absolute right-[20%] top-12 w-12 h-12 bg-[#FBDD3F] rounded-lg transform rotate-45"
            animate={{ rotate: [45, 60, 45] }}
            transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY }}
          />
          <motion.div
            className="absolute left-[30%] bottom-52 w-24 h-12 bg-[#9DDEF3] rounded-full flex items-center justify-center"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY }}
          >
            <div className="flex gap-1">
              <div className="w-2 h-2 bg-black rounded-full" />
              <div className="w-2 h-2 bg-black rounded-full" />
              <div className="w-2 h-2 bg-black rounded-full" />
            </div>
          </motion.div>

          {/* Main Content */}
          <div className="text-center mb-16 relative">
            <motion.div
              className="absolute right-1/4 -top-8 w-12 h-12 bg-white rounded-full flex items-center justify-center"
              animate={{ rotate: 360 }}
              transition={{ duration: 10, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
            >
              <ArrowRight className="w-6 h-6 text-black" />
            </motion.div>
            <h2 className="text-5xl font-bold leading-tight">
            From Villages 
            <br />
            to Metros,
            <br />
             One Path to Success
            </h2>
          </div>

          <div className="mt-28 grid grid-cols-1 md:grid-cols-3 gap-8 items-center mb-12">
            <div>
            <h1 className="logo">
            <span className="text-[#6366F1] ">D</span>
            ishaMarg
          </h1>
            </div>

            <nav className="flex flex-wrap justify-center gap-8">
              {["Our Programs", "Success Story", "Blog", "Contact"].map((item, index) => (
                <Link key={index} href="#" className="text-[#949494] hover:text-white transition-colors">
                  {item}
                </Link>
              ))}
            </nav>

            <div className="flex justify-center md:justify-end gap-4">
              <Link href="#" className="hover:text-[#6366F1] transition-colors">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
              </Link>
              <Link href="#" className="hover:text-[#6366F1] transition-colors">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </Link>
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-[#434343]">
            <p className="text-[#949494]">© DishaMarg 2025</p>
            <div className="flex gap-6 mt-4 md:mt-0">
              <Link href="#" className="text-[#949494] hover:text-white transition-colors">
                Privacy Policy
              </Link>
              <Link href="#" className="text-[#949494] hover:text-white transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

