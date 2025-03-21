import React from "react";
import Link from "next/link";
import PixelCard from "@/components/pixel-card/pixel-card";

const Page = () => {
  return (
    <div className="flex justify-center items-center min-h-screen gap-6 flex-wrap p-6">
      {/* Card 1 - Resume Builder */}
      <PixelCard variant="pink">
        <div className="absolute text-white text-center px-4">
          <Link href="/dashboard/skill/resume/resume-builder">
            <h2 className="text-2xl font-bold mb-2 cursor-pointer hover:underline">
            📄 Resume Builder
            </h2>
          </Link>
          <p className="text-sm opacity-80">
          🚀 Build a professional resume that stands out in seconds.
          </p>
        </div>
      </PixelCard>

      {/* Card 2 - Preparation */}
      <PixelCard variant="blue">
        <div className="absolute text-white text-center px-4">
          <Link href="/dashboard/skill/resume/cover-letter">
            <h2 className="text-2xl font-bold mb-2 cursor-pointer hover:underline">
            📝 Cover Letter 
            </h2>
          </Link>
          <p className="text-sm opacity-80">
          ✉️ Make Cover Letter In One Click
          </p>
        </div>
      </PixelCard>

      {/* Card 3 - Job Simulation */}
      <PixelCard variant="yellow">
        <div className="absolute text-white text-center px-4">
          <Link href="/dashboard/skill/resume/project-recommender">
            <h2 className="text-2xl font-bold mb-2 cursor-pointer hover:underline">
            💡 Project Recommender
            </h2>
          </Link>
          <p className="text-sm opacity-80">
          🔧 Bulid real-world project
          </p>
        </div>
      </PixelCard>
      {/* Card 4 - Job Simulation */}
      <PixelCard variant="green">
        <div className="absolute text-white text-center px-4">
          <Link href="/dashboard/blockchain-verify">
            <h2 className="text-2xl font-bold mb-2 cursor-pointer hover:underline">
            🔗 Blockchain
            </h2>
          </Link>
          <p className="text-sm opacity-80">
          🛡️ Blockchian based Resume
          </p>
        </div>
      </PixelCard>
    </div>
  );
};

export default Page;
