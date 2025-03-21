import axios from "axios"
import * as cheerio from "cheerio"

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const url = searchParams.get("url")

  if (!url) {
    return new Response(JSON.stringify({ error: "URL is required" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    })
  }

  try {
    const response = await axios.get(url, { timeout: 30000 }) // 30 seconds timeout
    const $ = cheerio.load(response.data)

    // Remove script tags, style tags, and comments
    $("script, style, comment").remove()

    const content = {
      title: $("title").text(),
      description: $('meta[name="description"]').attr("content") || "",
      headings:  { level, text },
      paragraphs: [] ,
      lists: { type, items },
    }

    // Extract main content
    $("h1, h2, h3, h4, h5, h6, p, ul, ol").each((i, el) => {
      const tagName = $(el).prop("tagName").toLowerCase()
      const text = $(el).text().trim()

      if (tagName.startsWith("h")) {
        content.headings.push({ level: tagName, text })
      } else if (tagName === "p") {
        content.paragraphs.push(text)
      } else if (tagName === "ul" || tagName === "ol") {
        const items = $(el)
          .find("li")
          .map((i, li) => $(li).text().trim())
          .get()
        content.lists.push({ type: tagName, items })
      }
    })

    // Extract specific career-related information
    const careerInfo = {
      jobTitle: $('h1:contains("Job Title"), h2:contains("Job Title")').first().text().trim(),
      responsibilities: $('h3:contains("Responsibilities"), h3:contains("Duties")')
        .next("ul")
        .find("li")
        .map((i, el) => $(el).text().trim())
        .get(),
      qualifications: $('h3:contains("Qualifications"), h3:contains("Requirements")')
        .next("ul")
        .find("li")
        .map((i, el) => $(el).text().trim())
        .get(),
      skills: $('h3:contains("Skills")')
        .next("ul")
        .find("li")
        .map((i, el) => $(el).text().trim())
        .get(),
    }

    // Combine general content with career-specific information
    const scrapedData = {
      ...content,
      careerInfo,
    }

    return new Response(JSON.stringify(scrapedData), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    })
  } catch (error) {
    console.error("Error scraping website:", error)
    let errorMessage = "Failed to scrape website content"
    if (error.code === "ECONNABORTED") {
      errorMessage = "Request timed out. The website might be slow or unavailable."
    } else if (error.response) {
      errorMessage = `Server responded with status ${error.response.status}`
    }
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
}

