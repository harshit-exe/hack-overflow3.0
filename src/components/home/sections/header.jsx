"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; // Import useRouter
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Logo from "../ui-components/logo";
import GlowButton from "../ui-components/glow-button";

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter(); // Initialize useRouter

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { name: "Home", href: "#" },
    { name: "Features", href: "#features" },
    { name: "Integrations", href: "#integrations" },
    { name: "FAQs", href: "#faqs" },
  ]

  const handleLogin = () => router.push("/login"); // Navigate to Login Page
  const handleSignUp = () => router.push("/signup"); // Navigate to Signup Page

  return (
    <motion.header
      className={`fixed top-0 left-0 right-0 z-50 py-5 transition-all duration-500 ${
        isScrolled
          ? "bg-black/10 backdrop-blur-md border-b border-gray-800 shadow-lg"
          : "bg-transparent"
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto px-6 flex items-center justify-between">
        <Logo />

        <nav className="hidden pl-20 md:flex items-center space-x-8">
          {navItems.map((item, index) => (
            <motion.a
              key={item.name}
              href={item.href}
              className="text-sm text-gray-300 hover:text-white transition-colors duration-300 relative group"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 * index }}
            >
              {item.name}
              <motion.span
                className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#8CE563] group-hover:w-full transition-all duration-300"
                layoutId={`underline-${item.name}`}
              />
            </motion.a>
          ))}
        </nav>

        <div className="hidden md:flex items-center space-x-6">
          <GlowButton
            variant="secondary"
            size="lg"
            className="px-6 py-3 text-lg"
            onClick={handleLogin} // Trigger Login Page
          >
            Log in
          </GlowButton>

          <GlowButton
            variant="primary"
            size="lg"
            className="px-6 py-3 text-lg"
            onClick={handleSignUp} // Trigger Signup Page
          >
            Sign up
          </GlowButton>
        </div>

        <motion.button
          className="md:hidden text-gray-300 hover:text-white"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
        </motion.button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            className="md:hidden absolute top-full left-0 right-0 bg-black/95 backdrop-blur-md border-b border-gray-800"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="container mx-auto px-6 py-5 flex flex-col space-y-5">
              <GlowButton variant="secondary" size="md" className="w-full" onClick={handleLogin}>
                Log in
              </GlowButton>
              <GlowButton variant="primary" size="md" className="w-full" onClick={handleSignUp}>
                Sign up
              </GlowButton>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
