import { GroqForJob } from "./useGroqForJobs";

// Helper function to extract JSON from AI response
function extractJSONFromResponse(response) {
  try {
    // First attempt - try direct parsing
    return JSON.parse(response);
  } catch (error) {
    try {
      // Look for content between square brackets (assuming array)
      const jsonMatch = response.match(/\[.*\]/s);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }

      // If that fails, look for content between curly braces (assuming object)
      const objMatch = response.match(/\{.*\}/s);
      if (objMatch) {
        return JSON.parse(objMatch[0]);
      }

      // If all extraction attempts fail, throw the original error
      throw error;
    } catch (innerError) {
      console.error("Failed to extract JSON from response:", response);
      throw new Error("Invalid JSON response from API");
    }
  }
}

// 1. Get trending jobs - generates data based on timeframe with faster fallback
export async function getTrendingJobs(jobs = [], timeframe = "Last 30 days") {
  // Prepare fallback data first for immediate response if needed
  const fallbackData = [
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

  const messages = [
    {
      role: "system",
      content:
        "You are a professional data analyst for the Indian IT job market with access to the latest industry research and trends. Format your responses ONLY as clean JSON without any explanations, markdown, or text wrappers.",
    },
    {
      role: "user",
      content: `Generate accurate data for the top 5 trending IT job roles in India for ${timeframe}. 

Format as a JSON array with objects containing: 
* "title" (specific job title)
* "openings" (number between 5000-50000)
* "reason" (concise explanation in 10-15 words)

Return ONLY the JSON array.`,
    },
  ];

  // Set up a timeout to return fallback data if API is too slow
  const timeoutPromise = new Promise((resolve) => {
    setTimeout(() => resolve({ fallback: true, data: fallbackData }), 3000);
  });

  try {
    console.log("Requesting trending jobs data from Groq...");
    
    // Race between API call and timeout
    const apiPromise = GroqForJob(messages, 500).then(response => {
      return { fallback: false, data: extractJSONFromResponse(response) };
    });
    
    const result = await Promise.race([apiPromise, timeoutPromise]);
    
    if (result.fallback) {
      console.log("Using fallback data due to timeout");
    } else {
      console.log("Groq response received successfully");
    }
    
    return result.data;
  } catch (error) {
    console.error("Error getting trending jobs:", error);
    return fallbackData;
  }
}

// 2. Get salary forecasts - generates salary data based on selected filters with realistic ranges
export async function getSalaryForecasts(
  jobs = [],
  jobFilter = "",
  experienceLevel = ""
) {
  // Prepare realistic fallback data based on filters
  let fallbackData = [
    { title: "AI/ML Engineering Lead", salary: "45-65 LPA", trending: true },
    { title: "Cloud Security Architect", salary: "38-52 LPA", trending: true },
    { title: "DevOps Director", salary: "32-48 LPA", trending: false },
    { title: "Data Engineering Manager", salary: "30-45 LPA", trending: true },
  ];

  // Adjust for job filter if provided
  if (jobFilter === "Web") {
    fallbackData = [
      { title: "Senior Full Stack Architect", salary: "35-55 LPA", trending: true },
      { title: "Frontend Lead (React/Next.js)", salary: "30-45 LPA", trending: true },
      { title: "Backend Engineering Manager", salary: "32-48 LPA", trending: false },
      { title: "Web Performance Specialist", salary: "28-40 LPA", trending: true },
    ];
  } else if (jobFilter === "App") {
    fallbackData = [
      { title: "Mobile Engineering Director", salary: "40-60 LPA", trending: true },
      { title: "React Native Tech Lead", salary: "35-50 LPA", trending: true },
      { title: "iOS Engineering Lead", salary: "32-48 LPA", trending: false },
      { title: "Android Platform Architect", salary: "30-45 LPA", trending: true },
    ];
  }

  // Further adjust for experience with realistic salary ranges
  if (experienceLevel === "Fresher") {
    fallbackData = fallbackData.map((item) => ({
      ...item,
      title: item.title.replace(
        /(Lead|Director|Manager|Architect|Senior)/g,
        "Junior"
      ),
      salary: "3.5-8 LPA", // More realistic fresher salary range
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
  } else if (experienceLevel === "3-5 Years") {
    fallbackData = fallbackData.map((item) => ({
      ...item,
      title: item.title.replace(
        /(Director|Manager|Architect)/g,
        "Senior"
      ),
      salary: "15-25 LPA",
    }));
  }

  const messages = [
    {
      role: "system",
      content:
        "You are a compensation analyst for the Indian IT sector. Provide ONLY clean JSON responses without any explanations.",
    },
    {
      role: "user",
      content: `Generate salary data for the top 4 highest-paying IT roles in India for 2025${
        jobFilter ? ` within ${jobFilter}` : ""
      }${
        experienceLevel && experienceLevel !== "Experience Level"
          ? ` for ${experienceLevel} experience`
          : ""
      }.

Format as a JSON array with objects containing:
* "title" (job title)
* "salary" (salary range in LPA format like "25-35 LPA") 
* "trending" (boolean if salaries are increasing)

Return ONLY the JSON array.`,
    },
  ];

  // Set up a timeout to return fallback data if API is too slow
  const timeoutPromise = new Promise((resolve) => {
    setTimeout(() => resolve({ fallback: true, data: fallbackData }), 3000);
  });

  try {
    console.log("Requesting salary forecast data from Groq...");
    
    // Race between API call and timeout
    const apiPromise = GroqForJob(messages, 500).then(response => {
      return { fallback: false, data: extractJSONFromResponse(response) };
    });
    
    const result = await Promise.race([apiPromise, timeoutPromise]);
    
    if (result.fallback) {
      console.log("Using fallback salary data due to timeout");
    } else {
      console.log("Groq salary response received successfully");
    }
    
    return result.data;
  } catch (error) {
    console.error("Error getting salary forecasts:", error);
    return fallbackData;
  }
}

// 3. Get in-demand skills - generates skill data based on job title filter
export async function getInDemandSkills(jobs = [], jobTitleFilter = "") {
  // Prepare fallback data based on job title filter
  let fallbackData;
  
  if (jobTitleFilter.toLowerCase().includes("frontend") || jobTitleFilter.toLowerCase().includes("web")) {
    fallbackData = [
      { name: "React & Next.js", rank: 1, demandScore: 92 },
      { name: "TypeScript", rank: 2, demandScore: 89 },
      { name: "UI/UX Design Principles", rank: 3, demandScore: 85 },
      { name: "Web Performance Optimization", rank: 4, demandScore: 82 },
      { name: "GraphQL", rank: 5, demandScore: 78 },
    ];
  } else if (jobTitleFilter.toLowerCase().includes("backend")) {
    fallbackData = [
      { name: "Node.js/Express", rank: 1, demandScore: 90 },
      { name: "Microservices Architecture", rank: 2, demandScore: 88 },
      { name: "SQL & NoSQL Databases", rank: 3, demandScore: 85 },
      { name: "API Design & Development", rank: 4, demandScore: 82 },
      { name: "Cloud Infrastructure (AWS/Azure)", rank: 5, demandScore: 80 },
    ];
  } else if (jobTitleFilter.toLowerCase().includes("data")) {
    fallbackData = [
      { name: "Python for Data Science", rank: 1, demandScore: 93 },
      { name: "Data Warehousing & ETL", rank: 2, demandScore: 88 },
      { name: "SQL & Database Design", rank: 3, demandScore: 85 },
      { name: "Machine Learning Frameworks", rank: 4, demandScore: 83 },
      { name: "Data Visualization", rank: 5, demandScore: 79 },
    ];
  } else {
    fallbackData = [
      { name: "Large Language Model Engineering", rank: 1, demandScore: 92 },
      { name: "Cloud Architecture (Multi-cloud)", rank: 2, demandScore: 88 },
      { name: "Cybersecurity (Zero Trust)", rank: 3, demandScore: 85 },
      { name: "Data Engineering & Analytics", rank: 4, demandScore: 82 },
      { name: "DevSecOps", rank: 5, demandScore: 79 },
    ];
  }

  const messages = [
    {
      role: "system",
      content:
        "You are a technical skills analyst for the Indian IT recruitment industry. Provide ONLY clean JSON responses without any explanations.",
    },
    {
      role: "user",
      content: `Generate skill demand data for the top 5 most required technical skills ${
        jobTitleFilter
          ? `for ${jobTitleFilter} positions in India`
          : "in the Indian tech sector for 2025"
      }.

Format as a JSON array with objects containing:
* "name" (specific technical skill)
* "rank" (integer 1-5 with 1 being highest demand)
* "demandScore" (percentage between 70-95)

Return ONLY the JSON array.`,
    },
  ];

  // Set up a timeout to return fallback data if API is too slow
  const timeoutPromise = new Promise((resolve) => {
    setTimeout(() => resolve({ fallback: true, data: fallbackData }), 3000);
  });

  try {
    console.log("Requesting in-demand skills data from Groq...");
    
    // Race between API call and timeout
    const apiPromise = GroqForJob(messages, 500).then(response => {
      return { fallback: false, data: extractJSONFromResponse(response) };
    });
    
    const result = await Promise.race([apiPromise, timeoutPromise]);
    
    if (result.fallback) {
      console.log("Using fallback skills data due to timeout");
    } else {
      console.log("Groq skills response received successfully");
    }
    
    return result.data;
  } catch (error) {
    console.error("Error getting in-demand skills:", error);
    return fallbackData;
  }
}