import { type NextRequest, NextResponse } from "next/server";
import { getTranslations } from "next-intl/server";
import { stripe } from "@/lib/stripe";
import db from "@/lib/db";
import { checkRateLimit, ratelimitPost } from "@/lib/rate-limiter";

export const GET = async (req: NextRequest) => {
    const t = await getTranslations({
        locale: req.cookies.get("NEXT_LOCALE")?.value || "en",
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

        const searchParams = req.nextUrl.searchParams;
        const sessionId = searchParams.get("session_id");

        if (!sessionId) {
            return NextResponse.redirect(new URL("/", req.url));
        }

        const session = await stripe.checkout.sessions.retrieve(sessionId, {
            expand: ["customer"],
        });

        if (!session.customer || typeof session.customer === "string") {
            return NextResponse.redirect(new URL("/error?error=400", req.url));
        }

        const customerId = session.customer.id;
        const userId = session.client_reference_id;
        const user = await db.user.findUnique({
            where: {
                id: userId || undefined,
            },
        });
        if (!user) {
            return NextResponse.redirect(new URL("/error?error=400", req.url));
        }

        await db.user.update({
            where: {
                id: user.id,
            },
            data: {
                stripeCustomerId: customerId,
            },
        });

        return NextResponse.redirect(new URL("/", req.url)); // TODO: redirect to product
    } catch (err) {
        console.error(err);
        return NextResponse.json({
            success: false,
            message: t("messages.server-error"),
        });
    }
};
