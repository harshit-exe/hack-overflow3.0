import { GroqForJob } from "./useGroqForJobs";

// Helper function to extract JSON from AI response
function extractJSONFromResponse(response) {
  try {
    // First attempt - try direct parsing
    return JSON.parse(response);
  } catch (error) {
    try {
      // Second attempt - try to find JSON within text response
<<<<<<< HEAD
=======
      // Look for content between square brackets (assuming array)
>>>>>>> main
      const jsonMatch = response.match(/\[.*\]/s);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }

<<<<<<< HEAD
      // If that fails, look for content between curly braces
=======
      // If that fails, look for content between curly braces (assuming object)
>>>>>>> main
      const objMatch = response.match(/\{.*\}/s);
      if (objMatch) {
        return JSON.parse(objMatch[0]);
      }

<<<<<<< HEAD
=======
      // If all extraction attempts fail, throw the original error
>>>>>>> main
      throw error;
    } catch (innerError) {
      console.error("Failed to extract JSON from response:", response);
      throw new Error("Invalid JSON response from API");
    }
  }
}

<<<<<<< HEAD
// 1. Get trending jobs - now generates data directly without requiring job data input
export async function getTrendingJobs(jobs = [], timeframe = "Last 30 days") {
=======
// 1. Get trending jobs
export async function getTrendingJobs(jobsData) {
>>>>>>> main
  const messages = [
    {
      role: "system",
      content:
<<<<<<< HEAD
        "You are a professional data analyst for the Indian IT job market with access to the latest industry research and trends. Your task is to provide accurate, data-driven insights about the current job market. Format your responses ONLY as clean JSON without any explanations, markdown, or text wrappers. Your data should mirror what leading job market platforms like LinkedIn, Naukri, and Indeed would report.",
=======
        "You are an AI assistant that analyzes job market data. Provide clear, concise analysis of job trends. IMPORTANT: Your response must be valid JSON - respond ONLY with a JSON array and nothing else.",
>>>>>>> main
    },
    {
      role: "user",
      content: `Generate accurate, research-backed data for the top 5 trending IT job roles in India for ${timeframe}. 

Format as a JSON array with objects containing: 
* "title" (specific job title that would appear on job boards)
* "openings" (precise number between 5000-50000 based on market size) 
* "reason" (concise, evidence-based explanation for the trend in 10-15 words)

The data must reflect actual 2025 Indian IT market conditions including:
- Current technology adoption cycles
- Recent industry disruptions
- Regional hiring patterns across major tech hubs
- Company expansion trends
- Actual in-demand skills

Return ONLY the JSON array.`,
    },
  ];

  try {
    console.log("Requesting trending jobs data from Groq...");
    const response = await GroqForJob(messages);
<<<<<<< HEAD
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
=======
    return extractJSONFromResponse(response);
  } catch (error) {
    console.error("Error getting trending jobs:", error);
    // Return fallback data instead of empty array to prevent UI issues
    return [
      { title: "Software Engineer", openings: 0, reason: "Data unavailable" },
>>>>>>> main
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
<<<<<<< HEAD
        "You are a senior compensation analyst specializing in the Indian IT sector with access to real-time salary benchmarking data across all major tech companies and startups. Your analysis incorporates data from industry salary surveys, offer letters, and company compensation bands. Provide ONLY clean JSON responses without any text explanations, markdown formatting, or code blocks. Your data should match what industry-leading compensation platforms like Levels.fyi, Glassdoor, and PayScale would report.",
=======
        "You are an AI assistant that analyzes salary data in the job market. Provide accurate salary forecasts. IMPORTANT: Your response must be valid JSON - respond ONLY with a JSON array and nothing else.",
>>>>>>> main
    },
    {
      role: "user",
      content: `Generate precise salary data for the top 4 highest-paying IT roles in India for 2025${
        jobFilter ? ` within the ${jobFilter} specialization` : ""
      }${
        experienceLevel && experienceLevel !== "Experience Level"
          ? ` for professionals with ${experienceLevel} experience`
          : ""
      }.

Format as a JSON array with objects containing:
* "title" (specific job title that matches actual job listings)
* "salary" (accurate salary range in LPA format like "25-35 LPA" based on current market rates)
* "trending" (boolean indicating if salaries are currently increasing based on market demand)

The data must reflect:
- Actual compensation trends in Bangalore, Hyderabad, Delhi NCR, Mumbai, and Pune
- Correct salary bands for MNCs vs Indian companies
- Recent salary inflation or corrections in the IT sector
- Experience-appropriate compensation structures
- Company size and funding stage adjustments

Return ONLY the JSON array.`,
    },
  ];

  try {
    console.log("Requesting salary forecast data from Groq...");
    const response = await GroqForJob(messages);
<<<<<<< HEAD
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
=======
    return extractJSONFromResponse(response);
  } catch (error) {
    console.error("Error getting salary forecasts:", error);
    // Return fallback data instead of empty array
    return [{ title: "IT Manager", salary: "0 LPA", trend: "unavailable" }];
>>>>>>> main
  }
}

// 3. Get in-demand skills - generates skill data based on job title filter
export async function getInDemandSkills(jobs = [], jobTitleFilter = "") {
  const messages = [
    {
      role: "system",
      content:
<<<<<<< HEAD
        "You are a technical skills analyst for the Indian IT recruitment industry with access to job board data, hiring trends, and technical screening requirements across the entire tech sector. Your insights are based on analysis of thousands of job descriptions, candidate screenings, and hiring manager requirements. Provide ONLY clean JSON responses without any text explanations, markdown formatting, or code blocks. Your data should match what leading skill assessment platforms like HackerRank, StackOverflow, and GitHub Trends would report.",
=======
        "You are an AI assistant that analyzes job skill requirements. Identify the most in-demand skills from job listings. IMPORTANT: Your response must be valid JSON - respond ONLY with a JSON array and nothing else.",
>>>>>>> main
    },
    {
      role: "user",
      content: `Generate precise skill demand data for the top 5 most required technical skills ${
        jobTitleFilter
          ? `for ${jobTitleFilter} positions in India`
          : "in the Indian tech sector for 2025"
      }.

Format as a JSON array with objects containing:
* "name" (specific technical skill or technology, not general categories)
* "rank" (integer 1-5 with 1 being highest demand)
* "demandScore" (precise percentage between 70-95 based on actual job requirement frequency)

The data must reflect:
- Actual technical requirements from recent job postings
- Version-specific framework and library demand (e.g., "React 18" not just "React")
- Industry-specific technology preferences
- Regional variations in skill requirements
- Emerging technologies with rapid adoption curves

${
  jobTitleFilter
    ? `For ${jobTitleFilter} positions, focus on the specific technical stack typically required for this role in Indian companies.`
    : ""
}

Return ONLY the JSON array.`,
    },
  ];

  try {
    console.log("Requesting in-demand skills data from Groq...");
    const response = await GroqForJob(messages);
<<<<<<< HEAD
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
=======
    return extractJSONFromResponse(response);
  } catch (error) {
    console.error("Error getting in-demand skills:", error);
    // Return fallback data instead of empty array
    return [{ skill: "Data unavailable", rank: 1 }];
>>>>>>> main
  }
}
