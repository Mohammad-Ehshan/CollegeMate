"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { LogIn, Utensils, GraduationCap, ArrowRight } from "lucide-react"
import Image from "next/image"

export default function HowItWorks() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: false, amount: 0.2 })

  const steps = [
    {
      title: "Student logs in",
      description: "Secure authentication with campus credentials",
      icon: LogIn,
      color: "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/50 dark:text-emerald-400",
    },
    {
      title: "Uses campus modules",
      description: "Access canteen, lost & found, or scholarship features",
      icon: Utensils,
      color: "bg-sky-100 text-sky-600 dark:bg-sky-900/50 dark:text-sky-400",
    },
    {
      title: "Receives intelligent suggestions",
      description: "AI provides personalized recommendations",
      icon: GraduationCap,
      color: "bg-yellow-100 text-yellow-600 dark:bg-yellow-900/50 dark:text-yellow-400",
    },
  ]

  return (
    <section className="py-20 px-4 bg-white dark:bg-gray-900" ref={ref}>
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">How It Works</h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            A simple process designed for students and campus staff
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
          {/* How it works image placeholder - left side */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
            transition={{ duration: 0.8 }}
            className="order-2 lg:order-1"
          >
            <div className="aspect-[4/3] rounded-xl bg-gradient-to-br from-sky-50 to-emerald-50 dark:from-sky-900/20 dark:to-emerald-900/20 flex items-center justify-center overflow-hidden border border-gray-100 dark:border-gray-800">
              <div className="text-center p-8">
                <p className="text-gray-500 dark:text-gray-400"><Image src="/howitworks.png" alt="how it works" height={800} width={600}/></p>
              </div>

              {/* Decorative elements */}
              <div className="absolute top-1/3 left-1/3 w-32 h-32 bg-emerald-300/10 dark:bg-emerald-500/5 rounded-full blur-xl"></div>
              <div className="absolute bottom-1/3 right-1/3 w-24 h-24 bg-sky-300/10 dark:bg-sky-500/5 rounded-full blur-xl"></div>
            </div>
          </motion.div>

          <div className="order-1 lg:order-2">
            <div className="max-w-lg">
              {/* Steps */}
              <div className="space-y-8">
                {steps.map((step, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                    transition={{ duration: 0.5, delay: index * 0.2 }}
                    className="relative"
                  >
                    <div className="flex items-start">
                      {/* Step number */}
                      <div
                        className={`w-12 h-12 rounded-full ${step.color} flex items-center justify-center mr-4 flex-shrink-0`}
                      >
                        <step.icon className="h-6 w-6" />
                      </div>

                      {/* Content */}
                      <div>
                        <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                        <p className="text-gray-600 dark:text-gray-400">{step.description}</p>

                        {index < steps.length - 1 && (
                          <div className="mt-4 ml-2">
                            <ArrowRight className="h-5 w-5 text-gray-400" />
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

