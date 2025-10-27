"use client"

import React, { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation" // perubahan: untuk navigasi setelah login
import { IoCloseOutline, IoLockClosedOutline } from "react-icons/io5"
import { BsEnvelope } from "react-icons/bs"
import { motion, AnimatePresence } from "framer-motion"
import { supabase } from "@/lib/supabaseClient" // perubahan: import supabase client

const formVariants = {
  initial: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: 50, scale: 0.95, transition: { duration: 0.4, ease: "easeOut" } },
}

const overlayVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.5 } },
}

export default function Login() {
  const router = useRouter() // perubahan
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(false)
  const [isExiting, setIsExiting] = useState(false)
  const [errorMessage, setErrorMessage] = useState("") // perubahan

  // perubahan: fungsi login dengan Supabase
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage("")

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setErrorMessage(error.message)
    } else {
      setIsExiting(true)
      setTimeout(() => {
        router.push("/") // redirect ke homepage setelah login
      }, 400)
    }
  }

  const handleRegisterClick = (e: React.MouseEvent) => {
    e.preventDefault()
    setIsExiting(true)
    setTimeout(() => {
      router.push("/register")
    }, 400)
  }

  return (
    <div
      className="min-h-screen flex justify-center items-center p-4 bg-cover bg-center"
      style={{ backgroundImage: "url('/assets/login-regist/login-regist.webp')" }}
    >
      <AnimatePresence mode="wait">
        {!isExiting && (
          <motion.div
            key="loginForm"
            className="relative w-full max-w-md bg-[#060c20]/50 backdrop-blur-xl border-2 border-white/50 rounded-3xl shadow-xl p-10 overflow-hidden"
            variants={formVariants}
            initial="initial"
            exit="exit"
          >
            <Link
              href="/"
              className="absolute top-0 right-0 w-12 h-12 bg-black flex justify-center items-center rounded-bl-3xl z-10"
            >
              <IoCloseOutline className="text-white text-2xl" />
            </Link>

            <h2 className="text-3xl font-semibold text-white text-center mb-8">Login</h2>

            <form onSubmit={handleLoginSubmit}>
              <div className="relative w-full h-[50px] border-b-2 border-white/80 mb-8">
                <span className="absolute right-2 top-1/2 -translate-y-1/2 text-white text-xl">
                  <BsEnvelope />
                </span>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-full bg-transparent border-none outline-none text-base text-white font-semibold px-5 py-0"
                  suppressHydrationWarning
                />
                <label
                  className={`absolute top-1/2 left-1 -translate-y-1/2 text-white font-medium pointer-events-none transition-all duration-500 ${email ? "top-[-5px]" : ""}`}
                >
                  Email
                </label>
              </div>

              <div className="relative w-full h-[50px] border-b-2 border-white/80 mb-8">
                <span className="absolute right-2 top-1/2 -translate-y-1/2 text-white text-xl">
                  <IoLockClosedOutline />
                </span>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-full bg-transparent border-none outline-none text-base text-white font-semibold px-5 py-0"
                  suppressHydrationWarning
                />
                <label
                  className={`absolute top-1/2 left-1 -translate-y-1/2 text-white font-medium pointer-events-none transition-all duration-500 ${password ? "top-[-5px]" : ""}`}
                >
                  Password
                </label>
              </div>

              <div className="flex items-center justify-between mb-6 -mt-4">
                <label className="text-sm text-white font-medium flex items-center">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="mr-2 accent-white"
                  />
                  Remember me
                </label>
                <Link href="/forgot-password" className="text-sm text-white hover:underline">
                  Forgot Password?
                </Link>
              </div>

              {/* perubahan: tampilkan error jika gagal login */}
              {errorMessage && (
                <div className="mb-4 text-red-400 text-sm font-medium text-center">{errorMessage}</div>
              )}

              <button
                type="submit"
                className="w-full h-12 bg-[#93c5fd] text-[#060c20] border-none outline-none rounded-lg cursor-pointer text-base font-medium transition-all hover:bg-[#93c5fd]/90"
              >
                Login
              </button>

              <div className="text-center text-white text-sm font-medium mt-6">
                <p className="flex flex-col sm:flex-row items-center justify-center gap-2">
                  Don't have an account?
                  <Link
                    href="/register"
                    onClick={handleRegisterClick}
                    className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg transition-all"
                  >
                    Register
                  </Link>
                </p>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
