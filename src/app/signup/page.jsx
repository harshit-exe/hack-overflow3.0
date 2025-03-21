"use client"

import { useState } from "react"
import { toast } from "react-toastify"
import { useAuth } from "@/hooks/useAuth"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import { User, AtSign, KeyRound, ArrowRight } from "lucide-react"

const Signup = () => {
  const { signup } = useAuth()
  const router = useRouter()

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSignup = async () => {
    if (!name || !email || !password) {
      toast.error("Please fill all fields")
      return
    }

    setIsLoading(true)
    try {
      const response = await signup(name, email, password)
      if (response.success) {
        toast.success("Signup successful!")
        router.push("/login")
      } else {
        toast.error(response.message)
      }
    } catch (error) {
      toast.error("An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-zinc-900 to-black flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="bg-zinc-900/70 backdrop-blur-sm rounded-2xl border border-zinc-800 shadow-xl p-8">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-center mb-8"
          >
            <h1 className="text-3xl font-bold text-white mb-2">Create account</h1>
            <p className="text-zinc-400">Join us today</p>
          </motion.div>

          <div className="space-y-5">
            <motion.div
              initial={{ x: -10, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="relative"
            >
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500">
                <User size={18} />
              </div>
              <input
                type="text"
                placeholder="Full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="h-12 w-full pl-10 pr-4 text-white placeholder:text-zinc-500 text-sm font-medium outline-none border border-zinc-700 rounded-lg bg-zinc-800/50 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all duration-200"
              />
            </motion.div>

            <motion.div
              initial={{ x: -10, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="relative"
            >
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500">
                <AtSign size={18} />
              </div>
              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-12 w-full pl-10 pr-4 text-white placeholder:text-zinc-500 text-sm font-medium outline-none border border-zinc-700 rounded-lg bg-zinc-800/50 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all duration-200"
              />
            </motion.div>

            <motion.div
              initial={{ x: -10, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="relative"
            >
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500">
                <KeyRound size={18} />
              </div>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-12 w-full pl-10 pr-4 text-white placeholder:text-zinc-500 text-sm font-medium outline-none border border-zinc-700 rounded-lg bg-zinc-800/50 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all duration-200"
              />
            </motion.div>

            <motion.button
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
              whileHover={{ scale: 1.02, backgroundColor: "#4f46e5" }}
              whileTap={{ scale: 0.98 }}
              disabled={isLoading}
              onClick={handleSignup}
              className="relative h-12 w-full rounded-lg font-medium text-white bg-indigo-600 hover:bg-indigo-700 transition-all duration-200 flex items-center justify-center group overflow-hidden"
            >
              <span className="absolute right-full group-hover:right-4 transition-all duration-300">
                <ArrowRight size={18} />
              </span>
              <span className="group-hover:translate-x-2 transition-transform duration-200">
                {isLoading ? "Creating account..." : "Create account"}
              </span>
            </motion.button>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="text-center mt-6"
            >
              <p className="text-zinc-400 text-sm">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors duration-200"
                >
                  Sign in
                </Link>
              </p>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default Signup

