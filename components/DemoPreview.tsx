"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Utensils, Search, GraduationCap } from "lucide-react";
import Image from "next/image";

export default function DemoPreview() {
  const [activeTab, setActiveTab] = useState("canteen");

  const tabs = [
    {
      id: "canteen",
      label: "Canteen Management",
      icon: Utensils,
      color: "text-emerald-600 dark:text-emerald-400",
      content: (
        <div className="relative aspect-video bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center">
            {/* Replace with actual demo screenshot */}
            <div className="text-center p-8">
              <p className="text-gray-500 dark:text-gray-400 size-full">
                <Image
                  src="/Canteen.png"
                  alt="canteen"
                  width={720}
                  height={1280}
                  className="w-full h-auto"
                />
              </p>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "lost",
      label: "Lost & Found",
      icon: Search,
      color: "text-sky-600 dark:text-sky-400",
      content: (
        <div className="relative aspect-video bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center">
            {/* Replace with actual demo screenshot */}
            <div className="text-center p-8">
              <p className="text-gray-500 dark:text-gray-400">
               <Image src={'/lostandfound.png'} alt="lostandfoundflowchart" height={1280} width={720}/>
              </p>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "scholarship",
      label: "Scholarship Finder",
      icon: GraduationCap,
      color: "text-yellow-600 dark:text-yellow-400",
      content: (
        <div className="relative aspect-video bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center">
            {/* Replace with actual demo screenshot */}
            <div className="text-center p-8">
              <p className="text-gray-500 dark:text-gray-400">
              <Image src={'/scholorshipfounder.png'} alt="ScholorShipFounder" height={1280} width={720}/>
              </p>
            </div>
          </div>
        </div>
      ),
    },
  ];

  return (
    <section className="py-20 px-4 bg-gray-50 dark:bg-gray-950">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
            Live Demo Preview
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            See how CampusMate works in action with our interactive demo
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <Tabs
            defaultValue="canteen"
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid grid-cols-3 mb-8">
              {tabs.map((tab) => (
                <TabsTrigger
                  key={tab.id}
                  value={tab.id}
                  className="flex items-center gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800"
                >
                  <tab.icon className={`h-4 w-4 ${tab.color}`} />
                  <span className="hidden sm:inline">{tab.label}</span>
                </TabsTrigger>
              ))}
            </TabsList>

            <div className="relative bg-gradient-to-b from-white to-gray-100 dark:from-gray-800 dark:to-gray-900 p-1 rounded-lg shadow-lg">
              <div className="absolute -top-3 left-0 right-0 flex justify-center">
                <div className="h-1.5 w-16 bg-gray-200 dark:bg-gray-700 rounded-full" />
              </div>

              <AnimatePresence mode="wait">
                {tabs.map((tab) => (
                  <TabsContent key={tab.id} value={tab.id} className="mt-0">
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      {tab.content}
                    </motion.div>
                  </TabsContent>
                ))}
              </AnimatePresence>
            </div>
          </Tabs>
        </div>
      </div>
    </section>
  );
}
