"use client"

import { useEffect, useRef } from "react"
import { motion, useInView, useAnimation } from "framer-motion"

export default function TextReveal({
  children,
  className = "",
  once = true,
  threshold = 0.2,
  delay = 0,
  duration = 0.5,
  ...props
}) {
  const controls = useAnimation()
  const ref = useRef(null)
  const isInView = useInView(ref, { once, threshold })

  useEffect(() => {
    if (isInView) {
      controls.start("visible")
    }
  }, [controls, isInView])

  // Split text into words
  const words = children.split(" ")

  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: delay,
      },
    },
  }

  const child = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: duration,
      },
    },
  }

  return (
    <motion.div ref={ref} className={className} variants={container} initial="hidden" animate={controls} {...props}>
      {words.map((word, i) => (
        <motion.span key={i} className="inline-block mr-1" variants={child}>
          {word}
        </motion.span>
      ))}
    </motion.div>
  )
}

