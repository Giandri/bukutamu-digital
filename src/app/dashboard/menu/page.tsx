"use client";

import { Dock } from "@/components/Dock";
import Header from "@/components/Header";
import { QrCode, Users, Calendar, History, Settings } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function ReceptionDashboard() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check authentication on client side with retry
    const checkAuth = (retries = 0) => {
      const authCookie = document.cookie
        .split("; ")
        .find((row) => row.startsWith("auth="))
        ?.split("=")[1];

      if (authCookie === "authenticated") {
        setIsLoading(false);
        return;
      }

      // If no valid cookie and we've tried less than 5 times, wait and retry
      if (retries < 5) {
        setTimeout(() => checkAuth(retries + 1), 200);
      } else {
        // After 5 retries, redirect to login
        router.push("/dashboard");
      }
    };

    checkAuth();
  }, [router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-yellow-400 flex flex-col items-center justify-center">
        <div className="text-[#10375C] text-lg">Memverifikasi Akses...</div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-yellow-400 flex flex-col">
      {/* Header */}
      <Header />

      {/* Main Menu Grid */}
      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 md:px-8 pb-8 md:pb-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 md:gap-10 max-w-sm sm:max-w-xl w-full">
          {/* Scan QR */}
          <Link href="/dashboard/menu/scan">
            <button className="flex flex-col items-center gap-3 sm:gap-4 bg-white rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer hover:scale-105 active:scale-95 w-full">
              <div className="bg-gray-50 p-3 sm:p-4 rounded-2xl">
                <QrCode size={48} className="text-gray-800 sm:w-16 sm:h-16" />
              </div>
              <p className="text-base sm:text-lg font-semibold text-gray-800 text-center">Scan QR</p>
            </button>
          </Link>

          {/* Daftar Tertuju */}
          <Link href="/dashboard/menu/list">
            <button className="flex flex-col items-center gap-3 sm:gap-4 bg-white rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer hover:scale-105 active:scale-95 w-full">
              <div className="bg-gray-50 p-3 sm:p-4 rounded-2xl">
                <Users size={48} className="text-gray-800 sm:w-16 sm:h-16" />
              </div>
              <p className="text-base sm:text-lg font-semibold text-gray-800 text-center">Daftar Tertuju</p>
            </button>
          </Link>

          {/* Jadwal Temu */}
          <Link href="/dashboard/menu/schedule">
            <button className="flex flex-col items-center gap-3 sm:gap-4 bg-white rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer hover:scale-105 active:scale-95 w-full">
              <div className="bg-gray-50 p-3 sm:p-4 rounded-2xl">
                <Calendar size={48} className="text-gray-800 sm:w-16 sm:h-16" />
              </div>
              <p className="text-base sm:text-lg font-semibold text-gray-800 text-center">Jadwal Temu</p>
            </button>
          </Link>

          {/* Riwayat */}
          <Link href="/dashboard/menu/history">
            <button className="flex flex-col items-center gap-3 sm:gap-4 bg-white rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer hover:scale-105 active:scale-95 w-full">
              <div className="bg-gray-50 p-3 sm:p-4 rounded-2xl">
                <History size={48} className="text-gray-800 sm:w-16 sm:h-16" />
              </div>
              <p className="text-base sm:text-lg font-semibold text-gray-800 text-center">Riwayat</p>
            </button>
          </Link>
        </div>
      </main>

      {/* Dock Bottom */}
      <Dock />
    </div>
  );
}
