"use client";
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

import { Skeleton } from "@/components/ui/skeleton";

const Header = () => {
    const [time, setTime] = useState(new Date());
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const timer = setInterval(() => {
            setTime(new Date());
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    // Skeleton loading state
    if (!mounted) {
        return (
            <header className="flex w-full items-center justify-between px-4 py-3 md:px-8 md:py-4 bg-white shadow-sm border-b border-gray-100 z-10 relative rounded-br-[2rem] md:rounded-br-[3rem]">
                <div className="flex items-center gap-2 md:gap-4">
                    {/* Logos Skeleton */}
                    <div className="flex items-center gap-2">
                        <Skeleton className="h-[30px] w-[120px] md:h-[42px] md:w-[170px] rounded-lg" />
                    </div>
                    <div className="flex items-center gap-2">
                        <Skeleton className="h-[35px] w-[35px] md:h-[50px] md:w-[50px] rounded-full" />
                    </div>
                </div>
                <div className="flex flex-col items-end gap-1 md:gap-2">
                    {/* Date/Time Skeleton */}
                    <Skeleton className="h-4 w-32 md:h-6 md:w-48" />
                    <Skeleton className="h-5 w-24 md:h-7 md:w-32" />
                </div>
            </header>
        );
    }

    return (
        <header className="flex w-full items-center justify-between px-4 py-3 md:px-8 md:py-4 bg-white shadow-sm border-b border-gray-100 z-10 relative rounded-br-[2rem] md:rounded-br-[3rem]">
            {/* Left: Logos */}
            <div className="flex items-center gap-2 md:gap-4">
                {/* KEMENPU Logo */}
                <div className="flex items-center gap-2">
                    <Image src="/images/kemenpu.png" alt="PU Logo" width={170} height={170} className="w-[120px] md:w-[170px] h-auto" priority />
                </div>

                {/* BWS Logo */}
                <div className="flex items-center gap-2">
                    <Image src="/images/bws.jpg" alt="BWS Logo" width={50} height={50} className="w-[35px] md:w-[50px] h-auto" />
                </div>
            </div>

            {/* Right: Date and Time */}
            <div className="text-right text-[#10375C]">
                <div className="font-bold text-xs md:text-lg font-poppins">
                    {format(time, "eeee, d MMMM yyyy", { locale: id })}
                </div>
                <div className="font-bold text-sm md:text-xl font-poppins">
                    {format(time, "hh:mm:ss a")}
                </div>
            </div>
        </header>
    );
};

export default Header;
