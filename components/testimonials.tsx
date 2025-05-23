import { Star } from "lucide-react"

const testimonials = [
  {
    id: 1,
    name: "Sarah Johnson",
    role: "Content Creator",
    image: "/placeholder.svg?height=80&width=80",
    quote:
      "Voice Studio has completely transformed my workflow. The speech-to-text feature is incredibly accurate, and I love being able to adjust the voice settings for my videos.",
    rating: 5,
  },
  {
    id: 2,
    name: "Michael Chen",
    role: "Software Developer",
    image: "/placeholder.svg?height=80&width=80",
    quote:
      "As someone who works with accessibility features, I'm impressed by the quality and customization options. The multi-language support is a game-changer for our international projects.",
    rating: 5,
  },
  {
    id: 3,
    name: "Elena Rodriguez",
    role: "Podcast Host",
    image: "/placeholder.svg?height=80&width=80",
    quote:
      "I use Voice Studio daily for transcribing interviews and creating voice-overs. The pitch and speed controls give me exactly the sound I need for my podcast intros.",
    rating: 4,
  },
]

export default function Testimonials() {
  return (
    <section id="testimonials" className="py-16 px-4 md:px-8 max-w-6xl mx-auto">
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
        What Our Users Say
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {testimonials.map((testimonial) => (
          <div
            key={testimonial.id}
            className="bg-black/20 backdrop-blur-sm rounded-2xl border border-gray-700/30 p-6 hover:bg-black/30 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-purple-500/5"
          >
            <div className="flex items-center mb-4">
              <img
                src={testimonial.image || "/placeholder.svg"}
                alt={testimonial.name}
                className="w-12 h-12 rounded-full mr-4 bg-gradient-to-r from-blue-500 to-purple-500 p-0.5"
              />
              <div>
                <h3 className="font-semibold text-gray-200">{testimonial.name}</h3>
                <p className="text-gray-400 text-sm">{testimonial.role}</p>
              </div>
            </div>

            <div className="flex mb-4">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${i < testimonial.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-600"}`}
                />
              ))}
            </div>

            <p className="text-gray-300 italic">"{testimonial.quote}"</p>
          </div>
        ))}
      </div>
    </section>
  )
}
