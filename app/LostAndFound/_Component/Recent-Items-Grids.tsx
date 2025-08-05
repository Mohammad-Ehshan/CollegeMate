"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import { MapPin, Clock } from "lucide-react"
import { useEffect, useState } from "react"
import { getRecentLostItems } from "@/utils/db/actions"

interface RecentItem {
  id: string; // UUID from database
  title: string;
  imageUrls: string[];
  locationLost: string;
  reportedAt: Date;
  status: "LOST" | "FOUND" | "CLAIMED";
}

export function RecentItemsGrid() {
  const [recentItems, setRecentItems] = useState<RecentItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchRecentItems = async () => {
      try {
        const items = await getRecentLostItems()
        setRecentItems(items)
      } catch (err) {
        console.error("Failed to fetch items:", err)
        setError("Failed to load recent items")
      } finally {
        setLoading(false)
      }
    }

    fetchRecentItems()
  }, [])

  const formatRelativeTime = (date: Date) => {
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)
    
    if (diffInSeconds < 60) return "Just Now"
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds/60)} min ago`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds/3600)} hours ago`
    
    const days = Math.floor(diffInSeconds/86400)
    return days === 1 ? "Yesterday" : `${days} days ago`
  }

  if (loading) {
    return (
      <section className="container mx-auto px-4 py-16">
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">Loading recent items...</p>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="container mx-auto px-4 py-16">
        <div className="text-center py-12">
          <p className="text-red-500 text-lg">{error}</p>
        </div>
      </section>
    )
  }

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

        {recentItems.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No recent items found</p>
          </div>
        ) : (
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
                <div className="relative h-68">
                  <Image 
                    src={item.imageUrls?.[0] || "/placeholder.svg"} 
                    alt={item.title} 
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 300px"
                  />
                  <div className="absolute top-3 right-3">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                        item.status === "LOST" ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                  <div className="flex items-center text-gray-500 text-sm mb-1">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span>{item.locationLost}</span>
                  </div>
                  <div className="flex items-center text-gray-500 text-sm">
                    <Clock className="h-4 w-4 mr-1" />
                    <span>{formatRelativeTime(item.reportedAt)}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        <div className="text-center mt-10">
          <button className="bg-white hover:bg-gray-50 text-emerald-600 font-medium py-3 px-6 rounded-lg border border-emerald-600 transition-all duration-200 transform hover:scale-105">
            View All Items
          </button>
        </div>
      </motion.div>
    </section>
  )
}