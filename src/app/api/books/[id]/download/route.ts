import { type NextRequest, NextResponse } from "next/server";
import { getUser } from "@/lib/auth";
import db from "@/lib/db";
import { getPresignedUrl } from "@/lib/file";
import { checkRateLimit, ratelimitPost } from "@/lib/rate-limiter";

export const GET = async (
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) => {
    try {
        const identifier = req.headers.get("x-forwarded-for");

        if (!identifier) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        const { allowed } = await checkRateLimit(identifier, ratelimitPost);
        if (!allowed) {
            return NextResponse.json(
                { error: "Too many requests" },
                { status: 429 }
            );
        }

        const { id } = await params;
        const user = await getUser();

        if (!user || !user.user) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const purchasedBook = await db.purchasedBook.findUnique({
            where: {
                userId_bookId: {
                    userId: user.user.id,
                    bookId: id,
                },
            },
            include: {
                book: true,
            },
        });

        if (!purchasedBook) {
            return NextResponse.json(
                { error: "Not purchased" },
                { status: 403 }
            );
        }

        const fileUrl = await getPresignedUrl(purchasedBook.book.file, 3600);

        return NextResponse.json({
            downloadUrl: fileUrl,
        });
    } catch (err) {
        console.error(err);
        return NextResponse.json(
            { error: "Something went wrong" },
            { status: 500 }
        );
    }
};
