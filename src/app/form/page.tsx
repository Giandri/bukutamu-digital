"use client";

import React, { useState, useEffect, useRef } from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Dock } from "@/components/Dock";
import { Stepper } from "@/components/ui/stepper";
import { ArrowRight, ChevronRight, ChevronLeft, ArrowLeft, Download, QrCode as QrIcon } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import QRCode from "qrcode";

const steps = [
  { id: 1, label: "Langkah langkah" },
  { id: 2, label: "Isi Form" },
  { id: 3, label: "Konfirmasi Form" },
  { id: 4, label: "QR Code" },
];

export default function FormPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [qrCodeUrl, setQrCodeUrl] = useState<string>("");
  const [recipients, setRecipients] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    whatsapp: "",
    to: "",
    purpose: "",
    qrCode: "",
  });

  // Fetch recipients on component mount
  useEffect(() => {
    const fetchRecipients = async () => {
      try {
        const response = await fetch("/api/recipients");
        const data = await response.json();
        setRecipients(data.recipients || []);
      } catch (error) {
        console.error("Error fetching recipients:", error);
      }
    };

    fetchRecipients();
  }, []);

  // Format phone number to Indonesian format (08xxxx)
  const formatPhoneNumber = (value: string): string => {
    // Remove all non-numeric characters
    let cleaned = value.replace(/\D/g, "");

    // Handle international format (+62)
    if (cleaned.startsWith("62")) {
      cleaned = cleaned.substring(2);
    }

    // Handle common prefixes
    if (cleaned.startsWith("0")) {
      // Already starts with 0, keep as is
      return cleaned;
    } else if (cleaned.length > 0) {
      // Add 0 prefix for Indonesian numbers
      return "0" + cleaned;
    }

    return cleaned;
  };

  // Convert Indonesian format (08xxxx) to international format (+62)
  const convertToInternational = (phoneNumber: string): string => {
    if (phoneNumber.startsWith("0")) {
      return "+62" + phoneNumber.substring(1);
    }
    return phoneNumber;
  };

  const handleNext = () => {
    if (currentStep < 4) setCurrentStep((prev) => prev + 1);
  };

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep((prev) => prev - 1);
  };

  const updateForm = (key: string, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  // Generate QR code when qrCode data is available
  useEffect(() => {
    if (formData.qrCode && currentStep === 4) {
      const generateQR = async () => {
        try {
          // Create QR code data with guest information
          const qrData = JSON.stringify({
            id: formData.qrCode,
            name: formData.name,
            whatsapp: formData.whatsapp,
            to: formData.to,
            purpose: formData.purpose,
            timestamp: new Date().toISOString(),
          });

          const url = await QRCode.toDataURL(qrData, {
            width: 512,
            margin: 4,
            color: {
              dark: "#000000",
              light: "#FFFFFF",
            },
          });
          setQrCodeUrl(url);
        } catch (error) {
          console.error("Error generating QR code:", error);
        }
      };
      generateQR();
    }
  }, [formData.qrCode, currentStep]);

  const handleSubmit = async () => {
    try {
      // Convert phone number to international format for backend
      const submitData = {
        ...formData,
        whatsapp: convertToInternational(formData.whatsapp),
      };

      const response = await fetch("/api/guests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submitData),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Guest created:", data);

        // Store QR code for display in step 4
        setFormData((prev) => ({ ...prev, qrCode: data.qrCode }));

        // Move to next step (QR Code display)
        handleNext();
      } else {
        const error = await response.json();
        alert("Gagal menyimpan data: " + (error.error || "Unknown error"));
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Terjadi kesalahan saat menyimpan data");
    }
  };

  return (
    <main className="min-h-screen bg-primary flex flex-col items-center p-4 md:p-8 font-poppins relative overflow-hidden">
      {/* Stepper Container */}
      <div className="w-full max-w-5xl bg-[#10375C]/90 rounded-full p-4 md:px-12 md:py-6 mb-6 shadow-lg relative z-10 hidden md:block">
        <Stepper steps={steps} currentStep={currentStep} className="px-20" />
      </div>

      {/* Mobile Stepper (Simplified) */}
      <div className="w-full max-w-5xl bg-[#10375C] rounded-2xl p-4 mb-6 shadow-lg md:hidden flex justify-between items-center text-white">
        <span className="text-primary font-bold">Step {currentStep}</span>
        <span className="text-slate-300 text-sm">{steps[currentStep - 1].label}</span>
      </div>

      {/* Main Content Card */}
      <div className="w-full max-w-5xl bg-[#10375C]/90 rounded-[2.5rem] mb-30 p-6 md:p-12 shadow-2xl relative flex-1">
        {/* STEP 1: Accordion / Rules */}
        {currentStep === 1 && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-8 border-b border-slate-700 pb-4 inline-block">
              Langkah Langkah dan Peraturan <br />
              <span className="text-slate-400">Dalam mengisi formulir</span>
            </h1>
            <Accordion type="single" collapsible defaultValue="item-1" className="w-full mb-8">
              <AccordionItem value="item-1" className="border-b-slate-700">
                <AccordionTrigger className="text-white hover:no-underline hover:text-yellow-400 text-lg px-4">Langkah-langkah</AccordionTrigger>
                <AccordionContent className="text-slate-300 px-4 text-justify leading-relaxed">
                  Pertama, baca panduan ini dulu. Kedua, isi nama Anda, nama atau nomor WA orang yang ingin ditemui, serta keperluan kunjungan. Ketiga, cek ulang semua data yang sudah diisi. Keempat,konfirmasi dan dapatkan QR code. Setelah
                  itu, tunjukkan QR code ke resepsionis.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2" className="border-b-slate-700">
                <AccordionTrigger className="text-white hover:no-underline hover:text-yellow-400 text-lg px-4">Peraturan</AccordionTrigger>
                <AccordionContent className="text-slate-300 px-4 text-justify leading-relaxed">
                  Harap isi data dengan jujur dan benar. Data Anda hanya dipakai untuk kunjungan hari ini dan privasi terjamin. Dilarang membawa barang terlarang seperti senjata atau narkotika. Jaga kebersihan dan ketenangan di area lobby.
                  Ikuti semua arahan dari resepsionis atau petugas.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3" className="border-b-slate-700 border-b-0">
                <AccordionTrigger className="text-white hover:no-underline hover:text-yellow-400 text-lg px-4">Butuh Bantuan?</AccordionTrigger>
                <AccordionContent className="text-slate-300 px-4 text-justify leading-relaxed">Kalau ada yang bingung atau kesulitan mengisi, langsung tanya resepsionis di meja depan. Mereka siap membantu kapan saja.</AccordionContent>
              </AccordionItem>
            </Accordion>
            <div className="flex justify-end">
              <Button onClick={handleNext} className="bg-white text-slate-900 hover:bg-slate-200 rounded-full px-8 font-bold">
                Lanjut <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {/* STEP 2: Form Inputs */}
        {currentStep === 2 && (
          <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-right-8 duration-500">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="nama" className="text-slate-300">
                  Nama/Instansi
                </Label>
                <Input id="nama" placeholder="Masukkan nama lengkap atau instansi" className="bg-white text-slate-900 border-none h-12 rounded-xl" value={formData.name} onChange={(e) => updateForm("name", e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="whatsapp" className="text-slate-300">
                  Nomor WhatsApp
                </Label>
                <Input id="whatsapp" placeholder="08xx xxxx xxxx" className="bg-white text-slate-900 border-none h-12 rounded-xl" value={formData.whatsapp} onChange={(e) => updateForm("whatsapp", formatPhoneNumber(e.target.value))} />
              </div>
              <div className="space-y-2">
                <Label className="text-slate-300">Tertuju</Label>
                <Select value={formData.to} onValueChange={(val) => updateForm("to", val)}>
                  <SelectTrigger className="bg-white text-slate-900 border-none h-12 rounded-xl">
                    <SelectValue placeholder="-- Pilih yang ingin dituju --" />
                  </SelectTrigger>
                  <SelectContent>
                    {recipients.length === 0 ? (
                      <SelectItem value="no-data" disabled>
                        Tidak ada data penerima tersedia
                      </SelectItem>
                    ) : (
                      recipients.map((recipient) => (
                        <SelectItem key={recipient.name} value={recipient.name}>
                          {recipient.name} ({recipient.position})
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="keperluan" className="text-slate-300">
                  Keperluan
                </Label>
                <Textarea id="keperluan" placeholder="Jelaskan keperluan Anda..." className="bg-white text-slate-900 border-none min-h-[80px] rounded-xl" value={formData.purpose} onChange={(e) => updateForm("purpose", e.target.value)} />
              </div>
            </div>

            <div className="flex justify-between mt-8">
              <Button onClick={handleBack} variant="secondary" className="bg-white text-slate-900 hover:bg-slate-200 rounded-full px-8 font-bold">
                <ChevronLeft className="mr-2 h-4 w-4" />
                Kembali
              </Button>
              <Button onClick={handleNext} className="bg-white text-slate-900 hover:bg-slate-200 rounded-full px-8 font-bold">
                Lanjut <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {/* STEP 3: Confirmation */}
        {currentStep === 3 && (
          <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-right-8 duration-500">
            <div className="space-y-4">
              <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                <Label className="text-slate-400 text-xs uppercase tracking-wider">Nama</Label>
                <p className="text-white text-lg font-medium">{formData.name || "-"}</p>
              </div>
              <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                <Label className="text-slate-400 text-xs uppercase tracking-wider">Nomor WhatsApp</Label>
                <p className="text-white text-lg font-medium">{formData.whatsapp || "-"}</p>
              </div>
              <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                <Label className="text-slate-400 text-xs uppercase tracking-wider">Tertuju Pada</Label>
                <p className="text-white text-lg font-medium capitalize">{formData.to.replace("-", " ") || "-"}</p>
              </div>
              <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                <Label className="text-slate-400 text-xs uppercase tracking-wider">Keperluan</Label>
                <p className="text-white text-lg font-medium">{formData.purpose || "-"}</p>
              </div>
            </div>

            <div className="flex justify-between mt-8">
              <Button onClick={handleBack} variant="secondary" className="bg-white text-slate-900 hover:bg-slate-200 rounded-full px-8 font-bold">
                <ChevronLeft className="mr-2 h-4 w-4" /> Kembali
              </Button>
              <Button onClick={handleSubmit} className="bg-white text-slate-900 hover:bg-slate-200 rounded-full px-8 font-bold">
                Konfirmasi <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {/* STEP 4: QR Code */}
        {currentStep === 4 && (
          <div className="flex flex-col items-center justify-center gap-8 animate-in fade-in zoom-in-95 duration-500 py-8">
            <div className="bg-white p-4 rounded-3xl shadow-2xl">
              {qrCodeUrl ? (
                <img src={qrCodeUrl} alt="QR Code" className="w-64 h-64" />
              ) : (
                <div className="w-64 h-64 flex items-center justify-center">
                  <QrIcon className="w-32 h-32 text-slate-900" />
                </div>
              )}
            </div>

            <div className="text-center">
              <h2 className="text-white text-xl font-bold mb-2">QR Code Berhasil Dibuat!</h2>
              <p className="text-slate-400 text-sm mb-2">Tunjukkan QR Code ini kepada petugas resepsionis</p>
              {formData.qrCode && <p className="text-slate-300 text-xs">ID: {formData.qrCode}</p>}
            </div>

            {qrCodeUrl && (
              <Button
                onClick={() => {
                  const link = document.createElement("a");
                  link.href = qrCodeUrl;
                  link.download = `qr-code-${formData.name || "tamu"}.png`;
                  link.click();
                }}
                className="w-full max-w-sm bg-white text-slate-900 hover:bg-slate-200 rounded-full h-12 font-bold text-lg shadow-lg">
                <Download className="mr-2 h-5 w-5" /> Unduh QR Code
              </Button>
            )}

            <div className="flex justify-start w-full mt-4">
              <Button onClick={() => setCurrentStep(1)} variant="secondary" className="bg-white text-slate-900 hover:bg-slate-200 rounded-full px-8 font-bold">
                <ChevronLeft className="mr-2 h-4 w-4" />
                Kembali
              </Button>
            </div>
          </div>
        )}
      </div>

      <Dock />
    </main>
  );
}
