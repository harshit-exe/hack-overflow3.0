// jobAnalysisService.js
import { GroqForJob } from "./useGroqForJobs";

// 1. Get trending jobs
export async function getTrendingJobs(jobsData) {
  const messages = [
    {
      role: "system",
      content:
        "You are an AI assistant that analyzes job market data. Provide clear, concise analysis of job trends.",
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
    // Parse the JSON from the response text
    return JSON.parse(response);
  } catch (error) {
    console.error("Error getting trending jobs:", error);
    return [];
  }
}

// 2. Get salary forecasts
export async function getSalaryForecasts(jobsData, filter = "") {
  const messages = [
    {
      role: "system",
      content:
        "You are an AI assistant that analyzes salary data in the job market. Provide accurate salary forecasts.",
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
    // Parse the JSON from the response text
    return JSON.parse(response);
  } catch (error) {
    console.error("Error getting salary forecasts:", error);
    return [];
  }
}

// 3. Get in-demand skills
export async function getInDemandSkills(jobsData, jobTitle = "") {
  const messages = [
    {
      role: "system",
      content:
        "You are an AI assistant that analyzes job skill requirements. Identify the most in-demand skills from job listings.",
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
    // Parse the JSON from the response text
    return JSON.parse(response);
  } catch (error) {
    console.error("Error getting in-demand skills:", error);
    return [];
  }
}
