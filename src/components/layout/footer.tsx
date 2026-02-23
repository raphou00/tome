import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { title } from "@/config/seo";
import Logo from "@/components/ui/logo";
import LogoText from "@/components/ui/logo-text";
import env from "@/lib/env";

const Footer: React.FC = async () => {
    const t = await getTranslations();

    const links = [
        {
            title: t("links.contact"),
            path: "mailto:" + env.SENDER_EMAIL,
        },
        {
            title: t("links.privacy"),
            path: "/privacy",
        },
        {
            title: t("links.terms"),
            path: "/terms",
        },
        {
            title: t("links.refund"),
            path: "/refund",
        },
        {
            title: t("links.cookies"),
            path: "/cookies",
        },
    ];

    return (
        <footer className="w-full mx-auto max-w-8xl px-4 md:px-6 lg:px-8 xl:px-12 my-10 space-y-8">
            <div className="w-full grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Link
                    href="/"
                    className="flex items-center max-lg:justify-center"
                >
                    <Logo className="h-13 mr-1" />
                    <LogoText />
                </Link>

                <div className="w-full flex flex-wrap items-center justify-center gap-x-6">
                    {links.map((link) => (
                        <Link
                            key={link.path}
                            href={link.path}
                            rel="noreferrer"
                            className="link link-hover"
                        >
                            {link.title}
                        </Link>
                    ))}
                </div>

                <div className="flex items-center justify-end max-lg:justify-center">
                    {t("common.made-with")}
                </div>
            </div>

            <div className="w-full text-center text-sm text-neutral">
                &copy; {new Date().getFullYear()} {title}.{" "}
                {t("common.copyright")}.
            </div>
        </footer>
    );
};

export default Footer;

// <div className="w-full flex flex-col items-center justify-center">
//     <div className="flex items-center gap-4">
//         <Link href="https://www.facebook.com/" target="_blank">
//             <Image
//                 src="/images/icons/facebook.png"
//                 alt=""
//                 width={256}
//                 height={256}
//                 className="size-8"
//             />
//         </Link>
//         <Link href="https://www.instagram.com/" target="_blank">
//             <Image
//                 src="/images/icons/instagram.png"
//                 alt=""
//                 width={256}
//                 height={256}
//                 className="size-8"
//             />
//         </Link>
//         <Link href="https://www.tiktok.com/" target="_blank">
//             <Image
//                 src="/images/icons/tiktok.png"
//                 alt=""
//                 width={256}
//                 height={256}
//                 className="size-8"
//             />
//         </Link>
//     </div>
// </div>
