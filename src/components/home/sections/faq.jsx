"use client"

import { useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import Badge from "../ui-components/badge"
import FaqItem from "../ui-components/faq-item"
import TextReveal from "../ui-components/text-reveal"
import ParallaxLayer from "../ui-components/parallax-layer"

export default function Faq() {
  const sectionRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  })

  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8], [0, 1, 0.5])
  const y = useTransform(scrollYProgress, [0, 0.2, 0.8], [100, 0, -50])

  const faqs = [
    {
      question: "What is Marg.ai?",
      answer:
        "Marg.ai helps students and professionals choose the right career with expert guidance, skill assessments, and mentorship.",
    },
    {
      question: "Who can use Marg.ai?",
      answer:
        "Anyone looking for career clarity—students, job seekers, or working professionals.",
    },
    {
      question: "Is Marg.ai free to use?",
      answer:
        "Basic features are free. Advanced mentorship may have premium plans.",
    },
    {
      question: "How does Marg.ai help me?",
      answer:
        "Through career counseling, skill-building tools, and personalized roadmaps.",
    },
    {
      question: "Do I need a career goal to start?",
      answer:
        "No, Marg.ai helps you explore and discover the right career path.",
    },
  ]

  return (
    <section id="faqs" ref={sectionRef} className="py-20 md:py-32 relative overflow-hidden">
      {/* Background elements */}
      <ParallaxLayer className="absolute inset-0 z-0" speed={0.2} direction="left">
        <div className="absolute bottom-1/4 left-1/4 w-64 h-64 bg-purple-500/10 rounded-full filter blur-3xl"></div>
      </ParallaxLayer>

      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gray-900 via-black to-black z-0"></div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div style={{ opacity, y }} className="text-center mb-16">
          <Badge className="mb-6">HELP</Badge>

          <TextReveal className="text-3xl md:text-4xl lg:text-5xl font-bold mb-12" delay={0.1}>
            Questions? We've got <span className="text-[#8CE563]">answers</span>
          </TextReveal>
        </motion.div>

        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true, margin: "-100px" }}
            >
              <FaqItem question={faq.question} answer={faq.answer} isOpen={index === 0} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

