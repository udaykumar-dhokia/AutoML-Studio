"use client";

import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const steps = [
    "Provisioning resources",
    "Allocating container",
    "Pulling docker image",
    "Configuring network",
    "Starting services",
    "Finalizing setup",
];

export const ContainerStartupProgress = () => {
    const [currentStep, setCurrentStep] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentStep((prev) => (prev < steps.length - 1 ? prev + 1 : prev));
        }, 3000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="flex items-center gap-2 min-w-[180px]">
            <Loader2 className="h-4 w-4 animate-spin text-primary" />
            <div className="flex flex-col overflow-hidden h-5 justify-center">
                <AnimatePresence mode="wait">
                    <motion.span
                        key={currentStep}
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -20, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="text-xs font-medium text-muted-foreground whitespace-nowrap"
                    >
                        {steps[currentStep]}...
                    </motion.span>
                </AnimatePresence>
            </div>
        </div>
    );
};
