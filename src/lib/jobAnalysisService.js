// jobAnalysisService.js
import { GroqForJob } from "./useGroqForJobs";

// Helper function to extract JSON from AI response
function extractJSONFromResponse(response) {
  try {
    // First attempt - try direct parsing
    return JSON.parse(response);
  } catch (error) {
    try {
      // Second attempt - try to find JSON within text response
      const jsonMatch = response.match(/\[.*\]/s);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }

      // If that fails, look for content between curly braces
      const objMatch = response.match(/\{.*\}/s);
      if (objMatch) {
        return JSON.parse(objMatch[0]);
      }

      throw error;
    } catch (innerError) {
      console.error("Failed to extract JSON from response:", response);
      throw new Error("Invalid JSON response from API");
    }
  }
}

// 1. Get trending jobs - now generates data directly without requiring job data input
export async function getTrendingJobs(jobs = [], timeframe = "Last 30 days") {
  const messages = [
    {
      role: "system",
      content:
        "You are an AI assistant that provides realistic job market analysis data. IMPORTANT: Your response must be valid JSON - respond ONLY with a JSON array and nothing else.",
    },
    {
      role: "user",
      content: `Generate realistic data for the top 5 trending IT jobs in 2025, focusing on the ${timeframe} period. Return a JSON array where each object has: "title" (job title), "openings" (a realistic number between 1000-50000), and "reason" (a brief explanation of why it's trending). Make the data appropriate for the Indian job market.`,
    },
  ];

  try {
    console.log("Requesting trending jobs data from Groq...");
    const response = await GroqForJob(messages);
    console.log("Groq response received:", response.substring(0, 100) + "...");
    return extractJSONFromResponse(response);
  } catch (error) {
    console.error("Error getting trending jobs:", error);
    // Return fallback data
    return [
      {
        title: "AI Solutions Architect",
        openings: 34500,
        reason: "Rising demand for enterprise AI implementation",
      },
      {
        title: "Full Stack Developer",
        openings: 29800,
        reason: "Continued demand across all industries",
      },
      {
        title: "Cloud Security Specialist",
        openings: 22400,
        reason: "Critical for enterprise cloud adoption",
      },
      {
        title: "DevOps Engineer",
        openings: 19700,
        reason: "Automation focus in IT operations",
      },
      {
        title: "Data Engineer",
        openings: 16900,
        reason: "Growing need for data infrastructure",
      },
    ];
  }
}

// 2. Get salary forecasts - generates salary data based on selected filters
export async function getSalaryForecasts(
  jobs = [],
  jobFilter = "",
  experienceLevel = ""
) {
  const messages = [
    {
      role: "system",
      content:
        "You are an AI assistant that provides realistic salary data for the Indian IT job market. IMPORTANT: Your response must be valid JSON - respond ONLY with a JSON array and nothing else.",
    },
    {
      role: "user",
      content: `Generate realistic salary forecast data for the top 4 highest paying IT jobs in 2025${
        jobFilter ? ` focusing on ${jobFilter} related roles` : ""
      }${
        experienceLevel && experienceLevel !== "Experience Level"
          ? ` for professionals with ${experienceLevel} experience`
          : ""
      }. Return a JSON array where each object has: "title" (job title), "salary" (a realistic value in LPA format like "25-35 LPA"), "trending" (a boolean indicating if salary is trending up). Make the data realistic and relevant for the Indian job market in 2025.`,
    },
  ];

  try {
    console.log("Requesting salary forecast data from Groq...");
    const response = await GroqForJob(messages);
    console.log("Groq response received:", response.substring(0, 100) + "...");
    return extractJSONFromResponse(response);
  } catch (error) {
    console.error("Error getting salary forecasts:", error);
    // Return fallback data adjusted based on filters
    let fallbackData = [
      { title: "AI/ML Engineering Lead", salary: "45-65 LPA", trending: true },
      {
        title: "Cloud Security Architect",
        salary: "38-52 LPA",
        trending: true,
      },
      { title: "DevOps Director", salary: "32-48 LPA", trending: false },
      {
        title: "Data Engineering Manager",
        salary: "30-45 LPA",
        trending: true,
      },
    ];

    // Adjust for job filter if provided
    if (jobFilter === "Web") {
      fallbackData = [
        {
          title: "Senior Full Stack Architect",
          salary: "35-55 LPA",
          trending: true,
        },
        {
          title: "Frontend Lead (React/Next.js)",
          salary: "30-45 LPA",
          trending: true,
        },
        {
          title: "Backend Engineering Manager",
          salary: "32-48 LPA",
          trending: false,
        },
        {
          title: "Web Performance Specialist",
          salary: "28-40 LPA",
          trending: true,
        },
      ];
    } else if (jobFilter === "App") {
      fallbackData = [
        {
          title: "Mobile Engineering Director",
          salary: "40-60 LPA",
          trending: true,
        },
        {
          title: "React Native Tech Lead",
          salary: "35-50 LPA",
          trending: true,
        },
        { title: "iOS Engineering Lead", salary: "32-48 LPA", trending: false },
        {
          title: "Android Platform Architect",
          salary: "30-45 LPA",
          trending: true,
        },
      ];
    }

    // Further adjust for experience if needed
    if (experienceLevel === "Fresher") {
      fallbackData = fallbackData.map((item) => ({
        ...item,
        title: item.title.replace(
          /(Lead|Director|Manager|Architect|Senior)/g,
          "Junior"
        ),
        salary: "4-8 LPA",
      }));
    } else if (experienceLevel === "1-3 Years") {
      fallbackData = fallbackData.map((item) => ({
        ...item,
        title: item.title.replace(
          /(Director|Manager|Architect|Senior)/g,
          "Associate"
        ),
        salary: "8-15 LPA",
      }));
    }

    return fallbackData;
  }
}

// 3. Get in-demand skills - generates skill data based on job title filter
export async function getInDemandSkills(jobs = [], jobTitleFilter = "") {
  const messages = [
    {
      role: "system",
      content:
        "You are an AI assistant that analyzes in-demand skills in the tech industry. IMPORTANT: Your response must be valid JSON - respond ONLY with a JSON array and nothing else.",
    },
    {
      role: "user",
      content: `Generate realistic data for the top 5 most in-demand skills ${
        jobTitleFilter
          ? `for ${jobTitleFilter} positions`
          : "in the Indian tech industry for 2025"
      }. Return a JSON array where each object has: "name" (skill name), "rank" (1-5 with 1 being highest), and "demandScore" (a percentage between 70-95). Make the data realistic and market-relevant.`,
    },
  ];

  try {
    console.log("Requesting in-demand skills data from Groq...");
    const response = await GroqForJob(messages);
    console.log("Groq response received:", response.substring(0, 100) + "...");
    return extractJSONFromResponse(response);
  } catch (error) {
    console.error("Error getting in-demand skills:", error);
    // Return fallback data based on job title filter
    if (
      jobTitleFilter.toLowerCase().includes("frontend") ||
      jobTitleFilter.toLowerCase().includes("web")
    ) {
      return [
        { name: "React & Next.js", rank: 1, demandScore: 92 },
        { name: "TypeScript", rank: 2, demandScore: 89 },
        { name: "UI/UX Design Principles", rank: 3, demandScore: 85 },
        { name: "Web Performance Optimization", rank: 4, demandScore: 82 },
        { name: "GraphQL", rank: 5, demandScore: 78 },
      ];
    } else if (jobTitleFilter.toLowerCase().includes("backend")) {
      return [
        { name: "Node.js/Express", rank: 1, demandScore: 90 },
        { name: "Microservices Architecture", rank: 2, demandScore: 88 },
        { name: "SQL & NoSQL Databases", rank: 3, demandScore: 85 },
        { name: "API Design & Development", rank: 4, demandScore: 82 },
        { name: "Cloud Infrastructure (AWS/Azure)", rank: 5, demandScore: 80 },
      ];
    } else if (jobTitleFilter.toLowerCase().includes("data")) {
      return [
        { name: "Python for Data Science", rank: 1, demandScore: 93 },
        { name: "Data Warehousing & ETL", rank: 2, demandScore: 88 },
        { name: "SQL & Database Design", rank: 3, demandScore: 85 },
        { name: "Machine Learning Frameworks", rank: 4, demandScore: 83 },
        { name: "Data Visualization", rank: 5, demandScore: 79 },
      ];
    } else {
      return [
        { name: "Large Language Model Engineering", rank: 1, demandScore: 92 },
        { name: "Cloud Architecture (Multi-cloud)", rank: 2, demandScore: 88 },
        { name: "Cybersecurity (Zero Trust)", rank: 3, demandScore: 85 },
        { name: "Data Engineering & Analytics", rank: 4, demandScore: 82 },
        { name: "DevSecOps", rank: 5, demandScore: 79 },
      ];
    }
  }
}
