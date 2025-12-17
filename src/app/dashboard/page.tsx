"use client";

import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dock } from "@/components/Dock";
import Header from "@/components/Header";

export default function LoginReception() {
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password }),
      });

      if (res.ok) {
        setTimeout(() => {
          window.location.href = "/dashboard/menu";
        }, 500);
      } else {
        alert("Password salah! Coba lagi deh.");
        setPassword("");
      }
    } catch (error) {
      console.error("Error login:", error);
      alert("Ada masalah nih, coba lagi ya.");
    }
  };

  return (
    <main className="flex min-h-screen flex-col bg-[#facd15] overflow-x-hidden">
      <Header />
      <div className="flex flex-1 flex-col items-center justify-center px-4 pb-24">
        {/* Central Login Card */}
        <Card className="w-full max-w-md bg-[#10375C]/90 border-none shadow-2xl rounded-3xl">
          <CardContent className="p-8 md:p-12 flex flex-col items-center gap-6 md:gap-8">
            <h1 className="text-white font-bold text-lg md:text-xl tracking-wide uppercase text-center">RUANG RESEPSIONIS</h1>

            <form onSubmit={handleLogin} className="w-full flex flex-col gap-5 md:gap-6 items-center">
              <div className="relative w-full">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Masukan Password"
                  className="bg-white text-slate-900 placeholder:text-slate-500 border-none rounded-full py-5 px-6 pr-12 text-sm md:text-base focus-visible:ring-0 focus-visible:ring-offset-0"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button type="button" onClick={togglePasswordVisibility} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700 transition-colors">
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>

              <Button type="submit" className="bg-white text-slate-900 hover:bg-slate-200 rounded-full px-8 py-3 md:px-12 md:py-4 font-bold text-sm md:text-base shadow-lg transition-transform active:scale-95">
                Masuk
              </Button>
            </form>
          </CardContent>
        </Card>

        <Dock />
      </div>
    </main>
  );
}
