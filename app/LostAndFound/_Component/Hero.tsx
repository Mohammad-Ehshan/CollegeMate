"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"

export function HeroSection() {
  return (
    <section className="container mx-auto px-4 py-16 md:py-24 md:ml-24">
      <div className="flex flex-col md:flex-row items-center justify-between gap-8">
        <motion.div
          className="md:w-1/2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800 mb-4">Campus Lost & Found</h1>
          <p className="text-xl text-gray-600 mb-8">Easily report or find lost items on campus</p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href={"/LostAndFound/Report"}>
            <button className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 hover:cursor-pointer">
              Report Lost Item
            </button>
            </Link>
            <button className="bg-white hover:bg-gray-100 text-emerald-600 font-medium py-3 px-6 rounded-lg border border-emerald-600 transition-all duration-200 transform hover:scale-105">
              Report Found Item
            </button>
          </div>
        </motion.div>
        <motion.div
          className="md:w-1/2"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Image
            src="/lostandfound.png"
            alt="Lost and Found Illustration"
            width={500}
            height={400}
            // className="w-full h-auto rounded-lg shadow-lg"
          />
        </motion.div>
      </div>
    </section>
  )
}