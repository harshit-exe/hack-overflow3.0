"use client"

import { motion } from "framer-motion"

export default function FeatureItem({ icon, text }) {
  return (
    <motion.div className="flex items-center gap-2" whileHover={{ x: 5 }}>
      <div className="w-4 h-4 rounded-full bg-[#8CE563] flex items-center justify-center">{icon}</div>
      <span className="text-sm">{text}</span>
    </motion.div>
  )
}

