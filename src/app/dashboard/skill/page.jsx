import React from "react";
import Link from "next/link";
import PixelCard from "@/components/pixel-card/pixel-card";

const Page = () => {
  return (
    <div className="flex justify-center items-center min-h-screen gap-6 flex-wrap p-6">
      {/* Card 1 - Resume Builder */}
      <PixelCard variant="pink">
        <div className="absolute text-white text-center px-4 transition-transform transform hover:scale-105 hover:shadow-lg">
          <Link href="/dashboard/skill/resume">
            <h2 className="text-2xl font-bold mb-2 cursor-pointer hover:underline">
              📄 Resume Builder
            </h2>
          </Link>
          <p className="text-sm opacity-80">
            Build a professional resume that stands out in seconds.
          </p>
        </div>
      </PixelCard>

      {/* Card 2 - Preparation */}
      <PixelCard variant="blue">
        <div className="absolute text-white text-center px-4 transition-transform transform hover:scale-105 hover:shadow-lg">
          <Link href="/dashboard/skill/preparation">
            <h2 className="text-2xl font-bold mb-2 cursor-pointer hover:underline">
              📚 Preparation
            </h2>
          </Link>
          <p className="text-sm opacity-80">
            Get essential resources for interview and exam prep.
          </p>
        </div>
      </PixelCard>

      {/* Card 3 - Job Simulation */}
      <PixelCard variant="yellow">
        <div className="absolute text-white text-center px-4 transition-transform transform hover:scale-105 hover:shadow-lg">
          <Link href="/dashboard/skill/jobsimulation">
            <h2 className="text-2xl font-bold mb-2 cursor-pointer hover:underline">
              💼 Job Simulation
            </h2>
          </Link>
          <p className="text-sm opacity-80">
            Practice real-world job scenarios with mock simulations.
          </p>
        </div>
      </PixelCard>
    </div>
  );
};

export default Page;
