"use client";

import React, { useState, useEffect } from "react";
import Header from "@/components/Header";
import { Dock } from "@/components/Dock";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Clock, User, Phone, ArrowLeft, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface HistoryItem {
  id: string;
  nama: string;
  host: string;
  whatsapp: string;
  waktu: string;
  status: string;
  action: string;
  notes?: string;
  qrCode?: string;
}

export default function RiwayatTamuPage() {
  const router = useRouter();
  const [riwayatTamu, setRiwayatTamu] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch history data
  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("/api/history");
      const data = await response.json();

      if (response.ok) {
        setRiwayatTamu(data.history || []);
      } else {
        setError(data.error || "Gagal mengambil data riwayat");
      }
    } catch (err) {
      console.error("Error fetching history:", err);
      setError("Terjadi kesalahan saat mengambil data");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "check-in berhasil":
      case "selesai":
        return "bg-gray-200 text-gray-800";
      case "sedang menunggu":
      case "menunggu check-in":
        return "bg-yellow-200 text-yellow-800";
      case "check-out":
        return "bg-blue-200 text-blue-800";
      default:
        return "bg-gray-200 text-gray-800";
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
            <Button onClick={fetchHistory} variant="ghost" size="sm" className="text-white hover:bg-white/10 p-2" disabled={loading}>
              <RefreshCw className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
          </div>

          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-[#10375C] mb-2">Riwayat Tamu</h1>
            {riwayatTamu.length > 0 && <p className="text-[#10375C]/70 text-sm">Total {riwayatTamu.length} aktivitas tamu tercatat</p>}
          </div>

          {/* Loading State */}
          {loading && (
            <div className="text-center py-12">
              <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-[#10375C]" />
              <p className="text-[#10375C] text-lg">Memuat riwayat tamu...</p>
            </div>
          )}

          {/* Error State */}
          {error && !loading && (
            <div className="text-center py-12">
              <div className="bg-red-50 border border-red-200 rounded-xl p-6 max-w-md mx-auto">
                <p className="text-red-600 font-semibold mb-2">❌ Terjadi Kesalahan</p>
                <p className="text-red-500 text-sm mb-4">{error}</p>
                <Button onClick={fetchHistory} className="bg-red-600 hover:bg-red-700">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Coba Lagi
                </Button>
              </div>
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && riwayatTamu.length === 0 && (
            <div className="text-center py-12">
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-8 max-w-md mx-auto">
                <Calendar className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-semibold text-gray-700 mb-2">Belum Ada Riwayat</h3>
                <p className="text-gray-500 text-sm">Riwayat aktivitas tamu akan muncul di sini setelah ada tamu yang melakukan check-in atau check-out.</p>
              </div>
            </div>
          )}

          {/* History List */}
          {!loading && !error && riwayatTamu.length > 0 && (
            <div className="space-y-6">
              {riwayatTamu.map((tamu) => (
                <Card key={tamu.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
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
                        {tamu.notes && <div className="ml-8 text-xs text-gray-500 italic">"{tamu.notes}"</div>}
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

      <Dock />
    </main>
  );
}
