"use client"

import { useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import HoverCard from "../ui-components/hover-card"
import FeatureItem from "../ui-components/feature-item"
import TextReveal from "../ui-components/text-reveal"
import { Code, Zap, Layout } from "lucide-react"
import ParallaxLayer from "../ui-components/parallax-layer"

export default function Features() {
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
    <section id="features" ref={sectionRef} className="py-20 md:py-32 relative overflow-hidden">
      {/* Background elements */}
      <ParallaxLayer className="absolute inset-0 z-0" speed={0.2}>
        <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-[#8CE563]/10 rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-1/3 left-1/4 w-64 h-64 bg-purple-500/10 rounded-full filter blur-3xl"></div>
      </ParallaxLayer>

      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gray-900 via-black to-black z-0"></div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div style={{ opacity, y }}>
          <TextReveal className="text-3xl md:text-4xl lg:text-5xl font-bold mb-16 text-center" delay={0.1}>
            Where power meets <span className="text-[#8CE563]">simplicity</span>
          </TextReveal>

          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            className="grid md:grid-cols-3 gap-6 mb-16"
          >
            <motion.div variants={item}>
              <HoverCard className="bg-gray-900/80 backdrop-blur-sm rounded-xl p-6 border border-gray-800 h-full">
                <div className="mb-4">
                  <div className="flex -space-x-2">
                    <div className="w-8 h-8 rounded-full bg-blue-500 border-2 border-gray-900"></div>
                    <div className="w-8 h-8 rounded-full bg-green-500 border-2 border-gray-900"></div>
                    <div className="w-8 h-8 rounded-full bg-yellow-500 border-2 border-gray-900"></div>
                  </div>
                </div>
                <h3 className="font-bold mb-2">AI 3D Mentor</h3>
                <p className="text-gray-400 text-sm">
                Your personal virtual career guide

                </p>
              </HoverCard>
            </motion.div>

            <motion.div variants={item}>
              <HoverCard className="bg-gray-900/80 backdrop-blur-sm rounded-xl p-6 border border-gray-800 h-full">
                <div className="mb-4">
                  <div className="text-purple-400 font-semibold">
                    We've achieved <span className="text-purple-300">incredible</span> growth this year
                  </div>
                </div>
                <h3 className="font-bold mb-2">VR Office</h3>
                <p className="text-gray-400 text-sm">
                Try jobs in a virtual world

                </p>
              </HoverCard>
            </motion.div>

            <motion.div variants={item}>
              <HoverCard className="bg-gray-900/80 backdrop-blur-sm rounded-xl p-6 border border-gray-800 h-full">
                <div className="flex gap-2 mb-4">
                  <div className="w-8 h-8 rounded-md bg-gray-800 flex items-center justify-center">⌘</div>
                  <div className="w-8 h-8 rounded-md bg-gray-800 flex items-center justify-center">⇧</div>
                  <div className="w-8 h-8 rounded-md bg-gray-800 flex items-center justify-center">P</div>
                </div>
                <h3 className="font-bold mb-2">AI Astrotalk</h3>
                <p className="text-gray-400 text-sm">
                  Powerful commands to help you create designs more quickly. Access any tool or feature with just a few
                  keystrokes.
                </p>
              </HoverCard>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-5 gap-6"
          >
            <FeatureItem icon={<Zap className="w-2 h-2 text-black" />} text="Roadmap-Generator" />
            <FeatureItem icon={<Code className="w-2 h-2 text-black" />} text="Resume-Builder" />
            <FeatureItem icon={<Layout className="w-2 h-2 text-black" />} text="Trending-Jobs" />
            <FeatureItem icon={<Zap className="w-2 h-2 text-black" />} text="Event-Updates" />
            <FeatureItem icon={<Layout className="w-2 h-2 text-black" />} text="Switch-domain" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

