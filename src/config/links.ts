import { useTranslations } from "next-intl";
import { Home, Compass } from "lucide-react";

export const useGetLinks = () => {
    const t = useTranslations("links");
    return [
        {
            title: t("home"),
            path: "/",
            icon: Home,
        },
        {
            title: t("explore"),
            path: "/explore",
            icon: Compass,
        },
    ];
};

export const useGetFooterLinks = () => {
    const t = useTranslations("links");
    return [
        {
            title: t("home"),
            path: "/",
        },
        {
            title: t("explore"),
            path: "/explore",
        },
        {
            title: t("contact"),
            path: "/contact",
        },
        {
            title: t("privacy"),
            path: "/privacy",
        },
        {
            title: t("terms"),
            path: "/terms",
        },
    ];
};
