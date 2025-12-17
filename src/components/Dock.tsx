"use client";
import React, { useState } from "react";
import { MotionValue, motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Home, ShieldUser, FilePen } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";

import { usePathname } from "next/navigation";

export const Dock = () => {
    let mouseX = useMotionValue(Infinity);
    const [mounted, setMounted] = useState(false);
    const pathname = usePathname();

    React.useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return (
            <div className="fixed bottom-6 md:bottom-10 left-1/2 -translate-x-1/2 z-50">
                <div className="mx-auto flex h-16 items-end gap-6 md:gap-10 rounded-full bg-[#10375C/80] px-4 pb-3">
                    <Skeleton className="h-10 w-10 rounded-full bg-white/20" />
                    <Skeleton className="h-10 w-10 rounded-full bg-white/20" />
                    <Skeleton className="h-10 w-10 rounded-full bg-white/20" />
                </div>
            </div>
        );
    }

    return (
        <div className="fixed bottom-6 md:bottom-10 left-1/2 -translate-x-1/2 z-50">
            <motion.div
                onMouseMove={(e) => mouseX.set(e.pageX)}
                onMouseLeave={() => mouseX.set(Infinity)}
                className="mx-auto flex h-16 items-end gap-6 md:gap-10 rounded-full bg-[#10375C]/80 px-4 pb-3"
            >
                <DockIcon mouseX={mouseX} icon={<Home size={24} />} label="Home" href="/" active={pathname === "/"} />
                <DockIcon mouseX={mouseX} icon={<FilePen size={24} />} label="Isi Tamu" href="/form" active={pathname === "/form"} />
                <DockIcon mouseX={mouseX} icon={<ShieldUser size={24} />} label="Dashboard" href="/dashboard" active={pathname === "/dashboard" || pathname.startsWith("/dashboard/menu")} />
            </motion.div>
        </div>
    );
};

function DockIcon({
    mouseX,
    icon,
    label,
    href,
    active = false,
}: {
    mouseX: MotionValue;
    icon: React.ReactNode;
    label: string;
    href: string;
    active?: boolean;
}) {
    let ref = React.useRef<HTMLDivElement>(null);

    let distance = useTransform(mouseX, (val) => {
        let bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
        return val - bounds.x - bounds.width / 2;
    });

    let widthSync = useTransform(distance, [-150, 0, 150], [40, 60, 40]); // Size range
    let width = useSpring(widthSync, { mass: 0.1, stiffness: 150, damping: 12 });

    return (
        <Link href={href}>
            <motion.div
                ref={ref}
                style={{ width }}
                className={cn(
                    "aspect-square w-10 cursor-pointer rounded-full flex items-center justify-center transition-colors",
                    active ? "bg-yellow-400 text-blue-900" : "bg-transparent text-white hover:bg-white/20"
                )}
            >
                {icon}
            </motion.div>
        </Link>
    );
}
