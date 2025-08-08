
'use client';

import { useState, useEffect } from 'react';

// Define the event interface for browsers that support it.
interface BeforeInstallPromptEvent extends Event {
  readonly platforms: Array<string>;
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

const PWA_PROMPT_DISMISSED_KEY = 'pwa_prompt_dismissed';

export function usePWAInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [canInstall, setCanInstall] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    // Check if the prompt has been dismissed before
    const dismissed = sessionStorage.getItem(PWA_PROMPT_DISMISSED_KEY);
    if (dismissed) {
      setIsDismissed(true);
    }

    // Check if the app is already installed
    if (typeof window !== "undefined" && window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
      setCanInstall(false);
      return;
    }
    
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      if(!isInstalled) {
        setCanInstall(true);
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setCanInstall(false);
      setDeferredPrompt(null);
    };
    
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, [isInstalled]);

  const install = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        console.log('User accepted the PWA installation.');
      } else {
        console.log('User dismissed the PWA installation.');
      }
      setDeferredPrompt(null);
      setCanInstall(false);
    }
  };

  const dismiss = () => {
    setCanInstall(false);
    sessionStorage.setItem(PWA_PROMPT_DISMISSED_KEY, 'true');
  };
  
  return { canInstall: canInstall && !isDismissed, install, isInstalled, dismiss };
}
