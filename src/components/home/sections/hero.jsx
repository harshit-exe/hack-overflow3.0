"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Star } from "lucide-react";
import Badge from "../ui-components/badge";
import GlowButton from "../ui-components/glow-button";
import TextReveal from "../ui-components/text-reveal";
import ParallaxLayer from "../ui-components/parallax-layer";
import { useRouter } from "next/navigation";

export default function Hero() {
  const router = useRouter();
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const y = useTransform(scrollYProgress, [0, 0.5], [0, 100]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.9]);

  return (
    <section
      ref={heroRef}
      className="relative min-h-screen flex items-center pt-20 pb-16 overflow-hidden"
    >
      {/* Background elements */}
      <ParallaxLayer className="absolute inset-0 z-0" speed={0.2}>
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-[#8CE563]/10 rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-purple-500/10 rounded-full filter blur-3xl"></div>
      </ParallaxLayer>

      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gray-900 via-black to-black z-0"></div>

      <motion.div
        className="container mx-auto px-4 relative z-10"
        style={{ opacity, y, scale }}
      >
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Badge variant="purple" className="mb-6">
              Cipher Squad Present
            </Badge>
          </motion.div>

          {/* <TextReveal
            className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-6 leading-tight"
            delay={0.2}
          > */}
          <div
            className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-6 leading-tight"
            delay={0.2}
          >
            <span className="text-[#57FF31]">Marg.ai</span> - Smart Career
            Choice, उज्ज्वल भविष्य!
          </div>
          {/* </TextReveal> */}

          <motion.p
            className="text-gray-400 max-w-xl mx-auto mb-8 text-sm md:text-base lg:text-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            Confused about your career? Marg.AI guides you with expert advice,
            skill-building, and personalized mentorship — plan your future with
            confidence.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            onClick={()=>router.push('/career-gen')}
          >
           
            <GlowButton variant="primary" size="lg" >
              Get started
            </GlowButton>
          </motion.div>

          <motion.div
            className="text-sm text-gray-500 mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 1 }}
          >
            Trusted by thousands of students and professionals
          </motion.div>

          <motion.div
            className="flex flex-wrap justify-center items-center gap-8 mb-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 1.2 }}
          >
            <motion.div
              className="opacity-70 hover:opacity-100 transition-opacity duration-300"
              whileHover={{ scale: 1.05, y: -5 }}
            >
              <div className="flex items-center">
                <Star className="w-4 h-4 mr-1 text-[#57FF31]" />
                <span className="font-medium">Career Guidance</span>
              </div>
            </motion.div>
            <motion.div
              className="opacity-70 hover:opacity-100 transition-opacity duration-300"
              whileHover={{ scale: 1.05, y: -5 }}
            >
              <div className="flex items-center">
                <span className="font-medium">Boost Skills</span>
              </div>
            </motion.div>
            <motion.div
              className="opacity-70 hover:opacity-100 transition-opacity duration-300"
              whileHover={{ scale: 1.05, y: -5 }}
            >
              <div className="flex items-center">
                <span className="font-medium">Acheive Goals</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.5 }}
      >
        <div className="w-6 h-10 rounded-full border-2 border-gray-500 flex items-start justify-center p-1">
          <div className="w-1 h-2 bg-gray-500 rounded-full"></div>
        </div>
      </motion.div>
    </section>
  );
}
