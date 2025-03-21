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
  AlertCircle,
  CheckCircle,
  Clock,
  Lock,
  Unlock,
  MousePointer,
  Fingerprint,
} from "lucide-react"

export default function InteractiveVideoPlayer({ videoUrl, title, duration, nextLessonUrl, courseId, lessonId }) {
  // Video player state
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [isMuted, setIsMuted] = useState(false)
  const [volume, setVolume] = useState(0.7)

  // Interactive elements state
  const [interactiveElements, setInteractiveElements] = useState([])
  const [activeElement, setActiveElement] = useState(null)
  const [elementResponse, setElementResponse] = useState("")
  const [elementResult, setElementResult] = useState(null)
  const [watchedTime, setWatchedTime] = useState(0)
  const [requiredWatchTime, setRequiredWatchTime] = useState(0)
  const [isLessonCompleted, setIsLessonCompleted] = useState(false)
  const [lastActivityTime, setLastActivityTime] = useState(Date.now())
  const [isUserActive, setIsUserActive] = useState(true)
  const [fingerprints, setFingerprints] = useState([])
  const [currentFingerprint, setCurrentFingerprint] = useState(null)

  // Initialize video and interactive elements
  useEffect(() => {
    if (!videoRef.current) return

    videoRef.current.onloadedmetadata = () => {
      const videoDuration = videoRef.current.duration
      setRequiredWatchTime(videoDuration * 0.9) // 90% of video must be watched

      // Generate interactive elements
      generateInteractiveElements(videoDuration)

      // Generate fingerprint verification points
      generateFingerprints(videoDuration)
    }
  }, [])

  // Generate interactive elements throughout the video
  const generateInteractiveElements = (duration) => {
    const elements = []
    const numElements = Math.floor(duration / 45) + 3 // Roughly one element every 45 seconds

    for (let i = 0; i < numElements; i++) {
      // Distribute elements throughout video (avoid first and last 10%)
      const minTime = duration * 0.1
      const maxTime = duration * 0.9
      const timeRange = maxTime - minTime

      // Ensure elements are well-distributed
      const segmentSize = timeRange / numElements
      const randomOffset = Math.random() * (segmentSize * 0.6)
      const triggerTime = minTime + i * segmentSize + randomOffset

      elements.push({
        id: `element-${i}`,
        time: triggerTime,
        type: getRandomElementType(),
        completed: false,
        ...generateElementContent(),
      })
    }

    setInteractiveElements(elements)
  }

  // Generate fingerprint verification points
  const generateFingerprints = (duration) => {
    const prints = []
    const numPrints = Math.floor(duration / 120) + 2 // Roughly one fingerprint every 2 minutes

    for (let i = 0; i < numPrints; i++) {
      // Distribute fingerprints throughout video
      const segmentSize = duration / numPrints
      const randomOffset = Math.random() * (segmentSize * 0.7)
      const triggerTime = i * segmentSize + randomOffset

      prints.push({
        id: `fingerprint-${i}`,
        time: triggerTime,
        completed: false,
        code: generateFingerprintCode(),
      })
    }

    setFingerprints(prints)
  }

  // Track video progress and check for interactive elements
  useEffect(() => {
    if (!videoRef.current) return

    const handleTimeUpdate = () => {
      const video = videoRef.current
      if (!video) return

      const currentProgress = (video.currentTime / video.duration) * 100
      setProgress(currentProgress)
      setCurrentTime(video.currentTime)

      // Update watched time if user is active
      if (isPlaying && isUserActive) {
        setWatchedTime((prev) => {
          // Only increment if we haven't counted this second already
          const currentSecond = Math.floor(video.currentTime)
          const prevSecond = Math.floor(prev)

          if (currentSecond > prevSecond) {
            return video.currentTime
          }
          return prev
        })
      }

      // Check if any interactive element should be triggered
      checkInteractiveElements(video.currentTime)

      // Check if any fingerprint verification should be triggered
      checkFingerprints(video.currentTime)

      // Check for lesson completion
      if (
        watchedTime >= requiredWatchTime &&
        interactiveElements.every((el) => el.completed) &&
        fingerprints.every((fp) => fp.completed)
      ) {
        setIsLessonCompleted(true)
        saveLessonProgress(true)
      }
    }

    const video = videoRef.current
    video.addEventListener("timeupdate", handleTimeUpdate)

    return () => {
      video.removeEventListener("timeupdate", handleTimeUpdate)
    }
  }, [isPlaying, isUserActive, watchedTime, interactiveElements, fingerprints, requiredWatchTime])

  // Track user activity
  useEffect(() => {
    const handleActivity = () => {
      setLastActivityTime(Date.now())
      setIsUserActive(true)
    }

    // Check for inactivity every 5 seconds
    const inactivityInterval = setInterval(() => {
      const now = Date.now()
      const inactiveTime = now - lastActivityTime

      // If inactive for more than 20 seconds while video is playing
      if (inactiveTime > 20000 && isPlaying) {
        setIsUserActive(false)

        // Pause video if user is inactive
        if (videoRef.current) {
          videoRef.current.pause()
          setIsPlaying(false)
        }

        // Show an alert
        alert("Video paused due to inactivity. Move your mouse or press a key to continue.")
      }
    }, 5000)

    // Add event listeners
    window.addEventListener("mousemove", handleActivity)
    window.addEventListener("keydown", handleActivity)
    window.addEventListener("click", handleActivity)

    return () => {
      window.removeEventListener("mousemove", handleActivity)
      window.removeEventListener("keydown", handleActivity)
      window.removeEventListener("click", handleActivity)
      clearInterval(inactivityInterval)
    }
  }, [isPlaying, lastActivityTime])

  // Video control functions
  const togglePlay = () => {
    const video = videoRef.current
    if (!video) return

    if (isPlaying) {
      video.pause()
      setIsPlaying(false)
    } else {
      // Only allow play if there's no active element or fingerprint
      if (!activeElement && !currentFingerprint) {
        video.play()
        setIsPlaying(true)
      }
    }
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

  // Interactive elements and fingerprint functions
  const checkInteractiveElements = (currentTime) => {
    if (activeElement || currentFingerprint) return // Don't trigger new element if one is active

    interactiveElements.forEach((element) => {
      if (!element.completed && currentTime >= element.time && currentTime < element.time + 1) {
        // Pause video and show interactive element
        videoRef.current.pause()
        setIsPlaying(false)
        setActiveElement(element)
      }
    })
  }

  const checkFingerprints = (currentTime) => {
    if (activeElement || currentFingerprint) return // Don't trigger new fingerprint if something is active

    fingerprints.forEach((fingerprint) => {
      if (!fingerprint.completed && currentTime >= fingerprint.time && currentTime < fingerprint.time + 1) {
        // Pause video and show fingerprint verification
        videoRef.current.pause()
        setIsPlaying(false)
        setCurrentFingerprint(fingerprint)
      }
    })
  }

  const handleElementResponse = () => {
    if (!activeElement) return

    let isCorrect = false

    // Check if the response is correct based on element type
    switch (activeElement.type) {
      case "click":
        // For click elements, just completing the interaction is correct
        isCorrect = true
        break
      case "input":
        isCorrect = elementResponse.toLowerCase() === activeElement.answer.toLowerCase()
        break
      case "drag":
        // For drag elements, just completing the interaction is correct
        isCorrect = true
        break
    }

    // Update element status
    setInteractiveElements((prev) =>
      prev.map((el) => (el.id === activeElement.id ? { ...el, completed: isCorrect } : el)),
    )

    // Show result
    setElementResult({
      isCorrect,
      message: isCorrect ? "Good job! You can continue watching." : "Incorrect. Please try again.",
    })

    // Clear result and continue video after delay
    setTimeout(() => {
      setElementResult(null)

      if (isCorrect) {
        setActiveElement(null)
        setElementResponse("")

        // Auto-play if answer was correct
        videoRef.current?.play()
        setIsPlaying(true)
      } else {
        // For incorrect answers, keep the element active but clear the response
        setElementResponse("")
      }
    }, 2000)
  }

  const handleFingerprintVerification = () => {
    if (!currentFingerprint) return

    // Mark fingerprint as completed
    setFingerprints((prev) => prev.map((fp) => (fp.id === currentFingerprint.id ? { ...fp, completed: true } : fp)))

    // Clear fingerprint and continue video
    setTimeout(() => {
      setCurrentFingerprint(null)
      videoRef.current?.play()
      setIsPlaying(true)
    }, 1500)
  }

  const saveLessonProgress = (completed) => {
    // Save progress to localStorage or backend
    const progressData = {
      courseId,
      lessonId,
      completed,
      watchedTime,
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

  // Helper functions for element generation
  function getRandomElementType() {
    const types = ["click", "input", "drag"]
    return types[Math.floor(Math.random() * types.length)]
  }

  function generateElementContent() {
    const type = getRandomElementType()

    switch (type) {
      case "click":
        return {
          instruction: "Click on the highlighted area to continue",
          targetArea: {
            x: Math.random() * 80 + 10, // 10-90% of width
            y: Math.random() * 80 + 10, // 10-90% of height
            size: 50,
          },
        }
      case "input":
        const questions = [
          { question: "What is 2+3?", answer: "5" },
          { question: "What color is the sky?", answer: "blue" },
          { question: "Type the word 'continue' to proceed", answer: "continue" },
          { question: "What is the first letter of the alphabet?", answer: "a" },
        ]
        const randomQuestion = questions[Math.floor(Math.random() * questions.length)]
        return {
          instruction: randomQuestion.question,
          answer: randomQuestion.answer,
        }
      case "drag":
        return {
          instruction: "Drag the circle to the target area",
          startPosition: {
            x: 20,
            y: 50,
          },
          targetPosition: {
            x: 80,
            y: 50,
          },
        }
      default:
        return {
          instruction: "Click to continue",
          answer: "",
        }
    }
  }

  function generateFingerprintCode() {
    // Generate a random 4-digit code
    return Math.floor(1000 + Math.random() * 9000).toString()
  }

  return (
    <Card className="w-full bg-gray-900 border-gray-700">
      <div className="relative">
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
            // Check completion
            if (
              watchedTime >= requiredWatchTime &&
              interactiveElements.every((el) => el.completed) &&
              fingerprints.every((fp) => fp.completed)
            ) {
              setIsLessonCompleted(true)
              saveLessonProgress(true)
            }
          }}
        />

        {/* Interactive Canvas Overlay */}
        <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full pointer-events-none" />

        {/* Interactive Element Overlay */}
        {activeElement && (
          <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center p-6 z-10">
            <div className="bg-gray-800 p-6 rounded-lg max-w-md w-full">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                <MousePointer className="text-[#57FF31] mr-2" />
                Interactive Check
              </h3>

              <p className="text-white mb-6">{activeElement.instruction}</p>

              {activeElement.type === "click" && (
                <div className="relative h-40 bg-gray-700 rounded-lg mb-4">
                  <div
                    className="absolute w-12 h-12 rounded-full bg-[#57FF31] animate-pulse cursor-pointer"
                    style={{
                      left: `${activeElement.targetArea.x}%`,
                      top: `${activeElement.targetArea.y}%`,
                      transform: "translate(-50%, -50%)",
                    }}
                    onClick={handleElementResponse}
                  />
                </div>
              )}

              {activeElement.type === "input" && (
                <>
                  <Input
                    type="text"
                    value={elementResponse}
                    onChange={(e) => setElementResponse(e.target.value)}
                    placeholder="Your answer..."
                    className="mb-4 bg-gray-700 border-gray-600 text-white"
                  />

                  <Button
                    onClick={handleElementResponse}
                    className="w-full bg-[#57FF31] hover:bg-[#4F46E5] text-black hover:text-white"
                  >
                    Submit Answer
                  </Button>
                </>
              )}

              {activeElement.type === "drag" && (
                <div className="relative h-40 bg-gray-700 rounded-lg mb-4">
                  <div
                    className="absolute w-16 h-16 rounded-full border-2 border-dashed border-[#57FF31]"
                    style={{
                      left: `${activeElement.targetPosition.x}%`,
                      top: `${activeElement.targetPosition.y}%`,
                      transform: "translate(-50%, -50%)",
                    }}
                  />

                  <div
                    className="absolute w-12 h-12 rounded-full bg-[#4F46E5] cursor-move"
                    style={{
                      left: `${activeElement.startPosition.x}%`,
                      top: `${activeElement.startPosition.y}%`,
                      transform: "translate(-50%, -50%)",
                    }}
                    // In a real implementation, this would use drag events
                    onClick={handleElementResponse}
                  />
                </div>
              )}

              {elementResult && (
                <div className={`mt-4 p-3 rounded-lg ${elementResult.isCorrect ? "bg-green-900/50" : "bg-red-900/50"}`}>
                  <div className="flex items-center">
                    {elementResult.isCorrect ? (
                      <CheckCircle className="text-green-400 mr-2" />
                    ) : (
                      <AlertCircle className="text-red-400 mr-2" />
                    )}
                    <p className="text-white">{elementResult.message}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Fingerprint Verification Overlay */}
        {currentFingerprint && (
          <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center p-6 z-10">
            <div className="bg-gray-800 p-6 rounded-lg max-w-md w-full text-center">
              <Fingerprint className="h-16 w-16 mx-auto mb-4 text-[#57FF31]" />
              <h3 className="text-xl font-bold text-white mb-2">Verification Required</h3>
              <p className="text-gray-300 mb-6">
                Please enter the following code to verify your presence and continue watching:
              </p>

              <div className="bg-gray-700 p-4 rounded-lg mb-6">
                <span className="text-3xl font-mono tracking-widest text-white">{currentFingerprint.code}</span>
              </div>

              <Input
                type="text"
                placeholder="Enter the code above"
                className="mb-4 bg-gray-700 border-gray-600 text-white text-center"
                onChange={(e) => {
                  // Auto-verify when the correct code is entered
                  if (e.target.value === currentFingerprint.code) {
                    handleFingerprintVerification()
                  }
                }}
              />

              <p className="text-sm text-gray-400">
                This verification ensures you're actively watching the course content.
              </p>
            </div>
          </div>
        )}

        {/* Video Controls */}
        <div className="absolute bottom-0 left-0 right-0 bg-black/70 p-2 flex flex-col">
          {/* Progress bar */}
          <div className="w-full mb-2">
            <Progress value={progress} className="h-2" />

            {/* Interactive element markers */}
            <div className="relative h-0">
              {interactiveElements.map((element, index) => {
                const position = (element.time / (videoRef.current?.duration || 1)) * 100

                return (
                  <div
                    key={index}
                    className={`absolute top-[-8px] w-3 h-3 rounded-full transform -translate-x-1/2 ${
                      element.completed ? "bg-green-500" : "bg-[#57FF31]"
                    }`}
                    style={{ left: `${position}%` }}
                  />
                )
              })}

              {/* Fingerprint markers */}
              {fingerprints.map((fingerprint, index) => {
                const position = (fingerprint.time / (videoRef.current?.duration || 1)) * 100

                return (
                  <div
                    key={index}
                    className={`absolute top-[-8px] w-3 h-3 rounded-full transform -translate-x-1/2 ${
                      fingerprint.completed ? "bg-green-500" : "bg-[#4F46E5]"
                    }`}
                    style={{ left: `${position}%` }}
                  />
                )
              })}
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={togglePlay}
                className="text-white hover:bg-gray-700"
                disabled={!!activeElement || !!currentFingerprint}
              >
                {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
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

        <div className="bg-gray-800 rounded-lg p-4 mb-4">
          <div className="flex items-center mb-2">
            <div className="w-full bg-gray-700 h-4 rounded-full overflow-hidden">
              <div
                className="bg-[#57FF31] h-full"
                style={{ width: `${(watchedTime / requiredWatchTime) * 100}%` }}
              ></div>
            </div>
            <span className="ml-2 text-white text-sm whitespace-nowrap">
              {Math.round((watchedTime / requiredWatchTime) * 100)}%
            </span>
          </div>
          <p className="text-gray-300 text-sm">
            You must watch at least 90% of the video and complete all interactive elements to mark this lesson as
            complete.
          </p>
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

