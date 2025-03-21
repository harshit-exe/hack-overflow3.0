"use client";

import { useState, useEffect } from "react";
import { SalaryCard } from "@/components/dashboard/salarycard";
import { SkillsCard } from "@/components/dashboard/skillcard";
import { ResumeCard } from "@/components/dashboard/resumecard";
import { JobMarketTrends } from "@/components/dashboard/jobmarket";

export default function Home() {
  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchJobs = async () => {
      setIsLoading(true);
      try {
        const params = new URLSearchParams({
          query: "IT jobs",
          limit: "10",
          page: "1",
          num_pages: "1",
          country: "in",
          language: "en",
        });

        const fullUrl = `${apiURL}/api/jobs/getMergedTrendingJobs?${params.toString()}`;
        console.log("Fetching from:", fullUrl);

        const res = await fetch(fullUrl, {
          method: "GET",
        });

        if (!res.ok) {
          toast.error("Unable to fetch");
        }

        const data = await res.json();
        setJobs(data.data);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching jobs:", error);
        setIsLoading(false);
      }
    };

    fetchJobs();
  }, []);

  return (
    <main className="min-h-screen p-8">
      {isLoading ? (
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
          <SalaryCard jobs={jobs} />
          <SkillsCard jobs={jobs} />
          <JobMarketTrends jobs={jobs} />
          <ResumeCard />
        </div>
      )}
    </main>
  );
}
