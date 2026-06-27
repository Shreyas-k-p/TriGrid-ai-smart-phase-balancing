import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { MQTTProvider } from "@/components/MQTTProvider";
import { Toaster } from "react-hot-toast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "GRIDSENSE AI - Phase Balancing Dashboard",
  description: "Balancing the Grid, Empowering Renewable Energy.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}>
      <body className="min-h-full flex flex-col bg-[#0D1117] text-white overflow-hidden">
        <MQTTProvider>
          {children}
          <Toaster position="bottom-right" toastOptions={{ style: { background: '#1a202c', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' } }} />
        </MQTTProvider>
      </body>
    </html>
  );
}
