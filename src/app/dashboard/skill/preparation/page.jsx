import React from "react";
import Link from "next/link";
import PixelCard from "@/components/pixel-card/pixel-card";

const Page = () => {
  return (
    <div className="flex justify-center items-center min-h-screen gap-6 flex-wrap p-6">
      {/* Card 1 - Resume Builder */}
      <PixelCard variant="pink">
        <div className="absolute text-white text-center px-4">
          <Link href="/dashboard/skill/preparation/interview">
            <h2 className="text-2xl font-bold mb-2 cursor-pointer hover:underline">
             Mock Interview 
            </h2>
          </Link>
          <p className="text-sm opacity-80">
            Give Mock Interview To Ace In Your Path
          </p>
        </div>
      </PixelCard>

      {/* Card 2 - Preparation */}
      <PixelCard variant="blue">
        <div className="absolute text-white text-center px-4">
          <Link href="/dashboard/skill/preparation/mocktest">
            <h2 className="text-2xl font-bold mb-2 cursor-pointer hover:underline">
              Mocktest 
            </h2>
          </Link>
          <p className="text-sm opacity-80">
            Pratice mock test in one click
          </p>
        </div>
      </PixelCard>


    </div>
  );
};

export default Page;
