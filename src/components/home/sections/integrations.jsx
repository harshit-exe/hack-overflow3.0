"use client"

import { useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import Badge from "../ui-components/badge"
import HoverCard from "../ui-components/hover-card"
import TextReveal from "../ui-components/text-reveal"
import ParallaxLayer from "../ui-components/parallax-layer"

export default function Integrations() {
  const sectionRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  })

  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8], [0, 1, 0.5])
  const y = useTransform(scrollYProgress, [0, 0.2, 0.8], [100, 0, -50])

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  }

  return (
    <section id="integrations" ref={sectionRef} className="py-20 md:py-32 relative overflow-hidden">
      {/* Background elements */}
      <ParallaxLayer className="absolute inset-0 z-0" speed={0.2} direction="right">
        <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-[#8CE563]/10 rounded-full filter blur-3xl"></div>
      </ParallaxLayer>

      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-gray-900 via-black to-black z-0"></div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div style={{ opacity, y }}>
          <Badge className="mb-6">INTEGRATIONS</Badge>

          <TextReveal className="text-3xl md:text-4xl lg:text-5xl font-bold mb-8" delay={0.1}>
            Plays well with <span className="text-[#8CE563]">others</span>
          </TextReveal>

          <motion.p
            className="text-gray-400 max-w-2xl mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            viewport={{ once: true }}
          >
            Layers seamlessly connects with your favorite tools, making it easy to plug into any workflow and
            collaborate across platforms.
          </motion.p>

          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6"
          >
            <motion.div variants={item}>
              <HoverCard className="bg-gray-900/80 backdrop-blur-sm rounded-xl p-6 border border-gray-800 h-full">
                <div className="w-12 h-12 bg-white rounded-xl mb-4 flex items-center justify-center">
                  <div className="w-6 h-6 bg-purple-500 rounded-sm"></div>
                </div>
                <h3 className="font-bold mb-2">Figma</h3>
                <p className="text-gray-400 text-sm">
                  Figma is a collaborative interface design tool. Import and export designs seamlessly.
                </p>
              </HoverCard>
            </motion.div>

            <motion.div variants={item}>
              <HoverCard className="bg-gray-900/80 backdrop-blur-sm rounded-xl p-6 border border-gray-800 h-full">
                <div className="w-12 h-12 bg-white rounded-xl mb-4 flex items-center justify-center">
                  <div className="w-6 h-6 bg-black rounded-full"></div>
                </div>
                <h3 className="font-bold mb-2">GitHub</h3>
                <p className="text-gray-400 text-sm">
                  GitHub is the leading platform for code collaboration. Sync designs with your repositories.
                </p>
              </HoverCard>
            </motion.div>

            <motion.div variants={item}>
              <HoverCard className="bg-gray-900/80 backdrop-blur-sm rounded-xl p-6 border border-gray-800 h-full">
                <div className="w-12 h-12 bg-white rounded-xl mb-4 flex items-center justify-center">
                  <div className="w-6 h-6 bg-black"></div>
                </div>
                <h3 className="font-bold mb-2">Notion</h3>
                <p className="text-gray-400 text-sm">
                  Notion is an all-in-one workspace for notes, tasks, and wikis. Link designs to your documentation.
                </p>
              </HoverCard>
            </motion.div>

            <motion.div variants={item}>
              <HoverCard className="bg-gray-900/80 backdrop-blur-sm rounded-xl p-6 border border-gray-800 h-full">
                <div className="w-12 h-12 bg-white rounded-xl mb-4 flex items-center justify-center">
                  <div className="w-6 h-6 bg-blue-500"></div>
                </div>
                <h3 className="font-bold mb-2">Framer</h3>
                <p className="text-gray-400 text-sm">
                  Framer is a tool for interactive prototypes and websites. Create advanced animations with ease.
                </p>
              </HoverCard>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

