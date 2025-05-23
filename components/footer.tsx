import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Mic, Volume2, Github, Twitter, Linkedin, Facebook, Instagram, Send } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-black/30 backdrop-blur-lg border-t border-gray-800/50 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-10">
          {/* Brand Column */}
          <div className="space-y-6">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-black/30 backdrop-blur-sm rounded-xl border border-gray-700/50">
                <div className="flex items-center space-x-1">
                  <Mic className="h-5 w-5 text-blue-400" />
                  <Volume2 className="h-5 w-5 text-purple-400" />
                </div>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Voice Studio
              </span>
            </div>
            <p className="text-gray-400 text-sm">
              Advanced speech recognition and text-to-speech tools for professionals and everyday users.
            </p>
            <div className="flex space-x-4">
              
              
              
              <Link
                href="https://github.com/nitinmahala"
                className="text-gray-400 hover:text-white transition-colors duration-200"
                aria-label="GitHub"
              >
                <Github className="h-5 w-5" />
              </Link>
            </div>
          </div>

          {/* Links Column 1 */}
          

          {/* Links Column 2 */}
          

          {/* Newsletter Column */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Subscribe to our newsletter</h3>
            <p className="text-gray-400 text-sm mb-4">Get the latest updates and news directly in your inbox.</p>
            <div className="flex space-x-2">
              <Input
                type="email"
                placeholder="Enter your email"
                className="bg-black/30 border-gray-700/50 focus:border-purple-400/50 text-gray-200 placeholder:text-gray-500"
              />
              <Button
                size="icon"
                className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white border-0"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        
        </div>
      </div>
    </footer>
  )
}
