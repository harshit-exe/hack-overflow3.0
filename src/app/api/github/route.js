import { NextResponse } from "next/server"
import * as cheerio from "cheerio"

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const username = searchParams.get("username")

  if (!username) {
    return NextResponse.json({ error: "Username is required" }, { status: 400 })
  }

  try {
    // Fetch user profile
    const profileResponse = await fetch(`https://api.github.com/users/${username}`, {
      headers: {
        Accept: "application/vnd.github.v3+json",
        "User-Agent": "Resume-Builder-App",
      },
    })

    if (!profileResponse.ok) {
      throw new Error(`GitHub API error: ${profileResponse.status}`)
    }

    const profile = await profileResponse.json()

    // Fetch repositories with more details
    const reposResponse = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=10`, {
      headers: {
        Accept: "application/vnd.github.v3+json",
        "User-Agent": "Resume-Builder-App",
      },
    })

    if (!reposResponse.ok) {
      throw new Error(`GitHub API error: ${reposResponse.status}`)
    }

    const repos = await reposResponse.json()

    // Try to enhance profile data by scraping GitHub profile page
    const enhancedProfile = { ...profile }
    try {
      const profilePageResponse = await fetch(`https://github.com/${username}`)
      if (profilePageResponse.ok) {
        const html = await profilePageResponse.text()
        const $ = cheerio.load(html)

        // Try to extract additional data
        const email = $(".js-profile-editable-area .octicon-mail").parent().text().trim() || profile.email
        const location = $(".js-profile-editable-area .octicon-location").parent().text().trim() || profile.location
        const website = $(".js-profile-editable-area .octicon-link").parent().text().trim() || profile.blog
        const organization =
          $(".js-profile-editable-area .octicon-organization").parent().text().trim() || profile.company

        if (email) enhancedProfile.email = email
        if (location) enhancedProfile.location = location
        if (website) enhancedProfile.website = website
        if (organization) enhancedProfile.company = organization
      }
    } catch (scrapingError) {
      console.error("Error scraping GitHub profile page:", scrapingError)
    }

    // Fetch languages for each repo with percentage calculations
    const reposWithLanguages = await Promise.all(
      repos.slice(0, 10).map(async (repo) => {
        if (!repo.languages_url) return repo

        try {
          // Fetch languages from GitHub API
          const langResponse = await fetch(repo.languages_url, {
            headers: {
              Accept: "application/vnd.github.v3+json",
              "User-Agent": "Resume-Builder-App",
            },
          })

          if (langResponse.ok) {
            const languages = await langResponse.json()
            const totalBytes = Object.values(languages).reduce((sum, bytes) => sum + bytes, 0)

            const languagePercentages = Object.entries(languages).map(([name, bytes]) => ({
              name,
              percentage: Math.round((bytes / totalBytes) * 100),
            }))

            return {
              ...repo,
              languageDetails: languagePercentages,
            }
          }
        } catch (error) {
          console.error(`Error fetching languages for ${repo.name}:`, error)
        }

        return repo
      }),
    )

    // Extract all languages from repos with percentages
    const languagesMap = new Map()

    reposWithLanguages.forEach((repo) => {
      if (repo.languageDetails) {
        repo.languageDetails.forEach((lang) => {
          const current = languagesMap.get(lang.name) || 0
          languagesMap.set(lang.name, current + lang.percentage)
        })
      } else if (repo.language) {
        const current = languagesMap.get(repo.language) || 0
        languagesMap.set(repo.language, current + 1)
      }
    })

    // Normalize language percentages
    const totalPoints = Array.from(languagesMap.values()).reduce((sum, val) => sum + val, 0)
    const languages = Array.from(languagesMap.entries()).map(([name, points]) => ({
      name,
      percentage: Math.round((points / totalPoints) * 100),
    }))

    // Try to fetch additional repo data
    const enhancedRepos = await Promise.all(
      reposWithLanguages.map(async (repo) => {
        try {
          // Try to get more details from repo page
          const repoPageResponse = await fetch(`https://github.com/${username}/${repo.name}`)

          if (repoPageResponse.ok) {
            const html = await repoPageResponse.text()
            const $ = cheerio.load(html)

            // Try to extract topics/tags
            const topics = []
            $(".topic-tag").each((i, el) => {
              topics.push($(el).text().trim())
            })

            // Extract description if not present
            let enhancedDescription = repo.description
            if (!enhancedDescription) {
              enhancedDescription = $('span[itemprop="about"]').text().trim()
            }

            return {
              ...repo,
              description: enhancedDescription || repo.description,
              topics: topics.length > 0 ? topics : repo.topics || [],
            }
          }
        } catch (error) {
          console.error(`Error enhancing repo ${repo.name}:`, error)
        }

        return repo
      }),
    )

    // Format the response
    return NextResponse.json({
      profile: {
        name: enhancedProfile.name || username,
        bio: enhancedProfile.bio,
        location: enhancedProfile.location,
        company: enhancedProfile.company,
        blog: enhancedProfile.blog,
        email: enhancedProfile.email,
        avatar_url: enhancedProfile.avatar_url,
        followers: enhancedProfile.followers,
        following: enhancedProfile.following,
        public_repos: enhancedProfile.public_repos,
        public_gists: enhancedProfile.public_gists,
        created_at: enhancedProfile.created_at,
      },
      repos: enhancedRepos.map((repo) => ({
        id: repo.id,
        name: repo.name,
        description: repo.description,
        html_url: repo.html_url,
        language: repo.language,
        stargazers_count: repo.stargazers_count,
        forks_count: repo.forks_count,
        watchers_count: repo.watchers_count,
        open_issues_count: repo.open_issues_count,
        created_at: repo.created_at,
        updated_at: repo.updated_at,
        languageDetails: repo.languageDetails || [],
        topics: repo.topics || [],
      })),
      languages: languages,
    })
  } catch (error) {
    console.error("Error fetching GitHub data:", error)

    // Create mock data in case of API failure
    const mockData = {
      profile: {
        name: username,
        bio: "GitHub profile information unavailable.",
        location: null,
        company: null,
        blog: null,
        avatar_url: `https://avatars.githubusercontent.com/u/0?v=4`,
        followers: 0,
        following: 0,
        public_repos: 0,
        created_at: new Date().toISOString(),
      },
      repos: [],
      languages: [],
    }

    return NextResponse.json(mockData)
  }
}

