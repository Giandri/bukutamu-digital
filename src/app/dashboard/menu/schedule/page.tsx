"use client";

import React, { useState, useEffect } from "react";
import Header from "@/components/Header";
import { Dock } from "@/components/Dock";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Clock, User, Phone, ArrowLeft, RefreshCw, CalendarDays } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface ScheduleItem {
  id: string;
  nama: string;
  host: string;
  whatsapp: string;
  waktu: string;
  status: string;
  purpose: string;
  qrCode?: string;
  createdAt: Date;
}

export default function JadwalTemuPage() {
  const router = useRouter();
  const [jadwalTemu, setJadwalTemu] = useState<ScheduleItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSchedule();
  }, []);

  const fetchSchedule = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("/api/schedule");
      const data = await response.json();

      if (response.ok) {
        setJadwalTemu(data.schedule || []);
      } else {
        setError(data.error || "Gagal mengambil data jadwal temu");
      }
    } catch (err) {
      console.error("Error fetching schedule:", err);
      setError("Terjadi kesalahan saat mengambil data");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'menunggu check-in':
        return 'bg-orange-200 text-orange-800';
      case 'jadwal hari ini':
        return 'bg-blue-200 text-blue-800';
      case 'jadwal besok':
        return 'bg-purple-200 text-purple-800';
      default:
        return 'bg-gray-200 text-gray-800';
    }
  };

  return (
    <main className="min-h-screen bg-[#facd15] flex flex-col">
      <Header />

      <div className="flex-1 p-6 pb-32">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <div className="mb-4 flex items-center justify-between">
            <Button variant="ghost" size="sm" onClick={() => router.back()} className="text-white hover:bg-white/10 p-2">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Kembali
            </Button>
            <Button onClick={fetchSchedule} variant="ghost" size="sm" className="text-white hover:bg-white/10 p-2" disabled={loading}>
              <RefreshCw className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
          </div>

          <div className="bg-white rounded-[2rem] p-6 shadow-xl border border-white/20">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-[#10375C] mb-2">Jadwal Temu</h1>
              {jadwalTemu.length > 0 && <p className="text-[#10375C]/70 text-sm">Total {jadwalTemu.length} tamu menunggu check-in</p>}
            </div>

            {/* Loading State */}
            {loading && (
              <div className="text-center py-12">
                <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-[#10375C]" />
                <p className="text-[#10375C] text-lg">Memuat jadwal temu...</p>
              </div>
            )}

            {/* Error State */}
            {error && !loading && (
              <div className="text-center py-12">
                <div className="bg-red-50 border border-red-200 rounded-xl p-6 max-w-md mx-auto">
                  <p className="text-red-600 font-semibold mb-2">❌ Terjadi Kesalahan</p>
                  <p className="text-red-500 text-sm mb-4">{error}</p>
                  <Button onClick={fetchSchedule} className="bg-red-600 hover:bg-red-700">
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Coba Lagi
                  </Button>
                </div>
              </div>
            )}

            {/* Empty State */}
            {!loading && !error && jadwalTemu.length === 0 && (
              <div className="text-center py-12">
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-8 max-w-md mx-auto">
                  <CalendarDays className="w-16 h-16 mx-auto mb-4 text-blue-400" />
                  <h3 className="text-lg font-semibold text-blue-700 mb-2">Tidak Ada Jadwal</h3>
                  <p className="text-blue-600 text-sm">
                    Semua tamu sudah melakukan check-in. Jadwal temu kosong.
                  </p>
                </div>
              </div>
            )}

            {/* Schedule List */}
            {!loading && !error && jadwalTemu.length > 0 && (
              <div className="space-y-6">
                {jadwalTemu.map((tamu) => (
                  <Card key={tamu.id} className="bg-gray-50/50 rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <User className="w-5 h-5 text-[#10375C]" />
                            <h3 className="font-bold text-lg text-[#10375C]">{tamu.nama}</h3>
                          </div>
                          <div className="flex items-center gap-3 mb-2">
                            <Phone className="w-5 h-5 text-green-600" />
                            <p className="text-sm text-gray-700">Bertemu: {tamu.host}</p>
                          </div>
                          <div className="flex items-center gap-3 mb-1">
                            <Clock className="w-5 h-5 text-gray-600" />
                            <p className="text-sm text-gray-600">{tamu.waktu}</p>
                          </div>
                          {tamu.purpose && (
                            <div className="ml-8 text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-md inline-block">
                              Keperluan: {tamu.purpose}
                            </div>
                          )}
                        </div>

                        <div className="text-right">
                          <span className={`inline-block px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(tamu.status)}`}>{tamu.status}</span>
                          {tamu.qrCode && <p className="text-xs text-gray-500 mt-2 font-mono">QR: {tamu.qrCode.substring(0, 8)}...</p>}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <Dock />
    </main>
  );
}
