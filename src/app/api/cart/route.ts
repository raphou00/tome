import { type NextRequest, NextResponse } from "next/server";
import { getUser } from "@/lib/auth";
import db from "@/lib/db";

export const GET = async () => {
    try {
        const user = await getUser();

        if (!user || !user.user) {
            return NextResponse.json({ items: [] });
        }

        const cartItems = await db.cart.findMany({
            where: {
                userId: user.user.id,
            },
            include: {
                book: true,
            },
        });

        const items = cartItems.map((item) => ({
            id: item.bookId,
            bookId: item.bookId,
            title: item.book.title,
            cover: item.book.cover,
            price: item.book.price,
            quantity: item.quantity,
        }));

        return NextResponse.json({ items });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ items: [] });
    }
};

export const POST = async (req: NextRequest) => {
    try {
        const user = await getUser();

        if (!user || !user.user) {
            return NextResponse.json(
                { success: false, message: "Unauthorized" },
                { status: 401 }
            );
        }

        const { bookId, quantity = 1 } = await req.json();

        if (!bookId) {
            return NextResponse.json(
                { success: false, message: "Book ID is required" },
                { status: 400 }
            );
        }

        const existingItem = await db.cart.findUnique({
            where: {
                userId_bookId: {
                    userId: user.user.id,
                    bookId,
                },
            },
        });

        if (existingItem) {
            await db.cart.update({
                where: {
                    id: existingItem.id,
                },
                data: {
                    quantity: existingItem.quantity + quantity,
                },
            });
        } else {
            await db.cart.create({
                data: {
                    userId: user.user.id,
                    bookId,
                    quantity,
                },
            });
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

export const DELETE = async (req: NextRequest) => {
    try {
        const user = await getUser();

        if (!user || !user.user) {
            return NextResponse.json(
                { success: false, message: "Unauthorized" },
                { status: 401 }
            );
        }

        const { searchParams } = new URL(req.url);
        const bookId = searchParams.get("bookId");

        if (!bookId) {
            return NextResponse.json(
                { success: false, message: "Book ID is required" },
                { status: 400 }
            );
        }

        await db.cart.deleteMany({
            where: {
                userId: user.user.id,
                bookId,
            },
        });

        return NextResponse.json({ success: true });
    } catch (err) {
        console.error(err);
        return NextResponse.json(
            { success: false, message: "Internal server error" },
            { status: 500 }
        );
    }
};
