import { type NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { handleCheckout, stripe } from "@/lib/stripe";
import type Stripe from "stripe";
import env from "@/lib/env";
import db from "@/lib/db";

export const POST = async (req: NextRequest) => {
    try {
        const payload = await req.text();
        const header = await headers();
        const signature = header.get("stripe-signature") as string;

        let event: Stripe.Event;
        try {
            event = await stripe.webhooks.constructEventAsync(
                payload,
                signature,
                env.STRIPE_WEBHOOK_SECRET
            );
        } catch (err) {
            console.error("Webhook signature verification failed.", err);
            return NextResponse.json(
                { error: "Webhook signature verification failed." },
                { status: 400 }
            );
        }

        const eventData = event.data.object as Stripe.Checkout.Session;

        const customerId = eventData.metadata?.userId;
        if (!customerId) {
            console.error("Missing user id");
            return NextResponse.json(
                { error: "Missing user id" },
                { status: 400 }
            );
        }

        const user = await db.user.findUnique({
            where: {
                id: customerId.toString(),
            },
        });

        if (!user) {
            console.error("Missing user in db");
            return NextResponse.json(
                { error: "Missing user in db" },
                { status: 400 }
            );
        }

        switch (event.type) {
            case "checkout.session.completed":
                if (eventData.payment_status === "paid") {
                    await handleCheckout(eventData, user);
                }
                break;

            default:
                console.log(`Unhandled event type ${event.type}`);
        }

        return NextResponse.json({ received: true });
    } catch (err) {
        console.error(err);
        return NextResponse.json(
            { error: "Something went wrong" },
            { status: 500 }
        );
    }
};
