"use client"

import { useState } from "react"
import { motion } from "framer-motion"

export default function GlowButton({
  children,
  className = "",
  variant = "primary",
  size = "md",
  glowColor = "rgba(140, 229, 99, 0.6)",
  ...props
}) {
  const [isHovered, setIsHovered] = useState(false)

  const baseClasses =
    "rounded-full font-medium transition-all duration-300 inline-flex items-center justify-center relative overflow-hidden"

  const variants = {
    primary: "bg-[#8CE563] text-black hover:bg-[#9df774] active:bg-[#7ad152]",
    secondary: "bg-transparent border border-gray-700 text-white hover:border-gray-500 hover:bg-gray-800",
    outline: "bg-transparent border border-[#8CE563] text-[#8CE563] hover:bg-[#8CE563]/10",
    dark: "bg-gray-800 text-white hover:bg-gray-700",
  }

  const sizes = {
    sm: "text-xs px-3 py-1.5",
    md: "text-sm px-4 py-2",
    lg: "text-base px-6 py-3",
  }

  return (
    <motion.button
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      {...props}
    >
      {children}

      <motion.div
        className="absolute inset-0 rounded-full pointer-events-none"
        animate={{
          boxShadow: isHovered ? `0 0 20px 5px ${glowColor}` : `0 0 0px 0px ${glowColor}`,
        }}
        transition={{ duration: 0.3 }}
      />
    </motion.button>
  )
}

