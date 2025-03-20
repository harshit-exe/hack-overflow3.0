"use client"

import { useRef, useState } from "react"
import { motion } from "framer-motion"
import { FaBook, FaCode, FaLightbulb, FaLink, FaQuestionCircle } from "react-icons/fa"
import { useChat } from "@/hooks/useChat"

export const UI = ({ hidden, ...props }) => {
  const input = useRef()
  const [showResources, setShowResources] = useState(false)
  const { chat, loading, cameraZoomed, setCameraZoomed, message, tutorResponse, isAudioReady } = useChat()

  const sendMessage = () => {
    const text = input.current.value
    if (!loading && !message) {
      chat(text)
      input.current.value = ""
    }
  }

  if (hidden) {
    return null
  }

  return (
    <>
      <div className="fixed flex   inset-0 z-10  flex-col justify-between p-4 pointer-events-none text-black">
        <div className="mt-28 ml-28 self-start backdrop-blur-md  bg-opacity-50 p-4 rounded-lg">
          <h1 className=" font-black text-2xl flex items-center text-blue-600">
            <FaCode className="mr-2 " /> Virtual Mentor
          </h1>
          <p className="text-sm text-gray-300">Your AI companion for learning new career path</p>
        </div>

        {tutorResponse && (
          <div className="pointer-events-auto w-full flex justify-between mb-4">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              className="ml-20 bg-white rounded-lg shadow-lg p-4 w-[30%] max-h-[60vh] overflow-y-auto"
            >
              <h2 className="text-xl text-black font-bold mb-2 flex items-center">
                <FaLightbulb className="mr-2 text-yellow-500" /> {tutorResponse.topic}
              </h2>
              <p className="mb-2 text-sm text-gray-700">{tutorResponse.explanation}</p>
              {tutorResponse.codeExample && (
                <div className="bg-gray-100 p-2 rounded-md mb-2">
                  <h3 className="text-md font-semibold mb-1 flex items-center">
                    <FaCode className="mr-2 text-blue-500" /> Code Example
                  </h3>
                  <pre className="text-xs overflow-x-auto">
                    <code>{tutorResponse.codeExample}</code>
                  </pre>
                </div>
              )}
              {!isAudioReady && <div className="text-xs text-gray-50 italic">Generating audio response...</div>}
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              className=" bg-border border-white rounded-lg shadow-lg p-4 w-[30%] max-h-[60vh] overflow-y-auto"
            >
              {/* {tutorResponse.infographic && (
                <img
                  src={tutorResponse.infographic || "/placeholder.svg"}
                  alt="Infographic"
                  className="w-full mb-2 rounded-lg"
                />
              )} */}
              <button
                onClick={() => setShowResources(!showResources)}
                className="bg-blue-600 hover:bg-blue-500 text-white py-1 px-2 rounded-full flex items-center justify-center w-full mb-2 transition-all duration-300 text-sm"
              >
                <FaBook className="mr-1" /> {showResources ? "Hide Resources" : "Show Resources"}
              </button>
              {showResources && tutorResponse.resources && tutorResponse.resources.length > 0 && (
                <div>
                  <h3 className=" text-lg font-bold mb-2 flex items-center text-black">
                    <FaLink className="mr-1 text-green-500" /> Additional Resources
                  </h3>
                  <ul className="space-y-1">
                    {tutorResponse.resources.map((resource, index) => (
                      <li key={index} className="mb-1">
                        <a
                          href={resource.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 hover:underline flex items-center text-sm"
                        >
                          <FaLink className="mr-1" /> {resource.title}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </motion.div>
          </div>
        )}

        <div className="flex items-center justify-center w-full pointer-events-auto">
          <div className="flex items-center gap-2 max-w-screen-sm w-[60%]">
            <input
              className="w-full placeholder:text-gray-800 placeholder:italic p-7 rounded-full bg-opacity-50 bg-white backdrop-blur-md shadow-lg transition-all duration-300 focus:ring-2 focus:ring-blue-500 text-base"
              placeholder="Ask about a programming topic..."
              ref={input}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  sendMessage()
                }
              }}
            />
            <button
              disabled={loading || message}
              onClick={sendMessage}
              className={`bg-blue-500 hover:bg-blue-600 text-white p-7 px-7 font-semibold uppercase rounded-full shadow-lg transition-all duration-300 flex items-center text-sm ${
                loading || message ? "cursor-not-allowed opacity-30" : ""
              }`}
            >
              <FaQuestionCircle className="mr-1 " /> Ask
            </button>
          </div>
          <button
            onClick={() => setCameraZoomed(!cameraZoomed)}
            className="ml-5 bg-blue-500 hover:bg-blue-600 text-white  p-7 px-7 rounded-full shadow-lg transition-all duration-300"
          >
            {cameraZoomed ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607zM13.5 10.5h-6"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607zM10.5 7.5v6m3-3h-6"
                />
              </svg>
            )}
          </button>
        </div>
      </div>
    </>
  )
}

