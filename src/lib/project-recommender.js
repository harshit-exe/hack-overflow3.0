// AI-powered project idea generation

import { generateText } from "ai"
import { groq } from "@ai-sdk/groq"

export const generateProjectIdeas = async (resumeData, jobRole, industry = "", careerGoals = "") => {
  try {
    // Check if API key is available
    const apiKey ="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"

    // Format resume data for the AI prompt
    const resumeText = formatResumeForPrompt(resumeData)

    // Create a detailed prompt for the AI
    const prompt = createDetailedPrompt(resumeText, jobRole, industry, careerGoals)

    // If API key is available, use Groq AI
    if (apiKey) {
      try {
        const { text } = await generateText({
          model: groq("llama-3-8b-8192", { apiKey }),
          prompt: prompt,
          temperature: 0.7,
          maxTokens: 2500,
        })

        // Parse the AI response to get structured project ideas
        return parseAIResponse(text)
      } catch (aiError) {
        console.error("Error with AI service:", aiError)
        // Fall back to template-based generation if AI fails
        return generateTemplateProjects(resumeData, jobRole, industry)
      }
    } else {
      // If no API key, use template-based generation
      console.log("No API key available, using template-based generation")
      return generateTemplateProjects(resumeData, jobRole, industry)
    }
  } catch (error) {
    console.error("Error generating project ideas:", error)
    throw new Error("Failed to generate project ideas. Please try again.")
  }
}

// Format resume data for the AI prompt
const formatResumeForPrompt = (resumeData) => {
  return `
# Resume Information
Name: ${resumeData.name || ""}
Title: ${resumeData.title || ""}

## Professional Summary
${resumeData.bio || ""}

## Skills
${resumeData.skills || ""}

## Experience
${resumeData.experience || ""}

## Education
${resumeData.education || ""}

## Projects
${resumeData.projects || ""}
  `
}

// Create a detailed prompt for the AI
const createDetailedPrompt = (resumeText, jobRole, industry, careerGoals) => {
  return `
You are an expert career advisor and technical project consultant with deep knowledge of industry trends and hiring practices.

Generate 6-9 personalized project ideas for a professional with the following profile:
${resumeText}

Target Job Role: ${jobRole}
${industry ? `Industry Focus: ${industry}` : ""}
${careerGoals ? `Career Goals: ${careerGoals}` : ""}

Generate a diverse mix of project ideas across three difficulty levels:
- Beginner (2-3 projects)
- Intermediate (2-3 projects)
- Advanced (2-3 projects)

For each project idea, include:
1. A clear, specific title
2. A concise description (2-3 sentences)
3. The difficulty level (Beginner, Intermediate, or Advanced)
4. Estimated time to complete (e.g., "1-2 weeks", "2-3 months")
5. Recommended tech stack (list of technologies)
6. Learning outcomes (3-5 bullet points)
7. Implementation steps (3-5 high-level steps)
8. Career relevance (how this project helps with the target job role)
9. Similar open source projects for inspiration (2-3 examples with URLs and brief descriptions)

The projects should:
- Be highly relevant to the target job role and industry
- Address skill gaps based on the resume
- Follow current industry best practices and trends
- Be unique and specific (not generic like "build a to-do app")
- Have real-world applications and portfolio value
- Demonstrate increasing complexity across difficulty levels
- Include modern technologies that are in demand

Format your response as a JSON array of project objects. Each project should have the following structure:
[
  {
    "title": "Project Title",
    "description": "Project description",
    "difficulty": "Beginner/Intermediate/Advanced",
    "estimatedTime": "Estimated completion time",
    "techStack": ["Tech1", "Tech2", "Tech3"],
    "learningOutcomes": ["Outcome1", "Outcome2", "Outcome3"],
    "implementationSteps": ["Step1", "Step2", "Step3"],
    "careerRelevance": "How this project helps with the target job role",
    "similarProjects": [
      {
        "name": "Project Name",
        "url": "https://github.com/example/project",
        "description": "Brief description"
      }
    ]
  }
]

Ensure the JSON is valid and properly formatted.
  `
}

// Parse the AI response to get structured project ideas
const parseAIResponse = (aiResponse) => {
  try {
    // Try to extract JSON from the response
    const jsonMatch = aiResponse.match(/\[[\s\S]*\]/)
    if (jsonMatch) {
      const jsonString = jsonMatch[0]
      return JSON.parse(jsonString)
    }

    // If no JSON found, try to parse the whole response
    try {
      return JSON.parse(aiResponse)
    } catch (e) {
      console.error("Failed to parse AI response as JSON:", e)
      throw new Error("Invalid response format from AI service")
    }
  } catch (error) {
    console.error("Error parsing AI response:", error)
    throw new Error("Failed to parse project ideas from AI response")
  }
}

// Generate template-based projects if AI is not available
const generateTemplateProjects = (resumeData, jobRole, industry) => {
  // Extract skills from resume
  const skills = resumeData.skills ? resumeData.skills.split(",").map((s) => s.trim()) : []

  // Determine if the user has certain skills
  const hasReact = skills.some((s) => /react/i.test(s))
  const hasNode = skills.some((s) => /node|express|javascript/i.test(s))
  const hasPython = skills.some((s) => /python|django|flask/i.test(s))
  const hasAI = skills.some((s) => /ai|ml|machine learning|tensorflow|pytorch/i.test(s))
  const hasCloud = skills.some((s) => /aws|azure|gcp|cloud/i.test(s))
  const hasMobile = skills.some((s) => /mobile|react native|flutter|ios|android/i.test(s))

  // Determine project focus based on job role
  const isFrontend = /front|ui|ux|web/i.test(jobRole)
  const isBackend = /back|api|server|database/i.test(jobRole)
  const isFullstack = /full|stack|software/i.test(jobRole)
  const isDataScience = /data|science|analyst|analytics/i.test(jobRole)
  const isDevOps = /devops|sre|reliability|ops/i.test(jobRole)
  const isMobile = /mobile|ios|android/i.test(jobRole)

  // Create template projects based on skills and job role
  const projects = []

  // Beginner projects
  if (isFrontend || isFullstack) {
    projects.push({
      title: "Interactive Portfolio Website",
      description:
        "Create a modern, responsive portfolio website to showcase your projects and skills. Include interactive elements and animations to demonstrate your frontend capabilities.",
      difficulty: "Beginner",
      estimatedTime: "2-3 weeks",
      techStack: hasReact ? ["React", "Tailwind CSS", "Framer Motion"] : ["HTML5", "CSS3", "JavaScript", "Bootstrap"],
      learningOutcomes: [
        "Build responsive layouts using modern CSS techniques",
        "Implement interactive UI elements and animations",
        "Optimize website performance and accessibility",
        "Deploy a static website to a hosting platform",
      ],
      implementationSteps: [
        "Design the website layout and user interface",
        "Develop responsive components for different screen sizes",
        "Add interactive elements and animations",
        "Optimize for performance and accessibility",
        "Deploy to a hosting platform like Vercel or Netlify",
      ],
      careerRelevance:
        "A portfolio website is essential for showcasing your work to potential employers and demonstrates your frontend skills in action.",
      similarProjects: [
        {
          name: "React Portfolio Template",
          url: "https://github.com/soumyajit4419/Portfolio",
          description: "A clean, beautiful and responsive portfolio template built with React.js",
        },
        {
          name: "Developer Portfolio",
          url: "https://github.com/1hanzla100/developer-portfolio",
          description: "Software Developer Portfolio Template built with Next.js and Tailwind CSS",
        },
      ],
    })
  }

  if (isBackend || isFullstack) {
    projects.push({
      title: "RESTful API with Authentication",
      description:
        "Build a secure RESTful API with user authentication, authorization, and CRUD operations. Implement best practices for API design and security.",
      difficulty: "Beginner",
      estimatedTime: "2-4 weeks",
      techStack: hasNode
        ? ["Node.js", "Express", "MongoDB", "JWT"]
        : hasPython
          ? ["Python", "Flask", "SQLite", "JWT"]
          : ["Node.js", "Express", "MongoDB", "JWT"],
      learningOutcomes: [
        "Design and implement RESTful API endpoints",
        "Implement secure user authentication and authorization",
        "Work with databases and data validation",
        "Handle errors and implement logging",
        "Write API documentation",
      ],
      implementationSteps: [
        "Set up the project structure and dependencies",
        "Design the database schema and API endpoints",
        "Implement user authentication and authorization",
        "Create CRUD operations for resources",
        "Add validation, error handling, and documentation",
      ],
      careerRelevance:
        "Backend developers need to demonstrate their ability to create secure, well-designed APIs. This project showcases your understanding of API design, authentication, and database integration.",
      similarProjects: [
        {
          name: "Node.js Express Boilerplate",
          url: "https://github.com/hagopj13/node-express-boilerplate",
          description: "A boilerplate for building production-ready RESTful APIs using Node.js, Express, and MongoDB",
        },
        {
          name: "Flask REST API",
          url: "https://github.com/python-engineer/flask-api-tutorial",
          description: "A Flask REST API with JWT authentication and SQLAlchemy",
        },
      ],
    })
  }

  if (isDataScience || hasAI) {
    projects.push({
      title: "Data Visualization Dashboard",
      description:
        "Create an interactive dashboard to visualize and analyze data from public datasets. Implement filtering, sorting, and various chart types to provide insights.",
      difficulty: "Beginner",
      estimatedTime: "3-4 weeks",
      techStack: hasPython ? ["Python", "Pandas", "Plotly", "Dash"] : ["JavaScript", "D3.js", "React", "Chart.js"],
      learningOutcomes: [
        "Process and transform data for visualization",
        "Create interactive charts and graphs",
        "Build a user-friendly dashboard interface",
        "Implement data filtering and exploration features",
        "Deploy a data visualization application",
      ],
      implementationSteps: [
        "Find and clean a relevant public dataset",
        "Analyze the data and determine key insights",
        "Design the dashboard layout and visualization components",
        "Implement interactive features for data exploration",
        "Deploy the dashboard to a web hosting platform",
      ],
      careerRelevance:
        "Data visualization is a critical skill for data scientists and analysts. This project demonstrates your ability to extract insights from data and present them in an accessible way.",
      similarProjects: [
        {
          name: "Dash Sample Apps",
          url: "https://github.com/plotly/dash-sample-apps",
          description: "Sample Dash apps for various use cases and industries",
        },
        {
          name: "D3 Dashboard",
          url: "https://github.com/sgratzl/d3tutorial",
          description: "A tutorial for creating interactive dashboards with D3.js",
        },
      ],
    })
  }

  // Intermediate projects
  if (isFrontend || isFullstack) {
    projects.push({
      title: "E-commerce Product Page with Advanced Features",
      description:
        "Build a sophisticated e-commerce product page with advanced features like product customization, real-time previews, and a shopping cart system. Focus on creating a seamless user experience.",
      difficulty: "Intermediate",
      estimatedTime: "4-6 weeks",
      techStack: hasReact
        ? ["React", "Redux", "Styled Components", "Framer Motion"]
        : ["JavaScript", "HTML5", "CSS3", "Web Components"],
      learningOutcomes: [
        "Implement complex UI interactions and state management",
        "Create responsive and accessible e-commerce components",
        "Build a shopping cart system with local storage",
        "Optimize performance for image-heavy applications",
        "Implement product filtering and search functionality",
      ],
      implementationSteps: [
        "Design the product page layout and user interface",
        "Implement product gallery with zoom and preview features",
        "Create product customization options (size, color, etc.)",
        "Build a shopping cart system with local storage",
        "Add product recommendations and related items",
      ],
      careerRelevance:
        "E-commerce is a major industry for frontend developers. This project demonstrates your ability to create complex, interactive interfaces that drive conversions and provide excellent user experiences.",
      similarProjects: [
        {
          name: "React Shopping Cart",
          url: "https://github.com/jeffersonRibeiro/react-shopping-cart",
          description: "A modern shopping cart implemented in React",
        },
        {
          name: "Vue Storefront",
          url: "https://github.com/vuestorefront/vue-storefront",
          description: "An open-source e-commerce storefront for modern web development",
        },
      ],
    })
  }

  if (isBackend || isFullstack || isDevOps) {
    projects.push({
      title: "Microservices Architecture with API Gateway",
      description:
        "Design and implement a microservices-based application with multiple services communicating through an API gateway. Include service discovery, load balancing, and fault tolerance.",
      difficulty: "Intermediate",
      estimatedTime: "6-8 weeks",
      techStack: hasNode
        ? ["Node.js", "Express", "Docker", "Kubernetes", "Redis"]
        : hasPython
          ? ["Python", "FastAPI", "Docker", "Kubernetes", "Redis"]
          : ["Node.js", "Express", "Docker", "Kubernetes", "Redis"],
      learningOutcomes: [
        "Design and implement a microservices architecture",
        "Set up containerization with Docker",
        "Implement service discovery and API gateway patterns",
        "Handle inter-service communication and data consistency",
        "Deploy and manage microservices in a container orchestration platform",
      ],
      implementationSteps: [
        "Design the microservices architecture and API contracts",
        "Implement individual microservices with their own databases",
        "Create an API gateway for routing and aggregation",
        "Set up Docker containers and orchestration",
        "Implement monitoring, logging, and error handling",
      ],
      careerRelevance:
        "Microservices architecture is widely adopted in enterprise applications. This project demonstrates your understanding of distributed systems design and modern deployment practices.",
      similarProjects: [
        {
          name: "Microservices Demo",
          url: "https://github.com/GoogleCloudPlatform/microservices-demo",
          description: "A sample cloud-native application with 10+ microservices showcasing Kubernetes",
        },
        {
          name: "Spring PetClinic Microservices",
          url: "https://github.com/spring-petclinic/spring-petclinic-microservices",
          description: "Microservices version of the Spring PetClinic sample application",
        },
      ],
    })
  }

  if (hasMobile || isMobile) {
    projects.push({
      title: "Cross-Platform Mobile App with Offline Support",
      description:
        "Develop a cross-platform mobile application that works offline and syncs data when online. Implement local storage, background sync, and push notifications.",
      difficulty: "Intermediate",
      estimatedTime: "6-8 weeks",
      techStack: ["React Native", "Redux", "Firebase", "AsyncStorage", "Expo"],
      learningOutcomes: [
        "Build cross-platform mobile UIs with React Native",
        "Implement offline data storage and synchronization",
        "Handle device-specific features and permissions",
        "Set up push notifications and background processes",
        "Deploy to app stores and manage updates",
      ],
      implementationSteps: [
        "Set up the React Native project and navigation structure",
        "Implement offline data storage with AsyncStorage or SQLite",
        "Create data synchronization logic for online/offline states",
        "Add push notifications and background sync",
        "Test on multiple devices and prepare for app store submission",
      ],
      careerRelevance:
        "Mobile development skills are highly sought after, especially for apps that work well in low-connectivity environments. This project demonstrates your ability to create robust mobile applications with excellent user experiences.",
      similarProjects: [
        {
          name: "React Native Offline First",
          url: "https://github.com/rgommezz/react-native-offline",
          description: "Handy toolbelt for handling offline/online connectivity in React Native",
        },
        {
          name: "Expo Examples",
          url: "https://github.com/expo/examples",
          description: "Example projects that demonstrate how to use Expo APIs and integrate with other libraries",
        },
      ],
    })
  }

  // Advanced projects
  if (isFullstack || hasAI) {
    projects.push({
      title: "AI-Powered Content Management System",
      description:
        "Build a modern CMS with AI capabilities for content generation, optimization, and analytics. Include features like SEO recommendations, content summarization, and automated tagging.",
      difficulty: "Advanced",
      estimatedTime: "2-3 months",
      techStack: ["Next.js", "Node.js", "PostgreSQL", "OpenAI API", "TensorFlow.js", "Docker"],
      learningOutcomes: [
        "Integrate AI services into a full-stack application",
        "Build a complex content management system with role-based access",
        "Implement real-time collaboration features",
        "Design and optimize database schemas for content management",
        "Deploy and scale a production-ready application",
      ],
      implementationSteps: [
        "Design the CMS architecture and database schema",
        "Implement core CMS features (content creation, editing, publishing)",
        "Integrate AI services for content enhancement and analysis",
        "Add user management, permissions, and collaboration features",
        "Set up analytics, monitoring, and performance optimization",
      ],
      careerRelevance:
        "AI integration is becoming essential in modern applications. This project demonstrates your ability to build complex systems that leverage AI capabilities to provide value to users.",
      similarProjects: [
        {
          name: "Strapi",
          url: "https://github.com/strapi/strapi",
          description: "Open-source headless CMS to build customizable APIs",
        },
        {
          name: "Ghost",
          url: "https://github.com/TryGhost/Ghost",
          description: "Professional publishing platform built on a modern Node.js tech stack",
        },
      ],
    })
  }

  if (isDevOps || hasCloud || isFullstack) {
    projects.push({
      title: "Serverless Event-Driven Architecture",
      description:
        "Design and implement a serverless application using event-driven architecture. Create a system that processes events asynchronously, scales automatically, and maintains data consistency.",
      difficulty: "Advanced",
      estimatedTime: "2-3 months",
      techStack: ["AWS Lambda", "Amazon SQS", "DynamoDB", "API Gateway", "Terraform", "Node.js/Python"],
      learningOutcomes: [
        "Design event-driven architectures with serverless components",
        "Implement infrastructure as code for cloud resources",
        "Build resilient systems with proper error handling and retries",
        "Optimize for cost and performance in serverless environments",
        "Set up monitoring, logging, and alerting for serverless applications",
      ],
      implementationSteps: [
        "Design the event-driven architecture and data flow",
        "Set up infrastructure as code with Terraform or CloudFormation",
        "Implement serverless functions for event processing",
        "Create event sources and configure message queues",
        "Set up monitoring, logging, and error handling",
      ],
      careerRelevance:
        "Serverless and event-driven architectures are increasingly popular for building scalable, cost-effective applications. This project demonstrates your ability to design and implement modern cloud-native solutions.",
      similarProjects: [
        {
          name: "Serverless Examples",
          url: "https://github.com/serverless/examples",
          description: "A collection of boilerplates and examples of serverless architectures",
        },
        {
          name: "AWS Lambda Powertools",
          url: "https://github.com/awslabs/aws-lambda-powertools-python",
          description: "A suite of utilities for AWS Lambda functions to ease adopting best practices",
        },
      ],
    })
  }

  if (isDataScience || hasAI) {
    projects.push({
      title: "Real-time Machine Learning Pipeline",
      description:
        "Build an end-to-end machine learning pipeline that processes data in real-time, trains models, and serves predictions through an API. Include monitoring, retraining, and A/B testing capabilities.",
      difficulty: "Advanced",
      estimatedTime: "2-3 months",
      techStack: ["Python", "Apache Kafka", "TensorFlow/PyTorch", "MLflow", "FastAPI", "Docker", "Kubernetes"],
      learningOutcomes: [
        "Design and implement real-time data processing pipelines",
        "Build and deploy machine learning models in production",
        "Implement model monitoring, evaluation, and retraining",
        "Set up A/B testing for model deployment",
        "Create scalable and resilient ML infrastructure",
      ],
      implementationSteps: [
        "Design the ML pipeline architecture and data flow",
        "Set up real-time data ingestion and processing",
        "Implement model training, evaluation, and versioning",
        "Create a prediction API and deployment pipeline",
        "Add monitoring, logging, and alerting for the ML system",
      ],
      careerRelevance:
        "Machine learning engineering skills are in high demand. This project demonstrates your ability to build production-ready ML systems that deliver value in real-time applications.",
      similarProjects: [
        {
          name: "MLflow",
          url: "https://github.com/mlflow/mlflow",
          description: "An open-source platform for the machine learning lifecycle",
        },
        {
          name: "Kubeflow",
          url: "https://github.com/kubeflow/kubeflow",
          description: "Machine Learning Toolkit for Kubernetes",
        },
      ],
    })
  }

  return projects
}

