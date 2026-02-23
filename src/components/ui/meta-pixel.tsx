"use client";

import Script from "next/script";

export const MetaPixel: React.FC = () => {
    return (
        <Script id="meta-pixel" strategy="afterInteractive">
            {`

            `}
        </Script>
    );
};
