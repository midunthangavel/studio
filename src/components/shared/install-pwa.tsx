
'use client';

import { Button } from "@/components/ui/button";
import { usePWAInstall } from "@/hooks/use-pwa-install";
import { Download, X } from "lucide-react";
import { AppLogo } from "./app-logo";
import { AnimatePresence, motion } from "framer-motion";

export function InstallPWA() {
    const { canInstall, install, isInstalled, dismiss } = usePWAInstall();

    if (!canInstall || isInstalled) {
        return null;
    }

    return (
        <AnimatePresence>
            <motion.div
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="fixed bottom-0 left-0 right-0 z-50 p-3 md:bottom-4 md:left-auto md:right-4 md:w-96"
            >
                <div className="bg-card border shadow-lg rounded-xl p-3 flex items-center gap-3">
                    <button onClick={dismiss} className="absolute top-1 right-1 text-muted-foreground hover:text-foreground">
                        <X className="w-3.5 h-3.5" />
                    </button>
                    <div className="bg-muted p-2 rounded-lg">
                        <AppLogo width={60} height={15} />
                    </div>
                    <div className="flex-1">
                        <p className="font-semibold text-sm">Install the App</p>
                        <p className="text-xs text-muted-foreground">Get the full experience on your device.</p>
                    </div>
                    <Button size="sm" onClick={install}>
                        <Download className="mr-1.5" />
                        Install
                    </Button>
                </div>
            </motion.div>
        </AnimatePresence>
    );
}
