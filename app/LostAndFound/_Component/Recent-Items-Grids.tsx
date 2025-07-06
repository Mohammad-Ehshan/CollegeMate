"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import { MapPin, Clock } from "lucide-react"

const recentItems = [
  {
    id: 1,
    title: "Blue Hydroflask Water Bottle",
    image: "/waterbottle.webp?height=300&width=300",
    location: "Student Center",
    date: "2 hours ago",
    status: "lost",
  },
  {
    id: 2,
    title: "Apple AirPods Pro",
    image: "/airpod.jpg?height=300&width=300",
    location: "Engineering Building",
    date: "Yesterday",
    status: "found",
  },
  {
    id: 3,
    title: "Student ID Card",
    image: "/idcard.jpg?height=300&width=300",
    location: "Library",
    date: "2 days ago",
    status: "lost",
  },
  {
    id: 4,
    title: "Black Laptop Charger",
    image: "/laptopcharger.jpg?height=300&width=300",
    location: "Science Hall",
    date: "3 days ago",
    status: "found",
  },
  {
    id: 5,
    title: "Green Notebook",
    image: "/greennotebook.jpg?height=300&width=300",
    location: "Math Building",
    date: "4 days ago",
    status: "lost",
  },
  {
    id: 6,
    title: "Car Keys with Keychain",
    image: "/carkey.webp?height=300&width=300",
    location: "Parking Lot B",
    date: "5 days ago",
    status: "found",
  },
]

export function RecentItemsGrid() {
  return (
    <section className="container mx-auto px-4 py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
      >
        <h2 className="text-3xl font-bold text-center mb-4">Recent Items</h2>
        <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
          Browse through recently reported lost and found items on campus
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {recentItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              className="bg-white rounded-xl shadow-md overflow-hidden"
            >
              <div className="relative h-48">
                <Image src={item.image || "/placeholder.svg"} alt={item.title} fill className="object-cover" />
                <div className="absolute top-3 right-3">
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                      item.status === "lost" ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"
                    }`}
                  >
                    {item.status === "lost" ? "Lost" : "Found"}
                  </span>
                </div>
              </div>
              <div className="p-5">
                <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                <div className="flex items-center text-gray-500 text-sm mb-1">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span>{item.location}</span>
                </div>
                <div className="flex items-center text-gray-500 text-sm">
                  <Clock className="h-4 w-4 mr-1" />
                  <span>{item.date}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-10">
          <button className="bg-white hover:bg-gray-50 text-emerald-600 font-medium py-3 px-6 rounded-lg border border-emerald-600 transition-all duration-200 transform hover:scale-105">
            View All Items
          </button>
        </div>
      </motion.div>
    </section>
  )
}

