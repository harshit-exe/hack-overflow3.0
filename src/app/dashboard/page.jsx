'use client';

import { SalaryCard } from '@/components/dashboard/salarycard';
import { SkillsCard } from '@/components/dashboard/skillcard';
import { ResumeCard } from '@/components/dashboard/resumecard';
import { JobMarketTrends } from '@/components/dashboard/jobmarket';

export default function Home() {
  return (
    <main className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
        <SalaryCard />
        <SkillsCard />
        <JobMarketTrends />
        <ResumeCard />
      </div>
    </main>
  );
}