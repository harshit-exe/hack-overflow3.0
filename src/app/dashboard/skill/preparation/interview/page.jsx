"use client";
import { useState, useCallback, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import {
  AlertCircle,
  Maximize,
  Minimize,
  Settings,
  Download,
  Save,
  BarChart,
  Trash2,
} from "lucide-react";
import { useGroqAI } from "@/components/Interview/useGroqAI";
import { useVoiceInput } from "@/components/Interview/useVoiceInput";
import { useTextToSpeech } from "@/components/Interview/useTextToSpeech";
import { QuestionAnswer } from "@/components/Interview/QuestionAnswer";
import { BehaviorTracker } from "@/components/Interview/BehaviorTracker";
import { FaceDetection } from "@/components/Interview/FaceDetection";
import { CareerAdvice } from "@/components/Interview/CareerAdvice";
import { SettingsPanel } from "@/components/Interview/SettingsPanel";

const defaultCareerPaths = [
  { value: "software-engineering", label: "Software Engineering" },
  { value: "data-science", label: "Data Science" },
  { value: "ux-design", label: "UX Design" },
  { value: "digital-marketing", label: "Digital Marketing" },
  { value: "cybersecurity", label: "Cybersecurity" },
  { value: "product-management", label: "Product Management" },
  { value: "artificial-intelligence", label: "Artificial Intelligence" },
];

const educationLevels = [
  { value: "high-school", label: "High School" },
  { value: "undergraduate", label: "Undergraduate" },
  { value: "graduate", label: "Graduate" },
  { value: "self-taught", label: "Self-taught" },
  { value: "bootcamp", label: "Bootcamp" },
];

const difficultyLevels = [
  { value: "beginner", label: "Beginner" },
  { value: "intermediate", label: "Intermediate" },
  { value: "advanced", label: "Advanced" },
];

export default function CareerGuidanceInterviewSimulator() {
  // State variables
  const [careerPaths, setCareerPaths] = useState(defaultCareerPaths);
  const [selectedCareerPath, setSelectedCareerPath] = useState("");
  const [educationLevel, setEducationLevel] = useState("undergraduate");
  const [difficultyLevel, setDifficultyLevel] = useState("intermediate");
  const [currentQuestion, setCurrentQuestion] = useState("");
  const [userAnswer, setUserAnswer] = useState("");
  const [feedback, setFeedback] = useState("");
  const [isInterviewStarted, setIsInterviewStarted] = useState(false);
  const [isAnswering, setIsAnswering] = useState(false);
  const [behaviorData, setBehaviorData] = useState([]);
  const [error, setError] = useState(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [useAIVoice, setUseAIVoice] = useState(true);
  const [interviewDuration, setInterviewDuration] = useState(15);
  const [timeRemaining, setTimeRemaining] = useState(15 * 60);
  const [showTimer, setShowTimer] = useState(true);
  const [careerFitScore, setCareerFitScore] = useState(0);
  const [questionCount, setQuestionCount] = useState(0);
  const [overallPerformance, setOverallPerformance] = useState(0);
  const [newCareerPath, setNewCareerPath] = useState("");
  const [isIntroduction, setIsIntroduction] = useState(true);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const [interviewHistory, setInterviewHistory] = useState([]);
  const [currentTab, setCurrentTab] = useState("interview");
  const [faceDetectionWarning, setFaceDetectionWarning] = useState(null);
  const [hint, setHint] = useState("");
  const [isGeneratingHint, setIsGeneratingHint] = useState(false);
  const [isGeneratingAdvice, setIsGeneratingAdvice] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [savedSessions, setSavedSessions] = useState([]);
  const [sessionName, setSessionName] = useState("");
  const [detailedFeedback, setDetailedFeedback] = useState(false);

  // Refs
  const settingsPanelRef = useRef(null);

  // Custom hooks
  const {
    generateQuestion,
    evaluateAnswer,
    generateCareerAdvice,
    isLoading,
    error: aiError,
  } = useGroqAI();

  const {
    startListening,
    stopListening,
    resetTranscript,
    transcript,
    interimTranscript,
    isListening,
    error: voiceError,
    confidence,
    availableLanguages,
    currentLanguage,
    changeLanguage,
  } = useVoiceInput();

  const {
    speak,
    stop: stopSpeaking,
    voices,
    currentVoice,
    setVoiceByName,
    rate,
    setRate,
    pitch,
    setPitch,
    isSpeaking: ttsIsSpeaking,
  } = useTextToSpeech();

  // Set isSpeaking based on TTS state
  useEffect(() => {
    setIsSpeaking(ttsIsSpeaking);
  }, [ttsIsSpeaking]);

  // Load saved data from localStorage
  useEffect(() => {
    const loadSavedData = () => {
      try {
        // Load settings
        const savedSettings = localStorage.getItem("careerGuidanceSettings");
        if (savedSettings) {
          const settings = JSON.parse(savedSettings);
          if (settings.useAIVoice !== undefined)
            setUseAIVoice(settings.useAIVoice);
          if (settings.showTimer !== undefined)
            setShowTimer(settings.showTimer);
          if (settings.interviewDuration)
            setInterviewDuration(settings.interviewDuration);
          if (settings.detailedFeedback !== undefined)
            setDetailedFeedback(settings.detailedFeedback);
          if (settings.voiceRate) setRate(settings.voiceRate);
          if (settings.voicePitch) setPitch(settings.voicePitch);
          if (settings.language) changeLanguage(settings.language);
        }

        // Load career paths
        const savedCareerPaths = localStorage.getItem(
          "careerGuidanceCareerPaths"
        );
        if (savedCareerPaths) {
          setCareerPaths(JSON.parse(savedCareerPaths));
        }

        // Load saved sessions
        const savedSessionsData = localStorage.getItem(
          "careerGuidanceSavedSessions"
        );
        if (savedSessionsData) {
          setSavedSessions(JSON.parse(savedSessionsData));
        }
      } catch (error) {
        console.error("Error loading saved data:", error);
      }
    };

    loadSavedData();
  }, [changeLanguage, setRate, setPitch]);

  const speakWithTracking = useCallback(
    (text) => {
      if (!useAIVoice) return;
      speak(text);
    },
    [speak, useAIVoice]
  );

  const startInterview = useCallback(async () => {
    if (!selectedCareerPath) return;
    setIsInterviewStarted(true);
    setError(null);
    setTimeRemaining(interviewDuration * 60);
    setQuestionCount(0);
    setOverallPerformance(0);
    setIsIntroduction(true);
    setInterviewHistory([]);
    setBehaviorData([]);
    try {
      const introQuestion = `Welcome to your personalized career guidance session for ${selectedCareerPath}. To start, could you tell me about your background, interests, and why you're considering this career path?`;
      setCurrentQuestion(introQuestion);
      setQuestionCount((prev) => prev + 1);
      if (useAIVoice) speakWithTracking(introQuestion);
    } catch (err) {
      setError(
        "Failed to start the career guidance session. Please try again."
      );
      setIsInterviewStarted(false);
    }
  }, [selectedCareerPath, interviewDuration, useAIVoice, speakWithTracking]);

  const startAnswering = useCallback(() => {
    setIsAnswering(true);
    setError(null);
    resetTranscript();
    startListening();
  }, [startListening, resetTranscript]);

  const stopAnswering = useCallback(async () => {
    setIsAnswering(false);
    stopListening();
    setUserAnswer(transcript);
    try {
      const evaluation = await evaluateAnswer(
        currentQuestion,
        transcript,
        detailedFeedback
      );
      setFeedback(evaluation);
      if (useAIVoice) speakWithTracking(evaluation);

      const score = extractCareerFitScore(evaluation);
      setCareerFitScore(score);
      setOverallPerformance(
        (prev) => (prev * (questionCount - 1) + score) / questionCount
      );

      setInterviewHistory((prev) => [
        ...prev,
        {
          question: currentQuestion,
          answer: transcript,
          feedback: evaluation,
          score: score,
          timestamp: new Date().toISOString(),
        },
      ]);
    } catch (err) {
      setError("Failed to evaluate the answer. Please try again.");
    }
  }, [
    stopListening,
    transcript,
    currentQuestion,
    evaluateAnswer,
    useAIVoice,
    questionCount,
    speakWithTracking,
    detailedFeedback,
  ]);

  const nextQuestion = useCallback(async () => {
    setError(null);
    setHint("");
    try {
      if (isIntroduction) {
        setIsIntroduction(false);
      }
      const question = await generateQuestion(
        selectedCareerPath,
        difficultyLevel
      );
      setCurrentQuestion(question);
      setQuestionCount((prev) => prev + 1);
      if (useAIVoice) speakWithTracking(question);
      setUserAnswer("");
      setFeedback("");
      setCareerFitScore(0);
    } catch (err) {
      setError("Failed to generate the next question. Please try again.");
    }
  }, [
    selectedCareerPath,
    generateQuestion,
    useAIVoice,
    isIntroduction,
    speakWithTracking,
    difficultyLevel,
  ]);

  const handleStopSpeaking = useCallback(() => {
    stopSpeaking();
  }, [stopSpeaking]);

  const handleBehaviorUpdate = useCallback((newBehavior) => {
    setBehaviorData((prevData) => [...prevData, newBehavior]);
  }, []);

  const handleFaceDetectionWarning = useCallback((warning) => {
    setFaceDetectionWarning(warning);
  }, []);

  const stopInterview = useCallback(() => {
    setIsInterviewStarted(false);
    setCurrentQuestion("");
    setUserAnswer("");
    setFeedback("");
    handleStopSpeaking();
    stopListening();
    exitFullScreen();
  }, [stopListening, handleStopSpeaking]);

  const addNewCareerPath = useCallback(() => {
    if (newCareerPath.trim() !== "") {
      const updatedPaths = [
        ...careerPaths,
        {
          value: newCareerPath.toLowerCase().replace(/\s+/g, "-"),
          label: newCareerPath,
        },
      ];
      setCareerPaths(updatedPaths);
      setNewCareerPath("");

      // Save to localStorage
      localStorage.setItem(
        "careerGuidanceCareerPaths",
        JSON.stringify(updatedPaths)
      );
    }
  }, [newCareerPath, careerPaths]);

  const toggleFullScreen = useCallback(() => {
    if (!isFullScreen) {
      enterFullScreen();
    } else {
      exitFullScreen();
    }
  }, [isFullScreen]);

  const enterFullScreen = useCallback(() => {
    const element = document.documentElement;
    if (element.requestFullscreen) {
      element.requestFullscreen();
    } else if (element.mozRequestFullScreen) {
      element.mozRequestFullScreen();
    } else if (element.webkitRequestFullscreen) {
      element.webkitRequestFullscreen();
    } else if (element.msRequestFullscreen) {
      element.msRequestFullscreen();
    }
    setIsFullScreen(true);
  }, []);

  const exitFullScreen = useCallback(() => {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    }
    setIsFullScreen(false);
  }, []);

  const generateHint = useCallback(async () => {
    if (!currentQuestion || isGeneratingHint) return;

    setIsGeneratingHint(true);
    try {
      const messages = [
        {
          role: "system",
          content:
            "You are an AI assistant that provides helpful hints for interview questions.",
        },
        {
          role: "user",
          content: `For this interview question: "${currentQuestion}", provide a short, helpful hint that guides the user without giving away the full answer. Keep it under 100 characters if possible.`,
        },
      ];

      const response = await fetch(
        "https://api.groq.com/openai/v1/chat/completions",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer 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`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "mixtral-8x7b-32768",
            messages: messages,
            max_tokens: 100,
            temperature: 0.7,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to generate hint: ${response.status}`);
      }

      const data = await response.json();
      setHint(data.choices[0].message.content.trim());
    } catch (error) {
      console.error("Error generating hint:", error);
      setError("Failed to generate hint. Please try again.");
    } finally {
      setIsGeneratingHint(false);
    }
  }, [currentQuestion, isGeneratingHint]);

  const handleGenerateAdvice = useCallback(
    async (careerPath, educationLevel, strengths, weaknesses) => {
      setIsGeneratingAdvice(true);
      try {
        const advice = await generateCareerAdvice(
          careerPath,
          educationLevel,
          strengths,
          weaknesses
        );
        setIsGeneratingAdvice(false);
        return advice;
      } catch (error) {
        console.error("Error generating career advice:", error);
        setError("Failed to generate career advice. Please try again.");
        setIsGeneratingAdvice(false);
        return "Unable to generate advice at this time. Please try again later.";
      }
    },
    [generateCareerAdvice]
  );

  const saveAnswer = useCallback(() => {
    if (!currentQuestion) return;

    const answerToSave = {
      question: currentQuestion,
      answer: isAnswering ? transcript : userAnswer,
      feedback: feedback,
      score: careerFitScore,
      timestamp: new Date().toISOString(),
    };

    setInterviewHistory((prev) => [...prev, answerToSave]);
  }, [
    currentQuestion,
    isAnswering,
    transcript,
    userAnswer,
    feedback,
    careerFitScore,
  ]);

  const saveSession = useCallback(() => {
    if (interviewHistory.length === 0) {
      alert("No session data to save.");
      return;
    }

    const sessionToSave = {
      id: Date.now().toString(),
      name: sessionName || `Session ${new Date().toLocaleDateString()}`,
      careerPath: selectedCareerPath,
      educationLevel: educationLevel,
      timestamp: new Date().toISOString(),
      history: interviewHistory,
      performance: overallPerformance,
      questionCount: questionCount,
    };

    const updatedSessions = [...savedSessions, sessionToSave];
    setSavedSessions(updatedSessions);
    setSessionName("");

    // Save to localStorage
    localStorage.setItem(
      "careerGuidanceSavedSessions",
      JSON.stringify(updatedSessions)
    );

    alert("Session saved successfully!");
  }, [
    interviewHistory,
    sessionName,
    selectedCareerPath,
    educationLevel,
    overallPerformance,
    questionCount,
    savedSessions,
  ]);

  const deleteSession = useCallback(
    (sessionId) => {
      const updatedSessions = savedSessions.filter(
        (session) => session.id !== sessionId
      );
      setSavedSessions(updatedSessions);

      // Save to localStorage
      localStorage.setItem(
        "careerGuidanceSavedSessions",
        JSON.stringify(updatedSessions)
      );
    },
    [savedSessions]
  );

  const exportData = useCallback(() => {
    const dataToExport = {
      settings: {
        useAIVoice,
        showTimer,
        interviewDuration,
        detailedFeedback,
        voiceRate: rate,
        voicePitch: pitch,
        language: currentLanguage,
      },
      careerPaths,
      savedSessions,
    };

    const dataStr = JSON.stringify(dataToExport, null, 2);
    const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(
      dataStr
    )}`;

    const exportFileDefaultName = `career-guidance-data-${new Date()
      .toISOString()
      .slice(0, 10)}.json`;

    const linkElement = document.createElement("a");
    linkElement.setAttribute("href", dataUri);
    linkElement.setAttribute("download", exportFileDefaultName);
    linkElement.click();
  }, [
    useAIVoice,
    showTimer,
    interviewDuration,
    detailedFeedback,
    rate,
    pitch,
    currentLanguage,
    careerPaths,
    savedSessions,
  ]);

  const saveSettings = useCallback(() => {
    const settingsToSave = {
      useAIVoice,
      showTimer,
      interviewDuration,
      detailedFeedback,
      voiceRate: rate,
      voicePitch: pitch,
      language: currentLanguage,
    };

    localStorage.setItem(
      "careerGuidanceSettings",
      JSON.stringify(settingsToSave)
    );
    alert("Settings saved successfully!");
  }, [
    useAIVoice,
    showTimer,
    interviewDuration,
    detailedFeedback,
    rate,
    pitch,
    currentLanguage,
  ]);

  const importData = useCallback(
    (data) => {
      try {
        if (data.settings) {
          if (data.settings.useAIVoice !== undefined)
            setUseAIVoice(data.settings.useAIVoice);
          if (data.settings.showTimer !== undefined)
            setShowTimer(data.settings.showTimer);
          if (data.settings.interviewDuration)
            setInterviewDuration(data.settings.interviewDuration);
          if (data.settings.detailedFeedback !== undefined)
            setDetailedFeedback(data.settings.detailedFeedback);
          if (data.settings.voiceRate) setRate(data.settings.voiceRate);
          if (data.settings.voicePitch) setPitch(data.settings.voicePitch);
          if (data.settings.language) changeLanguage(data.settings.language);
        }

        if (data.careerPaths) {
          setCareerPaths(data.careerPaths);
        }

        if (data.savedSessions) {
          setSavedSessions(data.savedSessions);
        }

        // Save imported data to localStorage
        saveSettings();
        localStorage.setItem(
          "careerGuidanceCareerPaths",
          JSON.stringify(data.careerPaths || careerPaths)
        );
        localStorage.setItem(
          "careerGuidanceSavedSessions",
          JSON.stringify(data.savedSessions || savedSessions)
        );

        alert("Data imported successfully!");
      } catch (error) {
        console.error("Error importing data:", error);
        alert("Failed to import data. Invalid format.");
      }
    },
    [
      setUseAIVoice,
      setShowTimer,
      setInterviewDuration,
      setDetailedFeedback,
      setRate,
      setPitch,
      changeLanguage,
      careerPaths,
      savedSessions,
      saveSettings,
    ]
  );

  const resetSettings = useCallback(() => {
    if (confirm("Are you sure you want to reset all settings to default?")) {
      setUseAIVoice(true);
      setShowTimer(true);
      setInterviewDuration(15);
      setDetailedFeedback(false);
      setRate(1.0);
      setPitch(1.0);
      changeLanguage("en-US");

      // Save to localStorage
      localStorage.setItem(
        "careerGuidanceSettings",
        JSON.stringify({
          useAIVoice: true,
          showTimer: true,
          interviewDuration: 15,
          detailedFeedback: false,
          voiceRate: 1.0,
          voicePitch: 1.0,
          language: "en-US",
        })
      );
    }
  }, [changeLanguage]);

  useEffect(() => {
    if (aiError) setError(aiError);
    if (voiceError) setError(voiceError);
  }, [aiError, voiceError]);

  useEffect(() => {
    let timer;
    if (isInterviewStarted && timeRemaining > 0) {
      timer = setInterval(() => {
        setTimeRemaining((prevTime) => prevTime - 1);
      }, 1000);
    } else if (timeRemaining === 0) {
      stopInterview();
    }
    return () => clearInterval(timer);
  }, [isInterviewStarted, timeRemaining, stopInterview]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (isInterviewStarted && document.hidden) {
        setShowWarning(true);
      }
    };

    const handleBeforeUnload = (e) => {
      if (isInterviewStarted) {
        e.preventDefault();
        e.returnValue = "";
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [isInterviewStarted]);

  // Close settings panel when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        settingsPanelRef.current &&
        !settingsPanelRef.current.contains(event.target) &&
        !event.target.closest("button[data-settings-toggle]")
      ) {
        setShowSettings(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
  };

  const extractCareerFitScore = (evaluation) => {
    // Try to extract a numerical score from the evaluation text
    const scoreRegex = /(\d{1,3})(\s*\/\s*100|\s*%)/i;
    const match = evaluation.match(scoreRegex);

    if (match && match[1]) {
      const score = Number.parseInt(match[1], 10);
      if (!isNaN(score) && score >= 0 && score <= 100) {
        return score;
      }
    }

    // If no score found, use a more sophisticated approach to estimate score
    const positiveTerms = [
      "excellent",
      "great",
      "good",
      "strong",
      "impressive",
      "thorough",
      "comprehensive",
      "well",
    ];
    const negativeTerms = [
      "poor",
      "weak",
      "inadequate",
      "insufficient",
      "lacks",
      "missing",
      "improve",
      "limited",
    ];

    let score = 50; // Start with a neutral score

    // Count positive and negative terms
    let positiveCount = 0;
    let negativeCount = 0;

    positiveTerms.forEach((term) => {
      const regex = new RegExp(term, "gi");
      const matches = evaluation.match(regex);
      if (matches) positiveCount += matches.length;
    });

    negativeTerms.forEach((term) => {
      const regex = new RegExp(term, "gi");
      const matches = evaluation.match(regex);
      if (matches) negativeCount += matches.length;
    });

    // Adjust score based on term counts
    score += positiveCount * 10;
    score -= negativeCount * 10;

    // Ensure score is within 0-100 range
    return Math.max(0, Math.min(100, score));
  };

  return (
    <div
      className={`min-h-screen min-w-screen bg-black bg-contain text-white p-4 ${
        isFullScreen ? "fixed inset-0 z-50" : ""
      }`}
    >
      <h1 className="text-3xl font-bold text-[#ffffff] text-center mb-4">
        <span className="text-[#57FF31]">CAREER</span> GUIDANCE ASSISTANT
      </h1>
      <div className="max-w-7xl mx-auto h-full flex flex-col">
        <div className="flex justify-between items-center mb-4">
          {isInterviewStarted && (
            <div className="flex items-center space-x-4">
              {showTimer && (
                <div className="text-xl font-bold text-[#f72b2b]">
                  Time: {formatTime(timeRemaining)}
                </div>
              )}
              <Button
                variant="outline"
                onClick={toggleFullScreen}
                className="bg-gray-800 hover:bg-gray-700"
              >
                {isFullScreen ? (
                  <Minimize className="h-4 w-4" />
                ) : (
                  <Maximize className="h-4 w-4" />
                )}
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowSettings(!showSettings)}
                className="bg-gray-800 hover:bg-gray-700"
                data-settings-toggle
              >
                <Settings className="h-4 w-4" />
              </Button>
              <Button
                variant="destructive"
                onClick={stopInterview}
                className="bg-red-600 hover:bg-red-700"
              >
                End Session
              </Button>
            </div>
          )}
        </div>

        {error && (
          <Alert variant="destructive" className="mb-4 bg-red-900 text-white">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {showWarning && (
          <Alert variant="warning" className="mb-4 bg-yellow-900 text-white">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Warning</AlertTitle>
            <AlertDescription>
              You've switched tabs or left the session. Please stay focused on
              your career guidance.
            </AlertDescription>
          </Alert>
        )}

        {faceDetectionWarning && (
          <Alert variant="warning" className="mb-4 bg-yellow-900 text-white">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Face Detection Warning</AlertTitle>
            <AlertDescription>{faceDetectionWarning}</AlertDescription>
          </Alert>
        )}

        {showSettings && isInterviewStarted && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-start justify-end p-4">
            <div ref={settingsPanelRef} className="w-full max-w-md">
              <SettingsPanel
                useAIVoice={useAIVoice}
                setUseAIVoice={setUseAIVoice}
                showTimer={showTimer}
                setShowTimer={setShowTimer}
                interviewDuration={interviewDuration}
                setInterviewDuration={setInterviewDuration}
                voices={voices}
                currentVoice={currentVoice}
                setVoiceByName={setVoiceByName}
                rate={rate}
                setRate={setRate}
                pitch={pitch}
                setPitch={setPitch}
                availableLanguages={availableLanguages}
                currentLanguage={currentLanguage}
                changeLanguage={changeLanguage}
                exportData={exportData}
                importData={importData}
                resetSettings={resetSettings}
                saveSettings={saveSettings}
              />
            </div>
          </div>
        )}

        {!isInterviewStarted ? (
          <Card className="max-w-2xl mx-auto bg-black text-white border-[#6366F1] border-2">
            <CardHeader>
              <CardTitle className="text-3xl font-semibold text-center text-[#ffffff]">
                <span className="text-blue-400"> Explore</span> Your Career Path
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300 mb-8 text-center">
                Get personalized career guidance with AI-powered insights and
                real-time feedback
              </p>
              <div className="flex flex-col items-center gap-4">
                <Select onValueChange={setSelectedCareerPath}>
                  <SelectTrigger className="w-full bg-gray-700 text-white border-[#6366F1]">
                    <SelectValue placeholder="Choose career path" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-700 text-white">
                    {careerPaths.map((path) => (
                      <SelectItem key={path.value} value={path.value}>
                        {path.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="flex w-full items-center space-x-2">
                  <Input
                    type="text"
                    placeholder="Add new career path"
                    value={newCareerPath}
                    onChange={(e) => setNewCareerPath(e.target.value)}
                    className="bg-gray-700 text-white border-[#6366F1]"
                  />
                  <Button
                    onClick={addNewCareerPath}
                    className="bg-[#2f2f62] hover:bg-[#4F46E5] text-white"
                  >
                    Add
                  </Button>
                </div>
                <Select
                  value={educationLevel}
                  onValueChange={setEducationLevel}
                >
                  <SelectTrigger className="w-full bg-gray-700 text-white border-[#6366F1]">
                    <SelectValue placeholder="Select education level" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-700 text-white">
                    {educationLevels.map((level) => (
                      <SelectItem key={level.value} value={level.value}>
                        {level.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select
                  value={difficultyLevel}
                  onValueChange={setDifficultyLevel}
                >
                  <SelectTrigger className="w-full bg-gray-700 text-white border-[#6366F1]">
                    <SelectValue placeholder="Select difficulty level" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-700 text-white">
                    {difficultyLevels.map((level) => (
                      <SelectItem key={level.value} value={level.value}>
                        {level.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <div className="w-full">
                  <Label
                    htmlFor="session-duration"
                    className="text-sm font-medium text-gray-300 mb-2"
                  >
                    Session Duration: {interviewDuration} minutes
                  </Label>
                  <Slider
                    id="session-duration"
                    min={5}
                    max={30}
                    step={5}
                    value={[interviewDuration]}
                    onValueChange={(value) => setInterviewDuration(value[0])}
                    className="bg-white"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="ai-voice"
                    checked={useAIVoice}
                    onCheckedChange={setUseAIVoice}
                  />
                  <Label
                    htmlFor="ai-voice"
                    className="text-sm font-medium text-gray-300"
                  >
                    Use AI Voice
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="show-timer"
                    checked={showTimer}
                    onCheckedChange={setShowTimer}
                  />
                  <Label
                    htmlFor="show-timer"
                    className="text-sm font-medium text-gray-300"
                  >
                    Show Timer
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="detailed-feedback"
                    checked={detailedFeedback}
                    onCheckedChange={setDetailedFeedback}
                  />
                  <Label
                    htmlFor="detailed-feedback"
                    className="text-sm font-medium text-gray-300"
                  >
                    Detailed Feedback
                  </Label>
                </div>
                <Button
                  onClick={startInterview}
                  disabled={!selectedCareerPath || isLoading}
                  className="w-full bg-[#6366F1] hover:bg-[#4F46E5] text-white"
                >
                  {isLoading
                    ? "Preparing Session..."
                    : "Start Career Guidance Session"}
                </Button>

                {savedSessions.length > 0 && (
                  <div className="w-full mt-4">
                    <h3 className="text-lg font-semibold text-[#6366F1] mb-2">
                      Previous Sessions
                    </h3>
                    <div className="max-h-60 overflow-y-auto bg-gray-800 rounded-lg p-2">
                      {savedSessions.map((session) => (
                        <div
                          key={session.id}
                          className="flex justify-between items-center p-2 border-b border-gray-700"
                        >
                          <div>
                            <p className="font-medium">{session.name}</p>
                            <p className="text-xs text-gray-400">
                              {new Date(session.timestamp).toLocaleDateString()}{" "}
                              • {session.careerPath}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8 px-2 text-xs border-red-600 text-red-500 hover:bg-red-900 hover:text-red-400"
                              onClick={() => deleteSession(session.id)}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8 px-2 text-xs border-green-600 text-green-500 hover:bg-green-900 hover:text-green-400"
                              onClick={() => {
                                // Export this session
                                const dataStr = JSON.stringify(
                                  session,
                                  null,
                                  2
                                );
                                const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(
                                  dataStr
                                )}`;
                                const exportFileName = `${session.name.replace(
                                  /\s+/g,
                                  "-"
                                )}-${new Date(session.timestamp)
                                  .toISOString()
                                  .slice(0, 10)}.json`;

                                const linkElement = document.createElement("a");
                                linkElement.setAttribute("href", dataUri);
                                linkElement.setAttribute(
                                  "download",
                                  exportFileName
                                );
                                linkElement.click();
                              }}
                            >
                              <Download className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="flex-grow overflow-hidden">
            <Tabs
              value={currentTab}
              onValueChange={setCurrentTab}
              className="h-full flex flex-col"
            >
              <TabsList className="grid w-full grid-cols-3 bg-gray-800">
                <TabsTrigger value="interview" className="text-white">
                  Guidance Session
                </TabsTrigger>
                <TabsTrigger value="history" className="text-white">
                  Session History
                </TabsTrigger>
                <TabsTrigger value="advice" className="text-white">
                  Career Advice
                </TabsTrigger>
              </TabsList>
              <TabsContent
                value="interview"
                className="flex-grow overflow-auto"
              >
                <div className="grid md:grid-cols-2 gap-4 h-full">
                  <div className="space-y-4">
                    <FaceDetection
                      onBehaviorUpdate={handleBehaviorUpdate}
                      onWarning={handleFaceDetectionWarning}
                    />
                    <BehaviorTracker behaviorData={behaviorData} />
                  </div>
                  <div className="space-y-4">
                    <QuestionAnswer
                      currentQuestion={currentQuestion}
                      userAnswer={userAnswer}
                      isAnswering={isAnswering}
                      transcript={transcript}
                      interimTranscript={interimTranscript}
                      isSpeaking={isSpeaking}
                      feedback={feedback}
                      startAnswering={startAnswering}
                      stopAnswering={stopAnswering}
                      handleStopSpeaking={handleStopSpeaking}
                      speakWithTracking={speakWithTracking}
                      useAIVoice={useAIVoice}
                      nextQuestion={nextQuestion}
                      confidence={confidence}
                      saveAnswer={saveAnswer}
                      generateHint={generateHint}
                      hint={hint}
                      isGeneratingHint={isGeneratingHint}
                    />
                    <Card className="bg-gray-900 text-white border-[#6366F1] border-2">
                      <CardContent className="p-4">
                        <h3 className="text-lg font-semibold mb-2 text-[#6366F1]">
                          Career Fit Metrics
                        </h3>
                        <div className="space-y-2">
                          <div>
                            <div className="flex justify-between mb-1">
                              <span>Career Fit Score</span>
                              <span>{careerFitScore.toFixed(2)}%</span>
                            </div>
                            <Progress
                              value={careerFitScore}
                              className="w-full bg-gray-700"
                              indicatorColor="bg-[#57FF31]"
                            />
                          </div>
                          <div>
                            <div className="flex justify-between mb-1">
                              <span>Overall Performance</span>
                              <span>{overallPerformance.toFixed(2)}%</span>
                            </div>
                            <Progress
                              value={overallPerformance}
                              className="w-full bg-gray-700"
                              indicatorColor="bg-[#57FF31]"
                            />
                          </div>
                          <div className="mt-4">
                            <div className="flex justify-between items-center">
                              <span className="text-sm">Save this session</span>
                              <div className="flex gap-2">
                                <Input
                                  type="text"
                                  placeholder="Session name"
                                  value={sessionName}
                                  onChange={(e) =>
                                    setSessionName(e.target.value)
                                  }
                                  className="bg-gray-800 border-gray-700 text-white h-8 text-sm"
                                />
                                <Button
                                  onClick={saveSession}
                                  size="sm"
                                  className="h-8 bg-[#6366F1] hover:bg-[#4F46E5]"
                                >
                                  <Save className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="history" className="flex-grow overflow-auto">
                <Card className="bg-gray-900 text-white border-[#6366F1] border-2">
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-[#6366F1]">
                      Session History
                    </CardTitle>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 border-[#6366F1] text-[#6366F1]"
                        onClick={() => {
                          // Export current session history
                          const sessionData = {
                            name:
                              sessionName ||
                              `Session ${new Date().toLocaleDateString()}`,
                            careerPath: selectedCareerPath,
                            educationLevel: educationLevel,
                            timestamp: new Date().toISOString(),
                            history: interviewHistory,
                            performance: overallPerformance,
                            questionCount: questionCount,
                          };

                          const dataStr = JSON.stringify(sessionData, null, 2);
                          const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(
                            dataStr
                          )}`;
                          const exportFileName = `career-guidance-session-${new Date()
                            .toISOString()
                            .slice(0, 10)}.json`;

                          const linkElement = document.createElement("a");
                          linkElement.setAttribute("href", dataUri);
                          linkElement.setAttribute("download", exportFileName);
                          linkElement.click();
                        }}
                      >
                        <Download className="h-4 w-4 mr-1" /> Export
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 border-[#6366F1] text-[#6366F1]"
                        onClick={() => {
                          // Generate performance report
                          setCurrentTab("report");
                        }}
                      >
                        <BarChart className="h-4 w-4 mr-1" /> Report
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4">
                    {interviewHistory.length === 0 ? (
                      <div className="text-center py-8 text-gray-400">
                        <p>
                          No history yet. Complete some questions to see them
                          here.
                        </p>
                      </div>
                    ) : (
                      interviewHistory.map((item, index) => (
                        <div
                          key={index}
                          className="mb-4 p-4 bg-gray-800 rounded-lg shadow"
                        >
                          <h3 className="text-lg font-semibold mb-2 text-[#6366F1]">
                            Question {index + 1}:
                          </h3>
                          <p className="text-gray-300 mb-2">{item.question}</p>
                          <h4 className="text-md font-semibold mb-1 text-[#57FF31]">
                            Your Answer:
                          </h4>
                          <p className="text-gray-400 mb-2">{item.answer}</p>
                          <h4 className="text-md font-semibold mb-1 text-[#57FF31]">
                            Feedback:
                          </h4>
                          <p className="text-gray-400 mb-2">{item.feedback}</p>
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium text-gray-300">
                              Career Fit Score:
                            </span>
                            <span className="text-sm font-bold text-[#57FF31]">
                              {item.score.toFixed(2)}%
                            </span>
                          </div>
                          <Progress
                            value={item.score}
                            className="w-full mt-1 bg-gray-700"
                            indicatorColor="bg-[#57FF31]"
                          />
                          <div className="text-right mt-2 text-xs text-gray-500">
                            {new Date(item.timestamp).toLocaleString()}
                          </div>
                        </div>
                      ))
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="advice" className="flex-grow overflow-auto">
                <CareerAdvice
                  careerPath={selectedCareerPath}
                  educationLevel={educationLevel}
                  generateAdvice={handleGenerateAdvice}
                  isGeneratingAdvice={isGeneratingAdvice}
                />
              </TabsContent>
              <TabsContent value="report" className="flex-grow overflow-auto">
                <Card className="bg-gray-900 text-white border-[#6366F1] border-2">
                  <CardHeader>
                    <CardTitle className="text-[#6366F1]">
                      Performance Report
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {interviewHistory.length === 0 ? (
                      <div className="text-center py-8 text-gray-400">
                        <p>No data available to generate a report.</p>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        <div className="bg-gray-800 p-4 rounded-lg">
                          <h3 className="text-lg font-semibold mb-4 text-[#57FF31]">
                            Session Overview
                          </h3>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm text-gray-400">
                                Career Path
                              </p>
                              <p className="text-lg">
                                {selectedCareerPath.replace(/-/g, " ")}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-400">
                                Education Level
                              </p>
                              <p className="text-lg">{educationLevel}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-400">
                                Questions Answered
                              </p>
                              <p className="text-lg">
                                {interviewHistory.length}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-400">
                                Average Score
                              </p>
                              <p className="text-lg">
                                {overallPerformance.toFixed(2)}%
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="bg-gray-800 p-4 rounded-lg">
                          <h3 className="text-lg font-semibold mb-4 text-[#57FF31]">
                            Performance Breakdown
                          </h3>
                          <div className="space-y-4">
                            {interviewHistory.map((item, index) => (
                              <div key={index} className="flex items-center">
                                <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center mr-3">
                                  {index + 1}
                                </div>
                                <div className="flex-1">
                                  <div className="flex justify-between mb-1">
                                    <span className="text-sm truncate max-w-[200px]">
                                      {item.question}
                                    </span>
                                    <span className="text-sm font-bold">
                                      {item.score.toFixed(0)}%
                                    </span>
                                  </div>
                                  <Progress
                                    value={item.score}
                                    className="w-full h-2 bg-gray-700"
                                    indicatorColor={
                                      item.score >= 80
                                        ? "bg-green-500"
                                        : item.score >= 60
                                        ? "bg-[#57FF31]"
                                        : item.score >= 40
                                        ? "bg-yellow-500"
                                        : "bg-red-500"
                                    }
                                  />
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="bg-gray-800 p-4 rounded-lg">
                          <h3 className="text-lg font-semibold mb-4 text-[#57FF31]">
                            Recommendations
                          </h3>
                          <p className="text-gray-300 mb-4">
                            Based on your performance, here are some
                            recommendations to improve your career readiness:
                          </p>
                          <ul className="list-disc pl-5 space-y-2 text-gray-300">
                            {overallPerformance < 60 && (
                              <>
                                <li>
                                  Focus on building a stronger understanding of
                                  core concepts in{" "}
                                  {selectedCareerPath.replace(/-/g, " ")}.
                                </li>
                                <li>
                                  Consider taking introductory courses to
                                  strengthen your foundation.
                                </li>
                              </>
                            )}
                            {overallPerformance >= 60 &&
                              overallPerformance < 80 && (
                                <>
                                  <li>
                                    You have a good foundation. Consider
                                    intermediate-level courses to advance your
                                    knowledge.
                                  </li>
                                  <li>
                                    Practice articulating your thoughts more
                                    clearly in interview settings.
                                  </li>
                                </>
                              )}
                            {overallPerformance >= 80 && (
                              <>
                                <li>
                                  Your performance is excellent! Consider
                                  advanced specialization in your field.
                                </li>
                                <li>
                                  Focus on building a portfolio that showcases
                                  your expertise.
                                </li>
                              </>
                            )}
                            <li>
                              Continue practicing with different question types
                              to improve versatility.
                            </li>
                            <li>
                              Review the feedback provided for each question to
                              identify specific areas for improvement.
                            </li>
                          </ul>
                        </div>

                        <Button
                          onClick={() => setCurrentTab("history")}
                          className="w-full bg-[#6366F1] hover:bg-[#4F46E5] text-white"
                        >
                          Back to History
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        )}
      </div>
    </div>
  );
}
