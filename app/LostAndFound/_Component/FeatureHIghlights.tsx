"use client"

import { motion } from "framer-motion"
import { Camera, Image, Bell, Map } from "lucide-react"

const features = [
  {
    id: 1,
    title: "YOLO-based CCTV detection",
    description: "Our system uses YOLO object detection to scan campus CCTV footage for lost items.",
    icon: Camera,
    color: "bg-blue-100",
    iconColor: "text-blue-600",
  },
  {
    id: 2,
    title: "AI image-matching",
    description: "Advanced image recognition algorithms match your lost item with found item reports.",
    icon: Image,
    color: "bg-purple-100",
    iconColor: "text-purple-600",
  },
  {
    id: 3,
    title: "Automatic user notifications",
    description: "Get instant alerts when your item is found or when someone claims your found item.",
    icon: Bell,
    color: "bg-amber-100",
    iconColor: "text-amber-600",
  },
  {
    id: 4,
    title: "Lost item heatmap",
    description: "View a campus map showing hotspots where items are frequently lost or found.",
    icon: Map,
    color: "bg-emerald-100",
    iconColor: "text-emerald-600",
  },
]

export function FeatureHighlights() {
  return (
    <section className="container mx-auto px-4 py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
      >
        <h2 className="text-3xl font-bold text-center mb-4">Feature Highlights</h2>
        <p className="text-gray-600 text-center mb-16 max-w-2xl mx-auto">
          Our platform uses cutting-edge technology to help you find your lost items
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{
                y: -5,
                boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                transition: { duration: 0.2 },
              }}
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
            >
              <div className={`w-12 h-12 ${feature.color} rounded-lg flex items-center justify-center mb-4`}>
                <feature.icon className={`h-6 w-6 ${feature.iconColor}`} />
              </div>
              <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  )
}

