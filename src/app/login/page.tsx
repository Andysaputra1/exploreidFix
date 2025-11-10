"use client"

import React, { useState, useEffect } from "react" // Tambahkan useEffect
import Link from "next/link"
import { useRouter } from "next/navigation" 
import Image from "next/image" // Import Image
import { IoLockClosedOutline } from "react-icons/io5"
import { BsEnvelope } from "react-icons/bs" 
import { motion, AnimatePresence } from "framer-motion"
import Navbar from "@/components/Navbar/Navbar"
import Footer from "@/components/Footer/Footer"

// ----- 1. LOGIKA BACKGROUND ANIMASI (DARI HOMEPAGE) -----
const heroImages = [
  { src: "/assets/home/hero-1.webp", alt: "Login Background 1" },
  { src: "/assets/home/hero-2.webp", alt: "Login Background 2" },
  { src: "/assets/home/hero-3.webp", alt: "Login Background 3" },
];

const imageContainerVariants = {
  enter: { opacity: 0, scale: 1.05 },
  center: { opacity: 1, scale: 1, transition: { duration: 2.0, ease: "easeInOut" } },
  exit: { opacity: 0, scale: 1.05, transition: { duration: 2.0, ease: "easeInOut" } },
};
// -----------------------------------------------------

const formVariants = {
  initial: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: 50, scale: 0.95, transition: { duration: 0.4, ease: "easeOut" } },
}

export default function Login() {
  const router = useRouter()
  const [email, setEmail] = useState("") 
  const [password, setPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(false)
  const [isExiting, setIsExiting] = useState(false)
  const [errorMessage, setErrorMessage] = useState("") 
  const [searchQuery, setSearchQuery] = useState("")

  // ----- 2. STATE DAN EFEK UNTUK BACKGROUND -----
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % heroImages.length);
    }, 7000); // Ganti gambar setiap 7 detik
    return () => clearInterval(timer);
  }, []);
  // ---------------------------------------------

  // ... (Handler login Anda tetap sama) ...
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage("")
    if (email === 'dummy123' && password === '123456') {
      localStorage.setItem('dummyUser', JSON.stringify({ username: 'dummy123' }));
      setIsExiting(true)
      setTimeout(() => {
        router.push("/") 
      }, 400)
    } else {
      setErrorMessage("Invalid username or password")
    }
  }

  // ... (Handler register click Anda tetap sama) ...
  const handleRegisterClick = (e: React.MouseEvent) => {
    e.preventDefault()
    setIsExiting(true)
    setTimeout(() => {
      router.push("/register")
    }, 400)
  }

  return (
    <>
      <Navbar 
        searchQuery={searchQuery} 
        onSearchChange={setSearchQuery} 
      />

      {/* ----- 3. UBAH DIV PEMBUNGKUS UTAMA ----- */}
      <div
        className="relative min-h-screen flex justify-center items-center pt-32 pb-12 px-4 bg-[#060c20] overflow-hidden" 
      >
        {/* ---- Mulai Background Animasi ---- */}
        <AnimatePresence mode='wait'>
          <motion.div
            key={heroImages[currentImageIndex].src}
            className="absolute inset-0 w-full h-full"
            variants={imageContainerVariants}
            initial="enter"
            animate="center"
            exit="exit"
          >
            <Image
              src={heroImages[currentImageIndex].src}
              alt={heroImages[currentImageIndex].alt}
              fill
              className="object-cover"
              quality={90}
              priority={currentImageIndex === 0}
            />
          </motion.div>
        </AnimatePresence>
        {/* Overlay gelap agar teks terbaca */}
        <div className="absolute inset-0 bg-black/60 z-10" /> 
        {/* ---- Selesai Background Animasi ---- */}

        
        {/* 4. PINDAHKAN KONTEN FORM KE SINI (DENGAN z-20) */}
        <AnimatePresence mode="wait">
          {!isExiting && (
            <motion.div
              key="loginForm"
              // Pastikan ada 'relative z-20' agar di atas background
              className="relative z-20 w-full max-w-md bg-[#060c20]/50 backdrop-blur-xl border-2 border-white/50 rounded-3xl shadow-xl p-10 overflow-hidden" 
              variants={formVariants}
              initial="initial"
              exit="exit"
            >
              
              <h2 className="text-3xl font-semibold text-white text-center mb-6">Login</h2>

              {/* ... (Kotak info dummy Anda tetap sama) ... */}
              <div className="bg-white/10 border border-blue-300/50 rounded-lg p-4 mb-6 text-sm">
                <p className="text-white font-semibold mb-2 text-center">Dummy Account Info</p>
                <p className="text-blue-200">
                  <strong>Username:</strong> dummy123
                </p>
                <p className="text-blue-200">
                  <strong>Password:</strong> 123456
                </p>
              </div>

              {/* ... (Semua form Anda tetap sama) ... */}
              <form onSubmit={handleLoginSubmit}>
                <div className="relative w-full h-[50px] border-b-2 border-white/80 mb-8">
                  <span className="absolute right-2 top-1/2 -translate-y-1/2 text-white text-xl">
                    <BsEnvelope />
                  </span>
                  <input
                    type="text" 
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full h-full bg-transparent border-none outline-none text-base text-white font-semibold px-5 py-0"
                    suppressHydrationWarning
                  />
                  <label
                    className={`absolute top-1/2 left-1 -translate-y-1/2 text-white font-medium pointer-events-none transition-all duration-500 ${email ? "top-[-5px]" : ""}`}
                  >
                    Username
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
                  <Link href="#" className="text-sm text-white hover:underline">
                    Forgot Password?
                  </Link>
                </div>

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
      {/* ----------------------------------- */}

      <Footer />
    </>
  )
}