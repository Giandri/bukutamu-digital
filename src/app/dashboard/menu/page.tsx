"use client";

import { Dock } from "@/components/Dock";
import Header from "@/components/Header";
import { QrCode, Users, Calendar, History } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { AnimatedBackground } from "@/components/ui/animated-background";
import { SpotlightCard } from "@/components/ui/spotlight-card";

export default function ReceptionDashboard() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {

    const checkAuth = (retries = 0) => {
      const authCookie = document.cookie
        .split("; ")
        .find((row) => row.startsWith("auth="))
        ?.split("=")[1];

      if (authCookie === "authenticated") {
        setIsLoading(false);
        return;
      }

      if (retries < 5) {
        setTimeout(() => checkAuth(retries + 1), 200);
      } else {
        router.push("/dashboard");
      }
    };

    checkAuth();
  }, [router]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring" as const, stiffness: 50, damping: 10 },
    },
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#facd15] flex flex-col items-center justify-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ repeat: Infinity, duration: 1, repeatType: "reverse" }}
          className="text-[#10375C] text-xl font-bold bg-white/20 backdrop-blur-md px-6 py-3 rounded-full"
        >
          Memverifikasi Akses...
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative flex flex-col overflow-hidden">
      {/* Animated Background */}
      <AnimatedBackground />

      {/* Header */}
      <div className="z-10 relative">
        <Header />
      </div>

      {/* Main Menu Grid */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 md:px-8 pb-32 z-10">

        {/* Animated Greeting / Title */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-10"
        >
          <h1 className="text-4xl md:text-5xl font-black text-[#10375C] drop-shadow-sm mb-2">
            Menu Utama
          </h1>
          <p className="text-[#10375C]/80 text-lg font-medium">
            Pilih layanan yang Anda butuhkan
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 md:gap-8 max-w-2xl w-full"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Scan QR */}
          <motion.div variants={itemVariants}>
            <Link href="/dashboard/menu/scan">
              <SpotlightCard className="h-full">
                <div className="relative z-10 flex flex-col items-center gap-4 p-8">
                  <div className="bg-[#10375C]/10 p-4 rounded-2xl group-hover:bg-[#10375C] transition-colors duration-300">
                    <QrCode size={40} className="text-[#10375C] group-hover:text-white transition-colors duration-300" />
                  </div>
                  <div className="text-center">
                    <p className="text-xl font-bold text-[#10375C] mb-1">Scan QR</p>
                    <p className="text-sm text-gray-600">Pindai kode QR tamu</p>
                  </div>
                </div>
                <div className="absolute top-0 right-0 p-3 opacity-10 pointer-events-none">
                  <QrCode size={100} className="text-[#10375C] rotate-12" />
                </div>
              </SpotlightCard>
            </Link>
          </motion.div>

          {/* Daftar Tertuju */}
          <motion.div variants={itemVariants}>
            <Link href="/dashboard/menu/list">
              <SpotlightCard className="h-full">
                <div className="relative z-10 flex flex-col items-center gap-4 p-8">
                  <div className="bg-[#10375C]/10 p-4 rounded-2xl group-hover:bg-[#10375C] transition-colors duration-300">
                    <Users size={40} className="text-[#10375C] group-hover:text-white transition-colors duration-300" />
                  </div>
                  <div className="text-center">
                    <p className="text-xl font-bold text-[#10375C] mb-1">Daftar Tertuju</p>
                    <p className="text-sm text-gray-600">Lihat semua staff</p>
                  </div>
                </div>
                <div className="absolute top-0 right-0 p-3 opacity-10 pointer-events-none">
                  <Users size={100} className="text-[#10375C] rotate-12" />
                </div>
              </SpotlightCard>
            </Link>
          </motion.div>

          {/* Jadwal Temu */}
          <motion.div variants={itemVariants}>
            <Link href="/dashboard/menu/schedule">
              <SpotlightCard className="h-full">
                <div className="relative z-10 flex flex-col items-center gap-4 p-8">
                  <div className="bg-[#10375C]/10 p-4 rounded-2xl group-hover:bg-[#10375C] transition-colors duration-300">
                    <Calendar size={40} className="text-[#10375C] group-hover:text-white transition-colors duration-300" />
                  </div>
                  <div className="text-center">
                    <p className="text-xl font-bold text-[#10375C] mb-1">Jadwal Temu</p>
                    <p className="text-sm text-gray-600">Cek jadwal kunjungan</p>
                  </div>
                </div>
                <div className="absolute top-0 right-0 p-3 opacity-10 pointer-events-none">
                  <Calendar size={100} className="text-[#10375C] rotate-12" />
                </div>
              </SpotlightCard>
            </Link>
          </motion.div>

          {/* Riwayat */}
          <motion.div variants={itemVariants}>
            <Link href="/dashboard/menu/history">
              <SpotlightCard className="h-full">
                <div className="relative z-10 flex flex-col items-center gap-4 p-8">
                  <div className="bg-[#10375C]/10 p-4 rounded-2xl group-hover:bg-[#10375C] transition-colors duration-300">
                    <History size={40} className="text-[#10375C] group-hover:text-white transition-colors duration-300" />
                  </div>
                  <div className="text-center">
                    <p className="text-xl font-bold text-[#10375C] mb-1">Riwayat</p>
                    <p className="text-sm text-gray-600">Log aktivitas tamu</p>
                  </div>
                </div>
                <div className="absolute top-0 right-0 p-3 opacity-10 pointer-events-none">
                  <History size={100} className="text-[#10375C] rotate-12" />
                </div>
              </SpotlightCard>
            </Link>
          </motion.div>
        </motion.div>
      </main>

      {/* Dock Bottom */}
      <Dock />
    </div>
  );
}
