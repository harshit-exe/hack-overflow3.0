import Image from "next/image"
import { Code2, Palette, LineChart, Users, Database, UsersRound, Play } from "lucide-react"
import Link from "next/link"

const JobCard = ({ icon, title, level }) => (
  <div className="relative group bg-[#1A1A1A] rounded-xl p-4 transition-all duration-300 hover:bg-[#242424] cursor-pointer overflow-hidden">
    <div className="absolute inset-0 bg-[#3FFF3F]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    <div className="relative">
      <div className="absolute -inset-1 bg-[#3FFF3F]/20 blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <div className="relative">{icon}</div>
    </div>
    <h3 className="font-semibold text-white mt-3 text-base">{title}</h3>
    <p className="text-[#666666] text-xs mt-1">{level}</p>
  </div>
)

export default function JobSimulation() {
  const jobRoles = [
    { title: "Corporate Samulation", level: "Advanced", icon: <Code2 className="w-6 h-6 text-[#3FFF3F]" /> },
    { title: "UI/UX Designer", level: "Intermediate", icon: <Palette className="w-6 h-6 text-[#3FFF3F]" /> },
    { title: "Digital Marketer", level: "Beginner", icon: <LineChart className="w-6 h-6 text-[#3FFF3F]" /> },
    { title: "HR Manager", level: "Intermediate", icon: <Users className="w-6 h-6 text-[#3FFF3F]" /> },
    { title: "Data Scientist", level: "Advanced", icon: <Database className="w-6 h-6 text-[#3FFF3F]" /> },
    { title: "Project Manager", level: "Intermediate", icon: <UsersRound className="w-6 h-6 text-[#3FFF3F]" /> },
  ]
  return (
    <div className="overflow-hidden min-h-screen bg-black text-white p-2">
      <h1 className="text-4xl font-bold mb-6 animate-fade-in">Jobs Simulation</h1>

      <h2 className="text-2xl font-semibold mb-6 animate-fade-in-up">Choose Your Role</h2>

      <div className="grid grid-cols-3 gap-2">
        {/* Job roles grid */}
        <div className="col-span-1 grid grid-cols-2 gap-1">
          {jobRoles.map((role, index) => (
            <div key={role.title} className="animate-fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
              <JobCard {...role} />
            </div>
          ))}
        </div>

        {/* Featured simulation preview */}
        <div className="relative rounded-xl overflow-hidden group animate-fade-in-up w-[55vw]">
          <img
            src="/VR.jpeg"
            alt="VR Simulation Preview"
            width={600}
            height={400}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent">
            <div className="absolute bottom-0 left-0 right-0 p-6 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
              <h3 className="text-2xl font-bold mb-2">Corporate Simulation</h3>
              <p className="text-zinc-300 text-sm mb-4">Advanced Development Environment</p>
              <Link href="h" target="_blank" className="bg-[#4F46E5] hover:bg-[#4338CA] text-white px-4 py-2 ml-80 mr-60 pl-4 rounded-lg text-sm font-medium transition-all duration-300 flex items-center gap-2 ">
                <Play className=" w-4 h-4 transform group-hover/btn:scale-110 transition-transform duration-300" />
                Enter In Virtual Simulation
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom section */}
      <div className="text-center mt-16 space-y-4 animate-fade-in-up">
        <h2 className="text-4xl font-bold flex items-center justify-center gap-2">
          Step Into the <span className="text-[#3FFF3F]">Job</span>
          <div className="w-6 h-6 bg-[#4F46E5] rounded-sm rotate-45 animate-pulse" />
        </h2>
        <p className="text-2xl text-zinc-200">Experience the Role</p>
      </div>
    </div>
  )
}

