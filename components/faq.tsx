"use client"

import { useState } from "react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

const faqs = [
  {
    question: "How accurate is the speech recognition?",
    answer:
      "Our speech recognition technology achieves over 95% accuracy in ideal conditions. Factors like background noise, accent, and microphone quality can affect accuracy. For best results, use a good quality microphone in a quiet environment.",
  },
  {
    question: "Which languages are supported for speech recognition?",
    answer:
      "Voice Studio supports 11 languages including English (US & UK), Spanish, French, German, Italian, Portuguese, Russian, Japanese, Korean, and Chinese. We're constantly adding more languages and improving existing ones.",
  },
  {
    question: "Can I use Voice Studio offline?",
    answer:
      "Currently, Voice Studio requires an internet connection as it uses browser-based Web Speech API. However, we're developing an offline mode for basic functionality that will be available in future updates.",
  },
  {
    question: "Is there a limit to how much text I can process?",
    answer:
      "The free version allows up to 10 minutes of speech recognition and 1000 characters for text-to-speech per day. Premium plans offer unlimited usage and additional features like higher accuracy models and priority processing.",
  },
  {
    question: "How do I save my recordings and transcripts?",
    answer:
      "You can download your transcripts as text files directly from the interface. Premium users can also export in various formats including PDF, DOCX, and SRT for subtitles. All data is automatically saved in your browser's local storage.",
  },
  {
    question: "Is my voice data private and secure?",
    answer:
      "Yes, we take privacy seriously. Your voice data is processed in your browser and not stored on our servers unless you explicitly save it to your account. We never share or sell your data to third parties. See our Privacy Policy for more details.",
  },
]

export default function Faq() {
  const [openItem, setOpenItem] = useState<string | null>("item-0")

  return (
    <section id="faq" className="py-16 px-4 md:px-8 max-w-4xl mx-auto">
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
        Frequently Asked Questions
      </h2>

      <Accordion type="single" collapsible value={openItem} onValueChange={setOpenItem}>
        {faqs.map((faq, index) => (
          <AccordionItem key={index} value={`item-${index}`} className="border-b border-gray-700/30 last:border-0">
            <AccordionTrigger className="text-gray-200 hover:text-white text-left py-5">
              {faq.question}
            </AccordionTrigger>
            <AccordionContent className="text-gray-400 pb-5">{faq.answer}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      <div className="mt-12 text-center">
        <p className="text-gray-400 mb-6">Still have questions? We're here to help.</p>
        <a
          href="#"
          className="inline-block bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-lg shadow-blue-500/25 text-white border-0 px-6 py-3 rounded-xl font-medium transition-all duration-300"
        >
          Contact Support
        </a>
      </div>
    </section>
  )
}
