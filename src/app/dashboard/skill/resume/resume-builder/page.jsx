import ResumeBuilder from "@/components/resume/resume-builder";

export default function Home() {
  return (
    <main className="min-h-screen">
      <div className="container mx-auto py-8">
        <h1 className="text-4xl font-bold text-white text-center mb-8 animate-fadeIn">
         <span className="text-[#57FF31]"> AI</span>-Powered{" "}
         Resume Builder
        </h1>
        <div className="bg-black rounded-xl shadow-lg p-6 animate-slideIn">
          <ResumeBuilder />
        </div>
      </div>
    </main>
  );
}
