"use client"

import { useState, useEffect, useCallback, useRef } from "react"

export function useVoiceInput() {
  const [transcript, setTranscript] = useState("")
  const [isListening, setIsListening] = useState(false)
  const [error, setError] = useState(null)
  const [interimTranscript, setInterimTranscript] = useState("")
  const [confidence, setConfidence] = useState(0)
  const [availableLanguages, setAvailableLanguages] = useState([
    { code: "en-US", name: "English (US)" },
    { code: "en-GB", name: "English (UK)" },
    { code: "es-ES", name: "Spanish" },
    { code: "fr-FR", name: "French" },
    { code: "de-DE", name: "German" },
    { code: "zh-CN", name: "Chinese" },
    { code: "ja-JP", name: "Japanese" },
  ])
  const [currentLanguage, setCurrentLanguage] = useState("en-US")

  // Use refs to maintain stable references
  const recognitionRef = useRef(null)
  const isListeningRef = useRef(false)

  // Initialize speech recognition
  useEffect(() => {
    const initializeSpeechRecognition = () => {
      try {
        // Clean up any existing recognition instance
        if (recognitionRef.current) {
          recognitionRef.current.onresult = null
          recognitionRef.current.onerror = null
          recognitionRef.current.onend = null
          recognitionRef.current.abort()
          recognitionRef.current = null
        }

        // Create a new recognition instance
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
        if (!SpeechRecognition) {
          setError("Speech recognition not supported in your browser.")
          return
        }

        const recognition = new SpeechRecognition()
        recognition.continuous = true
        recognition.interimResults = true
        recognition.lang = currentLanguage
        recognition.maxAlternatives = 1

        // Optimize for faster response
        if (typeof recognition.audioStart !== "undefined") {
          recognition.audioStart = 0 // Start processing audio immediately
        }

        // Store the recognition instance
        recognitionRef.current = recognition
        setError(null)
      } catch (err) {
        console.error("Error initializing speech recognition:", err)
        setError("Failed to initialize speech recognition. Please try again.")
      }
    }

    initializeSpeechRecognition()
  }, [currentLanguage])

  // Configure recognition event handlers
  const configureRecognitionHandlers = useCallback(() => {
    if (!recognitionRef.current) return

    recognitionRef.current.onstart = () => {
      console.log("Voice recognition started")
    }

    recognitionRef.current.onresult = (event) => {
      let interimText = ""
      let finalText = ""
      let highestConfidence = 0

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalText += event.results[i][0].transcript
          if (event.results[i][0].confidence > highestConfidence) {
            highestConfidence = event.results[i][0].confidence
          }
        } else {
          interimText += event.results[i][0].transcript
        }
      }

      if (finalText) {
        setTranscript((prevTranscript) => prevTranscript + finalText)
      }

      setInterimTranscript(interimText)
      if (highestConfidence > 0) {
        setConfidence(highestConfidence * 100)
      }
    }

    recognitionRef.current.onerror = (event) => {
      console.error("Voice recognition error", event.error)
      let errorMessage = "An error occurred with voice recognition."

      if (event.error === "network") {
        errorMessage = "Network error. Please check your internet connection."
      } else if (event.error === "not-allowed") {
        errorMessage = "Microphone access denied. Please allow microphone access."
      } else if (event.error === "no-speech") {
        errorMessage = "No speech detected. Please try speaking again."
      } else {
        errorMessage = `Voice recognition error: ${event.error}`
      }

      setError(errorMessage)

      // Don't stop listening on no-speech errors
      if (event.error !== "no-speech" && isListeningRef.current) {
        stopListening()
      }
    }

    recognitionRef.current.onend = () => {
      console.log("Voice recognition ended")

      // If still supposed to be listening, restart recognition
      if (isListeningRef.current) {
        try {
          recognitionRef.current.start()
        } catch (error) {
          console.error("Error restarting recognition:", error)
          setIsListening(false)
          isListeningRef.current = false
          setError("Failed to restart voice recognition. Please try again.")
        }
      }
    }
  }, [])

  const startListening = useCallback(() => {
    if (!recognitionRef.current) {
      setError("Speech recognition not available. Please refresh the page.")
      return
    }

    setError(null)
    setTranscript("")
    setInterimTranscript("")
    setConfidence(0)

    // Configure handlers before starting
    configureRecognitionHandlers()

    try {
      recognitionRef.current.start()
      setIsListening(true)
      isListeningRef.current = true
    } catch (error) {
      console.error("Error starting recognition:", error)
      setError("Failed to start voice recognition. Please try again.")
    }
  }, [configureRecognitionHandlers])

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop()
      } catch (error) {
        console.error("Error stopping recognition:", error)
      }
    }

    setIsListening(false)
    isListeningRef.current = false
  }, [])

  const resetTranscript = useCallback(() => {
    setTranscript("")
    setInterimTranscript("")
    setConfidence(0)
  }, [])

  const changeLanguage = useCallback(
    (languageCode) => {
      if (isListening) {
        stopListening()
      }

      setCurrentLanguage(languageCode)
    },
    [isListening, stopListening],
  )

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort()
        } catch (error) {
          console.error("Error cleaning up recognition:", error)
        }
      }
    }
  }, [])

  return {
    startListening,
    stopListening,
    resetTranscript,
    transcript,
    interimTranscript,
    isListening,
    error,
    confidence,
    availableLanguages,
    currentLanguage,
    changeLanguage,
  }
}

