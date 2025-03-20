"use client"

import { useEffect } from "react"
import Header from "../components/sections/header"
import Hero from "../components/sections/hero"
import CreativeProcess from "../components/sections/creative-process"
import Features from "../components/sections/features"
import Integrations from "../components/sections/integrations"
import Faq from "../components/sections/faq"
import Cta from "../components/sections/cta"
import Footer from "../components/sections/footer"
import CursorEffect from "../components/ui-components/cursor-effect"
import ParticleBackground from "../components/ui-components/particle-background"
import AnimatedGradient from "../components/ui-components/animated-gradient"

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

