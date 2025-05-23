"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { RotateCw } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

// Simple keyword-based sentiment analysis
const sentimentKeywords = {
  positive: [
    "good",
    "great",
    "excellent",
    "amazing",
    "wonderful",
    "fantastic",
    "terrific",
    "outstanding",
    "superb",
    "brilliant",
    "awesome",
    "happy",
    "joy",
    "love",
    "like",
    "beautiful",
    "best",
    "perfect",
    "pleased",
    "delighted",
    "glad",
    "enjoy",
    "thanks",
    "thank you",
    "appreciate",
    "excited",
    "impressive",
    "success",
    "win",
    "winning",
  ],
  negative: [
    "bad",
    "terrible",
    "horrible",
    "awful",
    "poor",
    "disappointing",
    "worst",
    "hate",
    "dislike",
    "sad",
    "unhappy",
    "angry",
    "upset",
    "annoyed",
    "frustrated",
    "disappointed",
    "fail",
    "failure",
    "problem",
    "issue",
    "trouble",
    "difficult",
    "wrong",
    "mistake",
    "error",
    "broken",
    "damage",
    "hurt",
    "pain",
    "sorry",
  ],
}

type SentimentResult = "positive" | "negative" | "neutral" | null

export default function SentimentAnalyzer() {
  const [text, setText] = useState("")
  const [sentiment, setSentiment] = useState<SentimentResult>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    // Load saved data from localStorage if available
    const savedText = localStorage.getItem("sentiment-text")
    const savedSentiment = localStorage.getItem("sentiment-result") as SentimentResult

    if (savedText) setText(savedText)
    if (savedSentiment) setSentiment(savedSentiment)
  }, [])

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value)
    localStorage.setItem("sentiment-text", e.target.value)
  }

  const analyzeSentiment = () => {
    if (!text.trim()) {
      toast({
        title: "Error",
        description: "Please enter text to analyze",
        variant: "destructive",
      })
      return
    }

    setIsAnalyzing(true)

    // Simulate processing time for better UX
    setTimeout(() => {
      try {
        const words = text.toLowerCase().split(/\W+/)
        let positiveCount = 0
        let negativeCount = 0

        // Count positive and negative keywords
        words.forEach((word) => {
          if (sentimentKeywords.positive.includes(word)) {
            positiveCount++
          } else if (sentimentKeywords.negative.includes(word)) {
            negativeCount++
          }
        })

        // Determine sentiment based on keyword counts
        let result: SentimentResult
        if (positiveCount > negativeCount) {
          result = "positive"
        } else if (negativeCount > positiveCount) {
          result = "negative"
        } else {
          result = "neutral"
        }

        setSentiment(result)
        localStorage.setItem("sentiment-result", result)
      } catch (error) {
        console.error("Sentiment analysis error:", error)
        toast({
          title: "Analysis Error",
          description: "Failed to analyze sentiment",
          variant: "destructive",
        })
      } finally {
        setIsAnalyzing(false)
      }
    }, 500)
  }

  const getSentimentEmoji = () => {
    switch (sentiment) {
      case "positive":
        return "😀"
      case "negative":
        return "😞"
      case "neutral":
        return "😐"
      default:
        return ""
    }
  }

  const getSentimentColor = () => {
    switch (sentiment) {
      case "positive":
        return "text-green-500 dark:text-green-400"
      case "negative":
        return "text-red-500 dark:text-red-400"
      case "neutral":
        return "text-yellow-500 dark:text-yellow-400"
      default:
        return ""
    }
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Sentiment Analysis</CardTitle>
        <CardDescription>Analyze the sentiment of your text</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Textarea
          placeholder="Enter text to analyze sentiment..."
          value={text}
          onChange={handleTextChange}
          className="min-h-[150px] resize-none"
        />

        <div className="flex justify-end">
          <Button onClick={analyzeSentiment} disabled={!text.trim() || isAnalyzing}>
            {isAnalyzing ? (
              <>
                <RotateCw className="mr-2 h-4 w-4 animate-spin" /> Analyzing...
              </>
            ) : (
              "Analyze Sentiment"
            )}
          </Button>
        </div>

        {sentiment && (
          <div className="mt-4 p-4 bg-muted rounded-md flex items-center justify-center gap-4">
            <span className="text-4xl">{getSentimentEmoji()}</span>
            <div className="text-center">
              <p className="text-sm font-medium">Sentiment:</p>
              <p className={`text-xl font-bold capitalize ${getSentimentColor()}`}>{sentiment}</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
