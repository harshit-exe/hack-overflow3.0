"use client"
import { useRef, useEffect, useState, useCallback } from "react"
import * as faceDetection from "@mediapipe/face_detection"
import * as camera_utils from "@mediapipe/camera_utils"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

export function FaceDetection({ onBehaviorUpdate, onWarning }) {
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const [faceDetector, setFaceDetector] = useState(null)
  const [warning, setWarning] = useState(null)

  const onResults = useCallback(
    (results) => {
      const canvasCtx = canvasRef.current.getContext("2d")
      canvasCtx.save()
      canvasCtx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)
      canvasCtx.drawImage(results.image, 0, 0, canvasRef.current.width, canvasRef.current.height)

      if (results.detections.length > 1) {
        setWarning("Multiple faces detected. Please ensure only one person is in the frame.")
        onWarning("Multiple faces detected")
      } else if (results.detections.length === 0) {
        setWarning("No face detected. Please position yourself in front of the camera.")
        onWarning("No face detected")
      } else {
        setWarning(null)
        onWarning(null)
      }

      if (results.detections.length === 1) {
        const detection = results.detections[0]

        // Draw a simple border around the face
        const boundingBox = detection.boundingBox
        canvasCtx.strokeStyle = "white"
        canvasCtx.lineWidth = 2
        canvasCtx.strokeRect(
          boundingBox.xCenter * canvasRef.current.width - (boundingBox.width * canvasRef.current.width) / 2,
          boundingBox.yCenter * canvasRef.current.height - (boundingBox.height * canvasRef.current.height) / 2,
          boundingBox.width * canvasRef.current.width,
          boundingBox.height * canvasRef.current.height,
        )

        // Analyze behavior
        const behavior = analyzeBehavior(detection)
        onBehaviorUpdate(behavior)
      }

      canvasCtx.restore()
    },
    [onBehaviorUpdate, onWarning],
  )

  const analyzeBehavior = (detection) => {
    const boundingBox = detection.boundingBox

    // Calculate face movement
    const faceMovement = calculateFaceMovement(boundingBox)

    // Estimate attentiveness based on face position and movement
    const attentiveness = estimateAttentiveness(faceMovement)

    return {
      faceMovement,
      attentiveness,
      timestamp: new Date().toISOString(),
    }
  }

  const calculateFaceMovement = (boundingBox) => {
    const centerX = boundingBox.xCenter
    const centerY = boundingBox.yCenter

    // Assuming the ideal position is the center of the frame
    const movementX = Math.abs(0.5 - centerX)
    const movementY = Math.abs(0.5 - centerY)

    return Math.sqrt(movementX * movementX + movementY * movementY)
  }

  const estimateAttentiveness = (faceMovement) => {
    if (faceMovement < 0.1) return "High"
    if (faceMovement < 0.2) return "Medium"
    return "Low"
  }

  useEffect(() => {
    const loadDetectors = async () => {
      const detector = new faceDetection.FaceDetection({
        locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/face_detection/${file}`,
      })
      detector.setOptions({
        model: "short",
        minDetectionConfidence: 0.5,
      })
      detector.onResults(onResults)
      setFaceDetector(detector)
    }

    loadDetectors()
  }, [onResults])

  useEffect(() => {
    if (videoRef.current && faceDetector) {
      const camera = new camera_utils.Camera(videoRef.current, {
        onFrame: async () => {
          await faceDetector.send({ image: videoRef.current })
        },
        width: 640,
        height: 480,
      })
      camera.start()
    }
  }, [faceDetector])

  return (
    <div className="relative w-full h-[480px]">
      <video ref={videoRef} className="absolute top-0 left-0 w-full h-full object-cover" />
      <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full object-cover" width={640} height={480} />
      {warning && (
        <Alert variant="destructive" className="absolute bottom-4 left-4 right-4 bg-red-900 text-white">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Warning</AlertTitle>
          <AlertDescription>{warning}</AlertDescription>
        </Alert>
      )}
    </div>
  )
}

