"use client"

import { useEffect, useState } from "react"
import { motion, useScroll, useTransform } from "framer-motion"

export default function ParallaxLayer({
  children,
  className = "",
  speed = 0.5,
  direction = "up", // "up", "down", "left", "right"
  ...props
}) {
  const [windowHeight, setWindowHeight] = useState(0)
  const { scrollY } = useScroll()

  useEffect(() => {
    setWindowHeight(window.innerHeight)

    const handleResize = () => {
      setWindowHeight(window.innerHeight)
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  // Calculate transform based on direction
  const transformX = useTransform(scrollY, [0, windowHeight], [0, -windowHeight * speed])
  const transformY = useTransform(scrollY, [0, windowHeight], [0, -windowHeight * speed])

  let transform

  if (direction === "up") {
    transform = transformY
  } else if (direction === "down") {
    transform = useTransform(scrollY, [0, windowHeight], [0, windowHeight * speed])
  } else if (direction === "left") {
    transform = transformX
  } else if (direction === "right") {
    transform = useTransform(scrollY, [0, windowHeight], [0, windowHeight * speed])
  }

  return (
    <motion.div
      className={`${className}`}
      style={{
        [direction === "up" || direction === "down" ? "y" : "x"]: transform,
      }}
      {...props}
    >
      {children}
    </motion.div>
  )
}

