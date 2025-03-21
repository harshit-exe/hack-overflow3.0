"use client"

import { useState, useCallback, useEffect } from "react"

export function useTextToSpeech() {
  const [voices, setVoices] = useState([])
  const [currentVoice, setCurrentVoice] = useState(null)
  const [rate, setRate] = useState(1.0)
  const [pitch, setPitch] = useState(1.0)
  const [isSpeaking, setIsSpeaking] = useState(false)

  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices()
      if (availableVoices.length > 0) {
        setVoices(availableVoices)
        // Default to a female voice if available
        const femaleVoice = availableVoices.find(
          (voice) =>
            voice.name.includes("female") ||
            voice.name.includes("Female") ||
            voice.name.includes("Samantha") ||
            voice.name.includes("Google UK English Female"),
        )
        setCurrentVoice(femaleVoice || availableVoices[0])
      }
    }

    if ("speechSynthesis" in window) {
      loadVoices()
      // Chrome loads voices asynchronously
      window.speechSynthesis.onvoiceschanged = loadVoices
    }

    return () => {
      if ("speechSynthesis" in window) {
        window.speechSynthesis.onvoiceschanged = null
      }
    }
  }, [])

  const speak = useCallback(
    (text) => {
      if ("speechSynthesis" in window) {
        // Cancel any ongoing speech
        window.speechSynthesis.cancel()

        const utterance = new SpeechSynthesisUtterance(text)

        if (currentVoice) {
          utterance.voice = currentVoice
        }

        utterance.rate = rate
        utterance.pitch = pitch

        utterance.onstart = () => setIsSpeaking(true)
        utterance.onend = () => setIsSpeaking(false)
        utterance.onerror = () => setIsSpeaking(false)

        window.speechSynthesis.speak(utterance)
      } else {
        console.error("Text-to-speech not supported in this browser")
      }
    },
    [currentVoice, rate, pitch],
  )

  const stop = useCallback(() => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel()
      setIsSpeaking(false)
    }
  }, [])

  const setVoiceByName = useCallback(
    (name) => {
      const voice = voices.find((v) => v.name === name)
      if (voice) {
        setCurrentVoice(voice)
      }
    },
    [voices],
  )

  return {
    speak,
    stop,
    voices,
    currentVoice,
    setVoice: setCurrentVoice,
    setVoiceByName,
    rate,
    setRate,
    pitch,
    setPitch,
    isSpeaking,
  }
}

