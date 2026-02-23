import { getTranslations } from "next-intl/server";
import Stripe from "stripe";
import type { User } from "@/lib/types";
import { title } from "@/config/seo";
import env from "./env";
import db from "./db";
import sendEmail from "./email";
import Receipt from "@/components/emails/receipt";
import { getPresignedUrl } from "./file";

export const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
    apiVersion: "2025-10-29.clover",
    appInfo: {
        name: title,
        url: env.APP_URL,
    },
});

export const handleCheckout = async (
    session: Stripe.Checkout.Session,
    user: User
) => {
    const t = await getTranslations({ locale: user.locale });

    const bookIds = session.metadata?.bookIds?.split(",") || [];
    const userId = user.id;

    const order = await db.order.create({
        data: {
            userId: userId,
            status: "PAID",
            subtotal: session.amount_subtotal || 0,
            tax: 0,
            total: session.amount_total || 0,
            stripeSessionId: session.id,
        },
    });

    for (const bookId of bookIds) {
        const book = await db.book.findUnique({
            where: { id: bookId },
        });

        if (book) {
            await db.orderItem.create({
                data: {
                    orderId: order.id,
                    bookId: bookId,
                    quantity: 1,
                    price: Math.round(book.price * 100),
                },
            });

            await db.purchasedBook.upsert({
                where: {
                    userId_bookId: {
                        userId: userId,
                        bookId: bookId,
                    },
                },
                create: {
                    userId: userId,
                    bookId: bookId,
                    orderId: order.id,
                },
                update: {
                    orderId: order.id,
                },
            });
        }
    }

    await db.cart.deleteMany({
        where: {
            userId: userId,
        },
    });

    const extandedDession = await stripe.checkout.sessions.retrieve(
        session.id,
        { expand: ["payment_intent.latest_charge"] }
    );

    const charge = (extandedDession.payment_intent as Stripe.PaymentIntent)
        .latest_charge as Stripe.Charge;

    const receiptUrl = charge.receipt_url;

    const purchasedBooks = await db.purchasedBook.findMany({
        where: {
            userId: userId,
        },
        include: {
            book: true,
        },
        orderBy: {
            createdAt: "desc",
        },
        take: 5,
    });

    const downloadLinks = await Promise.all(
        purchasedBooks.slice(0, 3).map(async (pb) => ({
            title: pb.book.title,
            url: await getPresignedUrl(pb.book.file, 86400),
        }))
    );

    await sendEmail(
        user.email,
        env.SENDER_EMAIL,
        t("emails.receipt.title"),
        t("emails.receipt.body"),
        <Receipt
            t={t}
            name={user.name}
            receiptUrl={receiptUrl!}
            downloadLinks={downloadLinks}
        />
    );
};
