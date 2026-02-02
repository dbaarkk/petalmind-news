import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import BottomNav from "@/components/BottomNav";
import { VisualEditsMessenger } from "orchids-visual-edits";
import ErrorReporter from "@/components/ErrorReporter";
import Script from "next/script";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "PETALMIND | Premium Indian News",
  description: "Real-time, full-story news from trusted Indian sources. The most immersive news experience in India.",
  manifest: "/manifest.json",
  icons: {
    icon: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/project-uploads/d2d4de2a-e8c2-4859-ad74-b536250785a9/file_0000000032287206a5d0bae7564bffd9-1770008749368.png?width=32&height=32&resize=contain",
    apple: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/project-uploads/d2d4de2a-e8c2-4859-ad74-b536250785a9/file_0000000032287206a5d0bae7564bffd9-1770008749368.png?width=180&height=180&resize=contain",
  },
  themeColor: "#facc15",
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <Script
          id="orchids-browser-logs"
          src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/scripts/orchids-browser-logs.js"
          strategy="afterInteractive"
          data-orchids-project-id="f4ecc5fd-fc7a-4d15-ada7-f5a358e0405a"
        />
        <ErrorReporter />
        <Script
          src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/scripts//route-messenger.js"
          strategy="afterInteractive"
          data-target-origin="*"
          data-message-type="ROUTE_CHANGE"
          data-include-search-params="true"
          data-only-in-iframe="true"
          data-debug="true"
          data-custom-data='{"appName": "YourApp", "version": "1.0.0", "greeting": "hi"}'
        />
        <div className="mx-auto min-h-screen max-w-2xl border-x bg-white pb-20 md:pb-0">
          <Navbar />
          <main>{children}</main>
          <BottomNav />
        </div>
        <VisualEditsMessenger />
      </body>
    </html>
  );
}