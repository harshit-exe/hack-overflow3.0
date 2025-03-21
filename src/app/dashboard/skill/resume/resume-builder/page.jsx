import ResumeBuilder from "@/components/resume/resume-builder";


export default function Home() {
  return (
    <main className="min-h-screen bg-black">
      <div className="container mx-auto py-8">
        <h1 className="text-4xl font-bold text-blue-500 text-center mb-8 animate-fadeIn">AI-Powered Resume Builder</h1>
        <div className="bg-gray-900 rounded-xl shadow-lg p-6 animate-slideIn">
        <ResumeBuilder/>
        </div>
      </div>
    </main>
  )
}

