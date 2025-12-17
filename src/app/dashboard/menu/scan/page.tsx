"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import { Dock } from "@/components/Dock";
import { Button } from "@/components/ui/button";
import { QrCode, Camera, RefreshCw, CheckCircle, XCircle, AlertCircle, ArrowLeft, Keyboard } from "lucide-react";
import { Html5Qrcode } from "html5-qrcode";
import { getWhatsAppNumber, formatWhatsAppMessage } from "@/lib/whatsapp";

export default function ScanQRPage() {
  const router = useRouter();
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showManualInput, setShowManualInput] = useState(false);
  const scannerRef = useRef<Html5Qrcode | null>(null);

  useEffect(() => {
    // Check if we're on HTTPS (required for camera access)
    if (typeof window !== "undefined") {
      const isHttps = window.location.protocol === "https:" || window.location.hostname === "localhost";
      if (!isHttps) {
        setError("Kamera memerlukan koneksi HTTPS. Silakan akses melalui https:// atau gunakan Input Manual.");
        return;
      }
    }

    startScanning();
    return () => stopScanning();
  }, []);

  const startScanning = async () => {
    try {
      setError(null);
      setIsScanning(true);

      console.log("Starting Html5Qrcode...");

      // Wait for DOM to update after state change
      await new Promise((resolve) => setTimeout(resolve, 100));

      console.log("Looking for element with id 'qr-reader'");
      const qrReaderElement = document.getElementById("qr-reader");
      if (!qrReaderElement) {
        throw new Error("QR reader element not found");
      }
      console.log("QR reader element found:", qrReaderElement);

      // Clear any existing scanner
      if (scannerRef.current) {
        console.log("Clearing existing scanner...");
        await scannerRef.current.stop();
        scannerRef.current.clear();
      }

      // Create new scanner instance
      console.log("Creating new Html5Qrcode instance...");
      const scanner = new Html5Qrcode("qr-reader");
      scannerRef.current = scanner;

      // Start scanning with custom config
      await scanner.start(
        { facingMode: "environment" }, // Prefer back camera
        {
          fps: 10,
          qrbox: { width: 320, height: 320 },
          aspectRatio: 1.0,
        },
        (decodedText: string) => {
          console.log("QR Code detected:", decodedText);
          setScanResult(decodedText);
          stopScanning();

          // Optional: vibrate on mobile devices
          if (navigator.vibrate) {
            navigator.vibrate(200);
          }
        },
        (errorMessage: string) => {
          // Ignore scanning errors, they're normal
          if (!errorMessage.includes("NotFoundException")) {
            console.warn("QR scan error:", errorMessage);
          }
        }
      );

      console.log("Html5Qrcode started successfully");
      console.log("Scanner is now active and looking for QR codes");
    } catch (err: any) {
      console.error("Error starting scanner:", err);
      let errorMessage = "Tidak dapat memulai scanner.";

      if (err.name === "NotAllowedError") {
        errorMessage = "Izin kamera ditolak. Berikan izin kamera dan coba lagi.";
      } else if (err.name === "NotFoundError") {
        errorMessage = "Kamera tidak ditemukan. Pastikan perangkat memiliki kamera.";
      } else if (err.name === "NotReadableError") {
        errorMessage = "Kamera sedang digunakan aplikasi lain.";
      } else if (err.message) {
        errorMessage += ` ${err.message}`;
      }

      setError(errorMessage);
      setIsScanning(false);
    }
  };

  const stopScanning = () => {
    setIsScanning(false);
    if (scannerRef.current) {
      scannerRef.current
        .stop()
        .then(() => {
          scannerRef.current?.clear();
          scannerRef.current = null;
        })
        .catch(console.error);
    }
  };

  const handleRestartScan = () => {
    setScanResult(null);
    setError(null);
    setShowManualInput(false);
    startScanning();
  };

  const handleManualInput = (qrCode: string) => {
    if (qrCode.trim()) {
      setScanResult(qrCode.trim());
      setShowManualInput(false);
    }
  };

  const handleVerifyGuest = async () => {
    if (!scanResult) return;

    setIsLoading(true);
    try {
      // Parse QR code data (could be JSON or simple ID)
      let qrData;
      try {
        qrData = JSON.parse(scanResult);
      } catch {
        // If not JSON, treat as simple ID
        qrData = { id: scanResult };
      }

      const qrCodeId = qrData.id || qrData;

      const response = await fetch("/api/guests/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ qrCode: qrCodeId }),
      });

      const data = await response.json();

      if (response.ok) {
        // Send WhatsApp notification to the person being visited
        await sendWhatsAppNotification(data.guest);

        alert(`✅ ${data.message}\n\nNama: ${data.guest.name}\nWhatsApp: ${data.guest.whatsapp}\nTertuju: ${data.guest.to}\n\nNotifikasi WhatsApp telah dikirim!`);

        // Reset scan for next guest
        setScanResult(null);
        startScanning();
      } else {
        alert(`❌ ${data.error}`);
      }
    } catch (err) {
      console.error("Error verifying guest:", err);
      alert("Gagal memverifikasi tamu");
    } finally {
      setIsLoading(false);
    }
  };

  const sendWhatsAppNotification = async (guest: any) => {
    try {
      const phoneNumber = await getWhatsAppNumber(guest.to);
      const message = formatWhatsAppMessage(guest);

      console.log("📱 Sending WhatsApp notification:", {
        to: guest.to,
        phoneNumber,
        message,
      });

      if (phoneNumber) {
        try {
          // Try to send via WAHA API
          const response = await fetch("/api/whatsapp/send", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              to: phoneNumber,
              message: message,
            }),
          });

          const data = await response.json();

          if (response.ok && data.success) {
            console.log("✅ WhatsApp sent successfully via WAHA:", data.messageId);
            // Show success notification
            alert(`✅ Notifikasi WhatsApp berhasil dikirim!\n\nPesan: ${message.substring(0, 50)}...`);
          } else if (data.fallback) {
            // Fallback to WhatsApp Web
            console.log("🔄 Falling back to WhatsApp Web");
            const whatsappUrl = data.whatsappUrl;
            window.open(whatsappUrl, "_blank");
            alert("📱 Membuka WhatsApp Web (WAHA tidak tersedia)");
          } else {
            throw new Error(data.error || "Failed to send WhatsApp");
          }
        } catch (apiError: any) {
          console.error("❌ WAHA API Error:", apiError);
          // Fallback to WhatsApp Web
          const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
          window.open(whatsappUrl, "_blank");
          alert("📱 Membuka WhatsApp Web (mode fallback)");
        }
      } else {
        console.warn("⚠️ No WhatsApp number found for recipient:", guest.to);
        alert("⚠️ Nomor WhatsApp penerima belum diatur. Silakan update data penerima di menu Kelola Data.");
      }
    } catch (error) {
      console.error("Error sending WhatsApp notification:", error);
      alert("❌ Gagal mengirim notifikasi WhatsApp");
    }
  };

  return (
    <main className="min-h-screen bg-[#facd15] flex flex-col">
      <Header />
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 md:px-8 py-8 md:py-12">
        <div className="bg-[#10375C] rounded-3xl shadow-2xl p-6 sm:p-8 md:p-12 max-w-lg sm:max-w-xl md:max-w-2xl w-full">
          {/* Back Button */}
          <div className="mb-4">
            <Button variant="ghost" size="sm" onClick={() => router.back()} className="text-white hover:bg-white/10 p-2">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Kembali
            </Button>
          </div>

          {/* Title */}
          <div className="text-center mb-6">
            <h1 className="text-white text-xl sm:text-2xl font-bold mb-2">Scan QR Code</h1>
            <p className="text-slate-300 text-sm sm:text-base">Arahkan kamera ke QR code tamu</p>
          </div>

          {/* Scanner Container */}
          <div className="relative rounded-2xl overflow-hidden mb-6">
            <div className="aspect-square w-full max-w-md mx-auto relative">
              {!scanResult && !error && (
                <>
                  <div id="qr-reader" className="w-full h-full rounded-xl overflow-hidden relative" />

                  {/* Custom Scanning overlay */}
                  {isScanning && (
                    <>
                      {/* Scanning area border with glow effect */}
                      <div className="absolute inset-4 border-2 border-white/70 rounded-lg pointer-events-none shadow-lg shadow-white/20"></div>

                      {/* Scanning line animation */}
                      <div className="absolute inset-4 pointer-events-none">
                        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-full h-1 bg-gradient-to-r from-transparent via-white to-transparent animate-scan-line z-10 shadow-lg shadow-white/50"></div>
                      </div>

                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center rounded-xl p-6 mx-4 ">
                          <div className="relative">
                            <QrCode className="w-20 h-20 mx-auto mb-3 text-white animate-pulse" />
                            <div className="absolute inset-0 w-20 h-20 mx-auto border-2 border-white rounded-full animate-ping opacity-30"></div>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </>
              )}

              {/* Error state */}
              {error && (
                <div className="w-full h-full flex items-center justify-center bg-gray-100">
                  <div className="text-center p-6">
                    <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                    <p className="text-red-600 font-semibold mb-4">{error}</p>
                    <Button onClick={handleRestartScan} className="bg-blue-500 hover:bg-blue-600">
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Coba Lagi
                    </Button>
                  </div>
                </div>
              )}

              {/* Success state */}
              {scanResult && (
                <div className="w-full h-full flex items-center justify-center bg-green-50">
                  <div className="text-center p-6">
                    <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                    <p className="text-green-600 font-semibold mb-2">QR Code Terdeteksi!</p>
                    <p className="text-gray-600 text-sm mb-4">ID: {scanResult}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-4">
            {scanResult && (
              <div className="space-y-3">
                <Button onClick={handleVerifyGuest} disabled={isLoading} className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-4 text-lg rounded-full disabled:opacity-50">
                  {isLoading ? (
                    <>
                      <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                      Memverifikasi...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-5 h-5 mr-2" />
                      Verifikasi Tamu
                    </>
                  )}
                </Button>

                <Button onClick={handleRestartScan} variant="outline" className="w-full border-white text-white hover:bg-white hover:text-[#10375C] font-bold py-4 text-lg rounded-full">
                  <RefreshCw className="w-5 h-5 mr-2" />
                  Scan Ulang
                </Button>
              </div>
            )}

            {error && (
              <Button onClick={handleRestartScan} className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-4 text-lg rounded-full">
                <Camera className="w-5 h-5 mr-2" />
                Mulai Scan
              </Button>
            )}

            {!scanResult && !error && isScanning && (
              <div className="space-y-3">
                <div className="text-center">
                  <p className="text-slate-300 text-sm">Kamera aktif - QR code akan terdeteksi otomatis</p>
                </div>
                <Button onClick={() => setShowManualInput(true)} variant="outline" className="w-full border-white text-white hover:bg-white hover:text-[#10375C] font-bold py-3 text-lg rounded-full">
                  <Keyboard className="w-5 h-5 mr-2" />
                  Input Manual
                </Button>
              </div>
            )}
          </div>

          {/* Manual Input */}
          {showManualInput && (
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 mb-6">
              <h3 className="text-white text-lg font-bold mb-4 text-center">Input Manual QR Code</h3>
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Masukkan kode QR..."
                  className="w-full px-4 py-3 rounded-lg border border-white/20 bg-white/10 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleManualInput(e.currentTarget.value);
                    }
                  }}
                  autoFocus
                />
                <div className="flex space-x-3">
                  <Button
                    onClick={(e) => {
                      const input = e.currentTarget.parentElement?.previousElementSibling as HTMLInputElement;
                      handleManualInput(input?.value || "");
                    }}
                    className="flex-1 bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-full">
                    <CheckCircle className="w-5 h-5 mr-2" />
                    Konfirmasi
                  </Button>
                  <Button onClick={() => setShowManualInput(false)} variant="outline" className="flex-1 border-white text-white hover:bg-white hover:text-[#10375C] font-bold py-3 rounded-full">
                    Batal
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Instructions */}
          <div className="text-center">
            <p className="text-slate-300 text-sm">Pastikan QR code berada dalam area scan yang lebih besar</p>
          </div>
        </div>
      </div>
      <Dock />
    </main>
  );
}
