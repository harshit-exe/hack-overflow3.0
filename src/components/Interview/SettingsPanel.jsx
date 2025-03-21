"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Download, Upload, Save, Trash2 } from "lucide-react"

export function SettingsPanel({
  useAIVoice,
  setUseAIVoice,
  showTimer,
  setShowTimer,
  interviewDuration,
  setInterviewDuration,
  voices,
  currentVoice,
  setVoiceByName,
  rate,
  setRate,
  pitch,
  setPitch,
  availableLanguages,
  currentLanguage,
  changeLanguage,
  exportData,
  importData,
  resetSettings,
  saveSettings,
}) {
  const [activeTab, setActiveTab] = useState("general")
  const [voiceSettings, setVoiceSettings] = useState({
    rate: rate,
    pitch: pitch,
    voice: currentVoice?.name || "",
  })

  useEffect(() => {
    setVoiceSettings({
      rate: rate,
      pitch: pitch,
      voice: currentVoice?.name || "",
    })
  }, [rate, pitch, currentVoice])

  const handleVoiceSettingsChange = (key, value) => {
    setVoiceSettings((prev) => ({
      ...prev,
      [key]: value,
    }))

    if (key === "rate") setRate(value)
    if (key === "pitch") setPitch(value)
    if (key === "voice") setVoiceByName(value)
  }

  const handleImportClick = () => {
    const input = document.createElement("input")
    input.type = "file"
    input.accept = ".json"
    input.onchange = (e) => {
      const file = e.target.files[0]
      if (file) {
        const reader = new FileReader()
        reader.onload = (event) => {
          try {
            const data = JSON.parse(event.target.result)
            importData(data)
          } catch (error) {
            console.error("Error parsing imported data:", error)
            alert("Invalid file format. Please select a valid JSON file.")
          }
        }
        reader.readAsText(file)
      }
    }
    input.click()
  }

  return (
    <Card className="bg-gray-900 text-white">
      <CardHeader>
        <CardTitle className="text-[#6366F1]">Settings</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 bg-gray-800">
            <TabsTrigger value="general" className="text-white">
              General
            </TabsTrigger>
            <TabsTrigger value="voice" className="text-white">
              Voice
            </TabsTrigger>
            <TabsTrigger value="data" className="text-white">
              Data
            </TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-4 pt-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="ai-voice" className="text-sm font-medium text-gray-300">
                Use AI Voice
              </Label>
              <Switch id="ai-voice" checked={useAIVoice} onCheckedChange={setUseAIVoice} />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="show-timer" className="text-sm font-medium text-gray-300">
                Show Timer
              </Label>
              <Switch id="show-timer" checked={showTimer} onCheckedChange={setShowTimer} />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="session-duration" className="text-sm font-medium text-gray-300">
                  Session Duration
                </Label>
                <span className="text-sm text-gray-400">{interviewDuration} minutes</span>
              </div>
              <Slider
                id="session-duration"
                min={5}
                max={60}
                step={5}
                value={[interviewDuration]}
                onValueChange={(value) => setInterviewDuration(value[0])}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="language" className="text-sm font-medium text-gray-300">
                Voice Recognition Language
              </Label>
              <Select value={currentLanguage} onValueChange={changeLanguage}>
                <SelectTrigger id="language" className="bg-gray-800 border-gray-700 text-white">
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 text-white">
                  {availableLanguages.map((lang) => (
                    <SelectItem key={lang.code} value={lang.code}>
                      {lang.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </TabsContent>

          <TabsContent value="voice" className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="voice-select" className="text-sm font-medium text-gray-300">
                Voice
              </Label>
              <Select
                value={voiceSettings.voice}
                onValueChange={(value) => handleVoiceSettingsChange("voice", value)}
                disabled={!useAIVoice}
              >
                <SelectTrigger id="voice-select" className="bg-gray-800 border-gray-700 text-white">
                  <SelectValue placeholder="Select voice" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 text-white max-h-[200px]">
                  {voices.map((voice) => (
                    <SelectItem key={voice.name} value={voice.name}>
                      {voice.name} ({voice.lang})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="voice-rate" className="text-sm font-medium text-gray-300">
                  Speech Rate
                </Label>
                <span className="text-sm text-gray-400">{voiceSettings.rate.toFixed(1)}x</span>
              </div>
              <Slider
                id="voice-rate"
                min={0.5}
                max={2}
                step={0.1}
                value={[voiceSettings.rate]}
                onValueChange={(value) => handleVoiceSettingsChange("rate", value[0])}
                disabled={!useAIVoice}
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="voice-pitch" className="text-sm font-medium text-gray-300">
                  Voice Pitch
                </Label>
                <span className="text-sm text-gray-400">{voiceSettings.pitch.toFixed(1)}</span>
              </div>
              <Slider
                id="voice-pitch"
                min={0.5}
                max={2}
                step={0.1}
                value={[voiceSettings.pitch]}
                onValueChange={(value) => handleVoiceSettingsChange("pitch", value[0])}
                disabled={!useAIVoice}
              />
            </div>

            <Button
              onClick={() => {
                // Test the current voice settings
                const testText = "This is a test of the current voice settings."
                const utterance = new SpeechSynthesisUtterance(testText)
                if (currentVoice) utterance.voice = currentVoice
                utterance.rate = voiceSettings.rate
                utterance.pitch = voiceSettings.pitch
                window.speechSynthesis.speak(utterance)
              }}
              disabled={!useAIVoice}
              className="w-full bg-[#6366F1] hover:bg-[#4F46E5] text-white"
            >
              Test Voice
            </Button>
          </TabsContent>

          <TabsContent value="data" className="space-y-4 pt-4">
            <div className="grid grid-cols-2 gap-3">
              <Button onClick={exportData} className="bg-green-700 hover:bg-green-800 text-white">
                <Download className="mr-2 h-4 w-4" />
                Export Data
              </Button>

              <Button onClick={handleImportClick} className="bg-blue-700 hover:bg-blue-800 text-white">
                <Upload className="mr-2 h-4 w-4" />
                Import Data
              </Button>

              <Button onClick={saveSettings} className="bg-[#6366F1] hover:bg-[#4F46E5] text-white">
                <Save className="mr-2 h-4 w-4" />
                Save Settings
              </Button>

              <Button onClick={resetSettings} variant="destructive" className="bg-red-700 hover:bg-red-800">
                <Trash2 className="mr-2 h-4 w-4" />
                Reset All
              </Button>
            </div>

            <div className="mt-4 p-3 bg-gray-800 rounded-lg border border-gray-700">
              <h3 className="text-sm font-medium text-gray-300 mb-2">Data Privacy</h3>
              <p className="text-xs text-gray-400">
                All your data is stored locally in your browser. Exporting creates a backup file that you can use to
                restore your settings and history on another device or browser.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

