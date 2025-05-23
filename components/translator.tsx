"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Copy, RotateCw } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

interface Language {
  code: string
  name: string
}

export default function Translator() {
  const [text, setText] = useState("")
  const [translatedText, setTranslatedText] = useState("")
  const [targetLang, setTargetLang] = useState("es")
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const languages: Language[] = [
    { code: "es", name: "Spanish" },
    { code: "fr", name: "French" },
    { code: "de", name: "German" },
    { code: "it", name: "Italian" },
    { code: "pt", name: "Portuguese" },
    { code: "ru", name: "Russian" },
    { code: "zh", name: "Chinese" },
    { code: "ja", name: "Japanese" },
  ]

  useEffect(() => {
    // Load saved data from localStorage if available
    const savedText = localStorage.getItem("translator-text")
    const savedTranslatedText = localStorage.getItem("translator-translated")
    const savedTargetLang = localStorage.getItem("translator-lang")

    if (savedText) setText(savedText)
    if (savedTranslatedText) setTranslatedText(savedTranslatedText)
    if (savedTargetLang) setTargetLang(savedTargetLang)
  }, [])

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value)
    localStorage.setItem("translator-text", e.target.value)
  }

  const translateText = async () => {
    if (!text.trim()) {
      toast({
        title: "Error",
        description: "Please enter text to translate",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch("https://libretranslate.com/translate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          q: text,
          source: "auto",
          target: targetLang,
          format: "text",
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()

      if (data.translatedText) {
        setTranslatedText(data.translatedText)
        localStorage.setItem("translator-translated", data.translatedText)
        localStorage.setItem("translator-lang", targetLang)
      } else {
        throw new Error("Translation failed")
      }
    } catch (error) {
      console.error("Translation error:", error)
      toast({
        title: "Translation Error",
        description: "Failed to translate text. The free API might be rate limited. Please try again later.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(translatedText)
    toast({
      title: "Copied!",
      description: "Translated text copied to clipboard",
    })
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Language Translator</CardTitle>
        <CardDescription>Translate text to different languages</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Textarea
          placeholder="Enter text to translate..."
          value={text}
          onChange={handleTextChange}
          className="min-h-[100px] resize-none"
        />

        <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
          <Select
            value={targetLang}
            onValueChange={(value) => {
              setTargetLang(value)
              localStorage.setItem("translator-lang", value)
            }}
          >
            <SelectTrigger className="w-full sm:w-[200px]">
              <SelectValue placeholder="Target language" />
            </SelectTrigger>
            <SelectContent>
              {languages.map((lang) => (
                <SelectItem key={lang.code} value={lang.code}>
                  {lang.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button onClick={translateText} disabled={!text.trim() || isLoading} className="ml-auto">
            {isLoading ? (
              <>
                <RotateCw className="mr-2 h-4 w-4 animate-spin" /> Translating...
              </>
            ) : (
              "Translate"
            )}
          </Button>
        </div>

        {translatedText && (
          <div className="mt-4 space-y-2">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-medium">Translation Result:</h3>
              <Button variant="outline" size="icon" onClick={copyToClipboard} title="Copy to clipboard">
                <Copy className="h-4 w-4" />
              </Button>
            </div>
            <div className="p-3 bg-muted rounded-md min-h-[100px]">{translatedText}</div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
