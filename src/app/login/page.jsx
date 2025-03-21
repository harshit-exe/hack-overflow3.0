"use client"

import { useState } from "react"
import { toast } from "react-toastify"
import { useAuth } from "@/hooks/useAuth"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { GoogleLogin } from "@react-oauth/google"
import { motion } from "framer-motion"
import { AtSign, KeyRound, ArrowRight } from "lucide-react"

const Login = () => {
  const { login, googleLogin } = useAuth()
  const router = useRouter()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = async () => {
    if (!email || !password) {
      toast.error("Please fill all fields")
      return
    }

    setIsLoading(true)
    try {
      const response = await login(email, password)
      if (response.success) {
        toast.success("Login successful!")
        router.push("/dashboard")
      } else {
        toast.error(response.message)
      }
    } finally {
      setIsLoading(false)
    }
  }

  // Original handleGoogleLogin function from your provided code
  const handleGoogleLogin = async (creds) => {
    const response = await googleLogin(creds.credential)
    if (response.success) {
      toast.success("Google Login successful!")
      router.push("/")
    } else {
      toast.error(response.message)
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
            <h1 className="text-3xl font-bold text-white mb-2">Welcome back</h1>
            <p className="text-zinc-400">Sign in to your account</p>
          </motion.div>

          <div className="space-y-5">
            <motion.div
              initial={{ x: -10, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
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
              transition={{ delay: 0.4 }}
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
              transition={{ delay: 0.5 }}
              whileHover={{ scale: 1.02, backgroundColor: "#4f46e5" }}
              whileTap={{ scale: 0.98 }}
              disabled={isLoading}
              onClick={handleLogin}
              className="relative h-12 w-full rounded-lg font-medium text-white bg-indigo-600 hover:bg-indigo-700 transition-all duration-200 flex items-center justify-center group overflow-hidden"
            >
              <span className="absolute right-full group-hover:right-4 transition-all duration-300">
                <ArrowRight size={18} />
              </span>
              <span className="group-hover:translate-x-2 transition-transform duration-200">
                {isLoading ? "Signing in..." : "Sign in"}
              </span>
            </motion.button>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="relative flex items-center py-2"
            >
              <div className="flex-grow border-t border-zinc-700"></div>
              <span className="flex-shrink mx-3 text-zinc-500 text-sm">or continue with</span>
              <div className="flex-grow border-t border-zinc-700"></div>
            </motion.div>

            {/* Google Login button styled with the original functionality */}
            <motion.div
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="flex justify-center"
            >
              {/* <div className="google-login-container flex items-center justify-center w-full">
                <div className="google-login-wrapper rounded-lg overflow-hidden transform hover:scale-105 transition-transform duration-200"> */}
                  <GoogleLogin
                    ux_mode="popup"
                    onSuccess={handleGoogleLogin}
                    onError={() => {
                      toast.error(`Google auth Error`)
                    }}
                  />
                {/* </div>
               </div> */}
            </motion.div> 

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="text-center mt-6"
            >
              <p className="text-zinc-400 text-sm">
                Don't have an account?{" "}
                <Link
                  href="/signup"
                  className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors duration-200"
                >
                  Sign up
                </Link>
              </p>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default Login
