"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { User } from "lucia";
import { useLocale, useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import {
    LogIn,
    LogOut,
    Menu,
    Moon,
    PenBox,
    ShoppingBag,
    Sun,
    UserIcon,
    X,
} from "lucide-react";
import { cn, formatAmountForDisplay, requestAPI } from "@/lib/utils";
import { useCart } from "@/contexts/CartContext";
import Logo from "@/components/ui/logo";
import LogoText from "@/components/ui/logo-text";
import LocaleModal from "@/components/ui/locale-modal";

type HeaderProps = {
    user: User | null;
    children: React.ReactNode;
};

const Header: React.FC<HeaderProps> = ({ user, children }) => {
    const t = useTranslations("links");
    const [localeOpen, setLocaleOpen] = useState<boolean>(false);
    const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
    const router = useRouter();
    const pathname = usePathname();
    const locale = useLocale();
    const { setTheme } = useTheme();
    const { state } = useCart();

    const links = [
        {
            title: t("explore"),
            path: "/explore",
        },
        {
            title: t("library"),
            path: "/library",
        },
    ];

    const handleLogout = async () => {
        await requestAPI("GET", "/api/auth/logout");
        router.refresh();
    };

    const toggleTheme = () => {
        setTheme((e) => (e === "dark" ? "light" : "dark"));
    };

    useEffect(() => {
        if (drawerOpen) {
            document.documentElement.style.overflow = "hidden";
        } else {
            document.documentElement.style.overflow = "auto";
        }
    }, [drawerOpen]);

    return (
        <>
            <div className="drawer">
                <input
                    id="drawer"
                    type="checkbox"
                    className="drawer-toggle"
                    checked={drawerOpen}
                    onChange={(e) => setDrawerOpen(e.target.checked)}
                />
                <div className="drawer-content">
                    <header className="fixed top-0 z-90 w-full bg-base-100">
                        <div className="navbar min-h-14 py-0 mx-auto max-w-8xl w-full px-4 md:px-6 lg:px-8 xl:px-12">
                            <div className="navbar-start space-x-2">
                                <label
                                    htmlFor="drawer"
                                    role="button"
                                    className="flex flex-col items-start justify-center gap-y-1 cursor-pointer lg:hidden"
                                >
                                    <Menu className="size-8" />
                                </label>
                                <Link
                                    href="/"
                                    className="flex items-center gap-x-2 max-lg:hidden"
                                >
                                    <Logo className="h-9" />
                                    <LogoText className="max-sm:hidden" />
                                </Link>
                                <ul className="ml-4 flex gap-x-2 max-lg:hidden">
                                    {links.map((item) => (
                                        <li key={item.title}>
                                            <Link
                                                href={item.path}
                                                className={cn(
                                                    "btn btn-outline h-9"
                                                )}
                                            >
                                                <span className="">
                                                    {item.title}
                                                </span>
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="navbar-center lg:hidden">
                                <Link href="/" className="flex items-center">
                                    <Logo className="h-10" />
                                </Link>
                            </div>
                            <div className="navbar-end space-x-2">
                                <div className="indicator">
                                    <span className="indicator-item top-1 right-1 badge badge-primary size-5! p-px text-xs">
                                        {state.itemCount}
                                    </span>
                                    <Link
                                        href="/cart"
                                        className="btn max-lg:btn-square btn-outline"
                                    >
                                        <ShoppingBag />
                                        <span className="max-lg:hidden">
                                            {formatAmountForDisplay(
                                                state.total
                                            )}
                                        </span>
                                    </Link>
                                </div>
                                <div className="dropdown dropdown-end dropdown-bottom dropdown-hover flex items-center h-10 z-100">
                                    <div
                                        role="button"
                                        tabIndex={0}
                                        className="btn max-lg:btn-square btn-primary"
                                    >
                                        <UserIcon />
                                        <span className="max-lg:hidden">
                                            {t("account")}
                                        </span>
                                    </div>
                                    <div
                                        tabIndex={0}
                                        className="dropdown-content pt-2.5 z-1"
                                    >
                                        <div className="relative rounded-box bg-base-100 p-2 border border-neutral/20 shadow-xl w-72 max-[900px]:w-[calc(100vw-32px)] z-100">
                                            {user ?
                                                <>
                                                    <a
                                                        href="/account"
                                                        className="btn btn-ghost rounded-field border-none m-0 my-px w-full justify-start"
                                                    >
                                                        <span className="flex items-center gap-2">
                                                            <UserIcon className="size-6" />
                                                            {t("account")}
                                                        </span>
                                                    </a>
                                                </>
                                            :   <>
                                                    <a
                                                        href={`/login?redirect=${pathname}`}
                                                        className="btn btn-ghost rounded-field border-none m-0 my-px w-full justify-start"
                                                    >
                                                        <span className="flex items-center gap-2">
                                                            <LogIn className="size-6" />
                                                            {t("login")}
                                                        </span>
                                                    </a>

                                                    <a
                                                        href={`/register?redirect=${pathname}`}
                                                        className="btn btn-ghost rounded-field border-none m-0 my-px w-full justify-start"
                                                    >
                                                        <span className="flex items-center gap-2">
                                                            <PenBox className="size-6" />
                                                            {t("register")}
                                                        </span>
                                                    </a>
                                                </>
                                            }

                                            <div className="divider mx-auto my-px w-full px-3" />

                                            <button
                                                onClick={toggleTheme}
                                                className="btn btn-ghost rounded-field border-none m-0 my-px w-full justify-start"
                                            >
                                                <div className="swap swap-rotate dark:swap-active">
                                                    <Moon className="swap-on size-6" />
                                                    <Sun className="swap-off size-6" />
                                                </div>
                                                {t("theme")}
                                            </button>

                                            <button
                                                onClick={() =>
                                                    setLocaleOpen(true)
                                                }
                                                className="btn btn-ghost rounded-field border-none m-0 my-px w-full justify-start"
                                            >
                                                <Image
                                                    src={`/images/locales/${locale}.png`}
                                                    alt={locale}
                                                    width={32}
                                                    height={32}
                                                    className="size-6"
                                                />
                                                <span className="uppercase">
                                                    {locale}
                                                </span>
                                            </button>

                                            {user && (
                                                <>
                                                    <div className="divider mx-auto my-px w-full px-3" />

                                                    <button
                                                        onClick={handleLogout}
                                                        className="btn btn-ghost rounded-field border-none m-0 my-px w-full justify-start"
                                                    >
                                                        <span className="flex items-center gap-2">
                                                            <LogOut className="size-6" />
                                                            {t("logout")}
                                                        </span>
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </header>
                    {children}
                </div>
                <div className="drawer-side z-100">
                    <label htmlFor="drawer" className="drawer-overlay" />
                    <ul className="bg-base-200 min-h-dvh w-screen p-4">
                        <div className="w-full flex items-center justify-between mb-4">
                            <Link
                                onClick={() => setDrawerOpen(false)}
                                href="/"
                                className="flex items-center"
                            >
                                <Logo className="h-8 mr-1" />
                                <LogoText />
                            </Link>
                            <button
                                className="btn btn-square btn-ghost"
                                onClick={() => setDrawerOpen(false)}
                            >
                                <X />
                            </button>
                        </div>
                        <div className="space-y-2">
                            {links.map((item) => (
                                <li key={item.title} className="w-full">
                                    <Link
                                        onClick={() => setDrawerOpen(false)}
                                        href={item.path}
                                        className={cn(
                                            "btn btn-lg btn-outline justify-start w-full border-non text-base",
                                            pathname === item.path ? "" : ""
                                        )}
                                    >
                                        {item.title}
                                    </Link>
                                </li>
                            ))}
                        </div>
                    </ul>
                </div>
            </div>

            <LocaleModal open={localeOpen} setOpen={setLocaleOpen} />
        </>
    );
};

export default Header;
