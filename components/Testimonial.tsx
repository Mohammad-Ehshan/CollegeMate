"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { ChevronLeft, ChevronRight, Quote } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"

export default function Testimonials() {
  const [current, setCurrent] = useState(0)
  const [autoplay, setAutoplay] = useState(true)

  const testimonials = [
    {
      quote: "CampusMate has completely transformed how I manage my campus life. The canteen predictions are spot on!",
      author: "Alex Johnson",
      role: "Computer Science Student",
      avatar: "/placeholder.svg?height=80&width=80",
    },
    {
      quote:
        "As a scholarship coordinator, this platform has made it so much easier to connect students with opportunities.",
      author: "Dr. Sarah Williams",
      role: "Faculty Advisor",
      avatar: "/placeholder.svg?height=80&width=80",
    },
    {
      quote: "I found my lost laptop within hours thanks to the digital lost & found system. Absolute lifesaver!",
      author: "Michael Chen",
      role: "Engineering Student",
      avatar: "/placeholder.svg?height=80&width=80",
    },
  ]

  useEffect(() => {
    if (!autoplay) return

    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % testimonials.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [autoplay, testimonials.length])

  const next = () => {
    setAutoplay(false)
    setCurrent((prev) => (prev + 1) % testimonials.length)
  }

  const prev = () => {
    setAutoplay(false)
    setCurrent((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  return (
    <section className="py-20 px-4 bg-white dark:bg-gray-900">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
            What Students & Faculty Say
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Real experiences from our campus community
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Testimonial image placeholder */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
            <div className="aspect-square max-w-md mx-auto rounded-xl bg-gradient-to-br from-purple-50 to-sky-50 dark:from-purple-900/20 dark:to-sky-900/20 flex items-center justify-center overflow-hidden border border-gray-100 dark:border-gray-800">
              <div className="text-center p-8">
                <p className="text-gray-500 dark:text-gray-400"><Image src={"/testimonials.png"} alt="testimonials" height={600} width={600}/></p>
              </div>

              {/* Decorative elements */}
              <div className="absolute top-1/3 right-1/3 w-32 h-32 bg-purple-300/10 dark:bg-purple-500/5 rounded-full blur-xl"></div>
              <div className="absolute bottom-1/3 left-1/3 w-24 h-24 bg-sky-300/10 dark:bg-sky-500/5 rounded-full blur-xl"></div>
            </div>
          </motion.div>

          <div className="max-w-xl mx-auto relative">
            <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 text-emerald-500/20 dark:text-emerald-400/10">
              <Quote size={120} />
            </div>

            <div className="relative overflow-hidden py-10">
              <AnimatePresence mode="wait">
                <motion.div
                  key={current}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                  className="text-center"
                >
                  <Card className="border-none shadow-none bg-transparent">
                    <CardContent className="pt-6">
                      <p className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 mb-8 relative z-10">
                        "{testimonials[current].quote}"
                      </p>

                      <div className="flex flex-col items-center">
                        <div className="w-16 h-16 rounded-full overflow-hidden mb-4 border-2 border-emerald-500">
                          <img
                            src={testimonials[current].avatar || "/placeholder.svg"}
                            alt={testimonials[current].author}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="text-lg font-semibold">{testimonials[current].author}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">{testimonials[current].role}</div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="flex justify-center gap-4 mt-8">
              <Button variant="outline" size="icon" onClick={prev} className="rounded-full">
                <ChevronLeft className="h-5 w-5" />
                <span className="sr-only">Previous</span>
              </Button>

              <div className="flex gap-2 items-center">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setAutoplay(false)
                      setCurrent(index)
                    }}
                    className={`w-2.5 h-2.5 rounded-full transition-colors ${
                      index === current ? "bg-emerald-600 dark:bg-emerald-400" : "bg-gray-300 dark:bg-gray-700"
                    }`}
                    aria-label={`Go to testimonial ${index + 1}`}
                  />
                ))}
              </div>

              <Button variant="outline" size="icon" onClick={next} className="rounded-full">
                <ChevronRight className="h-5 w-5" />
                <span className="sr-only">Next</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

