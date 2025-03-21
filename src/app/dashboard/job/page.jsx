import React from "react";
import Link from "next/link";
import PixelCard from "@/components/pixel-card/pixel-card";

const Page = () => {
  return (
    <div className="flex justify-center items-center min-h-screen gap-6 flex-wrap p-6">
      {/* Card 1 - Resume Builder */}
      <PixelCard variant="pink">
        <div className="absolute text-white text-center px-4">
          <Link href="/dashboard/trend">
            <h2 className="text-2xl font-bold mb-2 cursor-pointer hover:underline">
            Trend and Salary
            </h2>
          </Link>
          <p className="text-sm opacity-80">
          Explore latest industry trends and salary insights.
          </p>
        </div>
      </PixelCard>

      {/* Card 2 - Preparation */}
      <PixelCard variant="blue">
        <div className="absolute text-white text-center px-4">
          <Link href="/dashboard/job-openings">
            <h2 className="text-2xl font-bold mb-2 cursor-pointer hover:underline">
            Job Opening
            </h2>
          </Link>
          <p className="text-sm opacity-80">
          Find job opportunities matching your skills and goals.

          </p>
        </div>
      </PixelCard>

      {/* Card 3 - Job Simulation */}
      <PixelCard variant="yellow">
        <div className="absolute text-white text-center px-4">
          <Link href="/dashboard/events">
            <h2 className="text-2xl font-bold mb-2 cursor-pointer hover:underline">
            Events and Updates
            </h2>
          </Link>
          <p className="text-sm opacity-80">
          Stay updated with job fairs, webinars & career events.
          </p>
        </div>
      </PixelCard>
    </div>
  );
};

export default Page;
