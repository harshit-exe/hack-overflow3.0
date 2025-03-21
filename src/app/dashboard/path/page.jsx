import React from "react";
import Link from "next/link";
import PixelCard from "@/components/pixel-card/pixel-card";

const Page = () => {
  return (
    <div className="flex justify-center items-center min-h-screen gap-6 flex-wrap p-6">
      {/* Card 1 - Virtual Mentor */}
      <PixelCard variant="pink">
        <div className="absolute text-white text-center px-4">
          <Link href="/dashboard/mentor">
            <h2 className="text-2xl font-bold mb-2 cursor-pointer hover:text-gray-300 transition duration-200">
              Virtual Mentor
            </h2>
          </Link>
          <p className="text-sm opacity-80">
            Get guidance from an AI-powered virtual career mentor anytime.
          </p>
        </div>
      </PixelCard>

      {/* Card 2 - AI Generated Roadmap */}
      <PixelCard variant="blue">
        <div className="absolute text-white text-center px-4">
          <Link href="/dashboard/path/roadmap">
            <h2 className="text-2xl font-bold mb-2 cursor-pointer hover:text-gray-300 transition duration-200">
              AI Generated Roadmap
            </h2>
          </Link>
          <p className="text-sm opacity-80">
            Personalized learning roadmap designed for your career goals.
          </p>
        </div>
      </PixelCard>

      {/* Card 3 - AI Powered Course Recommender */}
      <PixelCard variant="yellow">
        <div className="absolute text-white text-center px-4">
          <Link href="/dashboard/path/course-recommender">
            <h2 className="text-2xl font-bold mb-2 cursor-pointer hover:text-gray-300 transition duration-200">
              AI Powered Course Recommender
            </h2>
          </Link>
          <p className="text-sm opacity-80">
            Smart suggestions for best-fit courses based on your interests.
          </p>
        </div>
      </PixelCard>
    </div>
  );
};

export default Page;
