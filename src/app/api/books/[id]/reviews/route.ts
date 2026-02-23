import { NextRequest, NextResponse } from "next/server";
import { getUser } from "@/lib/auth";
import db from "@/lib/db";
import { CreateReviewSchema } from "@/schema/review";

export const POST = async (
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) => {
    try {
        const user = await getUser();
        if (!user || !user.user) {
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 401 }
            );
        }

        const { id: bookId } = await params;
        const body = await req.json();
        const parsed = CreateReviewSchema.safeParse(body);

        if (!parsed.success) {
            return NextResponse.json(
                { message: parsed.error.issues[0].message },
                { status: 400 }
            );
        }

        const { rating, title, content } = parsed.data;

        const existingReview = await db.review.findFirst({
            where: {
                userId: user.user.id,
                bookId,
            },
        });

        if (existingReview) {
            return NextResponse.json(
                { message: "You have already reviewed this book" },
                { status: 400 }
            );
        }

        const review = await db.review.create({
            data: {
                userId: user.user.id,
                bookId,
                rating,
                title,
                content,
                isApproved: false,
            },
        });

        return NextResponse.json(review, { status: 201 });
    } catch (error) {
        console.error("Error creating review:", error);
        return NextResponse.json(
            { message: "Something went wrong" },
            { status: 500 }
        );
    }
};
