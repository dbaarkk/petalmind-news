"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Compass, Newspaper } from "lucide-react";
import { cn } from "@/lib/utils";

export default function BottomNav() {
  const pathname = usePathname();

    const navItems = [
      { label: "Home", icon: Home, href: "/" },
      { label: "Discover", icon: Compass, href: "/discover" },
      { label: "Articles", icon: Newspaper, href: "/articles" },
    ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t bg-white px-6 py-2 pb-6 md:hidden">
      <div className="flex items-center justify-between">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-1 transition-colors",
                isActive ? "text-yellow-500" : "text-gray-400"
              )}
            >
              <Icon className="h-6 w-6" />
              <span className="text-[10px] font-medium uppercase tracking-wider">
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
