import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

// 1. Impor BottomNav
import BottomNav from "@/components/Navbar/BottomNav";

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "ExploreID",
  description: "Explore the cultural wonders of Indonesia with our curated travel experiences",
}

export const viewport = {
  width: "device-width",
  initialScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        
        {/* 2. Beri padding-bottom di HP (pb-16) agar konten tidak tertutup BottomNav */}
        {/* Di desktop (md:pb-0), padding di-nol-kan lagi. */}
        <main className="pb-16 md:pb-0">
          {children}
        </main>
        
        {/* 3. Tambahkan BottomNav di sini */}
        <BottomNav />
        
      </body>
    </html>
  )
}