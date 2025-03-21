"use client"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Play, Pause, Volume2, VolumeX, AlertCircle, CheckCircle, Clock, Camera, Eye, Lock, Unlock } from "lucide-react"

export default function BiometricVideoPlayer({ videoUrl, title, duration, nextLessonUrl, courseId, lessonId }) {
  // Video player state
  const videoRef = useRef(null)
  const webcamRef = useRef(null)
  const canvasRef = useRef(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [isMuted, setIsMuted] = useState(false)
  const [volume, setVolume] = useState(0.7)

  // Biometric verification state
  const [biometricEnabled, setBiometricEnabled] = useState(false)
  const [faceDetected, setFaceDetected] = useState(false)
  const [eyesDetected, setEyesDetected] = useState(false)
  const [attentionScore, setAttentionScore] = useState(100)
  const [watchTime, setWatchTime] = useState(0)
  const [requiredWatchTime, setRequiredWatchTime] = useState(0)
  const [isLessonCompleted, setIsLessonCompleted] = useState(false)
  const [interactionPoints, setInteractionPoints] = useState([])
  const [currentInteraction, setCurrentInteraction] = useState(null)
  const [interactionResponse, setInteractionResponse] = useState("")
  const [interactionResult, setInteractionResult] = useState(null)

  // Face-api.js models
  const [modelsLoaded, setModelsLoaded] = useState(false)

  // Initialize face detection and video duration
  useEffect(() => {
    // Load face-api.js models (in a real implementation)
    const loadModels = async () => {
      try {
        // Simulate loading face detection models
        await new Promise((resolve) => setTimeout(resolve, 1000))
        setModelsLoaded(true)
        console.log("Face detection models loaded")
      } catch (error) {
        console.error("Error loading face detection models:", error)
      }
    }

    loadModels()

    // Set required watch time based on video duration
    if (videoRef.current) {
      videoRef.current.onloadedmetadata = () => {
        const videoDuration = videoRef.current.duration
        setRequiredWatchTime(videoDuration * 0.9) // 90% of video must be watched

        // Generate interaction points
        generateInteractionPoints(videoDuration)
      }
    }

    return () => {
      // Clean up webcam stream if active
      if (webcamRef.current && webcamRef.current.srcObject) {
        const stream = webcamRef.current.srcObject
        const tracks = stream.getTracks()
        tracks.forEach((track) => track.stop())
      }
    }
  }, [])

  // Generate interaction points throughout the video
  const generateInteractionPoints = (duration) => {
    const points = []
    const numPoints = Math.floor(duration / 60) + 2 // Roughly one interaction every minute

    for (let i = 0; i < numPoints; i++) {
      // Distribute points throughout video (avoid first and last 10%)
      const minTime = duration * 0.1
      const maxTime = duration * 0.9
      const timeRange = maxTime - minTime

      // Ensure points are well-distributed
      const segmentSize = timeRange / numPoints
      const randomOffset = Math.random() * (segmentSize * 0.6)
      const triggerTime = minTime + i * segmentSize + randomOffset

      points.push({
        id: `interaction-${i}`,
        time: triggerTime,
        type: getRandomInteractionType(),
        completed: false,
        ...generateInteractionContent(),
      })
    }

    setInteractionPoints(points)
  }

  // Start webcam for biometric verification
  const startWebcam = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: 320,
          height: 240,
          facingMode: "user",
        },
      })

      if (webcamRef.current) {
        webcamRef.current.srcObject = stream
        setBiometricEnabled(true)

        // Start face detection loop
        detectFace()
      }
    } catch (error) {
      console.error("Error accessing webcam:", error)
      alert("Webcam access is required to verify your attention. Please allow camera access.")
    }
  }

  // Face and eye detection function
  const detectFace = async () => {
    if (!webcamRef.current || !canvasRef.current || !modelsLoaded) return

    const detectInterval = setInterval(async () => {
      if (!webcamRef.current || !isPlaying) {
        clearInterval(detectInterval)
        return
      }

      try {
        // In a real implementation, this would use face-api.js to detect faces and eyes
        // For this demo, we'll simulate face detection with random results

        // Simulate face detection (90% chance of success)
        const faceDetectionResult = Math.random() > 0.1
        setFaceDetected(faceDetectionResult)

        // Simulate eye detection (85% chance of success if face is detected)
        const eyeDetectionResult = faceDetectionResult && Math.random() > 0.15
        setEyesDetected(eyeDetectionResult)

        // Update attention score based on detection results
        if (!faceDetectionResult) {
          reduceAttentionScore(5, "Face not detected")
          if (isPlaying) {
            videoRef.current.pause()
            setIsPlaying(false)
          }
        } else if (!eyeDetectionResult) {
          reduceAttentionScore(3, "Eyes not focused on screen")
        } else {
          // Slowly recover attention score if everything is good
          increaseAttentionScore(1)
        }

        // Draw detection results on canvas (in a real implementation)
        const ctx = canvasRef.current.getContext("2d")
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)

        if (faceDetectionResult) {
          // Simulate drawing face detection box
          ctx.strokeStyle = eyeDetectionResult ? "#57FF31" : "#FFA500"
          ctx.lineWidth = 2
          ctx.strokeRect(110, 70, 100, 100)

          if (eyeDetectionResult) {
            // Simulate drawing eye detection
            ctx.fillStyle = "#57FF31"
            ctx.fillRect(135, 110, 15, 10)
            ctx.fillRect(170, 110, 15, 10)
          }
        }
      } catch (error) {
        console.error("Error in face detection:", error)
      }
    }, 1000) // Check every second

    return () => clearInterval(detectInterval)
  }

  // Track video progress and check for interaction points
  useEffect(() => {
    if (!videoRef.current) return

    const handleTimeUpdate = () => {
      const video = videoRef.current
      if (!video) return

      const currentProgress = (video.currentTime / video.duration) * 100
      setProgress(currentProgress)
      setCurrentTime(video.currentTime)

      // Update watch time if face and eyes are detected
      if (isPlaying && faceDetected && eyesDetected) {
        setWatchTime((prev) => prev + 0.25) // Increment by 0.25 seconds
      }

      // Check if any interaction should be triggered
      checkInteractionPoints(video.currentTime)

      // Check for lesson completion
      if (watchTime >= requiredWatchTime && interactionPoints.every((point) => point.completed)) {
        setIsLessonCompleted(true)
        saveLessonProgress(true)
      }
    }

    const video = videoRef.current
    video.addEventListener("timeupdate", handleTimeUpdate)

    return () => {
      video.removeEventListener("timeupdate", handleTimeUpdate)
    }
  }, [isPlaying, faceDetected, eyesDetected, watchTime, interactionPoints, requiredWatchTime])

  // Video control functions
  const togglePlay = () => {
    const video = videoRef.current
    if (!video) return

    if (isPlaying) {
      video.pause()
      setIsPlaying(false)
    } else {
      // Only allow play if biometric verification is enabled or there's an active interaction
      if (biometricEnabled || currentInteraction) {
        video.play()
        setIsPlaying(true)
      } else {
        // Prompt to enable biometric verification
        alert("Please enable attention verification to play the video")
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

  // Interaction and verification functions
  const checkInteractionPoints = (currentTime) => {
    if (currentInteraction) return // Don't trigger new interaction if one is active

    interactionPoints.forEach((point) => {
      if (!point.completed && currentTime >= point.time && currentTime < point.time + 1) {
        // Pause video and show interaction
        videoRef.current.pause()
        setIsPlaying(false)
        setCurrentInteraction(point)
      }
    })
  }

  const handleInteractionSubmit = () => {
    if (!currentInteraction) return

    let isCorrect = false

    // Check if the response is correct based on interaction type
    switch (currentInteraction.type) {
      case "color":
        isCorrect = interactionResponse.toLowerCase() === currentInteraction.answer.toLowerCase()
        break
      case "number":
        isCorrect = interactionResponse === currentInteraction.answer
        break
      case "shape":
        isCorrect = interactionResponse.toLowerCase() === currentInteraction.answer.toLowerCase()
        break
    }

    // Update interaction status
    setInteractionPoints((prev) =>
      prev.map((p) => (p.id === currentInteraction.id ? { ...p, completed: isCorrect } : p)),
    )

    // Show result
    setInteractionResult({
      isCorrect,
      message: isCorrect
        ? "Correct! You can continue watching."
        : "Incorrect. Please pay closer attention to the video.",
    })

    // Update attention score
    if (isCorrect) {
      increaseAttentionScore(5)
    } else {
      reduceAttentionScore(10, "Failed interaction check")
    }

    // Clear result and continue video after delay
    setTimeout(() => {
      setInteractionResult(null)
      setCurrentInteraction(null)
      setInteractionResponse("")

      // Only auto-play if answer was correct
      if (isCorrect && biometricEnabled) {
        videoRef.current?.play()
        setIsPlaying(true)
      }
    }, 2000)
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
      watchTime,
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

  // Helper functions for interaction generation
  function getRandomInteractionType() {
    const types = ["color", "number", "shape"]
    return types[Math.floor(Math.random() * types.length)]
  }

  function generateInteractionContent() {
    const type = getRandomInteractionType()

    switch (type) {
      case "color":
        const colors = ["red", "blue", "green", "yellow", "purple", "orange"]
        const randomColor = colors[Math.floor(Math.random() * colors.length)]
        return {
          question: "What color is this?",
          visual: randomColor,
          answer: randomColor,
        }
      case "number":
        const randomNumber = Math.floor(Math.random() * 10) + 1
        return {
          question: "What number do you see?",
          visual: randomNumber.toString(),
          answer: randomNumber.toString(),
        }
      case "shape":
        const shapes = ["circle", "square", "triangle", "star", "heart"]
        const randomShape = shapes[Math.floor(Math.random() * shapes.length)]
        return {
          question: "What shape is this?",
          visual: randomShape,
          answer: randomShape,
        }
      default:
        return {
          question: "What color is this?",
          visual: "blue",
          answer: "blue",
        }
    }
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
            // Check if all interactions are completed
            if (interactionPoints.every((p) => p.completed)) {
              setIsLessonCompleted(true)
              saveLessonProgress(true)
            }
          }}
        />

        {/* Biometric Verification Overlay */}
        {!biometricEnabled && !currentInteraction && (
          <div className="absolute inset-0 bg-black/90 flex flex-col items-center justify-center p-6 z-10">
            <div className="bg-gray-800 p-6 rounded-lg max-w-md w-full text-center">
              <Camera className="h-16 w-16 mx-auto mb-4 text-[#57FF31]" />
              <h3 className="text-xl font-bold text-white mb-2">Attention Verification Required</h3>
              <p className="text-gray-300 mb-6">
                This course uses attention verification technology to ensure you're actively watching and learning. Your
                webcam will be used to verify your presence, but no video is recorded or stored.
              </p>
              <Button
                onClick={startWebcam}
                className="w-full bg-[#57FF31] hover:bg-[#4F46E5] text-black hover:text-white"
              >
                Enable Attention Verification
              </Button>
            </div>
          </div>
        )}

        {/* Webcam Feed (small overlay) */}
        {biometricEnabled && (
          <div className="absolute top-4 right-4 z-10 bg-black/50 rounded-lg p-1 border border-gray-700">
            <div className="relative">
              <video ref={webcamRef} autoPlay muted playsInline className="w-32 h-24 rounded" />
              <canvas ref={canvasRef} width={320} height={240} className="absolute top-0 left-0 w-32 h-24 rounded" />
              <div className="absolute bottom-1 right-1">
                <Badge className={`${faceDetected && eyesDetected ? "bg-green-600" : "bg-red-600"}`}>
                  <Eye className="h-3 w-3 mr-1" />
                  {faceDetected && eyesDetected ? "Focused" : "Look at screen"}
                </Badge>
              </div>
            </div>
          </div>
        )}

        {/* Interactive Verification Overlay */}
        {currentInteraction && (
          <div className="absolute inset-0 bg-black/90 flex flex-col items-center justify-center p-6 z-20">
            <div className="bg-gray-800 p-6 rounded-lg max-w-md w-full text-center">
              <h3 className="text-xl font-bold text-white mb-4">Attention Check</h3>

              <div className="mb-6">
                {currentInteraction.type === "color" && (
                  <div
                    className="w-32 h-32 mx-auto rounded-lg mb-4"
                    style={{ backgroundColor: currentInteraction.visual }}
                  ></div>
                )}

                {currentInteraction.type === "number" && (
                  <div className="w-32 h-32 mx-auto rounded-lg bg-gray-700 flex items-center justify-center mb-4">
                    <span className="text-6xl font-bold text-white">{currentInteraction.visual}</span>
                  </div>
                )}

                {currentInteraction.type === "shape" && (
                  <div className="w-32 h-32 mx-auto rounded-lg bg-gray-700 flex items-center justify-center mb-4">
                    {currentInteraction.visual === "circle" && (
                      <div className="w-20 h-20 rounded-full bg-[#57FF31]"></div>
                    )}
                    {currentInteraction.visual === "square" && <div className="w-20 h-20 bg-[#57FF31]"></div>}
                    {currentInteraction.visual === "triangle" && (
                      <div className="w-0 h-0 border-l-[40px] border-r-[40px] border-b-[60px] border-l-transparent border-r-transparent border-b-[#57FF31]"></div>
                    )}
                    {currentInteraction.visual === "star" && (
                      <svg width="60" height="60" viewBox="0 0 24 24" fill="#57FF31">
                        <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
                      </svg>
                    )}
                    {currentInteraction.visual === "heart" && (
                      <svg width="60" height="60" viewBox="0 0 24 24" fill="#57FF31">
                        <path d="M12,21.35L10.55,20.03C5.4,15.36 2,12.27 2,8.5C2,5.41 4.42,3 7.5,3C9.24,3 10.91,3.81 12,5.08C13.09,3.81 14.76,3 16.5,3C19.58,3 22,5.41 22,8.5C22,12.27 18.6,15.36 13.45,20.03L12,21.35Z" />
                      </svg>
                    )}
                  </div>
                )}

                <p className="text-white text-lg">{currentInteraction.question}</p>
              </div>

              <Input
                type="text"
                value={interactionResponse}
                onChange={(e) => setInteractionResponse(e.target.value)}
                placeholder="Your answer..."
                className="mb-4 bg-gray-700 border-gray-600 text-white"
              />

              <Button
                onClick={handleInteractionSubmit}
                className="w-full bg-[#57FF31] hover:bg-[#4F46E5] text-black hover:text-white"
              >
                Submit Answer
              </Button>

              {interactionResult && (
                <div
                  className={`mt-4 p-3 rounded-lg ${interactionResult.isCorrect ? "bg-green-900/50" : "bg-red-900/50"}`}
                >
                  <div className="flex items-center justify-center">
                    {interactionResult.isCorrect ? (
                      <CheckCircle className="text-green-400 mr-2" />
                    ) : (
                      <AlertCircle className="text-red-400 mr-2" />
                    )}
                    <p className="text-white">{interactionResult.message}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Video Controls */}
        <div className="absolute bottom-0 left-0 right-0 bg-black/70 p-2 flex flex-col">
          {/* Progress bar */}
          <div className="w-full mb-2">
            <Progress value={progress} className="h-2" />

            {/* Interaction point markers */}
            <div className="relative h-0">
              {interactionPoints.map((point, index) => {
                const position = (point.time / (videoRef.current?.duration || 1)) * 100

                return (
                  <div
                    key={index}
                    className={`absolute top-[-8px] w-3 h-3 rounded-full transform -translate-x-1/2 ${
                      point.completed ? "bg-green-500" : "bg-yellow-500"
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
                disabled={!biometricEnabled && !currentInteraction}
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

              <div className="flex items-center">
                <Badge
                  className={`${attentionScore > 70 ? "bg-green-600" : attentionScore > 40 ? "bg-yellow-600" : "bg-red-600"}`}
                >
                  <Eye className="h-3 w-3 mr-1" />
                  {attentionScore}%
                </Badge>
              </div>
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
              <div className="bg-[#57FF31] h-full" style={{ width: `${(watchTime / requiredWatchTime) * 100}%` }}></div>
            </div>
            <span className="ml-2 text-white text-sm whitespace-nowrap">
              {Math.round((watchTime / requiredWatchTime) * 100)}%
            </span>
          </div>
          <p className="text-gray-300 text-sm">
            You must watch at least 90% of the video and complete all attention checks to mark this lesson as complete.
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

