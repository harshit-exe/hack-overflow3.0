export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get("query")

  if (!query) {
    return new Response(JSON.stringify({ error: "Search query is required" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    })
  }

  try {
    // In a real implementation, you would scrape multiple platforms
    // For now, we'll generate mock data based on the query
    const courses = await generateMockCourses(query)

    return new Response(JSON.stringify({ courses }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    })
  } catch (error) {
    console.error("Error searching courses:", error)
    return new Response(JSON.stringify({ error: "Failed to search courses" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
}

// This function simulates scraping course data
// In a real implementation, you would scrape actual websites
async function generateMockCourses(query) {
  // Normalize query for better matching
  const normalizedQuery = query.toLowerCase()

  // Generate a deterministic but seemingly random number based on string
  const hashCode = (str) => {
    let hash = 0
    for (let i = 0; i < str.length; i++) {
      hash = (hash << 5) - hash + str.charCodeAt(i)
      hash |= 0
    }
    return Math.abs(hash)
  }

  const queryHash = hashCode(normalizedQuery)
  const numCourses = 6 + (queryHash % 6) // 6-11 courses

  // Course templates with variations
  const courseTemplates = [
    {
      platform: "Udemy",
      priceRange: [0, 19.99, 29.99, 49.99],
      ratingRange: [3.5, 5.0],
      enrollmentsRange: [1000, 500000],
      durationRange: ["2-4 hours", "5-10 hours", "10+ hours"],
      levels: ["Beginner", "Intermediate", "Advanced", "All Levels"],
      imageUrls: [
        "https://img-c.udemycdn.com/course/240x135/1565838_e54e_16.jpg",
        "https://img-c.udemycdn.com/course/240x135/2196488_8fc7_10.jpg",
        "https://img-c.udemycdn.com/course/240x135/3613504_e0e8_3.jpg",
      ],
    },
    {
      platform: "Coursera",
      priceRange: ["Free", 49.99, 79.99],
      ratingRange: [4.0, 5.0],
      enrollmentsRange: [5000, 1000000],
      durationRange: ["4 weeks", "6 weeks", "8 weeks"],
      levels: ["Beginner", "Intermediate", "Advanced"],
      imageUrls: [
        "https://d3njjcbhbojbot.cloudfront.net/api/utilities/v1/imageproxy/https://s3.amazonaws.com/coursera-course-photos/83/e258e0532611e5a5072321239ff4d4/jhep-coursera-course4.png?auto=format%2Ccompress&dpr=1&w=330&h=330&fit=fill&q=25",
        "https://d3njjcbhbojbot.cloudfront.net/api/utilities/v1/imageproxy/https://s3.amazonaws.com/coursera-course-photos/4e/83f664e8c11e88d594a756fd521eec/Python-for-everybody_1x1.png?auto=format%2Ccompress&dpr=1&w=330&h=330&fit=fill&q=25",
        "https://d3njjcbhbojbot.cloudfront.net/api/utilities/v1/imageproxy/https://s3.amazonaws.com/coursera-course-photos/b0/55c0b05c6511e5b1f877d90f34b238/IMG_1995.jpg?auto=format%2Ccompress&dpr=1&w=330&h=330&fit=fill&q=25",
      ],
    },
    {
      platform: "edX",
      priceRange: ["Free", 99.99, 149.99],
      ratingRange: [4.2, 4.9],
      enrollmentsRange: [3000, 800000],
      durationRange: ["6 weeks", "8 weeks", "12 weeks"],
      levels: ["Introductory", "Intermediate", "Advanced"],
      imageUrls: [
        "https://prod-discovery.edx-cdn.org/media/course/image/0e575a39-da1e-4e33-bb3b-e96cc6ffc58e-8372a9a276c1.small.png",
        "https://prod-discovery.edx-cdn.org/media/course/image/956319ec-8665-4039-8bc6-32c9a9aea5e7-e4ef877b2b9c.small.png",
        "https://prod-discovery.edx-cdn.org/media/course/image/da1b2400-322b-459b-97b0-0c557f05d017-b52344e7c028.small.png",
      ],
    },
    {
      platform: "YouTube",
      priceRange: ["Free"],
      ratingRange: [4.0, 5.0],
      enrollmentsRange: [10000, 5000000],
      durationRange: ["1-2 hours", "3-5 hours", "10+ hours"],
      levels: ["Beginner", "Intermediate", "Advanced", "All Levels"],
      imageUrls: [
        "https://i.ytimg.com/vi/rfscVS0vtbw/hqdefault.jpg",
        "https://i.ytimg.com/vi/8jLOx1hD3_o/hqdefault.jpg",
        "https://i.ytimg.com/vi/Z1RJmh_OqeA/hqdefault.jpg",
      ],
    },
    {
      platform: "freeCodeCamp",
      priceRange: ["Free"],
      ratingRange: [4.5, 5.0],
      enrollmentsRange: [50000, 2000000],
      durationRange: ["10 hours", "20 hours", "40 hours"],
      levels: ["Beginner", "Intermediate", "Advanced"],
      imageUrls: [
        "https://www.freecodecamp.org/news/content/images/size/w2000/2020/02/Ekran-Resmi-2019-11-18-18.08.13.png",
        "https://www.freecodecamp.org/news/content/images/size/w2000/2021/06/javascriptfull.png",
        "https://www.freecodecamp.org/news/content/images/size/w2000/2020/04/screely-1586183781361.png",
      ],
    },
  ]

  // Course title templates based on query
  const titleTemplates = [
    `Complete ${query} Course: Zero to Expert`,
    `${query} Masterclass`,
    `${query} for Beginners`,
    `Advanced ${query} Techniques`,
    `The Ultimate ${query} Bootcamp`,
    `${query} Certification Course`,
    `Practical ${query}: Hands-on Projects`,
    `${query} Fundamentals`,
    `Professional ${query} Development`,
    `${query} Crash Course`,
    `Learn ${query} Step by Step`,
    `${query} for Professionals`,
  ]

  // Instructor name templates
  const instructorTemplates = [
    "John Smith",
    "Sarah Johnson",
    "Michael Brown",
    "Emily Davis",
    "David Wilson",
    "Jennifer Miller",
    "Robert Taylor",
    "Jessica Anderson",
    "Christopher Thomas",
    "Amanda Martinez",
  ]

  // Generate courses
  const courses = []

  for (let i = 0; i < numCourses; i++) {
    // Use deterministic randomness based on query and index
    const seed = hashCode(normalizedQuery + i.toString())
    const random = (min, max) => min + ((seed % 1000) / 1000) * (max - min)
    const randomInt = (min, max) => Math.floor(random(min, max + 1))
    const randomItem = (arr) => arr[randomInt(0, arr.length - 1)]

    // Select template
    const template = courseTemplates[i % courseTemplates.length]

    // Generate price (some will be free)
    const price = randomItem(template.priceRange)

    // Generate course
    const course = {
      id: `course-${seed}`,
      title: randomItem(titleTemplates),
      platform: template.platform,
      instructor: randomItem(instructorTemplates),
      rating: Number.parseFloat(random(template.ratingRange[0], template.ratingRange[1]).toFixed(1)),
      price: price,
      duration: randomItem(template.durationRange),
      level: randomItem(template.levels),
      enrollments: randomInt(template.enrollmentsRange[0], template.enrollmentsRange[1]),
      image: randomItem(template.imageUrls),
      url: `https://example.com/course/${seed}`,
      lastUpdated: `${randomItem(["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"])} ${randomInt(2021, 2023)}`,
      language: randomItem(["English", "English", "English", "Spanish", "French"]),
    }

    courses.push(course)
  }

  return courses
}

