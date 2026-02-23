"use client";

import { useEffect, useState } from "react";

export type ConsentState = {
    marketing: boolean;
};

const STORAGE_KEY = "tome-cookie-consent";

export function getStoredConsent(): ConsentState | null {
    if (typeof window === "undefined") return null;

    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        return raw ? JSON.parse(raw) : null;
    } catch {
        return null;
    }
}

export function setStoredConsent(consent: ConsentState) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(consent));
}

export function useCookieConsent() {
    const [consent, setConsent] = useState<ConsentState | null>(null);
    const [ready, setReady] = useState(false);

    useEffect(() => {
        const stored = getStoredConsent();
        (() => {
            setConsent(stored);
            setReady(true);
        })();
    }, []);

    const acceptAll = () => {
        const value = { marketing: true };
        setStoredConsent(value);
        setConsent(value);
    };

    const rejectAll = () => {
        const value = { marketing: false };
        setStoredConsent(value);
        setConsent(value);
    };

    return {
        consent,
        ready,
        acceptAll,
        rejectAll,
    };
}
