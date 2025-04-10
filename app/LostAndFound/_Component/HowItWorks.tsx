"use client";

import { motion } from "framer-motion";
import { Upload, Search, Bell } from "lucide-react";

const steps = [
  {
    id: 1,
    title: "Upload item details and image",
    description:
      "Fill out a simple form with information about the lost or found item and upload a photo.",
    icon: Upload,
  },
  {
    id: 2,
    title: "Our AI matches it with found/lost reports and CCTV",
    description:
      "Advanced AI technology scans our database and campus CCTV footage to find potential matches.",
    icon: Search,
  },
  {
    id: 3,
    title: "Get notified instantly when a match is found",
    description:
      "Receive immediate notifications when your item is found or when someone claims your found item.",
    icon: Bell,
  },
];

export function HowItWorks() {
  return (
    <section className="container mx-auto px-4 py-16 bg-white rounded-3xl shadow-sm my-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
      >
        <h2 className="text-3xl font-bold text-center mb-4">How It Works</h2>
        <p className="text-gray-600 text-center mb-16 max-w-2xl mx-auto">
          Our platform makes it easy to report and find lost items on campus
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              viewport={{ once: true }}
              className="flex flex-col items-center text-center"
            >
              <div className="relative mb-6">
                <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
                  <step.icon className="h-10 w-10 text-emerald-600" />
                </div>
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-10 left-full w-full h-0.5 bg-emerald-200 -z-10 transform -translate-x-10" />
                )}
              </div>
              <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
              <p className="text-gray-600">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
