"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { BookOpen, Coffee, MapPin, Coins, GraduationCap } from "lucide-react";
import AnimatedGridBackground from "./Animated-Grid-Background";
import Image from "next/image";

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden px-4 pt-28 pb-20">
      {/* Animated grid background */}
      <AnimatedGridBackground />

      {/* Animated floating icons */}
      <div className="absolute inset-0 z-0">
        {[BookOpen, Coffee, MapPin, Coins].map((Icon, index) => (
          <motion.div
            key={index}
            className="absolute text-emerald-500/20 dark:text-emerald-400/10"
            initial={{
              x: Math.random() * 100 - 50,
              y: Math.random() * 100 - 50,
              opacity: 0.3,
              scale: 0.5 + Math.random() * 1.5,
            }}
            animate={{
              x: [
                Math.random() * 100 - 50,
                Math.random() * 100 - 50,
                Math.random() * 100 - 50,
              ],
              y: [
                Math.random() * 100 - 50,
                Math.random() * 100 - 50,
                Math.random() * 100 - 50,
              ],
              opacity: [0.3, 0.6, 0.3],
              scale: [
                0.5 + Math.random() * 1.5,
                0.8 + Math.random() * 1.2,
                0.5 + Math.random() * 1.5,
              ],
            }}
            transition={{
              repeat: Number.POSITIVE_INFINITY,
              duration: 15 + Math.random() * 10,
              ease: "easeInOut",
            }}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          >
            <Icon size={30 + Math.random() * 70} />
          </motion.div>
        ))}
      </div>

      <div className="container mx-auto z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            className="text-center lg:text-left"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.h1
              className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-sky-500 dark:from-emerald-400 dark:to-sky-300"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Revolutionizing Campus Life with AI & Automation
            </motion.h1>

            <motion.p
              className="text-lg md:text-xl text-gray-700 dark:text-gray-300 mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              A unified platform for canteen optimization, lost & found
              tracking, and smart scholarship discovery.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <Button
                size="lg"
                className="bg-emerald-600 hover:bg-emerald-700 text-white dark:bg-emerald-500 dark:hover:bg-emerald-600"
              >
                Try the Demo
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-emerald-600 text-emerald-600 hover:bg-emerald-50 dark:border-emerald-400 dark:text-emerald-400 dark:hover:bg-emerald-950/50"
              >
                Explore Features
              </Button>
            </motion.div>
          </motion.div>

          {/* Hero image placeholder */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="hidden lg:block"
          >
            <div className="relative aspect-square max-w-md mx-auto">
              {/* Replace this with your actual hero image */}
              <div className="w-full h-full rounded-2xl bg-gradient-to-br from-emerald-100 to-sky-100 dark:from-emerald-900/30 dark:to-sky-900/30 flex items-center justify-center border border-emerald-200 dark:border-emerald-800">
                <div className="text-center p-8">
                  <div className="inline-block p-4 bg-white dark:bg-gray-800 rounded-full mb-4 shadow-md">
                    <GraduationCap className="h-12 w-12 text-emerald-500" />
                  </div>
                  <p className="text-gray-500 dark:text-gray-400">
                    <Image
                      className="rounded-4xl"
                      src="/hero.png"
                      alt="heroImage"
                      height={600}
                      width={600}
                    />
                  </p>
                </div>
              </div>

              {/* Decorative elements */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-yellow-300/20 dark:bg-yellow-500/10 rounded-full blur-xl"></div>
              <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-emerald-300/20 dark:bg-emerald-500/10 rounded-full blur-xl"></div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
