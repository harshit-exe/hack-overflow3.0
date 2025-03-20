"use client"

import { useState, useRef } from "react"
import { motion } from "framer-motion"

export default function HoverCard({ children, className = "", glareEffect = true, rotateEffect = true, ...props }) {
  const [isHovered, setIsHovered] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const cardRef = useRef(null)

  const handleMouseMove = (e) => {
    if (!cardRef.current || !rotateEffect) return

    const { clientX, clientY } = e
    const { left, top, width, height } = cardRef.current.getBoundingClientRect()

    const x = (clientX - (left + width / 2)) / 25
    const y = (clientY - (top + height / 2)) / 25

    setMousePosition({ x, y })

    if (glareEffect) {
      // Calculate glare position
      const percentX = (clientX - left) / width
      const percentY = (clientY - top) / height

      const glareX = percentX * 100
      const glareY = percentY * 100

      cardRef.current.style.setProperty("--glare-x", `${glareX}%`)
      cardRef.current.style.setProperty("--glare-y", `${glareY}%`)
    }
  }

  const handleMouseEnter = () => {
    setIsHovered(true)
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
    setMousePosition({ x: 0, y: 0 })
  }

  return (
    <motion.div
      ref={cardRef}
      className={`relative overflow-hidden ${glareEffect ? "glare-effect" : ""} ${className}`}
      animate={{
        rotateX: rotateEffect ? -mousePosition.y : 0,
        rotateY: rotateEffect ? mousePosition.x : 0,
      }}
      transition={{ type: "spring", stiffness: 300, damping: 30, mass: 0.5 }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        transformStyle: "preserve-3d",
      }}
      {...props}
    >
      {children}

      {glareEffect && (
        <motion.div
          className="absolute inset-0 pointer-events-none glare"
          animate={{
            opacity: isHovered ? 0.1 : 0,
          }}
          transition={{ duration: 0.3 }}
        />
      )}
    </motion.div>
  )
}

