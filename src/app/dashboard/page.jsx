"use client";
// import Sidebar from "../../components/Sidebar";
// import { DashboardHeader } from "../../components/header";
import { RecentActivity } from "@/components/dashboard/recent-activity";
import { InterviewTips } from "@/components/dashboard/interview-tips";
import { MockTestResults } from "@/components/dashboard/mock-test-results";
// import { DashboardFooter } from "../../components/footer";
import EmpowerSection from "@/components/dashboard/EmpowerSection";

export default function DashboardPage() {
  return (
    <div className="flex min-h-screen bg-black text-white">
      {/* <Sidebar /> */}
      <div className="flex-1 p-4 md:p-6">
        {/* <DashboardHeader /> */}
        <main className="max-w-7xl mx-auto space-y-6">
          <RecentActivity />
          <InterviewTips />
          <MockTestResults />
          <EmpowerSection />
        </main>
        {/* <DashboardFooter /> */}
      </div>
    </div>
  );
}
