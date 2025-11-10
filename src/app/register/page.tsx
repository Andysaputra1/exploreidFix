"use client"

import React, { useState, useEffect } from "react" // Tambahkan useEffect
import Link from "next/link"
import { useRouter } from "next/navigation" 
import Image from "next/image" // Import Image
import { IoLockClosedOutline } from "react-icons/io5"
import { BsEnvelope, BsPerson } from "react-icons/bs" 
import { motion, AnimatePresence } from "framer-motion"
import Navbar from "@/components/Navbar/Navbar"
import Footer from "@/components/Footer/Footer"

// ----- 1. LOGIKA BACKGROUND ANIMASI (DARI HOMEPAGE) -----
const heroImages = [
  { src: "/assets/home/hero-1.webp", alt: "Register Background 1" },
  { src: "/assets/home/hero-2.webp", alt: "Register Background 2" },
  { src: "/assets/home/hero-3.webp", alt: "Register Background 3" },
];

const imageContainerVariants = {
  enter: { opacity: 0, scale: 1.05 },
  center: { opacity: 1, scale: 1, transition: { duration: 2.0, ease: "easeInOut" } },
  exit: { opacity: 0, scale: 1.05, transition: { duration: 2.0, ease: "easeInOut" } },
};
// -----------------------------------------------------

const formVariants = {
  initial: { opacity: 0, y: 50, scale: 0.95 },
  animate: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.4, ease: "easeOut" } },
  exit: { opacity: 0, y: 50, scale: 0.95, transition: { duration: 0.4, ease: "easeOut" } },
}

export default function Register() {
  const router = useRouter() 
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(false)
  const [isExiting, setIsExiting] = useState(false)
  const [searchQuery, setSearchQuery] = useState("") // Untuk Navbar

  // ----- 2. STATE DAN EFEK UNTUK BACKGROUND -----
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % heroImages.length);
    }, 7000); // Ganti gambar setiap 7 detik
    return () => clearInterval(timer);
  }, []);
  // ---------------------------------------------

  // ... (Handler register 'disabled' Anda tetap sama) ...
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    alert("Registration is disabled for this dummy version. Please use the dummy account to log in.")
    setIsExiting(true)
    setTimeout(() => {
      router.push("/login")
    }, 400)
  }

  const handleLinkClick = (path: string, e: React.MouseEvent) => {
    e.preventDefault()
    setIsExiting(true)
    setTimeout(() => {
      router.push(path) 
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
              key="registerForm"
              // Pastikan ada 'relative z-20' agar di atas background
              className="relative z-20 w-full max-w-md bg-[#060c20]/50 backdrop-blur-xl border-2 border-white/50 rounded-3xl shadow-xl p-10 overflow-hidden"
              variants={formVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              
              <h2 className="text-3xl font-semibold text-white text-center mb-8">Registration</h2>
              
              <form onSubmit={handleSubmit}>
                {/* ... (Semua field input Anda tetap sama) ... */}
                <div className="relative w-full h-[50px] border-b-2 border-white/80 mb-8">
                  <span className="absolute right-2 top-1/2 -translate-y-1/2 text-white text-xl"><BsPerson /></span>
                  <input type="text" required value={username} onChange={(e) => setUsername(e.target.value)} className="w-full h-full bg-transparent border-none outline-none text-base text-white font-semibold px-5 py-0" suppressHydrationWarning />
                  <label className={`absolute top-1/2 left-1 -translate-y-1/2 text-white font-medium pointer-events-none transition-all duration-500 ${username ? "top-[-5px]" : ""}`}>Username</label>
                </div>
                <div className="relative w-full h-[50px] border-b-2 border-white/80 mb-8">
                  <span className="absolute right-2 top-1/2 -translate-y-1/2 text-white text-xl"><BsEnvelope /></span>
                  <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full h-full bg-transparent border-none outline-none text-base text-white font-semibold px-5 py-0" suppressHydrationWarning />
                  <label className={`absolute top-1/2 left-1 -translate-y-1/2 text-white font-medium pointer-events-none transition-all duration-500 ${email ? "top-[-5px]" : ""}`}>Email</label>
                </div>
                <div className="relative w-full h-[50px] border-b-2 border-white/80 mb-8">
                  <span className="absolute right-2 top-1/2 -translate-y-1/2 text-white text-xl"><IoLockClosedOutline /></span>
                  <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full h-full bg-transparent border-none outline-none text-base text-white font-semibold px-5 py-0" suppressHydrationWarning />
                  <label className={`absolute top-1/2 left-1 -translate-y-1/2 text-white font-medium pointer-events-none transition-all duration-500 ${password ? "top-[-5px]" : ""}`}>Password</label>
                </div>
                
                <div className="flex items-center mb-6 -mt-4">
                  <label className="text-sm text-white font-medium flex items-center">
                    <input type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} className="mr-2 accent-white" suppressHydrationWarning />
                    Remember me
                  </label>
                </div>

                <button type="submit" className="w-full h-12 bg-[#93c5fd] text-[#060c20] border-none outline-none rounded-lg cursor-pointer text-base font-medium transition-all hover:bg-[#93c5fd]/90" suppressHydrationWarning>
                  Register
                </button>

                <div className="text-center text-white text-sm font-medium mt-6">
                  <p className="flex flex-col sm:flex-row items-center justify-center gap-2">
                    Already have an account?
                    <Link href="/login" onClick={(e) => handleLinkClick("/login", e)} className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg transition-all">
                      Login
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