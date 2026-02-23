import { type NextRequest, NextResponse } from "next/server";
import { getTranslations } from "next-intl/server";
import { stripe } from "@/lib/stripe";
import { getUser } from "@/lib/auth";
import db from "@/lib/db";
import env from "@/lib/env";
import type { Locale } from "@/lib/types";
import { checkRateLimit, ratelimitPost } from "@/lib/rate-limiter";

export const GET = async (req: NextRequest) => {
    const locale = req.cookies.get("NEXT_LOCALE")?.value || ("en" as Locale);
    const t = await getTranslations({
        locale,
    });
    try {
        const identifier = req.headers.get("x-forwarded-for");

        if (!identifier) {
            return NextResponse.json({
                redirect: new URL("/error?error=403", req.url),
            });
        }

        const { allowed } = await checkRateLimit(identifier, ratelimitPost);
        if (!allowed) {
            return NextResponse.json({
                redirect: new URL("/error?error=429", req.url),
            });
        }

        const user = await getUser();

        if (!user || !user.user) {
            return NextResponse.json({
                redirect: "/login",
            });
        }

        const cartItems = await db.cart.findMany({
            where: {
                userId: user.user.id,
            },
            include: {
                book: true,
            },
        });

        if (cartItems.length === 0) {
            return NextResponse.json({
                redirect: "/error?error=400",
            });
        }

        const lineItems = cartItems.map((item) => ({
            price_data: {
                currency: "usd",
                unit_amount: Math.round(item.book.price * 100),
                product_data: {
                    name: item.book.title,
                    images: [item.book.cover],
                },
            },
            quantity: item.quantity,
        }));

        const bookIds = cartItems.map((item) => item.bookId).join(",");

        const session = await stripe.checkout.sessions.create({
            line_items: lineItems,
            mode: "payment",
            success_url: `${env.APP_URL}/library?success=true`,
            cancel_url: `${env.APP_URL}/cart`,
            locale: locale as Locale,
            customer: user.user.stripeCustomerId || undefined,
            client_reference_id: user.user.id,
            metadata: {
                userId: user.user.id,
                bookIds: bookIds,
            },
        });

        return NextResponse.json({
            redirect: session.url,
        });
    } catch (err) {
        console.error(err);
        return NextResponse.json({
            success: false,
            message: t("messages.server-error"),
        });
    }
};
