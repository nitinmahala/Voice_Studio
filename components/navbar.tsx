"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { MoonIcon, SunIcon, Menu, X, Mic, Volume2 } from "lucide-react"
import { useTheme } from "next-themes"

export default function Navbar() {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  // Wait for component to mount to avoid hydration mismatch
  useEffect(() => {
    setMounted(true)

    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  if (!mounted) return null

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        isScrolled ? "bg-black/50 backdrop-blur-lg shadow-lg" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="p-2 bg-black/30 backdrop-blur-sm rounded-xl border border-gray-700/50">
                <div className="flex items-center space-x-1">
                  <Mic className="h-5 w-5 text-blue-400" />
                  <Volume2 className="h-5 w-5 text-purple-400" />
                </div>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Voice Studio
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              href="#features"
              className="text-gray-300 hover:text-white transition-colors duration-200 font-medium"
            >
              Features
            </Link>
            <Link
              href="#tools-section"
              className="text-gray-300 hover:text-white transition-colors duration-200 font-medium"
            >
              Tools
            </Link>
            <Link
              href="#testimonials"
              className="text-gray-300 hover:text-white transition-colors duration-200 font-medium"
            >
              Testimonials
            </Link>
            <Link href="#faq" className="text-gray-300 hover:text-white transition-colors duration-200 font-medium">
              FAQ
            </Link>
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              aria-label="Toggle theme"
              className="bg-black/30 backdrop-blur-sm border-gray-700/50 hover:bg-black/40 transition-all duration-300 text-gray-300 hover:text-white"
            >
              {theme === "dark" ? <SunIcon className="h-5 w-5" /> : <MoonIcon className="h-5 w-5" />}
            </Button>

            <div className="hidden md:block">
              <Button className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 shadow-lg shadow-purple-500/25 text-white border-0 rounded-xl font-medium transition-all duration-300">
                Sign Up Free
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <Button
                variant="outline"
                size="icon"
                onClick={toggleMenu}
                aria-label="Toggle menu"
                className="bg-black/30 backdrop-blur-sm border-gray-700/50 hover:bg-black/40 transition-all duration-300 text-gray-300 hover:text-white"
              >
                {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-black/80 backdrop-blur-lg animate-fade-in">
          <div className="px-4 pt-2 pb-4 space-y-1">
            <Link
              href="#features"
              className="block py-3 px-4 text-gray-300 hover:text-white transition-colors duration-200 font-medium border-b border-gray-700/30"
              onClick={() => setIsMenuOpen(false)}
            >
              Features
            </Link>
            <Link
              href="#tools-section"
              className="block py-3 px-4 text-gray-300 hover:text-white transition-colors duration-200 font-medium border-b border-gray-700/30"
              onClick={() => setIsMenuOpen(false)}
            >
              Tools
            </Link>
            <Link
              href="#testimonials"
              className="block py-3 px-4 text-gray-300 hover:text-white transition-colors duration-200 font-medium border-b border-gray-700/30"
              onClick={() => setIsMenuOpen(false)}
            >
              Testimonials
            </Link>
            <Link
              href="#faq"
              className="block py-3 px-4 text-gray-300 hover:text-white transition-colors duration-200 font-medium border-b border-gray-700/30"
              onClick={() => setIsMenuOpen(false)}
            >
              FAQ
            </Link>
            <div className="pt-2 pb-1">
              <Button className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 shadow-lg shadow-purple-500/25 text-white border-0 rounded-xl font-medium transition-all duration-300">
                Sign Up Free
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
