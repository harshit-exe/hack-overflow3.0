import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Edit, Plus, ArrowRight, ArrowUpRight } from "lucide-react";

export function RecentActivity() {
  return (
    <section className="bg-black text-white p-10">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">
          Hello, Students YourLearning Dashboard
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
                src="/Ellipse 4.jpg"
                alt="Participant"
                width={32}
                height={32}
                className="w-8 h-8 rounded-full border-2 border-white"
              />
              <Image
                src="/Ellipse 5.jpg"
                alt="Participant"
                width={32}
                height={32}
                className="w-8 h-8 rounded-full border-2 border-white"
              />
              <Image
                src="/Ellipse 6.jpg"
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
          <button className="bg-black text-white flex items-center mt-4 mr-5 pt-0 pb-0 mb-2 pr-0 px-6 py-2 rounded-full">
            Enter VR Classroom 
            <div className="bg-green-500 text-black p-1 pl-1 pr-1 ml-4 rounded-full">
            <ArrowUpRight className="ml-1 m-1" />
            </div>
          </button> 
    
        </div> 

        {/* VR Image */}
        <div className="hidden md:block -pt-8 -mt-6 -mr-6">
          <Image
            src="/image.png"
            alt="VR Learning"
            width={400}
            height={250}
            className="rounded-xl"
          />
        </div>
      </div>
      <br />
      <br />
      <section className="grid md:grid-cols-3 gap-6 p-6 bg-black text-white">
        {/* Mentoring Sessions */}
        <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-800">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">Mentoring Sessions</h2>
            <button className="bg-green-500 text-black p-2 rounded-full">
              <Plus size={16} />
            </button>
          </div>

          <div className="mt-4 space-y-4">
            {[
              {
                title: "System Design Interview",
                mentor: "David Kim",
                time: "2:00 PM Today",
              },
              {
                title: "Algorithm Deep Dive",
                mentor: "Lisa Chen",
                time: "11:00 AM Tomorrow",
              },
              {
                title: "Frontend Architecture",
                mentor: "Mike Ross",
                time: "3:30 PM Monday",
              },
            ].map((session, index) => (
              <div key={index} className="flex items-center space-x-4">
                <div className="bg-indigo-600 p-2 rounded-lg">🖥️</div>
                <div>
                  <p className="text-sm font-medium">{session.title}</p>
                  <p className="text-xs text-gray-400">with {session.mentor}</p>
                  <p className="text-xs text-gray-500">{session.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Events */}
        <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-800">
          <h2 className="text-lg font-semibold">Upcoming Events</h2>

          <div className="mt-4 space-y-4">
            <div className="bg-zinc-800 p-4 rounded-lg flex justify-between items-center">
              <div>
                <p className="text-sm font-medium">Web3 Hackathon 2025</p>
                <p className="text-xs text-gray-400">
                  Build the future of decentralized apps
                </p>
                <p className="text-xs text-gray-500">Feb 12-18, 2025</p>
              </div>
              <button className="bg-green-500 text-black p-2 rounded-full">
                <ArrowUpRight size={16} />
              </button>
            </div>

            <div className="flex justify-between text-sm text-gray-400">
              <p>AI Workshop</p>
              <span>Feb 10</span>
            </div>
            <div className="flex justify-between text-sm text-gray-400">
              <p>Code Review Session</p>
              <span>Feb 11</span>
            </div>
          </div>
        </div>

        {/* Your Resume */}
        <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-800">
          <h2 className="text-lg font-semibold">Your Resume</h2>
          <div className="relative w-16 h-16 mx-auto my-4">
            <div className="absolute inset-0 flex items-center justify-center text-lg font-bold text-blue-400">
              85%
            </div>
          </div>

          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <p>Skills</p>
              <p className="text-gray-400">12/15 completed</p>
              <button className="text-blue-400 text-xs">Edit</button>
            </div>
            <div className="flex justify-between">
              <p>Experience</p>
              <p className="text-gray-400">3/13 completed</p>
              <button className="text-blue-400 text-xs">Edit</button>
            </div>
            <div className="flex justify-between">
              <p>Education</p>
              <p className="text-gray-400">2/2 completed</p>
              <button className="text-blue-400 text-xs">Edit</button>
            </div>
          </div>

          <button className="mt-4 w-full py-2 bg-gray-800 text-white rounded-lg border border-gray-700">
            Update Resume
          </button>
        </div>
      </section>
    </section>
  );
}
