"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Progress } from "@/components/ui/progress";

export const IntroLoader = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [progress, setProgress] = useState(0);

    useEffect(() => {

        const hasSeenIntro = sessionStorage.getItem("hasSeenIntro");



        const interval = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 100) {
                    clearInterval(interval);
                    return 100;
                }
                return prev + 2;
            });
        }, 60);

        const timer = setTimeout(() => {
            setIsLoading(false);
            sessionStorage.setItem("hasSeenIntro", "true");
        }, 2500);

        return () => {
            clearTimeout(timer);
            clearInterval(interval);
        }
    }, []);

    return (
        <AnimatePresence>
            {isLoading && (
                <motion.div
                    className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#facd15] overflow-hidden"
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                >
                    <div className="w-full max-w-sm px-8 mt-80">
                        <div className="relative">
                            {/* Moving Percentage Text */}
                            <motion.div
                                className="absolute -top-8 transform -translate-x-1/2"
                                style={{ left: `${progress}%` }}
                            >
                                <span className="text-white font-mono text-xl font-bold">
                                    {progress}%
                                </span>
                            </motion.div>

                            {/* Progress Bar Container */}
                            <div className="h-2 w-full bg-black/10 rounded-full overflow-hidden">
                                {/* White Progress Fill */}
                                <motion.div
                                    className="h-full bg-white rounded-full"
                                    initial={{ width: "0%" }}
                                    animate={{ width: `${progress}%` }}
                                    transition={{ ease: "linear", duration: 0.05 }} // Faster update to match interval
                                />
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
