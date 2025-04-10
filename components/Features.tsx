"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Utensils, Search, GraduationCap, TrendingUp, Star, Smile, MapPin } from "lucide-react"
import { Slider } from "@/components/ui/slider"
import { Progress } from "@/components/ui/progress"
import Image from "next/image"

export default function Features() {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null)

  const features = [
    {
      title: "AI-Powered Canteen Management",
      description: "Predict food demand, reduce waste, and optimize meal planning",
      icon: Utensils,
      hoverContent: (
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Calorie Insights</span>
              <span className="font-medium">650 kcal</span>
            </div>
            <div className="h-2 bg-emerald-100 dark:bg-emerald-950 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-emerald-500 rounded-full"
                initial={{ width: "0%" }}
                animate={{ width: "65%" }}
                transition={{ duration: 1 }}
              />
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Feedback</span>
              <span className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} size={16} className="text-yellow-400 fill-yellow-400" />
                ))}
              </span>
            </div>
            <Slider defaultValue={[80]} max={100} step={1} className="cursor-pointer" />
          </div>
        </div>
      ),
    },
    {
      title: "Digital Lost & Found",
      description: "Report lost items and get notified when they're found",
      icon: Search,
      hoverContent: (
        <div className="space-y-4">
          <div className="relative h-32 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
            <motion.div
              className="absolute"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
              style={{ left: "50%", top: "30%", x: "-50%" }}
            >
              <MapPin className="text-red-500" size={24} />
            </motion.div>
            <motion.div
              className="absolute bottom-0 left-0 right-0 bg-white dark:bg-gray-700 p-2 rounded-t-lg"
              initial={{ y: 60 }}
              animate={{ y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <div className="text-xs font-medium">Recently Found</div>
              <div className="flex items-center text-sm mt-1">
                <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-800 flex items-center justify-center mr-2">
                  <Smile size={16} className="text-emerald-600 dark:text-emerald-300" />
                </div>
                <div>Blue Water Bottle - Library</div>
              </div>
            </motion.div>
          </div>
        </div>
      ),
    },
    {
      title: "Scholarship Finder",
      description: "Automatically match your profile with available scholarships",
      icon: GraduationCap,
      hoverContent: (
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Profile Completion</span>
              <span className="font-medium">85%</span>
            </div>
            <Progress value={85} className="h-2" />
          </div>
          <div className="space-y-1">
            <div className="flex justify-between text-sm">
              <span>Matching Scholarships</span>
              <span className="font-medium text-emerald-600 dark:text-emerald-400">12 Found</span>
            </div>
            <div className="grid grid-cols-3 gap-1">
              {[1, 2, 3].map((i) => (
                <motion.div
                  key={i}
                  className="h-6 bg-emerald-100 dark:bg-emerald-900 rounded flex items-center justify-center"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <TrendingUp size={12} className="text-emerald-600 dark:text-emerald-400" />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      ),
    },
  ]

  return (
    <section className="py-20 px-4 bg-white dark:bg-gray-900">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">Core Features</h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Explore our innovative solutions designed to transform campus life
          </p>
        </div>

        {/* Features image placeholder */}
        <div className="mb-16">
          <div className="max-w-4xl mx-auto relative">
            <div className="aspect-[16/9] rounded-xl bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 flex items-center justify-center overflow-hidden">
              <div className="text-center p-8">
                <p className="text-gray-500 dark:text-gray-400"><Image src="/Features.png" alt="features" height={1200} width={675}/></p>
              </div>

              {/* Decorative elements */}
              <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-emerald-300/10 dark:bg-emerald-500/5 rounded-full blur-xl"></div>
              <div className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-sky-300/10 dark:bg-sky-500/5 rounded-full blur-xl"></div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              onHoverStart={() => setHoveredCard(index)}
              onHoverEnd={() => setHoveredCard(null)}
            >
              <Card className="h-full overflow-hidden border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <feature.icon className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
                    <div className="h-8 w-8 rounded-full bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center">
                      <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400">{index + 1}</span>
                    </div>
                  </div>
                  <CardTitle className="mt-4">{feature.title}</CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{
                      opacity: hoveredCard === index ? 1 : 0,
                      height: hoveredCard === index ? "auto" : 0,
                    }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    {feature.hoverContent}
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

