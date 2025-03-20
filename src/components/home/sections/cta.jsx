"use client"

import { useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import GlowButton from "../ui-components/glow-button"
import TextReveal from "../ui-components/text-reveal"
import ParallaxLayer from "../ui-components/parallax-layer"

export default function Cta() {
  const sectionRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  })

  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.8], [0, 1, 0.5])
  const scale = useTransform(scrollYProgress, [0, 0.3, 0.8], [0.9, 1, 0.95])

  return (
    <section ref={sectionRef} className="py-20 md:py-32 relative overflow-hidden">
      {/* Background elements */}
      <ParallaxLayer className="absolute inset-0 z-0" speed={0.3}>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#8CE563]/10 rounded-full filter blur-3xl"></div>
      </ParallaxLayer>

      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gray-900 via-black to-black z-0"></div>

      <div className="container mx-auto px-4 relative z-10 text-center">
        <motion.div style={{ opacity, scale }} className="max-w-2xl mx-auto">
          <motion.div
            className="flex justify-center items-center mb-8"
            animate={{ rotate: [0, 5, 0, -5, 0] }}
            transition={{ duration: 5, repeat: Number.POSITIVE_INFINITY }}
          >
            <motion.div
              className="w-6 h-6 text-[#8CE563]"
              animate={{ rotate: 360 }}
              transition={{ duration: 10, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
            >
              ★
            </motion.div>
            <TextReveal className="mx-4 text-2xl md:text-4xl lg:text-5xl font-bold" delay={0.1}>
              Try it for free
            </TextReveal>
            <motion.div
              className="w-6 h-6 text-[#8CE563]"
              animate={{ rotate: 360 }}
              transition={{ duration: 10, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
            >
              ★
            </motion.div>
          </motion.div>

          <motion.p
            className="text-gray-400 mb-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            viewport={{ once: true }}
          >
            Start your 14-day free trial today. No credit card required.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <GlowButton variant="primary" size="lg" glowColor="rgba(140, 229, 99, 0.8)">
              Get started
            </GlowButton>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

