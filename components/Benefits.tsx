"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Leaf, Clock, Bell, Users, Shield, Zap } from "lucide-react";
import Image from "next/image";

export default function Benefits() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, amount: 0.2 });

  const benefits = [
    {
      title: "Save Food & Reduce Waste",
      description: "Optimize food preparation based on AI predictions",
      icon: Leaf,
      color:
        "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/50 dark:text-emerald-400",
    },
    {
      title: "Find Lost Items Quickly",
      description: "Efficient digital tracking system for campus belongings",
      icon: Clock,
      color: "bg-sky-100 text-sky-600 dark:bg-sky-900/50 dark:text-sky-400",
    },
    {
      title: "Scholarship Notifications",
      description: "Get alerts for opportunities matching your profile",
      icon: Bell,
      color:
        "bg-yellow-100 text-yellow-600 dark:bg-yellow-900/50 dark:text-yellow-400",
    },
    {
      title: "Build Community",
      description: "Connect with peers through platform interactions",
      icon: Users,
      color:
        "bg-purple-100 text-purple-600 dark:bg-purple-900/50 dark:text-purple-400",
    },
    {
      title: "Secure & Private",
      description: "Your data is protected with enterprise-grade security",
      icon: Shield,
      color: "bg-red-100 text-red-600 dark:bg-red-900/50 dark:text-red-400",
    },
    {
      title: "Boost Efficiency",
      description: "Save time with automated campus processes",
      icon: Zap,
      color:
        "bg-orange-100 text-orange-600 dark:bg-orange-900/50 dark:text-orange-400",
    },
  ];

  return (
    <section className="py-20 px-4 bg-gray-50 dark:bg-gray-950" ref={ref}>
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
            Benefits
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            How CampusMate transforms the student experience
          </p>
        </div>

        {/* Benefits image placeholder */}
        <div className="mb-16">
          <div className="max-w-3xl mx-auto relative">
            <div className="aspect-video rounded-xl flex items-center justify-center overflow-hidden">
              <div className="text-center p-8">
                <p className="text-gray-500 dark:text-gray-400">
                  <Image
                    className="object-cover rounded-3xl"
                    src="/benefits.png"
                    alt="benefits"
                    height={1200}
                    width={675}
                  />
                </p>
              </div>

              {/* Decorative elements */}
              <div className="absolute top-1/4 right-1/4 w-32 h-32 bg-yellow-300/10 dark:bg-yellow-500/5 rounded-full blur-xl"></div>
              <div className="absolute bottom-1/4 left-1/4 w-40 h-40 bg-purple-300/10 dark:bg-purple-500/5 rounded-full blur-xl"></div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg h-full border border-gray-100 dark:border-gray-700 transform transition-transform duration-300 ease-in-out hover:-translate-y-2 hover:scale-[1.03] hover:shadow-2xl">
                <div
                  className={`w-12 h-12 rounded-lg ${benefit.color} flex items-center justify-center mb-4 shadow-md transition duration-300 transform hover:rotate-6`}
                >
                  <benefit.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white transition-colors duration-300">
                  {benefit.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 transition-colors duration-300">
                  {benefit.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
