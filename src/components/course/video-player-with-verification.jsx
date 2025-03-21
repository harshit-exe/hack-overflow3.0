"use client"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  AlertCircle,
  CheckCircle,
  Brain,
  Clock,
  SkipForward,
  Rewind,
  HelpCircle,
  Lock,
  Unlock,
} from "lucide-react"

export default function VideoPlayerWithVerification({
  videoUrl,
  title,
  duration,
  nextLessonUrl,
  courseId,
  lessonId,
  keyPoints = [],
}) {
  // Video player state
  const videoRef = useRef(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [isMuted, setIsMuted] = useState(false)
  const [volume, setVolume] = useState(0.7)
  const [isFullscreen, setIsFullscreen] = useState(false)

  // Engagement verification state
  const [verifications, setVerifications] = useState([])
  const [currentVerification, setCurrentVerification] = useState(null)
  const [verificationAnswer, setVerificationAnswer] = useState("")
  const [verificationResult, setVerificationResult] = useState(null)
  const [attentionScore, setAttentionScore] = useState(100)
  const [watchedSegments, setWatchedSegments] = useState([])
  const [isLessonCompleted, setIsLessonCompleted] = useState(false)
  const [userActivity, setUserActivity] = useState({
    lastActive: Date.now(),
    isActive: true,
    tabVisible: true,
  })

  // Generate verification checkpoints when component mounts
  useEffect(() => {
    if (!videoRef.current) return

    const videoDuration = videoRef.current.duration || Number.parseFloat(duration) * 60
    if (isNaN(videoDuration)) return

    // Generate 3-5 verification points throughout the video
    const numVerifications = Math.floor(Math.random() * 3) + 3
    const newVerifications = []

    // Create verification checkpoints
    for (let i = 0; i < numVerifications; i++) {
      // Distribute checkpoints throughout the video (avoid first and last 10%)
      const minTime = videoDuration * 0.1
      const maxTime = videoDuration * 0.9
      const timeRange = maxTime - minTime

      // Ensure checkpoints are well-distributed
      const segmentSize = timeRange / numVerifications
      const randomOffset = Math.random() * (segmentSize * 0.6)
      const triggerTime = minTime + i * segmentSize + randomOffset

      // Create different types of verifications
      const verificationType = getRandomVerificationType()

      newVerifications.push({
        id: `verification-${i}`,
        triggerTime,
        type: verificationType,
        completed: false,
        ...generateVerificationContent(verificationType, keyPoints),
      })
    }

    setVerifications(newVerifications)
  }, [videoRef.current?.duration, keyPoints, duration])

  // Track video progress
  useEffect(() => {
    if (!videoRef.current) return

    const handleTimeUpdate = () => {
      const video = videoRef.current
      if (!video) return

      const currentProgress = (video.currentTime / video.duration) * 100
      setProgress(currentProgress)
      setCurrentTime(video.currentTime)

      // Track watched segments for completion verification
      updateWatchedSegments(video.currentTime)

      // Check if any verification should be triggered
      checkVerifications(video.currentTime)
    }

    const video = videoRef.current
    video.addEventListener("timeupdate", handleTimeUpdate)

    return () => {
      video.removeEventListener("timeupdate", handleTimeUpdate)
    }
  }, [verifications])

  // Track user activity and tab visibility
  useEffect(() => {
    const handleActivity = () => {
      setUserActivity((prev) => ({
        ...prev,
        lastActive: Date.now(),
        isActive: true,
      }))
    }

    const handleVisibilityChange = () => {
      if (document.hidden && isPlaying) {
        // Pause video if tab is not visible and reduce attention score
        videoRef.current?.pause()
        setIsPlaying(false)
        reduceAttentionScore(5, "Tab switched while video was playing")

        setUserActivity((prev) => ({
          ...prev,
          tabVisible: false,
        }))
      } else {
        setUserActivity((prev) => ({
          ...prev,
          tabVisible: true,
        }))
      }
    }

    // Check for inactivity every 10 seconds
    const inactivityInterval = setInterval(() => {
      const now = Date.now()
      const inactiveTime = now - userActivity.lastActive

      // If inactive for more than 30 seconds while video is playing
      if (inactiveTime > 30000 && isPlaying) {
        reduceAttentionScore(3, "Inactivity detected")

        // Show a random verification to re-engage
        if (Math.random() > 0.7 && !currentVerification) {
          triggerRandomVerification()
        }
      }
    }, 10000)

    // Add event listeners
    window.addEventListener("mousemove", handleActivity)
    window.addEventListener("keydown", handleActivity)
    window.addEventListener("click", handleActivity)
    document.addEventListener("visibilitychange", handleVisibilityChange)

    return () => {
      window.removeEventListener("mousemove", handleActivity)
      window.removeEventListener("keydown", handleActivity)
      window.removeEventListener("click", handleActivity)
      document.removeEventListener("visibilitychange", handleVisibilityChange)
      clearInterval(inactivityInterval)
    }
  }, [isPlaying, userActivity.lastActive])

  // Check for lesson completion
  useEffect(() => {
    if (!videoRef.current) return

    const checkCompletion = () => {
      const video = videoRef.current
      if (!video) return

      // Calculate how much of the video has been watched
      const totalDuration = video.duration
      let watchedDuration = 0

      watchedSegments.forEach((segment) => {
        watchedDuration += segment.end - segment.start
      })

      const watchedPercentage = (watchedDuration / totalDuration) * 100

      // Check if all verifications are completed
      const allVerificationsCompleted = verifications.every((v) => v.completed)

      // Lesson is completed if user watched at least 90% and completed all verifications
      if (watchedPercentage >= 90 && allVerificationsCompleted) {
        setIsLessonCompleted(true)
        saveLessonProgress(true)
      }
    }

    // Check completion whenever watched segments or verifications change
    checkCompletion()
  }, [watchedSegments, verifications])

  // Video control functions
  const togglePlay = () => {
    const video = videoRef.current
    if (!video) return

    if (isPlaying) {
      video.pause()
    } else {
      // Only allow play if there's no active verification
      if (!currentVerification) {
        video.play()
      }
    }

    setIsPlaying(!isPlaying)
  }

  const toggleMute = () => {
    const video = videoRef.current
    if (!video) return

    video.muted = !isMuted
    setIsMuted(!isMuted)
  }

  const handleVolumeChange = (e) => {
    const newVolume = Number.parseFloat(e.target.value)
    const video = videoRef.current
    if (!video) return

    video.volume = newVolume
    setVolume(newVolume)
    setIsMuted(newVolume === 0)
  }

  const toggleFullscreen = () => {
    const videoContainer = document.getElementById("video-container")
    if (!videoContainer) return

    if (!isFullscreen) {
      if (videoContainer.requestFullscreen) {
        videoContainer.requestFullscreen()
      } else if (videoContainer.webkitRequestFullscreen) {
        videoContainer.webkitRequestFullscreen()
      } else if (videoContainer.msRequestFullscreen) {
        videoContainer.msRequestFullscreen()
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen()
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen()
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen()
      }
    }

    setIsFullscreen(!isFullscreen)
  }

  const seekVideo = (time) => {
    const video = videoRef.current
    if (!video) return

    // Don't allow seeking if there's an active verification
    if (currentVerification) return

    // Prevent excessive seeking (which could be used to skip content)
    const lastSeekTime = video.dataset.lastSeekTime || 0
    const now = Date.now()

    if (now - lastSeekTime < 2000) {
      // If seeking too frequently, reduce attention score
      reduceAttentionScore(2, "Excessive seeking detected")
      return
    }

    video.dataset.lastSeekTime = now
    video.currentTime = Math.max(0, Math.min(video.duration, time))
  }

  // Verification and engagement functions
  const checkVerifications = (currentTime) => {
    if (currentVerification) return // Don't trigger new verification if one is active

    verifications.forEach((verification) => {
      if (
        !verification.completed &&
        currentTime >= verification.triggerTime &&
        currentTime < verification.triggerTime + 1
      ) {
        // Pause video and show verification
        videoRef.current.pause()
        setIsPlaying(false)
        setCurrentVerification(verification)
      }
    })
  }

  const triggerRandomVerification = () => {
    // Find incomplete verifications
    const incompleteVerifications = verifications.filter((v) => !v.completed)
    if (incompleteVerifications.length === 0) return

    // Select a random verification
    const randomIndex = Math.floor(Math.random() * incompleteVerifications.length)
    const verification = incompleteVerifications[randomIndex]

    // Pause video and show verification
    videoRef.current.pause()
    setIsPlaying(false)
    setCurrentVerification(verification)
  }

  const handleVerificationSubmit = () => {
    if (!currentVerification) return

    let isCorrect = false

    switch (currentVerification.type) {
      case "quiz":
        isCorrect = verificationAnswer.toLowerCase() === currentVerification.correctAnswer.toLowerCase()
        break
      case "attention":
        isCorrect = verificationAnswer.toLowerCase() === currentVerification.correctAnswer.toLowerCase()
        break
      case "code":
        // Simple code verification - check if answer contains key phrases
        isCorrect = currentVerification.keyPhrases.some((phrase) =>
          verificationAnswer.toLowerCase().includes(phrase.toLowerCase()),
        )
        break
      case "conceptual":
        // Check if answer contains key concepts
        isCorrect = currentVerification.keyPhrases.some((phrase) =>
          verificationAnswer.toLowerCase().includes(phrase.toLowerCase()),
        )
        break
    }

    // Update verification status
    setVerifications((prev) => prev.map((v) => (v.id === currentVerification.id ? { ...v, completed: isCorrect } : v)))

    // Show result
    setVerificationResult({
      isCorrect,
      message: isCorrect
        ? "Correct! You can continue watching."
        : "Incorrect. Please pay closer attention to the video content.",
    })

    // Update attention score
    if (isCorrect) {
      increaseAttentionScore(5)
    } else {
      reduceAttentionScore(10, "Failed verification check")
    }

    // Clear result and continue video after delay
    setTimeout(() => {
      setVerificationResult(null)
      setCurrentVerification(null)
      setVerificationAnswer("")

      // Only auto-play if answer was correct
      if (isCorrect) {
        videoRef.current?.play()
        setIsPlaying(true)
      }
    }, 3000)
  }

  const updateWatchedSegments = (currentTime) => {
    // Track which parts of the video have been watched
    setWatchedSegments((prev) => {
      // Find if current time is part of an existing segment
      const segmentIndex = prev.findIndex(
        (segment) => currentTime >= segment.start - 1 && currentTime <= segment.end + 1,
      )

      if (segmentIndex >= 0) {
        // Extend existing segment
        const updatedSegments = [...prev]
        const segment = updatedSegments[segmentIndex]

        updatedSegments[segmentIndex] = {
          ...segment,
          start: Math.min(segment.start, currentTime),
          end: Math.max(segment.end, currentTime),
        }

        return updatedSegments
      } else {
        // Create new segment
        return [...prev, { start: currentTime, end: currentTime }]
      }
    })
  }

  const reduceAttentionScore = (amount, reason) => {
    console.log(`Attention score reduced by ${amount}: ${reason}`)
    setAttentionScore((prev) => Math.max(0, prev - amount))
  }

  const increaseAttentionScore = (amount) => {
    setAttentionScore((prev) => Math.min(100, prev + amount))
  }

  const saveLessonProgress = (completed) => {
    // Save progress to localStorage or backend
    const progressData = {
      courseId,
      lessonId,
      completed,
      attentionScore,
      watchedPercentage: progress,
      completedAt: completed ? new Date().toISOString() : null,
    }

    // Save to localStorage for demo purposes
    localStorage.setItem(`lesson-progress-${courseId}-${lessonId}`, JSON.stringify(progressData))

    // In a real implementation, you would send this to your backend
    console.log("Saving lesson progress:", progressData)
  }

  // Format time display (MM:SS)
  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60)
    const seconds = Math.floor(timeInSeconds % 60)
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
  }

  // Helper functions for verification generation
  function getRandomVerificationType() {
    const types = ["quiz", "attention", "code", "conceptual"]
    return types[Math.floor(Math.random() * types.length)]
  }

  function generateVerificationContent(type, keyPoints) {
    switch (type) {
      case "quiz":
        return generateQuizVerification(keyPoints)
      case "attention":
        return generateAttentionVerification()
      case "code":
        return generateCodeVerification(keyPoints)
      case "conceptual":
        return generateConceptualVerification(keyPoints)
      default:
        return generateQuizVerification(keyPoints)
    }
  }

  function generateQuizVerification(keyPoints) {
    // Use key points if available, otherwise use generic questions
    if (keyPoints && keyPoints.length > 0) {
      const randomPoint = keyPoints[Math.floor(Math.random() * keyPoints.length)]
      return {
        question: `What was just discussed about ${randomPoint.topic}?`,
        correctAnswer: randomPoint.key,
        keyPhrases: [randomPoint.key],
      }
    }

    // Generic fallback questions
    const questions = [
      { question: "What was the main topic just discussed?", correctAnswer: "concept", keyPhrases: ["concept"] },
      { question: "What technique was just demonstrated?", correctAnswer: "technique", keyPhrases: ["technique"] },
      { question: "What is the key benefit mentioned?", correctAnswer: "efficiency", keyPhrases: ["efficiency"] },
    ]

    return questions[Math.floor(Math.random() * questions.length)]
  }

  function generateAttentionVerification() {
    // Simple attention check
    const symbols = ["🔴", "🟢", "🟡", "🔵"]
    const randomSymbol = symbols[Math.floor(Math.random() * symbols.length)]

    const colorNames = {
      "🔴": "red",
      "🟢": "green",
      "🟡": "yellow",
      "🔵": "blue",
    }

    return {
      question: `What color is this symbol: ${randomSymbol}?`,
      correctAnswer: colorNames[randomSymbol],
      keyPhrases: [colorNames[randomSymbol]],
    }
  }

  function generateCodeVerification(keyPoints) {
    // Code-related verification
    if (keyPoints && keyPoints.length > 0) {
      const codePoints = keyPoints.filter((p) => p.type === "code")
      if (codePoints.length > 0) {
        const randomPoint = codePoints[Math.floor(Math.random() * codePoints.length)]
        return {
          question: `Complete this code snippet: ${randomPoint.snippet}`,
          keyPhrases: randomPoint.solutions || [randomPoint.key],
        }
      }
    }

    // Generic fallback
    return {
      question: "What would be the correct syntax to solve the problem just discussed?",
      keyPhrases: ["function", "return", "const", "let", "var", "if", "else", "for", "while"],
    }
  }

  function generateConceptualVerification(keyPoints) {
    // Conceptual understanding check
    if (keyPoints && keyPoints.length > 0) {
      const randomPoint = keyPoints[Math.floor(Math.random() * keyPoints.length)]
      return {
        question: `Explain the concept of ${randomPoint.topic} in your own words:`,
        keyPhrases: [randomPoint.key, ...(randomPoint.relatedTerms || [])],
      }
    }

    // Generic fallback
    return {
      question: "Explain the main concept that was just covered in your own words:",
      keyPhrases: ["understand", "concept", "important", "key", "fundamental"],
    }
  }

  return (
    <Card className="w-full bg-gray-900 border-gray-700">
      <div id="video-container" className="relative">
        {/* Video Player */}
        <video
          ref={videoRef}
          className="w-full h-auto rounded-t-lg"
          src={videoUrl}
          preload="metadata"
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onEnded={() => {
            setIsPlaying(false)
            // Check if all verifications are completed
            const allCompleted = verifications.every((v) => v.completed)
            if (allCompleted) {
              setIsLessonCompleted(true)
              saveLessonProgress(true)
            }
          }}
        />

        {/* Verification Overlay */}
        {currentVerification && (
          <div className="absolute inset-0 bg-black/90 flex flex-col items-center justify-center p-6 z-10">
            <div className="bg-gray-800 p-6 rounded-lg max-w-md w-full">
              <div className="mb-4 flex items-center">
                {currentVerification.type === "quiz" && <HelpCircle className="text-yellow-400 mr-2" />}
                {currentVerification.type === "attention" && <AlertCircle className="text-red-400 mr-2" />}
                {currentVerification.type === "code" && <Code className="text-blue-400 mr-2" />}
                {currentVerification.type === "conceptual" && <Brain className="text-purple-400 mr-2" />}

                <h3 className="text-lg font-bold text-white">
                  {currentVerification.type === "quiz" && "Knowledge Check"}
                  {currentVerification.type === "attention" && "Attention Check"}
                  {currentVerification.type === "code" && "Code Challenge"}
                  {currentVerification.type === "conceptual" && "Concept Check"}
                </h3>
              </div>

              <p className="text-white mb-4">{currentVerification.question}</p>

              <Input
                type="text"
                value={verificationAnswer}
                onChange={(e) => setVerificationAnswer(e.target.value)}
                placeholder="Your answer..."
                className="mb-4 bg-gray-700 border-gray-600 text-white"
              />

              <Button
                onClick={handleVerificationSubmit}
                className="w-full bg-[#57FF31] hover:bg-[#4F46E5] text-black hover:text-white"
              >
                Submit Answer
              </Button>

              {verificationResult && (
                <div
                  className={`mt-4 p-3 rounded-lg ${verificationResult.isCorrect ? "bg-green-900/50" : "bg-red-900/50"}`}
                >
                  <div className="flex items-center">
                    {verificationResult.isCorrect ? (
                      <CheckCircle className="text-green-400 mr-2" />
                    ) : (
                      <AlertCircle className="text-red-400 mr-2" />
                    )}
                    <p className="text-white">{verificationResult.message}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Video Controls */}
        <div className="absolute bottom-0 left-0 right-0 bg-black/70 p-2 flex flex-col">
          {/* Progress bar */}
          <div className="w-full mb-2 relative">
            <Progress value={progress} className="h-2" />

            {/* Watched segments visualization */}
            <div className="absolute top-0 left-0 right-0 h-2">
              {watchedSegments.map((segment, index) => {
                const startPercent = (segment.start / (videoRef.current?.duration || 1)) * 100
                const endPercent = (segment.end / (videoRef.current?.duration || 1)) * 100
                const width = endPercent - startPercent

                return (
                  <div
                    key={index}
                    className="absolute h-full bg-[#57FF31]/50"
                    style={{
                      left: `${startPercent}%`,
                      width: `${width}%`,
                    }}
                  />
                )
              })}
            </div>

            {/* Verification markers */}
            {verifications.map((verification, index) => {
              const position = (verification.triggerTime / (videoRef.current?.duration || 1)) * 100

              return (
                <div
                  key={index}
                  className={`absolute top-0 w-2 h-2 rounded-full transform -translate-x-1/2 -translate-y-1/2 ${verification.completed ? "bg-green-500" : "bg-yellow-500"}`}
                  style={{ left: `${position}%`, top: "50%" }}
                />
              )
            })}
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="icon" onClick={togglePlay} className="text-white hover:bg-gray-700">
                {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
              </Button>

              <Button
                variant="ghost"
                size="icon"
                onClick={() => seekVideo(videoRef.current?.currentTime - 10)}
                className="text-white hover:bg-gray-700"
              >
                <Rewind className="h-5 w-5" />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                onClick={() => seekVideo(videoRef.current?.currentTime + 10)}
                className="text-white hover:bg-gray-700"
                disabled={currentVerification !== null}
              >
                <SkipForward className="h-5 w-5" />
              </Button>

              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="icon" onClick={toggleMute} className="text-white hover:bg-gray-700">
                  {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
                </Button>

                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={volume}
                  onChange={handleVolumeChange}
                  className="w-20 accent-[#57FF31]"
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-white text-sm">
                {formatTime(currentTime)} / {formatTime(videoRef.current?.duration || 0)}
              </span>

              <div className="flex items-center">
                <Badge
                  className={`${attentionScore > 70 ? "bg-green-600" : attentionScore > 40 ? "bg-yellow-600" : "bg-red-600"}`}
                >
                  <Brain className="h-3 w-3 mr-1" />
                  {attentionScore}%
                </Badge>
              </div>

              <Button variant="ghost" size="icon" onClick={toggleFullscreen} className="text-white hover:bg-gray-700">
                <Maximize className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <CardContent className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-white">{title}</h2>

          <div className="flex items-center">
            <Badge className="bg-gray-700 text-white mr-2">
              <Clock className="h-3 w-3 mr-1" />
              {duration}
            </Badge>

            {isLessonCompleted ? (
              <Badge className="bg-green-600 text-white">
                <CheckCircle className="h-3 w-3 mr-1" />
                Completed
              </Badge>
            ) : (
              <Badge className="bg-yellow-600 text-white">
                <Lock className="h-3 w-3 mr-1" />
                In Progress
              </Badge>
            )}
          </div>
        </div>

        {/* Next lesson button */}
        {isLessonCompleted && nextLessonUrl && (
          <Button
            className="w-full bg-[#57FF31] hover:bg-[#4F46E5] text-black hover:text-white mt-2"
            onClick={() => (window.location.href = nextLessonUrl)}
          >
            Continue to Next Lesson
            <Unlock className="ml-2 h-4 w-4" />
          </Button>
        )}
      </CardContent>
    </Card>
  )
}

// Helper component for code icon
function Code(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="16 18 22 12 16 6"></polyline>
      <polyline points="8 6 2 12 8 18"></polyline>
    </svg>
  )
}

