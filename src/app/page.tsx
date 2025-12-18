"use client";

import Header from "@/components/Header";
import { Dock } from "@/components/Dock";
import { motion } from "framer-motion";
import { AnimatedBackground } from "@/components/ui/animated-background";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col relative overflow-hidden">
      {/* Animated Background */}
      <AnimatedBackground />

      {/* Top Header */}
      <div className="z-10 relative">
        <Header />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col items-center justify-center w-full relative z-10">

        <motion.div
          className="flex flex-col items-center text-center z-0 -mt-20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          {/* Selamat Datang - Script Font */}
          <motion.h1
            className="font-pacifico text-6xl md:text-8xl text-white drop-shadow-md mb-2"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8, type: "spring" }}
          >
            Selamat Datang
          </motion.h1>

          {/* Di Buku Tamu Digital - Bold Sans */}
          <motion.h2
            className="font-poppins font-black text-4xl md:text-5xl text-[#10375C] leading-tight"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            Di Buku Tamu Digital
          </motion.h2>

          {/* BWS BABEL - Bold Sans */}
          <motion.h3
            className="font-poppins font-black text-2xl md:text-3xl text-[#10375C] "
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.8 }}
          >
            BWS BABEL
          </motion.h3>
        </motion.div>

        {/* Dock at the bottom */}
        <Dock />
      </div>
    </main>
  );
}
