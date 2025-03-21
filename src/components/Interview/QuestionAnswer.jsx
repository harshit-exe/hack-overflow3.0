"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Mic, MicOff, Volume2, VolumeX, Save, Copy, Lightbulb } from "lucide-react"
import { useState } from "react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Progress } from "@/components/ui/progress"

export function QuestionAnswer({
  currentQuestion,
  userAnswer,
  isAnswering,
  transcript,
  interimTranscript,
  isSpeaking,
  feedback,
  startAnswering,
  stopAnswering,
  handleStopSpeaking,
  speakWithTracking,
  useAIVoice,
  nextQuestion,
  confidence,
  saveAnswer,
  generateHint,
  hint,
  isGeneratingHint,
}) {
  const [showConfidence, setShowConfidence] = useState(false)

  const copyToClipboard = () => {
    const textToCopy = `Question: ${currentQuestion}\n\nAnswer: ${isAnswering ? transcript : userAnswer}${feedback ? `\n\nFeedback: ${feedback}` : ""}`
    navigator.clipboard
      .writeText(textToCopy)
      .then(() => {
        alert("Copied to clipboard!")
      })
      .catch((err) => {
        console.error("Failed to copy: ", err)
      })
  }

  return (
    <TooltipProvider>
      <Card className="bg-gray-900 text-white">
        <CardContent className="p-6">
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2 text-[#6366F1]">Current Question:</h2>
            <p className="text-lg text-gray-300">{currentQuestion}</p>
            <div className="flex justify-end mt-2">
              {hint ? (
                <div className="bg-gray-800 p-3 rounded-lg text-sm text-gray-300 border-l-4 border-yellow-500 mt-2">
                  <div className="flex items-start gap-2">
                    <Lightbulb className="h-5 w-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                    <p>{hint}</p>
                  </div>
                </div>
              ) : (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={generateHint}
                      disabled={isGeneratingHint || !currentQuestion}
                      className="text-xs border-yellow-600 text-yellow-500 hover:bg-yellow-900 hover:text-yellow-400"
                    >
                      <Lightbulb className="h-3.5 w-3.5 mr-1" />
                      {isGeneratingHint ? "Generating..." : "Get Hint"}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Get a helpful hint for this question</TooltipContent>
                </Tooltip>
              )}
            </div>
          </div>
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-semibold text-[#6366F1]">Your Answer:</h3>
              {isAnswering && (
                <button
                  onClick={() => setShowConfidence(!showConfidence)}
                  className="text-xs text-gray-400 hover:text-white"
                >
                  {showConfidence ? "Hide Confidence" : "Show Confidence"}
                </button>
              )}
            </div>
            <div className="relative">
              <p className="italic text-gray-400 min-h-[100px]">
                {isAnswering ? transcript : userAnswer}
                {isAnswering && interimTranscript && <span className="text-gray-500">{interimTranscript}</span>}
              </p>
              {isAnswering && showConfidence && (
                <div className="absolute bottom-0 left-0 right-0 bg-gray-800 p-2 rounded-md">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-400">Recognition confidence:</span>
                    <Progress
                      value={confidence}
                      className="h-2 flex-1 bg-gray-700"
                      indicatorColor={
                        confidence > 80 ? "bg-green-500" : confidence > 50 ? "bg-yellow-500" : "bg-red-500"
                      }
                    />
                    <span className="text-xs text-gray-300">{Math.round(confidence)}%</span>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="flex flex-wrap gap-2 mb-6">
            {!isAnswering ? (
              <Button onClick={startAnswering} className="bg-[#57FF31] hover:bg-[#45CC27] text-black">
                <Mic className="mr-2 h-4 w-4" /> Start Answering
              </Button>
            ) : (
              <Button onClick={stopAnswering} className="bg-yellow-600 hover:bg-yellow-700 text-white">
                <MicOff className="mr-2 h-4 w-4" /> Stop Answering
              </Button>
            )}
            {isSpeaking ? (
              <Button onClick={handleStopSpeaking} variant="outline" className="border-[#6366F1] text-[#6366F1]">
                <VolumeX className="mr-2 h-4 w-4" /> Stop AI Voice
              </Button>
            ) : (
              <Button
                onClick={() => speakWithTracking(currentQuestion)}
                variant="outline"
                disabled={!useAIVoice}
                className="border-[#6366F1] text-[#6366F1]"
              >
                <Volume2 className="mr-2 h-4 w-4" /> Repeat Question
              </Button>
            )}

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  className="border-green-600 text-green-500 hover:bg-green-900 hover:text-green-400"
                  onClick={saveAnswer}
                  disabled={!userAnswer && !transcript}
                >
                  <Save className="mr-2 h-4 w-4" /> Save
                </Button>
              </TooltipTrigger>
              <TooltipContent>Save this Q&A to your history</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  className="border-blue-600 text-blue-500 hover:bg-blue-900 hover:text-blue-400"
                  onClick={copyToClipboard}
                  disabled={!currentQuestion}
                >
                  <Copy className="mr-2 h-4 w-4" /> Copy
                </Button>
              </TooltipTrigger>
              <TooltipContent>Copy Q&A to clipboard</TooltipContent>
            </Tooltip>
          </div>
          {feedback && (
            <div className="bg-gray-800 p-4 rounded-lg mb-4">
              <h3 className="text-lg font-semibold mb-2 text-[#6366F1]">Feedback:</h3>
              <p className="text-gray-300">{feedback}</p>
            </div>
          )}
          <Button onClick={nextQuestion} className="w-full bg-[#6366F1] hover:bg-[#4F46E5] text-white">
            Next Question
          </Button>
        </CardContent>
      </Card>
    </TooltipProvider>
  )
}

