import { type NextRequest, NextResponse } from "next/server";
import { getUser } from "@/lib/auth";
import db from "@/lib/db";

export const POST = async (req: NextRequest) => {
    try {
        const user = await getUser();

        if (!user || !user.user) {
            return NextResponse.json(
                { success: false, message: "Unauthorized" },
                { status: 401 }
            );
        }

        const { items } = await req.json();

        if (!items || !Array.isArray(items)) {
            return NextResponse.json(
                { success: false, message: "Items array is required" },
                { status: 400 }
            );
        }

        for (const item of items) {
            const existingItem = await db.cart.findUnique({
                where: {
                    userId_bookId: {
                        userId: user.user.id,
                        bookId: item.bookId,
                    },
                },
            });

            if (existingItem) {
                await db.cart.update({
                    where: {
                        id: existingItem.id,
                    },
                    data: {
                        quantity: existingItem.quantity + item.quantity,
                    },
                });
            } else {
                await db.cart.create({
                    data: {
                        userId: user.user.id,
                        bookId: item.bookId,
                        quantity: item.quantity,
                    },
                });
            }
        }

        return NextResponse.json({ success: true });
    } catch (err) {
        console.error(err);
        return NextResponse.json(
            { success: false, message: "Internal server error" },
            { status: 500 }
        );
    }
};
