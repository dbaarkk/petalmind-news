"use client";

import Link from "next/link";
import { Search, Menu, X, Home, Compass, Newspaper, Download } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    window.addEventListener("beforeinstallprompt", (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    });
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) {
      alert("App is already installed or your browser doesn't support installation.");
      return;
    }
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setDeferredPrompt(null);
    }
    setIsMenuOpen(false);
  };

  const LogoBranding = ({ className = "" }: { className?: string }) => (
    <div className={cn("flex items-center gap-2", className)}>
      <img 
        src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/project-uploads/d2d4de2a-e8c2-4859-ad74-b536250785a9/file_0000000032287206a5d0bae7564bffd9-1770008749368.png?width=100&height=100&resize=contain" 
        alt="PETALMIND Logo" 
        className="h-10 w-10 object-contain" 
      />
      <span className="text-xl font-black tracking-[0.2em] text-gray-900 uppercase font-serif">
        PETALMIND
      </span>
    </div>
  );

  return (
    <>
      <nav className="sticky top-0 z-50 flex h-16 items-center justify-between border-b bg-white px-4 md:px-8">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsMenuOpen(true)}
            className="rounded-lg p-1 hover:bg-gray-100 transition-colors"
          >
            <Menu className="h-6 w-6 text-gray-900" />
          </button>
          <Link href="/">
            <LogoBranding />
          </Link>
        </div>
        <div className="flex items-center">
          <Link href="/discover" className="rounded-full p-2 hover:bg-gray-100 transition-colors">
            <Search className="h-6 w-6 text-gray-600" />
          </Link>
        </div>
      </nav>

      {/* Mobile Drawer Overlay */}
      <div 
        className={cn(
          "fixed inset-0 z-[60] bg-black/50 transition-opacity duration-300",
          isMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
        onClick={() => setIsMenuOpen(false)}
      />

      {/* Side Menu */}
      <div 
        className={cn(
          "fixed left-0 top-0 z-[70] h-full w-80 bg-white shadow-2xl transition-transform duration-300 ease-out",
          isMenuOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between border-b p-6 py-4">
            <LogoBranding />
            <button 
              onClick={() => setIsMenuOpen(false)}
              className="rounded-full p-2 hover:bg-gray-100"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto py-6 px-4 space-y-2">
            <MenuLink href="/" icon={<Home className="h-5 w-5" />} label="Home" onClick={() => setIsMenuOpen(false)} />
            <MenuLink href="/discover" icon={<Compass className="h-5 w-5" />} label="Discover" onClick={() => setIsMenuOpen(false)} />
            <MenuLink href="/articles" icon={<Newspaper className="h-5 w-5" />} label="Articles" onClick={() => setIsMenuOpen(false)} />
            <div className="pt-4 border-t mt-4">
              <button 
                onClick={handleInstall}
                className="flex w-full items-center gap-4 rounded-xl px-4 py-3 text-gray-700 font-bold hover:bg-gray-50 hover:text-gray-900 transition-all active:scale-95"
              >
                <Download className="h-5 w-5" />
                <span>Install webapp</span>
              </button>
            </div>
          </div>

          <div className="border-t p-6 text-center">
            <p className="text-xs text-gray-400">© 2026 PETALMIND News. Premium Indian News.</p>
          </div>
        </div>
      </div>
    </>
  );
}

function MenuLink({ href, icon, label, onClick }: { href: string; icon: React.ReactNode; label: string; onClick: () => void }) {
  return (
    <Link 
      href={href} 
      onClick={onClick}
      className="flex items-center gap-4 rounded-xl px-4 py-3 text-gray-700 font-bold hover:bg-gray-50 hover:text-gray-900 transition-all active:scale-95"
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
}
