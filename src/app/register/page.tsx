"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { IoCloseOutline, IoLockClosedOutline } from "react-icons/io5"
import { BsEnvelope, BsPerson } from "react-icons/bs"
import { motion, AnimatePresence } from "framer-motion"

// perubahan: import supabase client
import { supabase } from "@/lib/supabaseClient" // pastikan path ini benar sesuai struktur foldermu

const formVariants = {
  initial: { opacity: 0, y: 50, scale: 0.95 },
  animate: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.4, ease: "easeOut" } },
  exit: { opacity: 0, y: 50, scale: 0.95, transition: { duration: 0.4, ease: "easeOut" } },
}

export default function Register() {
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(false)
  const [isExiting, setIsExiting] = useState(false)

  // perubahan: ubah handleSubmit untuk pakai Supabase
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const { data, error } = await supabase.auth.signUp({
      email,
      password
    })

    if (error) {
      alert("Error registering user: " + error.message)
      return
    }

    const user = data.user
    if (!user) {
      alert("User not returned from Supabase.")
      return
    }

    // perubahan: tambahkan user ke tabel profiles
    const { error: profileError } = await supabase.from("profiles").insert([
      {
        id: user.id,
        username,
        email
      }
    ])

    if (profileError) {
      alert("Registered, but failed to save profile: " + profileError.message)
    } else {
      alert("Registration successful! Please check your email to verify your account.")
    }

    window.location.href = "/"
  }

  const handleLinkClick = (path: string, e: React.MouseEvent) => {
    e.preventDefault()
    setIsExiting(true)
    setTimeout(() => {
      window.location.href = path
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
            key="registerForm"
            className="relative w-full max-w-md bg-[#060c20]/50 backdrop-blur-xl border-2 border-white/50 rounded-3xl shadow-xl p-10 overflow-hidden"
            variants={formVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            <Link
              href="/"
              onClick={(e) => handleLinkClick("/", e)}
              className="absolute top-0 right-0 w-12 h-12 bg-black flex justify-center items-center rounded-bl-3xl z-10"
            >
              <IoCloseOutline className="text-white text-2xl" />
            </Link>

            <h2 className="text-3xl font-semibold text-white text-center mb-8">Registration</h2>

            <form onSubmit={handleSubmit}>
              <div className="relative w-full h-[50px] border-b-2 border-white/80 mb-8">
                <span className="absolute right-2 top-1/2 -translate-y-1/2 text-white text-xl">
                  <BsPerson />
                </span>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full h-full bg-transparent border-none outline-none text-base text-white font-semibold px-5 py-0"
                  suppressHydrationWarning
                />
                <label
                  className={`absolute top-1/2 left-1 -translate-y-1/2 text-white font-medium pointer-events-none transition-all duration-500 ${username ? "top-[-5px]" : ""}`}
                >
                  Username
                </label>
              </div>

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

              <div className="flex items-center mb-6 -mt-4">
                <label className="text-sm text-white font-medium flex items-center">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="mr-2 accent-white"
                    suppressHydrationWarning
                  />
                  Remember me
                </label>
              </div>

              <button
                type="submit"
                className="w-full h-12 bg-[#93c5fd] text-[#060c20] border-none outline-none rounded-lg cursor-pointer text-base font-medium transition-all hover:bg-[#93c5fd]/90"
                suppressHydrationWarning
              >
                Register
              </button>

              <div className="text-center text-white text-sm font-medium mt-6">
                <p className="flex flex-col sm:flex-row items-center justify-center gap-2">
                  Already have an account?
                  <Link
                    href="/login"
                    onClick={(e) => handleLinkClick("/login", e)}
                    className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg transition-all"
                  >
                    Login
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
