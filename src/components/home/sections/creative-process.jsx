"use client"

import { useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import Badge from "../ui-components/badge"
import GlowButton from "../ui-components/glow-button"
import TextReveal from "../ui-components/text-reveal"
import ParallaxLayer from "../ui-components/parallax-layer"

export default function CreativeProcess() {
  const sectionRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  })

  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.8], [0, 1, 0.5])
  const y = useTransform(scrollYProgress, [0, 0.3, 0.8], [100, 0, -50])

  return (
    <section ref={sectionRef} className="py-20 md:py-32 relative overflow-hidden">
      {/* Background elements */}
      <ParallaxLayer className="absolute inset-0 z-0" speed={0.3} direction="down">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#8CE563]/5 rounded-full filter blur-3xl"></div>
      </ParallaxLayer>

      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gray-900 via-black to-black z-0"></div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div className="max-w-3xl mx-auto" style={{ opacity, y }}>
          <Badge className="mb-6">INTRODUCING MARG.ai</Badge>

          <TextReveal className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6" delay={0.1}>
          Your Future, Your Success – Marg.AI Helps You Achieve It
          </TextReveal>

          <motion.p
            className="text-gray-500 mb-4 text-lg md:text-xl"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            viewport={{ once: true }}
          >
            Building a career can be overwhelming. MARG.ai simplifies your journey by providing career counseling, skill assessments, and expert mentorship, so you can make informed decisions with confidence.
          </motion.p>

          <motion.p
            className="text-[#8CE563] font-semibold text-lg md:text-xl mb-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            viewport={{ once: true }}
          >
            That's why we Marg.ai
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            viewport={{ once: true }}
          >
            <GlowButton variant="dark">Learn more</GlowButton>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

