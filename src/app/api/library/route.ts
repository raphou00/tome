import { NextResponse } from "next/server";
import { getUser } from "@/lib/auth";
import db from "@/lib/db";

export const GET = async () => {
    try {
        const user = await getUser();

        if (!user || !user.user) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const purchasedBooks = await db.purchasedBook.findMany({
            where: {
                userId: user.user.id,
            },
            include: {
                book: {
                    select: {
                        id: true,
                        title: true,
                        cover: true,
                        file: true,
                    },
                },
            },
            orderBy: {
                createdAt: "desc",
            },
        });

        return NextResponse.json({
            books: purchasedBooks,
        });
    } catch (err) {
        console.error(err);
        return NextResponse.json(
            { error: "Something went wrong" },
            { status: 500 }
        );
    }
};
