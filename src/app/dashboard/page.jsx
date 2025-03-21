"use client";

import { useState } from "react";
import { SalaryCard } from "@/components/dashboard/salarycard";
import { SkillsCard } from "@/components/dashboard/skillcard";
import { ResumeCard } from "@/components/dashboard/resumecard";
import { JobMarketTrends } from "@/components/dashboard/jobmarket";

export default function Home() {
  return (
    <main className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Pass empty array or remove jobs prop, since components will generate their own data */}
        <SalaryCard jobs={[]} />
        <SkillsCard jobs={[]} />
        <JobMarketTrends jobs={[]} />
        <ResumeCard />
      </div>
    </main>
  );
}
