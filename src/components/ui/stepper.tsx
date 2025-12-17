"use client"

import * as React from "react"
import { Check } from "lucide-react"

import { cn } from "@/lib/utils"

interface StepperProps {
    steps: {
        id: number
        label: string
    }[]
    currentStep: number
    className?: string
}

export function Stepper({ steps, currentStep, className }: StepperProps) {
    return (
        <div className={cn("relative flex w-full items-center justify-between", className)}>
            {/* Connecting Line */}
            <div className="absolute left-0 top-1/2 h-[2px] w-full -translate-y-1/2 bg-white" />

            {steps.map((step) => {
                const isActive = step.id === currentStep
                const isCompleted = step.id < currentStep

                return (
                    <div key={step.id} className="relative z-10 flex flex-col items-center gap-2  px-2">
                        <div
                            className={cn(
                                "flex h-10 w-10 items-center justify-center rounded-full border-2 text-sm font-bold transition-colors duration-200",
                                isActive
                                    ? "border-primary bg-primary text-[#10375C]"
                                    : isCompleted
                                        ? "border-primary bg-primary text-primary-foreground"
                                        : "border-muted-foreground/30 bg-white text-muted-foreground"
                            )}
                        >
                            {isCompleted ? <Check className="h-5 w-5" /> : step.id}
                        </div>
                        <span
                            className={cn(
                                "absolute top-11 w-32 text-center text-[10px] font-medium transition-colors duration-200",
                                isActive ? "text-white" : "text-muted-foreground"
                            )}
                        >
                            {step.label}
                        </span>
                    </div>
                )
            })}
        </div>
    )
}
