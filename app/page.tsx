"use client"

import { useState, useEffect } from "react"
import SpeechToText from "@/components/speech-to-text"
import TextToSpeech from "@/components/text-to-speech"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import Testimonials from "@/components/testimonials"
import Faq from "@/components/faq"
import { Button } from "@/components/ui/button"
import { Mic, Volume2, ChevronDown } from "lucide-react"

export default function Home() {
  const [mounted, setMounted] = useState(false)
  const [showTools, setShowTools] = useState(false)

  // Wait for component to mount to avoid hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  const scrollToTools = () => {
    setShowTools(true)
    setTimeout(() => {
      const toolsSection = document.getElementById("tools-section")
      if (toolsSection) {
        toolsSection.scrollIntoView({ behavior: "smooth" })
      }
    }, 100)
  }

  if (!mounted) return null

  return (
    <div className="min-h-screen relative overflow-hidden bg-gray-900">
      {/* Animated Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900" />

        {/* Floating Orbs */}
        <div className="absolute top-20 left-20 w-72 h-72 bg-blue-500/30 rounded-full mix-blend-screen filter blur-xl opacity-70 animate-blob" />
        <div className="absolute top-40 right-20 w-72 h-72 bg-purple-500/30 rounded-full mix-blend-screen filter blur-xl opacity-70 animate-blob animation-delay-2000" />
        <div className="absolute -bottom-8 left-40 w-72 h-72 bg-pink-500/30 rounded-full mix-blend-screen filter blur-xl opacity-70 animate-blob animation-delay-4000" />

        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-grid-pattern opacity-10" />

        {/* Floating Particles */}
        <div className="particles">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="particle"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 20}s`,
                animationDuration: `${20 + Math.random() * 20}s`,
              }}
            />
          ))}
        </div>
      </div>

      <div className="relative z-10">
        <Navbar />

        <main className="min-h-screen">
          {/* Hero Section */}
          <section className="py-20 px-4 md:px-8 max-w-6xl mx-auto text-center">
            <div className="animate-fade-in-up">
              <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-gradient">
                Voice Studio Pro
              </h1>
              <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed mb-10">
                Experience the power of voice technology with our advanced speech recognition and synthesis tools
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4 mb-16">
                <Button
                  onClick={scrollToTools}
                  className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-lg shadow-blue-500/25 text-white border-0 px-8 py-6 rounded-xl font-medium text-lg transition-all duration-300"
                >
                  Try It Now
                </Button>
                <Button
                  variant="outline"
                  className="bg-black/20 backdrop-blur-sm border-gray-700/30 hover:bg-black/30 text-gray-200 px-8 py-6 rounded-xl font-medium text-lg transition-all duration-300"
                >
                  Learn More
                </Button>
              </div>
              <div className="animate-bounce">
                <ChevronDown className="h-8 w-8 mx-auto text-gray-400" />
              </div>
            </div>
          </section>

          {/* Features Section */}
          <section className="py-16 px-4 md:px-8 max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Powerful Voice Features
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 animate-fade-in-up">
              <div className="text-center p-6 bg-black/20 backdrop-blur-sm rounded-2xl border border-gray-700/30 hover:bg-black/30 transition-all duration-300 hover:scale-105">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Mic className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-200">Multi-language Recognition</h3>
                <p className="text-gray-400">
                  Convert speech to text in 11 different languages with high accuracy and real-time transcription
                </p>
              </div>

              <div className="text-center p-6 bg-black/20 backdrop-blur-sm rounded-2xl border border-gray-700/30 hover:bg-black/30 transition-all duration-300 hover:scale-105">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Volume2 className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-200">Advanced Voice Controls</h3>
                <p className="text-gray-400">
                  Customize speech with adjustable speed, pitch, and volume for the perfect voice output
                </p>
              </div>

              <div className="text-center p-6 bg-black/20 backdrop-blur-sm rounded-2xl border border-gray-700/30 hover:bg-black/30 transition-all duration-300 hover:scale-105">
                <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                    <div className="w-4 h-4 bg-pink-500 rounded-full animate-pulse" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-200">Real-time Analytics</h3>
                <p className="text-gray-400">
                  Track word count, character count, and speech confidence with detailed statistics
                </p>
              </div>
            </div>
          </section>

          {/* Tools Section */}
          <section id="tools-section" className="py-16 px-4 md:px-8 max-w-6xl mx-auto">
            {showTools ? (
              <>
                <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Try Our Voice Tools
                </h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
                  <div className="animate-slide-in-left">
                    <SpeechToText />
                  </div>
                  <div className="animate-slide-in-right">
                    <TextToSpeech />
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-20">
                <Button
                  onClick={scrollToTools}
                  className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 shadow-lg shadow-purple-500/25 text-white border-0 px-8 py-6 rounded-xl font-medium text-lg transition-all duration-300"
                >
                  Show Voice Tools
                </Button>
              </div>
            )}
          </section>

          {/* Testimonials Section */}
          <Testimonials />

          {/* FAQ Section */}
          <Faq />
        </main>

        <Footer />
      </div>
    </div>
  )
}
