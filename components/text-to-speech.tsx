"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { Play, Square, Copy, Volume2, Waves, Settings, Pause, SkipForward, SkipBack } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

interface Voice {
  name: string
  lang: string
  voiceURI: string
}

export default function TextToSpeech() {
  const [text, setText] = useState("")
  const [voices, setVoices] = useState<Voice[]>([])
  const [selectedVoice, setSelectedVoice] = useState("")
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [rate, setRate] = useState([1])
  const [pitch, setPitch] = useState([1])
  const [volume, setVolume] = useState([1])
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [currentPosition, setCurrentPosition] = useState(0)
  const [totalLength, setTotalLength] = useState(0)
  const { toast } = useToast()
  const synth = useRef<SpeechSynthesis | null>(null)
  const currentUtterance = useRef<SpeechSynthesisUtterance | null>(null)

  // Initialize speech synthesis and load voices
  useEffect(() => {
    // Load saved settings from localStorage
    const savedText = localStorage.getItem("tts-text")
    const savedRate = localStorage.getItem("tts-rate")
    const savedPitch = localStorage.getItem("tts-pitch")
    const savedVolume = localStorage.getItem("tts-volume")
    const savedVoice = localStorage.getItem("tts-voice")

    if (savedText) setText(savedText)
    if (savedRate) setRate([Number.parseFloat(savedRate)])
    if (savedPitch) setPitch([Number.parseFloat(savedPitch)])
    if (savedVolume) setVolume([Number.parseFloat(savedVolume)])
    if (savedVoice) setSelectedVoice(savedVoice)

    // Initialize speech synthesis
    if (typeof window !== "undefined") {
      synth.current = window.speechSynthesis

      // Function to load and set available voices
      const loadVoices = () => {
        const availableVoices = synth.current?.getVoices() || []
        // Filter for English voices for simplicity
        const englishVoices = availableVoices.filter((voice) => voice.lang.includes("en"))
        setVoices(englishVoices as Voice[])

        // Set default voice if available and no saved voice
        if (englishVoices.length > 0 && !savedVoice) {
          setSelectedVoice(englishVoices[0].voiceURI)
        }
      }

      // Chrome loads voices asynchronously
      if (synth.current?.onvoiceschanged !== undefined) {
        synth.current.onvoiceschanged = loadVoices
      }

      // Initial load of voices
      loadVoices()

      // Check speaking status periodically
      const interval = setInterval(() => {
        if (synth.current) {
          setIsSpeaking(synth.current.speaking)
          setIsPaused(synth.current.paused)
        }
      }, 100)

      return () => {
        clearInterval(interval)
        if (synth.current) {
          synth.current.cancel()
        }
      }
    }
  }, [])

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value)
    localStorage.setItem("tts-text", e.target.value)
    setTotalLength(e.target.value.length)
  }

  const handleRateChange = (value: number[]) => {
    setRate(value)
    localStorage.setItem("tts-rate", value[0].toString())
  }

  const handlePitchChange = (value: number[]) => {
    setPitch(value)
    localStorage.setItem("tts-pitch", value[0].toString())
  }

  const handleVolumeChange = (value: number[]) => {
    setVolume(value)
    localStorage.setItem("tts-volume", value[0].toString())
  }

  const handleVoiceChange = (value: string) => {
    setSelectedVoice(value)
    localStorage.setItem("tts-voice", value)
  }

  const speak = () => {
    if (!synth.current) return

    // Cancel any ongoing speech
    synth.current.cancel()

    if (text) {
      const utterance = new SpeechSynthesisUtterance(text)
      currentUtterance.current = utterance

      // Set voice settings
      if (selectedVoice) {
        const voice = voices.find((v) => v.voiceURI === selectedVoice)
        if (voice) {
          utterance.voice = voice as unknown as SpeechSynthesisVoice
        }
      }

      utterance.rate = rate[0]
      utterance.pitch = pitch[0]
      utterance.volume = volume[0]

      utterance.onstart = () => {
        setIsSpeaking(true)
        setCurrentPosition(0)
      }

      utterance.onend = () => {
        setIsSpeaking(false)
        setIsPaused(false)
        setCurrentPosition(0)
      }

      utterance.onboundary = (event) => {
        setCurrentPosition(event.charIndex)
      }

      utterance.onerror = (event) => {
        console.error("Speech synthesis error", event)
        setIsSpeaking(false)
        setIsPaused(false)
        toast({
          title: "Error",
          description: "Failed to synthesize speech",
          variant: "destructive",
        })
      }

      synth.current.speak(utterance)
    }
  }

  const pauseResume = () => {
    if (!synth.current) return

    if (isPaused) {
      synth.current.resume()
    } else {
      synth.current.pause()
    }
  }

  const stopSpeaking = () => {
    if (synth.current) {
      synth.current.cancel()
      setIsSpeaking(false)
      setIsPaused(false)
      setCurrentPosition(0)
    }
  }

  const skipForward = () => {
    if (currentUtterance.current && synth.current) {
      const words = text.split(" ")
      const currentWordIndex = Math.floor(currentPosition / (text.length / words.length))
      const nextWordIndex = Math.min(currentWordIndex + 10, words.length - 1)
      const newText = words.slice(nextWordIndex).join(" ")

      synth.current.cancel()
      if (newText) {
        const utterance = new SpeechSynthesisUtterance(newText)
        currentUtterance.current = utterance

        if (selectedVoice) {
          const voice = voices.find((v) => v.voiceURI === selectedVoice)
          if (voice) {
            utterance.voice = voice as unknown as SpeechSynthesisVoice
          }
        }

        utterance.rate = rate[0]
        utterance.pitch = pitch[0]
        utterance.volume = volume[0]

        utterance.onend = () => {
          setIsSpeaking(false)
          setIsPaused(false)
          setCurrentPosition(0)
        }

        synth.current.speak(utterance)
      }
    }
  }

  const skipBackward = () => {
    if (currentUtterance.current && synth.current) {
      const words = text.split(" ")
      const currentWordIndex = Math.floor(currentPosition / (text.length / words.length))
      const prevWordIndex = Math.max(currentWordIndex - 10, 0)
      const newText = words.slice(prevWordIndex).join(" ")

      synth.current.cancel()
      if (newText) {
        const utterance = new SpeechSynthesisUtterance(newText)
        currentUtterance.current = utterance

        if (selectedVoice) {
          const voice = voices.find((v) => v.voiceURI === selectedVoice)
          if (voice) {
            utterance.voice = voice as unknown as SpeechSynthesisVoice
          }
        }

        utterance.rate = rate[0]
        utterance.pitch = pitch[0]
        utterance.volume = volume[0]

        utterance.onend = () => {
          setIsSpeaking(false)
          setIsPaused(false)
          setCurrentPosition(0)
        }

        synth.current.speak(utterance)
      }
    }
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(text)
    toast({
      title: "Copied!",
      description: "Text copied to clipboard",
    })
  }

  const resetSettings = () => {
    setRate([1])
    setPitch([1])
    setVolume([1])
    localStorage.removeItem("tts-rate")
    localStorage.removeItem("tts-pitch")
    localStorage.removeItem("tts-volume")
    toast({
      title: "Settings Reset",
      description: "All voice settings have been reset to default",
    })
  }

  const getProgressPercentage = () => {
    if (totalLength === 0) return 0
    return (currentPosition / totalLength) * 100
  }

  return (
    <Card className="h-full bg-black/20 backdrop-blur-sm border-gray-700/30 hover:bg-black/30 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-purple-500/10">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl">
              <Volume2 className="h-6 w-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-xl bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Text-to-Speech
              </CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-400">
                Convert text to speech with advanced controls
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
        <Textarea
          placeholder="Enter text to be spoken..."
          value={text}
          onChange={handleTextChange}
          className="min-h-[200px] resize-none bg-black/30 backdrop-blur-sm border-gray-700/30 focus:border-purple-400/50 transition-all duration-300 rounded-xl text-base leading-relaxed text-gray-200 placeholder:text-gray-500"
        />

        {/* Progress Bar */}
        {isSpeaking && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-400">
              <span>Progress</span>
              <span>{Math.round(getProgressPercentage())}%</span>
            </div>
            <div className="w-full bg-gray-700/30 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${getProgressPercentage()}%` }}
              />
            </div>
          </div>
        )}

        <div className="flex flex-col space-y-4">
          {/* Voice Selection */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-300">Voice</Label>
            <Select value={selectedVoice} onValueChange={handleVoiceChange}>
              <SelectTrigger className="bg-black/30 backdrop-blur-sm border-gray-700/30 focus:border-purple-400/50 transition-all duration-300 rounded-xl text-gray-200">
                <SelectValue placeholder="Select voice" />
              </SelectTrigger>
              <SelectContent className="bg-black/80 backdrop-blur-sm border-gray-700/30 rounded-xl text-gray-200">
                {voices.map((voice) => (
                  <SelectItem key={voice.voiceURI} value={voice.voiceURI} className="rounded-lg">
                    {voice.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Advanced Controls */}
          {showAdvanced && (
            <div className="space-y-6 p-4 bg-black/20 rounded-xl border border-gray-700/30">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-200">Advanced Settings</h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={resetSettings}
                  className="bg-white/10 dark:bg-black/10 backdrop-blur-sm border-white/30 dark:border-gray-700/30 hover:bg-white/20 dark:hover:bg-black/20 transition-all duration-300"
                >
                  Reset
                </Button>
              </div>

              {/* Speed Control */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <Label className="text-sm font-medium text-gray-300">Speed</Label>
                  <span className="text-sm text-gray-400">{rate[0].toFixed(1)}x</span>
                </div>
                <Slider value={rate} onValueChange={handleRateChange} max={2} min={0.1} step={0.1} className="w-full" />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Slow (0.1x)</span>
                  <span>Normal (1x)</span>
                  <span>Fast (2x)</span>
                </div>
              </div>

              {/* Pitch Control */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <Label className="text-sm font-medium text-gray-300">Pitch</Label>
                  <span className="text-sm text-gray-400">{pitch[0].toFixed(1)}</span>
                </div>
                <Slider value={pitch} onValueChange={handlePitchChange} max={2} min={0} step={0.1} className="w-full" />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Low (0)</span>
                  <span>Normal (1)</span>
                  <span>High (2)</span>
                </div>
              </div>

              {/* Volume Control */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <Label className="text-sm font-medium text-gray-300">Volume</Label>
                  <span className="text-sm text-gray-400">{Math.round(volume[0] * 100)}%</span>
                </div>
                <Slider
                  value={volume}
                  onValueChange={handleVolumeChange}
                  max={1}
                  min={0}
                  step={0.1}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Mute (0%)</span>
                  <span>Normal (50%)</span>
                  <span>Max (100%)</span>
                </div>
              </div>
            </div>
          )}

          {/* Control Buttons */}
          <div className="flex justify-between items-center">
            <Button
              variant="outline"
              size="icon"
              onClick={copyToClipboard}
              disabled={!text}
              title="Copy to clipboard"
              className="bg-white/10 dark:bg-black/10 backdrop-blur-sm border-white/30 dark:border-gray-700/30 hover:bg-white/20 dark:hover:bg-black/20 transition-all duration-300 hover:scale-110"
            >
              <Copy className="h-4 w-4" />
            </Button>

            {/* Playback Controls */}
            <div className="flex space-x-2">
              {isSpeaking && (
                <>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={skipBackward}
                    title="Skip backward 10 words"
                    className="bg-white/10 dark:bg-black/10 backdrop-blur-sm border-white/30 dark:border-gray-700/30 hover:bg-white/20 dark:hover:bg-black/20 transition-all duration-300"
                  >
                    <SkipBack className="h-4 w-4" />
                  </Button>

                  <Button
                    variant="outline"
                    size="icon"
                    onClick={pauseResume}
                    title={isPaused ? "Resume" : "Pause"}
                    className="bg-white/10 dark:bg-black/10 backdrop-blur-sm border-white/30 dark:border-gray-700/30 hover:bg-white/20 dark:hover:bg-black/20 transition-all duration-300"
                  >
                    <Pause className="h-4 w-4" />
                  </Button>

                  <Button
                    variant="outline"
                    size="icon"
                    onClick={skipForward}
                    title="Skip forward 10 words"
                    className="bg-white/10 dark:bg-black/10 backdrop-blur-sm border-white/30 dark:border-gray-700/30 hover:bg-white/20 dark:hover:bg-black/20 transition-all duration-300"
                  >
                    <SkipForward className="h-4 w-4" />
                  </Button>
                </>
              )}

              {isSpeaking ? (
                <Button
                  variant="destructive"
                  onClick={stopSpeaking}
                  className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 shadow-lg shadow-red-500/25 text-white border-0 px-6 py-3 rounded-xl font-medium transition-all duration-300"
                >
                  <Square className="mr-2 h-5 w-5" />
                  <span>Stop</span>
                </Button>
              ) : (
                <Button
                  onClick={speak}
                  disabled={!text || voices.length === 0}
                  className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 shadow-lg shadow-purple-500/25 text-white border-0 px-6 py-3 rounded-xl font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Play className="mr-2 h-5 w-5" />
                  <span>Speak</span>
                </Button>
              )}
            </div>
          </div>

          {/* Status Indicator */}
          {isSpeaking && (
            <div className="flex items-center justify-center space-x-3 p-4 bg-gradient-to-r from-purple-900/30 to-pink-900/30 rounded-xl border border-purple-700/30">
              <Waves className="h-5 w-5 text-purple-400 animate-pulse" />
              <span className="text-purple-300 font-medium">{isPaused ? "Paused" : "Speaking..."}</span>
              <div className="flex space-x-1">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className={`w-2 h-2 bg-purple-400 rounded-full ${isPaused ? "" : "animate-bounce"}`}
                    style={{ animationDelay: `${i * 0.1}s` }}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
