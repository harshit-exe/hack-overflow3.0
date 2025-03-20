"use client"

import { motion } from "framer-motion"
import Logo from "../ui-components/logo"

export default function Footer() {
  return (
    <footer className="py-8 border-t border-gray-800 relative z-10">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <Logo className="mb-4 md:mb-0" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
            className="flex space-x-6 text-sm text-gray-400"
          >
            <a href="#" className="hover:text-white transition-colors duration-300 hover:underline">
              Contact
            </a>
            <a href="#" className="hover:text-white transition-colors duration-300 hover:underline">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-white transition-colors duration-300 hover:underline">
              Terms & Conditions
            </a>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          viewport={{ once: true }}
          className="mt-6 text-center text-xs text-gray-500"
        >
          © {new Date().getFullYear()} Marg.ai All rights reserved.
        </motion.div>
      </div>
    </footer>
  )
}

