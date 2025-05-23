"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Mic, MicOff, Copy, Download, Waves, Settings, Trash2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

// Type definition for SpeechRecognition
interface SpeechRecognition extends EventTarget {
  continuous: boolean
  interimResults: boolean
  lang: string
  start: () => void
  stop: () => void
  abort: () => void
  onerror: (event: any) => void
  onresult: (event: any) => void
  onend: () => void
}

declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognition
    webkitSpeechRecognition: new () => SpeechRecognition
  }
}

const languages = [
  { code: "en-US", name: "English (US)" },
  { code: "en-GB", name: "English (UK)" },
  { code: "es-ES", name: "Spanish" },
  { code: "fr-FR", name: "French" },
  { code: "de-DE", name: "German" },
  { code: "it-IT", name: "Italian" },
  { code: "pt-BR", name: "Portuguese" },
  { code: "ru-RU", name: "Russian" },
  { code: "ja-JP", name: "Japanese" },
  { code: "ko-KR", name: "Korean" },
  { code: "zh-CN", name: "Chinese (Simplified)" },
]

export default function SpeechToText() {
  const [isRecording, setIsRecording] = useState(false)
  const [transcript, setTranscript] = useState("")
  const [savedTranscript, setSavedTranscript] = useState("")
  const [language, setLanguage] = useState("en-US")
  const [continuous, setContinuous] = useState(true)
  const [interimResults, setInterimResults] = useState(true)
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [wordCount, setWordCount] = useState(0)
  const [charCount, setCharCount] = useState(0)
  const [recordingTime, setRecordingTime] = useState(0)
  const [confidence, setConfidence] = useState(0)
  const recognitionRef = useRef<SpeechRecognition | null>(null)
  const recordingStartTime = useRef<number>(0)
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const { toast } = useToast()

  // Initialize speech recognition on component mount
  useEffect(() => {
    // Load saved settings from localStorage
    const savedText = localStorage.getItem("stt-transcript")
    const savedLanguage = localStorage.getItem("stt-language")
    const savedContinuous = localStorage.getItem("stt-continuous")
    const savedInterimResults = localStorage.getItem("stt-interim")

    if (savedText) {
      setTranscript(savedText)
      setSavedTranscript(savedText)
    }
    if (savedLanguage) setLanguage(savedLanguage)
    if (savedContinuous) setContinuous(savedContinuous === "true")
    if (savedInterimResults) setInterimResults(savedInterimResults === "true")

    // Initialize SpeechRecognition
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition()
      recognitionRef.current.continuous = continuous
      recognitionRef.current.interimResults = interimResults
      recognitionRef.current.lang = language

      recognitionRef.current.onresult = (event) => {
        let interimTranscript = ""
        let finalTranscript = ""
        let maxConfidence = 0

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript
          const confidence = event.results[i][0].confidence || 0

          if (confidence > maxConfidence) {
            maxConfidence = confidence
          }

          if (event.results[i].isFinal) {
            finalTranscript += transcript
          } else {
            interimTranscript += transcript
          }
        }

        setConfidence(maxConfidence)
        const newTranscript = savedTranscript + finalTranscript + interimTranscript
        setTranscript(newTranscript)

        // Save final transcript to localStorage
        if (finalTranscript) {
          const updatedSavedTranscript = savedTranscript + finalTranscript
          setSavedTranscript(updatedSavedTranscript)
          localStorage.setItem("stt-transcript", updatedSavedTranscript)
        }
      }

      recognitionRef.current.onerror = (event) => {
        console.error("Speech recognition error", event)
        toast({
          title: "Error",
          description: `Speech recognition error: ${event.error}`,
          variant: "destructive",
        })
        setIsRecording(false)
        stopTimer()
      }

      recognitionRef.current.onend = () => {
        if (isRecording) {
          recognitionRef.current?.start()
        } else {
          stopTimer()
        }
      }
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop()
      }
      stopTimer()
    }
  }, [savedTranscript, isRecording, language, continuous, interimResults])

  // Update word and character count
  useEffect(() => {
    const words = transcript
      .trim()
      .split(/\s+/)
      .filter((word) => word.length > 0)
    setWordCount(words.length)
    setCharCount(transcript.length)
  }, [transcript])

  const startTimer = () => {
    recordingStartTime.current = Date.now()
    timerRef.current = setInterval(() => {
      setRecordingTime(Math.floor((Date.now() - recordingStartTime.current) / 1000))
    }, 1000)
  }

  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
    setRecordingTime(0)
  }

  const toggleRecording = () => {
    if (!recognitionRef.current) {
      toast({
        title: "Error",
        description: "Speech recognition is not supported in your browser.",
        variant: "destructive",
      })
      return
    }

    if (isRecording) {
      recognitionRef.current.stop()
      setIsRecording(false)
      stopTimer()
    } else {
      try {
        // Update recognition settings
        recognitionRef.current.continuous = continuous
        recognitionRef.current.interimResults = interimResults
        recognitionRef.current.lang = language

        recognitionRef.current.start()
        setIsRecording(true)
        startTimer()
      } catch (error) {
        console.error("Error starting speech recognition:", error)
        toast({
          title: "Error",
          description: "Failed to start speech recognition. Please check microphone permissions.",
          variant: "destructive",
        })
      }
    }
  }

  const handleTranscriptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTranscript(e.target.value)
    setSavedTranscript(e.target.value)
    localStorage.setItem("stt-transcript", e.target.value)
  }

  const handleLanguageChange = (value: string) => {
    setLanguage(value)
    localStorage.setItem("stt-language", value)
  }

  const handleContinuousChange = (checked: boolean) => {
    setContinuous(checked)
    localStorage.setItem("stt-continuous", checked.toString())
  }

  const handleInterimResultsChange = (checked: boolean) => {
    setInterimResults(checked)
    localStorage.setItem("stt-interim", checked.toString())
  }

  const clearTranscript = () => {
    setTranscript("")
    setSavedTranscript("")
    localStorage.removeItem("stt-transcript")
    toast({
      title: "Cleared",
      description: "Transcript has been cleared",
    })
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(transcript)
    toast({
      title: "Copied!",
      description: "Text copied to clipboard",
    })
  }

  const downloadTranscript = () => {
    const element = document.createElement("a")
    const file = new Blob([transcript], { type: "text/plain" })
    element.href = URL.createObjectURL(file)
    element.download = `transcript-${new Date().toISOString().split("T")[0]}.txt`
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <Card className="h-full bg-black/20 backdrop-blur-sm border-gray-700/30 hover:bg-black/30 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-blue-500/10">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl">
              <Mic className="h-6 w-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Speech-to-Text
              </CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-400">
                Convert your speech to text with advanced controls
              </CardDescription>
            </div>
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="bg-white/10 dark:bg-black/10 backdrop-blur-sm border-white/30 dark:border-gray-700/30 hover:bg-white/20 dark:hover:bg-black/20 transition-all duration-300"
          >
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Advanced Settings */}
        {showAdvanced && (
          <div className="space-y-4 p-4 bg-black/20 rounded-xl border border-gray-700/30">
            <h3 className="text-lg font-semibold text-gray-200">Recognition Settings</h3>

            {/* Language Selection */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-300">Language</Label>
              <Select value={language} onValueChange={handleLanguageChange}>
                <SelectTrigger className="bg-black/30 backdrop-blur-sm border-gray-700/30 focus:border-blue-400/50 transition-all duration-300 rounded-xl text-gray-200">
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent className="bg-black/80 backdrop-blur-sm border-gray-700/30 rounded-xl text-gray-200">
                  {languages.map((lang) => (
                    <SelectItem key={lang.code} value={lang.code} className="rounded-lg">
                      {lang.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Recognition Options */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center justify-between space-x-2">
                <Label htmlFor="continuous" className="text-sm font-medium text-gray-300">
                  Continuous Recording
                </Label>
                <Switch id="continuous" checked={continuous} onCheckedChange={handleContinuousChange} />
              </div>

              <div className="flex items-center justify-between space-x-2">
                <Label htmlFor="interim" className="text-sm font-medium text-gray-300">
                  Show Interim Results
                </Label>
                <Switch id="interim" checked={interimResults} onCheckedChange={handleInterimResultsChange} />
              </div>
            </div>
          </div>
        )}

        {/* Recording Status */}
        {isRecording && (
          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-red-900/30 to-pink-900/30 rounded-xl border border-red-700/30">
            <div className="flex items-center space-x-3">
              <Waves className="h-5 w-5 text-red-400 animate-pulse" />
              <span className="text-red-300 font-medium">Recording... Speak now</span>
              <div className="flex space-x-1">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="w-2 h-2 bg-red-400 rounded-full animate-bounce"
                    style={{ animationDelay: `${i * 0.1}s` }}
                  />
                ))}
              </div>
            </div>
            <div className="text-right">
              <div className="text-red-300 font-mono text-lg">{formatTime(recordingTime)}</div>
              {confidence > 0 && (
                <div className="text-xs text-red-400">Confidence: {Math.round(confidence * 100)}%</div>
              )}
            </div>
          </div>
        )}

        {/* Statistics */}
        <div className="grid grid-cols-3 gap-4 p-4 bg-black/20 rounded-xl border border-gray-700/30">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-400">{wordCount}</div>
            <div className="text-xs text-gray-400">Words</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-400">{charCount}</div>
            <div className="text-xs text-gray-400">Characters</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-pink-400">
              {languages.find((l) => l.code === language)?.name.split(" ")[0] || "EN"}
            </div>
            <div className="text-xs text-gray-400">Language</div>
          </div>
        </div>

        {/* Control Buttons */}
        <div className="flex justify-between items-center">
          <Button
            onClick={toggleRecording}
            variant={isRecording ? "destructive" : "default"}
            className={`relative overflow-hidden transition-all duration-300 ${
              isRecording
                ? "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 shadow-lg shadow-red-500/25"
                : "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-lg shadow-blue-500/25"
            } text-white border-0 px-6 py-3 rounded-xl font-medium`}
          >
            {isRecording ? (
              <>
                <MicOff className="mr-2 h-5 w-5" />
                <span>Stop Recording</span>
                <div className="absolute inset-0 bg-white/20 animate-pulse" />
              </>
            ) : (
              <>
                <Mic className="mr-2 h-5 w-5" />
                <span>Start Recording</span>
              </>
            )}
          </Button>

          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="icon"
              onClick={clearTranscript}
              disabled={!transcript}
              title="Clear transcript"
              className="bg-white/10 dark:bg-black/10 backdrop-blur-sm border-white/30 dark:border-gray-700/30 hover:bg-white/20 dark:hover:bg-black/20 transition-all duration-300 hover:scale-110"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={copyToClipboard}
              disabled={!transcript}
              title="Copy to clipboard"
              className="bg-white/10 dark:bg-black/10 backdrop-blur-sm border-white/30 dark:border-gray-700/30 hover:bg-white/20 dark:hover:bg-black/20 transition-all duration-300 hover:scale-110"
            >
              <Copy className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={downloadTranscript}
              disabled={!transcript}
              title="Download as text file"
              className="bg-white/10 dark:bg-black/10 backdrop-blur-sm border-white/30 dark:border-gray-700/30 hover:bg-white/20 dark:hover:bg-black/20 transition-all duration-300 hover:scale-110"
            >
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <Textarea
          placeholder="Your transcribed text will appear here..."
          value={transcript}
          onChange={handleTranscriptChange}
          className="min-h-[200px] resize-none bg-black/30 backdrop-blur-sm border-gray-700/30 focus:border-blue-400/50 transition-all duration-300 rounded-xl text-base leading-relaxed text-gray-200 placeholder:text-gray-500"
        />
      </CardContent>
    </Card>
  )
}
