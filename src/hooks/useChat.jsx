"use client"

import { createContext, useContext, useEffect, useState } from "react"

// const backendUrl = "https://backend-chat-9v3m.onrender.com" 
const backendUrl = "http://localhost:4000" 
// const backendUrl = "https://backend-chat-production-c21f.up.railway.app" 
//  const backendUrl = "https://backend-chat-production-c21f.up.railway.app"

const ChatContext = createContext()

export const ChatProvider = ({ children }) => {
  const [messages, setMessages] = useState([])
  const [message, setMessage] = useState()
  const [loading, setLoading] = useState(false)
  const [cameraZoomed, setCameraZoomed] = useState(true)
  const [tutorResponse, setTutorResponse] = useState(null)
  const [isAudioReady, setIsAudioReady] = useState(false)

  const chat = async (message) => {
    setLoading(true)
    setIsAudioReady(false)
    const data = await fetch(`${backendUrl}/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message }),
    })
    const resp = await data.json()
    setMessages((messages) => [...messages, ...resp.messages])
    setTutorResponse(resp.tutorResponse)
    setLoading(false)

    // Simulate audio generation delay
    setTimeout(() => {
      setIsAudioReady(true)
    }, 1000) // Adjust this value based on your actual audio generation time
  }

  const onMessagePlayed = () => {
    setMessages((messages) => messages.slice(1))
  }

  useEffect(() => {
    if (messages.length > 0) {
      setMessage(messages[0])
    } else {
      setMessage(null)
    }
  }, [messages])

  return (
    <ChatContext.Provider
      value={{
        chat,
        message,
        onMessagePlayed,
        loading,
        cameraZoomed,
        setCameraZoomed,
        tutorResponse,
        isAudioReady,
      }}
    >
      {children}
    </ChatContext.Provider>
  )
}

export const useChat = () => {
  const context = useContext(ChatContext)
  if (!context) {
    throw new Error("useChat must be used within a ChatProvider")
  }
  return context
}

