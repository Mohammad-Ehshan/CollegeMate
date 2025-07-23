"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import { MapPin, Clock } from "lucide-react"

const recentItems = [
  {
    id: 1,
    title: "Laptop",
    image: "/laptop.png?height=300&width=300",
    location: "Canteen",
    date: "Just Now",
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















// "use client"

// import { motion } from "framer-motion"
// import Image from "next/image"
// import { MapPin, Clock } from "lucide-react"
// import { useEffect, useState } from "react"
// import { lostItemStatus } from "@/app/LostAndFound/_Component/lostandfound-type"
// import { getRecentLostItems } from "@/utils/db/actions"

// interface RecentItem {
//   id: string;
//   title: string;
//   imageUrls: string[];
//   locationLost: string;
//   reportedAt: Date;
//   status: "LOST" | "FOUND" | "CLAIMED"; 
//   geoLocation: {
//     lat: number;
//     lng: number;
//   } | null;
//   createdAt: Date;
// }

// export function RecentItemsGrid() {
//   const [recentItems, setRecentItems] = useState<RecentItem[]>([])
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState<string | null>(null)

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const items = await getRecentLostItems()
//         setRecentItems(items)
//       } catch (err) {
//         setError("Failed to load recent items")
//         console.error(err)
//       } finally {
//         setLoading(false)
//       }
//     }

//     fetchData()
//   }, [])

//   if (loading) {
//     return (
//       <section className="container mx-auto px-4 py-16">
//         <div className="text-center">Loading recent items...</div>
//       </section>
//     )
//   }

//   if (error) {
//     return (
//       <section className="container mx-auto px-4 py-16">
//         <div className="text-center text-red-500">{error}</div>
//       </section>
//     )
//   }

//   return (
//     <section className="container mx-auto px-4 py-16">
//       <motion.div
//         initial={{ opacity: 0, y: 20 }}
//         whileInView={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.5 }}
//         viewport={{ once: true }}
//       >
//         <h2 className="text-3xl font-bold text-center mb-4">Recent Items</h2>
//         <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
//           Browse through recently reported lost and found items on campus
//         </p>

//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//           {recentItems.map((item, index) => (
//             <motion.div
//               key={item.id}
//               initial={{ opacity: 0, y: 20 }}
//               whileInView={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.5, delay: index * 0.1 }}
//               viewport={{ once: true }}
//               whileHover={{ y: -5, transition: { duration: 0.2 } }}
//               className="bg-white rounded-xl shadow-md overflow-hidden"
//             >
//               <div className="relative h-48">
//                 <Image 
//                   src={item.imageUrls?.[0] || "/placeholder.svg"} 
//                   alt={item.title} 
//                   fill 
//                   className="object-cover" 
//                 />
//                 <div className="absolute top-3 right-3">
//                   <span
//                     className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
//                       item.status === "LOST" ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"
//                     }`}
//                   >
//                     {item.status === "LOST" ? "Lost" : "Found"}
//                   </span>
//                 </div>
//               </div>
//               <div className="p-5">
//                 <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
//                 <div className="flex items-center text-gray-500 text-sm mb-1">
//                   <MapPin className="h-4 w-4 mr-1" />
//                   <span>{item.locationLost}</span>
//                 </div>
//                 <div className="flex items-center text-gray-500 text-sm">
//                   <Clock className="h-4 w-4 mr-1" />
//                   <span>{formatDate(item.reportedAt)}</span>
//                 </div>
//               </div>
//             </motion.div>
//           ))}
//         </div>

//         <div className="text-center mt-10">
//           <button className="bg-white hover:bg-gray-50 text-emerald-600 font-medium py-3 px-6 rounded-lg border border-emerald-600 transition-all duration-200 transform hover:scale-105">
//             View All Items
//           </button>
//         </div>
//       </motion.div>
//     </section>
//   )
// }

// // Helper function to format date
// function formatDate(date: Date) {
//   const now = new Date()
//   const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
  
//   if (diffInHours < 24) {
//     return `${diffInHours} hour${diffInHours !== 1 ? 's' : ''} ago`
//   } else {
//     const diffInDays = Math.floor(diffInHours / 24)
//     return `${diffInDays} day${diffInDays !== 1 ? 's' : ''} ago`
//   }
// }






//working

// "use client"

// import { motion } from "framer-motion"
// import Image from "next/image"
// import { MapPin, Clock } from "lucide-react"
// import { useEffect, useState } from "react"
// import { lostItemStatus } from "@/app/LostAndFound/_Component/lostandfound-type"
// import { getRecentLostItems } from "@/utils/db/actions"

// interface RecentItem {
//   id: string;
//   title: string;
//   imageUrls: string[];
//   locationLost: string;
//   reportedAt: Date;
//   status: lostItemStatus;
//   geoLocation: {
//     lat: number;
//     lng: number;
//   } | null;
//   createdAt: Date;
// }

// export function RecentItemsGrid() {
//   const [recentItems, setRecentItems] = useState<RecentItem[]>([])
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState<string | null>(null)

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const items = await getRecentLostItems()
//         // Transform the data to ensure it matches our interface
//         const transformedItems = items.map(item => ({
//           ...item,
//           status: item.status || "LOST", // Provide default if null
//           geoLocation: item.geoLocation || null,
//           imageUrls: item.imageUrls || [] // Ensure imageUrls is always an array
//         }))
//         setRecentItems(transformedItems)
//       } catch (err) {
//         setError("Failed to load recent items")
//         console.error(err)
//       } finally {
//         setLoading(false)
//       }
//     }

//     fetchData()
//   }, [])

//   if (loading) {
//     return (
//       <section className="container mx-auto px-4 py-16">
//         <div className="flex justify-center items-center h-64">
//           <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
//         </div>
//       </section>
//     )
//   }

//   if (error) {
//     return (
//       <section className="container mx-auto px-4 py-16">
//         <div className="text-center text-red-500">
//           {error}
//           <button 
//             onClick={() => window.location.reload()} 
//             className="ml-4 bg-emerald-100 text-emerald-600 px-3 py-1 rounded"
//           >
//             Retry
//           </button>
//         </div>
//       </section>
//     )
//   }

//   if (recentItems.length === 0) {
//     return (
//       <section className="container mx-auto px-4 py-16">
//         <div className="text-center text-gray-500">
//           No recent items found. Check back later!
//         </div>
//       </section>
//     )
//   }

//   return (
//     <section className="container mx-auto px-4 py-16">
//       <motion.div
//         initial={{ opacity: 0, y: 20 }}
//         whileInView={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.5 }}
//         viewport={{ once: true }}
//       >
//         <h2 className="text-3xl font-bold text-center mb-4">Recent Items</h2>
//         <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
//           Browse through recently reported lost and found items on campus
//         </p>

//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//           {recentItems.map((item, index) => {
//             const statusColor = item.status === "LOST" 
//               ? "bg-red-100 text-red-800" 
//               : item.status === "FOUND" 
//                 ? "bg-green-100 text-green-800" 
//                 : "bg-blue-100 text-blue-800";
            
//             const statusText = item.status === "LOST" 
//               ? "Lost" 
//               : item.status === "FOUND" 
//                 ? "Found" 
//                 : "Claimed";

//             return (
//               <motion.div
//                 key={item.id}
//                 initial={{ opacity: 0, y: 20 }}
//                 whileInView={{ opacity: 1, y: 0 }}
//                 transition={{ duration: 0.5, delay: index * 0.1 }}
//                 viewport={{ once: true }}
//                 whileHover={{ y: -5, transition: { duration: 0.2 } }}
//                 className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
//               >
//                 <div className="relative h-48">
//                   <Image 
//                     src={item.imageUrls?.[0] || "/placeholder.svg"} 
//                     alt={item.title} 
//                     fill 
//                     className="object-cover"
//                     sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
//                       unoptimized={true}
//                   />
//                   <div className="absolute top-3 right-3">
//                     <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${statusColor}`}>
//                       {statusText}
//                     </span>
//                   </div>
//                 </div>
//                 <div className="p-5">
//                   <h3 className="font-semibold text-lg mb-2 line-clamp-2">{item.title}</h3>
//                   <div className="flex items-center text-gray-500 text-sm mb-1">
//                     <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
//                     <span className="truncate">{item.locationLost || "Location not specified"}</span>
//                   </div>
//                   <div className="flex items-center text-gray-500 text-sm">
//                     <Clock className="h-4 w-4 mr-1 flex-shrink-0" />
//                     <span>{formatDate(item.reportedAt)}</span>
//                   </div>
//                 </div>
//               </motion.div>
//             )
//           })}
//         </div>

//         <div className="text-center mt-10">
//           <button className="bg-white hover:bg-gray-50 text-emerald-600 font-medium py-3 px-6 rounded-lg border border-emerald-600 transition-all duration-200 transform hover:scale-105">
//             View All Items
//           </button>
//         </div>
//       </motion.div>
//     </section>
//   )
// }

// function formatDate(date: Date | string) {
//   // Handle case where date might be a string
//   const dateObj = typeof date === 'string' ? new Date(date) : date;
//   const now = new Date();
//   const diffInHours = Math.floor((now.getTime() - dateObj.getTime()) / (1000 * 60 * 60));
  
//   if (diffInHours < 24) {
//     return `${diffInHours} hour${diffInHours !== 1 ? 's' : ''} ago`;
//   } else {
//     const diffInDays = Math.floor(diffInHours / 24);
//     return `${diffInDays} day${diffInDays !== 1 ? 's' : ''} ago`;
//   }
// }