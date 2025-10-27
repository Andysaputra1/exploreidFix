"use client" 

import { useState } from "react"
import HeroSection from "@/components/Home/HeroSection"
import HighlightsSection from "@/components/Home/HighlightsSection"
import FeatureGallery from "@/components/Home/FeatureGallery"
import StatsAndQuote from "@/components/Home/StatsAndQuote"
import ContactUsSection from "@/components/Home/ContactForm"
import Footer from "@/components/Footer/Footer"
import Navbar from "@/components/Navbar/Navbar"

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("") 

  return (
    <>
      <Navbar searchQuery={searchQuery} onSearchChange={setSearchQuery} />

      <HeroSection />
      <HighlightsSection />
      <StatsAndQuote /> 
      <FeatureGallery />
      <ContactUsSection />
      <Footer />
    </>
  )
}