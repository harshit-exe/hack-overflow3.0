"use client";
import { RecentActivity } from "@/components/dashboard/recent-activity";
import { InterviewTips } from "@/components/dashboard/interview-tips";
import { MockTestResults } from "@/components/dashboard/mock-test-results";
import EmpowerSection from "@/components/dashboard/EmpowerSection";

export default function DashboardPage() {
  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-black text-white">
      <div className="flex-1 p-4 md:p-6 w-full max-w-7xl mx-auto space-y-6">
        <RecentActivity />
        <InterviewTips />
        <MockTestResults />
        <EmpowerSection />
      </div>
    </div>
  );
}
