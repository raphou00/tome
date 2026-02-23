"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { AnimatePresence, motion } from "framer-motion";
import { Cookie } from "lucide-react";
import { useCookieConsent } from "@/hook/use-cookie-consent";
import { MetaPixel } from "@/components/ui/meta-pixel";
import Title from "@/components/ui/title";

const CookieBanner: React.FC = () => {
    const t = useTranslations("common.cookies");
    const { consent, ready, acceptAll, rejectAll } = useCookieConsent();

    if (consent && consent.marketing) return <MetaPixel />;
    if (!ready || consent !== null) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed left-0 bottom-0 z-100 p-4 md:p-6 lg:p-8 xl:p-12"
            >
                <motion.div
                    initial={{ scale: 0, rotate: "12.5deg" }}
                    animate={{ scale: 1, rotate: "0deg" }}
                    exit={{ scale: 0, rotate: "0deg" }}
                    onClick={(e) => e.stopPropagation()}
                    className="bg-base-200 p-4 rounded-box w-full max-w-lg shadow-xl cursor-default relative overflow-hidden"
                >
                    <div className="relative z-10">
                        <Cookie className="size-10 text-primary mb-2" />
                        <Title text={t("title")} />
                        <p className="text-left mb-6">
                            {t.rich("description", {
                                link: (chunk) => (
                                    <Link href="/cookies" className="link">
                                        {chunk}
                                    </Link>
                                ),
                            })}
                        </p>
                        <div className="w-full flex justify-end gap-2">
                            <button onClick={rejectAll} className="btn">
                                {t("reject")}
                            </button>
                            <button
                                onClick={acceptAll}
                                className="btn btn-primary"
                            >
                                {t("accept")}
                            </button>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default CookieBanner;
