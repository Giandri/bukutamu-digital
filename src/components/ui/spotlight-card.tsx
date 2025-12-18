"use client";

import { useMotionTemplate, useMotionValue, motion } from "framer-motion";
import React, { MouseEvent } from "react";
import { cn } from "@/lib/utils";

export const SpotlightCard = ({
    children,
    className = "",
}: {
    children: React.ReactNode;
    className?: string;
}) => {
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    function handleMouseMove({ currentTarget, clientX, clientY }: MouseEvent) {
        const { left, top } = currentTarget.getBoundingClientRect();

        mouseX.set(clientX - left);
        mouseY.set(clientY - top);
    }

    return (
        <div
            className={cn(
                "group relative border border-white/40 bg-white/80 overflow-hidden rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300",
                className
            )}
            onMouseMove={handleMouseMove}
        >
            <motion.div
                className="pointer-events-none absolute -inset-px rounded-3xl opacity-0 transition duration-300 group-hover:opacity-100"
                style={{
                    background: useMotionTemplate`
            radial-gradient(
              650px circle at ${mouseX}px ${mouseY}px,
              rgba(16, 55, 92, 0.15),
              transparent 80%
            )
          `,
                }}
            />

            {/* Glossy Overlay */}
            <div className="absolute inset-0 z-0 bg-gradient-to-br from-white/40 to-transparent opacity-50 pointer-events-none" />

            <div className="relative h-full">{children}</div>
        </div>
    );
};
