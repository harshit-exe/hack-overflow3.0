import axios from "axios"
import * as cheerio from "cheerio"

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const platform = searchParams.get("platform")
  const url = searchParams.get("url")

  if (!url) {
    return new Response(JSON.stringify({ error: "URL is required" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    })
  }

  try {
    let courseData = {}

    // Different scraping logic based on platform
    if (platform === "udemy") {
      courseData = await scrapeUdemy(url)
    } else if (platform === "coursera") {
      courseData = await scrapeCoursera(url)
    } else if (platform === "edx") {
      courseData = await scrapeEdX(url)
    } else {
      // Generic scraping
      courseData = await scrapeGeneric(url)
    }

    return new Response(JSON.stringify(courseData), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    })
  } catch (error) {
    console.error("Error scraping course:", error)
    return new Response(JSON.stringify({ error: "Failed to scrape course data" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
}

async function scrapeUdemy(url) {
  try {
    const response = await axios.get(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
      },
    })

    const $ = cheerio.load(response.data)

    // Extract course data
    const title = $('h1[data-purpose="lead-title"]').text().trim()
    const instructor = $(".instructor-links a").first().text().trim()
    const rating = Number.parseFloat($(".rating-number").text().trim())
    const enrollments = $(".enrollment-number").text().trim()
    const price = $(".price-text__current").text().trim()

    // Extract course content
    const curriculum = []
    $(".curriculum-item-link").each((i, el) => {
      curriculum.push($(el).text().trim())
    })

    // Extract description
    const description = $('div[data-purpose="course-description"]').text().trim()

    return {
      title,
      instructor,
      rating,
      enrollments,
      price,
      curriculum,
      description,
      platform: "Udemy",
      url,
    }
  } catch (error) {
    console.error("Error scraping Udemy:", error)
    throw error
  }
}

async function scrapeCoursera(url) {
  // Similar implementation for Coursera
  // This would be implemented with specific selectors for Coursera's HTML structure
  return {
    title: "Coursera Course",
    platform: "Coursera",
    url,
  }
}

async function scrapeEdX(url) {
  // Similar implementation for edX
  // This would be implemented with specific selectors for edX's HTML structure
  return {
    title: "edX Course",
    platform: "edX",
    url,
  }
}

async function scrapeGeneric(url) {
  try {
    const response = await axios.get(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
      },
    })

    const $ = cheerio.load(response.data)

    // Generic extraction
    const title = $("title").text().trim()
    const description = $('meta[name="description"]').attr("content") || ""

    // Try to find course-related content
    const headings = []
    $("h1, h2, h3").each((i, el) => {
      headings.push($(el).text().trim())
    })

    // Look for pricing information
    const priceText = $("body")
      .text()
      .match(/(\$\d+(\.\d{2})?)|free/i)
    const price = priceText ? priceText[0] : "Unknown"

    return {
      title,
      description,
      headings,
      price,
      url,
    }
  } catch (error) {
    console.error("Error in generic scraping:", error)
    throw error
  }
}

