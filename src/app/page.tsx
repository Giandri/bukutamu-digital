import Header from "@/components/Header";
import { Dock } from "@/components/Dock";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col bg-[#facd15]">
      {/* Top Header */}
      <Header />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col items-center justify-center w-full relative overflow-hidden">

        <div className="flex flex-col items-center text-center z-0 -mt-20">
          {/* Selamat Datang - Script Font */}
          <h1 className="font-pacifico text-6xl md:text-8xl text-white drop-shadow-md mb-2">
            Selamat Datang
          </h1>

          {/* Di Buku Tamu Digital - Bold Sans */}
          <h2 className="font-poppins font-black text-4xl md:text-5xl text-[#10375C] leading-tight">
            Di Buku Tamu Digital
          </h2>

          {/* BWS BABEL - Bold Sans */}
          <h3 className="font-poppins font-black text-2xl md:text-3xl text-[#10375C] ">
            BWS BABEL
          </h3>
        </div>

        {/* Dock at the bottom */}
        <Dock />
      </div>
    </main>
  );
}
