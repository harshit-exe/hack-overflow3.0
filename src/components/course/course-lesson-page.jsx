"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import {
  BookOpen,
  FileText,
  MessageSquare,
  Code,
  Download,
  CheckCircle,
  Clock,
  Brain,
  Lock,
  Unlock,
  AlertTriangle,
  List,
} from "lucide-react"
import BiometricVideoPlayer from "./biometric-video-player"
import InteractiveVideoPlayer from "./interactive-video-player"

export default function CourseLessonPage({ course, lesson, module, nextLesson }) {
  const [activeTab, setActiveTab] = useState("video")
  const [lessonProgress, setLessonProgress] = useState(null)
  const [quizResults, setQuizResults] = useState(null)
  const [playerType, setPlayerType] = useState("interactive") // "biometric" or "interactive"

  // Load lesson progress from localStorage or backend
  useEffect(() => {
    const savedProgress = localStorage.getItem(`lesson-progress-${course.id}-${lesson.id}`)
    if (savedProgress) {
      setLessonProgress(JSON.parse(savedProgress))
    }
  }, [course.id, lesson.id])

  return (
    <div className="flex flex-col space-y-6">
      <Card className="bg-gray-900 border-gray-700">
        <CardHeader className="border-b border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <Badge className="mb-2 bg-[#4F46E5]">{module.title}</Badge>
              <CardTitle className="text-2xl text-white">{lesson.title}</CardTitle>
            </div>

            <div className="flex items-center space-x-2">
              {lessonProgress?.completed ? (
                <Badge className="bg-green-600 text-white">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Completed
                </Badge>
              ) : (
                <Badge className="bg-yellow-600 text-white">
                  <Clock className="h-3 w-3 mr-1" />
                  In Progress
                </Badge>
              )}

              <div className="flex">
                <Button
                  variant="outline"
                  size="sm"
                  className={`border-gray-700 ${playerType === "interactive" ? "bg-[#57FF31]/20 text-[#57FF31]" : ""}`}
                  onClick={() => setPlayerType("interactive")}
                >
                  Interactive
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className={`border-gray-700 ${playerType === "biometric" ? "bg-[#4F46E5]/20 text-[#4F46E5]" : ""}`}
                  onClick={() => setPlayerType("biometric")}
                >
                  Biometric
                </Button>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <Tabs defaultValue="video" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="w-full grid grid-cols-4 bg-gray-800 rounded-none">
              <TabsTrigger value="video" className="data-[state=active]:bg-[#4F46E5]">
                <BookOpen className="h-4 w-4 mr-2" />
                Video
              </TabsTrigger>
              <TabsTrigger value="resources" className="data-[state=active]:bg-[#4F46E5]">
                <FileText className="h-4 w-4 mr-2" />
                Resources
              </TabsTrigger>
              <TabsTrigger value="discussion" className="data-[state=active]:bg-[#4F46E5]">
                <MessageSquare className="h-4 w-4 mr-2" />
                Discussion
              </TabsTrigger>
              <TabsTrigger value="quiz" className="data-[state=active]:bg-[#4F46E5]">
                <Brain className="h-4 w-4 mr-2" />
                Quiz
              </TabsTrigger>
            </TabsList>

            <TabsContent value="video" className="p-0 m-0">
              {playerType === "biometric" ? (
                <BiometricVideoPlayer
                  videoUrl={lesson.videoUrl || "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4"}
                  title={lesson.title}
                  duration={lesson.duration || "10 minutes"}
                  nextLessonUrl={nextLesson ? `/courses/${course.id}/lessons/${nextLesson.id}` : null}
                  courseId={course.id}
                  lessonId={lesson.id}
                />
              ) : (
                <InteractiveVideoPlayer
                  videoUrl={lesson.videoUrl || "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4"}
                  title={lesson.title}
                  duration={lesson.duration || "10 minutes"}
                  nextLessonUrl={nextLesson ? `/courses/${course.id}/lessons/${nextLesson.id}` : null}
                  courseId={course.id}
                  lessonId={lesson.id}
                />
              )}
            </TabsContent>

            <TabsContent value="resources" className="p-6">
              <h3 className="text-xl font-bold text-white mb-4">Lesson Resources</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {lesson.resources?.map((resource, index) => (
                  <Card key={index} className="bg-gray-800 border-gray-700">
                    <CardContent className="p-4 flex justify-between items-center">
                      <div className="flex items-center">
                        {resource.type === "pdf" && <FileText className="h-5 w-5 mr-3 text-red-400" />}
                        {resource.type === "code" && <Code className="h-5 w-5 mr-3 text-blue-400" />}
                        {resource.type === "other" && <FileText className="h-5 w-5 mr-3 text-gray-400" />}
                        <div>
                          <h4 className="font-medium text-white">{resource.title}</h4>
                          <p className="text-sm text-gray-400">{resource.description}</p>
                        </div>
                      </div>

                      <Button variant="outline" size="sm" className="border-gray-600">
                        <Download className="h-4 w-4 mr-1" />
                        Download
                      </Button>
                    </CardContent>
                  </Card>
                ))}

                {(!lesson.resources || lesson.resources.length === 0) && (
                  <div className="col-span-2 text-center py-8 text-gray-400">
                    <FileText className="h-12 w-12 mx-auto mb-2 opacity-30" />
                    <p>No resources available for this lesson</p>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="discussion" className="p-6">
              <h3 className="text-xl font-bold text-white mb-4">Discussion</h3>

              <div className="bg-gray-800 rounded-lg p-4 mb-4">
                <p className="text-gray-300 mb-4">
                  This is where students can discuss the lesson content, ask questions, and share insights.
                </p>

                <div className="flex items-center justify-center py-8 text-gray-400">
                  <MessageSquare className="h-12 w-12 mx-auto mb-2 opacity-30" />
                  <p>Discussion feature coming soon</p>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="quiz" className="p-6">
              <h3 className="text-xl font-bold text-white mb-4">Knowledge Check</h3>

              {!lessonProgress?.completed ? (
                <div className="bg-gray-800 rounded-lg p-6 text-center">
                  <Lock className="h-12 w-12 mx-auto mb-4 text-yellow-500" />
                  <h4 className="text-lg font-medium text-white mb-2">Quiz Locked</h4>
                  <p className="text-gray-300 mb-4">You need to complete the video lesson before accessing the quiz.</p>
                  <Button
                    onClick={() => setActiveTab("video")}
                    className="bg-[#57FF31] hover:bg-[#4F46E5] text-black hover:text-white"
                  >
                    Go to Video Lesson
                  </Button>
                </div>
              ) : quizResults ? (
                <div className="bg-gray-800 rounded-lg p-6">
                  <div className="text-center mb-6">
                    {quizResults.passed ? (
                      <>
                        <CheckCircle className="h-12 w-12 mx-auto mb-4 text-green-500" />
                        <h4 className="text-lg font-medium text-white mb-2">Quiz Passed!</h4>
                        <p className="text-gray-300">You scored {quizResults.score}% on this quiz.</p>
                      </>
                    ) : (
                      <>
                        <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-yellow-500" />
                        <h4 className="text-lg font-medium text-white mb-2">Quiz Failed</h4>
                        <p className="text-gray-300 mb-4">You scored {quizResults.score}%. You need 70% to pass.</p>
                        <Button
                          onClick={() => setQuizResults(null)}
                          className="bg-[#57FF31] hover:bg-[#4F46E5] text-black hover:text-white"
                        >
                          Try Again
                        </Button>
                      </>
                    )}
                  </div>

                  {quizResults.passed && nextLesson && (
                    <Button
                      className="w-full bg-[#57FF31] hover:bg-[#4F46E5] text-black hover:text-white mt-4"
                      onClick={() => (window.location.href = `/courses/${course.id}/lessons/${nextLesson.id}`)}
                    >
                      Continue to Next Lesson
                      <Unlock className="ml-2 h-4 w-4" />
                    </Button>
                  )}
                </div>
              ) : (
                <div className="bg-gray-800 rounded-lg p-6">
                  <h4 className="text-lg font-medium text-white mb-4">Quiz Questions</h4>

                  <div className="space-y-6 mb-6">
                    {/* Sample quiz questions */}
                    <div className="border border-gray-700 rounded-lg p-4">
                      <p className="text-white mb-3">
                        1. What is the main purpose of the interactive verification system?
                      </p>
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <input type="radio" id="q1-a" name="q1" className="mr-2" />
                          <label htmlFor="q1-a" className="text-gray-300">
                            To make videos longer
                          </label>
                        </div>
                        <div className="flex items-center">
                          <input type="radio" id="q1-b" name="q1" className="mr-2" />
                          <label htmlFor="q1-b" className="text-gray-300">
                            To ensure students are actively watching and learning
                          </label>
                        </div>
                        <div className="flex items-center">
                          <input type="radio" id="q1-c" name="q1" className="mr-2" />
                          <label htmlFor="q1-c" className="text-gray-300">
                            To collect user data
                          </label>
                        </div>
                      </div>
                    </div>

                    <div className="border border-gray-700 rounded-lg p-4">
                      <p className="text-white mb-3">
                        2. Which of these verification methods is used in the biometric player?
                      </p>
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <input type="radio" id="q2-a" name="q2" className="mr-2" />
                          <label htmlFor="q2-a" className="text-gray-300">
                            Face detection
                          </label>
                        </div>
                        <div className="flex items-center">
                          <input type="radio" id="q2-b" name="q2" className="mr-2" />
                          <label htmlFor="q2-b" className="text-gray-300">
                            Fingerprint scanning
                          </label>
                        </div>
                        <div className="flex items-center">
                          <input type="radio" id="q2-c" name="q2" className="mr-2" />
                          <label htmlFor="q2-c" className="text-gray-300">
                            Voice recognition
                          </label>
                        </div>
                      </div>
                    </div>

                    <div className="border border-gray-700 rounded-lg p-4">
                      <p className="text-white mb-3">3. What happens when a user is inactive for too long?</p>
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <input type="radio" id="q3-a" name="q3" className="mr-2" />
                          <label htmlFor="q3-a" className="text-gray-300">
                            The video pauses automatically
                          </label>
                        </div>
                        <div className="flex items-center">
                          <input type="radio" id="q3-b" name="q3" className="mr-2" />
                          <label htmlFor="q3-b" className="text-gray-300">
                            The user is logged out
                          </label>
                        </div>
                        <div className="flex items-center">
                          <input type="radio" id="q3-c" name="q3" className="mr-2" />
                          <label htmlFor="q3-c" className="text-gray-300">
                            Nothing happens
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Button
                    className="w-full bg-[#57FF31] hover:bg-[#4F46E5] text-black hover:text-white"
                    onClick={() => {
                      // Simulate quiz submission
                      setQuizResults({
                        passed: true,
                        score: 80,
                        correctAnswers: 4,
                        totalQuestions: 5,
                      })
                    }}
                  >
                    Submit Quiz
                  </Button>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <Card className="bg-gray-900 border-gray-700">
        <CardHeader>
          <CardTitle className="text-xl text-white flex items-center">
            <List className="h-5 w-5 mr-2 text-[#57FF31]" />
            Module Lessons
          </CardTitle>
        </CardHeader>

        <CardContent>
          <ScrollArea className="h-[300px] pr-4">
            <div className="space-y-2">
              {module.lessons.map((moduleLesson, index) => {
                const isCurrentLesson = moduleLesson.id === lesson.id
                const lessonCompleted = localStorage.getItem(`lesson-progress-${course.id}-${moduleLesson.id}`)
                const isCompleted = lessonCompleted ? JSON.parse(lessonCompleted).completed : false

                return (
                  <div
                    key={moduleLesson.id}
                    className={`p-3 rounded-lg flex items-center justify-between ${
                      isCurrentLesson ? "bg-[#4F46E5]/20 border border-[#4F46E5]/50" : "bg-gray-800"
                    }`}
                  >
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center mr-3">
                        <span className="text-sm font-medium text-white">{index + 1}</span>
                      </div>

                      <div>
                        <h4 className={`font-medium ${isCurrentLesson ? "text-[#57FF31]" : "text-white"}`}>
                          {moduleLesson.title}
                        </h4>
                        <div className="flex items-center text-sm text-gray-400">
                          <Clock className="h-3 w-3 mr-1" />
                          {moduleLesson.duration}
                        </div>
                      </div>
                    </div>

                    <div>
                      {isCompleted ? (
                        <Badge className="bg-green-600">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Completed
                        </Badge>
                      ) : isCurrentLesson ? (
                        <Badge className="bg-yellow-600">
                          <Clock className="h-3 w-3 mr-1" />
                          In Progress
                        </Badge>
                      ) : (
                        <Badge className="bg-gray-600">
                          <Lock className="h-3 w-3 mr-1" />
                          Locked
                        </Badge>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  )
}

