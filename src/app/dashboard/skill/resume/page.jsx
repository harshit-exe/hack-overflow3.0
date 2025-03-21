'use client'

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import PixelCard from "@/components/pixel-card/pixel-card";

const Page = () => {
  return (
    <div className="flex justify-center items-center min-h-screen gap-6 flex-wrap p-6 ]">
      {/* Card Component */}
      {cardData.map(({ variant, href, title, description, emoji }, index) => (
        <motion.div
          key={index}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="relative"
        >
          <PixelCard
            variant={variant}
            className="shadow-xxl hover:shadow-2xl transition-shadow duration-300"
          >
            <div className="absolute text-white text-center px-4 font-mono">
              <Link href={href}>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="text-2xl font-bold mb-2 cursor-pointer hover:underline text-[#57FF31] px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
                  style={{ fontFamily: "Orbitron, sans-serif" }}
                >
                  {emoji} {title}
                </motion.button>
              </Link>
              <p className="text-sm opacity-80 text-gray-200 mt-2">{description}</p>
            </div>
          </PixelCard>
        </motion.div>
      ))}
    </div>
  );
};

const cardData = [
  {
    variant: "purple",
    href: "/dashboard/skill/resume/resume-builder",
    title: "Resume Builder",
    description: "🚀 Build a professional resume that stands out in seconds.",
    emoji: "📄",
  },
  {
    variant: "cyan",
    href: "/dashboard/skill/resume/cover-letter",
    title: "Cover Letter",
    description: "📝 Make a Cover Letter in One Click!",
    emoji: "✉️",
  },
  {
    variant: "orange",
    href: "/dashboard/skill/resume/project-recommender",
    title: "Project Recommender",
    description: "💡 Build real-world projects effortlessly!",
    emoji: "🔧",
  },
  {
    variant: "red",
    href: "/dashboard/skill/resume/blockchain",
    title: "Blockchain Resume",
    description: "🔗 Create a Blockchain-based resume for security & trust!",
    emoji: "🛡️",
  },
];

export default Page;
