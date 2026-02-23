"use client";

import { ThemeProvider } from "next-themes";
import { Toaster } from "react-hot-toast";
import { CartProvider } from "@/contexts/CartContext";
import CookieBanner from "@/components/layout/cookie-banner";

const Providers: React.FC<React.PropsWithChildren> = ({ children }) => {
    return (
        <>
            <CookieBanner />
            <Toaster
                position="bottom-right"
                toastOptions={{
                    duration: 5000,
                    className:
                        "!bg-base-200 !text-base-content border border-neutral/20 !rounded-box shadow-lg !text-lg !px-3 !py-1.5",
                }}
            />
            <ThemeProvider
                enableSystem={false}
                attribute="data-theme"
                defaultTheme="light"
                storageKey="tome-theme"
                enableColorScheme
            >
                <CartProvider>{children}</CartProvider>
            </ThemeProvider>
        </>
    );
};

export default Providers;
