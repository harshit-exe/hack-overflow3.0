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

// 1. Get trending jobs
export async function getTrendingJobs(jobsData) {
  const messages = [
    {
      role: "system",
      content:
        "You are an AI assistant that analyzes job market data. Provide clear, concise analysis of job trends. IMPORTANT: Your response must be valid JSON - respond ONLY with a JSON array and nothing else.",
    },
    {
      role: "user",
      content: `Analyze the following job data and identify the top 5 most trending or in-demand job titles. Only return a JSON array with the 5 most common job titles, number of openings, and a brief reason why they're trending. Job data: ${JSON.stringify(
        jobsData
      )}`,
    },
  ];

  try {
    const response = await GroqForJob(messages);
    return extractJSONFromResponse(response);
  } catch (error) {
    console.error("Error getting trending jobs:", error);
    // Return fallback data instead of empty array to prevent UI issues
    return [
      { title: "Software Engineer", openings: 0, reason: "Data unavailable" },
    ];
  }
}

// 2. Get salary forecasts
export async function getSalaryForecasts(jobsData, filter = "") {
  const messages = [
    {
      role: "system",
      content:
        "You are an AI assistant that analyzes salary data in the job market. Provide accurate salary forecasts. IMPORTANT: Your response must be valid JSON - respond ONLY with a JSON array and nothing else.",
    },
    {
      role: "user",
      content: `Analyze the following job data and provide salary forecasts for the top 4 highest paying IT job titles. ${
        filter ? `Focus on ${filter} related roles.` : ""
      } For each job, return the title, annual salary in LPA (Lakhs Per Annum), and whether the salary is trending up or down. Return the data as a JSON array. Job data: ${JSON.stringify(
        jobsData
      )}`,
    },
  ];

  try {
    const response = await GroqForJob(messages);
    return extractJSONFromResponse(response);
  } catch (error) {
    console.error("Error getting salary forecasts:", error);
    // Return fallback data instead of empty array
    return [{ title: "IT Manager", salary: "0 LPA", trend: "unavailable" }];
  }
}

// 3. Get in-demand skills
export async function getInDemandSkills(jobsData, jobTitle = "") {
  const messages = [
    {
      role: "system",
      content:
        "You are an AI assistant that analyzes job skill requirements. Identify the most in-demand skills from job listings. IMPORTANT: Your response must be valid JSON - respond ONLY with a JSON array and nothing else.",
    },
    {
      role: "user",
      content: `Analyze the following job data and identify the top 5 most in-demand skills ${
        jobTitle ? `for ${jobTitle} positions` : "across all tech jobs"
      }. Return a JSON array containing each skill's name and rank (1-5). Job data: ${JSON.stringify(
        jobsData
      )}`,
    },
  ];

  try {
    const response = await GroqForJob(messages);
    return extractJSONFromResponse(response);
  } catch (error) {
    console.error("Error getting in-demand skills:", error);
    // Return fallback data instead of empty array
    return [{ skill: "Data unavailable", rank: 1 }];
  }
}
