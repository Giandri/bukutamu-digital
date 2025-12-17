"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import { Dock } from "@/components/Dock";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Edit, Trash2, Save, X, MessageCircle, Phone, MapPin, ArrowLeft } from "lucide-react";

interface Recipient {
  id: string;
  name: string;
  position: string;
  whatsapp?: string;
  isActive: boolean;
}

export default function RecipientsAdminPage() {
  const router = useRouter();
  const [recipients, setRecipients] = useState<Recipient[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    position: "",
    whatsapp: "",
  });

  useEffect(() => {
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

  const fetchRecipients = async () => {
    try {
      const response = await fetch("/api/recipients");
      const data = await response.json();
      setRecipients(data.recipients || []);
    } catch (error) {
      console.error("Error fetching recipients:", error);
      alert("Gagal mengambil data penerima");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const url = editingId ? `/api/recipients/${editingId}` : "/api/recipients";
      const method = editingId ? "PUT" : "POST";

      // Convert phone number to international format for backend
      const submitData = {
        ...formData,
        whatsapp: convertToInternational(formData.whatsapp),
      };

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submitData),
      });

      const data = await response.json();

      if (response.ok) {
        alert(data.success ? "Penerima berhasil disimpan!" : "Berhasil!");
        fetchRecipients();
        resetForm();
      } else {
        alert("Gagal menyimpan: " + (data.error || "Unknown error"));
      }
    } catch (error) {
      console.error("Error saving recipient:", error);
      alert("Terjadi kesalahan");
    }
  };

  const handleEdit = (recipient: Recipient) => {
    setFormData({
      name: recipient.name,
      position: recipient.position,
      whatsapp: formatPhoneNumber(recipient.whatsapp || ""),
    });
    setEditingId(recipient.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus penerima ini?")) return;

    try {
      const response = await fetch(`/api/recipients/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (response.ok) {
        alert("Penerima berhasil dinonaktifkan!");
        fetchRecipients();
      } else {
        alert("Gagal menghapus: " + (data.error || "Unknown error"));
      }
    } catch (error) {
      console.error("Error deleting recipient:", error);
      alert("Terjadi kesalahan");
    }
  };

  const resetForm = () => {
    setFormData({ name: "", position: "", whatsapp: "" });
    setEditingId(null);
    setShowForm(false);
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-[#facd15] flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#10375C] mx-auto mb-4"></div>
            <p className="text-[#10375C] font-semibold">Memuat...</p>
          </div>
        </div>
        <Dock />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#facd15] flex flex-col">
      <Header />
      <div className="flex-1 p-4 sm:p-6 md:p-8">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <div className="mb-4">
            <Button variant="ghost" size="sm" onClick={() => router.back()} className="text-[#10375C] hover:bg-[#10375C]/10 p-2">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Kembali
            </Button>
          </div>

          <div className="mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-[#10375C] mb-2">Daftar Tertuju</h1>
            <p className="text-slate-600">Tambah, edit, atau hapus data orang yang bisa dituju tamu</p>
          </div>

          {/* Add New Button */}
          <div className="mb-6">
            <Button onClick={() => setShowForm(!showForm)} className="bg-[#10375C] hover:bg-[#10375C]/90 text-white">
              <Plus className="w-4 h-4 mr-2" />
              {showForm ? "Batal" : "Tambah Tertuju"}
            </Button>
          </div>

          {/* Form */}
          {showForm && (
            <Card className="mb-6 bg-[#10375C]/90">
              <CardHeader>
                <CardTitle className="text-[#F4F6FF]">{editingId ? "Edit Penerima" : "Tambah Penerima Baru"}</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nama</Label>
                      <Input id="name" value={formData.name} onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))} placeholder="Masukkan nama" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="position">Jabatan</Label>
                      <Input id="position" value={formData.position} onChange={(e) => setFormData((prev) => ({ ...prev, position: e.target.value }))} placeholder="Masukkan jabatan" required />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="whatsapp">Nomor WhatsApp</Label>
                    <Input id="whatsapp" value={formData.whatsapp} onChange={(e) => setFormData((prev) => ({ ...prev, whatsapp: formatPhoneNumber(e.target.value) }))} placeholder="08xxxxxxxxxx" />
                  </div>
                  <div className="flex gap-2">
                    <Button type="submit" className="text-[#F4F6FF] bg-[#10375C] hover:bg-[#10375C]/90 ">
                      <Save className="w-4 h-4 mr-2" />
                      {editingId ? "Update" : "Simpan"}
                    </Button>
                    <Button type="button" variant="outline" onClick={resetForm}>
                      <X className="w-4 h-4 mr-2" />
                      Batal
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {/* Recipients List */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {recipients.length === 0 ? (
              <div className="col-span-full">
                <Card>
                  <CardContent className="p-8 text-center">
                    <p className="text-slate-500 mb-4">Belum ada data penerima</p>
                    <Button onClick={() => setShowForm(true)} className="bg-[#10375C] hover:bg-[#10375C]/90">
                      <Plus className="w-4 h-4 mr-2" />
                      Tambah Tertuju
                    </Button>
                  </CardContent>
                </Card>
              </div>
            ) : (
              recipients.map((recipient) => (
                <Card key={recipient.id} className="overflow-hidden hover:shadow-xl transition-shadow duration-300">
                  <CardContent className="p-6">
                    <div className="flex flex-col items-center text-center space-y-4">
                      {/* Nama & Jabatan */}
                      <div>
                        <h3 className="font-bold text-lg text-[#10375C]">{recipient.name}</h3>
                        <p className="text-sm text-gray-600">{recipient.position || "-"}</p>
                      </div>

                      {/* Phone */}
                      {recipient.whatsapp ? (
                        <div className="flex items-center gap-2 text-gray-700">
                          <Phone className="w-4 h-4" />
                          <span className="text-sm">{recipient.whatsapp}</span>
                        </div>
                      ) : (
                        <p className="text-sm text-gray-400">No. WA belum diisi</p>
                      )}
                      {/* Tombol WhatsApp Hijau Gede */}
                      {recipient.whatsapp && (
                        <a href={`https://wa.me/${recipient.whatsapp.replace(/[^0-9]/g, "")}`} target="_blank" rel="noopener noreferrer" className="w-full mt-4">
                          <Button className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-full flex items-center justify-center gap-2">
                            <MessageCircle className="w-5 h-5" />
                            Hubungi via WhatsApp
                          </Button>
                        </a>
                      )}

                      {/* Tombol Edit & Delete kecil di bawah */}
                      <div className="flex gap-3 mt-4 w-full">
                        <Button size="sm" variant="outline" className="flex-1" onClick={() => handleEdit(recipient)}>
                          <Edit className="w-4 h-4 mr-1" />
                          Edit
                        </Button>
                        <Button size="sm" variant="destructive" className="flex-1" onClick={() => handleDelete(recipient.id)}>
                          <Trash2 className="w-4 h-4 mr-1" />
                          Hapus
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>
      <Dock />
    </main>
  );
}
