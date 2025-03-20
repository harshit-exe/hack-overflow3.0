"use client"

import { useState, useRef } from "react"
import { motion } from "framer-motion"

export default function MagneticButton({
  children,
  className = "",
  variant = "primary",
  size = "md",
  strength = 30,
  ...props
}) {
  const buttonRef = useRef(null)
  const [position, setPosition] = useState({ x: 0, y: 0 })

  const baseClasses = "rounded-full font-medium transition-all duration-300 inline-flex items-center justify-center"

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

  const handleMouseMove = (e) => {
    if (!buttonRef.current) return

    const { clientX, clientY } = e
    const { left, top, width, height } = buttonRef.current.getBoundingClientRect()

    const x = (clientX - (left + width / 2)) / strength
    const y = (clientY - (top + height / 2)) / strength

    setPosition({ x, y })
  }

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 })
  }

  return (
    <motion.button
      ref={buttonRef}
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      {...props}
    >
      {children}
    </motion.button>
  )
}

