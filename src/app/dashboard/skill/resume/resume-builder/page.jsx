import ResumeBuilder from "@/components/resume/resume-builder";


export default function Home() {
  return (
    <main className="min-h-screen">
      <div className="container mx-auto py-8">
        <h1 className="text-4xl font-bold text-blue-500 text-center mb-8 animate-fadeIn"><span className="text-[#57FF31]">AI</span>-Powered <span className="text-white"> Resume Builder</span></h1>
        <div className="bg-gray-900 rounded-xl shadow-lg p-6 animate-slideIn">
        <ResumeBuilder/>
        </div>
      </div>
    </main>
  )
}

