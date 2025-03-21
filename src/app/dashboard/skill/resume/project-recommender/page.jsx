"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Loader2,
  ArrowLeft,
  Sparkles,
  Code,
  BookOpen,
  Rocket,
  Github,
  Bookmark,
  BookmarkPlus,
  ExternalLink,
  TrendingUp,
  Zap,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";
import { generateProjectIdeas } from "@/lib/project-recommender";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function ProjectRecommenderPage() {
  const [resumeData, setResumeData] = useState(null);
  const [jobRole, setJobRole] = useState("");
  const [industry, setIndustry] = useState("");
  const [careerGoals, setCareerGoals] = useState("");
  const [loading, setLoading] = useState(false);
  const [projects, setProjects] = useState(null);
  const [savedProjects, setSavedProjects] = useState([]);
  const [activeTab, setActiveTab] = useState("all");
  const [statusMessage, setStatusMessage] = useState(null);
  const [trendingTechnologies, setTrendingTechnologies] = useState([
    {
      name: "AI/ML",
      trend: "rising",
      description:
        "Artificial Intelligence and Machine Learning continue to be in high demand",
    },
    {
      name: "Web3",
      trend: "stable",
      description: "Blockchain and decentralized applications remain relevant",
    },
    {
      name: "Cloud Native",
      trend: "rising",
      description:
        "Kubernetes, microservices, and serverless architectures are growing",
    },
    {
      name: "DevOps",
      trend: "rising",
      description:
        "CI/CD, Infrastructure as Code, and automation skills are highly valued",
    },
    {
      name: "Mobile Development",
      trend: "stable",
      description:
        "React Native and Flutter are popular for cross-platform development",
    },
  ]);

  // Load resume data and saved projects from local storage on component mount
  useEffect(() => {
    try {
      // Load resume data
      const savedData = localStorage.getItem("resume-builder-data");
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        setResumeData(parsedData);
        console.log("Resume data loaded from local storage");

        // Set default job role based on resume title if available
        if (parsedData.title) {
          setJobRole(parsedData.title);
        }
      } else {
        setStatusMessage({
          type: "warning",
          message:
            "No resume data found. Please create a resume first for personalized recommendations.",
        });
      }

      // Load saved projects
      const savedProjectsData = localStorage.getItem("saved-project-ideas");
      if (savedProjectsData) {
        setSavedProjects(JSON.parse(savedProjectsData));
      }
    } catch (error) {
      console.error("Error loading from local storage:", error);
      setStatusMessage({
        type: "error",
        message: "Error loading resume data. Please create a resume first.",
      });
    }
  }, []);

  // Save projects to local storage whenever savedProjects changes
  useEffect(() => {
    if (savedProjects.length > 0) {
      localStorage.setItem(
        "saved-project-ideas",
        JSON.stringify(savedProjects)
      );
    }
  }, [savedProjects]);

  // Generate project ideas
  const handleGenerateProjects = async () => {
    if (!resumeData) {
      setStatusMessage({
        type: "error",
        message: "No resume data found. Please create a resume first.",
      });
      return;
    }

    if (!jobRole) {
      setStatusMessage({
        type: "warning",
        message:
          "Please enter your target job role for better recommendations.",
      });
      return;
    }

    setLoading(true);
    setStatusMessage({
      type: "info",
      message:
        "Analyzing your profile and generating personalized project ideas...",
    });

    try {
      const generatedProjects = await generateProjectIdeas(
        resumeData,
        jobRole,
        industry,
        careerGoals
      );
      setProjects(generatedProjects);
      setActiveTab("all");
      setStatusMessage({
        type: "success",
        message:
          "Project ideas generated successfully! These are tailored to your skills and career goals.",
      });
    } catch (error) {
      console.error("Error generating project ideas:", error);
      setStatusMessage({
        type: "error",
        message: "Failed to generate project ideas. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  // Save a project to the saved projects list
  const saveProject = (project) => {
    if (!savedProjects.some((p) => p.title === project.title)) {
      const updatedSavedProjects = [
        ...savedProjects,
        { ...project, savedAt: new Date().toISOString() },
      ];
      setSavedProjects(updatedSavedProjects);
      setStatusMessage({
        type: "success",
        message: `"${project.title}" saved to your projects!`,
      });
    } else {
      setStatusMessage({
        type: "warning",
        message: "This project is already saved.",
      });
    }
  };

  // Remove a project from the saved projects list
  const removeProject = (projectTitle) => {
    const updatedSavedProjects = savedProjects.filter(
      (p) => p.title !== projectTitle
    );
    setSavedProjects(updatedSavedProjects);

    if (updatedSavedProjects.length === 0) {
      localStorage.removeItem("saved-project-ideas");
    }

    setStatusMessage({
      type: "info",
      message: `"${projectTitle}" removed from your saved projects.`,
    });
  };

  // Filter projects by difficulty level
  const getFilteredProjects = () => {
    if (!projects) return [];

    switch (activeTab) {
      case "beginner":
        return projects.filter((p) => p.difficulty === "Beginner");
      case "intermediate":
        return projects.filter((p) => p.difficulty === "Intermediate");
      case "advanced":
        return projects.filter((p) => p.difficulty === "Advanced");
      case "saved":
        return savedProjects;
      default:
        return projects;
    }
  };

  // Get difficulty badge color
  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "Beginner":
        return "bg-green-600 text-white";
      case "Intermediate":
        return "bg-blue-600 text-white";
      case "Advanced":
        return "bg-purple-600 text-white";
      default:
        return "bg-gray-600 text-white";
    }
  };

  // Get trend icon and color
  const getTrendIcon = (trend) => {
    switch (trend) {
      case "rising":
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case "stable":
        return <CheckCircle2 className="h-4 w-4 text-blue-500" />;
      case "declining":
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      default:
        return <TrendingUp className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <main className="min-h-screen bg-black">
      <div className="container mx-auto py-8">
        <div className="flex items-center mb-6">
          <Link
            href="/dashboard/skill/resume/resume-builder"
            className="flex items-center text-White hover:text-blue-400"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Resume Builder
          </Link>
        </div>

        <h1 className="text-4xl font-bold text-white text-center mb-8 animate-fadeIn">
          <span className="text-[#57FF31]"> AI</span>-Powered Project
          Recommender
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Input Form */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="bg-[#181818] border-gray-700">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-blue-400">
                  Career Details
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Help us understand your career goals for better project
                  recommendations
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                {statusMessage && (
                  <div
                    className={`p-3 rounded-md flex items-start ${
                      statusMessage.type === "error"
                        ? "bg-red-900/30 border border-red-700"
                        : statusMessage.type === "warning"
                        ? "bg-yellow-900/30 border border-yellow-700"
                        : statusMessage.type === "success"
                        ? "bg-green-900/30 border border-green-700"
                        : "bg-blue-900/30 border border-blue-700"
                    }`}
                  >
                    <span
                      className={`text-sm ${
                        statusMessage.type === "error"
                          ? "text-red-400"
                          : statusMessage.type === "warning"
                          ? "text-yellow-400"
                          : statusMessage.type === "success"
                          ? "text-green-400"
                          : "text-blue-400"
                      }`}
                    >
                      {statusMessage.message}
                    </span>
                  </div>
                )}

                <div>
                  <label className="text-sm text-gray-300 mb-1 block">
                    Target Job Role *
                  </label>
                  <Input
                    placeholder="e.g. Frontend Developer, Data Scientist"
                    value={jobRole}
                    onChange={(e) => setJobRole(e.target.value)}
                    className="bg-transperent border-gray-400 text-gray-200 placeholder:text-gray-400"
                  />
                </div>

                <div>
                  <label className="text-sm text-gray-300 mb-1 block">
                    Industry Focus
                  </label>
                  <Input
                    placeholder="e.g. Healthcare, Finance, E-commerce"
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                    className="bg-transperent border-gray-400 text-gray-200 placeholder:text-gray-400"
                  />
                </div>

                <div>
                  <label className="text-sm text-gray-300 mb-1 block">
                    Career Goals (Optional)
                  </label>
                  <Textarea
                    placeholder="Describe your career goals and what you want to achieve..."
                    value={careerGoals}
                    onChange={(e) => setCareerGoals(e.target.value)}
                    className="min-h-[100px] bg-transperent border-gray-400 text-gray-200 placeholder:text-gray-400"
                  />
                </div>
              </CardContent>

              <CardFooter>
                <Button
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  onClick={handleGenerateProjects}
                  disabled={loading}
                >
                  {loading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Sparkles className="mr-2 h-4 w-4" />
                  )}
                  Generate Project Ideas
                </Button>
              </CardFooter>
            </Card>

            {/* Resume Summary */}
            {resumeData && (
              <Card className="bg-[#181818] border-gray-700">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold text-blue-400">
                    Your Profile
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    Resume data used for project recommendations
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div>
                    <h3 className="text-gray-300 font-medium mb-1">Skills</h3>
                    <div className="flex flex-wrap gap-2">
                      {resumeData.skills ? (
                        resumeData.skills.split(",").map((skill, index) => (
                          <Badge
                            key={index}
                            className="bg-gray-700 text-gray-300"
                          >
                            {skill.trim()}
                          </Badge>
                        ))
                      ) : (
                        <span className="text-gray-400 text-sm">
                          No skills found in your resume
                        </span>
                      )}
                    </div>
                  </div>

                  {resumeData.title && (
                    <div>
                      <h3 className="text-gray-300 font-medium mb-1">
                        Current Role
                      </h3>
                      <p className="text-gray-400 text-sm">
                        {resumeData.title}
                      </p>
                    </div>
                  )}

                  {resumeData.bio && (
                    <div>
                      <h3 className="text-gray-300 font-medium mb-1">
                        Summary
                      </h3>
                      <p className="text-gray-400 text-sm line-clamp-3">
                        {resumeData.bio}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Trending Technologies */}
            <Card className="bg-[#181818] border-gray-700">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-blue-400">
                  Trending Technologies
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Current industry trends to consider for your projects
                </CardDescription>
              </CardHeader>

              <CardContent>
                <ScrollArea className="h-[200px] pr-4">
                  <div className="space-y-3">
                    {trendingTechnologies.map((tech, index) => (
                      <div key={index} className="p-3 bg-gray-700 rounded-md">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="text-gray-200 font-medium">
                            {tech.name}
                          </h3>
                          <div className="flex items-center">
                            {getTrendIcon(tech.trend)}
                          </div>
                        </div>
                        <p className="text-gray-400 text-sm">
                          {tech.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Project Recommendations */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="bg-[#181818] border-gray-700">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="text-xl font-semibold text-blue-400">
                      Project Recommendations
                    </CardTitle>
                    <CardDescription className="text-gray-400">
                      Personalized project ideas based on your skills and career
                      goals
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                {projects ? (
                  <div className="space-y-4">
                    <Tabs
                      value={activeTab}
                      onValueChange={setActiveTab}
                      className="w-full"
                    >
                      <TabsList className="grid grid-cols-5 mb-4 bg-gray-700">
                        <TabsTrigger
                          value="all"
                          className="data-[state=active]:bg-blue-900 data-[state=active]:text-blue-100"
                        >
                          All
                        </TabsTrigger>
                        <TabsTrigger
                          value="beginner"
                          className="data-[state=active]:bg-green-900 data-[state=active]:text-green-100"
                        >
                          Beginner
                        </TabsTrigger>
                        <TabsTrigger
                          value="intermediate"
                          className="data-[state=active]:bg-blue-900 data-[state=active]:text-blue-100"
                        >
                          Intermediate
                        </TabsTrigger>
                        <TabsTrigger
                          value="advanced"
                          className="data-[state=active]:bg-purple-900 data-[state=active]:text-purple-100"
                        >
                          Advanced
                        </TabsTrigger>
                        <TabsTrigger
                          value="saved"
                          className="data-[state=active]:bg-yellow-900 data-[state=active]:text-yellow-100"
                        >
                          Saved ({savedProjects.length})
                        </TabsTrigger>
                      </TabsList>

                      <ScrollArea className="h-[600px] pr-4">
                        <div className="space-y-4">
                          {getFilteredProjects().length > 0 ? (
                            getFilteredProjects().map((project, index) => (
                              <Card
                                key={index}
                                className="bg-[#181818] border-gray-600"
                              >
                                <CardHeader className="pb-2">
                                  <div className="flex justify-between items-start">
                                    <div>
                                      <CardTitle className="text-lg font-semibold text-blue-300">
                                        {project.title}
                                      </CardTitle>
                                      <div className="flex items-center mt-1 space-x-2">
                                        <Badge
                                          className={getDifficultyColor(
                                            project.difficulty
                                          )}
                                        >
                                          {project.difficulty}
                                        </Badge>
                                        {project.estimatedTime && (
                                          <Badge
                                            variant="outline"
                                            className="border-gray-500 text-gray-300"
                                          >
                                            {project.estimatedTime}
                                          </Badge>
                                        )}
                                      </div>
                                    </div>
                                    <div>
                                      {activeTab === "saved" ? (
                                        <Button
                                          variant="ghost"
                                          size="icon"
                                          onClick={() =>
                                            removeProject(project.title)
                                          }
                                          className="h-8 w-8 text-red-400 hover:text-red-300 hover:bg-red-900/20"
                                        >
                                          <Bookmark className="h-4 w-4" />
                                        </Button>
                                      ) : (
                                        <TooltipProvider>
                                          <Tooltip>
                                            <TooltipTrigger asChild>
                                              <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() =>
                                                  saveProject(project)
                                                }
                                                className="h-8 w-8 text-gray-400 hover:text-yellow-300 hover:bg-yellow-900/20"
                                              >
                                                <BookmarkPlus className="h-4 w-4" />
                                              </Button>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                              <p>Save this project idea</p>
                                            </TooltipContent>
                                          </Tooltip>
                                        </TooltipProvider>
                                      )}
                                    </div>
                                  </div>
                                </CardHeader>

                                <CardContent className="pt-0">
                                  <p className="text-gray-300 text-sm mb-3">
                                    {project.description}
                                  </p>

                                  <Accordion
                                    type="single"
                                    collapsible
                                    className="w-full"
                                  >
                                    <AccordionItem
                                      value="tech-stack"
                                      className="border-gray-600"
                                    >
                                      <AccordionTrigger className="text-sm text-gray-300 hover:text-gray-200 py-2">
                                        <div className="flex items-center">
                                          <Code className="h-4 w-4 mr-2" />
                                          Tech Stack
                                        </div>
                                      </AccordionTrigger>
                                      <AccordionContent>
                                        <div className="flex flex-wrap gap-2 py-2">
                                          {project.techStack.map((tech, i) => (
                                            <Badge
                                              key={i}
                                              className="bg-blue-900/40 text-blue-300 border-blue-700"
                                            >
                                              {tech}
                                            </Badge>
                                          ))}
                                        </div>
                                      </AccordionContent>
                                    </AccordionItem>

                                    <AccordionItem
                                      value="learning-outcomes"
                                      className="border-gray-600"
                                    >
                                      <AccordionTrigger className="text-sm text-gray-300 hover:text-gray-200 py-2">
                                        <div className="flex items-center">
                                          <BookOpen className="h-4 w-4 mr-2" />
                                          Learning Outcomes
                                        </div>
                                      </AccordionTrigger>
                                      <AccordionContent>
                                        <ul className="list-disc pl-5 py-2 space-y-1">
                                          {project.learningOutcomes.map(
                                            (outcome, i) => (
                                              <li
                                                key={i}
                                                className="text-sm text-gray-300"
                                              >
                                                {outcome}
                                              </li>
                                            )
                                          )}
                                        </ul>
                                      </AccordionContent>
                                    </AccordionItem>

                                    {project.implementationSteps && (
                                      <AccordionItem
                                        value="implementation"
                                        className="border-gray-600"
                                      >
                                        <AccordionTrigger className="text-sm text-gray-300 hover:text-gray-200 py-2">
                                          <div className="flex items-center">
                                            <Rocket className="h-4 w-4 mr-2" />
                                            Implementation Steps
                                          </div>
                                        </AccordionTrigger>
                                        <AccordionContent>
                                          <ol className="list-decimal pl-5 py-2 space-y-1">
                                            {project.implementationSteps.map(
                                              (step, i) => (
                                                <li
                                                  key={i}
                                                  className="text-sm text-gray-300"
                                                >
                                                  {step}
                                                </li>
                                              )
                                            )}
                                          </ol>
                                        </AccordionContent>
                                      </AccordionItem>
                                    )}

                                    {project.careerRelevance && (
                                      <AccordionItem
                                        value="career-relevance"
                                        className="border-gray-600"
                                      >
                                        <AccordionTrigger className="text-sm text-gray-300 hover:text-gray-200 py-2">
                                          <div className="flex items-center">
                                            <Zap className="h-4 w-4 mr-2" />
                                            Career Relevance
                                          </div>
                                        </AccordionTrigger>
                                        <AccordionContent>
                                          <p className="text-sm text-gray-300 py-2">
                                            {project.careerRelevance}
                                          </p>
                                        </AccordionContent>
                                      </AccordionItem>
                                    )}

                                    {project.similarProjects && (
                                      <AccordionItem
                                        value="similar-projects"
                                        className="border-gray-600"
                                      >
                                        <AccordionTrigger className="text-sm text-gray-300 hover:text-gray-200 py-2">
                                          <div className="flex items-center">
                                            <Github className="h-4 w-4 mr-2" />
                                            Similar Open Source Projects
                                          </div>
                                        </AccordionTrigger>
                                        <AccordionContent>
                                          <ul className="py-2 space-y-2">
                                            {project.similarProjects.map(
                                              (similar, i) => (
                                                <li key={i} className="text-sm">
                                                  <a
                                                    href={similar.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-blue-400 hover:text-blue-300 flex items-center"
                                                  >
                                                    {similar.name}
                                                    <ExternalLink className="h-3 w-3 ml-1" />
                                                  </a>
                                                  {similar.description && (
                                                    <p className="text-gray-400 text-xs mt-1">
                                                      {similar.description}
                                                    </p>
                                                  )}
                                                </li>
                                              )
                                            )}
                                          </ul>
                                        </AccordionContent>
                                      </AccordionItem>
                                    )}
                                  </Accordion>
                                </CardContent>
                              </Card>
                            ))
                          ) : (
                            <div className="text-center p-8 bg-gray-700 rounded-md">
                              {activeTab === "saved" ? (
                                <div className="flex flex-col items-center">
                                  <Bookmark className="h-12 w-12 text-gray-500 mb-4" />
                                  <h3 className="text-gray-300 text-lg font-medium mb-2">
                                    No Saved Projects
                                  </h3>
                                  <p className="text-gray-400">
                                    You haven't saved any project ideas yet.
                                    Click the bookmark icon on projects you like
                                    to save them here.
                                  </p>
                                </div>
                              ) : (
                                <div className="flex flex-col items-center">
                                  <AlertCircle className="h-12 w-12 text-gray-500 mb-4" />
                                  <h3 className="text-gray-300 text-lg font-medium mb-2">
                                    No Projects Found
                                  </h3>
                                  <p className="text-gray-400">
                                    No {activeTab} level projects found. Try
                                    selecting a different difficulty level.
                                  </p>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </ScrollArea>
                    </Tabs>
                  </div>
                ) : (
                  <div className="bg-gray-700 rounded-md p-8 flex flex-col items-center justify-center min-h-[400px] text-center">
                    <Sparkles className="h-12 w-12 text-gray-500 mb-4" />
                    <h3 className="text-gray-300 text-lg font-medium mb-2">
                      No Project Ideas Generated Yet
                    </h3>
                    <p className="text-gray-400 max-w-md">
                      Fill in your career details on the left and click
                      "Generate Project Ideas" to get personalized project
                      recommendations.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
}

