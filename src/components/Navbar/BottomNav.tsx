'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Map, Users } from 'lucide-react'; // Impor ikon

export default function BottomNav() {
  const pathname = usePathname();

  const links = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Explore', href: '/explore', icon: Map },
    { name: 'Tour Guide', href: '/tour-guides', icon: Users },
  ];

  return (
    // Muncul di HP (md:hidden), fix di bawah, z-40 (di bawah Navbar atas)
    <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 
                   bg-[#060c20]/80 backdrop-blur-xl 
                   border-t-2 border-white/30 z-40">
      
      <div className="flex justify-around items-center h-full">
        {links.map((link) => {
          // Cek apakah link aktif
          // (Logika khusus: 'Explore' tetap aktif meskipun path-nya '/explore?place=...')
          const isActive = (link.href === '/' && pathname === '/') || 
                           (link.href !== '/' && pathname.startsWith(link.href));
          
          return (
            <Link 
              key={link.name} 
              href={link.href} 
              // Ganti warna jika aktif
              className={`flex flex-col items-center justify-center transition-colors 
                          ${isActive ? 'text-blue-300' : 'text-gray-400 hover:text-white'}`}
            >
              <link.icon size={24} />
              <span className="text-xs font-medium">{link.name}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}