"use client";

import { useTheme } from "next-themes";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function AnimatedGridBackground() {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const isDark = theme === "dark";

  // Grid configuration
  const gridSize = 20;
  const lineColor = isDark
    ? "rgba(255, 255, 255, 0.05)"
    : "rgba(0, 0, 0, 0.03)";
  const dotColor = isDark ? "rgba(255, 255, 255, 0.15)" : "rgba(0, 0, 0, 0.06)";
  const highlightColor = isDark
    ? "rgba(16, 185, 129, 0.2)"
    : "rgba(16, 185, 129, 0.15)";

  // Create grid lines
  const horizontalLines = Array.from({ length: gridSize + 1 }).map((_, i) => (
    <motion.line
      key={`h-${i}`}
      x1="0"
      y1={`${(i * 100) / gridSize}%`}
      x2="100%"
      y2={`${(i * 100) / gridSize}%`}
      stroke={lineColor}
      strokeWidth="1"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1, delay: i * 0.01 }}
    />
  ));

  const verticalLines = Array.from({ length: gridSize + 1 }).map((_, i) => (
    <motion.line
      key={`v-${i}`}
      x1={`${(i * 100) / gridSize}%`}
      y1="0"
      x2={`${(i * 100) / gridSize}%`}
      y2="100%"
      stroke={lineColor}
      strokeWidth="1"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1, delay: i * 0.01 }}
    />
  ));

  // Create grid dots
  const dots = [];
  for (let i = 0; i <= gridSize; i++) {
    for (let j = 0; j <= gridSize; j++) {
      dots.push(
        <motion.circle
          key={`dot-${i}-${j}`}
          cx={`${(j * 100) / gridSize}%`}
          cy={`${(i * 100) / gridSize}%`}
          r="1.5"
          fill={dotColor}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: (i + j) * 0.005 }}
        />
      );
    }
  }

  // Create highlight areas (random larger circles)
  const highlights = Array.from({ length: 8 }).map((_, i) => {
    const x = Math.floor(Math.random() * gridSize);
    const y = Math.floor(Math.random() * gridSize);
    const size = 2 + Math.random() * 4;

    return (
      <motion.circle
        key={`highlight-${i}`}
        cx={`${(x * 100) / gridSize}%`}
        cy={`${(y * 100) / gridSize}%`}
        r={size}
        fill={highlightColor}
        initial={{ opacity: 0, scale: 0 }}
        animate={{
          opacity: [0, 0.8, 0.4],
          scale: [0, 1.2, 1],
        }}
        transition={{
          duration: 3 + Math.random() * 2,
          delay: i * 0.2,
          repeat: Number.POSITIVE_INFINITY,
          repeatType: "reverse",
        }}
      />
    );
  });

  return (
    <div className="absolute inset-0 overflow-hidden z-0">
      <svg
        width="100%"
        height="100%"
        xmlns="http://www.w3.org/2000/svg"
        className="opacity-70"
      >
        {highlights}
        {horizontalLines}
        {verticalLines}
        {dots}
      </svg>
    </div>
  );
}
