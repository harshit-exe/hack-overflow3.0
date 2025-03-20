"use client"

import { useEffect } from "react"
import Header from "@/components/home/sections/header"
import Hero from "@/components/home/sections/hero"
import CreativeProcess from "@/components/home/sections/creative-process"
import Features from "@/components/home/sections/features"
import Integrations from "@/components/home/sections/integrations"
import Faq from "@/components/home/sections/faq"
import Cta from "@/components/home/sections/cta"
import Footer from "@/components/home/sections/footer"
import CursorEffect from "@/components/home/ui-components/cursor-effect"
import ParticleBackground from "@/components/home/ui-components/particle-background"
import AnimatedGradient from "@/components/home/ui-components/animated-gradient"

export default function Home() {
  // Smooth scroll implementation
  useEffect(() => {
    const handleAnchorClick = (e) => {
      const target = e.target
      if (target.tagName === "A" && target.getAttribute("href")?.startsWith("#")) {
        e.preventDefault()
        const id = target.getAttribute("href").slice(1)
        const element = document.getElementById(id)
        if (element) {
          window.scrollTo({
            top: element.offsetTop - 80, // Adjust for header height
            behavior: "smooth",
          })
        }
      }
    }

    document.addEventListener("click", handleAnchorClick)
    return () => document.removeEventListener("click", handleAnchorClick)
  }, [])

  return (
    <main className="bg-black text-white relative">
      {/* Background effects */}
      <ParticleBackground />
      <AnimatedGradient />

      {/* Custom cursor */}
      <CursorEffect />

      {/* Page content */}
      <Header />
      <Hero />
      <CreativeProcess />
      <Features />
      <Integrations />
      <Faq />
      <Cta />
      <Footer />
    </main>
  )
}

